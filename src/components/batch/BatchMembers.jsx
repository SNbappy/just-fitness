import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, Shield, UserMinus } from "lucide-react";

export function Avatar({ name, url, size = 12 }) {
  const initials = (name || "?").split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  const cls = `w-${size} h-${size}`;
  if (url) return <img src={url} alt={name} className={`${cls} rounded-xl object-cover shrink-0`} />;
  return (
    <span className={`grid place-items-center ${cls} rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 text-white font-bold shrink-0`}>
      {initials}
    </span>
  );
}

export default function BatchMembers({ batchId, roster, trainer, isTrainer, currentUserId, onRemove }) {
  return (
    <div>
      {trainer && (
        <div className="card p-5 flex items-center gap-4 border-l-4 border-l-primary-500">
          <Avatar name={trainer.full_name} url={trainer.photo_url} />
          <div className="min-w-0 flex-1">
            <p className="font-bold text-body truncate">{trainer.full_name}</p>
            <p className="text-xs text-muted">{trainer.department || "Office of Physical Education"}</p>
          </div>
          <span className="shrink-0 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-primary-500/15 text-primary-700 px-2.5 py-1 rounded-md">
            <Shield size={11} /> Trainer
          </span>
        </div>
      )}

      {roster.length === 0 ? (
        <div className="card p-10 text-center mt-5">
          <Users className="mx-auto text-faint" size={34} />
          <p className="mt-3 font-semibold text-muted">No members yet</p>
          <p className="text-sm text-faint mt-1">Share the join code to get started.</p>
        </div>
      ) : (
        <div className="mt-5 grid sm:grid-cols-2 gap-4">
          {roster.map((m, i) => (
            <motion.div key={m.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }} className="card p-5">
              <div className="flex items-center gap-3">
                <Avatar name={m.profiles?.full_name} url={m.profiles?.photo_url} />
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-body truncate">{m.profiles?.full_name}</p>
                  <p className="text-xs text-muted truncate">
                    {m.profiles?.department || "—"}
                    {m.profiles?.student_id ? ` · ${m.profiles.student_id}` : ""}
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-line flex items-center justify-between">
                <Link to={`/batch/${batchId}/member/${m.profiles?.id}`}
                  className="text-xs font-bold text-primary-600 hover:underline">
                  View profile
                </Link>
                {isTrainer && m.profiles?.id !== currentUserId && (
                  <button onClick={() => onRemove(m.id)}
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
  );
}
