import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight, Dumbbell, Flower2, Footprints, Trophy,
  HeartPulse, GraduationCap, Quote, Mail, Phone,
} from "lucide-react";
import { club } from "../data/club";
import CountUp from "../components/CountUp";

const icons = { Dumbbell, Flower2, Footprints, Trophy, HeartPulse, GraduationCap };

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Home() {
  return (
    <>
      {/* ---------- HERO ---------- */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800 text-white">
        <div className="absolute top-10 -left-20 w-80 h-80 rounded-full bg-secondary-500/30 blur-3xl animate-float" />
        <div className="absolute -bottom-24 right-0 w-96 h-96 rounded-full bg-emerald-300/20 blur-3xl animate-float-slow" />
        <div className="absolute inset-0 opacity-[0.07]"
             style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "28px 28px" }} />

        <div className="container-app relative py-16 sm:py-24 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial="hidden" animate="show" variants={fadeUp}>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur px-4 py-1.5 text-xs font-semibold border border-white/25">
                <span className="w-2 h-2 rounded-full bg-secondary-400 animate-pulse" />
                {club.university}
              </span>

              <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.08]">
                Health &amp; Fitness{" "}
                <span className="bg-gradient-to-r from-secondary-300 to-amber-200 bg-clip-text text-transparent">
                  Club
                </span>
              </h1>

              <p className="mt-5 text-lg sm:text-xl text-primary-100 font-medium">
                {club.tagline}
              </p>
              <p className="mt-4 text-primary-100/90 leading-relaxed max-w-xl">
                {club.intro}
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link to="/signup" className="btn-secondary">
                  Join the Club <ArrowRight size={18} />
                </Link>
                <Link to="/gallery" className="btn-ghost">
                  See Our Activities
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="relative"
            >
              <div className="aspect-[4/3] rounded-3xl overflow-hidden border-4 border-white/20 shadow-2xl bg-primary-800">
                <img
                  src="/images/hero.jpg"
                  alt="JUST Health and Fitness Club members training"
                  className="w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.style.display = "none"; }}
                />
              </div>
              <div className="absolute -bottom-5 -left-4 sm:left-6 card px-5 py-3.5 flex items-center gap-3">
                <span className="grid place-items-center w-11 h-11 rounded-xl bg-secondary-100 text-secondary-600">
                  <HeartPulse size={22} />
                </span>
                <div>
                  <p className="text-xl font-extrabold text-ink-900 leading-none">
                    <CountUp end={250} suffix="+" />
                  </p>
                  <p className="text-xs text-ink-500 font-medium">Active members</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="h-10 bg-ink-50 rounded-t-[2.5rem] relative" />
      </section>

      {/* ---------- STATS ---------- */}
      <section className="container-app -mt-4 relative z-10">
        <div className="card p-6 sm:p-8 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {club.stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="text-center"
            >
              <p className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-br from-primary-600 to-primary-800 bg-clip-text text-transparent">
                <CountUp end={s.value} suffix={s.suffix} />
              </p>
              <p className="mt-1 text-xs sm:text-sm font-semibold text-ink-500">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ---------- DIRECTOR'S MESSAGE ---------- */}
      <section className="section">
        <div className="container-app">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="card overflow-hidden grid lg:grid-cols-[340px,1fr]"
          >
            <div className="bg-gradient-to-br from-primary-600 to-primary-800 p-8 text-white flex flex-col items-center text-center">
              <div className="w-36 h-36 rounded-2xl overflow-hidden border-4 border-white/25 bg-primary-900 shadow-xl">
                <img
                  src={club.director.photo}
                  alt={club.director.name}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.style.display = "none"; }}
                />
              </div>
              <h3 className="mt-5 text-xl font-extrabold">{club.director.name}</h3>
              <p className="text-primary-200 text-sm font-semibold mt-1">
                {club.director.designation}
              </p>
              <p className="text-primary-100/80 text-xs mt-2 leading-relaxed">
                {club.director.office}
                <br />
                {club.director.qualification}
              </p>
              <div className="mt-5 space-y-2 text-xs w-full">
                <a href={`mailto:${club.director.email}`}
                   className="flex items-center justify-center gap-2 rounded-lg bg-white/10 px-3 py-2 hover:bg-white/20 break-all">
                  <Mail size={14} /> {club.director.email}
                </a>
                <a href={`tel:${club.director.phone}`}
                   className="flex items-center justify-center gap-2 rounded-lg bg-white/10 px-3 py-2 hover:bg-white/20">
                  <Phone size={14} /> {club.director.phone}
                </a>
              </div>
            </div>

            <div className="p-8 sm:p-10 flex flex-col justify-center">
              <p className="eyebrow">{club.director.messageTitle}</p>
              <Quote size={40} className="text-primary-200 mt-4" />
              <p className="mt-3 text-ink-600 text-base sm:text-lg leading-relaxed">
                {club.director.message}
              </p>
              <div className="mt-6 pt-5 border-t border-ink-100">
                <p className="font-display font-bold text-ink-900">{club.director.name}</p>
                <p className="text-sm text-ink-500">
                  {club.director.designation}, {club.director.office}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ---------- ACTIVITIES ---------- */}
      <section className="section bg-white">
        <div className="container-app">
          <div className="text-center max-w-2xl mx-auto">
            <p className="eyebrow">What We Do</p>
            <h2 className="mt-3 text-3xl sm:text-4xl text-ink-900">
              Everything you need to stay fit on campus
            </h2>
            <p className="mt-4 text-ink-500">
              From your first push-up to inter-department tournaments — structured, supervised and open to all.
            </p>
          </div>

          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {club.activities.map((a, i) => {
              const Icon = icons[a.icon] || Dumbbell;
              return (
                <motion.div
                  key={a.title}
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.45, delay: (i % 3) * 0.08 }}
                  className="card p-6 group hover:-translate-y-1.5 hover:shadow-lg transition-all duration-300"
                >
                  <span className={`grid place-items-center w-14 h-14 rounded-2xl bg-gradient-to-br ${a.color} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon size={26} strokeWidth={2.2} />
                  </span>
                  <h3 className="mt-5 text-lg text-ink-900">{a.title}</h3>
                  <p className="mt-2 text-sm text-ink-500 leading-relaxed">{a.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="section">
        <div className="container-app">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-ink-900 via-primary-900 to-ink-900 text-white p-10 sm:p-14 text-center">
            <div className="absolute -top-16 left-1/4 w-64 h-64 rounded-full bg-primary-500/25 blur-3xl animate-float" />
            <div className="absolute -bottom-20 right-1/4 w-64 h-64 rounded-full bg-secondary-500/20 blur-3xl animate-float-slow" />
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl">Ready to start your fitness journey?</h2>
              <p className="mt-4 text-ink-300 max-w-xl mx-auto">
                Create your free account, join a training batch with your batch code, and start tracking your progress today.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/signup" className="btn-primary">
                  Create Free Account <ArrowRight size={18} />
                </Link>
                <Link to="/about" className="btn-ghost">Learn More</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
