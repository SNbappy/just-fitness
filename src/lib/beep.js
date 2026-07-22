let ctx = null;

function context() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (AC) ctx = new AC();
  }
  if (ctx?.state === "suspended") ctx.resume();
  return ctx;
}

export function beep(frequency = 880, ms = 160, volume = 0.25) {
  const c = context();
  if (!c) return;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = "sine";
  osc.frequency.value = frequency;
  gain.gain.setValueAtTime(volume, c.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + ms / 1000);
  osc.connect(gain);
  gain.connect(c.destination);
  osc.start();
  osc.stop(c.currentTime + ms / 1000);
}

export function beepCountdown() { beep(660, 120, 0.2); }
export function beepStart() { beep(880, 200, 0.3); }
export function beepEnd() {
  beep(1046, 180, 0.3);
  setTimeout(() => beep(1318, 320, 0.3), 190);
}
