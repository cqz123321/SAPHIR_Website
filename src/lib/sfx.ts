/*
  Tiny UI sound kit — every sound is synthesised with the Web Audio API, so the
  site ships no audio files.

  • Browsers only allow audio after the visitor has clicked/tapped/pressed a key,
    so nothing can play before that (hover sounds start after the first click).
  • Visitors can switch sounds off with the speaker button in the nav; the choice
    is remembered in localStorage (key "saphir-sfx").
*/

type Wave = OscillatorType;

const KEY = "saphir-sfx";
let ctx: AudioContext | null = null;
let out: GainNode | null = null;
let unlocked = false;
let lastHover = 0;

export function isOn(): boolean {
  try {
    return localStorage.getItem(KEY) !== "off";
  } catch {
    return true;
  }
}

export function setOn(on: boolean) {
  try {
    localStorage.setItem(KEY, on ? "on" : "off");
  } catch {
    /* storage blocked — still toggles for this page view */
  }
  document.documentElement.dataset.sfx = on ? "on" : "off";
  window.dispatchEvent(new CustomEvent("sfx-change", { detail: on }));
}

function audio(): AudioContext | null {
  if (!ctx) {
    const C = window.AudioContext || (window as any).webkitAudioContext;
    if (!C) return null;
    ctx = new C();
    out = ctx.createGain();
    out.gain.value = 0.16;
    // a gentle low-pass keeps the square waves from sounding harsh
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 5200;
    out.connect(lp).connect(ctx.destination);
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

/** Call once: unlocks audio on the first real user gesture. */
export function armUnlock() {
  const unlock = () => {
    unlocked = true;
    audio();
  };
  for (const ev of ["pointerdown", "keydown", "touchstart"])
    window.addEventListener(ev, unlock, { capture: true, passive: true });
}

const ready = () => unlocked && isOn() && audio() && out;

function tone(
  f0: number,
  f1: number,
  at: number,
  dur: number,
  vol = 0.5,
  type: Wave = "square",
) {
  const a = ctx!;
  const t = a.currentTime + at;
  const o = a.createOscillator();
  const g = a.createGain();
  o.type = type;
  o.frequency.setValueAtTime(f0, t);
  o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.004);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(out!);
  o.start(t);
  o.stop(t + dur + 0.02);
}

function noise(at: number, dur: number, vol = 0.3, hp = 1800) {
  const a = ctx!;
  const t = a.currentTime + at;
  const len = Math.ceil(a.sampleRate * dur);
  const buf = a.createBuffer(1, len, a.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
  const src = a.createBufferSource();
  src.buffer = buf;
  const f = a.createBiquadFilter();
  f.type = "highpass";
  f.frequency.value = hp;
  const g = a.createGain();
  g.gain.value = vol;
  src.connect(f).connect(g).connect(out!);
  src.start(t);
}

export const sfx = {
  /** Soft tick — hovering links and buttons. */
  tick() {
    if (!ready()) return;
    const now = performance.now();
    if (now - lastHover < 45) return;
    lastHover = now;
    tone(2400, 1800, 0, 0.025, 0.18, "triangle");
  },
  /** Arcade cursor move — hovering a portrait on a select screen. */
  cursor() {
    if (!ready()) return;
    const now = performance.now();
    if (now - lastHover < 40) return;
    lastHover = now;
    tone(988, 988, 0, 0.035, 0.32);
    tone(1319, 1319, 0.035, 0.05, 0.28);
  },
  /** Arcade "character selected" — a hit + rising arpeggio. */
  select() {
    if (!ready()) return;
    noise(0, 0.09, 0.35, 1500);
    tone(180, 60, 0, 0.12, 0.5, "sawtooth");
    [523, 659, 784, 1047].forEach((f, i) => tone(f, f, 0.05 + i * 0.045, 0.07, 0.3));
    tone(1568, 1568, 0.24, 0.22, 0.26);
    tone(1568 * 1.005, 1568 * 1.005, 0.24, 0.22, 0.12, "sawtooth");
  },
  /** Plain click — buttons, filters. */
  click() {
    if (!ready()) return;
    tone(900, 420, 0, 0.05, 0.3, "triangle");
  },
  /** Page-level confirm — leaving for another page. */
  go() {
    if (!ready()) return;
    tone(660, 660, 0, 0.04, 0.25);
    tone(990, 990, 0.045, 0.07, 0.25);
  },
  /** Sound switched on / off. */
  toggle(on: boolean) {
    if (!unlocked || !audio() || !out) return;
    if (on) {
      tone(523, 523, 0, 0.05, 0.3);
      tone(784, 784, 0.06, 0.08, 0.3);
    }
  },
};
