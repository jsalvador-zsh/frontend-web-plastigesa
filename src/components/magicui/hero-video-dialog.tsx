"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { Play, XIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type AnimationStyle =
  | "from-bottom"
  | "from-center"
  | "from-top"
  | "from-left"
  | "from-right"
  | "fade"
  | "top-in-bottom-out"
  | "left-in-right-out";

interface HeroVideoProps {
  animationStyle?: AnimationStyle;
  videoSrc: string;
  thumbnailSrc: string;
  thumbnailAlt?: string;
  className?: string;
}

const animationVariants = {
  "from-bottom": {
    initial: { y: "100%", opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: "100%", opacity: 0 },
  },
  "from-center": {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.8, opacity: 0 },
  },
  "from-top": {
    initial: { y: "-100%", opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: "-100%", opacity: 0 },
  },
  "from-left": {
    initial: { x: "-100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "-100%", opacity: 0 },
  },
  "from-right": {
    initial: { x: "100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "100%", opacity: 0 },
  },
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  "top-in-bottom-out": {
    initial: { y: "-100%", opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: "100%", opacity: 0 },
  },
  "left-in-right-out": {
    initial: { x: "-100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "100%", opacity: 0 },
  },
};

export default function HeroVideoDialog({
  animationStyle = "from-center",
  videoSrc,
  thumbnailSrc,
  thumbnailAlt = "Video thumbnail",
  className,
}: HeroVideoProps) {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const selectedAnimation = animationVariants[animationStyle];
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Bloquear scroll cuando el video está abierto
  useEffect(() => {
    if (isVideoOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isVideoOpen]);

  return (
    <div className={cn("relative", className)}>
      <div
        className="group relative cursor-pointer"
        onClick={() => setIsVideoOpen(true)}
      >
        <img
          src={thumbnailSrc}
          alt={thumbnailAlt}
          width={1920}
          height={1080}
          className="w-full rounded-xl border-0 shadow-lg transition-all duration-400 ease-out group-hover:brightness-[0.8] object-cover"
        />
        <div className="absolute inset-0 flex scale-[0.9] items-center justify-center rounded-2xl transition-all duration-400 ease-out group-hover:scale-100">
          <div className="flex size-24 md:size-28 items-center justify-center rounded-full bg-green-500/20 backdrop-blur-md">
            <div
              className={`relative flex size-16 md:size-20 scale-100 items-center justify-center rounded-full bg-gradient-to-tr from-green-600 to-emerald-400 shadow-xl shadow-green-900/20 transition-all duration-300 ease-out group-hover:scale-110`}
            >
              <Play
                className="size-8 scale-100 fill-white text-white transition-transform duration-300 ease-out group-hover:scale-110 ml-1"
                style={{
                  filter:
                    "drop-shadow(0 4px 3px rgb(0 0 0 / 0.15))",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {mounted && createPortal(
        <AnimatePresence>
          {isVideoOpen && (
            <div className="fixed inset-0 z-[99999] flex items-center justify-center">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsVideoOpen(false)}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
              />

              {/* Modal Content */}
              <motion.div
                {...selectedAnimation}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="relative z-10 mx-4 aspect-video w-full max-w-5xl md:mx-0 shadow-2xl"
              >
                <motion.button
                  onClick={() => setIsVideoOpen(false)}
                  className="absolute -top-12 md:-top-16 right-0 rounded-full bg-white/10 hover:bg-white/20 p-2 md:p-3 text-white ring-1 ring-white/30 backdrop-blur-md transition-colors"
                >
                  <XIcon className="size-5 md:size-6" />
                </motion.button>
                <div className="relative isolate z-[1] size-full overflow-hidden rounded-2xl border border-white/20 bg-black">
                  <iframe
                    src={videoSrc}
                    className="size-full rounded-2xl"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share fullscreen"
                  ></iframe>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
