import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Dumbbell } from "lucide-react";
import { club } from "../data/club";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/gallery", label: "Gallery" },
  { to: "/events", label: "Events" },
  { to: "/notices", label: "Notices" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => setOpen(false), [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-md shadow-soft border-b border-ink-100"
          : "bg-white/70 backdrop-blur-sm"
      }`}
    >
      <nav className="container-app flex items-center justify-between h-16 sm:h-18">
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <span className="grid place-items-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-glow">
            <Dumbbell size={20} strokeWidth={2.5} />
          </span>
          <span className="leading-tight">
            <span className="block font-display font-extrabold text-ink-900 text-base sm:text-lg">
              JUST HFC
            </span>
            <span className="block text-[10px] sm:text-[11px] text-ink-500 font-medium">
              Health &amp; Fitness Club
            </span>
          </span>
        </Link>

        <ul className="hidden lg:flex items-center gap-1">
          {links.map((l) => (
            <li key={l.to}>
              <NavLink
                to={l.to}
                className={({ isActive }) =>
                  `px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    isActive
                      ? "text-primary-600 bg-primary-50"
                      : "text-ink-600 hover:text-primary-600 hover:bg-ink-100"
                  }`
                }
              >
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="hidden lg:flex items-center gap-2">
          <Link to="/login" className="btn text-ink-700 hover:bg-ink-100">
            Sign In
          </Link>
          <Link to="/signup" className="btn-primary">
            Join the Club
          </Link>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="lg:hidden grid place-items-center w-11 h-11 rounded-xl text-ink-700 hover:bg-ink-100"
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="lg:hidden overflow-hidden bg-white border-t border-ink-100"
          >
            <ul className="container-app py-3 flex flex-col gap-1">
              {links.map((l) => (
                <li key={l.to}>
                  <NavLink
                    to={l.to}
                    className={({ isActive }) =>
                      `block px-4 py-3 rounded-xl font-semibold ${
                        isActive
                          ? "text-primary-600 bg-primary-50"
                          : "text-ink-700 hover:bg-ink-100"
                      }`
                    }
                  >
                    {l.label}
                  </NavLink>
                </li>
              ))}
              <li className="grid grid-cols-2 gap-2 pt-2 pb-1">
                <Link to="/login" className="btn-outline">Sign In</Link>
                <Link to="/signup" className="btn-primary">Join</Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
