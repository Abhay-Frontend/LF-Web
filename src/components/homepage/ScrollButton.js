"use client";

import { useEffect, useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

const ScrollButtons = () => {
  const [showTop, setShowTop] = useState(false);
  const [showBottom, setShowBottom] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;

      // Show top button after scrolling down
      setShowTop(scrollTop > 300);

      // Show bottom button only if NOT at bottom
      setShowBottom(scrollTop + windowHeight < docHeight - 10);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // run once on mount

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  };

  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
      {/* Scroll to Top */}
      {showTop && (
        <button
          onClick={scrollToTop}
          className="group w-12 h-12 flex items-center justify-center rounded-full
          bg-zinc-900 backdrop-blur-md border border-white/20
          shadow-lg transition-all duration-300
          hover:scale-110 hover:bg-white/40"
        >
          <ChevronUp className="w-6 h-6 text-white group-hover:-translate-y-0.5 transition" />
        </button>
      )}

      {/* Scroll to Bottom */}
      {showBottom && (
        <button
          onClick={scrollToBottom}
          className="group w-12 h-12 flex items-center justify-center rounded-full
          bg-zinc-900 backdrop-blur-md border border-white/20
          shadow-lg transition-all duration-300
          hover:scale-110 hover:bg-white/40"
        >
          <ChevronDown className="w- h-9 text-white group-hover:translate-y-0.5 transition" />
        </button>
      )}
    </div>
  );
};

export default ScrollButtons;
