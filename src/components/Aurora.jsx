export default function Aurora({ className = "" }) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} aria-hidden="true">
      <div className="absolute -top-1/4 -left-[10%] w-[55vw] h-[55vw] max-w-[720px] max-h-[720px]
                      rounded-full bg-primary-500/30 blur-[120px] animate-drift" />
      <div className="absolute top-1/4 -right-[10%] w-[50vw] h-[50vw] max-w-[640px] max-h-[640px]
                      rounded-full bg-secondary-500/25 blur-[120px] animate-drift-slow" />
      <div className="absolute -bottom-1/3 left-1/4 w-[45vw] h-[45vw] max-w-[560px] max-h-[560px]
                      rounded-full bg-mint-500/15 blur-[130px] animate-drift"
           style={{ animationDelay: "-8s" }} />
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />
    </div>
  );
}
