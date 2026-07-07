// ========================================
// РАСПИСАНИЕ ИВЕНТА
// ПОТОМ МЕНЯЕШЬ ТОЛЬКО ЭТИ ДАТЫ
// ========================================

const EVENT_DAYS = [
  {
    day: 1,
    date: new Date("2026-10-15T18:00:00"),
    title: "ПЕРВЫЙ ЭТАП"
  },
  {
    day: 2,
    date: new Date("2026-10-16T18:00:00"),
    title: "ВТОРОЙ ЭТАП"
  },
  {
    day: 3,
    date: new Date("2026-10-17T18:00:00"),
    title: "ФИНАЛЬНЫЙ ЭТАП"
  }
];

// Сколько часов считаем этап активным после начала стрима
const STAGE_DURATION_HOURS = 6;

const $ = (id) => document.getElementById(id);

function pad(value) {
  return String(value).padStart(2, "0");
}

function setTime(days, hours, minutes) {
  $("days").textContent = pad(days);
  $("hours").textContent = pad(hours);
  $("minutes").textContent = pad(minutes);
}

function showCountdown(targetDate, title, note, status) {
  const now = new Date();
  const difference = targetDate - now;

  const days = Math.floor(difference / 86400000);
  const hours = Math.floor((difference / 3600000) % 24);
  const minutes = Math.floor((difference / 60000) % 60);

  setTime(days, hours, minutes);

  $("countdownTitle").textContent = title;
  $("countdownNote").textContent = note;

  $("countdownStatus").innerHTML = `
    <span class="status-dot"></span>
    ${status}
  `;
}

function showActiveStage(stage) {
  setTime(stage.day, EVENT_DAYS.length, 0);

  $("countdownTitle").textContent =
    `ДЕНЬ ${pad(stage.day)} / ${pad(EVENT_DAYS.length)}`;

  $("countdownNote").textContent = stage.title;

  $("countdownStatus").innerHTML = `
    <span class="status-dot"></span>
    ЭТАП ${pad(stage.day)} АКТИВЕН
  `;
}

function showFinished() {
  setTime(0, 0, 0);

  $("countdownTitle").textContent = "ЭКСПЕРИМЕНТ ЗАВЕРШЁН";

  $("countdownNote").textContent =
    "Финальный протокол сформирован";

  $("countdownStatus").innerHTML = `
    <span class="status-dot"></span>
    ОБРАБОТКА РЕЗУЛЬТАТОВ ЗАВЕРШЕНА
  `;
}

function updateCountdown() {
  const now = new Date();

  const firstStage = EVENT_DAYS[0];

  // ДО НАЧАЛА ИВЕНТА
  if (now < firstStage.date) {
    showCountdown(
      firstStage.date,
      "ДО НАЧАЛА ЭКСПЕРИМЕНТА",
      firstStage.date.toLocaleString("ru-RU", {
        day: "numeric",
        month: "long",
        hour: "2-digit",
        minute: "2-digit"
      }),
      "СИСТЕМА В РЕЖИМЕ ОЖИДАНИЯ"
    );

    return;
  }

  // ДНИ ИВЕНТА
  for (let i = 0; i < EVENT_DAYS.length; i++) {
    const stage = EVENT_DAYS[i];

    const stageEnd = new Date(
      stage.date.getTime() +
      STAGE_DURATION_HOURS * 60 * 60 * 1000
    );

    // СТРИМ ИДЁТ
    if (now >= stage.date && now < stageEnd) {
      showActiveStage(stage);
      return;
    }

    // ЖДЁМ СЛЕДУЮЩИЙ ДЕНЬ
    const nextStage = EVENT_DAYS[i + 1];

    if (
      nextStage &&
      now >= stageEnd &&
      now < nextStage.date
    ) {
      showCountdown(
        nextStage.date,
        `ДЕНЬ ${pad(nextStage.day)} / ${pad(EVENT_DAYS.length)}`,
        `До начала: ${nextStage.title.toLowerCase()}`,
        "ОЖИДАНИЕ СЛЕДУЮЩЕГО ЭТАПА"
      );

      return;
    }
  }

  // ИВЕНТ ЗАКОНЧИЛСЯ
  showFinished();
}

updateCountdown();

setInterval(updateCountdown, 1000);
