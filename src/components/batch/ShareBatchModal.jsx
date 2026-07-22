import { useRef, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, Check, Download, Share2, MessageCircle, Maximize2 } from "lucide-react";

export default function ShareBatchModal({ batch, open, onClose }) {
  const qrRef = useRef(null);
  const [copied, setCopied] = useState("");
  const [fullscreen, setFullscreen] = useState(false);

  const joinUrl = `${window.location.origin}/join-batch?code=${batch.join_code}`;
  const shareText = `Join "${batch.name}" at the JUST Health & Fitness Club.\n\nCode: ${batch.join_code}\n${joinUrl}`;

  function copy(what, value) {
    navigator.clipboard.writeText(value);
    setCopied(what);
    setTimeout(() => setCopied(""), 1800);
  }

  function downloadPoster() {
    const qrCanvas = qrRef.current?.querySelector("canvas");
    if (!qrCanvas) return;

    const W = 720, H = 1000;
    const c = document.createElement("canvas");
    c.width = W; c.height = H;
    const ctx = c.getContext("2d");

    // background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, W, H);

    // top banner
    const grad = ctx.createLinearGradient(0, 0, W, 260);
    grad.addColorStop(0, batch.cover_color || "#0E9F6E");
    grad.addColorStop(1, "#0f172a");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, 260);

    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.font = "600 22px Inter, Arial, sans-serif";
    ctx.fillText("JUST HEALTH & FITNESS CLUB", W / 2, 78);

    ctx.font = "800 40px Inter, Arial, sans-serif";
    const name = batch.name.length > 26 ? batch.name.slice(0, 25) + "…" : batch.name;
    ctx.fillText(name, W / 2, 140);

    ctx.font = "400 20px Inter, Arial, sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    const sub = [batch.schedule, batch.venue].filter(Boolean).join("  ·  ");
    if (sub) ctx.fillText(sub.slice(0, 48), W / 2, 182);

    ctx.font = "500 18px Inter, Arial, sans-serif";
    ctx.fillText("Scan to join", W / 2, 226);

    // QR
    const qrSize = 380;
    ctx.drawImage(qrCanvas, (W - qrSize) / 2, 310, qrSize, qrSize);

    // code
    ctx.fillStyle = "#0f172a";
    ctx.font = "500 20px Inter, Arial, sans-serif";
    ctx.fillText("or enter this code in the app", W / 2, 748);

    ctx.font = "800 64px Inter, Arial, sans-serif";
    ctx.letterSpacing = "12px";
    ctx.fillText(batch.join_code, W / 2, 826);
    ctx.letterSpacing = "0px";

    ctx.fillStyle = "#64748b";
    ctx.font = "400 18px Inter, Arial, sans-serif";
    ctx.fillText(window.location.origin.replace(/^https?:\/\//, ""), W / 2, 890);
    ctx.fillText("Jashore University of Science and Technology", W / 2, 926);

    const link = document.createElement("a");
    link.download = `${batch.join_code}-join-poster.png`;
    link.href = c.toDataURL("image/png");
    link.click();
  }

  async function nativeShare() {
    if (navigator.share) {
      try {
        await navigator.share({ title: batch.name, text: shareText, url: joinUrl });
      } catch {
        /* user cancelled */
      }
    } else {
      copy("text", shareText);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-ink-900/60 backdrop-blur-sm grid place-items-center p-4 overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl w-full max-w-md my-8 overflow-hidden"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-ink-100">
              <h3 className="font-extrabold text-ink-900">Share Join Code</h3>
              <button onClick={onClose} className="grid place-items-center w-9 h-9 rounded-lg hover:bg-ink-100 text-ink-500">
                <X size={19} />
              </button>
            </div>

            <div className="p-6">
              <div ref={qrRef} className="grid place-items-center">
                <div className="p-4 bg-white rounded-2xl border-2 border-ink-100">
                  <QRCodeCanvas value={joinUrl} size={190} level="M" includeMargin={false} />
                </div>
              </div>

              <p className="mt-5 text-center text-4xl font-extrabold tracking-[0.3em] text-ink-900">
                {batch.join_code}
              </p>
              <p className="mt-1 text-center text-xs text-ink-400">
                Scanning opens the site with the code pre-filled
              </p>

              <div className="mt-6 grid grid-cols-2 gap-2.5">
                <button onClick={() => copy("code", batch.join_code)} className="btn-outline">
                  {copied === "code" ? <><Check size={16} /> Copied</> : <><Copy size={16} /> Copy Code</>}
                </button>
                <button onClick={() => copy("link", joinUrl)} className="btn-outline">
                  {copied === "link" ? <><Check size={16} /> Copied</> : <><Copy size={16} /> Copy Link</>}
                </button>
              </div>

              <button onClick={downloadPoster} className="btn-primary w-full mt-2.5">
                <Download size={17} /> Download Poster Image
              </button>

              <div className="mt-2.5 grid grid-cols-2 gap-2.5">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
                  target="_blank" rel="noreferrer"
                  className="btn bg-[#25D366] text-white hover:brightness-95"
                >
                  <MessageCircle size={17} /> WhatsApp
                </a>
                <button onClick={nativeShare} className="btn bg-ink-100 text-ink-700 hover:bg-ink-200">
                  <Share2 size={17} /> More
                </button>
              </div>

              <button onClick={() => setFullscreen(true)} className="btn w-full mt-2.5 text-ink-500 hover:bg-ink-100">
                <Maximize2 size={16} /> Show fullscreen for scanning
              </button>

              <p className="mt-5 text-xs text-ink-400 leading-relaxed">
                <strong className="text-ink-600">Tip:</strong> download the poster and post it on the club's
                Facebook page, or print it for the gymnasium notice board. Anyone who scans it can join in one tap.
              </p>
            </div>
          </motion.div>

          <AnimatePresence>
            {fullscreen && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-[110] bg-white grid place-items-center p-6"
                onClick={(e) => { e.stopPropagation(); setFullscreen(false); }}
              >
                <div className="text-center">
                  <p className="text-sm font-bold uppercase tracking-widest text-ink-400">Scan to join</p>
                  <h4 className="mt-2 text-2xl font-extrabold text-ink-900">{batch.name}</h4>
                  <div className="mt-6 inline-block p-5 border-4 border-ink-100 rounded-3xl">
                    <QRCodeCanvas value={joinUrl} size={260} level="M" />
                  </div>
                  <p className="mt-6 text-5xl font-extrabold tracking-[0.3em] text-ink-900">
                    {batch.join_code}
                  </p>
                  <p className="mt-8 text-sm text-ink-400">Tap anywhere to close</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
