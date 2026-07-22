import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight, Dumbbell, Flower2, Footprints, Trophy, HeartPulse,
  GraduationCap, Quote, Sparkles, ShieldCheck, Clock, Users,
} from "lucide-react";
import { club } from "../data/club";
import CountUp from "../components/CountUp";

const ICONS = { Dumbbell, Flower2, Footprints, Trophy, HeartPulse, GraduationCap };

const ACCENTS = [
  { tile: "bg-primary-50", icon: "text-primary-600", bar: "bg-primary-500" },
  { tile: "bg-violet-50", icon: "text-violet-600", bar: "bg-violet-500" },
  { tile: "bg-sky-50", icon: "text-sky-600", bar: "bg-sky-500" },
  { tile: "bg-amber-50", icon: "text-amber-600", bar: "bg-amber-500" },
  { tile: "bg-rose-50", icon: "text-rose-600", bar: "bg-rose-500" },
  { tile: "bg-emerald-50", icon: "text-emerald-600", bar: "bg-emerald-500" },
];

const reveal = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export default function Home() {
  return (
    <>
      {/* ================= HERO ================= */}
      <section className="relative brand-gradient grain overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute -top-40 -left-32 w-[46rem] h-[46rem] rounded-full bg-white/20 blur-3xl animate-drift" />
          <div className="absolute -bottom-56 right-0 w-[38rem] h-[38rem] rounded-full bg-violet-700/30 blur-3xl animate-drift-slow" />
          <div
            className="absolute inset-0 opacity-[0.14]"
            style={{
              backgroundImage: "radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)",
              backgroundSize: "38px 38px",
            }}
          />
        </div>

        <div className="container-wide relative pt-32 pb-24 sm:pt-40 sm:pb-32">
          <div className="grid lg:grid-cols-[1.05fr,0.95fr] gap-14 items-center">
            <motion.div initial="hidden" animate="show" variants={reveal}>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-md px-4 py-2 text-xs font-semibold text-white border border-white/25">
                <Sparkles size={14} />
                {club.university}
              </span>

              <h1 className="mt-7 text-white font-extrabold leading-[0.95] text-[3.25rem] sm:text-[4.5rem] lg:text-[5.25rem] tracking-[-0.04em]">
                Health &amp; Fitness
                <span className="block text-white/85">Club</span>
              </h1>

              <p className="mt-6 text-xl sm:text-2xl text-white font-semibold">
                {club.tagline}
              </p>
              <p className="mt-4 max-w-xl text-white/80 leading-relaxed text-base sm:text-lg">
                {club.intro}
              </p>

              <div className="mt-10 flex flex-col sm:flex-row gap-3">
                <Link to="/signup" className="btn-white text-base px-7 py-4">
                  Join the club <ArrowRight size={18} />
                </Link>
                <Link to="/gallery" className="btn-glass text-base px-7 py-4">
                  See our activities
                </Link>
              </div>

              <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-white/75">
                <span className="flex items-center gap-2"><ShieldCheck size={16} /> Free for all JUST students</span>
                <span className="flex items-center gap-2"><Clock size={16} /> Morning &amp; evening batches</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <div className="relative rounded-[28px] overflow-hidden shadow-float ring-1 ring-white/25 aspect-[4/3] bg-ink-900">
                <img
                  src="/images/hero.jpg"
                  alt="Members of the JUST Health and Fitness Club training together"
                  className="w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.style.display = "none"; }}
                />
              </div>

              <div className="absolute -bottom-6 -left-4 sm:-left-8 bg-surface rounded-2xl shadow-float px-5 py-4 flex items-center gap-3.5">
                <span className="grid place-items-center w-12 h-12 rounded-xl bg-primary-50 text-primary-600">
                  <HeartPulse size={24} />
                </span>
                <div>
                  <p className="text-2xl font-extrabold text-ink-900 leading-none tabular">
                    <CountUp end={250} suffix="+" />
                  </p>
                  <p className="text-xs text-muted font-semibold mt-1">Active members</p>
                </div>
              </div>

              <div className="hidden sm:flex absolute -top-5 -right-3 bg-surface rounded-2xl shadow-float px-4 py-3 items-center gap-3">
                <span className="grid place-items-center w-10 h-10 rounded-xl bg-violet-50 text-violet-600">
                  <Users size={20} />
                </span>
                <div>
                  <p className="text-lg font-extrabold text-ink-900 leading-none tabular">8</p>
                  <p className="text-[11px] text-muted font-semibold mt-0.5">Batches</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================= STATS ================= */}
      <section className="relative -mt-10 z-10">
        <div className="container-wide">
          <div className="card p-6 sm:p-9 grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {club.stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="text-center"
              >
                <p className="text-4xl sm:text-5xl font-display font-extrabold text-gradient tabular">
                  <CountUp end={s.value} suffix={s.suffix} />
                </p>
                <p className="mt-2 text-xs sm:text-sm font-semibold text-muted">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= DIRECTOR ================= */}
      <section className="section">
        <div className="container-wide">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={reveal}
            className="card overflow-hidden grid lg:grid-cols-[380px,1fr]"
          >
            <div className="relative p-8 sm:p-10 flex flex-col items-center text-center border-b lg:border-b-0 lg:border-r border-line">
              <div className="absolute top-0 inset-x-0 h-1.5 brand-gradient" />
              <div className="w-40 h-40 rounded-3xl overflow-hidden bg-elevated ring-4 ring-primary-50">
                <img
                  src={club.director.photo}
                  alt={club.director.name}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.style.display = "none"; }}
                />
              </div>
              <h3 className="mt-6 text-xl text-ink-900">{club.director.name}</h3>
              <p className="mt-1 text-sm font-bold text-primary-600">{club.director.designation}</p>
              <p className="mt-3 text-xs text-muted leading-relaxed">
                {club.director.office}
                <br />
                {club.director.qualification}
              </p>

              <div className="mt-6 w-full space-y-2 text-xs">
                <a href={`mailto:${club.director.email}`}
                  className="block rounded-xl bg-elevated px-3 py-2.5 font-medium text-muted hover:text-primary-600 transition-colors break-all">
                  {club.director.email}
                </a>
                <a href={`tel:${club.director.phone}`}
                  className="block rounded-xl bg-elevated px-3 py-2.5 font-medium text-muted hover:text-primary-600 transition-colors">
                  {club.director.phone} · PABX {club.director.pabx}
                </a>
              </div>
            </div>

            <div className="p-8 sm:p-12 flex flex-col justify-center">
              <p className="eyebrow">{club.director.messageTitle}</p>
              <Quote size={48} className="mt-5 text-primary-200" />
              <p className="mt-4 text-lg sm:text-xl text-ink-800 leading-relaxed">
                {club.director.message}
              </p>
              <div className="mt-8 pt-6 border-t border-line">
                <p className="font-display font-bold text-ink-900 text-lg">{club.director.name}</p>
                <p className="text-sm text-muted mt-0.5">
                  {club.director.designation}, {club.director.office}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================= ACTIVITIES ================= */}
      <section className="section bg-surface border-y border-line">
        <div className="container-wide">
          <div className="max-w-2xl">
            <p className="eyebrow">What we do</p>
            <h2 className="mt-4 text-4xl sm:text-5xl text-ink-900 leading-[1.05]">
              Everything you need to stay fit{" "}
              <span className="text-gradient">on campus</span>
            </h2>
            <p className="mt-5 text-lg text-muted leading-relaxed">
              From your first push-up to inter-department tournaments — structured,
              supervised, and open to every student regardless of experience.
            </p>
          </div>

          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {club.activities.map((a, i) => {
              const Icon = ICONS[a.icon] || Dumbbell;
              const accent = ACCENTS[i % ACCENTS.length];
              return (
                <motion.div
                  key={a.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: (i % 3) * 0.09 }}
                  className="group relative card card-hover p-7 overflow-hidden"
                >
                  <span className={`absolute top-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-500 ease-smooth ${accent.bar}`} />
                  <span className={`grid place-items-center w-14 h-14 rounded-2xl ${accent.tile} ${accent.icon} transition-transform duration-300 group-hover:scale-110`}>
                    <Icon size={26} strokeWidth={2.1} />
                  </span>
                  <h3 className="mt-6 text-xl text-ink-900">{a.title}</h3>
                  <p className="mt-2.5 text-muted leading-relaxed">{a.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="section">
        <div className="container-wide">
          <div className="text-center max-w-xl mx-auto">
            <p className="eyebrow">Getting started</p>
            <h2 className="mt-4 text-4xl sm:text-5xl text-ink-900">Three steps in</h2>
          </div>

          <div className="mt-14 grid md:grid-cols-3 gap-5">
            {[
              { n: "01", title: "Create your account", desc: "Sign up free with your email and fill in your basic health profile — weight, height and morning pulse." },
              { n: "02", title: "Enter your batch code", desc: "Your trainer gives you a 6-character code or a QR poster. Enter it once and you're in the batch." },
              { n: "03", title: "Train and track", desc: "Follow your trainer's plan, log your daily check-in, and watch your progress build week by week." },
            ].map((step, i) => (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="card p-8"
              >
                <p className="font-display text-5xl font-extrabold text-gradient">{step.n}</p>
                <h3 className="mt-5 text-xl text-ink-900">{step.title}</h3>
                <p className="mt-2.5 text-muted leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="pb-20 sm:pb-28">
        <div className="container-wide">
          <div className="relative overflow-hidden rounded-[32px] brand-gradient grain px-8 py-16 sm:px-16 sm:py-20 text-center">
            <div className="absolute -top-32 left-1/3 w-[30rem] h-[30rem] rounded-full bg-white/20 blur-3xl pointer-events-none" />
            <div className="relative">
              <h2 className="text-4xl sm:text-5xl text-white leading-tight">
                Ready to start?
              </h2>
              <p className="mt-5 text-lg text-white/85 max-w-lg mx-auto leading-relaxed">
                Create your free account, join a batch with your trainer's code,
                and start tracking your progress today.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/signup" className="btn-white text-base px-8 py-4">
                  Create free account <ArrowRight size={18} />
                </Link>
                <Link to="/about" className="btn-glass text-base px-8 py-4">
                  Learn more
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
