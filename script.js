// charset: uppercase + lowercase + digits
const CHARSET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

function secureRandomInt(max) {
  if (window.crypto && window.crypto.getRandomValues) {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return array[0] % max;
  }
  // fallback kalau browser jadul
  return Math.floor(Math.random() * max);
}

function generateRandomBody(length) {
  let result = "";
  for (let i = 0; i < length; i++) {
    const idx = secureRandomInt(CHARSET.length);
    result += CHARSET[idx];
  }
  return result;
}

function generateFlag() {
  const prefixRaw = document.getElementById("prefixInput").value.trim();
  const prefix = prefixRaw || "FLAG";
  let length = parseInt(document.getElementById("lengthInput").value, 10);

  if (isNaN(length) || length < 6) length = 6;
  if (length > 64) length = 64;

  document.getElementById("lengthInput").value = length;
  document.getElementById("lengthSlider").value = Math.min(length, 48);
  updateLengthLabel();

  const body = generateRandomBody(length);
  const flag = `${prefix}{${body}}`;

  const outSpan = document.getElementById("flagOutput");
  outSpan.textContent = flag;
  outSpan.classList.remove("output-placeholder");

  // update history (keep last 3)
  const historyBox = document.getElementById("historyBox");
  const lines = historyBox.value
    ? historyBox.value.split("\n").filter(Boolean)
    : [];
  lines.unshift(flag);
  historyBox.value = lines.slice(0, 3).join("\n");
}

function updateLengthLabel() {
  const value = document.getElementById("lengthSlider").value;
  document.getElementById("lengthLabel").textContent = `${value} karakter`;
  document.getElementById("lengthInput").value = value;
}

function syncLengthFromInput() {
  let val = parseInt(document.getElementById("lengthInput").value, 10);
  if (isNaN(val)) val = 16;
  if (val < 6) val = 6;
  if (val > 64) val = 64;
  document.getElementById("lengthInput").value = val;
  document.getElementById("lengthSlider").value = Math.min(val, 48);
  updateLengthLabel();
}

// preset chips handling
document.querySelectorAll("#presetChips .chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    document
      .querySelectorAll("#presetChips .chip")
      .forEach((c) => c.classList.remove("active"));
    chip.classList.add("active");
    const prefix = chip.getAttribute("data-prefix");
    document.getElementById("prefixInput").value = prefix;
  });
});

// copy helpers
function copyToClipboard(text) {
  if (!text) return;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).catch(() => {
      console.warn("Clipboard write failed");
    });
  } else {
    const tmp = document.createElement("textarea");
    tmp.value = text;
    document.body.appendChild(tmp);
    tmp.select();
    document.execCommand("copy");
    document.body.removeChild(tmp);
  }
}

function copyFlag() {
  const text = document.getElementById("flagOutput").textContent.trim();
  copyToClipboard(text);
}

function copyLeet() {
  const text = document.getElementById("leetOutput").textContent.trim();
  copyToClipboard(text);
}

// leet converter
const LEET_MAP = {
  a: "4",
  A: "4",
  e: "3",
  E: "3",
  t: "7",
  T: "7",
  s: "5",
  S: "5",
  g: "9",
  G: "9",
  o: "0",
  O: "0",
  l: "1",
  L: "1",
  " ": "_",
};

function toLeet(text) {
  return text
    .split("")
    .map((ch) => (Object.prototype.hasOwnProperty.call(LEET_MAP, ch) ? LEET_MAP[ch] : ch))
    .join("");
}

function randomizeCase(str) {
  return str
    .split("")
    .map((ch) => {
      if (!/[a-zA-Z]/.test(ch)) return ch;
      return Math.random() < 0.5 ? ch.toLowerCase() : ch.toUpperCase();
    })
    .join("");
}

function convertLeet() {
  const input = document.getElementById("leetInput").value;
  if (!input) {
    return;
  }
  let result = toLeet(input);
  const randomCase = document.getElementById("randomCaseToggle").checked;
  if (randomCase) {
    result = randomizeCase(result);
  }

  const outSpan = document.getElementById("leetOutput");
  outSpan.textContent = result;
  outSpan.classList.remove("output-placeholder");
}

// init label saat halaman load
document.addEventListener("DOMContentLoaded", () => {
  updateLengthLabel();
});
