import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, KeyRound, Users } from "lucide-react";
import { useAuth } from "../lib/AuthContext";
import { getMyBatches, getBatchesITrain } from "../lib/batches";
import BatchCard from "../components/BatchCard";
import Spinner from "../components/Spinner";

export default function Batches() {
  const { user, profile } = useAuth();
  const [myBatches, setMyBatches] = useState([]);
  const [trainingBatches, setTrainingBatches] = useState([]);
  const [loading, setLoading] = useState(true);

  const canTrain = profile?.role === "trainer" || profile?.role === "admin";

  useEffect(() => {
    let active = true;

    async function load() {
      const [mine, training] = await Promise.all([
        getMyBatches(user.id),
        canTrain ? getBatchesITrain(user.id) : Promise.resolve({ data: [] }),
      ]);
      if (!active) return;
      setMyBatches(mine.data || []);
      setTrainingBatches(training.data || []);
      setLoading(false);
    }

    if (user) load();
    return () => { active = false; };
  }, [user, canTrain]);

  if (loading) return <Spinner full />;

  return (
    <section className="section">
      <div className="container-app">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Training</p>
            <h1 className="mt-2 text-3xl font-extrabold text-ink-900">My Batches</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to="/join-batch" className="btn-outline">
              <KeyRound size={17} /> Join with Code
            </Link>
            {canTrain && (
              <Link to="/create-batch" className="btn-primary">
                <Plus size={18} /> Create Batch
              </Link>
            )}
          </div>
        </motion.div>

        {canTrain && (
          <div className="mt-10">
            <h2 className="text-sm font-bold uppercase tracking-wider text-ink-400">
              Batches I Train ({trainingBatches.length})
            </h2>
            {trainingBatches.length === 0 ? (
              <div className="mt-4 card p-10 text-center">
                <Users className="mx-auto text-ink-300" size={36} />
                <p className="mt-3 font-semibold text-ink-600">No batches yet</p>
                <p className="text-sm text-ink-400 mt-1">Create your first training batch to get a join code.</p>
                <Link to="/create-batch" className="btn-primary mt-5">
                  <Plus size={18} /> Create Batch
                </Link>
              </div>
            ) : (
              <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {trainingBatches.map((b) => <BatchCard key={b.id} batch={b} isTrainer />)}
              </div>
            )}
          </div>
        )}

        <div className="mt-12">
          <h2 className="text-sm font-bold uppercase tracking-wider text-ink-400">
            Batches I've Joined ({myBatches.length})
          </h2>
          {myBatches.length === 0 ? (
            <div className="mt-4 card p-10 text-center">
              <KeyRound className="mx-auto text-ink-300" size={36} />
              <p className="mt-3 font-semibold text-ink-600">You haven't joined a batch yet</p>
              <p className="text-sm text-ink-400 mt-1">Ask your trainer for the 6-character join code.</p>
              <Link to="/join-batch" className="btn-primary mt-5">
                <KeyRound size={17} /> Join a Batch
              </Link>
            </div>
          ) : (
            <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {myBatches.map((b) => <BatchCard key={b.id} batch={b} />)}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
