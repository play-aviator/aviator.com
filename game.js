const WORKER_BASE = "https://YOUR_WORKER_URL"; // Replace with deployed Worker URL

async function fetchServerHash() {
  const resp = await fetch(`${WORKER_BASE}/api/fair/hash`);
  const j = await resp.json();
  document.getElementById("server-hash").innerText = j.serverSeedHash;
}
fetchServerHash();

document.getElementById("client-seed").value = `cs_${Math.random().toString(36).slice(2,8)}`;

document.getElementById("play-btn").addEventListener("click", async () => {
  const clientSeed = document.getElementById("client-seed").value;
  const nonce = Number(document.getElementById("nonce").value || 0);
  const resp = await fetch(`${WORKER_BASE}/api/play`, {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ clientSeed, nonce })
  });
  const j = await resp.json();
  document.getElementById("multiplier").innerText = `${j.multiplier.toFixed(2)}×`;
  document.getElementById("nonce").value = nonce + 1;
});
