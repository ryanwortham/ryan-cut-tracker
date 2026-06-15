const START_WEIGHT = 265;
const GOAL_WEIGHT = 220;
const TARGET_DATE = "2026-10-01";
const STORAGE_KEY = "ryan-cut-tracker-v1";
const PRIVACY_UNLOCK_KEY = "ryan-cut-tracker-privacy-unlocked";
const PRIVACY_UNLOCK_PHRASE = "RYAN";

const DEFAULT_SETTINGS = {
  startWeight: START_WEIGHT,
  goalWeight: GOAL_WEIGHT,
  goalDate: TARGET_DATE,
  proteinTarget: "250-260g",
  stepTarget: 10000,
  cardioTarget: 30,
  trainingCalories: "2,550-2,750",
  restCalories: "2,300-2,450",
};

const habits = [
  { key: "workout", label: "Workout completed", points: 1 },
  { key: "cardio1", label: "Cardio session 1", points: 1 },
  { key: "cardio2", label: "Cardio session 2", points: 1 },
  { key: "steps10000", label: "10,000+ steps", points: 1, derived: true },
  { key: "protein", label: "Protein goal completed", points: 1 },
  { key: "caloriesTracked", label: "Calories tracked in 1st Phorm", points: 1 },
  { key: "water", label: "Water goal completed", points: 1 },
  { key: "sleep7", label: "Sleep 7+ hours", points: 1, derived: true },
  { key: "sauna", label: "Sauna completed", points: 0.5, bonus: true },
  { key: "coldPlunge", label: "Cold plunge completed", points: 0.5, bonus: true },
];

const els = {};
let state = { entries: {} };

const workoutPlan = [
  {
    day: "Monday",
    title: "Chest / Triceps + cardio",
    exercises: [
      ["Barbell bench press", "4", "6-8"],
      ["Incline dumbbell press", "3", "8-10"],
      ["Machine chest press", "3", "10-12"],
      ["Cable fly", "3", "12-15"],
      ["Rope triceps pressdown", "3", "10-12"],
      ["Overhead triceps extension", "3", "12-15"],
      ["Cardio", "1", "30-45 min"],
    ],
  },
  {
    day: "Tuesday",
    title: "Legs + cardio",
    exercises: [
      ["Back squat or leg press", "4", "6-10"],
      ["Romanian deadlift", "3", "8-10"],
      ["Walking lunge", "3", "10/leg"],
      ["Leg curl", "3", "10-12"],
      ["Leg extension", "3", "12-15"],
      ["Standing calf raise", "4", "12-15"],
      ["Cardio", "1", "25-40 min"],
    ],
  },
  {
    day: "Wednesday",
    title: "Walk + abs",
    exercises: [
      ["Incline walk or outdoor walk", "1", "45-60 min"],
      ["Cable crunch", "3", "12-15"],
      ["Hanging knee raise", "3", "10-15"],
      ["Plank", "3", "45-60 sec"],
      ["Pallof press", "3", "12/side"],
    ],
  },
  {
    day: "Thursday",
    title: "Back / Biceps + cardio",
    exercises: [
      ["Lat pulldown or pull-up", "4", "8-10"],
      ["Chest-supported row", "3", "8-10"],
      ["Seated cable row", "3", "10-12"],
      ["Rear delt fly", "3", "12-15"],
      ["Dumbbell curl", "3", "10-12"],
      ["Hammer curl", "3", "10-12"],
      ["Cardio", "1", "30-45 min"],
    ],
  },
  {
    day: "Friday",
    title: "Shoulders / Arms + cardio",
    exercises: [
      ["Seated shoulder press", "4", "6-10"],
      ["Lateral raise", "4", "12-15"],
      ["Rear delt cable fly", "3", "12-15"],
      ["EZ-bar curl", "3", "8-12"],
      ["Skull crusher or cable extension", "3", "8-12"],
      ["Superset curl + pressdown", "3", "12 each"],
      ["Cardio", "1", "30-45 min"],
    ],
  },
  {
    day: "Saturday",
    title: "Long walk / recovery",
    exercises: [
      ["Long walk", "1", "60-90 min"],
      ["Mobility flow", "1", "10-15 min"],
      ["Stretch hips, hamstrings, chest", "1", "10 min"],
      ["Meal prep check", "1", "15 min"],
    ],
  },
  {
    day: "Sunday",
    title: "Rest / Recovery",
    exercises: [
      ["Easy walk", "1", "20-30 min"],
      ["Light stretching", "1", "10 min"],
      ["Plan training week", "1", "10 min"],
      ["Prep food and schedule cardio", "1", "20 min"],
    ],
  },
];

const mealPlan = [
  ["Monday", "Egg whites, oats, berries", "Chicken rice bowl", "Greek yogurt + protein", "Lean beef, potato, vegetables"],
  ["Tuesday", "Protein shake, banana, eggs", "Turkey wrap + salad", "Cottage cheese + berries", "Chicken, rice, green beans"],
  ["Wednesday", "Greek yogurt protein bowl", "Chicken salad", "Protein shake", "Salmon or lean beef, vegetables"],
  ["Thursday", "Egg whites, oats", "Lean beef rice bowl", "Greek yogurt", "Chicken, potato, salad"],
  ["Friday", "Protein shake + eggs", "Turkey or chicken wrap", "Protein bar or yogurt", "Lean steak, rice, vegetables"],
  ["Saturday", "Egg scramble + fruit", "Chicken bowl", "Protein shake", "Burger bowl, potatoes, salad"],
  ["Sunday", "Greek yogurt + protein", "Chicken salad", "Cottage cheese", "Lean protein, vegetables, measured carbs"],
];

const temptationOptions = [
  ["pizzaBite", "Random pizza bite"],
  ["breadstick", "Breadstick"],
  ["cheesyBread", "Cheesy bread"],
  ["soda", "Soda/sugary drink"],
  ["dessert", "Dessert"],
  ["leftovers", "Employee leftovers"],
];

const mealOptions = {
  breakfast: ["Eggs + oatmeal", "Protein shake + banana", "Greek yogurt bowl"],
  lunch: ["Double chicken salad", "Pizza bowl", "Wings + salad", "Sub bowl, no bread"],
  dinner: ["Steak + vegetables", "Chicken + rice", "Fish + sweet potato", "Lean turkey bowl"],
  snacks: ["Protein shake", "Greek yogurt", "Cottage cheese", "Beef jerky"],
};

const supplementDefaults = [
  "Testosterone taken as prescribed",
  "Peptide taken as prescribed",
  "Creatine - personal preset",
  "Whey protein",
  "Fish oil",
  "Multivitamin",
  "Electrolytes",
  "Vitamin D if used",
  "Pre-workout or caffeine",
];

const measurementFields = [
  ["waist", "Waist at belly button"],
  ["chest", "Chest"],
  ["arms", "Arms"],
  ["thighs", "Thighs"],
  ["neck", "Neck"],
];

const pictureTypes = [
  ["front", "Front"],
  ["side", "Side"],
  ["back", "Back"],
];

function $(id) {
  return document.getElementById(id);
}

function todayKey() {
  return toDateKey(new Date());
}

function toDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDate(key) {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function addDays(key, days) {
  const date = parseDate(key);
  date.setDate(date.getDate() + days);
  return toDateKey(date);
}

function formatDate(key, options = { month: "short", day: "numeric" }) {
  return parseDate(key).toLocaleDateString(undefined, options);
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved && saved.entries) state = saved;
  } catch {
    state = { entries: {} };
  }
  state.entries ||= {};
  state.customSupplements ||= [];
  state.measurements ||= {};
  state.progressPictures ||= {};
  state.settings = { ...DEFAULT_SETTINGS, ...(state.settings || {}) };
}

function showSaveStatus(message = "Saved locally", tone = "") {
  [els.saveState, els.dataStatus, els.progressStatus].filter(Boolean).forEach((node) => {
    node.textContent = message;
    node.classList.remove("status-good", "status-warn", "status-bad");
    if (tone) node.classList.add(tone);
  });
}

function saveState(message = "Saved locally") {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  showSaveStatus(message, "status-good");
  window.clearTimeout(saveState._timer);
  saveState._timer = window.setTimeout(() => {
    showSaveStatus("Auto-saved locally on this device", "");
  }, 1200);
}

