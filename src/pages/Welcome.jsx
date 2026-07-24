import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, ArrowRight, ArrowLeft, Check, Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "../lib/AuthContext";
import { supabase } from "../lib/supabase";
import { uploadAvatarBlob } from "../lib/avatar";
import Avatar from "../components/Avatar";
import AvatarCropper from "../components/AvatarCropper";
import Spinner from "../components/Spinner";
import { firstName } from "../lib/names";

const AFFILIATIONS = [
    { value: "student", label: "Student", desc: "Currently enrolled at the university" },
    { value: "teacher", label: "Teacher", desc: "Faculty member" },
    { value: "staff", label: "Staff", desc: "University employee" },
    { value: "alumni", label: "Alumni", desc: "Graduated from the university" },
    { value: "other", label: "Other", desc: "Not affiliated with the university" },
];

const BLOOD = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const GOALS = [
    { value: "weight_loss", label: "Weight loss" },
    { value: "muscle_gain", label: "Muscle gain" },
    { value: "general_fitness", label: "General fitness" },
    { value: "sports_performance", label: "Sports performance" },
    { value: "rehabilitation", label: "Rehabilitation" },
];

const inputCls =
    "w-full bg-carbon border border-white/15 px-4 py-3.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-electric-500";
const labelCls =
    "block text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-2";

