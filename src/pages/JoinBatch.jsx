import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { KeyRound, AlertCircle, CheckCircle2 } from "lucide-react";
import { useAuth } from "../lib/AuthContext";
import { joinBatchByCode } from "../lib/batches";

export default function JoinBatch() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fromUrl = params.get("code");
    if (fromUrl) setCode(fromUrl.toUpperCase().slice(0, 6));
  }, [params]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const { data, error: joinError } = await joinBatchByCode(code, user.id);
    setLoading(false);

    if (joinError) {
      setError(joinError.message);
      return;
    }
    setSuccess(`Welcome to ${data.name}!`);
    setTimeout(() => navigate(`/batch/${data.id}`), 1200);
  }

  return (
    <section className="section">
      <div className="container-app max-w-md">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <span className="inline-grid place-items-center w-16 h-16 rounded-2xl bg-primary-500/10 text-primary-600">
            <KeyRound size={30} />
          </span>
          <h1 className="mt-5 text-3xl font-extrabold text-body">Join a Batch</h1>
          <p className="mt-2 text-muted">Enter the 6-character code your trainer gave you.</p>
        </motion.div>

        {error && (
          <div className="mt-6 flex gap-2 items-start bg-red-50 text-red-700 text-sm rounded-xl px-4 py-3">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="mt-6 flex gap-2 items-center bg-primary-500/10 text-primary-700 text-sm rounded-xl px-4 py-3">
            <CheckCircle2 size={18} /> <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 card p-6 sm:p-8">
          <input
            required
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            maxLength={6}
            placeholder="ABC123"
            autoCapitalize="characters"
            className="w-full text-center text-3xl font-extrabold tracking-[0.35em] uppercase rounded-xl border-2 border-line px-4 py-5 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
          <button type="submit" disabled={loading || code.length < 6} className="btn-primary w-full mt-5">
            {loading ? "Joining…" : "Join Batch"}
          </button>
        </form>
      </div>
    </section>
  );
}
