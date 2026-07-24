import { X, Lock, Phone, Eye } from "lucide-react";
import Avatar from "../Avatar";

const GOAL_LABELS = {
    weight_loss: "Weight loss",
    muscle_gain: "Muscle gain",
    general_fitness: "General fitness",
    sports_performance: "Sports performance",
    rehabilitation: "Rehabilitation",
};

function Row({ label, value }) {
    return (
        <div className="grid sm:grid-cols-[140px,1fr] gap-1 sm:gap-6 py-4 border-t border-line">
            <dt className="text-[10px] font-bold uppercase tracking-[0.2em] text-faint pt-0.5">{label}</dt>
            <dd className="text-sm text-body">{value || "—"}</dd>
        </div>
    );
}

export default function ProfilePreview({ profile, health, onClose }) {
    const shareStats = health?.share_stats_with_batchmates ?? true;

    const bmi = health?.current_weight_kg && health?.height_cm
        ? (health.current_weight_kg / Math.pow(health.height_cm / 100, 2)).toFixed(1)
        : null;

    const socials = [
        ["Facebook", profile.facebook_url],
        ["LinkedIn", profile.linkedin_url],
        ["Instagram", profile.instagram_url],
    ].filter(([, url]) => url);

    return (
        <div className="fixed inset-0 z-[200] bg-void/85 backdrop-blur-sm overflow-y-auto p-4">
            <div className="mx-auto max-w-2xl my-8 bg-surface border border-line">
                <div className="flex items-center justify-between px-6 py-4 border-b border-line bg-elevated">
                    <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted">
                        <Eye size={14} /> How batchmates see you
                    </p>
                    <button onClick={onClose} className="grid place-items-center w-9 h-9 hover:bg-surface text-muted">
                        <X size={18} />
                    </button>
                </div>

                <div className="p-7">
                    <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left">
                        <Avatar name={profile.full_name} url={profile.photo_url} size="xl" />
                        <div className="min-w-0">
                            <p className="mega text-3xl text-body">{profile.full_name}</p>
                            <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.2em] text-electric-600">
                                {profile.affiliation || "Member"}
                                {profile.department ? ` · ${profile.department}` : ""}
                            </p>
                            {profile.bio && (
                                <p className="mt-4 text-sm text-muted leading-relaxed max-w-md">{profile.bio}</p>
                            )}
                        </div>
                    </div>

                    <dl className="mt-8">
                        <Row label="Department" value={profile.department} />
                        {profile.session && <Row label="Session" value={profile.session} />}
                        {profile.occupation && <Row label="Designation" value={profile.occupation} />}
                        <Row label="Blood group" value={profile.blood_group} />
                        {profile.show_phone && profile.phone && (
                            <Row label="Phone" value={<span className="flex items-center gap-2"><Phone size={14} className="text-faint" />{profile.phone}</span>} />
                        )}
                        {health?.goal && <Row label="Training for" value={GOAL_LABELS[health.goal]} />}
                        <div className="border-t border-line" />
                    </dl>

                    <div className="mt-8">
                        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted">Vitals</p>
                        {shareStats ? (
                            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 border border-line divide-x divide-y sm:divide-y-0 divide-line">
                                {[
                                    ["Weight", health?.current_weight_kg, "kg"],
                                    ["Height", health?.height_cm, "cm"],
                                    ["BMI", bmi, ""],
                                    ["Pulse", health?.current_pulse, "bpm"],
                                ].map(([l, v, u]) => (
                                    <div key={l} className="p-4">
                                        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-faint">{l}</p>
                                        <p className="mt-2 mega text-2xl text-body tabular">
                                            {v ?? "—"}{v != null && u && <span className="text-xs text-faint ml-1">{u}</span>}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="mt-4 border border-line p-8 text-center">
                                <Lock className="mx-auto text-faint" size={24} />
                                <p className="mt-3 text-sm font-bold text-body">Hidden from batchmates</p>
                                <p className="mt-1 text-xs text-muted">
                                    Your trainer can still see these. Turn sharing on in the Health tab.
                                </p>
                            </div>
                        )}
                    </div>

                    {socials.length > 0 && (
                        <div className="mt-8">
                            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted">Social</p>
                            {profile.show_socials ? (
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {socials.map(([name, url]) => (
                                        <span key={name} className="border border-line px-4 py-2 text-xs font-bold text-body">
                                            {name}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p className="mt-3 text-xs text-muted flex items-center gap-2">
                                    <Lock size={13} /> Hidden — batchmates won't see your social links.
                                </p>
                            )}
                        </div>
                    )}

                    <div className="mt-10 pt-6 border-t border-line">
                        <p className="text-xs text-muted leading-relaxed">
                            Medical conditions and your emergency contact are never shown to
                            batchmates. Only the trainer of a batch you've joined can see them.
                        </p>
                    </div>
                </div>

                <div className="px-6 py-4 border-t border-line flex justify-end">
                    <button onClick={onClose} className="btn-outline">Close preview</button>
                </div>
            </div>
        </div>
    );
}