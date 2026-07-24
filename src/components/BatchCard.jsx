import { Link } from "react-router-dom";
import { ArrowUpRight, Calendar, MapPin } from "lucide-react";
import { batchTypeLabel } from "../lib/batches";

export default function BatchCard({ batch, isTrainer }) {
  return (
    <Link
      to={`/batch/${batch.id}`}
      className="group relative border border-line bg-surface hover:border-electric-400 transition-colors flex flex-col"
    >
      <div className="h-1" style={{ background: batch.cover_color || "#2E6BFF" }} />

      <div className="p-7 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-electric-600">
            {batchTypeLabel(batch.batch_type)}
          </p>
          {isTrainer && (
            <span className="shrink-0 text-[9px] font-bold uppercase tracking-[0.2em] bg-void text-white px-2.5 py-1">
              Trainer
            </span>
          )}
        </div>

        <h3 className="mt-4 mega text-2xl text-body leading-tight">{batch.name}</h3>

        {batch.description && (
          <p className="mt-3 text-sm text-muted leading-relaxed line-clamp-2">
            {batch.description}
          </p>
        )}

        <div className="mt-6 space-y-2 text-xs text-muted">
          {batch.schedule && (
            <p className="flex items-center gap-2">
              <Calendar size={14} className="text-faint shrink-0" /> {batch.schedule}
            </p>
          )}
          {batch.venue && (
            <p className="flex items-center gap-2">
              <MapPin size={14} className="text-faint shrink-0" /> {batch.venue}
            </p>
          )}
        </div>

        <div className="mt-auto pt-6 flex items-center justify-between border-t border-line">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-faint">
            Open batch
          </span>
          <ArrowUpRight
            size={18}
            className="text-faint group-hover:text-electric-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
          />
        </div>
      </div>
    </Link>
  );
}