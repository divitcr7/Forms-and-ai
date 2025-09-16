"use client";
import { ArrowRight, LucideFileAxis3D } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { motion } from "motion/react";
import { ShinyTag } from "./components/shiny-tag";


export function HeroSection() {
  return (
    <section
      className="relative flex flex-col items-center justify-center py-20"
      aria-label="Form Axis Hero"
    >
      <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-black bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-orange-400 dark:bg-orange-500 opacity-20 blur-[100px]"></div>
      </div>

      <div className="space-y-6 text-center max-w-4xl px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto w-fit rounded-full border border-orange-200 dark:border-orange-900 bg-orange-50 dark:bg-orange-900/30 px-4 py-1 mb-6"
        >
          <ShinyTag>
            <LucideFileAxis3D className="h-4 w-4" />
            <span>AI-Powered💖</span>
          </ShinyTag>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-orange-800 to-gray-900 dark:from-white dark:via-orange-300 dark:to-white animate-gradient-x pb-2"
        >
         build your forms with <br className="hidden sm:block" />
          formsAI
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
        >
          Forget boring forms! Just type a prompt, share a link, and watch users
          chat their way to glory—no clipboards, no pens, just pure
          conversational magic.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap justify-center items-center gap-4 pt-4"
        >
          <Link href="/dashboard">
            <Button size="lg" className=" text-white rounded-full px-8 h-12 font-[serif] text-lg md:text-xl">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>

        </motion.div>
      </div>
    </section>
  );
}
