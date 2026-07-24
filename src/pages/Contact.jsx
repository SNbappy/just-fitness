import { club } from "../data/club";
import PageHeader from "../components/PageHeader";

const ROWS = [
  ["Office", club.contact.address],
  ["Cell phone", club.contact.phone, `tel:${club.contact.phone}`],
  ["PABX", club.contact.pabx],
  ["Email", club.contact.email, `mailto:${club.contact.email}`],
];

export default function Contact() {
  return (
    <>
      <PageHeader
        eyebrow="Get in touch"
        title="Contact"
        subtitle="Visit the Office of the Physical Education on campus, or reach the director by phone or email."
      />

      <section className="bg-void text-white py-20 sm:py-28 border-t border-white/10">
        <div className="container-wide grid lg:grid-cols-2 gap-14">
          <div>
            <h2 className="mega text-[clamp(1.8rem,4vw,2.75rem)]">
              Club<span className="text-electric-500"> office</span>
            </h2>

            <dl className="mt-10">
              {ROWS.map(([label, value, href]) => (
                <div key={label} className="grid sm:grid-cols-[130px,1fr] gap-1 sm:gap-8 py-6 border-t border-white/10">
                  <dt className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/35 pt-1">
                    {label}
                  </dt>
                  <dd className="text-white/80 leading-relaxed break-words">
                    {href ? (
                      <a href={href} className="hover:text-electric-400 transition-colors">{value}</a>
                    ) : value}
                  </dd>
                </div>
              ))}
              <div className="border-t border-white/10" />
            </dl>

            <div className="mt-10">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/35">Director</p>
              <p className="mt-3 mega text-2xl">{club.director.name}</p>
              <p className="mt-1 text-sm text-white/50">
                {club.director.designation}, {club.director.office}
              </p>
            </div>
          </div>

          <div className="border border-white/15 min-h-[420px] lg:min-h-full">
            <iframe
              title="JUST campus map"
              className="w-full h-full min-h-[420px] border-0 grayscale contrast-125 opacity-90"
              loading="lazy"
              src={`https://www.google.com/maps?q=${encodeURIComponent(club.contact.mapQuery)}&output=embed`}
            />
          </div>
        </div>
      </section>
    </>
  );
}