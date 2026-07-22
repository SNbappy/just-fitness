import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import AppSidebar from "../components/app/AppSidebar";
import AppTopbar from "../components/app/AppTopbar";
import AppBottomNav from "../components/app/AppBottomNav";

export default function AppLayout() {
  const { pathname } = useLocation();
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem("sidebar") === "collapsed");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    localStorage.setItem("sidebar", collapsed ? "collapsed" : "expanded");
  }, [collapsed]);

  return (
    <div className="min-h-screen bg-bg">
      <AppSidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      <div className={`transition-[padding] duration-300 ease-smooth ${collapsed ? "lg:pl-[76px]" : "lg:pl-[248px]"}`}>
        <AppTopbar />
        <main className="pb-24 lg:pb-0">
          <Outlet />
        </main>
      </div>
      <AppBottomNav />
    </div>
  );
}
