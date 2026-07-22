import { useEffect, useState } from "react";
import { Users, CalendarCheck, Percent, Megaphone, Info } from "lucide-react";
import { supabase } from "../../lib/supabase";

export default function BatchOverview({ batch, roster, isTrainer }) {
  const [stats, setStats] = useState({ sessions: 0, rate: null });
  const [latestPost, setLatestPost] = useState(null);

  useEffect(() => {
    let active = true;
    async function load() {
      const { data: att } = await supabase
        .from("attendance").select("session_date, status").eq("batch_id", batch.id);

      if (active && att) {
        const dates = new Set(att.map((a) => a.session_date));
        const good = att.filter((a) => a.status === "present" || a.status === "late").length;
        setStats({
          sessions: dates.size,
          rate: att.length ? Math.round((good / att.length) * 100) : null,
        });
      }

      const { data: post } = await supabase
        .from("batch_posts").select("content, created_at")
        .eq("batch_id", batch.id)
        .order("created_at", { ascending: false }).limit(1).maybeSingle();
      if (active) setLatestPost(post);
    }
    load();
    return () => { active = false; };
  }, [batch.id]);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-4">
        <Card icon={Users} label="Members" value={roster.length} color="bg-primary-50 text-primary-600" />
        <Card icon={CalendarCheck} label="Sessions Held" value={stats.sessions} color="bg-blue-50 text-blue-600" />
        <Card icon={Percent} label={isTrainer ? "Batch Attendance" : "Batch Average"}
          value={stats.rate === null ? "—" : `${stats.rate}%`} color="bg-secondary-50 text-secondary-600" />
      </div>

      {latestPost && (
        <div className="card p-5 border-l-4 border-l-secondary-500">
          <p className="text-xs font-bold uppercase tracking-wider text-secondary-600 flex items-center gap-1.5">
            <Megaphone size={14} /> Latest Announcement
          </p>
          <p className="mt-2 text-ink-700 whitespace-pre-wrap line-clamp-4">{latestPost.content}</p>
          <p className="mt-2 text-xs text-ink-400">
            {new Date(latestPost.created_at).toLocaleDateString([], { day: "numeric", month: "short" })}
          </p>
        </div>
      )}

      <div className="card p-6">
        <p className="text-xs font-bold uppercase tracking-wider text-ink-400 flex items-center gap-1.5">
          <Info size={14} /> Batch Details
        </p>
        <dl className="mt-4 grid sm:grid-cols-2 gap-x-8 gap-y-4 text-sm">
          <Row label="Schedule" value={batch.schedule} />
          <Row label="Venue" value={batch.venue} />
          <Row label="Capacity" value={batch.capacity ? `${roster.length} / ${batch.capacity}` : "No limit"} />
          <Row label="Open to" value={
            batch.gender_policy === "mixed" ? "All members"
              : batch.gender_policy === "male" ? "Male only" : "Female only"
          } />
          <Row label="Started" value={new Date(batch.created_at).toLocaleDateString([], { day: "numeric", month: "long", year: "numeric" })} />
          <Row label="Status" value={batch.is_active ? "Active" : "Closed"} />
        </dl>
        {batch.description && (
          <p className="mt-5 pt-5 border-t border-ink-100 text-ink-600 leading-relaxed whitespace-pre-wrap">
            {batch.description}
          </p>
        )}
      </div>
    </div>
  );
}

function Card({ icon: Icon, label, value, color }) {
  return (
    <div className="card p-4 sm:p-5">
      <span className={`grid place-items-center w-10 h-10 rounded-xl ${color}`}>
        <Icon size={18} />
      </span>
      <p className="mt-3 text-xl font-extrabold text-ink-900">{value}</p>
      <p className="text-[11px] text-ink-500 font-semibold">{label}</p>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div>
      <dt className="text-xs font-semibold text-ink-400">{label}</dt>
      <dd className="mt-0.5 text-ink-800 font-medium">{value || "—"}</dd>
    </div>
  );
}
