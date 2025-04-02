import React, { useState, useEffect } from "react";
import { MdFileUpload } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";
import { FiEdit3 } from "react-icons/fi";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import NoProductsImg from "../../assets/NotAvailable.svg";
import EditHeader from "./EditHeader";

const ProductAndServices = () => {
  const [products, setProducts] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [categoryId, setCategoryId] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newName, setNewName] = useState("");
  const [isNewUpload, setIsNewUpload] = useState(false); // Track if it's a new upload
  const [deleteConfirmProduct, setDeleteConfirmProduct] = useState(null); // Track product to delete

  const { token } = useSelector((state) => state.auth);

  // Fetch profile data to get categoryId
  useEffect(() => {
    if (!token) {
      toast.error("No authentication token found!");
      setLoadingProfile(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/member/my-profile`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.data?.success && response.data?.data) {
          const profile = response.data.data;
          setCategoryId(profile.categories?.[0]?.id || null);
          if (!profile.categories?.[0]?.id) {
            toast.warn("No category ID found in profile. Upload may fail.");
          }
        } else {
          toast.error("No profile data found in the response.");
        }
      } catch (error) {
        console.error("❌ Error Fetching Profile:", error);
        toast.error(
          error.response?.data?.message || "Failed to fetch profile data."
        );
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfile();
  }, [token]);

  // Fetch product images
  useEffect(() => {
    if (!token) return;

    const fetchProductImages = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/member/my-product-images`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.success && response.data.data?.productImages) {
          const fetchedProducts = response.data.data.productImages.map(
            (img) => ({
              id: img.id,
              name: img.name || "Unnamed Product",
              image: img.imageUrl,
            })
          );
          setProducts(fetchedProducts);
          localStorage.setItem("products", JSON.stringify(fetchedProducts));
        } else {
          toast.error("No product images found in the response.");
        }
      } catch (error) {
        console.error("❌ Error Fetching Product Images:", error);
        toast.error(
          error.response?.data?.message || "Failed to fetch product images."
        );
      }
    };

    fetchProductImages();
  }, [token]);

  // Handle image upload and trigger edit modal
  const handleImageUpload = async (file) => {
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file.");
      return;
    }

    if (!token || !categoryId) {
      toast.error(
        !token ? "Authentication token missing!" : "Category ID not available."
      );
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("images", file);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/member/upload-images/${categoryId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message || "Image uploaded successfully!");
        const imageUrl = response.data.images?.[0]?.imageUrl;
        if (imageUrl) {
          const newProduct = {
            id: response.data.images[0].id,
            name: "New Product", // Default name
            image: imageUrl,
          };
          setProducts((prev) => [...prev, newProduct]);
          localStorage.setItem(
            "products",
            JSON.stringify([...products, newProduct])
          );
          // Trigger edit modal for new upload
          setEditingProduct(newProduct);
          setNewName(""); // Empty input for naming
          setIsNewUpload(true); // Mark as new upload
        }
      } else {
        toast.error(response.data.error || "Failed to upload image.");
      }
    } catch (error) {
      console.error("❌ Error Uploading Image:", error);
      toast.error(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to upload image."
      );
    } finally {
      setUploading(false);
    }
  };

  // Handle edit functionality
  const handleEdit = (productId) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      setEditingProduct(product);
      setNewName(product.name);
      setIsNewUpload(false); // Not a new upload, so edit mode
    }
  };

  // Handle save edit
  const handleSaveEdit = async () => {
    if (!editingProduct || !newName.trim()) {
      toast.error("Please enter a valid name.");
      return;
    }

    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BASE_URL}/member/edit-image/${
          editingProduct.id
        }`,
        { name: newName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        toast.success("Image name updated successfully!");
        setProducts((prevProducts) =>
          prevProducts.map((p) =>
            p.id === editingProduct.id ? { ...p, name: newName } : p
          )
        );
        localStorage.setItem(
          "products",
          JSON.stringify(
            products.map((p) =>
              p.id === editingProduct.id ? { ...p, name: newName } : p
            )
          )
        );
        setEditingProduct(null);
        setNewName("");
        setIsNewUpload(false);
      } else {
        toast.error(response.data.error || "Failed to update image name.");
      }
    } catch (error) {
      console.error("❌ Error Updating Image Name:", error);
      toast.error(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to update image name."
      );
    }
  };

  // Handle delete confirmation
  const handleDeleteConfirm = (productId) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      setDeleteConfirmProduct(product);
    }
  };

  // Handle delete functionality
  const handleDelete = async () => {
    if (!token || !deleteConfirmProduct) {
      toast.error("Authentication token missing or no product selected!");
      return;
    }

    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/member/delete-image/${
          deleteConfirmProduct.id
        }`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success("Product deleted successfully!");
        const updatedProducts = products.filter(
          (p) => p.id !== deleteConfirmProduct.id
        );
        setProducts(updatedProducts);
        localStorage.setItem("products", JSON.stringify(updatedProducts));
        setDeleteConfirmProduct(null); // Close modal
      } else {
        toast.error(response.data.error || "Failed to delete product.");
      }
    } catch (error) {
      console.error("❌ Error Deleting Product:", error);
      toast.error(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to delete product."
      );
    }
  };

  // Loader component
  const Loader = () => (
    <div className="flex space-x-2 items-center">
      <div className="w-3 h-3 bg-[#043D12] rounded-full animate-pulse"></div>
      <div className="w-3 h-3 bg-[#043D12] rounded-full animate-pulse delay-200"></div>
      <div className="w-3 h-3 bg-[#043D12] rounded-full animate-pulse delay-400"></div>
    </div>
  );

  if (loadingProfile) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-[#FAFEF4] to-white">
        <Loader />
      </div>
    );
  }

  return (
    <div className="w-full pb-8 flex flex-col gap-10 text-[#6A7368] bg-gradient-to-br from-[#FAFEF4] to-white min-h-screen">
      <EditHeader />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      <div className="container px-[5vw] mx-auto">
        <div className="product-header flex max-md:flex-col max-md:gap-4 items-center justify-between mb-8">
          <p className="text-[18px] text-[#043D12] font-semibold border-b-2 border-[#043D12] px-3 py-1 transition-all">
            Product & Services
          </p>
          <button
            className={`text-[14px] border-[1px] rounded-full shadow px-5 py-2.5 flex items-center gap-2 border-[#043D12] bg-[#043D12] text-white hover:bg-[#03280E] transition-all duration-300 ${
              uploading ? "cursor-not-allowed opacity-60" : ""
            }`}
            onClick={() => {
              if (!uploading) {
                const fileInput = document.createElement("input");
                fileInput.type = "file";
                fileInput.accept = "image/*";
                fileInput.onchange = (e) =>
                  handleImageUpload(e.target.files[0]);
                fileInput.click();
              }
            }}
            disabled={uploading || !categoryId}
          >
            {uploading ? "Uploading..." : "Add New Product"}
            {uploading ? <Loader /> : <MdFileUpload className="text-[22px]" />}
          </button>
        </div>

        {/* Products Grid with Empty State */}
        {products.length > 0 ? (
          <div className="products grid lg:grid-cols-3 md:grid-cols-2 gap-8">
            {products.map((product) => (
              <figure
                key={product.id}
                className="flex flex-col gap-4 group relative overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="h-48 overflow-hidden rounded-t-xl">
                  <img
                    src={product.image}
                    alt={`Product_${product.id}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => (e.target.src = NoProductsImg)}
                  />
                </div>
                <figcaption className="flex items-center justify-between px-4 py-2 bg-white">
                  <h5 className="text-[14px] font-medium text-[#043D12]">
                    {product.name}
                  </h5>
                  <div className="flex items-center gap-3 text-[20px]">
                    <FiEdit3
                      className="cursor-pointer text-[#6A7368] hover:text-[#043D12] transition-colors"
                      onClick={() => handleEdit(product.id)}
                    />
                    <RiDeleteBinLine
                      className="text-red-400 cursor-pointer hover:text-red-600 transition-colors"
                      onClick={() => handleDeleteConfirm(product.id)}
                    />
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-6 border-2 border-dashed border-[#043D12] rounded-xl bg-white shadow-sm">
            <div className="w-48 h-48 mb-6">
              <img
                src={NoProductsImg}
                alt="No products"
                className="w-full h-full object-contain opacity-80"
              />
            </div>
            <h3 className="text-2xl font-semibold text-[#043D12] mb-3">
              No Products Yet
            </h3>
            <p className="text-center text-[#6A7368] mb-6 max-w-md">
              Showcase your amazing products and services. Upload your first
              product to kick things off!
            </p>
            <button
              className="text-[14px] border-[1px] rounded-full shadow px-6 py-3 flex items-center gap-2 border-[#043D12] bg-[#043D12] text-white hover:bg-[#03280E] transition-all duration-300"
              onClick={() => {
                if (!uploading) {
                  const fileInput = document.createElement("input");
                  fileInput.type = "file";
                  fileInput.accept = "image/*";
                  fileInput.onchange = (e) =>
                    handleImageUpload(e.target.files[0]);
                  fileInput.click();
                }
              }}
              disabled={uploading || !categoryId}
            >
              {uploading ? "Uploading..." : "Upload Your First Product"}
              {uploading ? (
                <Loader />
              ) : (
                <MdFileUpload className="text-[22px]" />
              )}
            </button>
          </div>
        )}

        {/* Edit Modal with dynamic title and buttons */}
        {editingProduct && (
          <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 animate-fade-in">
            <div className="bg-white p-6 rounded-2xl w-96 max-w-[90%] shadow-2xl transform transition-all duration-300 scale-100 hover:scale-105">
              <h2 className="text-xl font-semibold text-[#043D12] mb-4">
                {isNewUpload ? "Name Your Product" : "Edit Product Name"}
              </h2>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full p-3 border border-[#6A7368]/30 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-[#043D12] transition-all"
                placeholder="Enter product name"
                autoFocus
              />
              <div className="flex justify-end gap-3">
                <button
                  className="px-5 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                  onClick={() => setEditingProduct(null)}
                >
                  {isNewUpload ? "Skip" : "Cancel"}
                </button>
                <button
                  className="px-5 py-2 bg-[#043D12] text-white rounded-lg hover:bg-[#03280E] transition-colors duration-200"
                  onClick={handleSaveEdit}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirmProduct && (
          <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 animate-fade-in">
            <div className="bg-white p-6 rounded-2xl w-96 max-w-[90%] shadow-2xl transform transition-all duration-300 scale-100 hover:scale-105">
              <h2 className="text-xl font-semibold text-[#043D12] mb-4">
                Confirm Deletion
              </h2>
              <p className="text-[#6A7368] mb-4">
                Are you sure you want to delete "{deleteConfirmProduct.name}"?
                This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  className="px-5 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                  onClick={() => setDeleteConfirmProduct(null)}
                >
                  Cancel
                </button>
                <button
                  className="px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductAndServices;
