const symbols = ["🍒", "🍋", "💎", "7️⃣", "🔔", "🍀"];
let coins = parseInt(localStorage.getItem("coins")) || 1000;
let lastBonus = parseInt(localStorage.getItem("lastBonus")) || 0;
const COOLDOWN = 1000 * 60 * 60 * 24; // 24h

function updateTime() {
  const now = new Date();
  document.getElementById("time").textContent = "🕒 " + now.toLocaleTimeString();
}
setInterval(updateTime, 1000);
updateTime();

function updateCoins() {
  document.getElementById("coins").textContent = "💰 Coins: " + coins;
  localStorage.setItem("coins", coins);
}
updateCoins();

function checkBonus() {
  if (coins <= 0) {
    const now = Date.now();
    if (now - lastBonus > COOLDOWN) {
      coins = 1000;
      lastBonus = now;
      localStorage.setItem("lastBonus", lastBonus);
      document.getElementById("message").textContent = "🟢 Neue Coins erhalten!";
    } else {
      const hours = Math.ceil((COOLDOWN - (now - lastBonus)) / 3600000);
      document.getElementById("message").textContent = `⏳ Bitte warte ${hours}h auf neue Coins`;
    }
    updateCoins();
  }
}
checkBonus();

document.getElementById("spin").addEventListener("click", () => {
  if (coins < 100) return;
  coins -= 100;
  const s1 = symbols[Math.floor(Math.random() * symbols.length)];
  const s2 = symbols[Math.floor(Math.random() * symbols.length)];
  const s3 = symbols[Math.floor(Math.random() * symbols.length)];
  document.getElementById("slots").textContent = `${s1} ${s2} ${s3}`;
  let win = 0;
  if (s1 === s2 && s2 === s3) {
    win = 1000;
    document.getElementById("message").textContent = `🎉 JACKPOT! +${win} Coins`;
  } else if (s1 === s2 || s2 === s3 || s1 === s3) {
    win = 200;
    document.getElementById("message").textContent = `⭐ Kleiner Gewinn: +${win} Coins`;
  } else {
    document.getElementById("message").textContent = `😢 Leider nichts`;
  }
  coins += win;
  updateCoins();
  checkBonus();
});

// Dev-Konsole
document.addEventListener("keydown", (e) => {
  if (e.key === '`') {
    const consoleDiv = document.getElementById("dev-console");
    consoleDiv.style.display = consoleDiv.style.display === "none" ? "block" : "none";
    document.getElementById("dev-input").focus();
  }
});

document.getElementById("dev-input").addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const input = e.target.value.trim().split(" ");
    const cmd = input[0];
    const value = parseInt(input[1]) || 0;
    if (cmd === "/add") coins += value;
    if (cmd === "/set") coins = value;
    if (cmd === "/reset") coins = 1000;
    if (cmd === "/coins") alert("Coins: " + coins);
    updateCoins();
    localStorage.setItem("coins", coins);
    e.target.value = "";
  }
});
