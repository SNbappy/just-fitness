import { Link } from "react-router-dom";
import { Dumbbell, Mail, Phone, MapPin } from "lucide-react";
import { club } from "../../data/club";

function FacebookIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.19 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.52 1.49-3.91 3.77-3.91 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.89h2.78l-.45 2.91h-2.33V22c4.78-.75 8.44-4.92 8.44-9.94z" />
    </svg>
  );
}

export default function PublicFooter() {
  return (
    <footer className="relative bg-void text-white/45 mt-auto grain overflow-hidden">
      <div className="absolute -top-32 left-1/3 w-[40vw] h-[40vw] max-w-[500px] rounded-full bg-electric-600/15 blur-[130px] pointer-events-none" />

      <div className="container-wide relative py-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-2.5 mb-5">
            <span className="grid place-items-center w-10 h-10 rounded-xl bg-electric-500 text-white">
              <Dumbbell size={20} strokeWidth={2.5} />
            </span>
            <span className="mega text-white text-2xl">JUST HFC</span>
          </div>
          <p className="text-sm leading-relaxed text-white/45">{club.intro}</p>
          {club.social.facebook && (
            <a href={club.social.facebook} target="_blank" rel="noreferrer" aria-label="Facebook"
              className="mt-5 inline-grid place-items-center w-11 h-11 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-electric-500 hover:border-electric-500 transition-colors">
              <FacebookIcon />
            </a>
          )}
        </div>

        <div>
          <h4 className="text-white text-xs font-bold uppercase tracking-[0.15em] mb-5">Explore</h4>
          <ul className="space-y-3 text-sm">
            {[
              ["/about", "About the club"],
              ["/gallery", "Gallery"],
              ["/events", "Events"],
              ["/notices", "Notices"],
              ["/signup", "Become a member"],
            ].map(([to, label]) => (
              <li key={to}>
                <Link to={to} className="hover:text-white transition-colors">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-white text-xs font-bold uppercase tracking-[0.15em] mb-5">Contact</h4>
          <ul className="space-y-4 text-sm">
            <li className="flex gap-3">
              <MapPin size={17} className="shrink-0 mt-0.5 text-electric-500" />
              <span className="leading-relaxed">{club.contact.address}</span>
            </li>
            <li className="flex gap-3">
              <Phone size={17} className="shrink-0 mt-0.5 text-electric-500" />
              <a href={`tel:${club.contact.phone}`} className="hover:text-white">
                {club.contact.phone} · PABX {club.contact.pabx}
              </a>
            </li>
            <li className="flex gap-3">
              <Mail size={17} className="shrink-0 mt-0.5 text-electric-500" />
              <a href={`mailto:${club.contact.email}`} className="hover:text-white break-all">
                {club.contact.email}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white text-xs font-bold uppercase tracking-[0.15em] mb-5">Join us</h4>
          <p className="text-sm leading-relaxed text-white/45">
            Free for every JUST student. Create an account and enter your trainer's code.
          </p>
          <Link to="/signup" className="btn-electric mt-5 w-full">Get started</Link>
        </div>
      </div>

      <div className="border-t border-white/5 relative">
        <div className="container-wide py-6 text-xs text-white/30 flex flex-col sm:flex-row gap-2 justify-between">
          <p>© {new Date().getFullYear()} {club.name}</p>
          <p>{club.university}</p>
        </div>
      </div>
    </footer>
  );
}
