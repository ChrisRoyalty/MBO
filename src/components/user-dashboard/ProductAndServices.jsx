import React from "react";
import { MdFileUpload } from "react-icons/md";
import ProductImg from "../../assets/product.svg";
import { RiDeleteBinLine } from "react-icons/ri";
import { FiEdit3 } from "react-icons/fi";

const ProductAndServices = () => {
  return (
    <div className="w-full px-8 pb-8 flex flex-col gap-10 text-[#6A7368]">
      <div className="product-header flex max-md:flex-col max-md:gap-4 items-center justify-between">
        <p className="text-[16px] text-[#043D12] font-medium border-b-[1px] border-[#6A7368] px-2 py-1">
          Product & Services
        </p>
        <button className="text-[14px] border-[1px] rounded-[11px] shadow px-4 py-2 flex items-center gap-2 border-[#6A7368] hover:bg-[#043D12] hover:text-white">
          Upload Image
          <MdFileUpload className="text-[24px]" />
        </button>
      </div>
      <div className="products grid lg:grid-cols-3 md:grid-cols-2 gap-8">
        {/* grid container */}
        <figure className="flex flex-col gap-4">
          <img src={ProductImg} alt="Product_Image" className="w-full" />
          <figcaption className="flex items-center justify-between">
            <h5 className="text-[14px]">Real Estate</h5>
            <div className="flex items-center gap-2 text-[20px]">
              <FiEdit3 className="cursor-pointer" />
              <RiDeleteBinLine className="text-red-400 cursor-pointer" />
            </div>
          </figcaption>
        </figure>
        {/* grid container */}
        <figure className="flex flex-col gap-4">
          <img src={ProductImg} alt="Product_Image" className="w-full" />
          <figcaption className="flex items-center justify-between">
            <h5 className="text-[14px]">Real Estate</h5>
            <div className="flex items-center gap-2 text-[20px]">
              <FiEdit3 className="cursor-pointer" />
              <RiDeleteBinLine className="text-red-400 cursor-pointer" />
            </div>
          </figcaption>
        </figure>
        {/* grid container */}
        <figure className="flex flex-col gap-4">
          <img src={ProductImg} alt="Product_Image" className="w-full" />
          <figcaption className="flex items-center justify-between">
            <h5 className="text-[14px]">Real Estate</h5>
            <div className="flex items-center gap-2 text-[20px]">
              <FiEdit3 className="cursor-pointer" />
              <RiDeleteBinLine className="text-red-400 cursor-pointer" />
            </div>
          </figcaption>
        </figure>
        {/* grid container */}
        <figure className="flex flex-col gap-4">
          <img src={ProductImg} alt="Product_Image" className="w-full" />
          <figcaption className="flex items-center justify-between">
            <h5 className="text-[14px]">Real Estate</h5>
            <div className="flex items-center gap-2 text-[20px]">
              <FiEdit3 className="cursor-pointer" />
              <RiDeleteBinLine className="text-red-400 cursor-pointer" />
            </div>
          </figcaption>
        </figure>
        {/* grid container */}
        <figure className="flex flex-col gap-4">
          <img src={ProductImg} alt="Product_Image" className="w-full" />
          <figcaption className="flex items-center justify-between">
            <h5 className="text-[14px]">Real Estate</h5>
            <div className="flex items-center gap-2 text-[20px]">
              <FiEdit3 className="cursor-pointer" />
              <RiDeleteBinLine className="text-red-400 cursor-pointer" />
            </div>
          </figcaption>
        </figure>
        {/* grid container */}
        <figure className="flex flex-col gap-4">
          <img src={ProductImg} alt="Product_Image" className="w-full" />
          <figcaption className="flex items-center justify-between">
            <h5 className="text-[14px]">Real Estate</h5>
            <div className="flex items-center gap-2 text-[20px]">
              <FiEdit3 className="cursor-pointer" />
              <RiDeleteBinLine className="text-red-400 cursor-pointer" />
            </div>
          </figcaption>
        </figure>
        {/* grid container */}
        <figure className="flex flex-col gap-4">
          <img src={ProductImg} alt="Product_Image" className="w-full" />
          <figcaption className="flex items-center justify-between">
            <h5 className="text-[14px]">Real Estate</h5>
            <div className="flex items-center gap-2 text-[20px]">
              <FiEdit3 className="cursor-pointer" />
              <RiDeleteBinLine className="text-red-400 cursor-pointer" />
            </div>
          </figcaption>
        </figure>
        {/* grid container */}
        <figure className="flex flex-col gap-4">
          <img src={ProductImg} alt="Product_Image" className="w-full" />
          <figcaption className="flex items-center justify-between">
            <h5 className="text-[14px]">Real Estate</h5>
            <div className="flex items-center gap-2 text-[20px]">
              <FiEdit3 className="cursor-pointer" />
              <RiDeleteBinLine className="text-red-400 cursor-pointer" />
            </div>
          </figcaption>
        </figure>

        {/* grid container */}
        <figure className="flex flex-col gap-4">
          <img src={ProductImg} alt="Product_Image" className="w-full" />
          <figcaption className="flex items-center justify-between">
            <h5 className="text-[14px]">Real Estate</h5>
            <div className="flex items-center gap-2 text-[20px]">
              <FiEdit3 className="cursor-pointer" />
              <RiDeleteBinLine className="text-red-400 cursor-pointer" />
            </div>
          </figcaption>
        </figure>
      </div>
    </div>
  );
};

export default ProductAndServices;
