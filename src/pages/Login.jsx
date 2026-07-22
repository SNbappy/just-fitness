import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Dumbbell, Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
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
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }
    navigate(location.state?.from?.pathname || "/dashboard");
  }

  return (
    <section className="min-h-[calc(100vh-64px)] grid lg:grid-cols-2">
      <div className="flex items-center justify-center p-6 sm:p-10 order-2 lg:order-1">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm"
        >
          <h1 className="text-2xl font-extrabold text-body">Welcome back</h1>
          <p className="mt-1 text-sm text-muted">Sign in to your JUST HFC account.</p>

          {error && (
            <div className="mt-5 flex gap-2 items-start bg-red-50 text-red-700 text-sm rounded-xl px-4 py-3">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="text-sm font-semibold text-body">Email</label>
              <div className="mt-1.5 relative">
                <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-faint" />
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-line bg-surface pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-body">Password</label>
              <div className="mt-1.5 relative">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-faint" />
                <input
                  required
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password"
                  className="w-full rounded-xl border border-line bg-surface pl-11 pr-11 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-faint"
                >
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary-600 font-semibold hover:underline">
              Create one
            </Link>
          </p>
        </motion.div>
      </div>

      <div className="hidden lg:flex flex-col justify-center bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800 text-white p-14 relative overflow-hidden order-1 lg:order-2">
        <div className="absolute -bottom-20 -right-16 w-72 h-72 rounded-full bg-secondary-500/100/25 blur-3xl animate-float-slow" />
        <span className="grid place-items-center w-14 h-14 rounded-2xl bg-surface/15 backdrop-blur border border-white/25 mb-8">
          <Dumbbell size={26} />
        </span>
        <h2 className="text-3xl font-extrabold leading-tight">
          Pick up right where you left off
        </h2>
        <p className="mt-4 text-primary-100 max-w-sm leading-relaxed">
          Your batches, progress charts and workout plans are all waiting for you.
        </p>
      </div>
    </section>
  );
}
