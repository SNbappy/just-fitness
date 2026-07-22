import { useState } from "react";

const inputCls = "mt-1.5 w-full rounded-xl border border-line px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500";

function Field({ label, children }) {
  return (
    <div>
      <label className="text-sm font-semibold text-body">{label}</label>
      {children}
    </div>
  );
}

function Result({ children, note }) {
  return (
    <div className="mt-5 rounded-2xl bg-primary-500/10 p-5 text-center">
      {children}
      {note && <p className="mt-2 text-xs text-primary-700/70 leading-relaxed">{note}</p>}
    </div>
  );
}

// ---------- BMI ----------
export function BMICalc() {
  const [w, setW] = useState("");
  const [h, setH] = useState("");
  const bmi = w && h ? (Number(w) / Math.pow(Number(h) / 100, 2)) : null;

  const category = !bmi ? null
    : bmi < 18.5 ? { label: "Underweight", color: "text-blue-600" }
    : bmi < 25 ? { label: "Healthy range", color: "text-primary-600" }
    : bmi < 30 ? { label: "Overweight", color: "text-amber-600" }
    : { label: "Obese", color: "text-red-600" };

  return (
    <div>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Weight (kg)"><input type="number" value={w} onChange={(e) => setW(e.target.value)} className={inputCls} /></Field>
        <Field label="Height (cm)"><input type="number" value={h} onChange={(e) => setH(e.target.value)} className={inputCls} /></Field>
      </div>
      {bmi > 0 && (
        <Result note="BMI is a rough screening number. It doesn't account for muscle mass, so athletes often read high.">
          <p className="text-4xl font-extrabold text-body">{bmi.toFixed(1)}</p>
          <p className={`mt-1 font-bold ${category.color}`}>{category.label}</p>
        </Result>
      )}
    </div>
  );
}

// ---------- BMR / TDEE ----------
export function TDEECalc() {
  const [f, setF] = useState({ age: "", gender: "male", weight: "", height: "", activity: 1.375 });
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));

  const ready = f.age && f.weight && f.height;
  const bmr = ready
    ? 10 * Number(f.weight) + 6.25 * Number(f.height) - 5 * Number(f.age) + (f.gender === "male" ? 5 : -161)
    : null;
  const tdee = bmr ? bmr * Number(f.activity) : null;

  return (
    <div>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Age"><input type="number" value={f.age} onChange={(e) => set("age", e.target.value)} className={inputCls} /></Field>
        <Field label="Gender">
          <select value={f.gender} onChange={(e) => set("gender", e.target.value)} className={inputCls + " bg-surface"}>
            <option value="male">Male</option><option value="female">Female</option>
          </select>
        </Field>
        <Field label="Weight (kg)"><input type="number" value={f.weight} onChange={(e) => set("weight", e.target.value)} className={inputCls} /></Field>
        <Field label="Height (cm)"><input type="number" value={f.height} onChange={(e) => set("height", e.target.value)} className={inputCls} /></Field>
        <div className="sm:col-span-2">
          <Field label="Activity Level">
            <select value={f.activity} onChange={(e) => set("activity", e.target.value)} className={inputCls + " bg-surface"}>
              <option value="1.2">Sedentary — desk work, little exercise</option>
              <option value="1.375">Light — 1–3 sessions/week</option>
              <option value="1.55">Moderate — 3–5 sessions/week</option>
              <option value="1.725">Active — 6–7 sessions/week</option>
              <option value="1.9">Very active — physical job or twice daily</option>
            </select>
          </Field>
        </div>
      </div>

      {tdee && (
        <Result note="A deficit of around 500 kcal/day is a sustainable rate for most people. Larger deficits tend to cost muscle and energy rather than speed things up.">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-primary-700/70">BMR</p>
              <p className="text-2xl font-extrabold text-body">{Math.round(bmr)}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-primary-700/70">Maintenance</p>
              <p className="text-2xl font-extrabold text-body">{Math.round(tdee)}</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-primary-200 grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-primary-700/70 font-semibold">To lose weight</p>
              <p className="font-bold text-body">{Math.round(tdee - 500)} kcal</p>
            </div>
            <div>
              <p className="text-xs text-primary-700/70 font-semibold">To gain weight</p>
              <p className="font-bold text-body">{Math.round(tdee + 350)} kcal</p>
            </div>
          </div>
        </Result>
      )}
    </div>
  );
}

