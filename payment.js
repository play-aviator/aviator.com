const WORKER_BASE = "https://YOUR_WORKER_URL"; // Replace with deployed Worker URL

document.getElementById("mpesa-btn").addEventListener("click", async () => {
  const phone = document.getElementById("phone").value;
  const amount = Number(document.getElementById("amount").value);
  if (!phone || !amount) return alert("Enter phone and amount");

  const resp = await fetch(`${WORKER_BASE}/api/pay/mpesa`, {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ phone, amount })
  });
  const j = await resp.json();
  alert("M-Pesa push sent! Check phone. Response: " + JSON.stringify(j));
});
