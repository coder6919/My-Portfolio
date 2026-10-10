import React from "react";
import { motion } from "framer-motion";

/**
 * Placeholder testimonials — replace with real client quotes.
 * Keep it to 2-3. `role` should read "Role, Company".
 */
const reviews = [
  {
    quote: "Replace this with a specific line about the outcome — what shipped, and what it changed for them.",
    name: "[Client Name]",
    role: "[Role, Company]",
    featured: true,
  },
  {
    quote: "A shorter, second quote — different angle: how it was to work with you.",
    name: "[Client Name]",
    role: "[Role, Company]",
  },
  {
    quote: "A third, optional quote — timeline, responsiveness, or technical depth.",
    name: "[Client Name]",
    role: "[Role, Company]",
  },
];

const Reviews = () => {
  const [featured, ...rest] = reviews;

  return (
    <section id="reviews" className="py-24 container mx-auto px-6">
      <div className="flex items-end gap-4 mb-16">
        <h2 className="text-4xl font-black uppercase tracking-tighter text-ink">
          Client <span className="text-brand">Feedback_</span>
        </h2>
        <div className="h-[2px] flex-1 bg-white/5 mb-2" />
      </div>

      <motion.blockquote
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-3xl mb-14"
      >
        <p className="text-2xl md:text-3xl font-bold text-ink leading-snug tracking-tight">
          "{featured.quote}"
        </p>
        <footer className="mt-5 flex items-center gap-3">
          <span className="w-8 h-[1px] bg-brand" />
          <span className="text-xs font-mono uppercase tracking-widest text-muted">
            {featured.name} <span className="text-faint">— {featured.role}</span>
          </span>
        </footer>
      </motion.blockquote>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
        {rest.map((r, i) => (
          <motion.blockquote
            key={r.name + i}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="border-t border-white/10 pt-5"
          >
            <p className="text-sm text-ink-2 leading-relaxed">"{r.quote}"</p>
            <footer className="mt-4 text-[11px] font-mono uppercase tracking-widest text-muted">
              {r.name} <span className="text-faint">— {r.role}</span>
            </footer>
          </motion.blockquote>
        ))}
      </div>
    </section>
  );
};

export default Reviews;