// ---------- Body fat (Navy) ----------
export function BodyFatCalc() {
  const [f, setF] = useState({ gender: "male", height: "", neck: "", waist: "", hip: "" });
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));

  let bf = null;
  const { gender, height, neck, waist, hip } = f;
  if (gender === "male" && height && neck && waist) {
    bf = 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height)) - 450;
  } else if (gender === "female" && height && neck && waist && hip) {
    bf = 495 / (1.29579 - 0.35004 * Math.log10(Number(waist) + Number(hip) - neck) + 0.221 * Math.log10(height)) - 450;
  }

  return (
    <div>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Gender">
          <select value={f.gender} onChange={(e) => set("gender", e.target.value)} className={inputCls + " bg-surface"}>
            <option value="male">Male</option><option value="female">Female</option>
          </select>
        </Field>
        <Field label="Height (cm)"><input type="number" value={f.height} onChange={(e) => set("height", e.target.value)} className={inputCls} /></Field>
        <Field label="Neck (cm)"><input type="number" value={f.neck} onChange={(e) => set("neck", e.target.value)} className={inputCls} /></Field>
        <Field label="Waist (cm)"><input type="number" value={f.waist} onChange={(e) => set("waist", e.target.value)} className={inputCls} /></Field>
        {f.gender === "female" && (
          <Field label="Hip (cm)"><input type="number" value={f.hip} onChange={(e) => set("hip", e.target.value)} className={inputCls} /></Field>
        )}
      </div>
      {bf > 0 && bf < 70 && (
        <Result note="Tape measurements are an estimate with a few percent of error either way. Track the trend over weeks rather than any single reading.">
          <p className="text-4xl font-extrabold text-body">{bf.toFixed(1)}%</p>
          <p className="mt-1 text-sm font-semibold text-primary-700">Estimated body fat</p>
        </Result>
      )}
    </div>
  );
}

