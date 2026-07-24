import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { club } from "../../data/club";
import CountUp from "../CountUp";
import Marquee from "../Marquee";

export default function Hero() {
  return (
    <section className="relative bg-void text-white overflow-hidden grain">
      <div className="relative w-full h-[46vh] min-h-[300px] sm:h-[58vh] overflow-hidden">
        <img src="/images/hero.jpg" alt="Club members training"
          className="w-full h-full object-cover object-[center_30%]" />
        <div className="absolute inset-0 bg-gradient-to-b from-void/85 via-void/25 to-void" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-void to-transparent" />
      </div>

      <div className="container-wide relative -mt-16 sm:-mt-24 pb-16">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}
          className="text-[11px] font-bold uppercase tracking-[0.3em] text-white/45">
          {club.university}
        </motion.p>

        <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 mega text-[clamp(2.6rem,10.5vw,9rem)]">
          Health
        </motion.h1>

        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-baseline gap-4 sm:gap-7 mt-2 sm:mt-4">
          <span className="mega text-[clamp(2.6rem,10.5vw,9rem)] outline-type">and</span>
          <span className="mega text-[clamp(2.6rem,10.5vw,9rem)]">Fitness</span>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap items-center gap-6 sm:gap-10 mt-2 sm:mt-4">
          <span className="mega text-[clamp(2.6rem,10.5vw,9rem)] text-electric-500">Club</span>
          <Link to="/signup"
            className="group flex items-center gap-3 border border-white/25 pl-6 pr-2 py-2 hover:border-electric-500 transition-colors">
            <span className="text-xs font-bold uppercase tracking-[0.2em]">Join now</span>
            <span className="grid place-items-center w-11 h-11 bg-electric-500 text-white group-hover:rotate-45 transition-transform duration-300">
              <ArrowUpRight size={20} />
            </span>
          </Link>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.7 }}
          className="mt-14 grid sm:grid-cols-[1fr,auto] gap-10 items-end">
          <p className="max-w-md text-white/60 leading-relaxed">{club.intro}</p>
          <div className="flex flex-wrap gap-x-10 gap-y-6">
            {club.stats.slice(0, 3).map((s) => (
              <div key={s.label}>
                <p className="mega text-[clamp(2rem,4vw,3.25rem)] tabular">
                  <CountUp end={s.value} suffix={s.suffix} />
                </p>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white/40">{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="rule">
        <Marquee text={club.tagline.toUpperCase()} className="py-5" size="text-[clamp(1.5rem,3.4vw,3rem)]" />
      </div>
    </section>
  );
}
