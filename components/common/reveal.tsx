import { motion, Variants } from "motion/react";

export const Reveal = ({
  children,
  variants,
}: {
  children: React.ReactNode;
  variants: Variants;
}) => {
  return (
    <motion.div initial="hidden" animate="visible" variants={variants}>
      {children}
    </motion.div>
  );
};
