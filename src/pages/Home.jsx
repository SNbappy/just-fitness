import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Plus } from "lucide-react";
import { club } from "../data/club";
import CountUp from "../components/CountUp";
import Marquee from "../components/Marquee";

const reveal = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] } },
};

const STEPS = [
  { n: "01", t: "Create your account", d: "Sign up free with your email. Add your weight, height and morning pulse so your trainer can build the right plan." },
  { n: "02", t: "Enter your batch code", d: "Your trainer hands out a six-character code or a QR poster. One entry and you are in the batch." },
  { n: "03", t: "Train and track", d: "Follow the plan, log your daily check-in, and watch the graph move week after week." },
];

export default function Home() {
  return (
    <>
      {/* ============ HERO ============ */}
      <section className="relative bg-void text-white overflow-hidden grain">
        <div className="absolute top-1/4 -left-40 w-[42rem] h-[42rem] rounded-full bg-electric-600/25 blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[34rem] h-[34rem] rounded-full bg-volt/10 blur-[140px] pointer-events-none" />

        <div className="container-wide relative pt-36 pb-16 sm:pt-44 sm:pb-20">
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}
            className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.3em] text-white/45"
          >
            {club.university}
          </motion.p>

          <div className="mt-8 sm:mt-12">
            {/* line 1 — word + photo strip */}
            <motion.div
              initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-4 sm:gap-8"
            >
              <h1 className="mega text-[clamp(3.4rem,15vw,13rem)]">Health</h1>
              <div className="hidden sm:block flex-1 h-[clamp(3rem,9vw,7.5rem)] rounded-full overflow-hidden bg-carbon">
                <img
                  src="/images/hero.jpg"
                  alt="Club members training in the JUST gymnasium"
                  className="w-full h-full object-cover object-center"
                  onError={(e) => { e.currentTarget.parentElement.style.display = "none"; }}
                />
              </div>
            </motion.div>

            {/* line 2 — outline + solid */}
            <motion.div
              initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-baseline gap-4 sm:gap-8 mt-1 sm:mt-3"
            >
              <h1 className="mega text-[clamp(3.4rem,15vw,13rem)] outline-type">and</h1>
              <h1 className="mega text-[clamp(3.4rem,15vw,13rem)]">Fitness</h1>
            </motion.div>

            {/* line 3 — word + CTA */}
            <motion.div
              initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap items-center gap-6 sm:gap-10 mt-1 sm:mt-3"
            >
              <h1 className="mega text-[clamp(3.4rem,15vw,13rem)] text-electric-500">Club</h1>
              <Link
                to="/signup"
                className="group flex items-center gap-3 rounded-full border border-white/20 pl-6 pr-2 py-2 hover:border-electric-500 transition-colors"
              >
                <span className="text-sm font-bold uppercase tracking-widest">Join now</span>
                <span className="grid place-items-center w-11 h-11 rounded-full bg-electric-500 text-white group-hover:rotate-45 transition-transform duration-300">
                  <ArrowUpRight size={20} />
                </span>
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.7 }}
            className="mt-14 sm:mt-20 grid sm:grid-cols-[1fr,auto] gap-10 items-end"
          >
            <p className="max-w-md text-white/60 leading-relaxed">
              {club.intro}
            </p>
            <div className="flex gap-10 sm:gap-14">
              {club.stats.slice(0, 3).map((s) => (
                <div key={s.label}>
                  <p className="mega text-[clamp(2rem,4vw,3.25rem)] text-white tabular">
                    <CountUp end={s.value} suffix={s.suffix} />
                  </p>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white/40">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="rule">
          <Marquee text={club.tagline.toUpperCase()} className="py-5 text-white/90" size="text-[clamp(1.5rem,3.4vw,3rem)]" />
        </div>
      </section>

      {/* ============ ACTIVITIES — horizontal scroll ============ */}
      <section className="bg-void text-white py-20 sm:py-28 border-t border-white/10">
        <div className="container-wide">
          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} variants={reveal}
            className="flex flex-col md:flex-row md:items-end justify-between gap-6"
          >
            <h2 className="mega text-[clamp(2.5rem,8vw,7rem)] max-w-3xl">
              What we
              <span className="text-electric-500"> do</span>
            </h2>
            <p className="max-w-xs text-white/50 leading-relaxed pb-3">
              From your first push-up to inter-department tournaments. Supervised, structured,
              open to every student.
            </p>
          </motion.div>
        </div>

        <div className="mt-14 overflow-x-auto scrollbar-hide">
          <div className="flex gap-5 px-4 sm:px-6 lg:px-[max(1.5rem,calc((100vw-80rem)/2))] snap-x snap-mandatory">
            {club.activities.map((a, i) => (
              <motion.article
                key={a.title}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: (i % 3) * 0.08 }}
                className="group relative shrink-0 snap-start w-[280px] sm:w-[340px] bg-carbon border border-white/10 hover:border-electric-500/60 transition-colors duration-300 p-8 flex flex-col min-h-[380px]"
              >
                <span className="mega text-[3.5rem] text-white/10 group-hover:text-electric-500/40 transition-colors duration-300 leading-none">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-auto mega text-[1.75rem] leading-tight">{a.title}</h3>
                <p className="mt-4 text-sm text-white/50 leading-relaxed">{a.desc}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-electric-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Plus size={14} /> Open to all
                </span>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ============ DIRECTOR — editorial ============ */}
      <section className="bg-white text-void py-20 sm:py-32">
        <div className="container-wide">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }} variants={reveal}>
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-electric-600">
              {club.director.messageTitle}
            </p>

            <div className="mt-10 grid lg:grid-cols-[1fr,340px] gap-12 lg:gap-16 items-start">
              <div>
                <blockquote className="font-display font-bold text-[clamp(1.5rem,3.2vw,2.6rem)] leading-[1.22] tracking-[-0.02em]">
                  <span className="text-electric-500">“</span>
                  {club.director.message}
                </blockquote>

                <div className="mt-10 pt-8 border-t border-ink-200 flex items-center gap-5">
                  <div>
                    <p className="mega text-2xl">{club.director.name}</p>
                    <p className="mt-1 text-sm text-ink-500">
                      {club.director.designation} · {club.director.office}
                    </p>
                  </div>
                </div>
              </div>

              <div className="lg:sticky lg:top-28">
                <div className="relative aspect-[4/5] bg-ink-100 overflow-hidden">
                  <img
                    src={club.director.photo}
                    alt={club.director.name}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.style.display = "none"; }}
                  />
                  <span className="absolute bottom-0 left-0 bg-electric-500 text-white px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em]">
                    Director
                  </span>
                </div>
                <div className="mt-5 space-y-1.5 text-sm text-ink-500">
                  <p>{club.director.qualification}</p>
                  <a href={`mailto:${club.director.email}`} className="block hover:text-electric-600 break-all">
                    {club.director.email}
                  </a>
                  <a href={`tel:${club.director.phone}`} className="block hover:text-electric-600">
                    {club.director.phone} · PABX {club.director.pabx}
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============ STEPS — full-width rows ============ */}
      <section className="bg-void text-white py-20 sm:py-28">
        <div className="container-wide">
          <motion.h2
            initial="hidden" whileInView="show" viewport={{ once: true }} variants={reveal}
            className="mega text-[clamp(2.5rem,8vw,7rem)]"
          >
            Three steps
            <span className="text-electric-500"> in</span>
          </motion.h2>

          <div className="mt-14">
            {STEPS.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: i * 0.08 }}
                className="group grid md:grid-cols-[130px,1fr,1.2fr] gap-4 md:gap-10 items-baseline py-9 border-t border-white/10 hover:border-electric-500/50 transition-colors"
              >
                <span className="mega text-[3.25rem] text-white/15 group-hover:text-electric-500 transition-colors leading-none">
                  {s.n}
                </span>
                <h3 className="mega text-[1.75rem] sm:text-[2.25rem] leading-tight">{s.t}</h3>
                <p className="text-white/50 leading-relaxed">{s.d}</p>
              </motion.div>
            ))}
            <div className="border-t border-white/10" />
          </div>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="bg-electric-500 text-white overflow-hidden">
        <Marquee text="JOIN THE CLUB" className="py-6 border-b border-white/20" size="text-[clamp(1.8rem,4vw,3.5rem)]" reverse />

        <div className="container-wide py-20 sm:py-28 text-center">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={reveal}>
            <h2 className="mega text-[clamp(2.75rem,10vw,9rem)] leading-[0.85]">
              Start
              <br />
              today
            </h2>
            <p className="mt-8 text-white/85 max-w-md mx-auto leading-relaxed">
              Free for every JUST student. Create an account, enter your trainer's code,
              and train with people who show up.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/signup" className="btn bg-white text-void hover:bg-white/90 text-base px-8 py-4">
                Create free account <ArrowRight size={18} />
              </Link>
              <Link to="/about" className="btn border border-white/40 text-white hover:bg-white/10 text-base px-8 py-4">
                About the club
              </Link>
            </div>
          </motion.div>
        </div>

        <Marquee text="JUST HEALTH & FITNESS CLUB" className="py-6 border-t border-white/20" size="text-[clamp(1.8rem,4vw,3.5rem)]" />
      </section>
    </>
  );
}