export default function Welcome() {
    const { user, profile, refreshProfile } = useAuth();
    const navigate = useNavigate();

    const [step, setStep] = useState(0);
    const [form, setForm] = useState({});
    const [health, setHealth] = useState({});
    const [cropFile, setCropFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const fileRef = useRef(null);

    useEffect(() => {
        if (profile) setForm((f) => ({ ...profile, ...f }));
    }, [profile]);

    useEffect(() => {
        if (profile?.onboarded) navigate("/dashboard", { replace: true });
    }, [profile, navigate]);

    if (!profile) return <Spinner full />;

    const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
    const setH = (k, v) => setHealth((h) => ({ ...h, [k]: v }));

    async function handleCropped(blob) {
        setUploading(true);
        const { url, error: err } = await uploadAvatarBlob(blob, user.id);
        setUploading(false);
        setCropFile(null);
        if (err) return setError(err.message);
        set("photo_url", url);
        await refreshProfile();
    }

    async function finish() {
        setError("");
        setSaving(true);

        const { error: pErr } = await supabase.from("profiles").update({
            affiliation: form.affiliation,
            university: form.university || null,
            department: form.department || null,
            session: form.session || null,
            student_id: form.student_id || null,
            occupation: form.occupation || null,
            gender: form.gender || null,
            blood_group: form.blood_group || null,
            phone: form.phone || null,
            onboarded: true,
            updated_at: new Date().toISOString(),
        }).eq("id", user.id);

        if (pErr) {
            setSaving(false);
            return setError(pErr.message);
        }

        const hasHealth = health.height_cm || health.current_weight_kg || health.goal;
        if (hasHealth) {
            await supabase.from("health_profiles").update({
                height_cm: health.height_cm || null,
                current_weight_kg: health.current_weight_kg || null,
                joining_weight_kg: health.current_weight_kg || null,
                goal: health.goal || null,
                updated_at: new Date().toISOString(),
            }).eq("user_id", user.id);
        }

        await refreshProfile();
        setSaving(false);
        navigate("/dashboard", { replace: true });
    }

    const isStudent = form.affiliation === "student";
    const isAlumni = form.affiliation === "alumni";
    const isFaculty = form.affiliation === "teacher" || form.affiliation === "staff";
    const isOther = form.affiliation === "other";

    const STEPS = [
        { n: "01", label: "Who you are" },
        { n: "02", label: "About you" },
        { n: "03", label: "Your starting point" },
    ];

    const canContinue = step !== 0 || !!form.affiliation;

    return (
        <section className="min-h-screen bg-void text-white grain">
            <div className="border-b border-white/10">
                <div className="container-app h-[72px] flex items-center gap-3">
                    <span className="w-9 h-9 shrink-0">
                        <img src="/images/logo.png" alt="" className="w-full h-full object-contain" />
                    </span>
                    <span className="mega text-lg">JUST HFC</span>
                </div>
            </div>

            <div className="container-app max-w-2xl py-12 sm:py-16">
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/35">
                    Step {step + 1} of 3
                </p>
                <h1 className="mt-4 mega text-[clamp(2rem,6vw,3.5rem)]">
                    Welcome,<span className="text-electric-500"> {firstName(profile.full_name)}</span>
                </h1>

                <div className="mt-8 flex gap-2">
                    {STEPS.map((s, i) => (
                        <div key={s.n} className="flex-1">
                            <div className={`h-[3px] ${i <= step ? "bg-electric-500" : "bg-white/10"}`} />
                            <p className={`mt-2 text-[9px] font-bold uppercase tracking-[0.18em] ${i <= step ? "text-white/70" : "text-white/25"}`}>
                                {s.label}
                            </p>
                        </div>
                    ))}
                </div>

                {error && (
                    <div className="mt-8 flex gap-2 items-start border border-red-500/30 bg-red-500/10 text-red-300 text-sm px-4 py-3">
                        <AlertCircle size={18} className="shrink-0 mt-0.5" />
                        <span>{error}</span>
                    </div>
                )}

                <AnimatePresence mode="wait">
                    {step === 0 && (
                        <motion.div key="s0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }} className="mt-10">
                            <p className="text-white/55 leading-relaxed">
                                How are you connected to the university? This decides what we ask next.
                            </p>

                            <div className="mt-6 space-y-2.5">
                                {AFFILIATIONS.map((a) => (
                                    <button
                                        key={a.value}
                                        type="button"
                                        onClick={() => set("affiliation", a.value)}
                                        className={`w-full text-left border px-5 py-4 transition-colors ${form.affiliation === a.value
                                                ? "border-electric-500 bg-electric-500/10"
                                                : "border-white/15 hover:border-white/30"
                                            }`}
                                    >
                                        <span className="flex items-center justify-between gap-3">
                                            <span>
                                                <span className="block text-sm font-bold">{a.label}</span>
                                                <span className="block text-xs text-white/45 mt-0.5">{a.desc}</span>
                                            </span>
                                            {form.affiliation === a.value && (
                                                <Check size={18} className="text-electric-400 shrink-0" />
                                            )}
                                        </span>
                                    </button>
                                ))}
                            </div>

                            <div className="mt-8">
                                <label className={labelCls}>University / institution</label>
                                <input
                                    value={form.university ?? "Jashore University of Science and Technology"}
                                    onChange={(e) => set("university", e.target.value)}
                                    className={inputCls}
                                />
                            </div>
                        </motion.div>
                    )}

                    {step === 1 && (
                        <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }} className="mt-10">
                            <p className="text-white/55 leading-relaxed">
                                All optional — you can add or change any of this later.
                            </p>

                            <div className="mt-8 flex items-center gap-5">
                                <button type="button" onClick={() => fileRef.current?.click()} className="relative shrink-0">
                                    <Avatar name={profile.full_name} url={form.photo_url} size="lg" />
                                    <span className="absolute -bottom-1.5 -right-1.5 grid place-items-center w-8 h-8 bg-electric-500 text-white">
                                        {uploading ? <Loader2 size={14} className="animate-spin" /> : <Camera size={14} />}
                                    </span>
                                </button>
                                <div>
                                    <p className="text-sm font-bold">Profile photo</p>
                                    <p className="text-xs text-white/45 mt-1 max-w-xs">
                                        Helps your trainer and batchmates recognise you at sessions.
                                    </p>
                                </div>
                                <input ref={fileRef} type="file" accept="image/*" className="hidden"
                                    onChange={(e) => {
                                        const f = e.target.files?.[0];
                                        if (f) setCropFile(f);
                                        e.target.value = "";
                                    }} />
                            </div>

                            <div className="mt-8 grid sm:grid-cols-2 gap-5">
                                <div className="sm:col-span-2">
                                    <label className={labelCls}>Department</label>
                                    <input value={form.department ?? ""} onChange={(e) => set("department", e.target.value)}
                                        placeholder="Computer Science and Engineering" className={inputCls} />
                                </div>

                                {(isStudent || isAlumni) && (
                                    <div>
                                        <label className={labelCls}>Session</label>
                                        <input value={form.session ?? ""} onChange={(e) => set("session", e.target.value)}
                                            placeholder="2020-21" className={inputCls} />
                                    </div>
                                )}

                                {isStudent && (
                                    <div>
                                        <label className={labelCls}>Student ID</label>
                                        <input value={form.student_id ?? ""} onChange={(e) => set("student_id", e.target.value)}
                                            className={inputCls} />
                                    </div>
                                )}

                                {isFaculty && (
                                    <div className="sm:col-span-2">
                                        <label className={labelCls}>Designation</label>
                                        <input value={form.occupation ?? ""} onChange={(e) => set("occupation", e.target.value)}
                                            placeholder="Assistant Professor" className={inputCls} />
                                    </div>
                                )}

                                {(isAlumni || isOther) && (
                                    <div className="sm:col-span-2">
                                        <label className={labelCls}>Current occupation</label>
                                        <input value={form.occupation ?? ""} onChange={(e) => set("occupation", e.target.value)}
                                            placeholder="Software Engineer" className={inputCls} />
                                    </div>
                                )}

                                <div>
                                    <label className={labelCls}>Gender</label>
                                    <select value={form.gender ?? ""} onChange={(e) => set("gender", e.target.value)} className={inputCls}>
                                        <option value="">Prefer not to say</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                <div>
                                    <label className={labelCls}>Blood group</label>
                                    <select value={form.blood_group ?? ""} onChange={(e) => set("blood_group", e.target.value)} className={inputCls}>
                                        <option value="">Not set</option>
                                        {BLOOD.map((b) => <option key={b} value={b}>{b}</option>)}
                                    </select>
                                </div>

                                <div className="sm:col-span-2">
                                    <label className={labelCls}>Phone</label>
                                    <input value={form.phone ?? ""} onChange={(e) => set("phone", e.target.value)}
                                        placeholder="01XXXXXXXXX" className={inputCls} />
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }} className="mt-10">
                            <p className="text-white/55 leading-relaxed">
                                Optional. Your trainer will take proper baseline measurements at your first
                                session — this is just a starting point if you know it.
                            </p>

                            <div className="mt-8 grid sm:grid-cols-2 gap-5">
                                <div>
                                    <label className={labelCls}>Height (cm)</label>
                                    <input type="number" step="0.1" value={health.height_cm ?? ""}
                                        onChange={(e) => setH("height_cm", e.target.value)}
                                        placeholder="170" className={inputCls} />
                                </div>
                                <div>
                                    <label className={labelCls}>Current weight (kg)</label>
                                    <input type="number" step="0.1" value={health.current_weight_kg ?? ""}
                                        onChange={(e) => setH("current_weight_kg", e.target.value)}
                                        placeholder="65" className={inputCls} />
                                </div>
                                <div className="sm:col-span-2">
                                    <label className={labelCls}>What are you training for?</label>
                                    <select value={health.goal ?? ""} onChange={(e) => setH("goal", e.target.value)} className={inputCls}>
                                        <option value="">Not sure yet</option>
                                        {GOALS.map((g) => <option key={g.value} value={g.value}>{g.label}</option>)}
                                    </select>
                                </div>
                            </div>

                            <p className="mt-8 text-xs text-white/35 leading-relaxed border-t border-white/10 pt-6">
                                This app is not a medical service and does not give medical advice.
                                If you have a health condition, speak to a doctor before starting a
                                new training programme.
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="mt-12 flex items-center justify-between gap-4 border-t border-white/10 pt-8">
                    {step > 0 ? (
                        <button onClick={() => setStep((s) => s - 1)}
                            className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-white/50 hover:text-white transition-colors">
                            <ArrowLeft size={16} /> Back
                        </button>
                    ) : <span />}

                    <div className="flex items-center gap-5">
                        {step > 0 && step < 2 && (
                            <button onClick={() => setStep((s) => s + 1)}
                                className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors">
                                Skip
                            </button>
                        )}
                        {step === 2 && (
                            <button onClick={finish} disabled={saving}
                                className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors">
                                Skip
                            </button>
                        )}

                        {step < 2 ? (
                            <button
                                onClick={() => setStep((s) => s + 1)}
                                disabled={!canContinue}
                                className="group flex items-center gap-4 bg-electric-500 hover:bg-electric-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors pl-6 pr-2 py-2 min-h-[52px]"
                            >
                                <span className="text-[11px] font-bold uppercase tracking-[0.2em]">Continue</span>
                                <span className="grid place-items-center w-10 h-10 bg-void">
                                    <ArrowRight size={18} />
                                </span>
                            </button>
                        ) : (
                            <button
                                onClick={finish}
                                disabled={saving}
                                className="group flex items-center gap-4 bg-electric-500 hover:bg-electric-600 disabled:opacity-60 transition-colors pl-6 pr-2 py-2 min-h-[52px]"
                            >
                                <span className="text-[11px] font-bold uppercase tracking-[0.2em]">
                                    {saving ? "Finishing" : "Finish"}
                                </span>
                                <span className="grid place-items-center w-10 h-10 bg-void">
                                    {saving ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
                                </span>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {cropFile && (
                <AvatarCropper
                    file={cropFile}
                    saving={uploading}
                    onCancel={() => setCropFile(null)}
                    onConfirm={handleCropped}
                />
            )}
        </section>
    );
}