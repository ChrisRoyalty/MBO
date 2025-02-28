import React, { useState, useEffect } from "react";
import { MdFileUpload } from "react-icons/md";
import ProductImg from "../../assets/product.svg";
import { RiDeleteBinLine } from "react-icons/ri";
import { FiEdit3 } from "react-icons/fi";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";

const ProductAndServices = () => {
  const [products, setProducts] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [categoryId, setCategoryId] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newName, setNewName] = useState("");

  const { token } = useSelector((state) => state.auth);
  const BASE_URL = "https://mbo.bookbank.com.ng";

  // Fetch profile data to get categoryId
  useEffect(() => {
    if (!token) {
      toast.error("No authentication token found!");
      setLoadingProfile(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/member/my-profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
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

  // Fetch product images on component mount
  useEffect(() => {
    if (!token) return;

    const fetchProductImages = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/member/my-product-images`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data.success && response.data.data?.productImages) {
          const fetchedProducts = response.data.data.productImages.map(
            (img) => ({
              id: img.id,
              name: img.name || "Unnamed Product", // Default name if null
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

  // Handle image upload
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
        `${BASE_URL}/member/upload-images/${categoryId}`,
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
            name: "New Product",
            image: imageUrl,
          };
          setProducts((prev) => [...prev, newProduct]);
          localStorage.setItem(
            "products",
            JSON.stringify([...products, newProduct])
          );
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
    }
  };

  // Handle save edit
  const handleSaveEdit = async () => {
    if (!editingProduct || !newName.trim()) {
      toast.error("Please enter a valid name.");
      return;
    }

    try {
      const response = await axios.post(
        `${BASE_URL}/member/edit-image/${editingProduct.id}`,
        { name: newName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        toast.success(
          response.data.message || "Image name updated successfully!"
        );

        // Update state
        setProducts((prevProducts) =>
          prevProducts.map((p) =>
            p.id === editingProduct.id ? { ...p, name: newName } : p
          )
        );

        // Update localStorage
        const updatedProducts = products.map((p) =>
          p.id === editingProduct.id ? { ...p, name: newName } : p
        );
        localStorage.setItem("products", JSON.stringify(updatedProducts));

        // Reset edit state
        setEditingProduct(null);
        setNewName("");
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

  // Handle delete functionality
  const handleDelete = (productId) => {
    const updatedProducts = products.filter((p) => p.id !== productId);
    setProducts(updatedProducts);
    localStorage.setItem("products", JSON.stringify(updatedProducts));
    toast.success(`Product ${productId} deleted successfully!`);
  };

  // Loader component
  const Loader = () => (
    <div className="flex space-x-2 items-center">
      <div className="w-3 h-3 bg-[#043D12] rounded-full animate-bounce"></div>
      <div className="w-3 h-3 bg-[#043D12] rounded-full animate-bounce delay-200"></div>
      <div className="w-3 h-3 bg-[#043D12] rounded-full animate-bounce delay-400"></div>
    </div>
  );

  if (loadingProfile) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#FFFDF2]">
        <Loader />
      </div>
    );
  }

  return (
    <div className="w-full px-8 pb-8 flex flex-col gap-10 text-[#6A7368]">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="product-header flex max-md:flex-col max-md:gap-4 items-center justify-between">
        <p className="text-[16px] text-[#043D12] font-medium border-b-[1px] border-[#6A7368] px-2 py-1">
          Product & Services
        </p>
        <button
          className={`text-[14px] border-[1px] rounded-[11px] shadow px-4 py-2 flex items-center gap-2 border-[#6A7368] ${
            uploading
              ? "cursor-not-allowed opacity-50"
              : "hover:bg-[#043D12] hover:text-white"
          }`}
          onClick={() => {
            if (!uploading) {
              const fileInput = document.createElement("input");
              fileInput.type = "file";
              fileInput.accept = "image/*";
              fileInput.onchange = (e) => handleImageUpload(e.target.files[0]);
              fileInput.click();
            }
          }}
          disabled={uploading || !categoryId}
        >
          {uploading ? "Uploading..." : "Upload Image"}
          {uploading ? <Loader /> : <MdFileUpload className="text-[24px]" />}
        </button>
      </div>
      <div className="products grid lg:grid-cols-3 md:grid-cols-2 gap-8">
        {products.map((product) => (
          <figure key={product.id} className="flex flex-col gap-4">
            <div className="h-48 overflow-hidden rounded-lg">
              <img
                src={product.image}
                alt={`Product_${product.id}`}
                className="w-full h-full object-cover"
                onError={(e) => (e.target.src = ProductImg)}
              />
            </div>
            <figcaption className="flex items-center justify-between">
              <h5 className="text-[14px]">{product.name}</h5>
              <div className="flex items-center gap-2 text-[20px]">
                <FiEdit3
                  className="cursor-pointer hover:text-[#043D12]"
                  onClick={() => handleEdit(product.id)}
                />
                <RiDeleteBinLine
                  className="text-red-400 cursor-pointer hover:text-red-600"
                  onClick={() => handleDelete(product.id)}
                />
              </div>
            </figcaption>
          </figure>
        ))}
      </div>

      {/* Edit Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black/75 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Edit Image Name</h2>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full p-2 border rounded mb-4"
              placeholder="Enter new name"
            />
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => setEditingProduct(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-[#043D12] text-white rounded hover:bg-[#03280E]"
                onClick={handleSaveEdit}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductAndServices;
