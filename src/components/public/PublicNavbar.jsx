import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, Dumbbell, ChevronDown, Info, Image, Bell, CalendarDays, LayoutDashboard } from "lucide-react";
import { useAuth } from "../../lib/AuthContext";
import MobileMenu from "./MobileMenu";

const NAV = [
  { label: "Home", to: "/" },
  {
    label: "Club",
    items: [
      { to: "/about", label: "About us", desc: "Mission, history and how to join", icon: Info },
      { to: "/notices", label: "Notices", desc: "Official announcements", icon: Bell },
    ],
  },
  {
    label: "Activities",
    items: [
      { to: "/gallery", label: "Gallery", desc: "Photos and videos from sessions", icon: Image },
      { to: "/events", label: "Events", desc: "Tournaments and upcoming programmes", icon: CalendarDays },
    ],
  },
  { label: "Contact", to: "/contact" },
];

export default function PublicNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();
  const { user } = useAuth();

  const bleed = !["/login", "/signup"].includes(pathname);
  const transparent = bleed && !scrolled;

  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY > 20); }
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setOpenMenu(null);
  }, [pathname]);

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ease-smooth ${
          transparent ? "bg-transparent" : "bg-void border-b border-white/10"
        }`}
      >
        <nav className="container-wide flex items-center justify-between h-[76px]">
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <span className="w-10 h-10 shrink-0"><img src="/images/logo.png" alt="JUST HFC" className="w-full h-full object-contain" /></span>
            <span className="leading-none">
              <span className={`block mega text-lg text-white`}>
                JUST HFC
              </span>
              <span className={`block text-[10px] font-medium mt-1 text-white/45`}>
                Health &amp; Fitness Club
              </span>
            </span>
          </Link>

          <ul className="hidden lg:flex items-center gap-1" onMouseLeave={() => setOpenMenu(null)}>
            {NAV.map((item) =>
              item.items ? (
                <li key={item.label} className="relative" onMouseEnter={() => setOpenMenu(item.label)}>
                  <button
                    className={`flex items-center gap-1 px-4 py-2 text-sm font-bold tracking-wide transition-colors ${
                      transparent ? "text-white hover:text-white/80" : "text-white/45 hover:text-white"
                    }`}
                  >
                    {item.label}
                    <ChevronDown size={15} className={`transition-transform ${openMenu === item.label ? "rotate-180" : ""}`} />
                  </button>

                  <AnimatePresence>
                    {openMenu === item.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.97 }}
                        transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute left-0 top-full pt-3 w-80"
                      >
                        <div className="bg-carbon border border-white/10 p-2 rounded-none">
                          {item.items.map((sub) => (
                            <Link key={sub.to} to={sub.to}
                              className="flex gap-3 p-3 hover:bg-white/5 transition-colors group">
                              <span className="grid place-items-center w-10 h-10 bg-electric-500/15 text-electric-400 shrink-0 group-hover:bg-electric-500 group-hover:text-white transition-colors">
                                <sub.icon size={18} />
                              </span>
                              <span className="min-w-0">
                                <span className="block text-sm font-bold text-white">{sub.label}</span>
                                <span className="block text-xs text-white/45 mt-0.5">{sub.desc}</span>
                              </span>
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              ) : (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `relative px-4 py-2 text-sm font-bold tracking-wide transition-colors ${
                        transparent
                          ? "text-white hover:text-white/80"
                          : isActive ? "text-white" : "text-white/45 hover:text-white"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {item.label}
                        {isActive && (
                          <motion.span layoutId="nav-underline"
                            className="absolute left-3 right-3 -bottom-1 h-[3px] bg-electric-500" />
                        )}
                      </>
                    )}
                  </NavLink>
                </li>
              )
            )}
          </ul>

          <div className="hidden lg:flex items-center gap-2">
            {user ? (
              <Link to="/dashboard" className="btn border border-white/25 text-white hover:bg-white hover:text-void rounded-none px-6 text-xs uppercase tracking-[0.2em] font-bold">
                <LayoutDashboard size={17} /> Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login"
                  className={`btn ${transparent ? "text-white/85 hover:bg-white/10" : "text-white/60 hover:text-white hover:bg-white/10"}`}>
                  Sign in
                </Link>
                <Link to="/signup" className="btn border border-white/25 text-white hover:bg-white hover:text-void rounded-none px-6 text-xs uppercase tracking-[0.2em] font-bold">Join the club</Link>
              </>
            )}
          </div>

          <div className="flex lg:hidden items-center gap-1">
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className={`grid place-items-center w-11 h-11 transition-colors ${
                transparent ? "text-white hover:bg-white/10" : "text-white hover:bg-white/10"
              }`}
            >
              <Menu size={24} />
            </button>
          </div>
        </nav>
      </header>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} nav={NAV} />
    </>
  );
}
