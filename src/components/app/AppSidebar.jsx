import { NavLink, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard, Users, CirclePlus, TrendingUp, Wrench,
  Dumbbell, Globe, ChevronLeft,
} from "lucide-react";

const ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/batches", label: "Batches", icon: Users },
  { to: "/track", label: "Daily check-in", icon: CirclePlus },
  { to: "/progress", label: "Progress", icon: TrendingUp },
  { to: "/tools", label: "Tools", icon: Wrench },
];

export default function AppSidebar({ collapsed, onToggle }) {
  return (
    <aside
      className={`hidden lg:flex flex-col fixed left-0 top-0 bottom-0 z-40 bg-surface border-r border-line transition-[width] duration-300 ease-smooth ${
        collapsed ? "w-[76px]" : "w-[248px]"
      }`}
    >
      <div className="h-16 flex items-center gap-2.5 px-4 shrink-0">
        <Link to="/" className="grid place-items-center w-10 h-10 rounded-xl bg-primary-500 text-white shadow-glow shrink-0">
          <Dumbbell size={20} strokeWidth={2.5} />
        </Link>
        {!collapsed && <span className="font-display font-extrabold text-body text-base truncate">JUST HFC</span>}
      </div>

      <nav className="flex-1 px-3 py-4">
        <ul className="space-y-1">
          {ITEMS.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                title={collapsed ? item.label : undefined}
                className={({ isActive }) =>
                  `relative flex items-center gap-3 rounded-xl px-3 h-11 text-sm font-semibold transition-colors ${
                    isActive ? "bg-primary-500/10 text-primary-500" : "text-muted hover:text-body hover:bg-elevated"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.span layoutId="sidebar-active"
                        className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-primary-500" />
                    )}
                    <item.icon size={20} className="shrink-0" />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-3 border-t border-line space-y-1">
        <Link to="/" title={collapsed ? "Public site" : undefined}
          className="flex items-center gap-3 rounded-xl px-3 h-11 text-sm font-semibold text-muted hover:text-body hover:bg-elevated transition-colors">
          <Globe size={20} className="shrink-0" />
          {!collapsed && <span>Public site</span>}
        </Link>
        <button onClick={onToggle}
          className="w-full flex items-center gap-3 rounded-xl px-3 h-11 text-sm font-semibold text-muted hover:text-body hover:bg-elevated transition-colors">
          <ChevronLeft size={20} className={`shrink-0 transition-transform ${collapsed ? "rotate-180" : ""}`} />
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
