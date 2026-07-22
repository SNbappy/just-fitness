import { supabase } from "./supabase";

export const BATCH_TYPES = [
  { value: "gym", label: "Gym & Strength" },
  { value: "yoga", label: "Yoga & Flexibility" },
  { value: "cardio", label: "Cardio / Morning Walk" },
  { value: "sports", label: "Sports" },
  { value: "rehab", label: "Rehabilitation" },
  { value: "other", label: "Other" },
];

export const GENDER_POLICIES = [
  { value: "mixed", label: "Open to all" },
  { value: "male", label: "Male only" },
  { value: "female", label: "Female only" },
];

export function batchTypeLabel(value) {
  return BATCH_TYPES.find((t) => t.value === value)?.label || value;
}

export async function createBatch(payload, trainerId) {
  const { data: codeData, error: codeError } = await supabase.rpc("generate_join_code");
  if (codeError) return { error: codeError };

  const { data, error } = await supabase
    .from("batches")
    .insert({ ...payload, trainer_id: trainerId, join_code: codeData })
    .select()
    .single();

  return { data, error };
}

export async function joinBatchByCode(code, userId) {
  const clean = code.trim().toUpperCase();

  const { data: batch, error: findError } = await supabase
    .from("batches")
    .select("id, name, capacity, is_active")
    .eq("join_code", clean)
    .maybeSingle();

  if (findError) return { error: findError };
  if (!batch) return { error: { message: "No batch found with that code. Check for typos." } };
  if (!batch.is_active) return { error: { message: "This batch is no longer accepting members." } };

  const { data: existing } = await supabase
    .from("batch_members")
    .select("id, status")
    .eq("batch_id", batch.id)
    .eq("user_id", userId)
    .maybeSingle();

  if (existing?.status === "active") {
    return { error: { message: "You are already a member of this batch." } };
  }

  if (existing) {
    const { error } = await supabase
      .from("batch_members")
      .update({ status: "active", joined_at: new Date().toISOString() })
      .eq("id", existing.id);
    return error ? { error } : { data: batch };
  }

  const { error } = await supabase
    .from("batch_members")
    .insert({ batch_id: batch.id, user_id: userId });

  return error ? { error } : { data: batch };
}

export async function getMyBatches(userId) {
  const { data, error } = await supabase
    .from("batch_members")
    .select("id, joined_at, batches(*)")
    .eq("user_id", userId)
    .eq("status", "active");

  if (error) return { error };
  return { data: (data || []).map((r) => r.batches).filter(Boolean) };
}

export async function getBatchesITrain(userId) {
  const { data, error } = await supabase
    .from("batches")
    .select("*")
    .eq("trainer_id", userId)
    .order("created_at", { ascending: false });
  return { data, error };
}

export async function getBatchRoster(batchId) {
  const { data, error } = await supabase
    .from("batch_members")
    .select("id, joined_at, status, profiles(id, full_name, photo_url, department, student_id, gender, role)")
    .eq("batch_id", batchId)
    .eq("status", "active");
  return { data, error };
}
