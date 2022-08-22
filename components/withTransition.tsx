/* eslint-disable react/display-name */
import { AnimatePresence, motion } from "framer-motion";

const variants = {
  hidden: { opacity: 0, x: -100, y: 0 },
  enter: { opacity: 1, x: 0, y: 0 },
  exit: { opacity: 0, x: 0, y: -100 },
}

// note: followed guide at
// https://wallis.dev/blog/nextjs-page-transitions-with-framer-motion
export default function withTransition<T>(Component: React.ComponentType<T>) {
  return (props: T) => (
    <AnimatePresence exitBeforeEnter>
      <motion.main
        variants={variants} // Pass the variant object into Framer Motion
        initial="hidden" // Set the initial state to variants.hidden
        animate="enter" // Animated state to variants.enter
        exit="exit" // Exit state (used later) to variants.exit
        transition={{ type: 'easeInOut', duration: 0.3 }} // Set the transition to linear
        className=""
      >
        <Component {...props} />
      </motion.main>
    </AnimatePresence>
  );
}
