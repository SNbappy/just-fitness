import { NavLink, Link } from "react-router-dom";
import {
  LayoutDashboard, Users, CirclePlus, TrendingUp, Wrench,
  Globe, ChevronLeft,
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
      className={`hidden lg:flex flex-col fixed left-0 top-0 bottom-0 z-40 bg-ink-900 border-r border-white/[0.08] transition-[width] duration-300 ease-smooth ${collapsed ? "w-[76px]" : "w-[248px]"
        }`}
    >
      <div className="h-[72px] flex items-center gap-3 px-5 shrink-0 border-b border-white/[0.08]">
        <Link to="/" className="w-9 h-9 shrink-0">
          <img src="/images/logo.png" alt="JUST HFC" className="w-full h-full object-contain" />
        </Link>
        {!collapsed && <span className="mega text-lg text-white truncate">JUST HFC</span>}
      </div>

      <nav className="flex-1 py-4">
        <ul>
          {ITEMS.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                title={collapsed ? item.label : undefined}
                className={({ isActive }) =>
                  `relative flex items-center gap-3.5 px-5 h-12 text-[11px] font-bold uppercase tracking-[0.15em] transition-colors ${isActive
                    ? "text-white bg-white/[0.06]"
                    : "text-white/45 hover:text-white hover:bg-white/[0.04]"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span className="absolute left-0 inset-y-0 w-[3px] bg-electric-500" />
                    )}
                    <item.icon size={19} className="shrink-0" strokeWidth={2} />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t border-white/[0.08]">
        <Link
          to="/"
          title={collapsed ? "Public site" : undefined}
          className="flex items-center gap-3.5 px-5 h-12 text-[11px] font-bold uppercase tracking-[0.15em] text-white/45 hover:text-white hover:bg-white/[0.04] transition-colors"
        >
          <Globe size={19} className="shrink-0" strokeWidth={2} />
          {!collapsed && <span>Public site</span>}
        </Link>
        <button
          onClick={onToggle}
          className="w-full flex items-center gap-3.5 px-5 h-12 text-[11px] font-bold uppercase tracking-[0.15em] text-white/45 hover:text-white hover:bg-white/[0.04] transition-colors border-t border-white/[0.08]"
        >
          <ChevronLeft size={19} className={`shrink-0 transition-transform ${collapsed ? "rotate-180" : ""}`} strokeWidth={2} />
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
}