const SHEETS_URL = "https://script.google.com/macros/s/AKfycbybdZ7saSVOPyAm5TdZP0qz1eFQg_wJO_-eAV3J8PnKfqecP8PCktjeUNWUMP7wWkc/exec";

const questions = [
  {
    text: "Какой твой овощ сегодня?",
    sub: "Выбери тот, который максимально про тебя прямо сейчас.",
    options: [
      ["potato", "🥔", "Картошка", "стабильный, надёжный"],
      ["cucumber", "🥒", "Огурец", "свежий, немного растерянный"],
      ["tomato", "🍅", "Помидор", "яркий, эмоциональный"],
      ["carrot", "🥕", "Морковь", "полезный, всегда в деле"],
      ["onion", "🧅", "Лук", "сложный, но тебя понимают"],
      ["eggplant", "🍆", "Баклажан", "немного загадочный, немного хаос"],
    ],
  },
  {
    text: "Твой напарник упал с моста. Что делаешь?",
    sub: "Научный вопрос о командной работе.",
    options: [
      ["hero", "🛟", "Спасаю", "без лишних вопросов"],
      ["laugh", "📸", "Сначала скрин", "потом спасаю"],
      ["fall", "🫡", "Прыгаю следом", "мы команда"],
      ["advice", "📢", "Даю советы", "очень полезные"],
      ["panic", "🧯", "Паникую", "но с любовью"],
      ["loot", "🎒", "Подбираю вещи", "практичный подход"],
    ],
  },
  {
    text: "Что важнее в походе?",
    sub: "Выживание — это состояние души.",
    options: [
      ["food", "🍖", "Еда", "без неё нет морали"],
      ["rope", "🪢", "Верёвка", "план звучит безопасно"],
      ["vibes", "✨", "Вайб", "остальное приложится"],
      ["map", "🗺️", "Карта", "куда мы вообще идём"],
      ["chaos", "💥", "Хаос", "так интереснее"],
      ["friend", "🤝", "Бро", "главный ресурс"],
    ],
  },
  {
    text: "Тебе дали секретное задание.",
    sub: "Твоя первая реакция?",
    options: [
      ["silent", "🤐", "Молчу", "как профессионал"],
      [
        "suspicious",
        "🕵️",
        "Выгляжу подозрительно",
        "ничего не могу с собой сделать",
      ],
      ["overplay", "🎭", "Переигрываю", "но красиво"],
      ["forget", "🧠", "Забываю", "и вспоминаю в панике"],
      ["optimize", "📋", "Строю план", "табличка уже готова"],
      ["betray", "😈", "Ищу возможность", "чисто теоретически"],
    ],
  },
  {
    text: "Твой стиль игры?",
    sub: "Важный параметр совместимости.",
    options: [
      ["support", "🩹", "Саппорт", "держу всех живыми"],
      ["leader", "🧭", "Лидер", "идём сюда, я сказал"],
      ["gremlin", "🧃", "Гремлин", "нашёл странную штуку"],
      ["tryhard", "🏆", "Трайхард", "очки сами себя не заработают"],
      ["cozy", "🧸", "Уютный игрок", "мне бы домик построить"],
      ["agent", "🕶️", "Агент хаоса", "случайно получилось"],
    ],
  },
  {
    text: "Что ты скажешь перед опасным прыжком?",
    sub: "Последние слова перед клипом.",
    options: [
      ["fine", "👍", "Да нормально", "не нормально"],
      ["science", "🔬", "Проверим механику", "на себе"],
      ["watch", "👀", "Смотрите щас", "и все смотрят"],
      ["sorry", "🙏", "Простите заранее", "мудро"],
      ["nope", "🚪", "Я не пойду", "самосохранение"],
      ["bro", "💛", "Бро, верь мне", "сомнительно, но мило"],
    ],
  },
  {
    text: "Идеальный вечер после ивента?",
    sub: "Восстановление морального урона.",
    options: [
      ["sleep", "🌙", "Спать", "без комментариев"],
      ["montage", "🎬", "Смотреть клипы", "и орать"],
      ["food", "🍕", "Есть", "много"],
      ["analysis", "📊", "Разбирать баллы", "это важно"],
      ["again", "🔁", "Ещё катку", "мы не учимся"],
      ["chat", "💬", "Болтать", "ещё часик"],
    ],
  },
  {
    text: "Кто ты в команде?",
    sub: "Официальная самодиагностика.",
    options: [
      ["shield", "🛡️", "Щит", "всех прикрою"],
      ["spark", "⚡", "Искра", "заведу движ"],
      ["brain", "🧠", "Мозг", "план есть"],
      ["heart", "💖", "Сердце", "поддержу морально"],
      ["curse", "🧿", "Проклятие", "но любимое"],
      ["camera", "📷", "Оператор", "контент важнее"],
    ],
  },
  {
    text: "Если можно предать напарника за бонус…",
    sub: "Честность приветствуется, но не гарантируется.",
    options: [
      ["never", "😇", "Никогда", "я святой"],
      ["maybe", "🤏", "Смотря какой бонус", "я не железный"],
      ["dramatic", "🎭", "Только драматично", "ради сюжета"],
      ["accident", "🙃", "Скажу, что случайно", "классика"],
      ["deal", "🤝", "Договорюсь", "и всё равно страшно"],
      ["first", "🏃", "Предам первым", "самозащита"],
    ],
  },
  {
    text: "Финальный выбор: что делает бро идеальным?",
    sub: "Главный вопрос отдела совместимости.",
    options: [
      ["trust", "🤝", "Доверие", "даже когда страшно"],
      ["fun", "😂", "Смех", "особенно в провале"],
      ["skill", "🏅", "Скилл", "но без токсика"],
      ["loyal", "🐕", "Лояльность", "не бросит в тумане"],
      ["chaos", "🔥", "Общий хаос", "одна волна"],
      ["snack", "🍪", "Снэки", "очевидно"],
    ],
  },
];
let state = {
  name: "",
  index: 0,
  answers: [],
};
const $ = (id) => document.getElementById(id);
function checkPasswordViaJsonp(password) {
  return new Promise((resolve, reject) => {
    const callbackName = "idealbroCallback_" + Date.now();

    window[callbackName] = (response) => {
      delete window[callbackName];
      script.remove();
      resolve(response.ok === true);
    };

    const script = document.createElement("script");
    const url =
      SHEETS_URL +
      "?action=checkPassword" +
      "&password=" + encodeURIComponent(password) +
      "&callback=" + callbackName;

    script.src = url;
    script.onerror = reject;
    document.body.appendChild(script);
  });
}

