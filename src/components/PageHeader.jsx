import { motion } from "framer-motion";
import Marquee from "./Marquee";

export default function PageHeader({ eyebrow, title, subtitle }) {
  return (
    <section className="relative bg-void text-white overflow-hidden grain">
      <div className="absolute top-0 -right-32 w-[34rem] h-[34rem] rounded-full bg-electric-600/25 blur-[140px] pointer-events-none" />

      <div className="container-wide relative pt-36 pb-16 sm:pt-44 sm:pb-20">
        <motion.div
          initial={{ opacity: 0, y: 34 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          {eyebrow && (
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-white/45 mb-6">
              {eyebrow}
            </p>
          )}
          <h1 className="mega text-[clamp(3rem,11vw,9rem)]">{title}</h1>
          {subtitle && (
            <p className="mt-7 max-w-xl text-white/55 text-base sm:text-lg leading-relaxed">
              {subtitle}
            </p>
          )}
        </motion.div>
      </div>

      <div className="border-t border-white/10">
        <Marquee className="py-4 text-white/80" size="text-[clamp(1.2rem,2.6vw,2rem)]" />
      </div>
    </section>
  );
}
