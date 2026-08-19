import React, { useEffect, useRef } from "react";
import gsap from "gsap";

const Cursor = () => {
  const cursorRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const moveCursor = (e) => {
      gsap.to(cursorRef.current, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.5,
        ease: "power3.out",
      });
      if (textRef.current) {
        textRef.current.innerText = `X:${e.clientX} Y:${e.clientY}`;
      }
    };

    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, []);

  return (
    <div 
      ref={cursorRef} 
      className="fixed top-0 left-0 w-4 h-4 border border-brand pointer-events-none z-[9999] mix-blend-difference hidden lg:flex items-center"
    >
      <div className="absolute top-6 left-6 font-mono text-[8px] text-brand whitespace-nowrap tracking-tighter" ref={textRef} />
      <div className="w-full h-[1px] bg-brand/30 absolute rotate-45" />
    </div>
  );
};

export default Cursor;