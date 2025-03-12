import React, { useState, useRef } from "react";
import FaqIcon from "../../assets/faq.png";
import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";

const Faq = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const faqRefs = useRef([]);

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

  return (
    <div className="w-full bg-[#FFFDF2] md:py-18 py-10">
      <div className="container mx-auto px-[5vw] flex flex-col gap-10">
        <div className="w-full flex flex-col lg:gap-4 gap-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-start gap-12">
            {/* FAQ Questions */}
            <div className="order-2 lg:h-[500px] lg:overflow-y-auto modern-scrollbar lg:pr-4 lg:py-8">
              {faqItems.map((item, index) => (
                <figure
                  key={index}
                  className="rounded-[26px] my-6"
                  ref={(el) => (faqRefs.current[index] = el)}
                >
                  <div
                    className={`faq-question-container ${
                      activeIndex === index
                        ? "bg-[#B5BBB4] rounded-t-[26px]"
                        : "bg-transparent"
                    }`}
                  >
                    <button
                      className={`flex justify-between items-center text-start ${
                        activeIndex === index
                          ? "bg-[#043D12] text-white"
                          : "bg-[#B5BBB4] text-[#043D12]"
                      } rounded-[26px] px-6 py-4 gap-4 w-full md:text-[24px] text-[18px]`}
                      onClick={() => handleToggle(index)}
                    >
                      {item.question}
                      {activeIndex === index ? (
                        <RiArrowDropUpLine className="text-[30px]" />
                      ) : (
                        <RiArrowDropDownLine className="text-[30px]" />
                      )}
                    </button>
                  </div>
                  <figcaption
                    className={`p-6 ${
                      activeIndex === index
                        ? "block bg-[#B5BBB4] mt-4 rounded-b-[26px]"
                        : "hidden"
                    }`}
                  >
                    {Array.isArray(item.answer) ? (
                      <ul className="list-disc pl-6 md:text-[20px] text-[16px] text-[#043D12]">
                        {item.answer.map((listItem, liIndex) => (
                          <li key={liIndex}>{listItem}</li>
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
            <div className="order-1 self-start lg:self-center flex flex-col justify-center items-center gap-8">
              <div className="intro max-lg:text-center">
                <h1 className="lg:text-[40px] text-[30px] text-[#6A7368]">
                  Frequently Asked Questions
                </h1>
                <p className="md:text-[20px] text-[18px] text-[#6A7368]">
                  Common questions you might want to ask
                </p>
              </div>
              <img
                src={FaqIcon}
                alt="FAQ_Img"
                className="w-full max-w-[400px]"
              />
            </div>
          </div>
        </div>
      </div>
      <style>
        {`
          /* Modern, tiny scrollbar styling with space */
          .modern-scrollbar::-webkit-scrollbar {
            width: 6px; /* Very thin scrollbar */
          }

          .modern-scrollbar::-webkit-scrollbar-track {
            background: #f1f1f1; /* Light track */
            border-radius: 10px;
          }

          .modern-scrollbar::-webkit-scrollbar-thumb {
            background: #043D121A; /* Semi-transparent dark green */
            border-radius: 10px;
          }

          .modern-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #6A7368; /* Lighter hover effect */
          }

          /* Firefox scrollbar styling */
          .modern-scrollbar {
            scrollbar-width: thin; /* Thin scrollbar */
            scrollbar-color: #043D121A #f1f1f1; /* Thumb and track colors */
          }
        `}
      </style>
    </div>
  );
};

export default Faq;
