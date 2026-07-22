import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Pin, Trash2, Megaphone } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../lib/AuthContext";
import Spinner from "../Spinner";

export default function BatchAnnouncements({ batchId, isTrainer }) {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    let active = true;
    async function load() {
      const { data } = await supabase
        .from("batch_posts")
        .select("*, profiles(full_name, photo_url)")
        .eq("batch_id", batchId)
        .order("pinned", { ascending: false })
        .order("created_at", { ascending: false });
      if (active) { setPosts(data || []); setLoading(false); }
    }
    load();
    return () => { active = false; };
  }, [batchId]);

  async function submit(e) {
    e.preventDefault();
    if (!content.trim()) return;
    setPosting(true);
    const { data, error } = await supabase
      .from("batch_posts")
      .insert({ batch_id: batchId, author_id: user.id, content: content.trim() })
      .select("*, profiles(full_name, photo_url)")
      .single();
    setPosting(false);
    if (!error) { setPosts((p) => [data, ...p]); setContent(""); }
  }

  async function togglePin(post) {
    const { error } = await supabase
      .from("batch_posts").update({ pinned: !post.pinned }).eq("id", post.id);
    if (!error) {
      setPosts((p) =>
        [...p.map((x) => (x.id === post.id ? { ...x, pinned: !x.pinned } : x))]
          .sort((a, b) => (b.pinned - a.pinned) || (new Date(b.created_at) - new Date(a.created_at)))
      );
    }
  }

  async function remove(id) {
    if (!confirm("Delete this announcement?")) return;
    await supabase.from("batch_posts").delete().eq("id", id);
    setPosts((p) => p.filter((x) => x.id !== id));
  }

  if (loading) return <Spinner />;

  return (
    <div>
      {isTrainer && (
        <form onSubmit={submit} className="card p-5">
          <textarea
            rows={3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Post an announcement — schedule change, reminder, motivation…"
            className="w-full rounded-xl border border-ink-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
          />
          <div className="mt-3 flex justify-end">
            <button type="submit" disabled={posting || !content.trim()} className="btn-primary">
              <Send size={16} /> {posting ? "Posting…" : "Post"}
            </button>
          </div>
        </form>
      )}

      {posts.length === 0 ? (
        <div className="card p-10 text-center mt-5">
          <Megaphone className="mx-auto text-ink-300" size={34} />
          <p className="mt-3 font-semibold text-ink-600">No announcements yet</p>
          <p className="text-sm text-ink-400 mt-1">
            {isTrainer ? "Post the first one above." : "Your trainer hasn't posted anything yet."}
          </p>
        </div>
      ) : (
        <div className="mt-5 space-y-4">
          <AnimatePresence>
            {posts.map((p) => (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                className={`card p-5 ${p.pinned ? "border-l-4 border-l-secondary-500" : ""}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-bold text-ink-900 text-sm">
                      {p.profiles?.full_name || "Trainer"}
                    </p>
                    <p className="text-xs text-ink-400">
                      {new Date(p.created_at).toLocaleString([], {
                        day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
                      })}
                      {p.pinned && <span className="ml-2 text-secondary-600 font-bold">· Pinned</span>}
                    </p>
                  </div>
                  {isTrainer && (
                    <div className="flex gap-1 shrink-0">
                      <button onClick={() => togglePin(p)}
                        className={`grid place-items-center w-8 h-8 rounded-lg hover:bg-ink-100 ${
                          p.pinned ? "text-secondary-600" : "text-ink-400"}`}
                        title={p.pinned ? "Unpin" : "Pin"}>
                        <Pin size={15} />
                      </button>
                      <button onClick={() => remove(p.id)}
                        className="grid place-items-center w-8 h-8 rounded-lg hover:bg-red-50 text-ink-400 hover:text-red-600"
                        title="Delete">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  )}
                </div>
                <p className="mt-3 text-ink-700 whitespace-pre-wrap leading-relaxed">{p.content}</p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
