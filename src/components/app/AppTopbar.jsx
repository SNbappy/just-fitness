import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Dumbbell, LogOut, User, Globe, ChevronDown, Shield } from "lucide-react";
import { useAuth } from "../../lib/AuthContext";

export default function AppTopbar() {
  const { profile, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

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

  const initials = (profile?.full_name || "?")
    .split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();

  return (
    <header className="sticky top-0 z-30 h-16 bg-surface/80 backdrop-blur-xl border-b border-line">
      <div className="h-full px-4 sm:px-6 flex items-center justify-between gap-4">
        <Link to="/dashboard" className="flex lg:hidden items-center gap-2.5">
          <span className="grid place-items-center w-9 h-9 rounded-xl bg-primary-500 text-white">
            <Dumbbell size={18} strokeWidth={2.5} />
          </span>
          <span className="font-display font-extrabold text-body">JUST HFC</span>
        </Link>

        <div className="hidden lg:block" />

        <div className="flex items-center gap-1.5">

          <div className="relative" ref={ref}>
            <button onClick={() => setOpen((v) => !v)}
              className="flex items-center gap-2 rounded-xl pl-1.5 pr-2.5 py-1.5 hover:bg-elevated transition-colors">
              <span className="grid place-items-center w-8 h-8 rounded-lg bg-primary-500 text-white text-xs font-bold">
                {initials}
              </span>
              <span className="hidden sm:block text-sm font-semibold text-body max-w-[120px] truncate">
                {profile?.full_name?.split(" ")[0]}
              </span>
              <ChevronDown size={15} className={`text-faint transition-transform ${open ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-60 card p-2 shadow-lift"
                >
                  <div className="px-3 py-2.5 border-b border-line mb-1">
                    <p className="text-sm font-bold text-body truncate">{profile?.full_name}</p>
                    <p className="text-xs text-muted capitalize flex items-center gap-1.5 mt-0.5">
                      {profile?.role === "admin" && <Shield size={12} className="text-primary-500" />}
                      {profile?.role}
                    </p>
                  </div>

                  <Link to="/dashboard" onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-muted hover:text-body hover:bg-elevated transition-colors">
                    <User size={17} /> My profile
                  </Link>
                  <Link to="/" onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-muted hover:text-body hover:bg-elevated transition-colors">
                    <Globe size={17} /> Public site
                  </Link>
                  <button onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-primary-500 hover:bg-primary-500/10 transition-colors">
                    <LogOut size={17} /> Sign out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}
