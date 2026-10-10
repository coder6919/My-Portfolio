import React, { useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

const ProjectCard = ({ title, description, stack, screenshots = [], thumbnail, month, day }) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);

  // Mouse coordinates for the tilt effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth the mouse movement with spring physics
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  // Map mouse position to rotation (Max 15 degrees)
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Normalize values to -0.5 to 0.5
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <div
      className="perspective-1000 py-10 flex items-center justify-center"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        ref={cardRef}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative w-80 h-96 bg-card border-2 border-[#141414] rounded-xl transition-all duration-500 ease-out cursor-pointer"
      >
        {/* --- REVEALED SCREENSHOTS (THE FAN-OUT) --- */}
        {/* We use index 1 and 2 for the back layers now */}
        <motion.div
          animate={{ x: isHovered ? 120 : 0, y: isHovered ? -40 : 0, rotate: isHovered ? 10 : 0, opacity: isHovered ? 1 : 0 }}
          className="absolute inset-0 z-[-1] rounded-xl overflow-hidden border border-brand/30 bg-zinc-900 shadow-2xl"
          style={{ transform: "translateZ(-50px)" }}
        >
          <img src={screenshots[0]} alt="preview" className="w-full h-full object-cover opacity-60" />
        </motion.div>

        <motion.div
          animate={{ x: isHovered ? -120 : 0, y: isHovered ? -20 : 0, rotate: isHovered ? -10 : 0, opacity: isHovered ? 1 : 0 }}
          className="absolute inset-0 z-[-2] rounded-xl overflow-hidden border border-brand/20 bg-zinc-900 shadow-xl"
          style={{ transform: "translateZ(-100px)" }}
        >
          <img src={screenshots[1]} alt="preview" className="w-full h-full object-cover opacity-40" />
        </motion.div>

        {/* --- MAIN CARD CONTENT (THE FACE) --- */}
        <div className="absolute inset-0 rounded-xl overflow-hidden border-2 border-brand/10 bg-[#0c0c0c]">

          {/* 1. The Grid Pattern (Moved to bottom layer so it doesn't cross the image) */}
          <div className="absolute inset-0 custom-grid opacity-5" />

          {/* 2. THE THUMBNAIL IMAGE (Higher opacity for better visibility) */}
          {thumbnail && (
            <img
              src={thumbnail}
              alt={title}
              className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500"
            />
          )}

          {/* 3. SHARP GRADIENT (Only at the bottom 50% for text readability) */}
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black via-black/80 to-transparent z-1" />

          {/* 4. Floating UI Elements */}
          <motion.div
            style={{ transform: "translateZ(60px)" }}
            className="absolute inset-0 p-6 flex flex-col justify-end z-10"
          >
            {/* Label */}
            <div className="bg-brand text-black font-black text-[10px] px-2 py-0.5 inline-block uppercase tracking-wider w-fit mb-3 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
              Project
            </div>

            {/* Title */}
            <h3 className="text-2xl font-black text-white leading-tight uppercase tracking-tighter mb-2 drop-shadow-md">
              {title}
            </h3>

            {/* Description */}
            <p className="text-zinc-200 text-[11px] font-bold leading-relaxed mb-4 drop-shadow-md">
              {description}
            </p>

            {/* Tech Stack */}
            <div className="flex flex-wrap gap-2">
              {stack.map((tech) => (
                <span key={tech} className="text-[9px] text-brand border border-brand/30 px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-md">
                  {tech}
                </span>
              ))}
            </div>

            {/* Button */}
            <button className="mt-5 w-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-black py-2.5 uppercase hover:bg-brand hover:text-black transition-all shadow-lg">
              See More Case Study
            </button>
          </motion.div>
        </div>
        {/* Corner Date Box */}
         <motion.div
          style={{ transform: "translateZ(80px)" }}
          className="absolute top-4 right-4 w-16 h-14 bg-[#141414] border border-brand flex flex-col items-center justify-center z-20"
        >
          {/* Use the dynamic props instead of hardcoded text */}
          <span className="text-[8px] text-brand font-black uppercase leading-none">
            {month || "JAN"} 
          </span>
          <span className="text-base text-brand font-black leading-none mt-0.5">
            {day || "01"}
          </span>
        </motion.div>
        
      </motion.div>
    </div>
  );
};


export default ProjectCard;