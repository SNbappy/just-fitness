import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import PublicNavbar from "../components/public/PublicNavbar";
import PublicFooter from "../components/public/PublicFooter";

const AUTH_PAGES = ["/login", "/signup"];

export default function PublicLayout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  if (AUTH_PAGES.includes(pathname)) {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <PublicNavbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
}