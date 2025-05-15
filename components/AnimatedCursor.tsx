'use client';
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";

const AnimatedCursor: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const cursorColor = isDarkMode ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.3)"; // White for dark, black for light
  const cursorBorderColor = isDarkMode ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.5)";
  const cursorShadowColor = isDarkMode ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)";


  return (
    <motion.div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        pointerEvents: "none",
        zIndex: 1000,
        x: mousePosition.x - 25,
        y: mousePosition.y - 25,
        width: 50,
        height: 50,
        borderRadius: "50%",
        backgroundColor: cursorColor,
        border: `2px solid ${cursorBorderColor}`,
        boxShadow: `0 0 20px ${cursorShadowColor}`,
      }}
      transition={{
        duration: 2,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "loop",
      }}
    />
  );
};

export default AnimatedCursor;