function validDateKey(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value || ""))) return false;
  const parsed = parseDate(value);
  return !Number.isNaN(parsed.getTime()) && toDateKey(parsed) === value;
}

function positiveNumber(value) {
  const num = Number(value);
  return Number.isFinite(num) && num > 0;
}

function validateSettingValue(settingKey, raw) {
  if (["startWeight", "goalWeight", "stepTarget", "cardioTarget"].includes(settingKey)) {
    return positiveNumber(raw);
  }
  if (settingKey === "goalDate") return validDateKey(raw);
  if (["proteinTarget", "trainingCalories", "restCalories"].includes(settingKey)) return String(raw || "").trim().length > 0;
  return true;
}

function validateImportedState(imported) {
  if (!imported || typeof imported !== "object" || !imported.entries || typeof imported.entries !== "object") {
    throw new Error("Missing tracker entries");
  }
  if (imported.settings) {
    const merged = { ...DEFAULT_SETTINGS, ...imported.settings };
    Object.entries(merged).forEach(([key, value]) => {
      if (!validateSettingValue(key, value)) throw new Error(`Invalid setting: ${key}`);
    });
  }
  imported.customSupplements ||= [];
  imported.measurements ||= {};
  imported.progressPictures ||= {};
  imported.settings = { ...DEFAULT_SETTINGS, ...(imported.settings || {}) };
  return imported;
}

function currentEntry() {
  const key = els.entryDate.value || todayKey();
  state.entries[key] ||= {};
  return state.entries[key];
}

function settings() {
  state.settings ||= { ...DEFAULT_SETTINGS };
  return state.settings;
}

function scoreBreakdown(entry) {
  const hasData = hasEntryData(entry);
  const temptationCount = countViolations(entry);
  const cleanConfirmed = Boolean(entry.cleanDayConfirmed) && temptationCount === 0;
  const noSoda = hasData && cleanConfirmed && entry.noSoda !== false && !entry.temptations?.soda;
  const noGrazing = hasData && cleanConfirmed && entry.noPizzaGrazing !== false;
  const main =
    (entry.workout ? 1 : 0) +
    (entry.cardio1 ? 1 : 0) +
    (entry.cardio2 ? 1 : 0) +
    (Number(entry.steps) >= Number(settings().stepTarget) ? 1 : 0) +
    (entry.protein ? 1 : 0) +
    (entry.caloriesTracked ? 1 : 0) +
    (entry.water ? 1 : 0) +
    (noGrazing ? 1 : 0) +
    (noSoda ? 1 : 0) +
    (Number(entry.sleep) >= 7 ? 1 : 0);

  const bonus =
    (entry.sauna ? 0.5 : 0) +
    (entry.coldPlunge ? 0.5 : 0) +
    (Number(entry.steps) >= 15000 ? 1 : Number(entry.steps) >= 12500 ? 0.5 : 0);

  return { main, bonus, total: main + bonus };
}

function recoveryScore(entry) {
  return (entry.sauna ? 1 : 0) + (entry.coldPlunge ? 1 : 0) + (Number(entry.sleep) >= 7 ? 1 : 0) + (entry.water ? 1 : 0);
}

function scoreEntry(entry) {
  return scoreBreakdown(entry).main;
}

function formatScore(value) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function countViolations(entry) {
  return Object.values(entry.temptations || {}).filter(Boolean).length;
}

function selectedWeekKey() {
  return startOfWeek(els.entryDate.value || todayKey());
}

function entriesSorted() {
  return Object.entries(state.entries)
    .filter(([, entry]) => hasEntryData(entry))
    .sort(([a], [b]) => a.localeCompare(b));
}

function hasEntryData(entry) {
  return Object.values(entry).some((value) => {
    if (value === "" || value === false || value == null) return false;
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === "object") return Object.values(value).some((nested) => nested !== "" && nested !== false && nested != null);
    return true;
  });
}

function entriesThrough(key) {
  return entriesSorted().filter(([date]) => date <= key);
}

function lastWeightEntry() {
  return [...entriesSorted()].reverse().find(([, entry]) => Number(entry.weight) > 0);
}

function average(values) {
  const clean = values.filter((value) => Number.isFinite(value));
  if (!clean.length) return null;
  return clean.reduce((sum, value) => sum + value, 0) / clean.length;
}

function lastNDays(key, days) {
  const dayKeys = Array.from({ length: days }, (_, index) => addDays(key, index - days + 1));
  return dayKeys.map((dayKey) => [dayKey, state.entries[dayKey] || {}]);
}

function sevenDayAverage(key) {
  return average(lastNDays(key, 7).map(([, entry]) => Number(entry.weight)).filter(Boolean));
}

function weeklyWeightLossEnding(key) {
  const currentAvg = sevenDayAverage(key);
  const previousAvg = sevenDayAverage(addDays(key, -7));
  if (!currentAvg || !previousAvg) return null;
  return previousAvg - currentAvg;
}

function weeklyStats(key) {
  const days = lastNDays(key, 7);
  const scores = days.map(([, entry]) => (hasEntryData(entry) ? scoreBreakdown(entry).main : null));
  const loggedDays = scores.filter((score) => score != null).length;
  const cardio = days.reduce((sum, [, entry]) => sum + (entry.cardio1 ? 1 : 0) + (entry.cardio2 ? 1 : 0), 0);
  const stepValues = days.map(([, entry]) => Number(entry.steps)).filter(Boolean);
  const steps = average(stepValues) || 0;
  const totalSteps = stepValues.reduce((sum, value) => sum + value, 0);
  const violations = days.reduce((sum, [, entry]) => sum + countViolations(entry), 0);
  const noGrazing = days.filter(([, entry]) => hasEntryData(entry) && entry.cleanDayConfirmed && countViolations(entry) === 0).length;
  const compliance = loggedDays ? Math.round((scores.reduce((sum, score) => sum + (score || 0), 0) / (loggedDays * 10)) * 100) : null;
  return {
    averageWeight: sevenDayAverage(key),
    averageScore: average(scores) || 0,
    cardio,
    steps,
    totalSteps,
    noGrazing,
    violations,
    compliance,
    loggedDays,
    weightLoss: weeklyWeightLossEnding(key),
  };
}

