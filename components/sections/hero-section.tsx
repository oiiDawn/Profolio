"use client";

import { motion } from "framer-motion";

import { fadeInUp } from "@/lib/motion-variants";

export function HeroSection() {
  return (
    <section
      id="home"
      className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 py-16 sm:px-8 sm:py-24"
    >
      <motion.div {...fadeInUp} className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground mb-4">
          welcome
        </p>
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          嗨，我是 oii
        </h1>
        <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
          这是我的个人空间，放我折腾的项目、走过的路，和脑子里冒出来的想法。
        </p>
      </motion.div>
    </section>
  );
}
