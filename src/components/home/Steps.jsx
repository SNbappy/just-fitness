import { Fragment } from "react";

const STEPS = [
  {
    n: "01",
    t: "Create your account",
    d: "Sign up free with your email. Add your weight, height and morning pulse so your trainer can build the right plan for you.",
    meta: "Takes under a minute",
    bg: "#101218",
    accent: "text-electric-500",
    body: "text-white/55",
    line: "border-white/10",
  },
  {
    n: "02",
    t: "Enter your batch code",
    d: "Your trainer hands out a six-character code or a QR poster. One entry and you are in the batch with your trainer and batchmates.",
    meta: "Six characters, one tap",
    bg: "#191D28",
    accent: "text-electric-400",
    body: "text-white/60",
    line: "border-white/10",
  },
  {
    n: "03",
    t: "Train and track",
    d: "Follow the plan, log your daily check-in, and watch the graph move week after week. Your trainer sees your progress and adjusts.",
    meta: "Every single day",
    bg: "#2E6BFF",
    accent: "text-white",
    body: "text-white/80",
    line: "border-white/25",
  },
];

const LAST = STEPS.length - 1;

export default function Steps() {
  return (
    <section className="bg-void text-white pt-20 sm:pt-28 pb-10 border-t border-white/10">
      <div className="sticky top-[88px] z-0 container-wide">
        <h2 className="mega text-[clamp(2.5rem,8vw,7rem)]">
          Three steps<span className="text-electric-500"> in</span>
        </h2>
      </div>

      <div className="container-wide mt-10 relative">
        {STEPS.map((s, i) => (
          <Fragment key={s.n}>
            <div
              className="sticky"
              style={{ top: `${222 + i * 24}px`, zIndex: i + 1 }}
            >
              <div
                className="border border-white/15 min-h-[54vh] sm:min-h-[58vh] p-8 sm:p-14 flex flex-col"
                style={{
                  background: s.bg,
                  marginInline: `${(LAST - i) * 18}px`,
                  boxShadow: "0 -24px 44px -24px rgba(0,0,0,0.95), 0 30px 70px -30px rgba(0,0,0,0.95)",
                }}
              >
                <div className={`flex items-center justify-between gap-4 pb-6 border-b ${s.line}`}>
                  <span className={`mega text-[3.5rem] sm:text-[5.5rem] leading-none ${s.accent}`}>
                    {s.n}
                  </span>
                  <span className={`text-[10px] font-bold uppercase tracking-[0.25em] ${s.body}`}>
                    {s.meta}
                  </span>
                </div>

                <div className="mt-auto pt-10">
                  <h3 className="mega text-[2.25rem] sm:text-[4rem] leading-[0.95]">{s.t}</h3>
                  <p className={`mt-6 max-w-lg text-base sm:text-lg leading-relaxed ${s.body}`}>
                    {s.d}
                  </p>
                </div>
              </div>
            </div>
            <div style={{ height: i === LAST ? "40vh" : "32vh" }} />
          </Fragment>
        ))}
      </div>
    </section>
  );
}