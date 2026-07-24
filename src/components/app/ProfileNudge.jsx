import { Link } from "react-router-dom";
import { ArrowUpRight, UserRound } from "lucide-react";
import { useAuth } from "../../lib/AuthContext";

export default function ProfileNudge() {
    const { profile } = useAuth();
    if (!profile) return null;

    const missing = [];
    if (!profile.photo_url) missing.push("photo");
    if (!profile.department) missing.push("department");
    if (!profile.phone) missing.push("phone number");

    if (missing.length === 0) return null;

    const list =
        missing.length === 1
            ? missing[0]
            : missing.slice(0, -1).join(", ") + " and " + missing[missing.length - 1];

    return (
        <Link
            to="/profile"
            className="group flex items-center gap-4 border border-line bg-surface px-6 py-5 hover:border-electric-400 transition-colors"
        >
            <span className="grid place-items-center w-11 h-11 bg-electric-500/10 text-electric-600 shrink-0">
                <UserRound size={20} />
            </span>
            <span className="flex-1 min-w-0">
                <span className="block text-sm font-bold text-body">Finish your profile</span>
                <span className="block text-xs text-muted mt-0.5">Add your {list}.</span>
            </span>
            <ArrowUpRight size={18} className="text-faint group-hover:text-electric-500 transition-colors shrink-0" />
        </Link>
    );
}