import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { LayoutDashboard, Users, Plus, TrendingUp, Wrench } from "lucide-react";

const ITEMS = [
  { to: "/dashboard", label: "Home", icon: LayoutDashboard },
  { to: "/batches", label: "Batches", icon: Users },
  { to: "/track", label: "Log", icon: Plus, center: true },
  { to: "/progress", label: "Progress", icon: TrendingUp },
  { to: "/tools", label: "Tools", icon: Wrench },
];

export default function AppBottomNav() {
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-surface/90 backdrop-blur-xl border-t border-line pb-[env(safe-area-inset-bottom)]">
      <div className="grid grid-cols-5 px-1">
        {ITEMS.map((it) =>
          it.center ? (
            <NavLink key={it.to} to={it.to} className="flex flex-col items-center justify-center pt-1.5 pb-2">
              {({ isActive }) => (
                <>
                  <motion.span
                    animate={{ scale: isActive ? 1.06 : 1 }}
                    className="grid place-items-center w-12 h-12 rounded-2xl bg-primary-500 text-white shadow-glow -mt-5"
                  >
                    <it.icon size={24} strokeWidth={2.5} />
                  </motion.span>
                  <span className={`text-[10px] font-bold mt-1 ${isActive ? "text-primary-500" : "text-faint"}`}>
                    {it.label}
                  </span>
                </>
              )}
            </NavLink>
          ) : (
            <NavLink key={it.to} to={it.to} className="relative flex flex-col items-center justify-center gap-1 py-2.5">
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.span layoutId="bottomnav-pill"
                      className="absolute inset-x-2 inset-y-1 rounded-xl bg-primary-500/10"
                      transition={{ type: "spring", damping: 26, stiffness: 320 }} />
                  )}
                  <it.icon size={21} strokeWidth={isActive ? 2.5 : 2}
                    className={`relative ${isActive ? "text-primary-500" : "text-faint"}`} />
                  <span className={`relative text-[10px] font-bold ${isActive ? "text-primary-500" : "text-faint"}`}>
                    {it.label}
                  </span>
                </>
              )}
            </NavLink>
          )
        )}
      </div>
    </nav>
  );
}
