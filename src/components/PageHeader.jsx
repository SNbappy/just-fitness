import { motion } from "framer-motion";

export default function PageHeader({ eyebrow, title, subtitle }) {
  return (
    <section className="relative brand-gradient grain overflow-hidden">
      <div className="absolute -top-40 -right-24 w-[34rem] h-[34rem] rounded-full bg-white/15 blur-3xl pointer-events-none" />
      <div className="container-wide relative py-16 sm:py-24">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {eyebrow && (
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/75 mb-4">
              {eyebrow}
            </p>
          )}
          <h1 className="text-white text-4xl sm:text-6xl font-extrabold tracking-[-0.03em]">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-5 max-w-2xl text-white/85 text-base sm:text-lg leading-relaxed">
              {subtitle}
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
