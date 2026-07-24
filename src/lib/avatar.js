import { supabase } from "./supabase";

const MAX_DIM = 512;
const QUALITY = 0.82;

// Downscale and compress in the browser before upload — a 4MB phone photo
// becomes roughly 60KB, which matters a lot on campus wifi.
export function compressImage(file) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(file);

        img.onload = () => {
            URL.revokeObjectURL(url);
            const size = Math.min(img.width, img.height);
            const sx = (img.width - size) / 2;
            const sy = (img.height - size) / 2;

            const canvas = document.createElement("canvas");
            canvas.width = MAX_DIM;
            canvas.height = MAX_DIM;
            const ctx = canvas.getContext("2d");
            ctx.imageSmoothingQuality = "high";
            ctx.drawImage(img, sx, sy, size, size, 0, 0, MAX_DIM, MAX_DIM);

            canvas.toBlob(
                (blob) => (blob ? resolve(blob) : reject(new Error("Could not process image"))),
                "image/jpeg",
                QUALITY
            );
        };

        img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error("That file could not be read as an image"));
        };

        img.src = url;
    });
}

export async function uploadAvatar(file, userId) {
    if (!file.type.startsWith("image/")) {
        return { error: { message: "Please choose an image file." } };
    }
    if (file.size > 8 * 1024 * 1024) {
        return { error: { message: "Image is too large. Maximum 8MB." } };
    }

    let blob;
    try {
        blob = await compressImage(file);
    } catch (e) {
        return { error: { message: e.message } };
    }

    const path = `${userId}/avatar.jpg`;

    const { error: upErr } = await supabase.storage
        .from("avatars")
        .upload(path, blob, { upsert: true, contentType: "image/jpeg", cacheControl: "3600" });

    if (upErr) return { error: upErr };

    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    // Cache-bust so the new photo shows immediately
    const url = `${data.publicUrl}?v=${Date.now()}`;

    const { error: dbErr } = await supabase
        .from("profiles")
        .update({ photo_url: url, updated_at: new Date().toISOString() })
        .eq("id", userId);

    if (dbErr) return { error: dbErr };
    return { url };
}