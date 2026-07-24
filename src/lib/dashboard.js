import { supabase } from "./supabase";
import { todayISO } from "./logs";

// Day-of-week names as they appear in batch.schedule strings
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function nextSessionLabel(schedule) {
    if (!schedule) return null;
    const today = DAYS[new Date().getDay()];
    // Very light heuristic — just tells the member whether today is a session day
    const mentionsToday = new RegExp(today, "i").test(schedule);
    return mentionsToday ? "Today" : schedule;
}

export async function getDashboardData(userId, isTrainer) {
    const today = todayISO();

    const [logToday, recentLogs, memberships, health] = await Promise.all([
        supabase.from("daily_logs").select("id, weight_kg, workout_done")
            .eq("user_id", userId).eq("log_date", today).maybeSingle(),

        supabase.from("daily_logs").select("log_date, weight_kg")
            .eq("user_id", userId).order("log_date", { ascending: false }).limit(60),

        supabase.from("batch_members")
            .select("batch_id, batches(id, name, schedule, venue, cover_color, batch_type)")
            .eq("user_id", userId).eq("status", "active"),

        supabase.from("health_profiles").select("*").eq("user_id", userId).maybeSingle(),
    ]);

    const batches = (memberships.data || []).map((m) => m.batches).filter(Boolean);
    const batchIds = batches.map((b) => b.id);

    let attendance = { data: [] };
    let latestPost = { data: null };

    if (batchIds.length) {
        [attendance, latestPost] = await Promise.all([
            supabase.from("attendance").select("session_date, status")
                .eq("user_id", userId).in("batch_id", batchIds)
                .order("session_date", { ascending: false }).limit(30),

            supabase.from("batch_posts")
                .select("content, created_at, batch_id, profiles(full_name)")
                .in("batch_id", batchIds)
                .order("created_at", { ascending: false }).limit(1).maybeSingle(),
        ]);
    }

    let trainerStats = null;
    if (isTrainer) {
        const { data: myBatches } = await supabase
            .from("batches").select("id, name").eq("trainer_id", userId);

        const ids = (myBatches || []).map((b) => b.id);
        if (ids.length) {
            const [members, att] = await Promise.all([
                supabase.from("batch_members").select("id, batch_id")
                    .in("batch_id", ids).eq("status", "active"),
                supabase.from("attendance").select("status, session_date").in("batch_id", ids),
            ]);

            const rows = att.data || [];
            const present = rows.filter((a) => a.status === "present" || a.status === "late").length;

            trainerStats = {
                batches: ids.length,
                members: (members.data || []).length,
                sessions: new Set(rows.map((a) => a.session_date)).size,
                rate: rows.length ? Math.round((present / rows.length) * 100) : null,
            };
        } else {
            trainerStats = { batches: 0, members: 0, sessions: 0, rate: null };
        }
    }

    return {
        checkedInToday: !!logToday.data,
        todayLog: logToday.data,
        logs: recentLogs.data || [],
        batches,
        attendance: attendance.data || [],
        latestPost: latestPost.data,
        health: health.data,
        trainerStats,
    };
}