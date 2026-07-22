import PageHeader from "../components/PageHeader";

export default function Gallery() {
  return (
    <>
      <PageHeader eyebrow="JUST HFC" title="Gallery" subtitle="This section is coming soon." />
      <section className="section">
        <div className="container-app">
          <div className="card p-12 text-center text-faint">
            <p className="font-semibold">Nothing here yet.</p>
            <p className="text-sm mt-1">We'll build this in the next step.</p>
          </div>
        </div>
      </section>
    </>
  );
}