function scoreStreak(key) {
  let streak = 0;
  let cursor = key;
  while (state.entries[cursor] && scoreEntry(state.entries[cursor]) >= 8) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

function projectedGoalDate() {
  const weighted = entriesSorted().filter(([, entry]) => Number(entry.weight) > 0);
  if (weighted.length < 2) return null;
  const recent = weighted.slice(-21);
  const first = recent[0];
  const last = recent[recent.length - 1];
  const days = Math.max(1, (parseDate(last[0]) - parseDate(first[0])) / 86400000);
  const lossRate = (Number(first[1].weight) - Number(last[1].weight)) / days;
  if (lossRate <= 0) return null;
  const remaining = Number(last[1].weight) - settings().goalWeight;
  const projected = parseDate(last[0]);
  projected.setDate(projected.getDate() + Math.ceil(remaining / lossRate));
  return projected;
}

function weeksRemaining(key) {
  return Math.max(0, Math.ceil((parseDate(settings().goalDate) - parseDate(key)) / 604800000));
}

function requiredWeeklyPace(currentWeight, key) {
  const weeks = weeksRemaining(key);
  if (!weeks) return null;
  return Math.max(0, (currentWeight - settings().goalWeight) / weeks);
}

function trackStatus(required, actual) {
  if (actual == null || required == null) return { text: "Build data", className: "status-warn" };
  if (actual >= required + 0.3) return { text: "Ahead", className: "status-good" };
  if (actual >= required - 0.3) return { text: "On track", className: "status-good" };
  return { text: "Behind", className: "status-warn" };
}

function cleanStreakEnding(key) {
  let streak = 0;
  let cursor = key;
  while (state.entries[cursor] && hasEntryData(state.entries[cursor]) && state.entries[cursor].cleanDayConfirmed && countViolations(state.entries[cursor]) === 0) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

function bestCleanStreak() {
  let best = 0;
  let current = 0;
  entriesSorted().forEach(([, entry]) => {
    if (entry.cleanDayConfirmed && countViolations(entry) === 0) {
      current += 1;
      best = Math.max(best, current);
    } else {
      current = 0;
    }
  });
  return best;
}

function allWeekStarts() {
  return [...new Set(entriesSorted().map(([key]) => startOfWeek(key)))].sort();
}

function bestWeek(metric) {
  let best = null;
  allWeekStarts().forEach((weekStart) => {
    const weekEnd = addDays(weekStart, 6);
    const stats = weeklyStats(weekEnd);
    const value = metric(stats);
    if (value == null || !Number.isFinite(value)) return;
    if (!best || value > best.value) best = { weekStart, value };
  });
  return best;
}

function previousBest(exerciseName, beforeDate) {
  let best = "";
  entriesSorted().forEach(([dateKey, entry]) => {
    if (dateKey >= beforeDate) return;
    Object.entries(entry.journal || {}).forEach(([key, row]) => {
      if (!key.endsWith(`:${exerciseName}`)) return;
      const weight = Number(row.weight);
      if (weight > Number(best || 0)) best = weight;
    });
  });
  return best;
}

function recommendation() {
  const sorted = entriesSorted();
  if (sorted.length < 14) {
    return {
      tag: "Building trend",
      text: "Log check-ins for at least two weeks to unlock trend recommendations.",
      className: "status-warn",
    };
  }

  const latestKey = sorted[sorted.length - 1][0];
  const lastLoss = weeklyWeightLossEnding(latestKey);
  const priorLoss = weeklyWeightLossEnding(addDays(latestKey, -7));

  if (lastLoss == null || priorLoss == null) {
    return {
      tag: "Need more weights",
      text: "Keep logging morning weights so the weekly average can drive recommendations.",
      className: "status-warn",
    };
  }

  if (lastLoss < 1 && priorLoss < 1) {
    return {
      tag: "Adjust",
      text: "Weekly average weight loss has been under 1 lb for 2 weeks. Reduce calories by 200/day or add 10 minutes to cardio.",
      className: "status-warn",
    };
  }

  if (lastLoss >= 2 && lastLoss <= 2.5) {
    return {
      tag: "Stay the course",
      text: "Weekly average loss is in the 2 to 2.5 lb zone. Keep the current plan steady.",
      className: "status-good",
    };
  }

  if (lastLoss > 3 && priorLoss > 3) {
    return {
      tag: "Protect muscle",
      text: "Weekly average loss has been over 3 lb for 2 weeks. Increase food slightly or reduce cardio to preserve muscle.",
      className: "status-bad",
    };
  }

  return {
    tag: "On watch",
    text: "Trend is between adjustment zones. Keep executing and watch the next 7-day average.",
    className: "status-good",
  };
}

function startOfWeek(key) {
  const date = parseDate(key);
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diff);
  return toDateKey(date);
}

function workoutDateFor(index) {
  return addDays(startOfWeek(els.entryDate.value || todayKey()), index);
}

function selectedWorkoutIndex() {
  return (parseDate(els.entryDate.value || todayKey()).getDay() + 6) % 7;
}

function isRestWorkout(dayIndex) {
  return dayIndex >= 5;
}

function workoutHeading(plan) {
  return `${plan.day} - ${plan.title}`;
}

function workoutCardioTarget(plan) {
  if (plan.title.includes("cardio")) return `${settings().cardioTarget} min cardio target`;
  if (plan.title.includes("Walk")) return "45-60 min walk target";
  if (plan.title.includes("Recovery") || plan.title.includes("Rest")) return "Optional easy walk only";
  return "Optional walk";
}

function isExerciseChecked(entry, dayIndex, exerciseIndex) {
  return Boolean(entry.workoutExercises?.[`${dayIndex}-${exerciseIndex}`]);
}

function renderMission() {
  const key = els.entryDate.value || todayKey();
  const dayIndex = selectedWorkoutIndex();
  const plan = workoutPlan[dayIndex];
  const cardio = workoutCardioTarget(plan).replace(" target", "");
  const focus = dayIndex === 5 ? "Recovery and meal prep" : dayIndex === 6 ? "Rest, prep, no grazing" : "No pizza grazing";
  els.missionContent.innerHTML = `
    <div><span>Workout</span><strong>${plan.title}</strong></div>
    <div><span>Cardio</span><strong>${cardio}</strong></div>
    <div><span>Protein</span><strong>${escapeHtml(settings().proteinTarget)}</strong></div>
    <div><span>Water</span><strong>1 gallon</strong></div>
    <div><span>Steps</span><strong>${Number(settings().stepTarget).toLocaleString()}+</strong></div>
    <div><span>Focus</span><strong>${focus}</strong></div>
  `;
}

function renderCheckinWorkout() {
  const selectedKey = els.entryDate.value || todayKey();
  const dayIndex = selectedWorkoutIndex();
  const plan = workoutPlan[dayIndex];
  const entry = state.entries[selectedKey] || {};
  const completedCount = plan.exercises.filter((_, exerciseIndex) => isExerciseChecked(entry, dayIndex, exerciseIndex)).length;
  const restDay = isRestWorkout(dayIndex);
  const exerciseRows = plan.exercises
    .map(([name, sets, reps]) => `<li>${name} <span>${sets} x ${reps}</span></li>`)
    .join("");

  setText("checkin-workout-title", workoutHeading(plan));
  setText("checkin-workout-date", formatDate(selectedKey, { weekday: "long", month: "short", day: "numeric" }));
  els.checkinWorkoutSummary.innerHTML = `
    <p>${restDay ? "No strength workout pressure today. Hit recovery, prep, and stay clean." : "This follows the selected check-in date and syncs with the Workout tab."}</p>
    <div class="workout-target-row">
      <span>${workoutCardioTarget(plan)}</span>
      <span>${Number(settings().stepTarget).toLocaleString()}+ steps</span>
    </div>
    <ul>${exerciseRows}</ul>
    <div class="workout-brief-actions">
      <span>${completedCount}/${plan.exercises.length} items checked</span>
      <button class="complete-button ${entry.workout ? "is-done" : ""}" type="button" data-workout-complete="${selectedKey}">
        ${entry.workout ? (restDay ? "Recovery complete" : "Workout completed") : (restDay ? "Mark recovery complete" : "Mark workout complete")}
      </button>
    </div>
  `;
}

function renderWorkout() {
  const selectedKey = els.entryDate.value || todayKey();
  const selectedDayIndex = selectedWorkoutIndex();
  const weekStart = startOfWeek(selectedKey);
  const weekEnd = addDays(weekStart, 6);
  const showFullWeek = Boolean(state.showFullWorkoutWeek);
  setText("workout-view-label", showFullWeek ? "Full Week Plan" : "Today's Workout");
  setText("workout-week-range", showFullWeek ? `${formatDate(weekStart)} - ${formatDate(weekEnd)}` : workoutHeading(workoutPlan[selectedDayIndex]));
  setText("workout-day-label", formatDate(selectedKey, { weekday: "long", month: "short", day: "numeric" }));
  els.fullWeekToggle.textContent = showFullWeek ? "Show today's workout only" : "View full week";
  els.fullWeekToggle.classList.toggle("is-active", showFullWeek);

  const daysToRender = showFullWeek
    ? workoutPlan.map((day, dayIndex) => ({ day, dayIndex }))
    : [{ day: workoutPlan[selectedDayIndex], dayIndex: selectedDayIndex }];

  els.workoutList.innerHTML = daysToRender
    .map(({ day, dayIndex }) => {
      const dateKey = workoutDateFor(dayIndex);
      const entry = state.entries[dateKey] || {};
      const completedCount = day.exercises.filter((_, exerciseIndex) => isExerciseChecked(entry, dayIndex, exerciseIndex)).length;
      const isSelected = dateKey === selectedKey;
      const restDay = isRestWorkout(dayIndex);
      const instructions = restDay
        ? "Recovery day: complete the walk, mobility, prep, and notes. No strength workout required."
        : "Complete the exercise checklist, log sets/reps/weight if useful, then mark the workout complete.";
      const rows = day.exercises
        .map(([name, sets, reps], exerciseIndex) => {
          const journalKey = `${dayIndex}-${exerciseIndex}:${name}`;
          const journal = entry.journal?.[journalKey] || {};
          const best = previousBest(name, dateKey);
          return `
            <div class="exercise-journal">
              <label class="exercise-row">
                <input type="checkbox" data-workout-check="${dateKey}" data-day-index="${dayIndex}" data-exercise-index="${exerciseIndex}" ${isExerciseChecked(entry, dayIndex, exerciseIndex) ? "checked" : ""} />
                <span>${name}</span>
                <small>${sets} x ${reps}</small>
              </label>
              <div class="journal-grid">
                <label><span>Sets</span><input data-journal="${dateKey}" data-journal-key="${journalKey}" data-journal-field="sets" value="${escapeHtml(journal.sets || sets)}" inputmode="numeric" /></label>
                <label><span>Reps</span><input data-journal="${dateKey}" data-journal-key="${journalKey}" data-journal-field="reps" value="${escapeHtml(journal.reps || reps)}" /></label>
                <label><span>Weight</span><input data-journal="${dateKey}" data-journal-key="${journalKey}" data-journal-field="weight" value="${escapeHtml(journal.weight)}" inputmode="decimal" /></label>
                <label><span>RPE</span><input data-journal="${dateKey}" data-journal-key="${journalKey}" data-journal-field="rpe" value="${escapeHtml(journal.rpe)}" inputmode="decimal" /></label>
                <label><span>Previous Best</span><input value="${best ? `${best} lb` : "--"}" readonly /></label>
                <label><span>PR</span><input data-journal="${dateKey}" data-journal-key="${journalKey}" data-journal-field="pr" value="${escapeHtml(journal.pr)}" placeholder="PR note" /></label>
              </div>
            </div>
          `;
        })
        .join("");

      return `
        <article class="workout-card ${isSelected ? "is-selected" : ""}">
          <div class="workout-card-head">
            <div>
              <p class="label">${day.day} - ${formatDate(dateKey, { month: "short", day: "numeric" })}</p>
              <h2>${day.title}</h2>
            </div>
            <span>${completedCount}/${day.exercises.length}</span>
          </div>
          <p class="workout-instructions">${instructions}</p>
          <div class="workout-target-row">
            <span>${workoutCardioTarget(day)}</span>
            <span>${Number(settings().stepTarget).toLocaleString()}+ steps</span>
          </div>
          <div class="exercise-list">${rows}</div>
          <label class="notes-field">
            <span>Energy, pump, aches/pain, notes</span>
            <textarea data-workout-notes="${dateKey}" rows="3" placeholder="Energy, loads, aches, wins...">${escapeHtml(entry.workoutNotes)}</textarea>
          </label>
          <button class="complete-button ${entry.workout ? "is-done" : ""}" type="button" data-workout-complete="${dateKey}">
            ${entry.workout ? (restDay ? "Recovery complete" : "Workout completed") : (restDay ? "Mark recovery complete" : "Mark workout completed")}
          </button>
        </article>
      `;
    })
    .join("");

  const historyRows = entriesSorted()
    .filter(([, entry]) => entry.workout || entry.workoutNotes || Object.keys(entry.journal || {}).length)
    .reverse()
    .slice(0, 10);
  els.workoutHistory.innerHTML = historyRows.length
    ? historyRows
        .map(([dateKey, entry]) => {
          const journalCount = Object.values(entry.journal || {}).filter((row) => row.weight || row.rpe || row.pr).length;
          return `
            <div class="history-row">
              <div>
                <strong>${formatDate(dateKey, { weekday: "short", month: "short", day: "numeric" })}</strong>
                <span>${entry.workout ? "Completed" : "Logged"} - ${journalCount} journal entries ${entry.workoutNotes ? `- ${escapeHtml(entry.workoutNotes)}` : ""}</span>
              </div>
            </div>
          `;
        })
        .join("")
    : `<div class="history-row"><span>No workout history yet.</span><strong>--</strong></div>`;
}

function renderMealPlan() {
  els.mealPlan.innerHTML = mealPlan
    .map(([day, breakfast, lunch, snack, dinner]) => `
      <article class="meal-day">
        <h3>${day}</h3>
        <p><strong>Breakfast:</strong> ${breakfast}</p>
        <p><strong>Lunch:</strong> ${lunch}</p>
        <p><strong>Snack:</strong> ${snack}</p>
        <p><strong>Dinner:</strong> ${dinner}</p>
      </article>
    `)
    .join("");
}

function renderMealOptions() {
  const entry = state.entries[els.entryDate.value] || {};
  els.mealOptions.innerHTML = Object.entries(mealOptions)
    .map(([category, options]) => `
      <article class="meal-choice-card">
        <h3>${category[0].toUpperCase()}${category.slice(1)}</h3>
        <div class="chip-list">
          ${options
            .map((option) => {
              const checked = Boolean(entry.meals?.[category]?.includes(option));
              return `<button class="chip ${checked ? "is-selected" : ""}" type="button" data-meal-category="${category}" data-meal-option="${escapeHtml(option)}">${option}</button>`;
            })
            .join("")}
        </div>
      </article>
    `)
    .join("");
  const logged = Object.entries(entry.meals || {}).flatMap(([category, items]) => items.map((item) => `${category}: ${item}`));
  els.mealLog.innerHTML = logged.length ? `<strong>Today's meal log</strong><span>${logged.join(" | ")}</span>` : `<strong>Today's meal log</strong><span>Tap a meal above to add it to today's diet log.</span>`;
}

function renderTemptations() {
  const entry = state.entries[els.entryDate.value] || {};
  const count = countViolations(entry);
  els.temptationSummary.textContent = count ? `${count} violation${count === 1 ? "" : "s"} logged` : entry.cleanDayConfirmed ? "Clean day confirmed" : "Clean day not confirmed";
  els.confirmCleanDay.textContent = entry.cleanDayConfirmed && !count ? "Clean Day Confirmed" : "Confirm Clean Day";
  els.confirmCleanDay.classList.toggle("is-done", Boolean(entry.cleanDayConfirmed && !count));
  els.temptationList.innerHTML = temptationOptions
    .map(([key, label]) => `
      <button class="chip ${entry.temptations?.[key] ? "is-selected danger" : ""}" type="button" data-temptation="${key}">
        <strong>${label}</strong>
        <span>${entry.temptations?.[key] ? "Logged - tap to undo" : "Tap to log violation"}</span>
      </button>
    `)
    .join("");
}

function renderQuickButtons() {
  const entry = state.entries[els.entryDate.value] || {};
  document.querySelectorAll("[data-quick-steps]").forEach((button) => {
    button.classList.toggle("is-selected", Number(entry.steps) === Number(button.dataset.quickSteps));
  });
  document.querySelectorAll("[data-quick-cardio]").forEach((button) => {
    button.classList.toggle("is-selected", Number(entry.cardioMinutes) === Number(button.dataset.quickCardio));
  });
}

function renderCompletion() {
  const entry = state.entries[els.entryDate.value] || {};
  els.completionStatus.textContent = entry.dayComplete ? "Today Complete" : "Not complete";
  els.completeToday.textContent = entry.dayComplete ? "Today Complete" : "Complete Today";
  els.completeToday.classList.toggle("is-done", Boolean(entry.dayComplete));
}

function supplementItems() {
  return [...supplementDefaults, ...state.customSupplements];
}

function renderSupplements() {
  const entry = state.entries[els.entryDate.value] || {};
  els.supplementList.innerHTML = supplementItems()
    .map((name) => `
      <label class="habit">
        <input type="checkbox" data-supplement="${escapeHtml(name)}" ${entry.supplements?.[name] ? "checked" : ""} />
        <span>
          <strong>${name}</strong>
          <span>Adherence tracking only — follow clinician or personal instructions.</span>
        </span>
        ${state.customSupplements.includes(name) ? `<button class="delete-mini" type="button" data-delete-supplement="${escapeHtml(name)}">Delete</button>` : ""}
      </label>
    `)
    .join("");
}

function renderProgress() {
  const weekKey = selectedWeekKey();
  const pictures = state.progressPictures[weekKey] || {};
  const measurements = state.measurements[weekKey] || {};
  setText("progress-week-label", `${formatDate(weekKey)} - ${formatDate(addDays(weekKey, 6))}`);

  els.pictureInputs.innerHTML = pictureTypes
    .map(([key, label]) => `
      <label class="picture-tile">
        <span>${label}</span>
        ${pictures[key] ? `<img src="${pictures[key]}" alt="${label} progress picture preview" />` : `<strong>Upload ${label}</strong>`}
        <input type="file" accept="image/*" data-picture="${key}" />
        ${pictures[key] ? `<button class="text-button" type="button" data-delete-picture="${key}">Delete / replace ${label}</button>` : `<small>Preview appears here after upload.</small>`}
      </label>
    `)
    .join("");

  els.measurementInputs.innerHTML = measurementFields
    .map(([key, label]) => `
      <label class="field-card">
        <span>${label}</span>
        <input data-measurement="${key}" type="number" step="0.1" min="0" placeholder="Inches" value="${escapeHtml(measurements[key])}" inputmode="decimal" />
      </label>
    `)
    .join("");

  const rows = Object.entries(state.measurements)
    .sort(([a], [b]) => b.localeCompare(a))
    .slice(0, 8);
  els.measurementHistory.innerHTML = rows.length
    ? rows
        .map(([key, values]) => `
          <div class="history-row">
            <div>
              <strong>${formatDate(key)} week</strong>
              <span>${measurementFields.map(([field, label]) => `${label}: ${values[field] || "--"}`).join(" | ")}</span>
            </div>
          </div>
        `)
        .join("")
    : `<div class="history-row"><span>No measurements yet. Add this week's measurements above to begin weekly comparisons.</span><strong>--</strong></div>`;
}

function renderHabits() {
  const entry = state.entries[els.entryDate.value] || {};
  const restDay = isRestWorkout(selectedWorkoutIndex());
  els.habitList.innerHTML = habits
    .filter((habit) => !habit.derived)
    .map((habit) => {
      const scoring = habit.bonus ? `Bonus +${habit.points}` : "Counts toward main score";
      const label = habit.key === "workout" && restDay ? "Recovery day completed" : habit.label;
      return `
        <label class="habit ${entry[habit.key] ? "is-checked" : ""} ${habit.bonus ? "is-bonus" : ""}">
          <input type="checkbox" data-key="${habit.key}" ${entry[habit.key] ? "checked" : ""} />
          <span>
            <strong>${label}</strong>
            <span>${scoring}</span>
          </span>
        </label>
      `;
    })
    .join("");
}

function loadForm() {
  const entry = currentEntry();
  els.weight.value = entry.weight ?? "";
  els.sleep.value = entry.sleep ?? "";
  els.steps.value = entry.steps ?? "";
  els.cardioMinutes.value = entry.cardioMinutes ?? "";
  els.activeCalories.value = entry.activeCalories ?? "";
  els.workoutDuration.value = entry.workoutDuration ?? "";
  els.heartRate.value = entry.heartRate ?? "";
  els.manualWatchImport.checked = Boolean(entry.manualWatchImport);
  els.habitList.querySelectorAll("input[type='checkbox']").forEach((input) => {
    input.checked = Boolean(entry[input.dataset.key]);
  });
  renderAll();
}

function updateEntryFromForm() {
  const entry = currentEntry();
  entry.weight = els.weight.value ? Number(els.weight.value) : "";
  entry.sleep = els.sleep.value ? Number(els.sleep.value) : "";
  entry.steps = els.steps.value ? Number(els.steps.value) : "";
  entry.cardioMinutes = els.cardioMinutes.value ? Number(els.cardioMinutes.value) : "";
  entry.activeCalories = els.activeCalories.value ? Number(els.activeCalories.value) : "";
  entry.workoutDuration = els.workoutDuration.value ? Number(els.workoutDuration.value) : "";
  entry.heartRate = els.heartRate.value ? Number(els.heartRate.value) : "";
  entry.manualWatchImport = els.manualWatchImport.checked;
  els.habitList.querySelectorAll("input[type='checkbox']").forEach((input) => {
    entry[input.dataset.key] = input.checked;
  });
  if (!hasEntryData(entry)) delete state.entries[els.entryDate.value];
  saveState();
  renderAll();
}

function toggleWorkoutComplete(dateKey) {
  state.entries[dateKey] ||= {};
  state.entries[dateKey].workout = !state.entries[dateKey].workout;
  saveState();
  if (dateKey === els.entryDate.value) loadForm();
  else renderAll();
}

function setText(id, value) {
  $(id).textContent = value;
}

function renderDashboard() {
  const key = els.entryDate.value || todayKey();
  const entry = state.entries[key] || {};
  const score = scoreBreakdown(entry);
  const latest = lastWeightEntry();
  const currentSettings = settings();
  const entryCount = entriesSorted().length;
  const currentWeight = latest ? Number(latest[1].weight) : Number(currentSettings.startWeight);
  const lost = Math.max(0, Number(currentSettings.startWeight) - currentWeight);
  const remaining = Math.max(0, currentWeight - Number(currentSettings.goalWeight));
  const seven = sevenDayAverage(key);
  const weekly = weeklyWeightLossEnding(key);
  const projected = projectedGoalDate();
  const stats = weeklyStats(key);
  const weeksLeft = weeksRemaining(key);
  const required = requiredWeeklyPace(currentWeight, key);
  const status = trackStatus(required, weekly);
  const cutSize = Math.max(1, Number(currentSettings.startWeight) - Number(currentSettings.goalWeight));
  const progress = Math.min(100, Math.max(0, (lost / cutSize) * 100));
  const rec = recommendation();
  const percent = Math.round(progress);
  const paceNote = required && required > 2 ? `<span class="status-warn">Required pace is aggressive.</span>` : `<span>Baseline pace is workable.</span>`;

  setText("today-score", `${formatScore(score.main)}/10`);
  setText("today-bonus", `+${formatScore(score.bonus)}`);
  setText("today-total", formatScore(score.total));
  setText("today-streak", `${cleanStreakEnding(key)} days`);
  setText("score-mini-line", `${formatScore(score.main)} of 10 main points completed · +${formatScore(score.bonus)} bonus`);
  setText("start-helper", entry.started ? "Check-in started. Auto-saving today." : "Creates today's log and enables auto-save. It will not reset your day.");
  els.startToday.textContent = entry.started ? "Check-In Started" : "Start Today's Check-In";
  els.startToday.classList.toggle("is-done", Boolean(entry.started));
  setText("cut-summary", `${Number(currentSettings.startWeight)} to ${Number(currentSettings.goalWeight)}`);
  setText("progress-start-label", Number(currentSettings.startWeight));
  setText("progress-goal-label", Number(currentSettings.goalWeight));
  setText("metric-start-weight", `${Number(currentSettings.startWeight).toFixed(1)} lb`);
  setText("metric-goal-weight", `${Number(currentSettings.goalWeight).toFixed(1)} lb`);
  setText("metric-main-score", formatScore(score.main));
  setText("metric-bonus-score", `+${formatScore(score.bonus)}`);
  setText("metric-total-score", formatScore(score.total));
  setText("metric-current", `${currentWeight.toFixed(1)} lb`);
  setText("metric-lost", `${lost.toFixed(1)} lb`);
  setText("metric-remaining", `${remaining.toFixed(1)} lb`);
  setText("metric-weeks-remaining", `${weeksLeft} wk`);
  setText("metric-required-pace", required == null ? "--" : `${required.toFixed(1)} lb/wk`);
  setText("metric-actual-pace", weekly == null ? "--" : `${weekly.toFixed(1)} lb/wk`);
  setText("metric-seven", seven ? `${seven.toFixed(1)} lb` : "--");
  setText("metric-weekly", weekly == null ? "--" : `${weekly >= 0 ? "-" : "+"}${Math.abs(weekly).toFixed(1)} lb`);
  setText("metric-projected", projected ? projected.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) : "--");
  setText("metric-compliance", stats.loggedDays ? `${stats.compliance}%` : entryCount ? "No data this week" : "No check-ins yet");
  setText("metric-track-status", entryCount >= 14 ? status.text : entryCount ? "Keep logging baseline" : "Log today's check-in");
  $("metric-track-status").className = entryCount >= 14 ? status.className : "status-warn";
  setText("metric-recovery-score", recoveryScore(entry));
  setText("metric-current-clean-streak", `${cleanStreakEnding(key)} days`);
  setText("metric-best-clean-streak", `${bestCleanStreak()} days`);
  setText("recommendation", rec.text);
  setText("trend-tag", rec.tag);
  els.trendTag.className = rec.className;
  els.weightProgress.style.width = `${progress}%`;
  els.cutProgressDetails.innerHTML = `
    <span>Start: ${Number(currentSettings.startWeight).toFixed(1)} lb</span>
    <span>Current: ${currentWeight.toFixed(1)} lb</span>
    <span>Goal: ${Number(currentSettings.goalWeight).toFixed(1)} lb</span>
    <span>Lost: ${lost.toFixed(1)} lb</span>
    <span>Remaining: ${remaining.toFixed(1)} lb</span>
    <span>${percent}% complete</span>
    <span>Required: ${required == null ? "--" : `${required.toFixed(1)} lb/wk`}</span>
    ${lost === 0 ? "<span>Baseline state: current weight equals starting weight.</span>" : ""}
    ${paceNote}
  `;
  els.dashboardEmptyState.innerHTML =
    entryCount < 14
      ? `<strong>Build your baseline.</strong><span>Log daily check-ins for 14 days to unlock trends, compliance, pace, and recommendations.</span>`
      : "";
  els.dashboardEmptyState.hidden = entryCount >= 14;
}

