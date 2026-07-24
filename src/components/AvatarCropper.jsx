import { useEffect, useRef, useState } from "react";
import { X, ZoomIn, RotateCcw, Check, Loader2 } from "lucide-react";

const BOX = 320;
const OUT = 512;

export default function AvatarCropper({ file, onCancel, onConfirm, saving }) {
    const [img, setImg] = useState(null);
    const [scale, setScale] = useState(1);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const drag = useRef(null);

    useEffect(() => {
        if (!file) return;
        const url = URL.createObjectURL(file);
        const image = new Image();
        image.onload = () => setImg(image);
        image.src = url;
        return () => URL.revokeObjectURL(url);
    }, [file]);

    if (!img) {
        return (
            <div className="fixed inset-0 z-[200] bg-void/80 grid place-items-center">
                <Loader2 className="animate-spin text-white" size={28} />
            </div>
        );
    }

    const base = Math.max(BOX / img.width, BOX / img.height);
    const dispW = img.width * base * scale;
    const dispH = img.height * base * scale;

    function clamp(o, w, h) {
        const maxX = Math.max(0, (w - BOX) / 2);
        const maxY = Math.max(0, (h - BOX) / 2);
        return {
            x: Math.min(maxX, Math.max(-maxX, o.x)),
            y: Math.min(maxY, Math.max(-maxY, o.y)),
        };
    }

    function start(e) {
        const p = e.touches ? e.touches[0] : e;
        drag.current = { px: p.clientX, py: p.clientY, ox: offset.x, oy: offset.y };
    }

    function move(e) {
        if (!drag.current) return;
        const p = e.touches ? e.touches[0] : e;
        const next = {
            x: drag.current.ox + (p.clientX - drag.current.px),
            y: drag.current.oy + (p.clientY - drag.current.py),
        };
        setOffset(clamp(next, dispW, dispH));
    }

    function end() {
        drag.current = null;
    }

    function changeScale(v) {
        const s = Number(v);
        setScale(s);
        setOffset((o) => clamp(o, img.width * base * s, img.height * base * s));
    }

    function reset() {
        setScale(1);
        setOffset({ x: 0, y: 0 });
    }

    function confirm() {
        const f = OUT / BOX;
        const canvas = document.createElement("canvas");
        canvas.width = OUT;
        canvas.height = OUT;
        const ctx = canvas.getContext("2d");
        ctx.imageSmoothingQuality = "high";
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, OUT, OUT);
        ctx.drawImage(
            img,
            (BOX / 2 - dispW / 2 + offset.x) * f,
            (BOX / 2 - dispH / 2 + offset.y) * f,
            dispW * f,
            dispH * f
        );
        canvas.toBlob((blob) => blob && onConfirm(blob), "image/jpeg", 0.85);
    }

    return (
        <div className="fixed inset-0 z-[200] bg-void/85 backdrop-blur-sm grid place-items-center p-4 overflow-y-auto">
            <div className="bg-surface border border-line w-full max-w-md my-8">
                <div className="flex items-center justify-between px-6 py-4 border-b border-line">
                    <h3 className="mega text-lg text-body">Position your photo</h3>
                    <button onClick={onCancel} className="grid place-items-center w-9 h-9 hover:bg-elevated text-muted">
                        <X size={18} />
                    </button>
                </div>

                <div className="p-6">
                    <div
                        className="relative mx-auto overflow-hidden bg-ink-900 cursor-move select-none touch-none"
                        style={{ width: BOX, height: BOX, maxWidth: "100%" }}
                        onMouseDown={start}
                        onMouseMove={move}
                        onMouseUp={end}
                        onMouseLeave={end}
                        onTouchStart={start}
                        onTouchMove={move}
                        onTouchEnd={end}
                    >
                        <img
                            src={img.src}
                            alt=""
                            draggable="false"
                            className="absolute pointer-events-none max-w-none"
                            style={{
                                width: dispW,
                                height: dispH,
                                left: BOX / 2 - dispW / 2 + offset.x,
                                top: BOX / 2 - dispH / 2 + offset.y,
                            }}
                        />
                        <div className="absolute inset-0 pointer-events-none border-2 border-white/70" />
                        <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3">
                            {Array.from({ length: 9 }).map((_, i) => (
                                <div key={i} className="border border-white/15" />
                            ))}
                        </div>
                    </div>

                    <div className="mt-6 flex items-center gap-3">
                        <ZoomIn size={17} className="text-faint shrink-0" />
                        <input
                            type="range"
                            min="1"
                            max="3"
                            step="0.01"
                            value={scale}
                            onChange={(e) => changeScale(e.target.value)}
                            className="flex-1 accent-electric-500"
                        />
                        <button onClick={reset} className="grid place-items-center w-9 h-9 hover:bg-elevated text-muted" title="Reset">
                            <RotateCcw size={16} />
                        </button>
                    </div>

                    <p className="mt-4 text-xs text-muted">
                        Drag the photo to reposition and use the slider to zoom.
                    </p>
                </div>

                <div className="px-6 py-4 border-t border-line flex gap-3 justify-end">
                    <button onClick={onCancel} className="btn-outline">Cancel</button>
                    <button onClick={confirm} disabled={saving} className="btn-primary">
                        {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                        {saving ? "Uploading" : "Save photo"}
                    </button>
                </div>
            </div>
        </div>
    );
}