import { motion } from "framer-motion";

export default function PageHeader({ eyebrow, title, subtitle }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800 text-white">
      <div className="absolute -top-24 -right-16 w-72 h-72 rounded-full bg-secondary-500/25 blur-3xl animate-float-slow" />
      <div className="absolute -bottom-28 -left-16 w-72 h-72 rounded-full bg-white/10 blur-3xl animate-float" />
      <div className="container-app relative py-14 sm:py-20">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {eyebrow && (
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary-200 mb-3">
              {eyebrow}
            </p>
          )}
          <h1 className="text-3xl sm:text-5xl font-extrabold">{title}</h1>
          {subtitle && (
            <p className="mt-4 max-w-2xl text-primary-100 text-base sm:text-lg leading-relaxed">
              {subtitle}
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
