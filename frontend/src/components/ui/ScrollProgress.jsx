import { useScroll, motion } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-brand-red via-brand-gold-mid to-brand-red z-[9998] origin-left"
      style={{ scaleX: scrollYProgress }}
    />
  );
}
