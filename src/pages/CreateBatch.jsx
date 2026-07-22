import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AlertCircle, Plus } from "lucide-react";
import { useAuth } from "../lib/AuthContext";
import { createBatch, BATCH_TYPES, GENDER_POLICIES } from "../lib/batches";

const COLORS = ["#0E9F6E", "#FF6B35", "#3B82F6", "#8B5CF6", "#F59E0B", "#EF4444"];

export default function CreateBatch() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "", description: "", batch_type: "gym", gender_policy: "mixed",
    schedule: "", venue: "", capacity: "", cover_color: "#0E9F6E",
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSaving(true);

    const { data, error: createError } = await createBatch(
      { ...form, capacity: form.capacity ? Number(form.capacity) : null },
      user.id
    );
    setSaving(false);

    if (createError) {
      setError(createError.message);
      return;
    }
    navigate(`/batch/${data.id}`);
  }

  const input = "mt-1.5 w-full rounded-xl border border-line px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-surface";

  return (
    <section className="section">
      <div className="container-app max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
          <p className="eyebrow">Trainer</p>
          <h1 className="mt-2 text-3xl font-extrabold text-body">Create a Batch</h1>
          <p className="mt-2 text-muted">
            A join code is generated automatically. Share it with students so they can join.
          </p>
        </motion.div>

        {error && (
          <div className="mt-6 flex gap-2 items-start bg-red-50 text-red-700 text-sm rounded-xl px-4 py-3">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 card p-6 sm:p-8 space-y-5">
          <div>
            <label className="text-sm font-semibold text-body">Batch Name *</label>
            <input required value={form.name} onChange={(e) => set("name", e.target.value)}
              placeholder="Morning Strength Batch — Spring 2026" className={input} />
          </div>

          <div>
            <label className="text-sm font-semibold text-body">Description</label>
            <textarea rows={3} value={form.description} onChange={(e) => set("description", e.target.value)}
              placeholder="Who is this batch for, what will they do?" className={input} />
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="text-sm font-semibold text-body">Type</label>
              <select value={form.batch_type} onChange={(e) => set("batch_type", e.target.value)} className={input}>
                {BATCH_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold text-body">Who can join</label>
              <select value={form.gender_policy} onChange={(e) => set("gender_policy", e.target.value)} className={input}>
                {GENDER_POLICIES.map((g) => <option key={g.value} value={g.value}>{g.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold text-body">Schedule</label>
              <input value={form.schedule} onChange={(e) => set("schedule", e.target.value)}
                placeholder="Sun–Thu, 6:30 AM" className={input} />
            </div>
            <div>
              <label className="text-sm font-semibold text-body">Venue</label>
              <input value={form.venue} onChange={(e) => set("venue", e.target.value)}
                placeholder="JUST Gymnasium" className={input} />
            </div>
            <div>
              <label className="text-sm font-semibold text-body">Capacity (optional)</label>
              <input type="number" value={form.capacity} onChange={(e) => set("capacity", e.target.value)}
                placeholder="30" className={input} />
            </div>
            <div>
              <label className="text-sm font-semibold text-body">Batch Colour</label>
              <div className="mt-2.5 flex gap-2">
                {COLORS.map((c) => (
                  <button key={c} type="button" onClick={() => set("cover_color", c)}
                    style={{ background: c }}
                    className={`w-9 h-9 rounded-lg transition-transform ${
                      form.cover_color === c ? "ring-2 ring-offset-2 ring-ink-400 scale-110" : "hover:scale-105"
                    }`}
                    aria-label={`Colour ${c}`} />
                ))}
              </div>
            </div>
          </div>

          <button type="submit" disabled={saving} className="btn-primary w-full">
            <Plus size={18} /> {saving ? "Creating…" : "Create Batch"}
          </button>
        </form>
      </div>
    </section>
  );
}
