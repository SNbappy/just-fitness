import { supabase } from "./supabase";

export function todayISO() {
  const d = new Date();
  const off = d.getTimezoneOffset();
  return new Date(d.getTime() - off * 60000).toISOString().slice(0, 10);
}

export async function getLog(userId, date) {
  const { data, error } = await supabase
    .from("daily_logs").select("*")
    .eq("user_id", userId).eq("log_date", date).maybeSingle();
  return { data, error };
}

export async function saveLog(userId, date, values) {
  const payload = { user_id: userId, log_date: date };
  const numeric = ["weight_kg", "pulse", "sleep_hours", "water_glasses", "steps", "mood", "energy"];
  numeric.forEach((k) => {
    payload[k] = values[k] === "" || values[k] === undefined || values[k] === null ? null : Number(values[k]);
  });
  payload.workout_done = !!values.workout_done;
  payload.notes = values.notes?.trim() || null;

  const { data, error } = await supabase
    .from("daily_logs")
    .upsert(payload, { onConflict: "user_id,log_date" })
    .select().single();
  return { data, error };
}

export async function getLogRange(userId, days) {
  let q = supabase
    .from("daily_logs").select("*")
    .eq("user_id", userId)
    .order("log_date", { ascending: true });

  if (days) {
    const from = new Date();
    from.setDate(from.getDate() - days);
    q = q.gte("log_date", from.toISOString().slice(0, 10));
  }
  const { data, error } = await q;
  return { data: data || [], error };
}

export function computeStreak(logs) {
  const dates = new Set(logs.map((l) => l.log_date));
  let streak = 0;
  const d = new Date();
  for (;;) {
    const iso = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    if (dates.has(iso)) { streak++; d.setDate(d.getDate() - 1); }
    else if (streak === 0) {
      // allow today to be unlogged without breaking yesterday's streak
      d.setDate(d.getDate() - 1);
      const y = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
      if (dates.has(y)) continue;
      break;
    } else break;
  }
  return streak;
}
