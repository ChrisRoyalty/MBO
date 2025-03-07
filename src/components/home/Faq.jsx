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
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("fade-in");
          } else {
            entry.target.classList.remove("fade-in");
          }
        });
      },
      { threshold: 0.5 }
    );

    faqRefs.current.forEach((el) => {
      if (el) observer.observe(el); // Ensure `el` is not null
    });
    if (imageRef.current) observer.observe(imageRef.current);

    return () => {
      faqRefs.current.forEach((el) => {
        if (el) observer.unobserve(el); // Only unobserve valid elements
      });
      if (imageRef.current) observer.unobserve(imageRef.current);
    };
  }, []);

  return (
    <div className="w-full bg-[#FAFEF4] md:py-18 py-10">
      <div className="container mx-auto px-[5vw] flex flex-col gap-10">
        <div className="intro text-center">
          <h1 className="lg:text-[40px] text-[32px] text-[#6A7368]">
            Frequently Asked Questions
          </h1>
          <p className="md:text-[20px] text-[18px] text-[#6A7368]">
            Common questions you might want to ask
          </p>
        </div>
        <div className="w-full flex flex-col lg:gap-4 gap-16 ">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-start gap-12 ">
            {/* FAQ Questions */}
            <div className="lg:order-2 lg:h-[500px] lg:overflow-y-auto">
              {faqItems.map((item, index) => (
                <figure
                  key={index}
                  className="rounded-[26px] my-6 faq-item"
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
                      className={`flex justify-between items-center ${
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
            <div
              className="lg:order-1 self-start lg:self-center max-lg:flex justify-center"
              ref={imageRef}
            >
              <img
                src={FaqIcon}
                alt="FAQ_Img"
                className="w-full max-w-[400px] fade-in"
              />
            </div>
          </div>
        </div>
      </div>
      <style>
        {`
    /* CSS for fade-in effect */
    .faq-item,
    .faq-question-container,
    .fade-in {
      opacity: 4;
      transform: translateY(30px);
      transition: opacity 0.6s ease, transform 0.6s ease;
    }

    .fade-in {
      opacity: 1;
      transform: translateY(0);
    }
  `}
      </style>
    </div>
  );
};

export default Faq;
