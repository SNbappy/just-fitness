import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import {
  ArrowLeft, Copy, Check, Users, Calendar, MapPin, Shield,
  UserMinus, LogOut, AlertCircle,
} from "lucide-react";
import { useAuth } from "../lib/AuthContext";
import { supabase } from "../lib/supabase";
import { getBatchRoster, batchTypeLabel } from "../lib/batches";
import Spinner from "../components/Spinner";

export default function BatchDetail() {
  const { id } = useParams();
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const [batch, setBatch] = useState(null);
  const [roster, setRoster] = useState([]);
  const [trainer, setTrainer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const isTrainer = batch && (batch.trainer_id === user?.id || profile?.role === "admin");
  const myMembership = roster.find((r) => r.profiles?.id === user?.id);

  useEffect(() => {
    let active = true;

    async function load() {
      const { data: b, error: bErr } = await supabase
        .from("batches").select("*").eq("id", id).single();

      if (!active) return;
      if (bErr) { setError("Batch not found."); setLoading(false); return; }
      setBatch(b);

      const { data: t } = await supabase
        .from("profiles").select("id, full_name, photo_url, department, role")
        .eq("id", b.trainer_id).maybeSingle();
      if (active) setTrainer(t);

      const { data: r } = await getBatchRoster(id);
      if (active) { setRoster(r || []); setLoading(false); }
    }

    load();
    return () => { active = false; };
  }, [id]);

  function copyCode() {
    navigator.clipboard.writeText(batch.join_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  async function removeMember(membershipId) {
    if (!confirm("Remove this member from the batch?")) return;
    await supabase.from("batch_members").update({ status: "removed" }).eq("id", membershipId);
    setRoster((r) => r.filter((m) => m.id !== membershipId));
  }

  async function leaveBatch() {
    if (!confirm("Leave this batch?")) return;
    await supabase.from("batch_members").update({ status: "left" }).eq("id", myMembership.id);
    navigate("/batches");
  }

  if (loading) return <Spinner full />;

  if (error) {
    return (
      <div className="section container-app text-center">
        <AlertCircle className="mx-auto text-ink-300" size={40} />
        <p className="mt-3 font-semibold text-ink-600">{error}</p>
        <Link to="/batches" className="btn-primary mt-5">Back to My Batches</Link>
      </div>
    );
  }

  return (
    <>
      <div className="text-white relative overflow-hidden"
           style={{ background: `linear-gradient(135deg, ${batch.cover_color} 0%, #0f172a 130%)` }}>
        <div className="container-app py-10 sm:py-14 relative">
          <Link to="/batches" className="inline-flex items-center gap-1.5 text-sm text-white/80 hover:text-white">
            <ArrowLeft size={16} /> My Batches
          </Link>
          <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-white/70">
            {batchTypeLabel(batch.batch_type)}
          </p>
          <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold">{batch.name}</h1>
          {batch.description && (
            <p className="mt-3 max-w-2xl text-white/85 leading-relaxed">{batch.description}</p>
          )}
          <div className="mt-5 flex flex-wrap gap-4 text-sm text-white/85">
            {batch.schedule && <span className="flex items-center gap-1.5"><Calendar size={15} /> {batch.schedule}</span>}
            {batch.venue && <span className="flex items-center gap-1.5"><MapPin size={15} /> {batch.venue}</span>}
            <span className="flex items-center gap-1.5"><Users size={15} /> {roster.length} member{roster.length === 1 ? "" : "s"}</span>
          </div>
        </div>
      </div>

      <section className="section">
        <div className="container-app grid lg:grid-cols-[1fr,320px] gap-8">
          <div className="order-2 lg:order-1">
            <h2 className="text-sm font-bold uppercase tracking-wider text-ink-400">
              Members ({roster.length})
            </h2>

            {trainer && (
              <div className="mt-4 card p-5 flex items-center gap-4 border-l-4 border-l-primary-500">
                <Avatar name={trainer.full_name} url={trainer.photo_url} />
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-ink-900 truncate">{trainer.full_name}</p>
                  <p className="text-xs text-ink-500">{trainer.department || "Office of Physical Education"}</p>
                </div>
                <span className="shrink-0 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-primary-100 text-primary-700 px-2.5 py-1 rounded-md">
                  <Shield size={11} /> Trainer
                </span>
              </div>
            )}

            {roster.length === 0 ? (
              <div className="mt-4 card p-10 text-center">
                <Users className="mx-auto text-ink-300" size={34} />
                <p className="mt-3 font-semibold text-ink-600">No members yet</p>
                <p className="text-sm text-ink-400 mt-1">Share the join code to get started.</p>
              </div>
            ) : (
              <div className="mt-4 grid sm:grid-cols-2 gap-4">
                {roster.map((m, i) => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="card p-5"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar name={m.profiles?.full_name} url={m.profiles?.photo_url} />
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-ink-900 truncate">{m.profiles?.full_name}</p>
                        <p className="text-xs text-ink-500 truncate">
                          {m.profiles?.department || "—"}
                          {m.profiles?.student_id ? ` · ${m.profiles.student_id}` : ""}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-ink-100 flex items-center justify-between">
                      <Link to={`/batch/${id}/member/${m.profiles?.id}`}
                        className="text-xs font-bold text-primary-600 hover:underline">
                        View profile
                      </Link>
                      {isTrainer && m.profiles?.id !== user.id && (
                        <button onClick={() => removeMember(m.id)}
                          className="text-xs font-semibold text-red-500 hover:text-red-700 flex items-center gap-1">
                          <UserMinus size={13} /> Remove
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          <aside className="order-1 lg:order-2 space-y-5">
            {isTrainer && (
              <div className="card p-6 text-center">
                <p className="eyebrow">Join Code</p>
                <p className="mt-3 text-3xl font-extrabold tracking-[0.25em] text-ink-900">
                  {batch.join_code}
                </p>
                <button onClick={copyCode} className="btn-outline w-full mt-4">
                  {copied ? <><Check size={16} /> Copied</> : <><Copy size={16} /> Copy Code</>}
                </button>
                <div className="mt-6 pt-5 border-t border-ink-100">
                  <div className="bg-white p-3 rounded-xl inline-block">
                    <QRCodeSVG value={batch.join_code} size={150} level="M" />
                  </div>
                  <p className="mt-3 text-xs text-ink-400">
                    Students can scan this, or type the code at <strong>Join with Code</strong>.
                  </p>
                </div>
              </div>
            )}

            {myMembership && !isTrainer && (
              <button onClick={leaveBatch} className="btn w-full bg-red-50 text-red-600 hover:bg-red-100">
                <LogOut size={16} /> Leave Batch
              </button>
            )}
          </aside>
        </div>
      </section>
    </>
  );
}

function Avatar({ name, url }) {
  const initials = (name || "?")
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  if (url) {
    return <img src={url} alt={name} className="w-12 h-12 rounded-xl object-cover shrink-0" />;
  }
  return (
    <span className="grid place-items-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 text-white font-bold shrink-0">
      {initials}
    </span>
  );
}
