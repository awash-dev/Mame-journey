"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface SkillData {
  name: string;
}

const skillsData: SkillData[] = [
  { name: "Computer Science" },
  { name: "Marketing" },
  { name: "Finance" },
  { name: "Data Analysis" },
];

const About = () => {
  return (
    <section className="mt-20">
      <div
        className={cn(
          "container mx-auto px-6 py-12 w-full",
          "flex flex-col md:flex-row items-center gap-12"
        )}
      >
        {/* Image Section */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="w-full md:w-1/2 flex justify-center"
        >
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-[40px] blur opacity-40"></div>
            <img
              src="/About.jpg"
              alt="About Me"
              className={cn(
                "relative rounded-[40px] w-[220px] sm:w-[260px] md:w-[300px] h-[280px] object-cover",
                "shadow-xl border-4 border-white dark:border-gray-800"
              )}
            />
          </div>
        </motion.div>

        {/* Text Section */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="w-full md:w-1/2 space-y-6"
        >
          <h2
            className={cn(
              "text-3xl md:text-4xl font-bold text-transparent bg-clip-text",
              "bg-gradient-to-r from-purple-400 to-pink-600",
              "text-center md:text-left"
            )}
          >
            About Me
          </h2>

          <p
            className={cn(
              "text-gray-700 dark:text-gray-300 leading-relaxed",
              "text-base sm:text-lg text-center md:text-left"
            )}
          >
            Hello! I'm <span className="font-semibold">Mohammed</span>, a
            passionate software developer with a strong focus on creating
            engaging and performant web experiences. I specialize in the{" "}
            <span className="font-medium">JavaScript</span> ecosystem &{" "}
            <span className="font-medium">Python</span>, particularly with{" "}
            <span className="font-medium">
              React Native, Next.js, Django, FastAPI, Flask
            </span>
            . My goal is to build applications that not only meet technical
            requirements but also provide exceptional user experiences.
          </p>

          {/* Skills Section */}
          <div>
            <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-center md:text-left text-gray-900 dark:text-white">
              Skills
            </h3>
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              {skillsData.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 text-sm font-medium bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 rounded-full hover:scale-105 transition-transform"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;