// ---------- 1RM ----------
export function OneRepMaxCalc() {
  const [w, setW] = useState("");
  const [r, setR] = useState("");
  const orm = w && r && Number(r) > 0 ? Number(w) * (1 + Number(r) / 30) : null;
  const pcts = [95, 90, 85, 80, 75, 70, 65, 60];

  return (
    <div>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Weight lifted (kg)"><input type="number" value={w} onChange={(e) => setW(e.target.value)} className={inputCls} /></Field>
        <Field label="Reps completed"><input type="number" value={r} onChange={(e) => setR(e.target.value)} className={inputCls} /></Field>
      </div>
      {orm > 0 && (
        <>
          <Result note="Estimates are most accurate under about 10 reps. Warm up thoroughly before working near your max, and use a spotter.">
            <p className="text-4xl font-extrabold text-body">{orm.toFixed(1)} kg</p>
            <p className="mt-1 text-sm font-semibold text-primary-700">Estimated 1 rep max</p>
          </Result>
          <div className="mt-4 grid grid-cols-4 gap-2">
            {pcts.map((p) => (
              <div key={p} className="rounded-xl bg-elevated p-3 text-center">
                <p className="text-[10px] font-bold text-faint">{p}%</p>
                <p className="text-sm font-extrabold text-body">{(orm * p / 100).toFixed(1)}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ---------- Macros ----------
export function MacroCalc() {
  const [cal, setCal] = useState("");
  const [split, setSplit] = useState({ p: 30, c: 40, f: 30 });
  const presets = [
    { name: "Balanced", p: 30, c: 40, f: 30 },
    { name: "High protein", p: 40, c: 35, f: 25 },
    { name: "Low carb", p: 35, c: 25, f: 40 },
  ];
  const c = Number(cal);

  return (
    <div>
      <Field label="Daily calories">
        <input type="number" value={cal} onChange={(e) => setCal(e.target.value)} className={inputCls} placeholder="e.g. 2200" />
      </Field>
      <div className="mt-4 flex gap-2 flex-wrap">
        {presets.map((p) => (
          <button key={p.name} onClick={() => setSplit(p)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold ${
              split.p === p.p ? "bg-primary-500/100 text-white" : "bg-elevated text-muted"
            }`}>
            {p.name}
          </button>
        ))}
      </div>
      {c > 0 && (
        <div className="mt-5 grid grid-cols-3 gap-3">
          {[
            { label: "Protein", g: (c * split.p / 100 / 4).toFixed(0), pct: split.p, color: "bg-primary-500/10 text-primary-700" },
            { label: "Carbs", g: (c * split.c / 100 / 4).toFixed(0), pct: split.c, color: "bg-blue-50 text-blue-700" },
            { label: "Fat", g: (c * split.f / 100 / 9).toFixed(0), pct: split.f, color: "bg-amber-50 text-amber-700" },
          ].map((m) => (
            <div key={m.label} className={`rounded-2xl p-4 text-center ${m.color}`}>
              <p className="text-2xl font-extrabold">{m.g}g</p>
              <p className="text-xs font-bold mt-0.5">{m.label}</p>
              <p className="text-[10px] opacity-70">{m.pct}%</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------- Water ----------
export function WaterCalc() {
  const [w, setW] = useState("");
  const [mins, setMins] = useState("");
  const litres = w ? (Number(w) * 0.033 + (Number(mins || 0) / 30) * 0.35) : null;

  return (
    <div>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Weight (kg)"><input type="number" value={w} onChange={(e) => setW(e.target.value)} className={inputCls} /></Field>
        <Field label="Exercise today (minutes)"><input type="number" value={mins} onChange={(e) => setMins(e.target.value)} className={inputCls} /></Field>
      </div>
      {litres > 0 && (
        <Result note="A rough target — you need more in Jashore's summer heat. Thirst and pale urine are better day-to-day guides than any formula.">
          <p className="text-4xl font-extrabold text-body">{litres.toFixed(1)} L</p>
          <p className="mt-1 text-sm font-semibold text-primary-700">
            About {Math.round(litres * 4)} glasses
          </p>
        </Result>
      )}
    </div>
  );
}

// ---------- Heart rate zones ----------
export function HeartRateCalc() {
  const [age, setAge] = useState("");
  const [rest, setRest] = useState("");
  const max = age ? 220 - Number(age) : null;
  const hrr = max && rest ? max - Number(rest) : null;

  const zones = [
    { name: "Recovery", lo: 50, hi: 60, color: "bg-blue-50 text-blue-700" },
    { name: "Fat burn", lo: 60, hi: 70, color: "bg-primary-500/10 text-primary-700" },
    { name: "Aerobic", lo: 70, hi: 80, color: "bg-amber-50 text-amber-700" },
    { name: "Anaerobic", lo: 80, hi: 90, color: "bg-orange-50 text-orange-700" },
    { name: "Maximum", lo: 90, hi: 100, color: "bg-red-50 text-red-700" },
  ];

  return (
    <div>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Age"><input type="number" value={age} onChange={(e) => setAge(e.target.value)} className={inputCls} /></Field>
        <Field label="Resting pulse (optional)"><input type="number" value={rest} onChange={(e) => setRest(e.target.value)} className={inputCls} /></Field>
      </div>
      {max && (
        <>
          <Result><p className="text-4xl font-extrabold text-body">{max}</p>
            <p className="mt-1 text-sm font-semibold text-primary-700">Estimated max heart rate</p></Result>
          <div className="mt-4 space-y-2">
            {zones.map((z) => {
              const lo = hrr ? Math.round(Number(rest) + hrr * z.lo / 100) : Math.round(max * z.lo / 100);
              const hi = hrr ? Math.round(Number(rest) + hrr * z.hi / 100) : Math.round(max * z.hi / 100);
              return (
                <div key={z.name} className={`flex justify-between items-center rounded-xl p-3.5 ${z.color}`}>
                  <span className="font-bold text-sm">{z.name}</span>
                  <span className="font-mono font-extrabold text-sm">{lo}–{hi} bpm</span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

// ---------- Unit converter ----------
export function UnitConverter() {
  const [kg, setKg] = useState("");
  const [cm, setCm] = useState("");

  const lb = kg ? (Number(kg) * 2.20462).toFixed(1) : "";
  const ft = cm ? Math.floor(Number(cm) / 30.48) : "";
  const inch = cm ? Math.round((Number(cm) / 2.54) % 12) : "";

  return (
    <div className="space-y-5">
      <div>
        <Field label="Kilograms"><input type="number" value={kg} onChange={(e) => setKg(e.target.value)} className={inputCls} /></Field>
        {lb && <p className="mt-2 text-sm font-bold text-primary-600">= {lb} lb</p>}
      </div>
      <div>
        <Field label="Centimetres"><input type="number" value={cm} onChange={(e) => setCm(e.target.value)} className={inputCls} /></Field>
        {cm && <p className="mt-2 text-sm font-bold text-primary-600">= {ft} ft {inch} in</p>}
      </div>
    </div>
  );
}
