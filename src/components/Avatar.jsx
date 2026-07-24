import { initials } from "../lib/names";

const SIZES = {
    sm: "w-9 h-9 text-[10px]",
    md: "w-12 h-12 text-xs",
    lg: "w-20 h-20 text-lg",
    xl: "w-32 h-32 text-2xl",
};

export default function Avatar({ name, url, size = "md", className = "" }) {
    const cls = `${SIZES[size]} shrink-0 ${className}`;

    if (url) {
        return (
            <img
                src={url}
                alt={name || "Profile photo"}
                className={`${cls} object-cover bg-elevated`}
                onError={(e) => { e.currentTarget.style.display = "none"; }}
            />
        );
    }

    return (
        <span className={`${cls} grid place-items-center bg-void text-white font-bold tracking-wider`}>
            {initials(name)}
        </span>
    );
}