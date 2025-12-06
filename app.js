// app.js
// IMPORTANT: if your worker URL differs, change WORKER_BASE
const WORKER_BASE = "https://aviator.very-hotporns.workers.dev";

const MULTI_EL = document.getElementById("multiplier");
const SUB_EL = document.getElementById("multiplier-sub");
const HISTORY = document.getElementById("history-strip");
const CLIENT_SEED = document.getElementById("client-seed");
const NONCE = document.getElementById("nonce");
const MANUAL_BTN = document.getElementById("manual-play");

// init client seed
CLIENT_SEED.value = CLIENT_SEED.value || `cs_${Math.random().toString(36).slice(2,9)}`;

let lastRoundTime = 0;
let polling = true;
let roundInProgress = false;
const POLL_INTERVAL = 3500; // milliseconds

// Keep last 20 rounds
const recentRounds = [];

function addToHistory(mult) {
  const pill = document.createElement("div");
  pill.className = "round-pill";
  const n = Number(mult);
  if (n < 2.5) pill.classList.add("low");
  if (n >= 1000) pill.classList.add("big");
  pill.textContent = `${Number(mult).toFixed(2)}×`;
  HISTORY.prepend(pill);
  recentRounds.unshift(pill);
  if (recentRounds.length > 20) {
    const last = recentRounds.pop();
    last.remove();
  }
}

// animate value from 1 -> target over duration (easing)
function animateMultiplier(target, duration = 2400) {
  roundInProgress = true;
  const start = performance.now();
  const from = 1;
  function easeOutCubic(t){ return 1 - Math.pow(1 - t, 3); }
  function frame(now) {
    const t = Math.min(1, (now - start) / duration);
    const eased = easeOutCubic(t);
    const value = from + (target - from) * eased;
    MULTI_EL.textContent = `${value.toFixed(2)}×`;
    if (t < 1) {
      requestAnimationFrame(frame);
    } else {
      // hold for a short while then reset to "waiting"
      setTimeout(()=> {
        SUB_EL.textContent = `Round finished • last ${target.toFixed(2)}×`;
        roundInProgress = false;
      }, 300);
    }
  }
  requestAnimationFrame(frame);
}

// fetch a play from worker
async function fetchPlay(clientSeed, nonce) {
  try {
    const res = await fetch(`${WORKER_BASE}/api/play`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ clientSeed, nonce })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const j = await res.json();
    return j;
  } catch (e) {
    console.error("fetchPlay error:", e);
    return null;
  }
}

// polling loop
async function pollLoop() {
  while (polling) {
    if (!roundInProgress) {
      const clientSeed = CLIENT_SEED.value;
      const nonce = Number(NONCE.value || 1);
      const play = await fetchPlay(clientSeed, nonce);
      if (play && play.multiplier !== undefined) {
        const mult = Number(play.multiplier);
        lastRoundTime = play.time || Date.now();
        SUB_EL.textContent = `Round received • nonce ${nonce}`;
        animateMultiplier(mult);
        addToHistory(mult);
        NONCE.value = nonce + 1;
      } else {
        SUB_EL.textContent = `No data or error`;
      }
    }
    await new Promise(r => setTimeout(r, POLL_INTERVAL));
  }
}

pollLoop().catch(err => console.error(err));

// manual play (button)
MANUAL_BTN.addEventListener("click", async () => {
  if (roundInProgress) return;
  const clientSeed = CLIENT_SEED.value;
  const nonce = Number(NONCE.value || 1);
  const play = await fetchPlay(clientSeed, nonce);
  if (play && play.multiplier !== undefined) {
    animateMultiplier(Number(play.multiplier));
    addToHistory(play.multiplier);
    NONCE.value = nonce + 1;
  } else {
    alert("Play failed — see console.");
  }
});
