import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import Marquee from "../Marquee";

export default function Cta() {
  return (
    <section className="relative bg-void text-white overflow-hidden grain border-t border-white/10">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[46rem] h-[46rem] rounded-full bg-electric-600/25 blur-[150px] pointer-events-none" />

      <Marquee text="JOIN THE CLUB" className="py-5 border-b border-white/10 text-white/25"
        size="text-[clamp(1.6rem,3.5vw,3rem)]" reverse />

      <div className="container-wide relative py-24 sm:py-32">
        <div className="grid lg:grid-cols-[1.2fr,1fr] gap-12 items-end">
          <div>
            <h2 className="mega text-[clamp(3rem,11vw,10rem)] leading-[0.85]">
              Start<br /><span className="text-electric-500">today</span>
            </h2>
          </div>
          <div className="pb-4">
            <p className="text-white/60 leading-relaxed text-lg">
              Free for every JUST student. Create an account, enter your trainer's
              code, and train with people who show up.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link to="/signup"
                className="group flex items-center justify-between gap-4 bg-electric-500 hover:bg-electric-600 transition-colors pl-7 pr-2 py-2 min-h-[60px]">
                <span className="text-xs font-bold uppercase tracking-[0.2em]">Create account</span>
                <span className="grid place-items-center w-11 h-11 bg-void text-white group-hover:rotate-45 transition-transform duration-300">
                  <ArrowUpRight size={20} />
                </span>
              </Link>
              <Link to="/about"
                className="flex items-center justify-center border border-white/25 hover:bg-white hover:text-void transition-colors px-7 min-h-[60px] text-xs font-bold uppercase tracking-[0.2em]">
                About the club
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Marquee text="JUST HEALTH & FITNESS CLUB" className="py-5 border-t border-white/10 text-white/25"
        size="text-[clamp(1.6rem,3.5vw,3rem)]" />
    </section>
  );
}
