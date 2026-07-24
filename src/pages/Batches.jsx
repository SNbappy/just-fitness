import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, KeyRound, Users } from "lucide-react";
import { useAuth } from "../lib/AuthContext";
import { getMyBatches, getBatchesITrain } from "../lib/batches";
import BatchCard from "../components/BatchCard";
import Spinner from "../components/Spinner";
import AppPageHeader from "../components/app/AppPageHeader";

function Empty({ icon: Icon, title, desc, to, cta }) {
  return (
    <div className="border border-line bg-surface p-14 text-center">
      <Icon className="mx-auto text-faint" size={32} />
      <p className="mt-5 mega text-xl text-body">{title}</p>
      <p className="mt-2 text-sm text-muted max-w-sm mx-auto">{desc}</p>
      <Link to={to} className="btn-primary mt-7">{cta}</Link>
    </div>
  );
}

function SectionLabel({ children, count }) {
  return (
    <div className="flex items-baseline gap-3 pb-4 border-b border-line">
      <h2 className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted">
        {children}
      </h2>
      <span className="mega text-sm text-faint tabular">{count}</span>
    </div>
  );
}

export default function Batches() {
  const { user, profile } = useAuth();
  const [mine, setMine] = useState([]);
  const [training, setTraining] = useState([]);
  const [loading, setLoading] = useState(true);

  const canTrain = profile?.role === "trainer" || profile?.role === "admin";

  useEffect(() => {
    let active = true;
    async function load() {
      const [a, b] = await Promise.all([
        getMyBatches(user.id),
        canTrain ? getBatchesITrain(user.id) : Promise.resolve({ data: [] }),
      ]);
      if (!active) return;
      setMine(a.data || []);
      setTraining(b.data || []);
      setLoading(false);
    }
    if (user) load();
    return () => { active = false; };
  }, [user, canTrain]);

  if (loading) return <Spinner full />;

  return (
    <>
      <AppPageHeader eyebrow="Training" title="My" accent="batches">
        <Link to="/join-batch" className="btn-outline">
          <KeyRound size={15} /> Join with code
        </Link>
        {canTrain && (
          <Link to="/create-batch" className="btn-primary">
            <Plus size={16} /> Create batch
          </Link>
        )}
      </AppPageHeader>

      <div className="container-app py-10 space-y-12">
        {canTrain && (
          <section>
            <SectionLabel count={String(training.length).padStart(2, "0")}>
              Batches I train
            </SectionLabel>
            {training.length === 0 ? (
              <div className="mt-5">
                <Empty
                  icon={Users}
                  title="No batches yet"
                  desc="Create your first training batch and share the join code with students."
                  to="/create-batch"
                  cta="Create batch"
                />
              </div>
            ) : (
              <div className="mt-5 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {training.map((b) => <BatchCard key={b.id} batch={b} isTrainer />)}
              </div>
            )}
          </section>
        )}

        <section>
          <SectionLabel count={String(mine.length).padStart(2, "0")}>
            Batches I've joined
          </SectionLabel>
          {mine.length === 0 ? (
            <div className="mt-5">
              <Empty
                icon={KeyRound}
                title="Not in a batch yet"
                desc="Ask your trainer for the six-character join code or scan their QR poster."
                to="/join-batch"
                cta="Join a batch"
              />
            </div>
          ) : (
            <div className="mt-5 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {mine.map((b) => <BatchCard key={b.id} batch={b} />)}
            </div>
          )}
        </section>
      </div>
    </>
  );
}