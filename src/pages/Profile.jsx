import { useEffect, useRef, useState } from "react";
import { Camera, Save, Check, AlertCircle, Loader2 } from "lucide-react";
import { useAuth } from "../lib/AuthContext";
import { supabase } from "../lib/supabase";
import { uploadAvatar } from "../lib/avatar";
import Avatar from "../components/Avatar";
import Spinner from "../components/Spinner";
import AppPageHeader from "../components/app/AppPageHeader";

const AFFILIATIONS = [
    { value: "student", label: "Student" },
    { value: "teacher", label: "Teacher" },
    { value: "staff", label: "Staff" },
    { value: "alumni", label: "Alumni" },
    { value: "other", label: "Other" },
];

const BLOOD = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const inputCls =
    "w-full border border-line bg-surface text-body px-4 py-3 text-sm placeholder:text-faint focus:outline-none focus:border-electric-500";
const labelCls =
    "block text-[10px] font-bold uppercase tracking-[0.2em] text-muted mb-2";

function Section({ title, note, children }) {
    return (
        <div className="border border-line bg-surface">
            <div className="px-7 py-5 border-b border-line">
                <h2 className="mega text-xl text-body">{title}</h2>
                {note && <p className="mt-1.5 text-xs text-muted">{note}</p>}
            </div>
            <div className="p-7 grid sm:grid-cols-2 gap-6">{children}</div>
        </div>
    );
}

