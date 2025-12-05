// game.js
const API_BASE = "https://your-worker.example.workers.dev"; // replace with your worker URL

async function fetchServerHash() {
  const r = await fetch(`${API_BASE}/api/fair/hash`);
  const j = await r.json();
  document.getElementById("server-hash").innerText = j.serverSeedHash || "n/a";
}
fetchServerHash();

document.getElementById("client-seed").value = `cs_${Math.random().toString(36).slice(2,10)}`;

document.getElementById("verify-play").addEventListener("click", async () => {
  const clientSeed = document.getElementById("client-seed").value;
  const nonce = Number(document.getElementById("nonce").value || 0);
  const resp = await fetch(`${API_BASE}/api/play`, {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ clientSeed, nonce })
  });
  const j = await resp.json();
  document.getElementById("proof-output").innerText = JSON.stringify(j, null, 2);
  // show multiplier
  const m = j.multiplier;
  const el = document.getElementById("multiplier");
  el.innerText = `${m}×`;
});

// Simple bet button triggers play + animate (demo)
document.getElementById("bet-btn").addEventListener("click", async () => {
  const clientSeed = document.getElementById("client-seed").value;
  const nonce = Number(document.getElementById("nonce").value || 0);
  const resp = await fetch(`${API_BASE}/api/play`, {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ clientSeed, nonce })
  });
  const j = await resp.json();
  animateFlight(j.multiplier);
  // increment nonce for next play
  document.getElementById("nonce").value = nonce + 1;
});

function animateFlight(multiplier) {
  const el = document.getElementById("multiplier");
  // simple linear animate from 1 -> multiplier over 3 seconds for demo
  const duration = 3000;
  const start = performance.now();
  function frame(now) {
    const t = Math.min(1, (now - start) / duration);
    const val = 1 + (multiplier - 1) * t;
    el.innerText = `${(Math.round(val * 100) / 100).toFixed(2)}×`;
    if (t < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