function yesNo(value) {
  return value ? "Yes" : "No";
}

function loggedValue(value, formatter = (item) => item) {
  if (value === "" || value == null || Number.isNaN(value)) return `<em>Not logged</em>`;
  return formatter(value);
}

function renderTodaySummary() {
  const key = els.entryDate.value || todayKey();
  const entry = state.entries[key] || {};
  const score = scoreBreakdown(entry);
  setText("summary-date", formatDate(key, { weekday: "short", month: "short", day: "numeric" }));
  const hasData = hasEntryData(entry);
  const violationCount = countViolations(entry);
  const cleanState = violationCount ? "No" : entry.cleanDayConfirmed ? "Yes" : "Not confirmed";
  els.todaySummary.innerHTML = `
    <div><span>Weight</span><strong>${loggedValue(entry.weight, (value) => `${Number(value).toFixed(1)} lb`)}</strong></div>
    <div><span>Steps</span><strong>${loggedValue(entry.steps, (value) => Number(value).toLocaleString())}</strong></div>
    <div><span>Cardio</span><strong>${loggedValue(entry.cardioMinutes, (value) => `${Number(value)} min`)}</strong></div>
    <div><span>Protein</span><strong>${yesNo(entry.protein)}</strong></div>
    <div><span>1st Phorm</span><strong>${yesNo(entry.caloriesTracked)}</strong></div>
    <div><span>No violations</span><strong>${hasData ? cleanState : "<em>Not logged</em>"}</strong></div>
    <div><span>Total score</span><strong>${formatScore(score.total)}</strong></div>
  `;
}

