import { Link } from "react-router-dom";
import { Dumbbell, Mail, Phone, MapPin } from "lucide-react";
import { club } from "../data/club";

function FacebookIcon({ size = 19 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.19 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.52 1.49-3.91 3.77-3.91 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.89h2.78l-.45 2.91h-2.33V22c4.78-.75 8.44-4.92 8.44-9.94z" />
    </svg>
  );
}

function YoutubeIcon({ size = 19 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23.5 6.9a3.02 3.02 0 0 0-2.12-2.14C19.5 4.25 12 4.25 12 4.25s-7.5 0-9.38.51A3.02 3.02 0 0 0 .5 6.9C0 8.79 0 12 0 12s0 3.21.5 5.1a3.02 3.02 0 0 0 2.12 2.14c1.88.51 9.38.51 9.38.51s7.5 0 9.38-.51a3.02 3.02 0 0 0 2.12-2.14C24 15.21 24 12 24 12s0-3.21-.5-5.1zM9.6 15.6V8.4L15.8 12l-6.2 3.6z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="bg-ink-900 text-ink-300 mt-auto">
      <div className="container-app py-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-2.5 mb-4">
            <span className="grid place-items-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 text-white">
              <Dumbbell size={20} strokeWidth={2.5} />
            </span>
            <span className="font-display font-extrabold text-white text-lg">JUST HFC</span>
          </div>
          <p className="text-sm leading-relaxed text-ink-400">{club.intro}</p>
        </div>

        <div>
          <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4">Explore</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/about" className="hover:text-primary-400">About the Club</Link></li>
            <li><Link to="/gallery" className="hover:text-primary-400">Gallery</Link></li>
            <li><Link to="/events" className="hover:text-primary-400">Events</Link></li>
            <li><Link to="/notices" className="hover:text-primary-400">Notices</Link></li>
            <li><Link to="/signup" className="hover:text-primary-400">Become a Member</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4">Contact</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-2.5">
              <MapPin size={17} className="shrink-0 mt-0.5 text-primary-400" />
              <span>{club.contact.address}</span>
            </li>
            <li className="flex gap-2.5">
              <Phone size={17} className="shrink-0 mt-0.5 text-primary-400" />
              <a href={`tel:${club.contact.phone}`} className="hover:text-primary-400">
                {club.contact.phone} &nbsp;·&nbsp; PABX {club.contact.pabx}
              </a>
            </li>
            <li className="flex gap-2.5">
              <Mail size={17} className="shrink-0 mt-0.5 text-primary-400" />
              <a href={`mailto:${club.contact.email}`} className="hover:text-primary-400 break-all">
                {club.contact.email}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4">Follow</h4>
          <div className="flex gap-3">
            {club.social.facebook && (
              <a href={club.social.facebook} target="_blank" rel="noreferrer"
                 className="grid place-items-center w-11 h-11 rounded-xl bg-ink-800 hover:bg-primary-600 text-white transition-colors"
                 aria-label="Facebook">
                <FacebookIcon />
              </a>
            )}
            {club.social.youtube && (
              <a href={club.social.youtube} target="_blank" rel="noreferrer"
                 className="grid place-items-center w-11 h-11 rounded-xl bg-ink-800 hover:bg-secondary-600 text-white transition-colors"
                 aria-label="YouTube">
                <YoutubeIcon />
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-ink-800">
        <div className="container-app py-5 text-xs text-ink-500 flex flex-col sm:flex-row gap-2 justify-between">
          <p>© {new Date().getFullYear()} {club.name}. All rights reserved.</p>
          <p>{club.university}</p>
        </div>
      </div>
    </footer>
  );
}
