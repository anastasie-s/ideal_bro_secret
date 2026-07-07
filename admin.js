const SHEETS_URL = "https://script.google.com/macros/s/AKfycbybdZ7saSVOPyAm5TdZP0qz1eFQg_wJO_-eAV3J8PnKfqecP8PCktjeUNWUMP7wWkc/exec";

let players = [];
let groupA = [];
let groupB = [];

const $ = (id) => document.getElementById(id);

function checkAdminPassword(password) {
  return new Promise((resolve, reject) => {
    const callbackName = "idealbroAdminPass_" + Date.now();

    window[callbackName] = (response) => {
      delete window[callbackName];
      script.remove();
      resolve(response.ok === true);
    };

    const script = document.createElement("script");
    script.src =
      SHEETS_URL +
      "?action=checkAdminPassword" +
      "&password=" + encodeURIComponent(password) +
      "&callback=" + callbackName;

    script.onerror = reject;
    document.body.appendChild(script);
  });
}

$("adminUnlockBtn").onclick = async () => {
  $("adminErrorText").classList.add("hidden");
  $("adminUnlockBtn").textContent = "Проверяем...";

  const ok = await checkAdminPassword($("adminCodeInput").value);

  if (!ok) {
    $("adminErrorText").classList.remove("hidden");
    $("adminUnlockBtn").textContent = "Открыть админку →";
    return;
  }

  sessionStorage.setItem("idealbro-admin-unlocked", "yes");
  $("adminLockScreen").classList.add("hidden");
  $("adminPanel").classList.remove("hidden");
};

$("adminCodeInput").addEventListener("keydown", (e) => {
  if (e.key === "Enter") $("adminUnlockBtn").click();
});

if (sessionStorage.getItem("idealbro-admin-unlocked") === "yes") {
  $("adminLockScreen").classList.add("hidden");
  $("adminPanel").classList.remove("hidden");
}

function jsonp(action) {
  return new Promise((resolve, reject) => {
    const callbackName = "idealbroAdmin_" + Date.now();

    window[callbackName] = (response) => {
      delete window[callbackName];
      script.remove();
      resolve(response);
    };

    const script = document.createElement("script");
    script.src =
      SHEETS_URL +
      "?action=" + encodeURIComponent(action) +
      "&callback=" + callbackName;

    script.onerror = reject;
    document.body.appendChild(script);
  });
}

function renderList(id, items) {
  $(id).innerHTML = items
    .map((p) => `<div class="admin-item"><b>${p.name}</b></div>`)
    .join("");
}

$("loadBtn").onclick = async () => {
  $("playersList").innerHTML = "Загружаю...";

  const response = await jsonp("getResults");

  players = response.players || [];

  renderList("playersList", players);
};

$("splitBtn").onclick = () => {
  const shuffled = [...players].sort(() => Math.random() - 0.5);

  groupA = shuffled.filter((_, i) => i % 2 === 0);
  groupB = shuffled.filter((_, i) => i % 2 === 1);

  renderList("groupA", groupA);
  renderList("groupB", groupB);
};

$("pairBtn").onclick = () => {
  const a = [...groupA];
  const b = [...groupB];

  const pairs = [];

  while (a.length && b.length) {
    const p1 = a.shift();
    const p2 = b.shift();

    pairs.push([p1, p2]);
  }

  $("pairsList").innerHTML = pairs
    .map(
      ([p1, p2]) =>
        `<div class="admin-item pair"><b>${p1.name}</b><span>+</span><b>${p2.name}</b></div>`
    )
    .join("");
};
