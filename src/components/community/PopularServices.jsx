import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProfileImg from "../../assets/profilepic.svg";
import { Link } from "react-router-dom";

// Import service images
import Service01 from "../../assets/popular01.svg";
import Service02 from "../../assets/popular02.svg";
import Service03 from "../../assets/popular03.svg";
import Service04 from "../../assets/popular04.svg";
import Service05 from "../../assets/popular05.svg";
import Service06 from "../../assets/popular06.svg";
import Service07 from "../../assets/popular07.svg";
import Service08 from "../../assets/popular08.svg";

// Services data array
const services = [
  {
    id: 1,
    img: Service01,
    name: "Graphic Design",
    category: "Creative Services",
  },
  { id: 2, img: Service02, name: "Web Development", category: "IT & Software" },
  {
    id: 3,
    img: Service03,
    name: "Content Writing",
    category: "Writing & Translation",
  },
  { id: 4, img: Service04, name: "SEO Optimization", category: "Marketing" },
  { id: 5, img: Service05, name: "Photography", category: "Creative Services" },
  {
    id: 6,
    img: Service06,
    name: "Social Media Management",
    category: "Marketing",
  },
  {
    id: 7,
    img: Service07,
    name: "UI/UX Design",
    category: "Design & Creative",
  },
  {
    id: 8,
    img: Service08,
    name: "Mobile App Development",
    category: "IT & Software",
  },
];

// Modal Component
const Modal = ({ service, onClose }) => {
  if (!service) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/75 bg-opacity-50 flex justify-center items-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-white px-8 py-10 rounded-lg shadow-lg w-[90%] md:w-[60%] flex flex-col md:flex-row gap-6 items-center"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.8 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Service Image */}
          <motion.img
            src={service.img}
            alt={service.name}
            className="w-full rounded-lg"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          />

          {/* Service Details */}
          <motion.div
            className="flex flex-col gap-4"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xl font-bold text-[#043D12]">{service.name}</h2>
            <p className="text-sm text-gray-600">{service.category}</p>
            <p className="text-gray-700">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
              lacinia odio vitae vestibulum.
            </p>

            <div className="btns flex">
              <div className="w-fit flex items-center gap-6">
                <Link
                  to="/"
                  className="border-[1px] border-[#6A7368] text-[#6A7368] rounded-[11px] text-[15px] hover:text-white px-2 lg:px-8 py-2 shadow-lg hover:bg-[#043D12]"
                >
                  View Profile
                </Link>
                <Link
                  to="/"
                  className="border-[1px] border-[#6A7368] text-[#6A7368] rounded-[11px] text-[15px] hover:text-white px-2 lg:px-8 py-2 shadow-lg hover:bg-[#043D12]"
                >
                  Contact Us
                </Link>
              </div>
            </div>

            <button
              onClick={onClose}
              className="mt-4 border-[1px] border-red-600 text-red-600 font-bold rounded-lg shadow-md py-2"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Main Component
const PopularServices = () => {
  const [selectedService, setSelectedService] = useState(null);

  return (
    <div className="w-full h-fit py-16 flex justify-center bg-[#FFFDF2]">
      <div className="w-[85%] h-fit flex flex-col gap-8">
        <h1 className="text-[#043D12] lg:text-[32px] text-[24px] font-medium">
          Popular Services
        </h1>
        <div className="w-full grid lg:grid-cols-4 grid-cols-2 max-[280px]:grid-cols-1 gap-4">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              className="flex flex-col gap-1 cursor-pointer"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => setSelectedService(service)}
            >
              <div className="profile flex items-center gap-2">
                <img src={ProfileImg} alt="Profile_Photo" />
                <p className="text-[12px] text-[#043D12]">Alex Johnson</p>
              </div>
              <figure>
                <img
                  src={service.img}
                  alt="Service_img"
                  className="rounded-lg"
                />
                <figcaption className="flex flex-col gap-4 text-[#043D12] py-2">
                  <div className="flex flex-col gap-1">
                    <b className="lg:text-[15px] text-[10px]">{service.name}</b>
                    <p className="text-[8px]">{service.category}</p>
                  </div>
                </figcaption>
              </figure>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal for Selected Service */}
      <Modal
        service={selectedService}
        onClose={() => setSelectedService(null)}
      />
    </div>
  );
};

export default PopularServices;
