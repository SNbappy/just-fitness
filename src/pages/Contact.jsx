import PageHeader from "../components/PageHeader";
import { club } from "../data/club";
import { MapPin, Phone, Mail, Building2 } from "lucide-react";

export default function Contact() {
  return (
    <>
      <PageHeader
        eyebrow="Get in Touch"
        title="Contact Us"
        subtitle="Visit the Office of the Physical Education, or reach us by phone or email."
      />
      <section className="section">
        <div className="container-app grid lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            {[
              { icon: MapPin, label: "Address", value: club.contact.address },
              { icon: Phone, label: "Cell Phone", value: club.contact.phone, href: `tel:${club.contact.phone}` },
              { icon: Building2, label: "PABX", value: club.contact.pabx },
              { icon: Mail, label: "Email", value: club.contact.email, href: `mailto:${club.contact.email}` },
            ].map(({ icon: Icon, label, value, href }) => (
              <div key={label} className="card p-6 flex gap-4">
                <span className="grid place-items-center w-12 h-12 shrink-0 rounded-xl bg-primary-50 text-primary-600">
                  <Icon size={22} />
                </span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-ink-400">{label}</p>
                  {href ? (
                    <a href={href} className="text-ink-800 font-semibold hover:text-primary-600 break-all">{value}</a>
                  ) : (
                    <p className="text-ink-700 leading-relaxed">{value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="card overflow-hidden min-h-[340px]">
            <iframe
              title="JUST campus map"
              className="w-full h-full min-h-[340px] border-0"
              loading="lazy"
              src={`https://www.google.com/maps?q=${encodeURIComponent(club.contact.mapQuery)}&output=embed`}
            />
          </div>
        </div>
      </section>
    </>
  );
}
