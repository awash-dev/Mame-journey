import React from "react";
import { cn } from "@/lib/utils";
import Footer from "@/components/Footer";

interface SkillData {
  name: string;
}

const skillsData: SkillData[] = [
  { name: "Computer Science" },
  { name: "Marketing" },
  { name: "Finance" },
];

const About = () => {
  return (
    <>
      <div
        className={cn(
          "container h-[calc('100vh-80px')] mx-auto px-4 py-12  w-full",
          "flex flex-col md:flex-row items-center gap-12 "
        )}
      >
        {/* Image Section (Left on Desktop) */}
        <div className="md:w-1/2 flex justify-center">
          <img
            src="/About.jpg" // Replace with your image path
            alt="About Me"
            className={cn(
              "max-w-md w-full",
              "h-[300px] w-[300px] rounded-[60px]",
              "object-cover object-center shadow-2xl"
            )}
          />
        </div>

        {/* Text and Skills Section (Right on Desktop) */}
        <div className="md:w-1/2 space-y-6">
          <h2
            className={cn(
              "text-3xl font-bold text-transparent bg-clip-text",
              "bg-gradient-to-r from-purple-400 to-pink-600",
              "tracking-tight"
            )}
          >
            About Me
          </h2>
          <p
            className={cn(
              "text-black dark:text-white leading-relaxed",
              "text-lg"
            )}
          >
            Hello! I'm Mohammed, a passionate software developer with a strong
            focus on creating engaging and performant web experiences. I
            specialize in the JavaScript ecosystem, particularly with React and
            Next.js. My goal is to build applications that not only meet
            technical requirements but also provide exceptional user
            experiences.
          </p>

          {/* Skills Section */}
          <div>
            <h3
              className={cn(
                "text-2xl font-semibold dark:text-white text-black mb-4",
                "tracking-wide"
              )}
            >
              Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {skillsData.map((skill, index) => (
                <React.Fragment key={index}>
                  <span className="text-sm font-medium ">{skill.name}</span>
                  {index < skillsData.length - 1 && (
                    <span className="text-gray-300"> | </span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
      
    </>
  );
};

export default About;
