import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Cpu, Github,  Linkedin, ExternalLink } from "lucide-react";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Projects", href: "#projects" },
    { name: "Stack", href: "#stack" },
    { name: "History", href: "#experience" },
    { name: "Reviews", href: "#reviews" },
  ];

  return (
    <nav className={`fixed top-0 w-full z-[100] transition-all duration-500 ${
      scrolled ? "py-4" : "py-8"
    }`}>
      <div className="container mx-auto px-6">
        <div className={`relative flex items-center justify-between p-2 pl-6 pr-2 rounded-2xl border transition-all duration-500 ${
          scrolled 
          ? "bg-black/40 backdrop-blur-xl border-white/10 shadow-2xl" 
          : "bg-transparent border-transparent"
        }`}>
          
          {/* Logo / Status */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand flex items-center justify-center rounded-lg">
              <Cpu size={18} className="text-black" />
            </div>
            <div className="hidden sm:block">
              <p className="text-[10px] font-black uppercase tracking-tighter text-white leading-none">Syed.SYS</p>
              <p className="text-[8px] font-bold text-brand uppercase tracking-[0.2em] leading-none mt-1">Status: Optimal</p>
            </div>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <a 
                key={link.name} 
                href={link.href} 
                className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-brand transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <div className="hidden lg:flex items-center gap-2 px-4 h-10 border border-white/5 bg-white/5 rounded-xl mr-2">
               <div className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
               <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Open to work</span>
            </div>

            <a
              href="#hire-me"
              className="hidden sm:flex items-center h-10 px-4 bg-brand text-brand-ink text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-ink transition-colors"
            >
              Hire Me
            </a>

            <a href="https://github.com/coder6919" target="_blank" rel="noreferrer" className="p-2.5 text-zinc-400 hover:text-white transition-colors bg-white/5 rounded-xl border border-white/5">
              <Github size={18} />
            </a>

            <button
              onClick={() => setMobileMenu(!mobileMenu)}
              className="md:hidden p-2.5 text-brand bg-brand/10 rounded-xl border border-brand/20"
            >
              {mobileMenu ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenu && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full p-6 bg-black/95 backdrop-blur-2xl border-b border-white/10 md:hidden"
          >
            <div className="flex flex-col gap-6">
              {navLinks.map(link => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenu(false)}
                  className="text-2xl font-black uppercase tracking-tighter text-white hover:text-brand"
                >
                  {link.name}
                </a>
              ))}
              <a
                href="#hire-me"
                onClick={() => setMobileMenu(false)}
                className="text-2xl font-black uppercase tracking-tighter text-brand"
              >
                Hire Me
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;