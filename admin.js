const SHEETS_URL = "https://script.google.com/macros/s/AKfycbybdZ7saSVOPyAm5TdZP0qz1eFQg_wJO_-eAV3J8PnKfqecP8PCktjeUNWUMP7wWkc/exec";

const REQUIRED_PLAYERS = 6;

let players = [];
let groupA = [];
let groupB = [];
let usedPairs = [];

const $ = (id) => document.getElementById(id);

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function showMessage(text, type = "info") {
  const box = $("adminMessage");
  box.className = `admin-message ${type}`;
  box.textContent = text;
}

function hideMessage() {
  $("adminMessage").classList.add("hidden");
}

function setButtonLoading(button, text = "Обработка...") {
  button.dataset.originalText = button.textContent;
  button.textContent = text;
  button.disabled = true;
}

function unsetButtonLoading(button) {
  button.textContent = button.dataset.originalText || button.textContent;
  button.disabled = false;
}

function jsonp(action, params = {}) {
  return new Promise((resolve, reject) => {
    const callbackName = "idealbroAdmin_" + Date.now() + "_" + Math.floor(Math.random() * 1000);

    window[callbackName] = (response) => {
      delete window[callbackName];
      script.remove();
      resolve(response);
    };

    const searchParams = new URLSearchParams({
      action,
      callback: callbackName,
      ...params
    });

    const script = document.createElement("script");
    script.src = SHEETS_URL + "?" + searchParams.toString();
    script.onerror = reject;
    document.body.appendChild(script);
  });
}

async function checkAdminPassword(password) {
  const response = await jsonp("checkAdminPassword", { password });
  return response.ok === true;
}

$("adminUnlockBtn").onclick = async () => {
  $("adminErrorText").classList.add("hidden");
  setButtonLoading($("adminUnlockBtn"), "Проверяем...");

  const ok = await checkAdminPassword($("adminCodeInput").value);

  unsetButtonLoading($("adminUnlockBtn"));

  if (!ok) {
    $("adminErrorText").classList.remove("hidden");
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

function renderPlayers(id, items) {
  $(id).innerHTML = items
    .map((p, index) => `
      <div class="admin-item">
        <span class="admin-number">${index + 1}</span>
        <b>${p.name}</b>
      </div>
    `)
    .join("");
}

function validatePlayers() {
  if (players.length !== REQUIRED_PLAYERS) {
    return `Нужно ровно ${REQUIRED_PLAYERS} участников. Сейчас найдено: ${players.length}.`;
  }

  const names = players.map(p => p.name.trim().toLowerCase());
  const duplicates = names.filter((name, index) => names.indexOf(name) !== index);

  if (duplicates.length > 0) {
    return "Есть повторяющиеся имена. Проверь таблицу перед разделением на группы.";
  }

  return null;
}

$("loadBtn").onclick = async () => {
  hideMessage();
  setButtonLoading($("loadBtn"), "Загружаем...");

  await sleep(700);

  const response = await jsonp("getResults");
  players = response.players || [];

  unsetButtonLoading($("loadBtn"));

  if (!players.length) {
    showMessage("Пока нет результатов теста.", "warning");
    return;
  }

  renderPlayers("playersList", players);
  $("playersStep").classList.remove("hidden");

  const validationError = validatePlayers();

  if (validationError) {
    showMessage(validationError, "warning");
  } else {
    showMessage("Результаты загружены. Можно делить участников на группы.", "success");
  }
};

$("seedBtn").onclick = async () => {
  hideMessage();
  setButtonLoading($("seedBtn"), "Заполняем...");

  await sleep(700);

  const response = await jsonp("seedTestData");

  unsetButtonLoading($("seedBtn"));

  if (!response.ok) {
    showMessage(response.error || "Не получилось заполнить тестовые данные.", "warning");
    return;
  }

  showMessage("Тестовые данные добавлены в Sheets. Теперь нажми «Загрузить результаты».", "success");
};

$("splitBtn").onclick = async () => {
  hideMessage();

  const validationError = validatePlayers();

  if (validationError) {
    showMessage(validationError, "warning");
    return;
  }

  setButtonLoading($("splitBtn"), "Анализируем...");

  await sleep(900);

  const shuffled = [...players].sort(() => Math.random() - 0.5);

  groupA = shuffled.slice(0, 3);
  groupB = shuffled.slice(3, 6);

  renderPlayers("groupA", groupA);
  renderPlayers("groupB", groupB);

  $("groupsStep").classList.remove("hidden");
  $("pairsStep").classList.remove("hidden");

  unsetButtonLoading($("splitBtn"));

  showMessage("Группы сформированы. Можно запускать протокол пар.", "success");
};

function pairKey(a, b) {
  return [a.name, b.name].sort().join("::");
}

function generatePairs() {
  const a = [...groupA].sort(() => Math.random() - 0.5);
  const b = [...groupB].sort(() => Math.random() - 0.5);

  const pairs = [];

  for (const p1 of a) {
    let matchIndex = b.findIndex(p2 => !usedPairs.includes(pairKey(p1, p2)));

    if (matchIndex === -1) {
      matchIndex = 0;
    }

    const p2 = b.splice(matchIndex, 1)[0];
    pairs.push([p1, p2]);
    usedPairs.push(pairKey(p1, p2));
  }

  return pairs;
}

function renderPairs(id, pairs) {
  $(id).innerHTML = pairs
    .map(([p1, p2]) => `
      <div class="admin-item pair">
        <b>${p1.name}</b>
        <span>+</span>
        <b>${p2.name}</b>
      </div>
    `)
    .join("");
}

document.querySelectorAll("[data-game]").forEach(button => {
  button.onclick = async () => {
    hideMessage();

    if (!groupA.length || !groupB.length) {
      showMessage("Сначала раздели участников на группы.", "warning");
      return;
    }

    const game = button.dataset.game;

    setButtonLoading(button, "Формируем...");

    await sleep(1200);

    const pairs = generatePairs();

    renderPairs(`pairsGame${game}`, pairs);

    unsetButtonLoading(button);

    showMessage(`Пары для игры ${game} сформированы.`, "success");
  };
});

$("resetBtn").onclick = () => {
  players = [];
  groupA = [];
  groupB = [];
  usedPairs = [];

  ["playersList", "groupA", "groupB", "pairsGame1", "pairsGame2", "pairsGame3"].forEach(id => {
    $(id).innerHTML = "";
  });

  ["playersStep", "groupsStep", "pairsStep"].forEach(id => {
    $(id).classList.add("hidden");
  });

  hideMessage();
};
