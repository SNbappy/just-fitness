import { motion } from "framer-motion";
import { club } from "../../data/club";

const reveal = { hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.16,1,0.3,1] } } };

export default function Director() {
  return (
    <>
      {/* ============ DIRECTOR — editorial ============ */}
      <section className="bg-white text-void py-20 sm:py-32">
        <div className="container-wide">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }} variants={reveal}>
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-electric-600">
              {club.director.messageTitle}
            </p>

            <div className="mt-10 grid lg:grid-cols-[1fr,340px] gap-12 lg:gap-16 items-start">
              <div>
                <blockquote className="font-display font-bold text-[clamp(1.5rem,3.2vw,2.6rem)] leading-[1.22] tracking-[-0.02em]">
                  <span className="text-electric-500">“</span>
                  {club.director.message}
                </blockquote>

                <div className="mt-10 pt-8 border-t border-ink-200 flex items-center gap-5">
                  <div>
                    <p className="mega text-2xl">{club.director.name}</p>
                    <p className="mt-1 text-sm text-ink-500">
                      {club.director.designation} · {club.director.office}
                    </p>
                  </div>
                </div>
              </div>

              <div className="lg:sticky lg:top-28">
                <div className="relative aspect-[4/5] bg-ink-100 overflow-hidden">
                  <img
                    src={club.director.photo}
                    alt={club.director.name}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.style.display = "none"; }}
                  />
                  <span className="absolute bottom-0 left-0 bg-electric-500 text-white px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em]">
                    Director
                  </span>
                </div>
                <div className="mt-5 space-y-1.5 text-sm text-ink-500">
                  <p>{club.director.qualification}</p>
                  <a href={`mailto:${club.director.email}`} className="block hover:text-electric-600 break-all">
                    {club.director.email}
                  </a>
                  <a href={`tel:${club.director.phone}`} className="block hover:text-electric-600">
                    {club.director.phone} · PABX {club.director.pabx}
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
