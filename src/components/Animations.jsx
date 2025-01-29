const Animations = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1 } },
  },
  slideLeft: {
    hidden: { x: -100, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 50 },
    },
  },
  slideRight: {
    hidden: { x: 100, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 50 },
    },
  },
  slideTop: {
    hidden: { y: -100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 50 },
    },
  },
  slideBottom: {
    hidden: { y: 100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 50 },
    },
  },
  scaleUp: {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 0.5 } },
  },
  rotate: {
    hidden: { rotate: -180, opacity: 0 },
    visible: { rotate: 0, opacity: 1, transition: { duration: 1 } },
  },
  bounce: {
    hidden: { y: 0 },
    visible: {
      y: [0, -15, 0],
      transition: { duration: 0.5, repeat: Infinity },
    },
  },
  staggerContainer: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.3 } },
  },
  buttonHover: {
    hover: { scale: 1.1, transition: { type: "spring", stiffness: 300 } },
  },
  buttonTap: { tap: { scale: 0.9 } },
};

export default Animations;
