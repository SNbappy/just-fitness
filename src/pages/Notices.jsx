import PageHeader from "../components/PageHeader";

export default function Notices() {
  return (
    <>
      <PageHeader eyebrow="JUST HFC" title="Notices" subtitle="This section is coming soon." />
      <section className="section">
        <div className="container-app">
          <div className="card p-12 text-center text-ink-400">
            <p className="font-semibold">Nothing here yet.</p>
            <p className="text-sm mt-1">We'll build this in the next step.</p>
          </div>
        </div>
      </section>
    </>
  );
}
