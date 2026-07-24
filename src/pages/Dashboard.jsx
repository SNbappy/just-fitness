import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus, Check, Flame, TrendingUp, TrendingDown, Users, CalendarCheck,
  Megaphone, ArrowUpRight, Percent, Activity, Dumbbell,
} from "lucide-react";
import { useAuth } from "../lib/AuthContext";
import { getDashboardData } from "../lib/dashboard";
import { computeStreak } from "../lib/logs";
import { firstName } from "../lib/names";
import { batchTypeLabel } from "../lib/batches";
import Spinner from "../components/Spinner";
import AppPageHeader from "../components/app/AppPageHeader";
import ProfileNudge from "../components/app/ProfileNudge";

function Stat({ label, value, unit, trend }) {
  return (
    <div className="p-6">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-faint">{label}</p>
      <p className="mt-3 mega text-4xl text-body tabular flex items-baseline gap-1.5">
        {value}
        {unit && value !== "—" && <span className="text-base text-faint">{unit}</span>}
        {trend != null && trend !== 0 && (
          <span className={`text-sm ${trend < 0 ? "text-emerald-600" : "text-amber-600"}`}>
            {trend < 0 ? <TrendingDown size={16} /> : <TrendingUp size={16} />}
          </span>
        )}
      </p>
    </div>
  );
}

