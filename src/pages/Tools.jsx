import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Timer, Repeat, Hourglass, Scale, Flame, Percent, Dumbbell,
  PieChart, Droplets, HeartPulse, ArrowLeftRight, X, ChevronRight,
} from "lucide-react";
import Stopwatch from "../components/tools/Stopwatch";
import IntervalTimer from "../components/tools/IntervalTimer";
import Countdown from "../components/tools/Countdown";
import {
  BMICalc, TDEECalc, BodyFatCalc, OneRepMaxCalc,
  MacroCalc, WaterCalc, HeartRateCalc, UnitConverter,
} from "../components/tools/Calculators";

const TOOLS = [
  { key: "stopwatch", name: "Stopwatch", desc: "Laps and split times", icon: Timer, color: "from-primary-500 to-primary-700", group: "Timers", C: Stopwatch },
  { key: "interval", name: "Interval Timer", desc: "Tabata, HIIT, EMOM", icon: Repeat, color: "from-secondary-500 to-secondary-600", group: "Timers", C: IntervalTimer },
  { key: "countdown", name: "Rest Timer", desc: "Countdown between sets", icon: Hourglass, color: "from-blue-500 to-blue-700", group: "Timers", C: Countdown },
  { key: "bmi", name: "BMI", desc: "Body mass index", icon: Scale, color: "from-violet-500 to-violet-700", group: "Calculators", C: BMICalc },
  { key: "tdee", name: "Calorie Needs", desc: "BMR and maintenance", icon: Flame, color: "from-orange-500 to-orange-600", group: "Calculators", C: TDEECalc },
  { key: "bodyfat", name: "Body Fat", desc: "Navy tape method", icon: Percent, color: "from-rose-500 to-rose-600", group: "Calculators", C: BodyFatCalc },
  { key: "orm", name: "One Rep Max", desc: "Estimate your 1RM", icon: Dumbbell, color: "from-ink-600 to-ink-800", group: "Calculators", C: OneRepMaxCalc },
  { key: "macro", name: "Macros", desc: "Protein, carbs, fat", icon: PieChart, color: "from-emerald-500 to-emerald-700", group: "Calculators", C: MacroCalc },
  { key: "water", name: "Water Intake", desc: "Daily target", icon: Droplets, color: "from-sky-500 to-sky-700", group: "Calculators", C: WaterCalc },
  { key: "hr", name: "Heart Rate Zones", desc: "Training zones", icon: HeartPulse, color: "from-red-500 to-red-600", group: "Calculators", C: HeartRateCalc },
  { key: "units", name: "Unit Converter", desc: "kg ↔ lb, cm ↔ ft", icon: ArrowLeftRight, color: "from-slate-500 to-slate-700", group: "Calculators", C: UnitConverter },
];

export default function Tools() {
  const [active, setActive] = useState(null);
  const tool = TOOLS.find((t) => t.key === active);
  const groups = [...new Set(TOOLS.map((t) => t.group))];

  return (
    <section className="section">
      <div className="container-app">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
          <p className="eyebrow">Everything in one place</p>
          <h1 className="mt-2 text-3xl font-extrabold text-body">Fitness Tools</h1>
          <p className="mt-2 text-muted">Timers and calculators — no other app needed.</p>
        </motion.div>

        {groups.map((g) => (
          <div key={g} className="mt-10">
            <h2 className="text-sm font-bold uppercase tracking-wider text-faint">{g}</h2>
            <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {TOOLS.filter((t) => t.group === g).map((t, i) => (
                <motion.button
                  key={t.key}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (i % 3) * 0.06 }}
                  onClick={() => setActive(t.key)}
                  className="card p-5 text-left group hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <span className={`grid place-items-center w-12 h-12 rounded-2xl bg-gradient-to-br ${t.color} text-white shrink-0 group-hover:scale-110 transition-transform`}>
                      <t.icon size={22} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-body">{t.name}</p>
                      <p className="text-xs text-muted mt-0.5">{t.desc}</p>
                    </div>
                    <ChevronRight size={17} className="text-faint group-hover:text-primary-600 group-hover:translate-x-0.5 transition-all shrink-0" />
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {tool && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-ink-900/60 backdrop-blur-sm grid place-items-center p-4 overflow-y-auto"
            onClick={() => setActive(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-surface rounded-2xl w-full max-w-lg my-8"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-line">
                <div className="flex items-center gap-3">
                  <span className={`grid place-items-center w-10 h-10 rounded-xl bg-gradient-to-br ${tool.color} text-white`}>
                    <tool.icon size={19} />
                  </span>
                  <h3 className="font-extrabold text-body">{tool.name}</h3>
                </div>
                <button onClick={() => setActive(null)}
                  className="grid place-items-center w-9 h-9 rounded-lg hover:bg-elevated text-muted">
                  <X size={19} />
                </button>
              </div>
              <div className="p-6">
                <tool.C />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
