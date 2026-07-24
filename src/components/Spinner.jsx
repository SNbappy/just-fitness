export default function Spinner({ full = false }) {
  return (
    <div className={full ? "min-h-[60vh] grid place-items-center" : "py-10 grid place-items-center"}>
      <div className="w-10 h-10 border-4 border-electric-500/20 border-t-electric-500 rounded-full animate-spin" />
    </div>
  );
}
