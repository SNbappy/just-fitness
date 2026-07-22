import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Weight, HeartPulse, Moon, Droplets, Footprints, Smile,
  Zap, Dumbbell, Save, Check, Flame, CalendarDays,
} from "lucide-react";
import { useAuth } from "../lib/AuthContext";
import { getLog, saveLog, getLogRange, todayISO, computeStreak } from "../lib/logs";
import Spinner from "../components/Spinner";

const MOODS = ["😞", "🙁", "😐", "🙂", "😄"];

export default function Track() {
  const { user } = useAuth();
  const [date, setDate] = useState(todayISO());
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      const [{ data: log }, { data: all }] = await Promise.all([
        getLog(user.id, date),
        getLogRange(user.id, 120),
      ]);
      if (!active) return;
      setForm(log || {});
      setStreak(computeStreak(all));
      setLoading(false);
    }
    if (user) load();
    return () => { active = false; };
  }, [user, date]);

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    const { error } = await saveLog(user.id, date, form);
    setSaving(false);
    if (!error) {
      setSaved(true);
      const { data: all } = await getLogRange(user.id, 120);
      setStreak(computeStreak(all));
      setTimeout(() => setSaved(false), 2500);
    }
  }

  if (loading) return <Spinner full />;

  const input = "mt-1.5 w-full rounded-xl border border-ink-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500";

  return (
    <section className="section">
      <div className="container-app max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Daily Check-in</p>
            <h1 className="mt-2 text-3xl font-extrabold text-ink-900">How was today?</h1>
            <p className="mt-1 text-ink-500 text-sm">Takes 30 seconds. Fill in what you know, skip the rest.</p>
          </div>
          {streak > 0 && (
            <div className="flex items-center gap-2 bg-secondary-50 text-secondary-700 px-4 py-2.5 rounded-xl shrink-0">
              <Flame size={20} />
              <span className="font-extrabold">{streak}</span>
              <span className="text-xs font-semibold">day streak</span>
            </div>
          )}
        </motion.div>

        <form onSubmit={handleSave} className="mt-7 space-y-5">
          <div className="card p-5">
            <label className="text-xs font-bold uppercase tracking-wider text-ink-400">Date</label>
            <div className="mt-1.5 relative">
              <CalendarDays size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
              <input type="date" value={date} max={todayISO()}
                onChange={(e) => setDate(e.target.value)}
                className="rounded-xl border border-ink-200 pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
          </div>

          <div className="card p-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-ink-400">Body</h2>
            <div className="mt-4 grid sm:grid-cols-2 gap-5">
              <Field icon={Weight} label="Weight (kg)">
                <input type="number" step="0.1" value={form.weight_kg ?? ""}
                  onChange={(e) => set("weight_kg", e.target.value)} className={input} placeholder="e.g. 68.5" />
              </Field>
              <Field icon={HeartPulse} label="Morning Pulse (bpm)">
                <input type="number" value={form.pulse ?? ""}
                  onChange={(e) => set("pulse", e.target.value)} className={input} placeholder="e.g. 68" />
              </Field>
            </div>
          </div>

          <div className="card p-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-ink-400">Habits</h2>
            <div className="mt-4 grid sm:grid-cols-2 gap-5">
              <Field icon={Moon} label="Sleep (hours)">
                <input type="number" step="0.5" value={form.sleep_hours ?? ""}
                  onChange={(e) => set("sleep_hours", e.target.value)} className={input} placeholder="e.g. 7" />
              </Field>
              <Field icon={Footprints} label="Steps">
                <input type="number" value={form.steps ?? ""}
                  onChange={(e) => set("steps", e.target.value)} className={input} placeholder="e.g. 6000" />
              </Field>
            </div>

            <div className="mt-5">
              <p className="text-sm font-semibold text-ink-700 flex items-center gap-2">
                <Droplets size={16} className="text-blue-500" /> Water (glasses)
              </p>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                  <button key={n} type="button"
                    onClick={() => set("water_glasses", form.water_glasses === n ? null : n)}
                    className={`w-9 h-9 rounded-lg text-sm font-bold transition-all ${
                      (form.water_glasses ?? 0) >= n
                        ? "bg-blue-500 text-white scale-105" : "bg-ink-100 text-ink-400 hover:bg-ink-200"
                    }`}>
                    {n}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-ink-400">How you felt</h2>

            <div className="mt-4">
              <p className="text-sm font-semibold text-ink-700 flex items-center gap-2">
                <Smile size={16} className="text-amber-500" /> Mood
              </p>
              <div className="mt-2.5 flex gap-2">
                {MOODS.map((emoji, i) => (
                  <button key={i} type="button"
                    onClick={() => set("mood", form.mood === i + 1 ? null : i + 1)}
                    className={`w-12 h-12 rounded-xl text-2xl transition-all ${
                      form.mood === i + 1 ? "bg-amber-100 scale-110 ring-2 ring-amber-400" : "bg-ink-50 hover:bg-ink-100"
                    }`}>
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5">
              <p className="text-sm font-semibold text-ink-700 flex items-center gap-2">
                <Zap size={16} className="text-violet-500" /> Energy
              </p>
              <div className="mt-2.5 flex gap-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} type="button"
                    onClick={() => set("energy", form.energy === n ? null : n)}
                    className={`w-12 h-12 rounded-xl font-bold transition-all ${
                      form.energy === n ? "bg-violet-500 text-white scale-110" : "bg-ink-50 text-ink-400 hover:bg-ink-100"
                    }`}>
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <button type="button" onClick={() => set("workout_done", !form.workout_done)}
              className={`mt-6 w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                form.workout_done
                  ? "border-primary-500 bg-primary-50 text-primary-700"
                  : "border-ink-200 text-ink-500 hover:border-ink-300"
              }`}>
              <span className={`grid place-items-center w-10 h-10 rounded-xl ${
                form.workout_done ? "bg-primary-500 text-white" : "bg-ink-100"
              }`}>
                <Dumbbell size={19} />
              </span>
              <span className="font-bold">
                {form.workout_done ? "Workout done today" : "Did you work out today?"}
              </span>
              {form.workout_done && <Check size={20} className="ml-auto" />}
            </button>

            <div className="mt-5">
              <label className="text-sm font-semibold text-ink-700">Notes</label>
              <textarea rows={2} value={form.notes ?? ""} onChange={(e) => set("notes", e.target.value)}
                placeholder="Anything worth remembering about today…" className={input} />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button type="submit" disabled={saving} className="btn-primary flex-1">
              <Save size={18} /> {saving ? "Saving…" : "Save Check-in"}
            </button>
            {saved && (
              <span className="flex items-center gap-1.5 text-sm font-semibold text-primary-600">
                <Check size={17} /> Saved
              </span>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}

function Field({ icon: Icon, label, children }) {
  return (
    <div>
      <label className="text-sm font-semibold text-ink-700 flex items-center gap-2">
        <Icon size={16} className="text-ink-400" /> {label}
      </label>
      {children}
    </div>
  );
}
