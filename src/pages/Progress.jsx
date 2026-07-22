import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from "recharts";
import { TrendingUp, Activity, Moon, Droplets, Dumbbell, Flame } from "lucide-react";
import { useAuth } from "../lib/AuthContext";
import { getLogRange, computeStreak } from "../lib/logs";
import Spinner from "../components/Spinner";

const RANGES = [
  { label: "7 days", days: 7 },
  { label: "30 days", days: 30 },
  { label: "90 days", days: 90 },
  { label: "All", days: null },
];

export default function Progress() {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [range, setRange] = useState(30);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      const { data } = await getLogRange(user.id, range);
      if (active) { setLogs(data); setLoading(false); }
    }
    if (user) load();
    return () => { active = false; };
  }, [user, range]);

  if (loading) return <Spinner full />;

  const fmt = (d) => new Date(d).toLocaleDateString([], { day: "numeric", month: "short" });
  const chartData = logs.map((l) => ({ ...l, date: fmt(l.log_date) }));

  const weights = logs.filter((l) => l.weight_kg != null);
  const change = weights.length >= 2
    ? (weights[weights.length - 1].weight_kg - weights[0].weight_kg).toFixed(1)
    : null;

  const workouts = logs.filter((l) => l.workout_done).length;
  const avgSleep = avg(logs.map((l) => l.sleep_hours));
  const streak = computeStreak(logs);

  return (
    <section className="section">
      <div className="container-app">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
          <p className="eyebrow">Your Progress</p>
          <h1 className="mt-2 text-3xl font-extrabold text-ink-900">Progress</h1>
        </motion.div>

        <div className="mt-6 flex gap-2 overflow-x-auto scrollbar-hide">
          {RANGES.map((r) => (
            <button key={r.label} onClick={() => setRange(r.days)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors ${
                range === r.days ? "bg-primary-500 text-white" : "bg-white text-ink-600 border border-ink-200 hover:bg-ink-50"
              }`}>
              {r.label}
            </button>
          ))}
        </div>

        {logs.length === 0 ? (
          <div className="mt-8 card p-12 text-center">
            <TrendingUp className="mx-auto text-ink-300" size={38} />
            <p className="mt-3 font-semibold text-ink-600">No data yet</p>
            <p className="text-sm text-ink-400 mt-1">
              Save a few daily check-ins and your charts will appear here.
            </p>
          </div>
        ) : (
          <>
            <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Stat icon={TrendingUp} label="Weight Change"
                value={change === null ? "—" : `${change > 0 ? "+" : ""}${change} kg`}
                color="bg-blue-50 text-blue-600" />
              <Stat icon={Dumbbell} label="Workouts" value={workouts} color="bg-primary-50 text-primary-600" />
              <Stat icon={Moon} label="Avg Sleep" value={avgSleep ? `${avgSleep} h` : "—"} color="bg-violet-50 text-violet-600" />
              <Stat icon={Flame} label="Log Streak" value={streak} color="bg-secondary-50 text-secondary-600" />
            </div>

            <div className="mt-6 space-y-5">
              <ChartCard title="Weight" unit="kg" icon={TrendingUp}>
                <LineChart data={chartData.filter((d) => d.weight_kg != null)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
                  <YAxis domain={["dataMin - 1", "dataMax + 1"]} tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} width={38} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Line type="monotone" dataKey="weight_kg" stroke="#0E9F6E" strokeWidth={2.5}
                    dot={{ r: 3, fill: "#0E9F6E" }} activeDot={{ r: 5 }} name="Weight" />
                </LineChart>
              </ChartCard>

              <ChartCard title="Morning Pulse" unit="bpm" icon={Activity}>
                <LineChart data={chartData.filter((d) => d.pulse != null)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} width={38} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Line type="monotone" dataKey="pulse" stroke="#EF4444" strokeWidth={2.5}
                    dot={{ r: 3, fill: "#EF4444" }} name="Pulse" />
                </LineChart>
              </ChartCard>

              <ChartCard title="Sleep" unit="hours" icon={Moon}>
                <BarChart data={chartData.filter((d) => d.sleep_hours != null)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} width={38} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="sleep_hours" fill="#8B5CF6" radius={[6, 6, 0, 0]} name="Sleep" />
                </BarChart>
              </ChartCard>

              <ChartCard title="Water" unit="glasses" icon={Droplets}>
                <BarChart data={chartData.filter((d) => d.water_glasses != null)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} width={38} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="water_glasses" fill="#3B82F6" radius={[6, 6, 0, 0]} name="Water" />
                </BarChart>
              </ChartCard>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

const tooltipStyle = {
  borderRadius: 12, border: "1px solid #e2e8f0",
  boxShadow: "0 4px 24px -4px rgba(15,23,42,0.1)", fontSize: 13,
};

function avg(arr) {
  const nums = arr.filter((n) => n != null).map(Number);
  if (!nums.length) return null;
  return (nums.reduce((a, b) => a + b, 0) / nums.length).toFixed(1);
}

function Stat({ icon: Icon, label, value, color }) {
  return (
    <div className="card p-5">
      <span className={`grid place-items-center w-10 h-10 rounded-xl ${color}`}>
        <Icon size={18} />
      </span>
      <p className="mt-3 text-xl font-extrabold text-ink-900">{value}</p>
      <p className="text-[11px] text-ink-500 font-semibold">{label}</p>
    </div>
  );
}

function ChartCard({ title, unit, icon: Icon, children }) {
  return (
    <div className="card p-5 sm:p-6">
      <p className="text-sm font-bold text-ink-800 flex items-center gap-2">
        <Icon size={16} className="text-ink-400" /> {title}
        <span className="text-xs font-normal text-ink-400">({unit})</span>
      </p>
      <div className="mt-4 h-56">
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
