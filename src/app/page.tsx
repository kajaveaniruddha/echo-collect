"use client";

import { motion } from "framer-motion";
import { AuroraBackground } from "@/components/ui/aurora-background";
import Link from "next/link";

const page = () => {
  return (
    <>
      <AuroraBackground>
        <motion.div
          initial={{ opacity: 0.0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="relative flex flex-col gap-4 items-center justify-center px-4"
        >
          <div className="text-3xl md:text-7xl font-bold dark:text-white text-center">
            Echo Collect
          </div>
          <div className="font-extralight text-base md:text-4xl dark:text-neutral-200 py-4">
            Visualize & Analyze your Feedbacks with AI.
          </div>
          <Link
            href={"/sign-in"}
            className="bg-black dark:bg-white hover:scale-105 transition-transform rounded-full w-fit text-white dark:text-black px-4 py-2"
          >
            Start Free
          </Link>
          
        </motion.div>
      </AuroraBackground>
    </>
  );
};

export default page;