$("testUnlockBtn").onclick = async () => {
  const password = $("testCodeInput").value.trim();

  $("testErrorText").classList.add("hidden");
  $("testUnlockBtn").textContent = "Проверяем...";

  const ok = await checkPasswordViaJsonp(password);

  if (!ok) {
    $("testErrorText").classList.remove("hidden");
    $("testUnlockBtn").textContent = "Открыть тест →";
    return;
  }

  sessionStorage.setItem("idealbro-test-unlocked", "yes");
  $("testLockScreen").classList.add("hidden");
  $("startScreen").classList.remove("hidden");
  $("testUnlockBtn").textContent = "Открыть тест →";
};

$("testCodeInput").addEventListener("keydown", (e) => {
  if (e.key === "Enter") $("testUnlockBtn").click();
});

if (sessionStorage.getItem("idealbro-test-unlocked") === "yes") {
  $("testLockScreen").classList.add("hidden");
  $("startScreen").classList.remove("hidden");
}
$("startBtn").onclick = () => {
  const name = $("playerName").value.trim();
  if (!name) {
    $("playerName").focus();
    return;
  }
  state.name = name;
  $("startScreen").classList.add("hidden");
  $("questionScreen").classList.remove("hidden");
  renderQuestion();
};
function renderQuestion() {
  const q = questions[state.index];
  $("counter").textContent =
    `Вопрос ${String(state.index + 1).padStart(2, "0")} / ${questions.length}`;
  $("progressBar").style.width =
    `${((state.index + 1) / questions.length) * 100}%`;
  $("questionText").textContent = q.text;
  $("questionSub").textContent = q.sub;
  $("options").innerHTML = "";
  q.options.forEach((opt) => {
    const btn = document.createElement("button");
    btn.className =
      "option" +
      (state.answers[state.index]?.value === opt[0] ? " selected" : "");
    btn.innerHTML = `<div class="emoji">${opt[1]}</div><strong>${opt[2]}</strong><span>${opt[3]}</span>`;
    btn.onclick = () => {
      state.answers[state.index] = {
        question: q.text,
        value: opt[0],
        title: opt[2],
        note: opt[3],
      };
      renderQuestion();
    };
    $("options").appendChild(btn);
  });
  $("backBtn").style.visibility = state.index === 0 ? "hidden" : "visible";
  $("nextBtn").textContent =
    state.index === questions.length - 1 ? "Завершить →" : "Далее →";
}
$("backBtn").onclick = () => {
  if (state.index > 0) {
    state.index--;
    renderQuestion();
  }
};
$("nextBtn").onclick = () => {
  if (!state.answers[state.index]) return;
  if (state.index < questions.length - 1) {
    state.index++;
    renderQuestion();
  } else showResult();
};
async function showResult(){
  $("questionScreen").classList.add("hidden");
  $("resultScreen").classList.remove("hidden");

  const result = {
    player: state.name,
    date: new Date().toISOString(),
    answers: state.answers
  };

  localStorage.setItem(
    "idealbro-test-result",
    JSON.stringify(result)
  );

  $("resultTitle").textContent = "Отправляем протокол...";
  $("resultText").textContent = "Секунду, бро.";

  try {
    await fetch(SHEETS_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain"
      },
      body: JSON.stringify(result)
    });

    $("resultTitle").textContent = "Протокол составлен";
    $("resultText").textContent =
      `${state.name}, твои ответы приняты. Наука сделала своё дело.`;

  } catch (error) {
    $("resultTitle").textContent = "Что-то пошло не так";
    $("resultText").textContent =
      "Ответы не отправились. Позови организатора.";
  }
}
$("restartBtn").onclick = () => {
  state = {
    name: "",
    index: 0,
    answers: [],
  };
  $("playerName").value = "";
  $("resultScreen").classList.add("hidden");
  $("startScreen").classList.remove("hidden");
};
