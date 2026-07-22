import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import PublicNavbar from "../components/public/PublicNavbar";
import PublicFooter from "../components/public/PublicFooter";

export default function PublicLayout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const bleed = !["/login", "/signup"].includes(pathname);

  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <PublicNavbar />
      <main className={`flex-1 ${bleed ? "" : "pt-[72px]"}`}>
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
}
