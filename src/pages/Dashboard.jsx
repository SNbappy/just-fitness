import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Save, Check, ArrowUpRight, Users, TrendingUp, Plus } from "lucide-react";
import { firstName } from "../lib/names";
import { useAuth } from "../lib/AuthContext";
import { supabase } from "../lib/supabase";
import Spinner from "../components/Spinner";
import AppPageHeader from "../components/app/AppPageHeader";
import ProfileNudge from "../components/app/ProfileNudge";

const GOALS = [
  { value: "weight_loss", label: "Weight loss" },
  { value: "muscle_gain", label: "Muscle gain" },
  { value: "general_fitness", label: "General fitness" },
  { value: "sports_performance", label: "Sports performance" },
  { value: "rehabilitation", label: "Rehabilitation" },
];

const inputCls =
  "w-full border border-line bg-surface text-body px-4 py-3 text-sm placeholder:text-faint focus:outline-none focus:border-electric-500";
const labelCls =
  "block text-[10px] font-bold uppercase tracking-[0.2em] text-muted mb-2";

export default function Dashboard() {
  const { user, profile } = useAuth();
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let active = true;
    async function load() {
      const { data, error } = await supabase
        .from("health_profiles").select("*").eq("user_id", user.id).single();
      if (active && !error) setHealth(data);
      if (active) setLoading(false);
    }
    if (user) load();
    return () => { active = false; };
  }, [user]);

  function field(key, value) {
    setHealth((p) => ({ ...p, [key]: value }));
    setSaved(false);
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase.from("health_profiles").update({
      joining_weight_kg: health.joining_weight_kg || null,
      height_cm: health.height_cm || null,
      current_weight_kg: health.current_weight_kg || null,
      current_pulse: health.current_pulse || null,
      goal: health.goal || null,
      medical_conditions: health.medical_conditions || null,
      emergency_contact_name: health.emergency_contact_name || null,
      emergency_contact_phone: health.emergency_contact_phone || null,
      share_stats_with_batchmates: health.share_stats_with_batchmates,
      updated_at: new Date().toISOString(),
    }).eq("user_id", user.id);
    setSaving(false);
    if (!error) { setSaved(true); setTimeout(() => setSaved(false), 2500); }
  }

  const bmi = health?.current_weight_kg && health?.height_cm
    ? (health.current_weight_kg / Math.pow(health.height_cm / 100, 2)).toFixed(1)
    : null;

  const change = health?.current_weight_kg && health?.joining_weight_kg
    ? (health.current_weight_kg - health.joining_weight_kg).toFixed(1)
    : null;

  if (loading) return <Spinner full />;

  const stats = [
    { label: "Current weight", value: health?.current_weight_kg ? `${health.current_weight_kg}` : "—", unit: "kg" },
    { label: "Height", value: health?.height_cm ? `${health.height_cm}` : "—", unit: "cm" },
    { label: "BMI", value: bmi ?? "—", unit: "" },
    { label: "Morning pulse", value: health?.current_pulse ?? "—", unit: "bpm" },
  ];

  return (
    <>
      <AppPageHeader eyebrow={profile?.role} title="Welcome," accent={firstName(profile?.full_name)}>
        <Link to="/track" className="btn-primary"><Plus size={16} /> Check in</Link>
      </AppPageHeader>

      <div className="container-app py-10">
        <div className="mb-6"><ProfileNudge /></div>
        <div className="grid grid-cols-2 lg:grid-cols-4 border border-line bg-surface">
          {stats.map((s, i) => (
            <div key={s.label} className={`p-6 ${i % 2 === 1 ? "border-l" : ""} ${i >= 2 ? "border-t" : ""} lg:border-t-0 ${i > 0 ? "lg:border-l" : ""} border-line`}>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-faint">{s.label}</p>
              <p className="mt-3 mega text-4xl text-body tabular">
                {s.value}
                {s.unit && s.value !== "—" && (
                  <span className="text-lg text-faint ml-1.5">{s.unit}</span>
                )}
              </p>
            </div>
          ))}
        </div>

        {change && (
          <div className="mt-5 border border-line bg-surface p-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-faint">Since joining</p>
              <p className="mt-2 mega text-3xl text-body tabular">
                {change > 0 ? "+" : ""}{change} <span className="text-lg text-faint">kg</span>
              </p>
            </div>
            <Link to="/progress" className="btn-outline"><TrendingUp size={15} /> Progress</Link>
          </div>
        )}

        <div className="mt-5 grid sm:grid-cols-2 gap-5">
          <Link to="/batches" className="group border border-line bg-surface p-7 hover:border-electric-400 transition-colors">
            <Users size={22} className="text-electric-500" />
            <p className="mt-5 mega text-2xl text-body">My batches</p>
            <p className="mt-2 text-sm text-muted">View your training batches and join with a code.</p>
            <ArrowUpRight size={18} className="mt-4 text-faint group-hover:text-electric-500 group-hover:translate-x-0.5 transition-all" />
          </Link>
          <Link to="/track" className="group border border-line bg-surface p-7 hover:border-electric-400 transition-colors">
            <Plus size={22} className="text-electric-500" />
            <p className="mt-5 mega text-2xl text-body">Daily check-in</p>
            <p className="mt-2 text-sm text-muted">Log weight, pulse, sleep and water in under a minute.</p>
            <ArrowUpRight size={18} className="mt-4 text-faint group-hover:text-electric-500 group-hover:translate-x-0.5 transition-all" />
          </Link>
        </div>

        <form onSubmit={handleSave} className="mt-10 border border-line bg-surface">
          <div className="px-7 py-6 border-b border-line">
            <h2 className="mega text-2xl text-body">Health profile</h2>
            <p className="mt-2 text-sm text-muted">
              Private. Only you and the trainer of a batch you join can see this.
            </p>
          </div>

          <div className="p-7 grid sm:grid-cols-2 gap-6">
            <div>
              <label className={labelCls}>Weight at joining (kg)</label>
              <input type="number" step="0.1" value={health?.joining_weight_kg ?? ""}
                onChange={(e) => field("joining_weight_kg", e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Current weight (kg)</label>
              <input type="number" step="0.1" value={health?.current_weight_kg ?? ""}
                onChange={(e) => field("current_weight_kg", e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Height (cm)</label>
              <input type="number" step="0.1" value={health?.height_cm ?? ""}
                onChange={(e) => field("height_cm", e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Morning pulse (bpm)</label>
              <input type="number" value={health?.current_pulse ?? ""}
                onChange={(e) => field("current_pulse", e.target.value)} className={inputCls} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>Fitness goal</label>
              <select value={health?.goal ?? ""} onChange={(e) => field("goal", e.target.value)}
                className={inputCls}>
                <option value="">Select a goal</option>
                {GOALS.map((g) => <option key={g.value} value={g.value}>{g.label}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>Medical conditions / injuries</label>
              <textarea rows={2} value={health?.medical_conditions ?? ""}
                onChange={(e) => field("medical_conditions", e.target.value)}
                placeholder="Asthma, past knee injury, none" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Emergency contact name</label>
              <input value={health?.emergency_contact_name ?? ""}
                onChange={(e) => field("emergency_contact_name", e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Emergency contact phone</label>
              <input value={health?.emergency_contact_phone ?? ""}
                onChange={(e) => field("emergency_contact_phone", e.target.value)} className={inputCls} />
            </div>

            <label className="sm:col-span-2 flex items-start gap-3 cursor-pointer border-t border-line pt-6">
              <input type="checkbox" checked={health?.share_stats_with_batchmates ?? true}
                onChange={(e) => field("share_stats_with_batchmates", e.target.checked)}
                className="mt-0.5 w-5 h-5 accent-electric-500" />
              <span>
                <span className="block text-sm font-bold text-body">
                  Share weight, height, BMI and pulse with batchmates
                </span>
                <span className="block text-xs text-muted mt-1">
                  Your trainer always sees these. Medical notes and emergency contact are never shown to batchmates.
                </span>
              </span>
            </label>
          </div>

          <div className="px-7 py-6 border-t border-line flex items-center gap-4">
            <button type="submit" disabled={saving} className="btn-primary">
              <Save size={16} /> {saving ? "Saving" : "Save profile"}
            </button>
            {saved && (
              <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.15em] text-electric-600">
                <Check size={15} /> Saved
              </span>
            )}
          </div>
        </form>
      </div>
    </>
  );
}