function renderScoreBreakdown() {
  const entry = state.entries[els.entryDate.value] || {};
  const mainItems = [
    ["Workout", entry.workout],
    ["Cardio 1", entry.cardio1],
    ["Cardio 2", entry.cardio2],
    [`${Number(settings().stepTarget).toLocaleString()}+ steps`, Number(entry.steps) >= Number(settings().stepTarget)],
    ["Protein", entry.protein],
    ["1st Phorm", entry.caloriesTracked],
    ["Water", entry.water],
    ["Clean day confirmed", hasEntryData(entry) && entry.cleanDayConfirmed && countViolations(entry) === 0],
    ["No sugary drink", hasEntryData(entry) && entry.cleanDayConfirmed && !entry.temptations?.soda],
    ["7+ hours sleep", Number(entry.sleep) >= 7],
  ];
  const bonusItems = [
    ["Sauna", entry.sauna ? "+0.5" : "+0"],
    ["Cold plunge", entry.coldPlunge ? "+0.5" : "+0"],
    ["Steps bonus", Number(entry.steps) >= 15000 ? "+1" : Number(entry.steps) >= 12500 ? "+0.5" : "+0"],
  ];
  els.scoreBreakdown.innerHTML = `
    <p>Main score is always out of 10. Bonus points are separate.</p>
    <div class="breakdown-grid">
      ${mainItems.map(([label, done]) => `<span class="${done ? "done" : ""}">${done ? "[x]" : "[ ]"} ${label}</span>`).join("")}
    </div>
    <div class="breakdown-grid bonus-grid">
      ${bonusItems.map(([label, value]) => `<span>${label}: ${value}</span>`).join("")}
    </div>
  `;
}

