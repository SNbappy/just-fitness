import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, Users, Calendar, MapPin, AlertCircle, LogOut,
  QrCode, LayoutGrid, CalendarCheck, Megaphone,
} from "lucide-react";
import { useAuth } from "../lib/AuthContext";
import { supabase } from "../lib/supabase";
import { getBatchRoster, batchTypeLabel } from "../lib/batches";
import Spinner from "../components/Spinner";
import ShareBatchModal from "../components/batch/ShareBatchModal";
import BatchOverview from "../components/batch/BatchOverview";
import BatchMembers from "../components/batch/BatchMembers";
import BatchAttendance from "../components/batch/BatchAttendance";
import BatchAnnouncements from "../components/batch/BatchAnnouncements";

const TABS = [
  { key: "overview", label: "Overview", icon: LayoutGrid },
  { key: "members", label: "Members", icon: Users },
  { key: "attendance", label: "Attendance", icon: CalendarCheck },
  { key: "announcements", label: "Announcements", icon: Megaphone },
];

export default function BatchDetail() {
  const { id } = useParams();
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const [batch, setBatch] = useState(null);
  const [roster, setRoster] = useState([]);
  const [trainer, setTrainer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("overview");
  const [shareOpen, setShareOpen] = useState(false);

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
        <AlertCircle className="mx-auto text-faint" size={40} />
        <p className="mt-3 font-semibold text-muted">{error}</p>
        <Link to="/batches" className="btn-primary mt-5">Back to My Batches</Link>
      </div>
    );
  }

  return (
    <>
      <div className="text-white relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${batch.cover_color} 0%, #0f172a 130%)` }}>
        <div className="container-app py-9 sm:py-12 relative">
          <Link to="/batches" className="inline-flex items-center gap-1.5 text-sm text-white/80 hover:text-white">
            <ArrowLeft size={16} /> My Batches
          </Link>

          <div className="mt-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">
                {batchTypeLabel(batch.batch_type)}
              </p>
              <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold">{batch.name}</h1>
              <div className="mt-4 flex flex-wrap gap-4 text-sm text-white/85">
                {batch.schedule && <span className="flex items-center gap-1.5"><Calendar size={15} /> {batch.schedule}</span>}
                {batch.venue && <span className="flex items-center gap-1.5"><MapPin size={15} /> {batch.venue}</span>}
                <span className="flex items-center gap-1.5"><Users size={15} /> {roster.length} member{roster.length === 1 ? "" : "s"}</span>
              </div>
            </div>

            <div className="flex gap-2 shrink-0">
              {isTrainer && (
                <button onClick={() => setShareOpen(true)}
                  className="btn bg-surface text-body hover:bg-surface/90 font-bold">
                  <QrCode size={17} /> Share Code
                </button>
              )}
              {myMembership && !isTrainer && (
                <button onClick={leaveBatch} className="btn bg-surface/15 text-white border border-white/25 hover:bg-surface/25">
                  <LogOut size={16} /> Leave
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-16 sm:top-18 z-30 bg-surface/95 backdrop-blur border-b border-line">
        <div className="container-app flex gap-1 overflow-x-auto scrollbar-hide">
          {TABS.map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`relative flex items-center gap-2 px-4 py-3.5 text-sm font-semibold whitespace-nowrap transition-colors ${
                tab === t.key ? "text-primary-600" : "text-muted hover:text-body"
              }`}>
              <t.icon size={16} /> {t.label}
              {tab === t.key && (
                <motion.span layoutId="tabline" className="absolute left-2 right-2 bottom-0 h-0.5 bg-primary-600 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      <section className="section">
        <div className="container-app">
          {tab === "overview" && <BatchOverview batch={batch} roster={roster} isTrainer={isTrainer} />}
          {tab === "members" && (
            <BatchMembers batchId={id} roster={roster} trainer={trainer} isTrainer={isTrainer}
              currentUserId={user.id} onRemove={removeMember} />
          )}
          {tab === "attendance" && (
            <BatchAttendance batchId={id} roster={roster} isTrainer={isTrainer} />
          )}
          {tab === "announcements" && (
            <BatchAnnouncements batchId={id} isTrainer={isTrainer} />
          )}
        </div>
      </section>

      {batch && <ShareBatchModal batch={batch} open={shareOpen} onClose={() => setShareOpen(false)} />}
    </>
  );
}
