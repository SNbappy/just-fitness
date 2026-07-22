import { useEffect, useRef, useState } from "react";
import { Play, Pause, RotateCcw, Flag } from "lucide-react";

function format(ms) {
  const m = Math.floor(ms / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  const cs = Math.floor((ms % 1000) / 10);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}.${String(cs).padStart(2, "0")}`;
}

export default function Stopwatch() {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState([]);
  const startRef = useRef(0);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!running) return;
    startRef.current = Date.now() - elapsed;
    function tick() {
      setElapsed(Date.now() - startRef.current);
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [running]);

  function reset() {
    setRunning(false);
    setElapsed(0);
    setLaps([]);
  }

  function lap() {
    setLaps((l) => [{ n: l.length + 1, time: elapsed, split: elapsed - (l[0]?.time || 0) }, ...l]);
  }

  return (
    <div className="text-center">
      <p className="font-mono text-5xl sm:text-6xl font-extrabold text-body tabular-nums">
        {format(elapsed)}
      </p>

      <div className="mt-8 flex justify-center gap-3">
        <button onClick={() => setRunning((r) => !r)}
          className={`grid place-items-center w-16 h-16 rounded-2xl text-white transition-transform active:scale-95 ${
            running ? "bg-secondary-500/100" : "bg-primary-500/100"
          }`}>
          {running ? <Pause size={26} /> : <Play size={26} className="ml-0.5" />}
        </button>
        <button onClick={lap} disabled={!running}
          className="grid place-items-center w-16 h-16 rounded-2xl bg-elevated text-body disabled:opacity-40 active:scale-95 transition-transform">
          <Flag size={22} />
        </button>
        <button onClick={reset}
          className="grid place-items-center w-16 h-16 rounded-2xl bg-elevated text-body active:scale-95 transition-transform">
          <RotateCcw size={22} />
        </button>
      </div>

      {laps.length > 0 && (
        <div className="mt-8 text-left max-h-64 overflow-y-auto">
          {laps.map((l) => (
            <div key={l.n} className="flex justify-between py-2.5 border-b border-line text-sm">
              <span className="font-semibold text-muted">Lap {l.n}</span>
              <span className="font-mono text-faint">+{format(l.split)}</span>
              <span className="font-mono font-bold text-body">{format(l.time)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
