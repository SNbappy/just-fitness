import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { club } from "../data/club";
import PageHeader from "../components/PageHeader";

const PILLARS = [
  { n: "01", t: "Open to everyone", d: "No experience required and no fee. Every JUST student can join a batch, whatever their starting point." },
  { n: "02", t: "Supervised training", d: "Sessions run under the Office of Physical Education, so form, safety and progression are guided rather than guessed." },
  { n: "03", t: "Habits that outlast university", d: "The aim is not a single semester of training. It is a routine you keep long after graduation." },
];

const ORG = [
  ["Director", "Uzzal Chandra Sutradhar — Assistant Director, Office of the Physical Education"],
  ["Trainers", "Appointed by the director to run individual training batches"],
  ["Members", "Any enrolled JUST student who joins a batch"],
];

export default function About() {
  return (
    <>
      <PageHeader
        eyebrow="Who we are"
        title="About the club"
        subtitle={club.intro}
      />

      <section className="bg-void text-white py-20 sm:py-28 border-t border-white/10">
        <div className="container-wide grid lg:grid-cols-[1fr,1.1fr] gap-14">
          <div>
            <h2 className="mega text-[clamp(2rem,5vw,3.5rem)]">
              Why the club<span className="text-electric-500"> exists</span>
            </h2>
          </div>
          <div className="space-y-6 text-white/60 leading-relaxed text-lg">
            <p>
              Academic pressure at JUST is real, and physical activity is usually
              the first thing a student drops. The Health and Fitness Club exists
              to make training the easy option — a fixed time, a fixed place, and
              people expecting you to show up.
            </p>
            <p>
              The club runs organised batches for gym, yoga, cardio and sport,
              alongside health check-up camps and awareness sessions on nutrition,
              sleep and injury prevention.
            </p>
          </div>
        </div>

        <div className="container-wide mt-16">
          {PILLARS.map((p, i) => (
            <motion.div
              key={p.n}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="grid md:grid-cols-[120px,1fr,1.2fr] gap-4 md:gap-10 items-baseline py-9 border-t border-white/10"
            >
              <span className="mega text-[3rem] text-electric-500 leading-none">{p.n}</span>
              <h3 className="mega text-[1.6rem] sm:text-[2rem] leading-tight">{p.t}</h3>
              <p className="text-white/55 leading-relaxed">{p.d}</p>
            </motion.div>
          ))}
          <div className="border-t border-white/10" />
        </div>
      </section>

      <section className="bg-white text-void py-20 sm:py-28">
        <div className="container-wide">
          <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-electric-600">
            How the club is organised
          </p>
          <div className="mt-10 grid lg:grid-cols-[1fr,1.4fr] gap-12">
            <h2 className="mega text-[clamp(2rem,5vw,3.5rem)]">Structure</h2>
            <dl>
              {ORG.map(([role, desc]) => (
                <div key={role} className="grid sm:grid-cols-[160px,1fr] gap-2 sm:gap-8 py-6 border-t border-ink-200">
                  <dt className="mega text-lg">{role}</dt>
                  <dd className="text-ink-600 leading-relaxed">{desc}</dd>
                </div>
              ))}
              <div className="border-t border-ink-200" />
            </dl>
          </div>
        </div>
      </section>

      <section className="bg-void text-white py-20 sm:py-28">
        <div className="container-wide grid lg:grid-cols-2 gap-12 items-end">
          <h2 className="mega text-[clamp(2.25rem,7vw,5rem)] leading-[0.9]">
            How to<br /><span className="text-electric-500">join</span>
          </h2>
          <div>
            <p className="text-white/60 leading-relaxed text-lg">
              Create a free account, complete your health profile, then enter the
              six-character code your trainer gives you. That is the whole process.
            </p>
            <Link
              to="/signup"
              className="group mt-8 inline-flex items-center justify-between gap-6 bg-electric-500 hover:bg-electric-600 transition-colors pl-7 pr-2 py-2 min-h-[60px]"
            >
              <span className="text-[11px] font-bold uppercase tracking-[0.2em]">Create free account</span>
              <span className="grid place-items-center w-11 h-11 bg-void group-hover:rotate-45 transition-transform duration-300">
                <ArrowUpRight size={20} />
              </span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}