function chartSvg(values, options = {}) {
  const clean = values.map((value) => (Number.isFinite(value) ? value : null));
  if (clean.filter((value) => value != null).length < (options.minPoints || 2)) {
    return `<div class="empty-chart">Log more check-ins to build this trend.</div>`;
  }
  const width = 320;
  const height = 120;
  const pad = 12;
  const nums = clean.filter((value) => value != null);
  const min = options.min ?? Math.min(...nums);
  const max = options.max ?? Math.max(...nums);
  const range = Math.max(1, max - min);
  const points = clean
    .map((value, index) => {
      if (value == null) return null;
      const x = pad + (index * (width - pad * 2)) / Math.max(1, clean.length - 1);
      const y = height - pad - ((value - min) / range) * (height - pad * 2);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .filter(Boolean);
  const bars = clean
    .map((value, index) => {
      if (value == null) return "";
      const barWidth = (width - pad * 2) / clean.length - 3;
      const x = pad + (index * (width - pad * 2)) / clean.length;
      const barHeight = Math.max(3, ((value - min) / range) * (height - pad * 2));
      const y = height - pad - barHeight;
      return `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${Math.max(3, barWidth).toFixed(1)}" height="${barHeight.toFixed(1)}" rx="2"></rect>`;
    })
    .join("");
  return `
    <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${options.label || "Trend chart"}">
      <line x1="${pad}" y1="${height - pad}" x2="${width - pad}" y2="${height - pad}"></line>
      ${options.type === "bar" ? bars : `<polyline points="${points.join(" ")}"></polyline>`}
    </svg>
  `;
}

function renderCharts() {
  const key = els.entryDate.value || todayKey();
  const days = lastNDays(key, 14);
  const weights = days.map(([, entry]) => (Number(entry.weight) > 0 ? Number(entry.weight) : null));
  const scores = days.map(([, entry]) => (hasEntryData(entry) ? scoreBreakdown(entry).main : null));
  const loggedDays = scores.filter((score) => score != null).length;
  const steps = days.map(([, entry]) => (Number(entry.steps) > 0 ? Number(entry.steps) : null));
  const cardio = days.map(([, entry]) => (Number(entry.cardioMinutes) > 0 ? Number(entry.cardioMinutes) : null));
  els.chartWeight.innerHTML = chartSvg(weights, { label: "Weight trend" });
  els.chartScore.innerHTML = chartSvg(scores, { label: "Daily score trend", min: 0, max: 10 });
  els.chartSteps.innerHTML = chartSvg(steps, { label: "Steps trend", type: "bar", min: 0 });
  els.chartCardio.innerHTML = chartSvg(cardio, { label: "Cardio minutes trend", type: "bar", min: 0 });
}

function renderWeekly() {
  const key = els.entryDate.value || todayKey();
  const weekEnd = key;
  const weekStart = addDays(key, -6);
  const stats = weeklyStats(key);
  const onTrack = stats.averageScore >= 8 && stats.noGrazing >= 6 && (stats.weightLoss == null || stats.weightLoss >= 1);
  const bestLoss = bestWeek((week) => week.weightLoss);
  const bestCompliance = bestWeek((week) => week.compliance);
  const bestSteps = bestWeek((week) => week.totalSteps);

  setText("week-range", `${formatDate(weekStart)} - ${formatDate(weekEnd)}`);
  setText("review-weight", stats.averageWeight ? `${stats.averageWeight.toFixed(1)} lb` : "--");
  const hasWeekData = stats.loggedDays > 0;
  setText("review-score", hasWeekData ? stats.averageScore.toFixed(1) : "--");
  setText("review-cardio", hasWeekData ? stats.cardio : "--");
  setText("review-steps", hasWeekData ? Math.round(stats.steps).toLocaleString() : "--");
  setText("review-grazing", hasWeekData ? `${stats.noGrazing}/${stats.loggedDays}` : "--");
  setText("review-status", hasWeekData ? (onTrack ? "On track" : "Tighten up") : "No check-ins yet");
  setText("review-best-loss", bestLoss ? `${bestLoss.value.toFixed(1)} lb` : "--");
  setText("review-best-compliance", bestCompliance ? `${bestCompliance.value}%` : "--");
  setText("review-best-steps", bestSteps ? Math.round(bestSteps.value).toLocaleString() : "--");
  setText("review-current-streak", `${cleanStreakEnding(key)} days`);
  setText("review-best-clean-streak", `${bestCleanStreak()} days`);
  setText("review-violations", hasWeekData ? stats.violations : "--");
  $("review-status").className = hasWeekData && onTrack ? "status-good" : "status-warn";
}


function renderHistory() {
  const rows = [...entriesThrough(els.entryDate.value || todayKey())].reverse().slice(0, 14);
  els.clearToday.hidden = !hasEntryData(state.entries[els.entryDate.value] || {});
  els.clearToday.disabled = els.clearToday.hidden;
  els.historyList.innerHTML = rows.length
    ? rows
        .map(([key, entry]) => `
          <div class="history-row">
            <div>
              <strong>${formatDate(key, { weekday: "short", month: "short", day: "numeric" })}</strong>
              <span>${entry.weight ? `${Number(entry.weight).toFixed(1)} lb` : "No weight"} - ${Number(entry.steps || 0).toLocaleString()} steps</span>
            </div>
            <strong>${formatScore(scoreBreakdown(entry).main)}/10 +${formatScore(scoreBreakdown(entry).bonus)}</strong>
          </div>
        `)
        .join("")
    : `<div class="history-row"><span>No check-ins yet. Go to Check-In to start building your weekly review.</span><strong>--</strong></div>`;
}

function renderSettings() {
  const current = settings();
  els.settingStartWeight.value = current.startWeight;
  els.settingGoalWeight.value = current.goalWeight;
  els.settingGoalDate.value = current.goalDate;
  els.settingProteinTarget.value = current.proteinTarget;
  els.settingStepTarget.value = current.stepTarget;
  els.settingCardioTarget.value = current.cardioTarget;
  els.settingTrainingCalories.value = current.trainingCalories;
  els.settingRestCalories.value = current.restCalories;
}

function renderAll() {
  renderHabits();
  renderMission();
  renderCheckinWorkout();
  renderDashboard();
  renderTodaySummary();
  renderScoreBreakdown();
  renderQuickButtons();
  renderCharts();
  renderWorkout();
  renderMealOptions();
  renderTemptations();
  renderCompletion();
  renderSupplements();
  renderProgress();
  renderWeekly();
  renderHistory();
  renderSettings();
}

function cacheElements() {
  [
    "today-score",
    "today-bonus",
    "today-total",
    "today-streak",
    "score-mini-line",
    "start-today",
    "start-helper",
    "weight-progress",
    "cut-summary",
    "goal-date-line",
    "progress-start-label",
    "progress-goal-label",
    "cut-progress-details",
    "dashboard-empty-state",
    "entry-date",
    "prev-day",
    "next-day",
    "weight",
    "sleep",
    "steps",
    "cardio-minutes",
    "active-calories",
    "workout-duration",
    "heart-rate",
    "manual-watch-import",
    "habit-list",
    "mission-content",
    "checkin-workout-title",
    "checkin-workout-date",
    "checkin-workout-summary",
    "today-summary",
    "summary-date",
    "score-breakdown",
    "temptation-list",
    "temptation-summary",
    "confirm-clean-day",
    "complete-today",
    "completion-status",
    "save-state",
    "history-list",
    "clear-today",
    "trend-tag",
    "workout-list",
    "workout-history",
    "workout-week-range",
    "workout-day-label",
    "workout-view-label",
    "full-week-toggle",
    "meal-plan",
    "meal-options",
    "meal-log",
    "supplement-list",
    "custom-supplement",
    "add-supplement",
    "picture-inputs",
    "progress-week-label",
    "measurement-inputs",
    "measurement-history",
    "chart-weight",
    "chart-score",
    "chart-steps",
    "chart-cardio",
    "setting-start-weight",
    "setting-goal-weight",
    "setting-goal-date",
    "setting-protein-target",
    "setting-step-target",
    "setting-cardio-target",
    "setting-training-calories",
    "setting-rest-calories",
    "export-data",
    "import-data",
    "clear-all-data",
    "data-status",
    "dashboard-go-checkin",
    "privacy-gate",
    "privacy-unlock",
    "privacy-code",
    "progress-status",
  ].forEach((id) => {
    els[id.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())] = $(id);
  });
}

function bindPrivacyGate() {
  const unlocked = sessionStorage.getItem(PRIVACY_UNLOCK_KEY) === "1";
  els.privacyGate.hidden = unlocked;
  if (unlocked) return;
  els.privacyUnlock.addEventListener("click", () => {
    if (els.privacyCode.value.trim().toUpperCase() !== PRIVACY_UNLOCK_PHRASE) {
      els.privacyCode.value = "";
      els.privacyCode.placeholder = "Type RYAN to unlock";
      return;
    }
    sessionStorage.setItem(PRIVACY_UNLOCK_KEY, "1");
    els.privacyGate.hidden = true;
  });
  els.privacyCode.addEventListener("keydown", (event) => {
    if (event.key === "Enter") els.privacyUnlock.click();
  });
}

function bindEvents() {
  bindPrivacyGate();
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach((item) => item.classList.remove("is-active"));
      document.querySelectorAll(".tab-panel").forEach((panel) => panel.classList.remove("is-active"));
      tab.classList.add("is-active");
      $(tab.dataset.tab).classList.add("is-active");
    });
  });

  els.entryDate.addEventListener("change", loadForm);
  els.prevDay.addEventListener("click", () => {
    els.entryDate.value = addDays(els.entryDate.value, -1);
    loadForm();
  });
  els.nextDay.addEventListener("click", () => {
    els.entryDate.value = addDays(els.entryDate.value, 1);
    loadForm();
  });

  [els.weight, els.sleep, els.steps, els.cardioMinutes, els.activeCalories, els.workoutDuration, els.heartRate, els.manualWatchImport, els.habitList].forEach((node) => {
    node.addEventListener("input", updateEntryFromForm);
    node.addEventListener("change", updateEntryFromForm);
  });

  document.querySelectorAll("[data-quick-steps]").forEach((button) => {
    button.addEventListener("click", () => {
      els.steps.value = button.dataset.quickSteps;
      updateEntryFromForm();
    });
  });

  document.querySelectorAll("[data-quick-cardio]").forEach((button) => {
    button.addEventListener("click", () => {
      els.cardioMinutes.value = button.dataset.quickCardio;
      const cardioBox = els.habitList.querySelector("[data-key='cardio1']");
      if (cardioBox) cardioBox.checked = true;
      updateEntryFromForm();
      loadForm();
    });
  });

  els.fullWeekToggle.addEventListener("click", () => {
    state.showFullWorkoutWeek = !state.showFullWorkoutWeek;
    saveState();
    renderWorkout();
  });

  els.startToday.addEventListener("click", () => {
    els.entryDate.value = todayKey();
    const entry = currentEntry();
    entry.started = true;
    saveState();
    loadForm();
    document.querySelector("[data-tab='checkin']").click();
    document.getElementById("checkin").scrollIntoView({ behavior: "smooth", block: "start" });
  });

  els.confirmCleanDay.addEventListener("click", () => {
    const entry = currentEntry();
    entry.temptations = {};
    entry.cleanDayConfirmed = true;
    saveState();
    renderAll();
  });

  els.completeToday.addEventListener("click", () => {
    const entry = currentEntry();
    const missing = [];
    if (!entry.weight) missing.push("weight");
    if (!entry.steps) missing.push("steps");
    if (!entry.cleanDayConfirmed && countViolations(entry) === 0) missing.push("clean day confirmation or violation log");
    if (missing.length && !window.confirm(`Complete today with missing items: ${missing.join(", ")}?`)) return;
    entry.started = true;
    entry.dayComplete = true;
    saveState();
    renderAll();
  });

  els.dashboardGoCheckin.addEventListener("click", () => {
    document.querySelector("[data-tab='checkin']").click();
    document.getElementById("checkin").scrollIntoView({ behavior: "smooth", block: "start" });
  });

  [
    ["settingStartWeight", "startWeight", Number],
    ["settingGoalWeight", "goalWeight", Number],
    ["settingGoalDate", "goalDate", String],
    ["settingProteinTarget", "proteinTarget", String],
    ["settingStepTarget", "stepTarget", Number],
    ["settingCardioTarget", "cardioTarget", Number],
    ["settingTrainingCalories", "trainingCalories", String],
    ["settingRestCalories", "restCalories", String],
  ].forEach(([elKey, settingKey, cast]) => {
    els[elKey].addEventListener("input", () => showSaveStatus("Unsaved settings change", "status-warn"));
    els[elKey].addEventListener("change", () => {
      const raw = els[elKey].value;
      const fallback = DEFAULT_SETTINGS[settingKey];
      const nextValue = raw === "" ? fallback : cast === Number ? Number(raw) : raw.trim();
      if (!validateSettingValue(settingKey, nextValue)) {
        els[elKey].value = settings()[settingKey] ?? fallback;
        showSaveStatus("Invalid setting. Use a positive number or valid date.", "status-bad");
        return;
      }
      settings()[settingKey] = nextValue;
      saveState("Settings saved locally");
      setText("goal-date-line", `Goal by ${formatDate(settings().goalDate, { month: "short", day: "numeric", year: "numeric" })}`);
      renderAll();
    });
  });

  els.exportData.addEventListener("click", () => {
    const backup = JSON.stringify(state, null, 2);
    const blob = new Blob([backup], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ryan-cut-tracker-backup-${todayKey()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    els.dataStatus.textContent = "Exported JSON backup.";
  });

  els.importData.addEventListener("change", () => {
    const file = els.importData.files?.[0];
    if (!file) return;
    if (!window.confirm("Importing a backup will replace the current local tracker data. Continue?")) {
      els.importData.value = "";
      return;
    }
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      try {
        const imported = validateImportedState(JSON.parse(reader.result));
        state = imported;
        saveState("Imported JSON backup and saved locally");
        renderHabits();
        renderMealPlan();
        loadForm();
        els.dataStatus.textContent = "Imported JSON backup.";
      } catch (error) {
        els.dataStatus.textContent = `Import failed: ${error.message}. Choose a Ryan Cut Tracker JSON backup.`;
        els.dataStatus.className = "support-copy status-bad";
      } finally {
        els.importData.value = "";
      }
    });
    reader.readAsText(file);
  });

  els.clearAllData.addEventListener("click", () => {
    if (!window.confirm("Clear all Ryan Cut Tracker data from this browser? Export a backup first if you may need it.")) return;
    if (window.prompt("Type CLEAR to permanently delete all local tracker data.") !== "CLEAR") return;
    localStorage.removeItem(STORAGE_KEY);
    state = { entries: {}, customSupplements: [], measurements: {}, progressPictures: {}, settings: { ...DEFAULT_SETTINGS } };
    renderHabits();
    renderMealPlan();
    loadForm();
    showSaveStatus("All local data cleared.", "status-warn");
  });

  els.clearToday.addEventListener("click", () => {
    if (!hasEntryData(state.entries[els.entryDate.value] || {})) return;
    if (!window.confirm("Clear today's check-in data for the selected date?")) return;
    delete state.entries[els.entryDate.value];
    saveState();
    loadForm();
  });

  els.workoutList.addEventListener("change", (event) => {
    const check = event.target.closest("[data-workout-check]");
    const notes = event.target.closest("[data-workout-notes]");

    if (check) {
      const dateKey = check.dataset.workoutCheck;
      state.entries[dateKey] ||= {};
      state.entries[dateKey].workoutExercises ||= {};
      state.entries[dateKey].workoutExercises[`${check.dataset.dayIndex}-${check.dataset.exerciseIndex}`] = check.checked;
      saveState();
      if (dateKey === els.entryDate.value) loadForm();
      else renderAll();
    }

    if (notes) {
      const dateKey = notes.dataset.workoutNotes;
      state.entries[dateKey] ||= {};
      state.entries[dateKey].workoutNotes = notes.value;
      saveState();
      renderAll();
    }

    const journal = event.target.closest("[data-journal]");
    if (journal) {
      const dateKey = journal.dataset.journal;
      state.entries[dateKey] ||= {};
      state.entries[dateKey].journal ||= {};
      state.entries[dateKey].journal[journal.dataset.journalKey] ||= {};
      state.entries[dateKey].journal[journal.dataset.journalKey][journal.dataset.journalField] = journal.value;
      saveState();
    }
  });

  els.workoutList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-workout-complete]");
    if (!button) return;
    toggleWorkoutComplete(button.dataset.workoutComplete);
  });

  els.checkinWorkoutSummary.addEventListener("click", (event) => {
    const button = event.target.closest("[data-workout-complete]");
    if (!button) return;
    toggleWorkoutComplete(button.dataset.workoutComplete);
  });

  els.temptationList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-temptation]");
    if (!button) return;
    const entry = currentEntry();
    entry.temptations ||= {};
    entry.temptations[button.dataset.temptation] = !entry.temptations[button.dataset.temptation];
    if (entry.temptations[button.dataset.temptation]) entry.cleanDayConfirmed = false;
    saveState();
    renderAll();
  });

  els.mealOptions.addEventListener("click", (event) => {
    const button = event.target.closest("[data-meal-option]");
    if (!button) return;
    const entry = currentEntry();
    const category = button.dataset.mealCategory;
    const option = button.dataset.mealOption;
    entry.meals ||= {};
    entry.meals[category] ||= [];
    entry.meals[category] = entry.meals[category].includes(option)
      ? entry.meals[category].filter((item) => item !== option)
      : [...entry.meals[category], option];
    saveState();
    renderAll();
  });

  els.supplementList.addEventListener("click", (event) => {
    const deleteButton = event.target.closest("[data-delete-supplement]");
    if (!deleteButton) return;
    const name = deleteButton.dataset.deleteSupplement;
    state.customSupplements = state.customSupplements.filter((item) => item !== name);
    Object.values(state.entries).forEach((entry) => { if (entry.supplements) delete entry.supplements[name]; });
    saveState("Custom supplement deleted");
    renderAll();
  });

  els.supplementList.addEventListener("change", (event) => {
    const input = event.target.closest("[data-supplement]");
    if (!input) return;
    const entry = currentEntry();
    entry.supplements ||= {};
    entry.supplements[input.dataset.supplement] = input.checked;
    saveState();
    renderAll();
  });

  els.addSupplement.addEventListener("click", () => {
    const value = els.customSupplement.value.trim();
    if (!value) { showSaveStatus("Enter a supplement name before adding.", "status-warn"); return; }
    if (supplementItems().some((item) => item.toLowerCase() === value.toLowerCase())) { showSaveStatus("That supplement is already on the list.", "status-warn"); return; }
    state.customSupplements.push(value);
    els.customSupplement.value = "";
    saveState();
    renderAll();
  });

  els.pictureInputs.addEventListener("click", (event) => {
    const button = event.target.closest("[data-delete-picture]");
    if (!button) return;
    const weekKey = selectedWeekKey();
    if (state.progressPictures[weekKey]) delete state.progressPictures[weekKey][button.dataset.deletePicture];
    saveState("Progress picture removed locally");
    renderProgress();
  });

  els.measurementInputs.addEventListener("input", () => showSaveStatus("Unsaved progress measurement", "status-warn"));

  els.measurementInputs.addEventListener("change", (event) => {
    const input = event.target.closest("[data-measurement]");
    if (!input) return;
    const weekKey = selectedWeekKey();
    state.measurements[weekKey] ||= {};
    state.measurements[weekKey][input.dataset.measurement] = input.value ? Number(input.value) : "";
    saveState();
    renderProgress();
  });

  els.pictureInputs.addEventListener("change", (event) => {
    const input = event.target.closest("[data-picture]");
    const file = input?.files?.[0];
    if (!input || !file) return;
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      const weekKey = selectedWeekKey();
      state.progressPictures[weekKey] ||= {};
      state.progressPictures[weekKey][input.dataset.picture] = reader.result;
      saveState("Progress picture saved locally");
      renderProgress();
    });
    reader.readAsDataURL(file);
  });
}

function init() {
  cacheElements();
  loadState();
  renderHabits();
  renderMealPlan();
  els.entryDate.value = todayKey();
  setText("goal-date-line", `Goal by ${formatDate(settings().goalDate, { month: "short", day: "numeric", year: "numeric" })}`);
  bindEvents();
  loadForm();
}

init();
