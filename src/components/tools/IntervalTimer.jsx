import { useEffect, useRef, useState } from "react";
import { Play, Pause, RotateCcw, Settings2 } from "lucide-react";
import { beepCountdown, beepStart, beepEnd } from "../../lib/beep";

const PRESETS = [
  { name: "Tabata", work: 20, rest: 10, rounds: 8, prep: 10 },
  { name: "HIIT 30/30", work: 30, rest: 30, rounds: 10, prep: 10 },
  { name: "Circuit 45/15", work: 45, rest: 15, rounds: 8, prep: 15 },
  { name: "EMOM", work: 60, rest: 0, rounds: 10, prep: 10 },
];

export default function IntervalTimer() {
  const [cfg, setCfg] = useState(PRESETS[0]);
  const [showSettings, setShowSettings] = useState(false);
  const [phase, setPhase] = useState("idle"); // idle | prep | work | rest | done
  const [round, setRound] = useState(1);
  const [left, setLeft] = useState(0);
  const [running, setRunning] = useState(false);
  const tick = useRef(null);

  useEffect(() => {
    if (!running) { clearInterval(tick.current); return; }

    tick.current = setInterval(() => {
      setLeft((prev) => {
        if (prev > 1) {
          if (prev <= 4) beepCountdown();
          return prev - 1;
        }
        advance();
        return 0;
      });
    }, 1000);

    return () => clearInterval(tick.current);
  }, [running, phase, round]);

  function advance() {
    if (phase === "prep") {
      beepStart(); setPhase("work"); setLeft(cfg.work);
    } else if (phase === "work") {
      if (round >= cfg.rounds) { beepEnd(); setPhase("done"); setRunning(false); return; }
      if (cfg.rest > 0) { beepEnd(); setPhase("rest"); setLeft(cfg.rest); }
      else { beepStart(); setRound((r) => r + 1); setLeft(cfg.work); }
    } else if (phase === "rest") {
      beepStart(); setRound((r) => r + 1); setPhase("work"); setLeft(cfg.work);
    }
  }

  function start() {
    if (phase === "idle" || phase === "done") {
      setRound(1); setPhase("prep"); setLeft(cfg.prep);
    }
    setRunning(true);
  }

  function reset() {
    setRunning(false); setPhase("idle"); setRound(1); setLeft(0);
  }

  const colors = {
    idle: "bg-ink-100 text-ink-500",
    prep: "bg-amber-500 text-white",
    work: "bg-primary-500 text-white",
    rest: "bg-blue-500 text-white",
    done: "bg-secondary-500 text-white",
  };

  const total = phase === "work" ? cfg.work : phase === "rest" ? cfg.rest : cfg.prep;
  const pct = total ? ((total - left) / total) * 100 : 0;

  return (
    <div>
      <div className={`rounded-3xl p-8 text-center transition-colors duration-500 ${colors[phase]}`}>
        <p className="text-sm font-bold uppercase tracking-[0.2em] opacity-90">
          {phase === "idle" ? "Ready" : phase === "prep" ? "Get Ready" : phase === "done" ? "Complete" : phase}
        </p>
        <p className="mt-3 font-mono text-7xl font-extrabold tabular-nums">
          {phase === "idle" ? cfg.work : left}
        </p>
        <p className="mt-2 text-sm font-semibold opacity-90">
          Round {Math.min(round, cfg.rounds)} of {cfg.rounds}
        </p>
        <div className="mt-5 h-1.5 rounded-full bg-black/15 overflow-hidden">
          <div className="h-full bg-white/80 transition-all duration-1000 ease-linear" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="mt-6 flex justify-center gap-3">
        <button onClick={() => (running ? setRunning(false) : start())}
          className={`grid place-items-center w-16 h-16 rounded-2xl text-white active:scale-95 transition-transform ${
            running ? "bg-secondary-500" : "bg-primary-500"
          }`}>
          {running ? <Pause size={26} /> : <Play size={26} className="ml-0.5" />}
        </button>
        <button onClick={reset} className="grid place-items-center w-16 h-16 rounded-2xl bg-ink-100 text-ink-700 active:scale-95 transition-transform">
          <RotateCcw size={22} />
        </button>
        <button onClick={() => setShowSettings((s) => !s)}
          className="grid place-items-center w-16 h-16 rounded-2xl bg-ink-100 text-ink-700 active:scale-95 transition-transform">
          <Settings2 size={22} />
        </button>
      </div>

      <div className="mt-6 flex flex-wrap gap-2 justify-center">
        {PRESETS.map((p) => (
          <button key={p.name} onClick={() => { setCfg(p); reset(); }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors ${
              cfg.name === p.name ? "bg-primary-500 text-white" : "bg-ink-100 text-ink-600 hover:bg-ink-200"
            }`}>
            {p.name}
          </button>
        ))}
      </div>

      {showSettings && (
        <div className="mt-6 card p-5 grid grid-cols-2 gap-4">
          {[
            ["prep", "Prepare (s)"], ["work", "Work (s)"],
            ["rest", "Rest (s)"], ["rounds", "Rounds"],
          ].map(([key, label]) => (
            <div key={key}>
              <label className="text-xs font-bold uppercase tracking-wider text-ink-400">{label}</label>
              <input type="number" min="0" value={cfg[key]}
                onChange={(e) => { setCfg((c) => ({ ...c, name: "Custom", [key]: Number(e.target.value) })); reset(); }}
                className="mt-1.5 w-full rounded-xl border border-ink-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
