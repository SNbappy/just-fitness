import { useEffect } from "react";
import { X } from "lucide-react";

export default function ImageViewer({ src, alt, onClose }) {
    useEffect(() => {
        function onKey(e) {
            if (e.key === "Escape") onClose();
        }
        document.addEventListener("keydown", onKey);
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = "";
        };
    }, [onClose]);

    if (!src) return null;

    return (
        <div
            className="fixed inset-0 z-[210] bg-void/95 backdrop-blur-sm grid place-items-center p-6"
            onClick={onClose}
        >
            <button
                onClick={onClose}
                className="absolute top-5 right-5 grid place-items-center w-11 h-11 text-white/70 hover:text-white hover:bg-white/10"
                aria-label="Close"
            >
                <X size={24} />
            </button>
            <img
                src={src}
                alt={alt || ""}
                onClick={(e) => e.stopPropagation()}
                className="max-w-full max-h-[85vh] object-contain"
            />
        </div>
    );
}