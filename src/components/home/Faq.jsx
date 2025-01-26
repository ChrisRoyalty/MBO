import React, { useState } from "react";
import FaqIcon from "../../assets/faqIcon.svg";
import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";

const Faq = () => {
  const [activeIndex, setActiveIndex] = useState(null);

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
        "Only members of the MindPower Network are eligible to create business profiles on the platform.",
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
    <div className="w-full flex justify-center items-center bg-[#FAFEF4] py-18">
      <div className="w-[90%] flex flex-col gap-10">
        <div className="intro text-center">
          <h1 className="lg:text-[40px] text-[32px] text-[#043D1266]">
            Frequently Asked Questions{" "}
          </h1>
          <p className="md:text-[20px] text-[18px]">
            Common questions you might want to ask{" "}
          </p>
        </div>
        <div className="w-full flex flex-col lg:gap-4 gap-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-start gap-4">
            {/* FAQ Buttons */}
            <div className="lg:order-2">
              {faqItems.map((item, index) => (
                <figure
                  key={index}
                  className={`rounded-[26px] mb-4 ${
                    activeIndex === index ? "bg-[#B5BBB4]" : "bg-transparent"
                  }`}
                >
                  <button
                    className={`flex justify-between items-center ${
                      activeIndex === index
                        ? "bg-[#043D12] text-white"
                        : "bg-[#B5BBB4] text-[#043D12]"
                    } rounded-[26px] px-6 py-4 gap-4 w-full`}
                    onClick={() => handleToggle(index)}
                  >
                    {item.question}
                    {activeIndex === index ? (
                      <RiArrowDropUpLine className="text-[30px]" />
                    ) : (
                      <RiArrowDropDownLine className="text-[30px]" />
                    )}
                  </button>
                  <figcaption
                    className={`p-6 ${
                      activeIndex === index ? "block" : "hidden"
                    }`}
                  >
                    {Array.isArray(item.answer) ? (
                      <ul className="list-disc pl-6 text-[21px] text-[#043D12]">
                        {item.answer.map((listItem, liIndex) => (
                          <li key={liIndex}>{listItem}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-[21px] text-[#043D12]">
                        {item.answer}
                      </p>
                    )}
                  </figcaption>
                </figure>
              ))}
            </div>
            {/* FAQ Image */}
            <div className="lg:order-1 self-start lg:self-center">
              <img
                src={FaqIcon}
                alt="FAQ_Img"
                className="w-full max-w-[400px]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Faq;
