import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, Weight, Ruler, Activity, HeartPulse, Target,
  Phone, ShieldAlert, Lock,
} from "lucide-react";
import { useAuth } from "../lib/AuthContext";
import { supabase } from "../lib/supabase";
import Spinner from "../components/Spinner";

const GOAL_LABELS = {
  weight_loss: "Weight Loss",
  muscle_gain: "Muscle Gain",
  general_fitness: "General Fitness",
  sports_performance: "Sports Performance",
  rehabilitation: "Rehabilitation",
};

export default function MemberProfile() {
  const { id: batchId, userId } = useParams();
  const { user, profile: me } = useAuth();
  const [person, setPerson] = useState(null);
  const [health, setHealth] = useState(null);
  const [isTrainer, setIsTrainer] = useState(false);
  const [loading, setLoading] = useState(true);

  const isSelf = user?.id === userId;

  useEffect(() => {
    let active = true;

    async function load() {
      const { data: p } = await supabase
        .from("profiles").select("*").eq("id", userId).single();
      if (active) setPerson(p);

      const { data: b } = await supabase
        .from("batches").select("trainer_id").eq("id", batchId).single();
      const trainerHere = b?.trainer_id === user?.id || me?.role === "admin";
      if (active) setIsTrainer(trainerHere);

      // RLS decides what actually comes back — no data leaks even if the UI is wrong
      const { data: h } = await supabase
        .from("health_profiles").select("*").eq("user_id", userId).maybeSingle();
      if (active) { setHealth(h); setLoading(false); }
    }

    load();
    return () => { active = false; };
  }, [userId, batchId, user, me]);

  if (loading) return <Spinner full />;
  if (!person) return <div className="section container-app text-center text-ink-500">Member not found.</div>;

  const canSeeVitals = isSelf || isTrainer || health?.share_stats_with_batchmates;
  const canSeeMedical = isSelf || isTrainer;

  const bmi = health?.current_weight_kg && health?.height_cm
    ? (health.current_weight_kg / Math.pow(health.height_cm / 100, 2)).toFixed(1)
    : null;

  const weightChange = health?.current_weight_kg && health?.joining_weight_kg
    ? (health.current_weight_kg - health.joining_weight_kg).toFixed(1)
    : null;

  return (
    <section className="section">
      <div className="container-app max-w-3xl">
        <Link to={`/batch/${batchId}`} className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-primary-600">
          <ArrowLeft size={16} /> Back to batch
        </Link>

        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
          className="mt-5 card p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left">
          {person.photo_url ? (
            <img src={person.photo_url} alt={person.full_name} className="w-24 h-24 rounded-2xl object-cover" />
          ) : (
            <span className="grid place-items-center w-24 h-24 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 text-white text-2xl font-extrabold shrink-0">
              {person.full_name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase()}
            </span>
          )}
          <div className="min-w-0">
            <h1 className="text-2xl font-extrabold text-ink-900">{person.full_name}</h1>
            <p className="mt-1 text-ink-500 text-sm">
              {person.department || "Department not set"}
              {person.student_id ? ` · ${person.student_id}` : ""}
            </p>
            <div className="mt-3 flex flex-wrap gap-2 justify-center sm:justify-start">
              <span className="text-xs font-bold uppercase tracking-wider bg-ink-100 text-ink-600 px-2.5 py-1 rounded-md capitalize">
                {person.role}
              </span>
              {person.blood_group && (
                <span className="text-xs font-bold uppercase tracking-wider bg-red-50 text-red-600 px-2.5 py-1 rounded-md">
                  {person.blood_group}
                </span>
              )}
              {health?.goal && (
                <span className="text-xs font-bold uppercase tracking-wider bg-primary-50 text-primary-700 px-2.5 py-1 rounded-md">
                  {GOAL_LABELS[health.goal]}
                </span>
              )}
            </div>
          </div>
        </motion.div>

        {canSeeVitals && health ? (
          <>
            <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Stat icon={Weight} label="Current Weight" value={health.current_weight_kg ? `${health.current_weight_kg} kg` : "—"} color="bg-blue-50 text-blue-600" />
              <Stat icon={Ruler} label="Height" value={health.height_cm ? `${health.height_cm} cm` : "—"} color="bg-violet-50 text-violet-600" />
              <Stat icon={Activity} label="BMI" value={bmi ?? "—"} color="bg-primary-50 text-primary-600" />
              <Stat icon={HeartPulse} label="Morning Pulse" value={health.current_pulse ? `${health.current_pulse} bpm` : "—"} color="bg-rose-50 text-rose-600" />
            </div>

            {weightChange && (
              <div className="mt-4 card p-5 flex items-center gap-4">
                <span className="grid place-items-center w-11 h-11 rounded-xl bg-amber-50 text-amber-600">
                  <Target size={20} />
                </span>
                <div>
                  <p className="text-sm font-bold text-ink-900">
                    {weightChange > 0 ? "+" : ""}{weightChange} kg since joining
                  </p>
                  <p className="text-xs text-ink-500">
                    Started at {health.joining_weight_kg} kg
                    {health.joined_club_at ? ` on ${new Date(health.joined_club_at).toLocaleDateString()}` : ""}
                  </p>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="mt-6 card p-8 text-center">
            <Lock className="mx-auto text-ink-300" size={30} />
            <p className="mt-3 font-semibold text-ink-600">Health stats are private</p>
            <p className="text-sm text-ink-400 mt-1">
              This member has chosen not to share their vitals with batchmates.
            </p>
          </div>
        )}

        {canSeeMedical && health && (health.medical_conditions || health.emergency_contact_phone) && (
          <div className="mt-6 card p-6 border-l-4 border-l-amber-400">
            <p className="text-sm font-bold uppercase tracking-wider text-amber-600 flex items-center gap-2">
              <ShieldAlert size={16} /> Trainer-only information
            </p>
            {health.medical_conditions && (
              <div className="mt-4">
                <p className="text-xs font-bold uppercase tracking-wider text-ink-400">Medical Conditions / Injuries</p>
                <p className="mt-1 text-ink-700">{health.medical_conditions}</p>
              </div>
            )}
            {health.emergency_contact_phone && (
              <div className="mt-4">
                <p className="text-xs font-bold uppercase tracking-wider text-ink-400">Emergency Contact</p>
                <p className="mt-1 text-ink-700 flex items-center gap-2">
                  <Phone size={15} className="text-ink-400" />
                  {health.emergency_contact_name || "Contact"} — {health.emergency_contact_phone}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function Stat({ icon: Icon, label, value, color }) {
  return (
    <div className="card p-5">
      <span className={`grid place-items-center w-11 h-11 rounded-xl ${color}`}>
        <Icon size={20} />
      </span>
      <p className="mt-3 text-xl font-extrabold text-ink-900">{value}</p>
      <p className="text-xs text-ink-500 font-semibold">{label}</p>
    </div>
  );
}
