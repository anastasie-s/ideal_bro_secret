const SHEETS_URL = "https://script.google.com/macros/s/AKfycbybdZ7saSVOPyAm5TdZP0qz1eFQg_wJO_-eAV3J8PnKfqecP8PCktjeUNWUMP7wWkc/exec";

const REQUIRED_PLAYERS = 6;

let currentSource = "real";
let selectedGame = 1;

let state = {
  players: [],
  groups: [],
  pairs: []
};

const $ = (id) => document.getElementById(id);

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function jsonp(action, params = {}) {
  return new Promise((resolve, reject) => {
    const callbackName =
      "idealbroAdmin_" + Date.now() + "_" + Math.floor(Math.random() * 100000);

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

async function runLoader(
  targetId,
  requestPromise,
  lines,
  minDuration = 5000
) {
  const target = $(targetId);

  target.innerHTML = `
    <div class="inline-loader">
      <div class="loader-ring"></div>
      <p class="inline-loader-text">${lines[0]}</p>
      <div class="loader-progress">
        <div class="loader-progress-bar"></div>
      </div>
    </div>
  `;

  const text = target.querySelector(".inline-loader-text");
  const bar = target.querySelector(".loader-progress-bar");

  const startedAt = Date.now();
  const stepDuration = minDuration / lines.length;

  const animationPromise = (async () => {
    for (let i = 0; i < lines.length; i++) {
      text.textContent = lines[i];

      bar.style.width =
        `${Math.round(((i + 1) / lines.length) * 100)}%`;

      await sleep(stepDuration);
    }
  })();

  const response = await requestPromise;

  const elapsed = Date.now() - startedAt;
  const remaining = Math.max(0, minDuration - elapsed);

  await Promise.all([
    animationPromise,
    sleep(remaining)
  ]);

  target.innerHTML = "";

  return response;
}

function showSparks(targetId) {
  const target = $(targetId);
  const sparks = document.createElement("div");
  sparks.className = "gold-sparks";

  for (let i = 0; i < 18; i++) {
    const spark = document.createElement("span");
    spark.className = "gold-spark";

    spark.style.left = `${45 + Math.random() * 10}%`;
    spark.style.top = `${45 + Math.random() * 10}%`;
    spark.style.setProperty("--x", `${-90 + Math.random() * 180}px`);
    spark.style.setProperty("--y", `${-70 + Math.random() * 140}px`);
    spark.style.animationDelay = `${Math.random() * .15}s`;

    sparks.appendChild(spark);
  }

  target.appendChild(sparks);

  setTimeout(() => sparks.remove(), 900);
}

function validatePlayers(players) {
  if (players.length !== REQUIRED_PLAYERS) {
    return `Нужно ровно ${REQUIRED_PLAYERS} участников. Сейчас найдено: ${players.length}.`;
  }

  const names = players.map(p => p.name.trim().toLowerCase());
  const duplicates = names.filter((name, index) => names.indexOf(name) !== index);

  if (duplicates.length > 0) {
    return "Есть повторяющиеся имена. Проверь таблицу.";
  }

  return null;
}

function getPairsForGame(game) {
  return state.pairs.filter(p => Number(p.game) === Number(game));
}

function hasGame(game) {
  return getPairsForGame(game).length > 0;
}

function canGenerateGame(game) {
  if (!state.groups.length) return false;
  if (hasGame(game)) return false;
  if (game === 1) return true;
  if (game === 2) return hasGame(1);
  if (game === 3) return hasGame(1) && hasGame(2);
  return false;
}

function renderPlayers() {
  if (!state.players.length) {
    $("playersBox").innerHTML = "";
    return;
  }

  $("playersBox").innerHTML = `
    <div class="compact-block">
      <h3>Участники</h3>
      <div class="compact-list">
        ${state.players.map((p, i) => `
          <div class="compact-chip reveal-card" style="animation-delay:${i * 80}ms">
            <span>${i + 1}</span>
            <b>${p.name}</b>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

function renderGroups() {
  if (!state.groups.length) {
    $("groupsBox").innerHTML = "";
    return;
  }

  const groupA = state.groups.filter(p => p.group === "A");
  const groupB = state.groups.filter(p => p.group === "B");

  $("groupsBox").innerHTML = `
    <div class="compact-block">
      <h3>Группы</h3>
      <div class="compact-groups">
        <div>
          <h4>Group A</h4>
          ${groupA.map((p, i) => `
            <div class="compact-chip reveal-card" style="animation-delay:${i * 90}ms">
              <b>${p.name}</b>
            </div>
          `).join("")}
        </div>
        <div>
          <h4>Group B</h4>
          ${groupB.map((p, i) => `
            <div class="compact-chip reveal-card" style="animation-delay:${(i + 3) * 90}ms">
              <b>${p.name}</b>
            </div>
          `).join("")}
        </div>
      </div>
    </div>
  `;
}

function renderPairs() {
  const pairs = getPairsForGame(selectedGame);

  if (!pairs.length) {
    $("pairsBox").innerHTML = "";
    return;
  }

  $("pairsBox").innerHTML = `
    <div class="pairs-compact-list">
      ${pairs.map((pair, i) => `
       <div class="pair-compact-card reveal-card" style="animation-delay:${i * 650}ms">
          <span>Пара ${i + 1}</span>
          <b>${pair.player1}</b>
          <em>+</em>
          <b>${pair.player2}</b>
        </div>
      `).join("")}
    </div>
  `;
}

function renderGamePanel() {
  $("gameNumber").textContent = `0${selectedGame + 1}`;
  $("gameTitle").textContent = `Пары · Игра ${selectedGame}`;
  $("generatePairsBtn").textContent = `Сформировать пары для игры ${selectedGame} →`;

  const pairs = getPairsForGame(selectedGame);

  if (!state.groups.length) {
    $("gameStatus").textContent = "Сначала загрузи результаты и создай группы.";
    $("generatePairsBtn").disabled = true;
  } else if (pairs.length) {
    $("gameStatus").textContent = `Пары для игры ${selectedGame} уже сохранены.`;
    $("generatePairsBtn").disabled = true;
  } else if (selectedGame === 2 && !hasGame(1)) {
    $("gameStatus").textContent = "Сначала нужно сформировать пары для игры 1.";
    $("generatePairsBtn").disabled = true;
  } else if (selectedGame === 3 && !hasGame(2)) {
    $("gameStatus").textContent = "Сначала нужно сформировать пары для игры 2.";
    $("generatePairsBtn").disabled = true;
  } else {
    $("gameStatus").textContent = "Готово к запуску протокола формирования пар.";
    $("generatePairsBtn").disabled = false;
  }

  renderPairs();
}

function renderAll() {
  const validationError = validatePlayers(state.players);

  if (!state.players.length) {
    $("leftStatus").textContent = "Результаты ещё не загружены.";
  } else if (validationError) {
    $("leftStatus").textContent = validationError;
  } else if (!state.groups.length) {
    $("leftStatus").textContent = "Участники загружены. Можно создать группы.";
  } else {
    $("leftStatus").textContent = "Группы сохранены. Можно формировать пары.";
  }

  renderPlayers();
  renderGroups();

  $("createGroupsBtn").classList.toggle(
    "hidden",
    !state.players.length || Boolean(validationError) || Boolean(state.groups.length)
  );

  renderGamePanel();
}

async function loadAdminState() {
  const response = await runLoader(
    "playersBox",
    jsonp("getAdminState", { source: currentSource }),
    [
      "Подключаемся к таблице...",
      "Считываем результаты...",
      "Проверяем 6 участников...",
      "Восстанавливаем группы и пары..."
    ],
    3000
  );

  if (!response.ok) {
    $("leftStatus").textContent = response.error || "Не удалось загрузить данные.";
    return;
  }

  state.players = response.players || [];
  state.groups = response.groups || [];
  state.pairs = response.pairs || [];

  renderAll();
}

async function createGroups() {
  const response = await runLoader(
    "groupsBox",
    jsonp("createGroups", { source: currentSource }),
    [
      "Считываем результаты тестирования...",
      "Ищем закономерности...",
      "Анализируем совместимость...",
      "Балансируем состав...",
      "Формируем экспериментальные группы..."
    ],
    6000
  );

  if (!response.ok) {
    $("leftStatus").textContent = response.error || "Ошибка создания групп.";
    return;
  }

  state.groups = response.groups || [];
  renderAll();
  showSparks("groupsBox");
}

async function generatePairs() {
  if (!canGenerateGame(selectedGame)) {
    renderGamePanel();
    return;
  }

  const response = await runLoader(
    "pairsBox",
    jsonp("generatePairs", {
      source: currentSource,
      game: selectedGame
    }),
    [
      "Проверяем предыдущие встречи...",
      "Исключаем повторения...",
      "Ищем оптимальные сочетания...",
      "Анализируем совместимость...",
      "Проводим финальную проверку...",
      "Утверждаем протокол..."
    ],
    7000
  );

  if (!response.ok) {
    $("gameStatus").textContent = response.error || "Ошибка генерации.";
    return;
  }

  state.groups = response.groups || state.groups;
  state.pairs = response.pairs || [];

  renderGamePanel();
  showSparks("pairsBox");
}

async function seedSandbox() {
  await runLoader("playersBox", [
    "Открываем sandbox...",
    "Очищаем старые тестовые данные...",
    "Генерируем 6 фиктивных участников...",
    "Заполняем случайные ответы...",
    "Сохраняем sandbox-протокол..."
  ], 700);

  const response = await jsonp("seedSandbox");

  if (!response.ok) {
    $("leftStatus").textContent = response.error || "Sandbox не заполнен.";
    return;
  }

  currentSource = "sandbox";
  document.querySelectorAll(".source-btn").forEach(b => b.classList.remove("active"));
  document.querySelector('[data-source="sandbox"]').classList.add("active");

  await loadAdminState();
}

async function resetCurrentSource() {
  await runLoader("playersBox", [
    "Сбрасываем группы...",
    "Удаляем историю пар...",
    "Возвращаем протокол в начальное состояние..."
  ], 650);

  const response = await jsonp("resetAdminState", {
    source: currentSource
  });

  if (!response.ok) {
    $("leftStatus").textContent = response.error || "Ошибка сброса.";
    return;
  }

  state = {
    players: [],
    groups: [],
    pairs: []
  };

  renderAll();
}

async function checkAdminPassword(password) {
  const response = await jsonp("checkAdminPassword", { password });
  return response.ok === true;
}

$("adminUnlockBtn").onclick = async () => {
  $("adminErrorText").classList.add("hidden");
  $("adminUnlockBtn").textContent = "Проверяем...";
  $("adminUnlockBtn").disabled = true;

  const ok = await checkAdminPassword($("adminCodeInput").value);

  $("adminUnlockBtn").textContent = "Открыть админ-панель →";
  $("adminUnlockBtn").disabled = false;

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

document.querySelectorAll(".source-btn").forEach(button => {
  button.onclick = async () => {
    document.querySelectorAll(".source-btn").forEach(b => b.classList.remove("active"));
    button.classList.add("active");

    currentSource = button.dataset.source;
    selectedGame = 1;

    document.querySelectorAll(".game-tab").forEach(b => b.classList.remove("active"));
    document.querySelector('[data-game="1"]').classList.add("active");

    state = {
      players: [],
      groups: [],
      pairs: []
    };

    renderAll();
  };
});

document.querySelectorAll(".game-tab").forEach(button => {
  button.onclick = () => {
    document.querySelectorAll(".game-tab").forEach(b => b.classList.remove("active"));
    button.classList.add("active");

    selectedGame = Number(button.dataset.game);
    renderGamePanel();
  };
});

$("loadBtn").onclick = loadAdminState;
$("seedBtn").onclick = seedSandbox;
$("resetBtn").onclick = resetCurrentSource;
$("createGroupsBtn").onclick = createGroups;
$("generatePairsBtn").onclick = generatePairs;

renderAll();
