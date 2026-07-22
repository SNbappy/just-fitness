import { Link } from "react-router-dom";
import { Users, Calendar, MapPin, ChevronRight } from "lucide-react";
import { batchTypeLabel } from "../lib/batches";

export default function BatchCard({ batch, isTrainer }) {
  return (
    <Link
      to={`/batch/${batch.id}`}
      className="card p-0 overflow-hidden group hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
    >
      <div className="h-2" style={{ background: batch.cover_color || "#0E9F6E" }} />
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-wider text-primary-600">
              {batchTypeLabel(batch.batch_type)}
            </p>
            <h3 className="mt-1 text-lg text-body truncate">{batch.name}</h3>
          </div>
          {isTrainer && (
            <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider bg-secondary-500/15 text-secondary-700 px-2 py-1 rounded-md">
              Trainer
            </span>
          )}
        </div>

        {batch.description && (
          <p className="mt-2 text-sm text-muted line-clamp-2">{batch.description}</p>
        )}

        <div className="mt-4 space-y-1.5 text-xs text-muted">
          {batch.schedule && (
            <p className="flex items-center gap-2">
              <Calendar size={14} className="text-faint" /> {batch.schedule}
            </p>
          )}
          {batch.venue && (
            <p className="flex items-center gap-2">
              <MapPin size={14} className="text-faint" /> {batch.venue}
            </p>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-line flex items-center justify-between">
          <span className="text-xs font-semibold text-faint flex items-center gap-1.5">
            <Users size={14} /> View batch
          </span>
          <ChevronRight size={16} className="text-primary-600 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </Link>
  );
}
