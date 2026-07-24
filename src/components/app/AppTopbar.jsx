import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { LogOut, User, Globe, ChevronDown, Shield } from "lucide-react";
import { useAuth } from "../../lib/AuthContext";
import { firstName } from "../../lib/names";
import Avatar from "../Avatar";

const TITLES = {
  "/dashboard": "Dashboard",
  "/batches": "Batches",
  "/track": "Daily check-in",
  "/progress": "Progress",
  "/tools": "Tools",
  "/join-batch": "Join a batch",
  "/create-batch": "Create batch",
};

export default function AppTopbar() {
  const { profile, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    function onClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  async function handleSignOut() {
    await signOut();
    navigate("/");
  }

  const crumb = TITLES[pathname] || (pathname.startsWith("/batch/") ? "Batch" : "");

  return (
    <header className="sticky top-0 z-30 h-[72px] bg-surface border-b border-line">
      <div className="h-full px-4 sm:px-6 flex items-center justify-between gap-4">
        <Link to="/dashboard" className="flex lg:hidden items-center gap-2.5">
          <span className="w-9 h-9 shrink-0">
            <img src="/images/logo.png" alt="JUST HFC" className="w-full h-full object-contain" />
          </span>
          <span className="mega text-lg text-body">JUST HFC</span>
        </Link>

        <p className="hidden lg:block text-[10px] font-bold uppercase tracking-[0.25em] text-faint">
          {crumb}
        </p>

        <div className="relative" ref={ref}>
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-2.5 pl-1.5 pr-3 py-1.5 border border-line hover:border-ink-300 transition-colors"
          >
            <Avatar name={profile?.full_name} url={profile?.photo_url} size="sm" className="!w-8 !h-8" />
            <span className="hidden sm:block text-[11px] font-bold uppercase tracking-[0.12em] text-body max-w-[110px] truncate">
              {firstName(profile?.full_name)}
            </span>
            <ChevronDown size={14} className={`text-faint transition-transform ${open ? "rotate-180" : ""}`} />
          </button>

          {open && (
            <div className="absolute right-0 top-full mt-1.5 w-60 bg-surface border border-line shadow-lift">
              <div className="px-4 py-3.5 border-b border-line flex items-center gap-3">
                <Avatar name={profile?.full_name} url={profile?.photo_url} size="md" />
                <div className="min-w-0">
                <p className="text-sm font-bold text-body truncate">{profile?.full_name}</p>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-faint flex items-center gap-1.5">
                  {profile?.role === "admin" && <Shield size={11} className="text-electric-500" />}
                  {profile?.role}
                </p>
                </div>
              </div>

              <Link to="/profile" onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-[11px] font-bold uppercase tracking-[0.15em] text-muted hover:text-body hover:bg-elevated transition-colors">
                <User size={16} /> My profile
              </Link>
              <Link to="/" onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-[11px] font-bold uppercase tracking-[0.15em] text-muted hover:text-body hover:bg-elevated transition-colors border-t border-line">
                <Globe size={16} /> Public site
              </Link>
              <button onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-4 py-3 text-[11px] font-bold uppercase tracking-[0.15em] text-electric-600 hover:bg-electric-500/5 transition-colors border-t border-line">
                <LogOut size={16} /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}