export default function Profile() {
    const { user, profile, refreshProfile } = useAuth();
    const [form, setForm] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");
    const fileRef = useRef(null);

    useEffect(() => {
        if (profile) {
            setForm(profile);
            setLoading(false);
        }
    }, [profile]);

    function set(key, value) {
        setForm((f) => ({ ...f, [key]: value }));
        setSaved(false);
    }

    async function handlePhoto(e) {
        const file = e.target.files?.[0];
        if (!file) return;
        setError("");
        setUploading(true);
        const { url, error: upErr } = await uploadAvatar(file, user.id);
        setUploading(false);
        if (upErr) return setError(upErr.message);
        setForm((f) => ({ ...f, photo_url: url }));
        await refreshProfile();
    }

    async function handleSave(e) {
        e.preventDefault();
        setError("");
        setSaving(true);
        const { error: err } = await supabase.from("profiles").update({
            full_name: form.full_name,
            bio: form.bio || null,
            affiliation: form.affiliation || "student",
            university: form.university || null,
            department: form.department || null,
            session: form.session || null,
            student_id: form.student_id || null,
            occupation: form.occupation || null,
            gender: form.gender || null,
            date_of_birth: form.date_of_birth || null,
            blood_group: form.blood_group || null,
            home_district: form.home_district || null,
            phone: form.phone || null,
            facebook_url: form.facebook_url || null,
            linkedin_url: form.linkedin_url || null,
            instagram_url: form.instagram_url || null,
            show_socials: !!form.show_socials,
            show_phone: !!form.show_phone,
            updated_at: new Date().toISOString(),
        }).eq("id", user.id);

        setSaving(false);
        if (err) return setError(err.message);
        setSaved(true);
        await refreshProfile();
        setTimeout(() => setSaved(false), 2500);
    }

    if (loading || !form) return <Spinner full />;

    return (
        <>
            <AppPageHeader eyebrow="Account" title="My" accent="profile" />

            <div className="container-app py-10">
                {error && (
                    <div className="mb-6 flex gap-2 items-start border border-red-300 bg-red-50 text-red-700 text-sm px-4 py-3">
                        <AlertCircle size={18} className="shrink-0 mt-0.5" />
                        <span>{error}</span>
                    </div>
                )}

                <div className="border border-line bg-surface p-7 flex flex-col sm:flex-row gap-7 items-center sm:items-start">
                    <div className="relative shrink-0">
                        <Avatar name={form.full_name} url={form.photo_url} size="xl" />
                        <button
                            type="button"
                            onClick={() => fileRef.current?.click()}
                            disabled={uploading}
                            className="absolute -bottom-2 -right-2 grid place-items-center w-11 h-11 bg-electric-500 text-white hover:bg-electric-600 transition-colors disabled:opacity-70"
                            aria-label="Upload photo"
                        >
                            {uploading ? <Loader2 size={18} className="animate-spin" /> : <Camera size={18} />}
                        </button>
                        <input
                            ref={fileRef}
                            type="file"
                            accept="image/*"
                            onChange={handlePhoto}
                            className="hidden"
                        />
                    </div>

                    <div className="text-center sm:text-left">
                        <p className="mega text-3xl text-body">{form.full_name}</p>
                        <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.2em] text-electric-600">
                            {form.affiliation || "student"}
                            {form.department ? ` · ${form.department}` : ""}
                        </p>
                        <p className="mt-4 text-sm text-muted max-w-md">
                            A clear photo helps your trainer and batchmates recognise you at sessions.
                            Images are cropped square and compressed automatically.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSave} className="mt-6 space-y-6">
                    <Section title="Basic">
                        <div className="sm:col-span-2">
                            <label className={labelCls}>Full name</label>
                            <input required value={form.full_name ?? ""}
                                onChange={(e) => set("full_name", e.target.value)} className={inputCls} />
                        </div>
                        <div className="sm:col-span-2">
                            <label className={labelCls}>Short bio</label>
                            <textarea rows={3} value={form.bio ?? ""}
                                onChange={(e) => set("bio", e.target.value)}
                                placeholder="A line or two about yourself and your fitness goals"
                                className={inputCls} />
                        </div>
                    </Section>

                    <Section title="Affiliation" note="All optional. Fill in whatever applies to you.">
                        <div>
                            <label className={labelCls}>I am a</label>
                            <select value={form.affiliation ?? "student"}
                                onChange={(e) => set("affiliation", e.target.value)} className={inputCls}>
                                {AFFILIATIONS.map((a) => (
                                    <option key={a.value} value={a.value}>{a.label}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className={labelCls}>University / institution</label>
                            <input value={form.university ?? ""}
                                onChange={(e) => set("university", e.target.value)}
                                placeholder="Jashore University of Science and Technology"
                                className={inputCls} />
                        </div>
                        <div>
                            <label className={labelCls}>Department</label>
                            <input value={form.department ?? ""}
                                onChange={(e) => set("department", e.target.value)}
                                placeholder="Computer Science and Engineering" className={inputCls} />
                        </div>
                        <div>
                            <label className={labelCls}>Session</label>
                            <input value={form.session ?? ""}
                                onChange={(e) => set("session", e.target.value)}
                                placeholder="2020-21" className={inputCls} />
                        </div>
                        <div>
                            <label className={labelCls}>Student ID</label>
                            <input value={form.student_id ?? ""}
                                onChange={(e) => set("student_id", e.target.value)} className={inputCls} />
                        </div>
                        <div>
                            <label className={labelCls}>Designation / occupation</label>
                            <input value={form.occupation ?? ""}
                                onChange={(e) => set("occupation", e.target.value)}
                                placeholder="Assistant Professor, Software Engineer" className={inputCls} />
                        </div>
                    </Section>

                    <Section title="Personal" note="Blood group can help in an emergency during training.">
                        <div>
                            <label className={labelCls}>Gender</label>
                            <select value={form.gender ?? ""}
                                onChange={(e) => set("gender", e.target.value)} className={inputCls}>
                                <option value="">Prefer not to say</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className={labelCls}>Date of birth</label>
                            <input type="date" value={form.date_of_birth ?? ""}
                                onChange={(e) => set("date_of_birth", e.target.value)} className={inputCls} />
                        </div>
                        <div>
                            <label className={labelCls}>Blood group</label>
                            <select value={form.blood_group ?? ""}
                                onChange={(e) => set("blood_group", e.target.value)} className={inputCls}>
                                <option value="">Not set</option>
                                {BLOOD.map((b) => <option key={b} value={b}>{b}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className={labelCls}>Home district</label>
                            <input value={form.home_district ?? ""}
                                onChange={(e) => set("home_district", e.target.value)}
                                placeholder="Jashore" className={inputCls} />
                        </div>
                        <div className="sm:col-span-2">
                            <label className={labelCls}>Phone</label>
                            <input value={form.phone ?? ""}
                                onChange={(e) => set("phone", e.target.value)}
                                placeholder="01XXXXXXXXX" className={inputCls} />
                            <label className="mt-3 flex items-start gap-3 cursor-pointer">
                                <input type="checkbox" checked={!!form.show_phone}
                                    onChange={(e) => set("show_phone", e.target.checked)}
                                    className="mt-0.5 w-5 h-5 accent-electric-500" />
                                <span className="text-xs text-muted">
                                    Show my phone number to batchmates. Your trainer can always see it.
                                </span>
                            </label>
                        </div>
                    </Section>

                    <Section title="Social links" note="Optional, and hidden from batchmates unless you turn them on.">
                        <div>
                            <label className={labelCls}>Facebook</label>
                            <input value={form.facebook_url ?? ""}
                                onChange={(e) => set("facebook_url", e.target.value)}
                                placeholder="https://facebook.com/username" className={inputCls} />
                        </div>
                        <div>
                            <label className={labelCls}>LinkedIn</label>
                            <input value={form.linkedin_url ?? ""}
                                onChange={(e) => set("linkedin_url", e.target.value)}
                                placeholder="https://linkedin.com/in/username" className={inputCls} />
                        </div>
                        <div>
                            <label className={labelCls}>Instagram</label>
                            <input value={form.instagram_url ?? ""}
                                onChange={(e) => set("instagram_url", e.target.value)}
                                placeholder="https://instagram.com/username" className={inputCls} />
                        </div>
                        <label className="sm:col-span-2 flex items-start gap-3 cursor-pointer border-t border-line pt-6">
                            <input type="checkbox" checked={!!form.show_socials}
                                onChange={(e) => set("show_socials", e.target.checked)}
                                className="mt-0.5 w-5 h-5 accent-electric-500" />
                            <span>
                                <span className="block text-sm font-bold text-body">
                                    Show my social links on my profile
                                </span>
                                <span className="block text-xs text-muted mt-1">
                                    Off by default. Only turn this on if you're happy for batchmates to contact you outside the club.
                                </span>
                            </span>
                        </label>
                    </Section>

                    <div className="flex items-center gap-4">
                        <button type="submit" disabled={saving} className="btn-primary">
                            <Save size={16} /> {saving ? "Saving" : "Save profile"}
                        </button>
                        {saved && (
                            <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.15em] text-electric-600">
                                <Check size={15} /> Saved
                            </span>
                        )}
                    </div>
                </form>
            </div>
        </>
    );
}