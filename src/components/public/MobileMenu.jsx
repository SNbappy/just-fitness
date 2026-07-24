import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Dumbbell, ArrowRight, Mail, Phone } from "lucide-react";
import { useAuth } from "../../lib/AuthContext";
import { club } from "../../data/club";

export default function MobileMenu({ open, onClose, nav }) {
  const { user } = useAuth();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const links = nav.flatMap((n) => (n.items ? n.items : [{ to: n.to, label: n.label }]));

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[200] lg:hidden"
        >
          <div className="absolute inset-0 bg-ink-950" />

          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-1/4 -right-1/4 w-[80vw] h-[80vw] rounded-full bg-primary-500/25 blur-[100px]" />
            <div className="absolute -bottom-1/4 -left-1/4 w-[70vw] h-[70vw] rounded-full bg-secondary-500/20 blur-[100px]" />
          </div>

          <motion.div
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 260 }}
            className="relative h-full flex flex-col overflow-y-auto"
          >
            <div className="flex items-center justify-between h-[72px] px-5 shrink-0">
              <div className="flex items-center gap-2.5">
                <span className="w-10 h-10 shrink-0"><img src="/images/logo.png" alt="JUST HFC" className="w-full h-full object-contain" /></span>
                <span className="font-display font-extrabold text-lg text-white">JUST HFC</span>
              </div>
              <button onClick={onClose} aria-label="Close menu"
                className="grid place-items-center w-11 h-11 rounded-xl text-white hover:bg-white/10">
                <X size={24} />
              </button>
            </div>

            <nav className="flex-1 px-5 pt-6">
              <ul>
                {links.map((l, i) => (
                  <motion.li key={l.to}
                    initial={{ opacity: 0, x: 32 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 + i * 0.05, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
                    <Link to={l.to} onClick={onClose}
                      className="group flex items-center justify-between py-4 border-b border-white/10">
                      <span className="font-display text-3xl font-bold text-white group-active:text-primary-400 transition-colors">
                        {l.label}
                      </span>
                      <ArrowRight size={20} className="text-white/30 group-active:text-primary-400 group-active:translate-x-1 transition-all" />
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.4 }}
              className="p-5 pb-8 shrink-0"
            >
              {user ? (
                <Link to="/dashboard" onClick={onClose} className="btn bg-electric-500 text-white hover:bg-electric-600 w-full text-base py-4 rounded-none">
                  Go to dashboard <ArrowRight size={18} />
                </Link>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Link to="/login" onClick={onClose} className="btn bg-white/10 text-white border border-white/25 text-base py-4 rounded-none">Sign in</Link>
                  <Link to="/signup" onClick={onClose} className="btn bg-electric-500 text-white hover:bg-electric-600 text-base py-4 rounded-none">Join</Link>
                </div>
              )}

              <div className="mt-6 flex flex-col gap-2 text-sm text-white/50">
                <a href={`tel:${club.contact.phone}`} className="flex items-center gap-2.5 hover:text-white">
                  <Phone size={15} /> {club.contact.phone}
                </a>
                <a href={`mailto:${club.contact.email}`} className="flex items-center gap-2.5 hover:text-white break-all">
                  <Mail size={15} /> {club.contact.email}
                </a>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
