import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AlertCircle, Eye, EyeOff, ArrowUpRight } from "lucide-react";
import { supabase } from "../lib/supabase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (err) return setError(err.message);
    navigate(location.state?.from?.pathname || "/dashboard");
  }

  const inputCls =
    "w-full bg-carbon border border-white/15 px-4 py-3.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-electric-500";
  const labelCls =
    "block text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-2";

  return (
    <section className="min-h-screen bg-void text-white grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between p-14 border-r border-white/10 grain relative overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[36rem] h-[36rem] rounded-full bg-electric-600/20 blur-[140px]" />

        <Link to="/" className="relative flex items-center gap-3">
          <span className="w-10 h-10 shrink-0">
            <img src="/images/logo.png" alt="JUST HFC" className="w-full h-full object-contain" />
          </span>
          <span className="mega text-2xl">JUST HFC</span>
        </Link>

        <div className="relative">
          <h2 className="mega text-[clamp(2.5rem,5vw,4.5rem)]">
            Welcome
            <br />
            <span className="text-electric-500">back</span>
          </h2>
          <p className="mt-6 max-w-sm text-white/50 leading-relaxed">
            Your batches, workout plans and progress charts are exactly where
            you left them.
          </p>

          <ul className="mt-10 space-y-4 max-w-sm">
            {[
              ["01", "Log today's check-in in under a minute"],
              ["02", "See your batch schedule and announcements"],
              ["03", "Watch your progress build week by week"],
            ].map(([n, text]) => (
              <li key={n} className="flex gap-4 items-baseline border-t border-white/10 pt-4">
                <span className="mega text-lg text-electric-500 shrink-0">{n}</span>
                <span className="text-sm text-white/60">{text}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-[10px] uppercase tracking-[0.25em] text-white/25">
          Jashore University of Science and Technology
        </p>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-sm">
          <Link to="/" className="lg:hidden flex items-center gap-2.5 mb-10">
            <span className="w-10 h-10 shrink-0">
              <img src="/images/logo.png" alt="JUST HFC" className="w-full h-full object-contain" />
            </span>
            <span className="mega text-2xl">JUST HFC</span>
          </Link>

          <h1 className="mega text-4xl">Sign in</h1>
          <p className="mt-3 text-sm text-white/45">Enter your account details.</p>

          {error && (
            <div className="mt-6 flex gap-2 items-start bg-red-500/10 border border-red-500/30 text-red-300 text-sm px-4 py-3">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className={labelCls}>Email</label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputCls}
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className={labelCls}>Password</label>
              <div className="relative">
                <input
                  required
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputCls + " pr-12"}
                  placeholder="Your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/35 hover:text-white"
                >
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group w-full flex items-center justify-between bg-electric-500 hover:bg-electric-600 transition-colors pl-6 pr-2 py-2 min-h-[56px] disabled:opacity-60"
            >
              <span className="text-[11px] font-bold uppercase tracking-[0.2em]">
                {loading ? "Signing in" : "Sign in"}
              </span>
              <span className="grid place-items-center w-11 h-11 bg-void group-hover:rotate-45 transition-transform duration-300">
                <ArrowUpRight size={20} />
              </span>
            </button>
          </form>

          <p className="mt-8 text-sm text-white/40">
            No account yet?{" "}
            <Link to="/signup" className="text-electric-400 font-bold hover:text-electric-300">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}