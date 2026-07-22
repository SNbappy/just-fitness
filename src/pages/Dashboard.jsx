import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Save, CheckCircle2, HeartPulse, Ruler, Weight, Activity } from "lucide-react";
import { useAuth } from "../lib/AuthContext";
import { supabase } from "../lib/supabase";

const GOALS = [
  { value: "weight_loss", label: "Weight Loss" },
  { value: "muscle_gain", label: "Muscle Gain" },
  { value: "general_fitness", label: "General Fitness" },
  { value: "sports_performance", label: "Sports Performance" },
  { value: "rehabilitation", label: "Rehabilitation" },
];

export default function Dashboard() {
  const { user, profile, refreshProfile } = useAuth();
  const [health, setHealth] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function load() {
      const { data, error } = await supabase
        .from("health_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();
      if (active && !error) setHealth(data);
      if (active) setLoading(false);
    }

    if (user) load();

    return () => {
      active = false;
    };
  }, [user]);

  function field(key, value) {
    setHealth((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase
      .from("health_profiles")
      .update({
        joining_weight_kg: health.joining_weight_kg || null,
        height_cm: health.height_cm || null,
        joining_pulse: health.joining_pulse || null,
        current_weight_kg: health.current_weight_kg || null,
        current_pulse: health.current_pulse || null,
        goal: health.goal || null,
        medical_conditions: health.medical_conditions || null,
        emergency_contact_name: health.emergency_contact_name || null,
        emergency_contact_phone: health.emergency_contact_phone || null,
        share_stats_with_batchmates: health.share_stats_with_batchmates,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id);
    setSaving(false);
    if (!error) setSaved(true);
  }

  const bmi =
    health?.current_weight_kg && health?.height_cm
      ? (health.current_weight_kg / Math.pow(health.height_cm / 100, 2)).toFixed(1)
      : null;

  if (loading) {
    return (
      <div className="min-h-[60vh] grid place-items-center">
        <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <section className="section">
      <div className="container-app">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <p className="eyebrow">Dashboard</p>
          <h1 className="mt-2 text-3xl font-extrabold text-ink-900">
            Welcome, {profile?.full_name?.split(" ")[0] || "there"} 👋
          </h1>
          <p className="mt-1 text-ink-500 capitalize">Role: {profile?.role}</p>
        </motion.div>

        {/* Quick stat cards */}
        <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Weight, label: "Current Weight", value: health?.current_weight_kg ? `${health.current_weight_kg} kg` : "—", color: "bg-blue-50 text-blue-600" },
            { icon: Ruler, label: "Height", value: health?.height_cm ? `${health.height_cm} cm` : "—", color: "bg-violet-50 text-violet-600" },
            { icon: Activity, label: "BMI", value: bmi ?? "—", color: "bg-primary-50 text-primary-600" },
            { icon: HeartPulse, label: "Morning Pulse", value: health?.current_pulse ? `${health.current_pulse} bpm` : "—", color: "bg-rose-50 text-rose-600" },
          ].map((s) => (
            <div key={s.label} className="card p-5">
              <span className={`grid place-items-center w-11 h-11 rounded-xl ${s.color}`}>
                <s.icon size={20} />
              </span>
              <p className="mt-3 text-xl font-extrabold text-ink-900">{s.value}</p>
              <p className="text-xs text-ink-500 font-semibold">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Health profile form */}
        <form onSubmit={handleSave} className="mt-8 card p-6 sm:p-8">
          <h2 className="text-lg font-extrabold text-ink-900">Health Profile</h2>
          <p className="text-sm text-ink-500 mt-1">
            This information is private. Only you, and the trainer of a batch you join, can see it.
          </p>

          <div className="mt-6 grid sm:grid-cols-2 gap-5">
            <div>
              <label className="text-sm font-semibold text-ink-700">Weight at Joining (kg)</label>
              <input
                type="number" step="0.1"
                value={health?.joining_weight_kg ?? ""}
                onChange={(e) => field("joining_weight_kg", e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-ink-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-ink-700">Current Weight (kg)</label>
              <input
                type="number" step="0.1"
                value={health?.current_weight_kg ?? ""}
                onChange={(e) => field("current_weight_kg", e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-ink-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-ink-700">Height (cm)</label>
              <input
                type="number" step="0.1"
                value={health?.height_cm ?? ""}
                onChange={(e) => field("height_cm", e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-ink-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-ink-700">Morning Pulse (bpm)</label>
              <input
                type="number"
                value={health?.current_pulse ?? ""}
                onChange={(e) => field("current_pulse", e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-ink-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm font-semibold text-ink-700">Fitness Goal</label>
              <select
                value={health?.goal ?? ""}
                onChange={(e) => field("goal", e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-ink-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
              >
                <option value="">Select a goal…</option>
                {GOALS.map((g) => (
                  <option key={g.value} value={g.value}>{g.label}</option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm font-semibold text-ink-700">Medical Conditions / Injuries</label>
              <textarea
                rows={2}
                value={health?.medical_conditions ?? ""}
                onChange={(e) => field("medical_conditions", e.target.value)}
                placeholder="Asthma, past knee injury, none, etc."
                className="mt-1.5 w-full rounded-xl border border-ink-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-ink-700">Emergency Contact Name</label>
              <input
                value={health?.emergency_contact_name ?? ""}
                onChange={(e) => field("emergency_contact_name", e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-ink-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-ink-700">Emergency Contact Phone</label>
              <input
                value={health?.emergency_contact_phone ?? ""}
                onChange={(e) => field("emergency_contact_phone", e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-ink-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-ink-100">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={health?.share_stats_with_batchmates ?? true}
                onChange={(e) => field("share_stats_with_batchmates", e.target.checked)}
                className="mt-1 w-5 h-5 rounded accent-primary-600"
              />
              <span>
                <span className="block text-sm font-semibold text-ink-800">
                  Share my weight, height, BMI and pulse with batchmates
                </span>
                <span className="block text-xs text-ink-500 mt-0.5">
                  Your trainer can always see these. Medical notes and emergency contact are never shown to batchmates.
                </span>
              </span>
            </label>
          </div>

          <div className="mt-6 flex items-center gap-4">
            <button type="submit" disabled={saving} className="btn-primary">
              <Save size={18} /> {saving ? "Saving…" : "Save Health Profile"}
            </button>
            {saved && (
              <span className="flex items-center gap-1.5 text-sm font-semibold text-primary-600">
                <CheckCircle2 size={17} /> Saved
              </span>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
