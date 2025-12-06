export default {
  async fetch(request) {
    // Rarely below 2.5x
    // Up to 10,000x occasionally
    function generateMultiplier() {
      const r = Math.random();

      if (r < 0.02) {
        return (Math.random() * 9997 + 3).toFixed(2);  
      }

      if (r < 0.30) {
        return (Math.random() * 8 + 2.5).toFixed(2);
      }

      return (Math.random() * 4 + 2.5).toFixed(2);
    }

    const result = {
      multiplier: generateMultiplier(),
      time: Date.now()
    };

    return new Response(JSON.stringify(result), {
      headers: { "Content-Type": "application/json" }
    });
  }
};

