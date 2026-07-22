import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="section">
      <div className="container-app text-center py-20">
        <p className="text-7xl font-extrabold text-primary-500">404</p>
        <h1 className="mt-4 text-2xl text-ink-900">Page not found</h1>
        <p className="mt-2 text-ink-500">The page you're looking for doesn't exist.</p>
        <Link to="/" className="btn-primary mt-8">Back to Home</Link>
      </div>
    </section>
  );
}
