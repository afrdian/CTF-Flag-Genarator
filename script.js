// charset: uppercase + lowercase + digits
const CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

function secureRandomInt(max) {
    if (window.crypto && window.crypto.getRandomValues) {
        const array = new Uint32Array(1);
        window.crypto.getRandomValues(array);
        return array[0] % max;
    }
    return Math.floor(Math.random() * max);
}

function generateRandomBody(length) {
    let result = "";
    for (let i = 0; i < length; i++) {
        result += CHARSET[secureRandomInt(CHARSET.length)];
    }
    return result;
}

function generateFlag() {
    const prefix = (document.getElementById("prefixInput").value.trim() || "FLAG");
    let length = parseInt(document.getElementById("lengthInput").value, 10);

    if (isNaN(length) || length < 6) length = 6;
    if (length > 100) length = 100;

    document.getElementById("lengthInput").value = length;
    document.getElementById("lengthSlider").value = length;
    updateLengthLabel();

    const body = generateRandomBody(length);
    const flag = `${prefix}{${body}}`;

    const out = document.getElementById("flagOutput");
    out.textContent = flag;
    out.classList.remove("output-placeholder");

    const history = document.getElementById("historyBox");
    const lines = history.value ? history.value.split("\n").filter(Boolean) : [];
    lines.unshift(flag);
    history.value = lines.slice(0, 3).join("\n");
}

function updateLengthLabel() {
    const value = document.getElementById("lengthSlider").value;
    document.getElementById("lengthLabel").textContent = `${value} characters`;
    document.getElementById("lengthInput").value = value;
}

function syncLengthFromInput() {
    let v = parseInt(document.getElementById("lengthInput").value, 10);
    if (isNaN(v)) v = 16;
    if (v < 6) v = 6;
    if (v > 100) v = 100;
    document.getElementById("lengthSlider").value = v;
    updateLengthLabel();
}

// COPY
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).catch(() => { });
}

function copyFlag() {
    const text = document.getElementById("flagOutput").textContent.trim();
    copyToClipboard(text);
}

function copyLeet() {
    const text = document.getElementById("leetOutput").textContent.trim();
    copyToClipboard(text);
}

// LEET
const LEET_MAP = {
    a: "4", A: "4",
    e: "3", E: "3",
    t: "7", T: "7",
    s: "5", S: "5",
    g: "9", G: "9",
    o: "0", O: "0",
    l: "1", L: "1",
    " ": "_"
};

function toLeet(text) {
    return text.split("").map(ch => LEET_MAP[ch] || ch).join("");
}

function randomizeCase(str) {
    return str.split("").map(ch =>
        /[a-zA-Z]/.test(ch) ? (Math.random() < 0.5 ? ch.toLowerCase() : ch.toUpperCase()) : ch
    ).join("");
}

function convertLeet() {
    const input = document.getElementById("leetInput").value;
    if (!input) return;

    let result = toLeet(input);

    if (document.getElementById("randomCaseToggle").checked) {
        result = randomizeCase(result);
    }

    const prefix = document.getElementById("leetPrefixInput").value.trim();
    if (prefix) result = `${prefix}{${result}}`;

    const out = document.getElementById("leetOutput");
    out.textContent = result;
    out.classList.remove("output-placeholder");
}

// THEME
function applyTheme(theme) {
    document.body.classList.toggle("light-theme", theme === "light");
    document.getElementById("themeToggle").textContent = theme === "light" ? "🌙" : "☀️";
    localStorage.setItem("flaggen-theme", theme);
}

function initTheme() {
    const saved = localStorage.getItem("flaggen-theme");
    const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
    applyTheme(saved || (prefersLight ? "light" : "dark"));

    document.getElementById("themeToggle").addEventListener("click", () => {
        const isLight = document.body.classList.contains("light-theme");
        applyTheme(isLight ? "dark" : "light");
    });
}

document.addEventListener("DOMContentLoaded", () => {
    updateLengthLabel();
    initTheme();
});
