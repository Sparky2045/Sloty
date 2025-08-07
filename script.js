const symbols = ["7️⃣", "💎", "🔔", "🍀", "🍒", "🍋"];
const values = {"7️⃣": [100, 200, 500], "💎": [50, 100, 250], "🔔": [30, 60, 150], "🍀": [20, 40, 100], "🍒": [10, 20, 50], "🍋": [5, 10, 25]};
const lines = [
  [0,1,2,3,4], [5,6,7,8,9], [10,11,12,13,14],
  [0,6,12,8,4], [10,6,2,8,14],
  [0,5,10,6,2], [4,9,14,8,2], [0,6,7,8,14], [10,6,7,8,4], [5,6,7,8,9]
];
let coins = 1000;
let nextFreeCoinsTime = Date.now() + 24 * 60 * 60 * 1000;
const spinSound = new Audio('sounds/spin.mp3');
const winSound = new Audio('sounds/win.mp3');

function createGrid() {
  const grid = document.getElementById("slot-grid");
  grid.innerHTML = "";
  for (let i = 0; i < 15; i++) {
    const cell = document.createElement("div");
    cell.textContent = "❔";
    grid.appendChild(cell);
  }
}
function updateTimer() {
  let diff = nextFreeCoinsTime - Date.now();
  if (diff <= 0) {
    coins += 1000;
    nextFreeCoinsTime = Date.now() + 24 * 60 * 60 * 1000;
    updateCoins();
  }
  let h = String(Math.floor(diff / 3600000)).padStart(2, '0');
  let m = String(Math.floor((diff % 3600000)/60000)).padStart(2, '0');
  let s = String(Math.floor((diff % 60000)/1000)).padStart(2, '0');
  document.getElementById("timer").textContent = `${h}:${m}:${s}`;
}
function updateCoins() {
  document.getElementById("coins").textContent = coins;
}
function getRandomSymbol() {
  return symbols[Math.floor(Math.random() * symbols.length)];
}
function spin() {
  const bet = parseInt(document.getElementById("betAmount").value);
  if (coins < bet) return alert("Nicht genug Coins!");
  coins -= bet;
  updateCoins();
  document.getElementById("spinBtn").disabled = true;
  spinSound.play();

  const grid = document.getElementById("slot-grid").children;
  for (let cell of grid) cell.classList.remove("hit");
  let result = [];
  for (let col = 0; col < 5; col++) {
    for (let row = 0; row < 3; row++) {
      let i = row * 5 + col;
      setTimeout(() => {
        const sym = getRandomSymbol();
        grid[i].textContent = sym;
        result[i] = sym;
        if (i === 14) {
          evaluate(result, bet);
          document.getElementById("spinBtn").disabled = false;
        }
      }, col * 300 + row * 100);
    }
  }
}
function evaluate(result, bet) {
  let totalWin = 0;
  let info = document.getElementById("info");
  info.textContent = "";

  for (let line of lines) {
    const [a,b,c,d,e] = line.map(i => result[i]);
    if (a === b && b === c) {
      let count = (c === d ? (d === e ? 5 : 4) : 3);
      let val = values[a][count-3] * bet;
      totalWin += val;
      for (let i = 0; i < count; i++) {
        document.getElementById("slot-grid").children[line[i]].classList.add("hit");
      }
    }
  }

  if (result.every(s => s === result[0])) {
    totalWin += 100 * bet;
    info.textContent += "🎉 JACKPOT! Alle 15 gleich! ";
  }

  if (totalWin > 0) {
    coins += totalWin;
    winSound.play();
    info.textContent += `Gewinn: +${totalWin} Coins`;
  } else {
    info.textContent = "Leider nichts gewonnen.";
  }
  updateCoins();
}

document.getElementById("spinBtn").addEventListener("click", spin);
setInterval(updateTimer, 1000);
createGrid();
updateCoins();
