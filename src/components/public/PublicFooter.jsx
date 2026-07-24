import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { club } from "../../data/club";

const LINKS = [
  ["/about", "About"], ["/gallery", "Gallery"], ["/events", "Events"],
  ["/notices", "Notices"], ["/contact", "Contact"], ["/signup", "Join"],
];

export default function PublicFooter() {
  return (
    <footer className="bg-void text-white border-t border-white/10 grain">
      <div className="container-wide pt-16 pb-10">
        <div className="grid lg:grid-cols-[1.4fr,1fr,1fr] gap-12 lg:gap-16">
          <div>
            <p className="mega text-[clamp(2.2rem,6vw,4rem)] leading-[0.9]">
              JUST<br /><span className="text-electric-500">HFC</span>
            </p>
            <p className="mt-6 max-w-sm text-sm text-white/45 leading-relaxed">{club.intro}</p>
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/30">Explore</p>
            <ul className="mt-6 space-y-3">
              {LINKS.map(([to, label]) => (
                <li key={to}>
                  <Link to={to} className="group flex items-center gap-2 text-lg font-bold text-white/70 hover:text-white transition-colors">
                    {label}
                    <ArrowUpRight size={16} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/30">Contact</p>
            <div className="mt-6 space-y-4 text-sm text-white/50">
              <p className="leading-relaxed">{club.contact.address}</p>
              <a href={`tel:${club.contact.phone}`} className="block text-white hover:text-electric-400 transition-colors font-bold">
                {club.contact.phone}
              </a>
              <a href={`mailto:${club.contact.email}`} className="block hover:text-white transition-colors break-all">
                {club.contact.email}
              </a>
              <p className="text-white/30">PABX {club.contact.pabx}</p>
              {club.social.facebook && (
                <a href={club.social.facebook} target="_blank" rel="noreferrer"
                  className="inline-flex items-center gap-2 pt-2 text-xs font-bold uppercase tracking-[0.2em] text-white/50 hover:text-white transition-colors">
                  Facebook <ArrowUpRight size={14} />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="mt-16 pt-6 border-t border-white/10 flex flex-col sm:flex-row gap-3 justify-between text-[11px] uppercase tracking-[0.15em] text-white/25">
          <p>© {new Date().getFullYear()} {club.name}</p>
          <p>{club.university}</p>
        </div>
      </div>
    </footer>
  );
}
