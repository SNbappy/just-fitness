import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useAnimationFrame } from "framer-motion";
import { club } from "../../data/club";

const PHOTOS = ["/images/gym.jpg", "/images/yoga.jpg", "/images/cardio.jpg",
  "/images/sports.jpg", "/images/health.jpg", "/images/awareness.jpg"];

const SPEED = 55;   // pixels per second
const GAP = 20;     // must match gap-5

export default function Activities() {
  const x = useMotionValue(0);
  const [dragging, setDragging] = useState(false);
  const copyRef = useRef(null);
  const unit = useRef(0);

  useEffect(() => {
    function measure() {
      if (copyRef.current) unit.current = copyRef.current.offsetWidth + GAP;
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useAnimationFrame((_, delta) => {
    if (dragging || !unit.current) return;
    let next = x.get() - (delta / 1000) * SPEED;
    if (next <= -unit.current) next += unit.current;
    x.set(next);
  });

  function handleDragEnd() {
    // pull back into range so the auto loop continues seamlessly
    const u = unit.current;
    if (u) {
      let v = x.get() % u;
      if (v > 0) v -= u;
      x.set(v);
    }
    setDragging(false);
  }

  const Card = ({ a, i }) => (
    <article className={`group relative shrink-0 w-[290px] sm:w-[350px] min-h-[430px] border border-white/10 hover:border-electric-500 hover:-translate-y-2 active:-translate-y-2 active:border-electric-500 transition-all duration-300 overflow-hidden select-none`}
      style={{ animation: `bob 4.5s ease-in-out ${(i * -0.75).toFixed(2)}s infinite` }}>
      <img src={PHOTOS[i % PHOTOS.length]} alt="" draggable="false"
        className="absolute inset-0 w-full h-full object-cover opacity-90 brightness-[1] contrast-[1] group-hover:opacity-100 group-hover:brightness-[1.35] group-hover:contrast-[1.15] group-hover:scale-105 transition-all duration-500" />
      <div className="absolute inset-0 bg-gradient-to-t from-void via-void/45 to-transparent" />
      <div className="relative p-8 flex flex-col h-full min-h-[430px]">
        <span className="mega text-[3.5rem] text-white/60 leading-none">
          {String(i + 1).padStart(2, "0")}
        </span>
        <h3 className="mt-auto mega text-[1.75rem] leading-tight">{a.title}</h3>
        <p className="mt-4 text-sm text-white/70 leading-relaxed">{a.desc}</p>
      </div>
    </article>
  );

  return (
    <section className="bg-void text-white py-20 sm:py-28 border-t border-white/10 overflow-hidden">
      <div className="container-wide">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <h2 className="mega text-[clamp(2.5rem,8vw,7rem)]">
            What we<span className="text-electric-500"> do</span>
          </h2>
          <p className="max-w-xs text-white/50 leading-relaxed pb-3">
            From your first push-up to inter-department tournaments. Supervised,
            structured, open to every student.
          </p>
        </div>
      </div>

      <div className="mt-10 py-8">
        <motion.div
          style={{ x }}
          drag="x"
          dragMomentum={false}
          onDragStart={() => setDragging(true)}
          onDragEnd={handleDragEnd}
          className="flex gap-5 w-max px-4 sm:px-6 cursor-grab active:cursor-grabbing"
        >
          {[0, 1, 2].map((copy) => (
            <div key={copy} ref={copy === 0 ? copyRef : null} className="flex gap-5 shrink-0 items-center">
              {club.activities.map((a, i) => (
                <Card key={`${copy}-${i}`} a={a} i={i} />
              ))}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
