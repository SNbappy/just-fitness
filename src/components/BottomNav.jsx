import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, PlusCircle, TrendingUp, Wrench } from "lucide-react";
import { useAuth } from "../lib/AuthContext";

const items = [
  { to: "/dashboard", label: "Home", icon: LayoutDashboard },
  { to: "/batches", label: "Batches", icon: Users },
  { to: "/track", label: "Log", icon: PlusCircle, center: true },
  { to: "/progress", label: "Progress", icon: TrendingUp },
  { to: "/tools", label: "Tools", icon: Wrench },
];

export default function BottomNav() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-ink-100 pb-[env(safe-area-inset-bottom)]">
      <div className="grid grid-cols-5">
        {items.map((it) => (
          <NavLink key={it.to} to={it.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-0.5 py-2.5 transition-colors ${
                isActive ? "text-primary-600" : "text-ink-400"
              }`
            }>
            {({ isActive }) => (
              <>
                <it.icon size={it.center ? 26 : 21} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-bold">{it.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
