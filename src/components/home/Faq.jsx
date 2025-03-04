import React, { useState, useEffect, useRef } from "react";
import FaqIcon from "../../assets/faqIcon.svg";
import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";

const Faq = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const faqRefs = useRef([]);
  const imageRef = useRef(null);

  const handleToggle = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqItems = [
    {
      question: "What is MindPower Business Online (MBO)?",
      answer:
        "MBO is a platform designed for businesses within the MindPower Network to create online profiles, showcase their products and services, and connect with potential customers and other businesses.",
    },
    {
      question: "Who can register on MBO?",
      answer:
        "Anyone who owns a business can register and create a profile on the MindPower Business Platform",
    },
    {
      question: "What are the subscription fees?",
      answer: [
        "Registration Fee: ₦5,000 per year to maintain an active profile.",
        "Promotion Fee: ₦10,000 per year to boost visibility.",
        "Total: ₦15,000 annually.",
      ],
    },
    {
      question: "How can I make payments?",
      answer:
        "Payments can be made via bank transfer or any online payment method specified during registration.",
    },
    {
      question: "Can I cancel my subscription?",
      answer: "Yes, you can cancel at any time, but fees are non-refundable.",
    },
    {
      question: "What features does MBO offer for my business?",
      answer: [
        "Business profile with contact details.",
        "Product/service gallery.",
        "Social media and WhatsApp integration.",
        "Visitor analytics to track profile performance.",
      ],
    },
    {
      question: "Can I upload videos to my profile?",
      answer:
        "Yes, you can embed YouTube videos to showcase your business visually.",
    },
    {
      question: "Can I process payments directly through MBO?",
      answer:
        "No, payment processing is not available. Customers can contact you via WhatsApp to arrange payments.",
    },
    {
      question: "What happens if I forget my password?",
      answer:
        'Use the "Forgot Password" option to reset it via your registered email.',
    },
    {
      question: "Can I update my business information after registration?",
      answer:
        "Yes, you can edit your profile details anytime from your dashboard.",
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, idx) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
            entry.target.style.transitionDelay = `${idx * 0.15}s`;
          } else {
            entry.target.classList.remove("animate-in");
            entry.target.style.transitionDelay = "0s";
          }
        });
      },
      { threshold: 0.3 }
    );

    faqRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });
    if (imageRef.current) observer.observe(imageRef.current);

    return () => {
      faqRefs.current.forEach((el) => {
        if (el) observer.unobserve(el);
      });
      if (imageRef.current) observer.unobserve(imageRef.current);
    };
  }, []);

  return (
    <div className="w-full flex justify-center items-center bg-[#FAFEF4] py-18">
      <div className="w-[85%] flex flex-col gap-10">
        <div className="intro text-center">
          <h1 className="lg:text-[40px] text-[32px] text-[#6A7368] font-semibold">
            Frequently Asked Questions
          </h1>
          <p className="md:text-[20px] text-[18px] text-[#6A7368] mt-2">
            Common questions you might want to ask
          </p>
        </div>
        <div className="w-full flex flex-col lg:gap-4 gap-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-start gap-12">
            {/* FAQ Questions */}
            <div className="lg:order-2 lg:h-[60vh] lg:overflow-y-auto custom-scrollbar">
              {faqItems.map((item, index) => (
                <figure
                  key={index}
                  className={`faq-item rounded-[26px] my-6 shadow-sm transition-all duration-300 hover:translate-y-[-3px] hover:shadow-md ${
                    activeIndex === index ? "bg-[#B5BBB4]" : "bg-transparent"
                  }`}
                  ref={(el) => (faqRefs.current[index] = el)}
                >
                  <button
                    className={`flex justify-between items-center w-full px-6 py-4 gap-4 text-[24px] font-medium transition-all duration-300 ${
                      activeIndex === index
                        ? "bg-[#043D12] text-white rounded-t-[26px]"
                        : "bg-[#B5BBB4] text-[#043D12] rounded-[26px] hover:bg-[#043D12]/80 hover:text-white"
                    }`}
                    onClick={() => handleToggle(index)}
                  >
                    {item.question}
                    {activeIndex === index ? (
                      <RiArrowDropUpLine className="text-[30px] transform transition-transform duration-300" />
                    ) : (
                      <RiArrowDropDownLine className="text-[30px] transform transition-transform duration-300" />
                    )}
                  </button>
                  <figcaption
                    className={`faq-answer overflow-hidden transition-all duration-500 ease-in-out ${
                      activeIndex === index
                        ? "max-h-[400px] opacity-100 px-6 py-4 bg-[#B5BBB4] rounded-b-[26px]"
                        : "max-h-0 opacity-0 px-6 py-0 bg-[#B5BBB4]"
                    }`}
                  >
                    {Array.isArray(item.answer) ? (
                      <ul className="list-disc pl-6 text-[20px] text-[#043D12]">
                        {item.answer.map((listItem, liIndex) => (
                          <li key={liIndex} className="mt-2">
                            {listItem}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-[20px] text-[#043D12]">
                        {item.answer}
                      </p>
                    )}
                  </figcaption>
                </figure>
              ))}
            </div>
            {/* FAQ Image */}
            <div
              className="lg:order-1 self-start lg:self-center max-lg:flex justify-center"
              ref={imageRef}
            >
              <img
                src={FaqIcon}
                alt="FAQ_Img"
                className="w-full max-w-[400px] animate-in"
              />
            </div>
          </div>
        </div>
      </div>
      <style>
        {`
          /* Animation for elements entering view */
          .faq-item, .animate-in {
            opacity: 0;
            transform: translateY(30px) scale(0.98);
            transition: opacity 0.7s ease-out, transform 0.7s ease-out;
          }

          .animate-in {
            opacity: 1;
            transform: translateY(0) scale(1);
          }

          /* Specific animation for the image */
          img.animate-in {
            transition: opacity 0.9s ease-out, transform 0.9s ease-out;
            transform: translateY(0) scale(1);
          }

          img {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }

          /* Custom scrollbar */
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }

          .custom-scrollbar::-webkit-scrollbar-track {
            background: #FAFEF4;
            border-radius: 3px;
          }

          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #043D12;
            border-radius: 3px;
          }

          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #03280E;
          }
        `}
      </style>
    </div>
  );
};

export default Faq;
