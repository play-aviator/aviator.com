// payment.js
const API_BASE = "https://your-worker.example.workers.dev"; // replace

document.getElementById("mpesa-deposit").addEventListener("click", async () => {
  const phone = document.getElementById("mpesa-phone").value;
  const amount = Number(document.getElementById("mpesa-amt").value);
  const resp = await fetch(`${API_BASE}/api/pay/mpesa`, {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ phone, amount })
  });
  const j = await resp.json();
  alert("M-Pesa request sent. Check your phone. Response: " + JSON.stringify(j));
});

// Stripe / Google Pay (Payment Request API) using Stripe.js
const stripe = Stripe("pk_test_REPLACE_WITH_YOUR_PUBLISHABLE"); // replace
document.getElementById("stripe-pay").addEventListener("click", async () => {
  const amount = 1.00; // USD amount for demo
  const resp = await fetch(`${API_BASE}/api/pay/stripe`, {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ amount, currency: "usd" })
  });
  const j = await resp.json();
  const clientSecret = j.paymentIntent?.client_secret;
  if (!clientSecret) return alert("Failed to create PaymentIntent: " + JSON.stringify(j));
  // Use Stripe Elements / Google Pay UI on production. For demo, open Stripe checkout using client_secret? Better: use Payment Request Button with stripe
  alert("PaymentIntent created. Integrate Payment Request UI for Google Pay using Stripe Elements (client_secret returned).");
});
