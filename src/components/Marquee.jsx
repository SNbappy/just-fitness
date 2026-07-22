export default function Marquee({
  text = "JUST HEALTH & FITNESS CLUB",
  repeat = 8,
  reverse = false,
  className = "",
  size = "text-[clamp(2rem,5vw,4.5rem)]",
}) {
  const items = Array.from({ length: repeat });
  return (
    <div className={`relative overflow-hidden select-none ${className}`} aria-hidden="true">
      <div className={`flex w-max ${reverse ? "animate-marquee-rev" : "animate-marquee"}`}>
        {[0, 1].map((dup) => (
          <div key={dup} className="flex shrink-0">
            {items.map((_, i) => (
              <span key={i} className={`mega ${size} px-6 whitespace-nowrap`}>
                {text}
                <span className="text-electric-500 px-2">/</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
