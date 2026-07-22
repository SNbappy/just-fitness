import { useEffect, useRef, useState } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";
import { beepCountdown, beepEnd } from "../../lib/beep";

const QUICK = [30, 60, 90, 120, 180, 300];

export default function Countdown() {
  const [total, setTotal] = useState(60);
  const [left, setLeft] = useState(60);
  const [running, setRunning] = useState(false);
  const tick = useRef(null);

  useEffect(() => {
    if (!running) { clearInterval(tick.current); return; }
    tick.current = setInterval(() => {
      setLeft((p) => {
        if (p <= 1) { beepEnd(); setRunning(false); return 0; }
        if (p <= 4) beepCountdown();
        return p - 1;
      });
    }, 1000);
    return () => clearInterval(tick.current);
  }, [running]);

  function pick(s) { setTotal(s); setLeft(s); setRunning(false); }

  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");
  const pct = total ? ((total - left) / total) * 100 : 0;

  return (
    <div className="text-center">
      <div className="relative inline-grid place-items-center">
        <svg width="220" height="220" className="-rotate-90">
          <circle cx="110" cy="110" r="96" fill="none" stroke="#e2e8f0" strokeWidth="12" />
          <circle cx="110" cy="110" r="96" fill="none" stroke="#0E9F6E" strokeWidth="12"
            strokeLinecap="round" strokeDasharray={2 * Math.PI * 96}
            strokeDashoffset={2 * Math.PI * 96 * (1 - pct / 100)}
            style={{ transition: "stroke-dashoffset 1s linear" }} />
        </svg>
        <p className="absolute font-mono text-4xl font-extrabold text-body tabular-nums">
          {mm}:{ss}
        </p>
      </div>

      <div className="mt-6 flex justify-center gap-3">
        <button onClick={() => { if (left === 0) setLeft(total); setRunning((r) => !r); }}
          className={`grid place-items-center w-16 h-16 rounded-2xl text-white active:scale-95 transition-transform ${
            running ? "bg-secondary-500/100" : "bg-primary-500/100"
          }`}>
          {running ? <Pause size={26} /> : <Play size={26} className="ml-0.5" />}
        </button>
        <button onClick={() => { setRunning(false); setLeft(total); }}
          className="grid place-items-center w-16 h-16 rounded-2xl bg-elevated text-body active:scale-95 transition-transform">
          <RotateCcw size={22} />
        </button>
      </div>

      <div className="mt-6 flex flex-wrap gap-2 justify-center">
        {QUICK.map((s) => (
          <button key={s} onClick={() => pick(s)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
              total === s ? "bg-primary-500/100 text-white" : "bg-elevated text-muted hover:bg-elevated"
            }`}>
            {s < 60 ? `${s}s` : `${s / 60}m`}
          </button>
        ))}
      </div>
    </div>
  );
}
