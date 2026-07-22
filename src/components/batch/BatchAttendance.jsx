import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, X, Clock, Save, CalendarDays, Flame, TrendingUp } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../lib/AuthContext";
import Spinner from "../Spinner";

const STATUSES = [
  { value: "present", label: "P", icon: Check, cls: "bg-primary-500/100 text-white", idle: "hover:bg-primary-500/10 text-primary-600" },
  { value: "late", label: "L", icon: Clock, cls: "bg-amber-500 text-white", idle: "hover:bg-amber-50 text-amber-600" },
  { value: "absent", label: "A", icon: X, cls: "bg-red-500 text-white", idle: "hover:bg-red-50 text-red-500" },
];

function today() {
  return new Date().toISOString().slice(0, 10);
}

export default function BatchAttendance({ batchId, roster, isTrainer }) {
  const { user } = useAuth();
  const [date, setDate] = useState(today());
  const [marks, setMarks] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load existing marks for the selected date (trainer view)
  useEffect(() => {
    if (!isTrainer) return;
    let active = true;
    async function load() {
      const { data } = await supabase
        .from("attendance").select("user_id, status")
        .eq("batch_id", batchId).eq("session_date", date);
      if (!active) return;
      const map = {};
      (data || []).forEach((r) => { map[r.user_id] = r.status; });
      setMarks(map);
      setLoading(false);
    }
    load();
    return () => { active = false; };
  }, [batchId, date, isTrainer]);

  // Load own history (member view)
  useEffect(() => {
    if (isTrainer) return;
    let active = true;
    async function load() {
      const { data } = await supabase
        .from("attendance").select("session_date, status")
        .eq("batch_id", batchId).eq("user_id", user.id)
        .order("session_date", { ascending: false }).limit(60);
      if (active) { setHistory(data || []); setLoading(false); }
    }
    load();
    return () => { active = false; };
  }, [batchId, user, isTrainer]);

  async function saveAll() {
    setSaving(true);
    const rows = Object.entries(marks).map(([userId, status]) => ({
      batch_id: batchId, user_id: userId, session_date: date,
      status, marked_by: user.id,
    }));
    if (rows.length) {
      await supabase.from("attendance").upsert(rows, { onConflict: "batch_id,user_id,session_date" });
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function markAllPresent() {
    const map = {};
    roster.forEach((m) => { map[m.profiles.id] = "present"; });
    setMarks(map);
    setSaved(false);
  }

  if (loading) return <Spinner />;

  // ---------- TRAINER VIEW ----------
  if (isTrainer) {
    const counts = Object.values(marks).reduce((a, s) => ({ ...a, [s]: (a[s] || 0) + 1 }), {});
    return (
      <div>
        <div className="card p-5 flex flex-col sm:flex-row gap-4 sm:items-end justify-between">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-faint">Session Date</label>
            <div className="mt-1.5 relative">
              <CalendarDays size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-faint" />
              <input type="date" value={date} max={today()}
                onChange={(e) => { setDate(e.target.value); setSaved(false); }}
                className="rounded-xl border border-line pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={markAllPresent} className="btn-outline text-sm">Mark all present</button>
            <button onClick={saveAll} disabled={saving} className="btn-primary text-sm">
              <Save size={16} /> {saving ? "Saving…" : saved ? "Saved" : "Save"}
            </button>
          </div>
        </div>

        {Object.keys(marks).length > 0 && (
          <div className="mt-4 flex gap-3 text-xs font-bold">
            <span className="px-3 py-1.5 rounded-lg bg-primary-500/10 text-primary-700">Present {counts.present || 0}</span>
            <span className="px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700">Late {counts.late || 0}</span>
            <span className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600">Absent {counts.absent || 0}</span>
          </div>
        )}

        {roster.length === 0 ? (
          <div className="card p-10 text-center mt-5 text-muted">No members to mark yet.</div>
        ) : (
          <div className="mt-5 card divide-y divide-line">
            {roster.map((m) => (
              <div key={m.id} className="p-4 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold text-body text-sm truncate">{m.profiles.full_name}</p>
                  <p className="text-xs text-faint truncate">{m.profiles.department || "—"}</p>
                </div>
                <div className="flex gap-1.5 shrink-0">
                  {STATUSES.map((s) => {
                    const active = marks[m.profiles.id] === s.value;
                    return (
                      <button
                        key={s.value}
                        onClick={() => { setMarks((p) => ({ ...p, [m.profiles.id]: s.value })); setSaved(false); }}
                        className={`grid place-items-center w-10 h-10 rounded-xl font-bold text-sm transition-all ${
                          active ? s.cls + " scale-105" : "bg-elevated " + s.idle
                        }`}
                        title={s.value}
                      >
                        <s.icon size={17} />
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ---------- MEMBER VIEW ----------
  const present = history.filter((h) => h.status === "present" || h.status === "late").length;
  const rate = history.length ? Math.round((present / history.length) * 100) : 0;

  let streak = 0;
  for (const h of history) {
    if (h.status === "present" || h.status === "late") streak++;
    else break;
  }

  return (
    <div>
      <div className="grid grid-cols-3 gap-4">
        <StatCard icon={TrendingUp} label="Attendance" value={history.length ? `${rate}%` : "—"} color="bg-primary-500/10 text-primary-600" />
        <StatCard icon={Flame} label="Current Streak" value={streak} color="bg-secondary-500/10 text-secondary-600" />
        <StatCard icon={CalendarDays} label="Sessions" value={history.length} color="bg-blue-50 text-blue-600" />
      </div>

      {history.length === 0 ? (
        <div className="card p-10 text-center mt-5">
          <CalendarDays className="mx-auto text-faint" size={34} />
          <p className="mt-3 font-semibold text-muted">No attendance recorded yet</p>
          <p className="text-sm text-faint mt-1">Your trainer marks attendance after each session.</p>
        </div>
      ) : (
        <div className="mt-5 card p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-faint mb-4">Recent Sessions</p>
          <div className="space-y-2">
            {history.slice(0, 20).map((h) => (
              <motion.div key={h.session_date} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex items-center justify-between py-2 border-b border-ink-50 last:border-0">
                <span className="text-sm text-body">
                  {new Date(h.session_date).toLocaleDateString([], { weekday: "short", day: "numeric", month: "short" })}
                </span>
                <StatusBadge status={h.status} />
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="card p-4 sm:p-5">
      <span className={`grid place-items-center w-10 h-10 rounded-xl ${color}`}>
        <Icon size={18} />
      </span>
      <p className="mt-3 text-xl font-extrabold text-body">{value}</p>
      <p className="text-[11px] text-muted font-semibold">{label}</p>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    present: "bg-primary-500/10 text-primary-700",
    late: "bg-amber-50 text-amber-700",
    absent: "bg-red-50 text-red-600",
    excused: "bg-elevated text-muted",
  };
  return (
    <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md capitalize ${map[status]}`}>
      {status}
    </span>
  );
}