export default function Dashboard() {
  const { user, profile } = useAuth();
  const [d, setD] = useState(null);
  const [loading, setLoading] = useState(true);

  const isTrainer = profile?.role === "trainer" || profile?.role === "admin";

  useEffect(() => {
    let active = true;
    async function load() {
      const data = await getDashboardData(user.id, isTrainer);
      if (active) { setD(data); setLoading(false); }
    }
    if (user && profile) load();
    return () => { active = false; };
  }, [user, profile, isTrainer]);

  if (loading || !d) return <Spinner full />;

  const streak = computeStreak(d.logs);
  const weights = d.logs.filter((l) => l.weight_kg != null);
  const latest = weights[0]?.weight_kg;
  const prev = weights[1]?.weight_kg;
  const trend = latest != null && prev != null ? latest - prev : null;

  const bmi = d.health?.current_weight_kg && d.health?.height_cm
    ? (d.health.current_weight_kg / Math.pow(d.health.height_cm / 100, 2)).toFixed(1)
    : null;

  const attended = d.attendance.filter((a) => a.status === "present" || a.status === "late").length;
  const rate = d.attendance.length ? Math.round((attended / d.attendance.length) * 100) : null;

  return (
    <>
      <AppPageHeader eyebrow={profile?.role} title="Welcome," accent={firstName(profile?.full_name)}>
        {!d.checkedInToday && (
          <Link to="/track" className="btn-primary"><Plus size={16} /> Check in</Link>
        )}
      </AppPageHeader>

      <div className="container-app py-10 space-y-6">
        <ProfileNudge />

        {/* Today */}
        <div className={`border px-6 py-5 flex items-center gap-4 ${d.checkedInToday ? "border-line bg-surface" : "border-electric-500 bg-electric-500/5"
          }`}>
          <span className={`grid place-items-center w-11 h-11 shrink-0 ${d.checkedInToday ? "bg-emerald-500/10 text-emerald-600" : "bg-electric-500 text-white"
            }`}>
            {d.checkedInToday ? <Check size={20} /> : <Plus size={20} />}
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-body">
              {d.checkedInToday ? "Checked in today" : "You haven't checked in today"}
            </p>
            <p className="text-xs text-muted mt-0.5">
              {d.checkedInToday
                ? d.todayLog?.workout_done ? "Workout logged. Nice work." : "Logged — add your workout if you trained."
                : "Takes under a minute. Weight, sleep, water, mood."}
            </p>
          </div>
          <Link to="/track" className={d.checkedInToday ? "btn-outline" : "btn-primary"}>
            {d.checkedInToday ? "Edit" : "Check in"}
          </Link>
        </div>

        {/* Personal stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 border border-line bg-surface divide-x divide-y lg:divide-y-0 divide-line">
          <Stat label="Current weight" value={d.health?.current_weight_kg ?? "—"} unit="kg" trend={trend} />
          <Stat label="BMI" value={bmi ?? "—"} />
          <Stat label="Log streak" value={streak} unit={streak === 1 ? "day" : "days"} />
          <Stat label="Attendance" value={rate ?? "—"} unit={rate != null ? "%" : ""} />
        </div>

        {/* Trainer / admin */}
        {isTrainer && d.trainerStats && (
          <div className="border border-line bg-surface">
            <div className="px-6 py-4 border-b border-line flex items-center justify-between">
              <h2 className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted">
                Batches I train
              </h2>
              <Link to="/batches" className="text-[10px] font-bold uppercase tracking-[0.2em] text-electric-600 hover:underline">
                Manage
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-line">
              <Stat label="Batches" value={d.trainerStats.batches} />
              <Stat label="Members" value={d.trainerStats.members} />
              <Stat label="Sessions held" value={d.trainerStats.sessions} />
              <Stat label="Attendance rate" value={d.trainerStats.rate ?? "—"} unit={d.trainerStats.rate != null ? "%" : ""} />
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-6">
          {/* My batches */}
          <div className="border border-line bg-surface">
            <div className="px-6 py-4 border-b border-line flex items-center justify-between">
              <h2 className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted">
                My batches
              </h2>
              <Link to="/batches" className="text-[10px] font-bold uppercase tracking-[0.2em] text-electric-600 hover:underline">
                All
              </Link>
            </div>

            {d.batches.length === 0 ? (
              <div className="p-10 text-center">
                <Users className="mx-auto text-faint" size={28} />
                <p className="mt-4 text-sm font-bold text-body">Not in a batch yet</p>
                <p className="mt-1 text-xs text-muted">Ask your trainer for the join code.</p>
                <Link to="/join-batch" className="btn-primary mt-5">Join a batch</Link>
              </div>
            ) : (
              <ul className="divide-y divide-line">
                {d.batches.slice(0, 4).map((b) => (
                  <li key={b.id}>
                    <Link to={`/batch/${b.id}`} className="group flex items-center gap-4 px-6 py-4 hover:bg-elevated transition-colors">
                      <span className="w-1 h-10 shrink-0" style={{ background: b.cover_color || "#2E6BFF" }} />
                      <span className="flex-1 min-w-0">
                        <span className="block text-sm font-bold text-body truncate">{b.name}</span>
                        <span className="block text-xs text-muted mt-0.5 truncate">
                          {batchTypeLabel(b.batch_type)}{b.schedule ? ` · ${b.schedule}` : ""}
                        </span>
                      </span>
                      <ArrowUpRight size={16} className="text-faint group-hover:text-electric-500 transition-colors shrink-0" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Latest announcement */}
          <div className="border border-line bg-surface">
            <div className="px-6 py-4 border-b border-line">
              <h2 className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted">
                Latest announcement
              </h2>
            </div>
            {d.latestPost ? (
              <div className="p-6">
                <p className="text-sm text-body leading-relaxed whitespace-pre-wrap line-clamp-5">
                  {d.latestPost.content}
                </p>
                <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.2em] text-faint">
                  {d.latestPost.profiles?.full_name || "Trainer"} ·{" "}
                  {new Date(d.latestPost.created_at).toLocaleDateString([], { day: "numeric", month: "short" })}
                </p>
                <Link to={`/batch/${d.latestPost.batch_id}`}
                  className="mt-5 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-electric-600 hover:underline">
                  Open batch <ArrowUpRight size={13} />
                </Link>
              </div>
            ) : (
              <div className="p-10 text-center">
                <Megaphone className="mx-auto text-faint" size={28} />
                <p className="mt-4 text-sm font-bold text-body">Nothing yet</p>
                <p className="mt-1 text-xs text-muted">
                  Announcements from your trainer will appear here.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Quick links */}
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { to: "/progress", icon: Activity, label: "Progress", desc: "Charts and trends" },
            { to: "/tools", icon: Dumbbell, label: "Tools", desc: "Timers and calculators" },
            { to: "/profile", icon: CalendarCheck, label: "Profile", desc: "Details and health data" },
          ].map((q) => (
            <Link key={q.to} to={q.to}
              className="group border border-line bg-surface p-6 hover:border-electric-400 transition-colors">
              <q.icon size={20} className="text-electric-500" />
              <p className="mt-4 mega text-xl text-body">{q.label}</p>
              <p className="mt-1 text-xs text-muted">{q.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}