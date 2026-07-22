import PageHeader from "../components/PageHeader";
import { club } from "../data/club";
import { Target, Eye, ListChecks } from "lucide-react";

export default function About() {
  return (
    <>
      <PageHeader
        eyebrow="Who We Are"
        title="About the Club"
        subtitle={club.intro}
      />
      <section className="section">
        <div className="container-app grid md:grid-cols-3 gap-5">
          <div className="card p-7">
            <Target className="text-primary-600" size={30} />
            <h3 className="mt-4 text-lg text-body">Our Mission</h3>
            <p className="mt-2 text-sm text-muted leading-relaxed">
              To make regular, safe and structured physical activity accessible to every
              student of JUST, regardless of experience or fitness level.
            </p>
          </div>
          <div className="card p-7">
            <Eye className="text-secondary-500" size={30} />
            <h3 className="mt-4 text-lg text-body">Our Vision</h3>
            <p className="mt-2 text-sm text-muted leading-relaxed">
              A campus where physical wellbeing is treated as seriously as academic
              achievement, and where healthy habits outlast graduation.
            </p>
          </div>
          <div className="card p-7">
            <ListChecks className="text-blue-600" size={30} />
            <h3 className="mt-4 text-lg text-body">How to Join</h3>
            <p className="mt-2 text-sm text-muted leading-relaxed">
              Create an account, complete your health profile, then enter the join code
              given by your trainer to become a member of a training batch.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
