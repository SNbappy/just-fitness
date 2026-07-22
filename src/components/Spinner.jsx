export default function Spinner({ full = false }) {
  return (
    <div className={full ? "min-h-[60vh] grid place-items-center" : "py-10 grid place-items-center"}>
      <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
    </div>
  );
}
