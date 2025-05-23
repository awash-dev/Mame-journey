"use client";

import React from "react";
import { cn } from "@/lib/utils";

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
    <div className="mt-14">
      <div
        className={cn(
          "container mx-auto px-4 py-8 sm:py-12 w-full",
          "flex flex-col md:flex-row items-center gap-8 md:gap-12"
        )}
      >
        {/* Image Section (Left on Desktop) */}
        <div className="w-full py-12 md:py-0 md:w-1/2 flex justify-center">
          <div className="relative">
            <img
              src="/About.jpg" // Replace with your image path
              alt="About Me"
              className={cn(
                "w-full max-w-xs sm:max-w-sm md:max-w-md",
                "h-[250px]   w-[200px] sm:w-[250px]",
                "rounded-[40px] sm:rounded-[30px]",
                " shadow-xl sm:shadow-2xl",
                " dark:border-gray-800"
              )}
            />
          </div>
        </div>

        {/* Text and Skills Section (Right on Desktop) */}
        <div className="w-full md:w-1/2 -mt-8 md:-mt-0 md:space-y-6">
          <h2
            className={cn(
              "text-2xl sm:text-3xl md:text-4xl font-bold text-transparent bg-clip-text",
              "bg-gradient-to-r from-purple-400 to-pink-600",
              "text-center md:text-left tracking-tight"
            )}
          >
            About Me
          </h2>
          <p
            className={cn(
              "text-black dark:text-white leading-relaxed",
              "text-base sm:text-lg",
              "text-center md:text-left"
            )}
          >
            Hello! I'm Mohammed, a passionate software developer with a strong
            focus on creating engaging and performant web experiences. I
            specialize in the JavaScript ecosystem & python, particularly with
            React Native , Next.js, Django , fast API, Flask. My goal is to
            build applications that not only meet technical requirements but
            also provide exceptional user experiences.
          </p>

          {/* Skills Section */}
          <div className="pt-2">
            <h3
              className={cn(
                "text-xl sm:text-2xl font-semibold dark:text-white text-black mb-3 sm:mb-4",
                "text-center md:text-left tracking-wide"
              )}
            >
              Skills
            </h3>
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-1 sm:gap-2">
              {skillsData.map((skill, index) => (
                <React.Fragment key={index}>
                  <span
                    className={cn(
                      "text-sm sm:text-base font-medium",
                      "text-gray-700 dark:text-gray-300"
                    )}
                  >
                    {skill.name}
                  </span>
                  {index !== skillsData.length - 1 && (
                    <span className="text-gray-500 dark:text-gray-400">|</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
