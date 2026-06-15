const START_WEIGHT = 265;
const GOAL_WEIGHT = 220;
const TARGET_DATE = "2026-10-01";
const STORAGE_KEY = "ryan-cut-tracker-v1";
const AUTH_USERS_KEY = "forged-auth-users-v1";
const AUTH_SESSION_KEY = "forged-auth-session-v1";

const DEFAULT_SETTINGS = {
  userName: "",
  goalType: "lose fat",
  startWeight: START_WEIGHT,
  currentWeight: START_WEIGHT,
  goalWeight: GOAL_WEIGHT,
  goalDate: TARGET_DATE,
  proteinTarget: "250-260g",
  carbTarget: 250,
  fatTarget: 80,
  fiberTarget: 30,
  waterTarget: 128,
  stepTarget: 10000,
  cardioTarget: 30,
  workoutDays: "Monday, Tuesday, Thursday, Friday, Saturday",
  preferredUnits: "imperial",
  theme: "dark",
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

const defaultFavoriteFoods = [
  { name: "Protein Shake", serving: "1 shake", calories: 160, protein: 30, carbs: 5, fat: 2, fiber: 1 },
  { name: "Chicken Breast", serving: "6 oz", calories: 280, protein: 52, carbs: 0, fat: 6, fiber: 0 },
  { name: "Egg Whites", serving: "1 cup", calories: 125, protein: 26, carbs: 2, fat: 0, fiber: 0 },
  { name: "Ground Turkey", serving: "6 oz", calories: 320, protein: 44, carbs: 0, fat: 16, fiber: 0 },
  { name: "Greek Yogurt", serving: "1 cup", calories: 150, protein: 20, carbs: 9, fat: 0, fiber: 0 },
  { name: "Rice", serving: "1 cup", calories: 205, protein: 4, carbs: 45, fat: 0, fiber: 1 },
  { name: "Oatmeal", serving: "1 cup", calories: 150, protein: 5, carbs: 27, fat: 3, fiber: 4 },
];

const mealCount = 6;

const supplementDefaults = [
  { name: "Creatine", dosage: "5", unit: "g", time: "post-workout", instructions: "after workout", notes: "Daily starter template" },
  { name: "Protein Powder", dosage: "1", unit: "scoop", time: "morning", instructions: "with breakfast", notes: "Daily starter template" },
  { name: "Fish oil", dosage: "1", unit: "serving", time: "morning", instructions: "with food", notes: "" },
  { name: "Multivitamin", dosage: "1", unit: "tablet", time: "morning", instructions: "with food", notes: "" },
  { name: "Electrolytes", dosage: "1", unit: "serving", time: "pre-workout", instructions: "before workout", notes: "" },
];

const defaultUserId = "demo-user";
const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const mealSlots = ["Breakfast", "Lunch", "Dinner", "Snack"];

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

function uid(prefix = "item") {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function currentUserId() {
  return state.currentUserId || defaultUserId;
}

function userScoped(item) {
  return !item.userId || item.userId === currentUserId();
}


function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function safeNumber(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function loadAuthUsers() {
  try {
    const users = JSON.parse(localStorage.getItem(AUTH_USERS_KEY));
    return Array.isArray(users) ? users : [];
  } catch {
    return [];
  }
}

function saveAuthUsers(users) {
  localStorage.setItem(AUTH_USERS_KEY, JSON.stringify(users));
}

function simplePasswordHash(password, salt) {
  return btoa(unescape(encodeURIComponent(`${salt}:${password}`)));
}

function authStatus(message, tone = "") {
  if (!els.authStatus) return;
  els.authStatus.textContent = message;
  els.authStatus.classList.remove("status-good", "status-warn", "status-bad");
  if (tone) els.authStatus.classList.add(tone);
}

function setAuthMode(mode) {
  const loginMode = mode === "login";
  els.signupForm.hidden = loginMode;
  els.loginForm.hidden = !loginMode;
  els.showSignup.classList.toggle("is-active", !loginMode);
  els.showLogin.classList.toggle("is-active", loginMode);
  authStatus(loginMode ? "Log in with the email and password used on this device." : "Beta note: this saves in this browser only. Use real server auth before a public multi-device launch.");
}

function createAuthUser(formData) {
  const email = normalizeEmail(formData.email);
  const name = String(formData.name || "").trim();
  const password = String(formData.password || "");
  if (!name) throw new Error("Enter your name to create an account.");
  if (!email || !email.includes("@")) throw new Error("Enter a valid email address.");
  if (password.length < 6) throw new Error("Use at least 6 characters for the password.");

  const users = loadAuthUsers();
  if (users.some((user) => user.email === email)) throw new Error("That email already has an account on this device. Log in instead.");

  const startWeight = safeNumber(formData.startWeight, START_WEIGHT);
  const goalWeight = safeNumber(formData.goalWeight, GOAL_WEIGHT);
  const goalDate = validDateKey(formData.goalDate) ? formData.goalDate : TARGET_DATE;
  const salt = uid("salt");
  const user = {
    id: uid("user"),
    name,
    email,
    passwordHash: simplePasswordHash(password, salt),
    salt,
    startWeight,
    currentWeight: startWeight,
    goalWeight,
    goalDate,
    createdAt: todayKey(),
  };
  users.push(user);
  saveAuthUsers(users);
  return user;
}

function signInAuthUser(emailValue, passwordValue) {
  const email = normalizeEmail(emailValue);
  const password = String(passwordValue || "");
  const user = loadAuthUsers().find((item) => item.email === email);
  if (!user || user.passwordHash !== simplePasswordHash(password, user.salt)) {
    throw new Error("Email or password did not match an account saved on this device.");
  }
  return user;
}

function applyAuthenticatedUser(user, { save = true } = {}) {
  if (!user) return;
  state.currentUserId = user.id;
  state.users ||= [];
  const existingIndex = state.users.findIndex((item) => item.id === user.id);
  const appUser = { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt || todayKey() };
  if (existingIndex >= 0) state.users[existingIndex] = { ...state.users[existingIndex], ...appUser };
  else state.users.push(appUser);

  state.settings = {
    ...DEFAULT_SETTINGS,
    ...(state.settings || {}),
    userName: user.name,
    startWeight: user.startWeight || state.settings?.startWeight || START_WEIGHT,
    currentWeight: user.currentWeight || user.startWeight || state.settings?.currentWeight || START_WEIGHT,
    goalWeight: user.goalWeight || state.settings?.goalWeight || GOAL_WEIGHT,
    goalDate: user.goalDate || state.settings?.goalDate || TARGET_DATE,
  };
  state.user_profiles ||= {};
  state.user_profiles[user.id] = { userId: user.id, email: user.email, ...state.settings };
  state.goals ||= {};
  state.goals[user.id] = state.settings;
  sessionStorage.setItem(AUTH_SESSION_KEY, user.id);
  ensurePlatformState();
  if (save) saveState("Account saved locally");
}

function activeSessionUser() {
  const sessionId = sessionStorage.getItem(AUTH_SESSION_KEY);
  if (!sessionId) return null;
  return loadAuthUsers().find((user) => user.id === sessionId) || null;
}

function normalizeSupplement(item) {
  if (typeof item === "string") {
    return { id: uid("supp"), userId: currentUserId(), name: item, dosage: "", unit: "serving", time: "morning", instructions: "with food", notes: "", active: true };
  }
  return {
    id: item.id || uid("supp"),
    userId: item.userId || currentUserId(),
    name: String(item.name || "Supplement").trim() || "Supplement",
    dosage: item.dosage ?? "",
    unit: item.unit || "serving",
    time: item.time || "morning",
    instructions: item.instructions || "with food",
    notes: item.notes || "",
    active: item.active !== false,
  };
}

function defaultWorkoutTemplates() {
  return workoutPlan.map((plan, index) => ({
    id: `starter-${plan.day.toLowerCase()}`,
    userId: currentUserId(),
    name: plan.title,
    day: plan.day,
    muscleGroup: plan.title.split("+")[0].trim(),
    cardio: workoutCardioTarget(plan),
    restTime: "",
    isRestDay: isRestWorkout(index),
    notes: "Starter FORGED template",
    exercises: plan.exercises.map(([name, sets, reps]) => ({ name, sets, reps, weight: "", rest: "", notes: "" })),
    starter: true,
  }));
}

function defaultMealTemplates() {
  return mealPlan.flatMap(([day, breakfast, lunch, snack, dinner]) => [
    { day, time: "Breakfast", name: breakfast },
    { day, time: "Lunch", name: lunch },
    { day, time: "Snack", name: snack },
    { day, time: "Dinner", name: dinner },
  ]).map((meal) => ({
    id: uid("meal"),
    userId: currentUserId(),
    day: meal.day,
    time: meal.time,
    name: meal.name,
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    notes: "Starter meal plan item",
    favorite: false,
    starter: true,
  }));
}

function ensurePlatformState() {
  state.currentUserId ||= defaultUserId;
  state.users ||= [{ id: defaultUserId, name: settings().userName || "Demo User", createdAt: todayKey() }];
  state.user_profiles ||= {};
  state.user_profiles[currentUserId()] ||= { userId: currentUserId(), ...settings() };
  state.daily_checkins = state.entries;
  state.goals ||= { [currentUserId()]: settings() };
  state.achievements ||= {};
  state.supplements = (state.supplements || supplementDefaults).map(normalizeSupplement);
  state.supplement_logs ||= {};
  Object.entries(state.entries || {}).forEach(([dateKey, entry]) => {
    Object.entries(entry.supplements || {}).forEach(([name, taken]) => {
      if (!taken) return;
      const supplement = state.supplements.find((item) => item.name === name);
      if (supplement) state.supplement_logs[supplementKey(dateKey, supplement.id)] ||= { userId: currentUserId(), supplementId: supplement.id, date: dateKey, status: "taken" };
    });
  });
  if (Array.isArray(state.customSupplements) && state.customSupplements.length) {
    const existing = new Set(state.supplements.map((item) => item.name.toLowerCase()));
    state.customSupplements.forEach((item) => {
      const supp = normalizeSupplement(item);
      if (!existing.has(supp.name.toLowerCase())) state.supplements.push(supp);
    });
  }
  state.customSupplements = state.supplements.filter(userScoped).filter((item) => !item.starter);
  state.workout_templates ||= defaultWorkoutTemplates();
  state.workouts ||= {};
  state.meal_plans ||= defaultMealTemplates();
  state.meals ||= state.meal_plans;
  state.habits ||= {};
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
  state.favoriteFoods ||= defaultFavoriteFoods;
  state.measurements ||= {};
  state.progressPictures ||= {};
  state.progressRange ||= 7;
  state.settings = { ...DEFAULT_SETTINGS, ...(state.settings || {}) };
  ensurePlatformState();
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

function targetNumber(value, fallback) {
  const numbers = String(value ?? "").replaceAll(",", "").match(/\d+(\.\d+)?/g)?.map(Number) || [];
  if (!numbers.length) return fallback;
  return Math.round(numbers.reduce((sum, item) => sum + item, 0) / numbers.length);
}

function selectedCaloriesGoal() {
  const dayIndex = selectedWorkoutIndex();
  return targetNumber(isRestWorkout(dayIndex) ? settings().restCalories : settings().trainingCalories, 2600);
}

function selectedProteinGoal() {
  return targetNumber(settings().proteinTarget, 255);
}

function ring(node, percent) {
  if (!node) return;
  const clean = Math.max(0, Math.min(100, Math.round(percent || 0)));
  node.style.setProperty("--pct", clean);
  const label = node.querySelector("span");
  if (label) label.textContent = `${clean}%`;
}

function emptyMeals() {
  return Array.from({ length: mealCount }, () => []);
}

function nutritionMeals(entry) {
  if (!Array.isArray(entry.nutritionMeals)) entry.nutritionMeals = emptyMeals();
  while (entry.nutritionMeals.length < mealCount) entry.nutritionMeals.push([]);
  return entry.nutritionMeals;
}

function foodNumber(food, key) {
  const value = Number(food?.[key]);
  return Number.isFinite(value) ? value : 0;
}

function sumFoods(foods = []) {
  return foods.reduce((totals, food) => {
    totals.calories += foodNumber(food, "calories");
    totals.protein += foodNumber(food, "protein");
    totals.carbs += foodNumber(food, "carbs");
    totals.fat += foodNumber(food, "fat");
    totals.fiber += foodNumber(food, "fiber");
    return totals;
  }, { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });
}

function nutritionTotals(entry) {
  return sumFoods(nutritionMeals(entry).flat());
}

function hasNutritionFoods(entry) {
  return nutritionMeals(entry).some((meal) => meal.length);
}

function macroGoals() {
  return {
    calories: selectedCaloriesGoal(),
    protein: selectedProteinGoal(),
    carbs: Number(settings().carbTarget || 250),
    fat: Number(settings().fatTarget || 80),
    fiber: Number(settings().fiberTarget || 30),
    water: Number(settings().waterTarget || 128),
  };
}

function setBar(id, current, goal) {
  const node = $(id);
  if (!node) return;
  node.style.width = `${Math.max(0, Math.min(100, (Number(current) / Math.max(1, Number(goal))) * 100))}%`;
}

function addFoodToMeal(mealIndex, food) {
  const entry = currentEntry();
  const meals = nutritionMeals(entry);
  meals[mealIndex].push({
    name: String(food.name || "Food").trim() || "Food",
    serving: String(food.serving || "").trim(),
    calories: Number(food.calories) || 0,
    protein: Number(food.protein) || 0,
    carbs: Number(food.carbs) || 0,
    fat: Number(food.fat) || 0,
    fiber: Number(food.fiber) || 0,
  });
  const totals = nutritionTotals(entry);
  entry.caloriesEaten = totals.calories || "";
  entry.proteinGrams = totals.protein || "";
  if (totals.protein >= selectedProteinGoal()) entry.protein = true;
  state.lastFood = meals[mealIndex][meals[mealIndex].length - 1];
  saveState();
  loadForm();
}

function validateSettingValue(settingKey, raw) {
  if (["startWeight", "currentWeight", "goalWeight", "stepTarget", "cardioTarget", "waterTarget"].includes(settingKey)) {
    return positiveNumber(raw);
  }
  if (settingKey === "goalDate") return validDateKey(raw);
  if (["userName", "goalType", "proteinTarget", "trainingCalories", "restCalories", "workoutDays", "preferredUnits", "theme"].includes(settingKey)) return String(raw || "").trim().length > 0;
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
  imported.favoriteFoods ||= defaultFavoriteFoods;
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
  const noLegacyViolations = temptationCount === 0;
  const cleanDayConfirmed = hasData && entry.cleanDayConfirmed && noLegacyViolations;
  const noSoda = cleanDayConfirmed && !entry.temptations?.soda;
  const noGrazing = cleanDayConfirmed;
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

function customWorkoutForDay(dayIndex) {
  const day = weekdays[dayIndex];
  return (state.workout_templates || []).filter(userScoped).find((template) => template.day === day && !template.starter);
}

function workoutForDay(dayIndex) {
  const custom = customWorkoutForDay(dayIndex);
  if (!custom) return workoutPlan[dayIndex];
  return {
    day: custom.day,
    title: custom.isRestDay ? "Rest / Recovery" : custom.name,
    customId: custom.id,
    muscleGroup: custom.muscleGroup,
    cardio: custom.cardio,
    restTime: custom.restTime,
    notes: custom.notes,
    exercises: custom.isRestDay
      ? [["Recovery", "1", custom.notes || "Rest day"]]
      : custom.exercises.map((exercise) => [exercise.name, exercise.sets || "", exercise.reps || "", exercise.weight || "", exercise.rest || "", exercise.notes || ""]),
  };
}

function workoutHeading(plan) {
  return `${plan.day} - ${plan.title}`;
}

function workoutCardioTarget(plan) {
  if (plan.cardio) return plan.cardio;
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
  const plan = workoutForDay(dayIndex);
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
  const plan = workoutForDay(dayIndex);
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
  setText("workout-week-range", showFullWeek ? `${formatDate(weekStart)} - ${formatDate(weekEnd)}` : workoutHeading(workoutForDay(selectedDayIndex)));
  setText("workout-day-label", formatDate(selectedKey, { weekday: "long", month: "short", day: "numeric" }));
  els.fullWeekToggle.textContent = showFullWeek ? "Show today's workout only" : "View full week";
  els.fullWeekToggle.classList.toggle("is-active", showFullWeek);

  const daysToRender = showFullWeek
    ? weekdays.map((_, dayIndex) => ({ day: workoutForDay(dayIndex), dayIndex }))
    : [{ day: workoutForDay(selectedDayIndex), dayIndex: selectedDayIndex }];

  els.workoutList.innerHTML = daysToRender
    .map(({ day, dayIndex }) => {
      const dateKey = workoutDateFor(dayIndex);
      const entry = state.entries[dateKey] || {};
      const completedCount = day.exercises.filter((_, exerciseIndex) => isExerciseChecked(entry, dayIndex, exerciseIndex)).length;
      const completionPercent = workoutCompletion(entry, dayIndex);
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
            <span>${completionPercent}%</span>
          </div>
          <p class="workout-instructions">${instructions}</p>
          <div class="workout-target-row">
            <span>${workoutCardioTarget(day)}</span>
            <span>${Number(settings().stepTarget).toLocaleString()}+ steps</span>
          </div>
          <div class="workout-progress-row">
            <div class="progress-track"><div class="progress-fill" style="width:${completionPercent}%"></div></div>
            <strong>${completedCount}/${day.exercises.length} completed</strong>
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

function exerciseText(template) {
  return (template.exercises || []).map((exercise) => [
    exercise.name || "",
    exercise.sets || "",
    exercise.reps || "",
    exercise.weight || "",
    exercise.rest || "",
    exercise.notes || "",
  ].join(" | ")).join("\n");
}

function parseExerciseText(value) {
  return String(value || "").split("\n").map((line) => line.trim()).filter(Boolean).map((line) => {
    const [name, sets, reps, weight, rest, notes] = line.split("|").map((part) => part?.trim() || "");
    return { name: name || "Exercise", sets, reps, weight, rest, notes };
  });
}

function renderWorkoutBuilder() {
  if (!els.workoutBuilderList) return;
  const templates = (state.workout_templates || []).filter(userScoped);
  els.workoutBuilderList.innerHTML = templates.map((template) => `
    <article class="builder-item ${template.starter ? "is-starter" : ""}">
      <div>
        <strong>${escapeHtml(template.day)} · ${escapeHtml(template.name)}</strong>
        <span>${template.isRestDay ? "Rest day" : escapeHtml(template.muscleGroup || "Training")} · ${(template.exercises || []).length} exercise${(template.exercises || []).length === 1 ? "" : "s"}${template.cardio ? ` · ${escapeHtml(template.cardio)}` : ""}</span>
      </div>
      <div class="row-actions">
        <button type="button" data-edit-workout="${template.id}">Edit</button>
        ${template.starter ? `<button type="button" data-copy-workout="${template.id}">Customize</button>` : `<button class="delete-mini" type="button" data-delete-workout="${template.id}">Delete</button>`}
      </div>
    </article>
  `).join("");
}

function workoutsByDayCompletion(dateKey) {
  const dayIndex = (parseDate(dateKey).getDay() + 6) % 7;
  return workoutCompletion(state.entries[dateKey] || {}, dayIndex);
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
  if (!els.temptationSummary || !els.confirmCleanDay || !els.temptationList) return;
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

function workoutCompletion(entry, dayIndex) {
  const plan = workoutForDay(dayIndex);
  if (entry.workout) return 100;
  const completed = plan.exercises.filter((_, exerciseIndex) => isExerciseChecked(entry, dayIndex, exerciseIndex)).length;
  return plan.exercises.length ? Math.round((completed / plan.exercises.length) * 100) : 0;
}

function renderWeekSelector() {
  if (!els.weekSelector) return;
  const selectedKey = els.entryDate.value || todayKey();
  const today = todayKey();
  const selectedDate = parseDate(selectedKey);
  const sunday = new Date(selectedDate);
  sunday.setDate(selectedDate.getDate() - selectedDate.getDay());
  const weekStart = toDateKey(sunday);
  els.weekSelector.innerHTML = Array.from({ length: 7 }, (_, index) => {
    const key = addDays(weekStart, index);
    const date = parseDate(key);
    const letter = ["S", "M", "T", "W", "T", "F", "S"][date.getDay()];
    return `
      <button type="button" data-week-day="${key}" class="${key === selectedKey ? "is-selected" : ""} ${key === today ? "is-today" : ""}">
        <span>${letter}</span>
        <strong>${date.getDate()}</strong>
      </button>
    `;
  }).join("");
}

function renderAchievements(key) {
  if (!els.dashAchievements) return;
  const entry = state.entries[key] || {};
  const workoutCompletions = entriesSorted().filter(([, item]) => item.workout).length;
  const latest = lastWeightEntry();
  const lost = latest ? Math.max(0, Number(settings().startWeight) - Number(latest[1].weight)) : 0;
  const badges = [
    ["FORGED Streak", cleanStreakEnding(key) >= 7],
    ["FORGED Elite", cleanStreakEnding(key) >= 30],
    ["FORGED Warrior", entry.protein || Number(entry.proteinGrams) >= selectedProteinGoal()],
    ["FORGED Consistency", Number(entry.steps) >= Number(settings().stepTarget)],
    ["Weight Loss Milestone", lost >= 10],
    ["Workout Milestone", workoutCompletions >= 10],
  ];
  const earned = badges.filter(([, done]) => done).length;
  setText("dash-badge-count", `${earned}/${badges.length}`);
  els.dashAchievements.innerHTML = badges
    .map(([label, done]) => `<div class="badge ${done ? "is-earned" : ""}"><span>${done ? "OK" : "--"}</span><strong>${label}</strong></div>`)
    .join("");
}

function renderNutrition() {
  if (!els.mealList) return;
  const entry = state.entries[els.entryDate.value] || {};
  const totals = nutritionTotals(entry);
  const goals = macroGoals();
  const water = Number(entry.waterOunces) || (entry.water ? goals.water : 0);
  const macroRows = [
    ["calories", "Calories", "", totals.calories, goals.calories],
    ["protein", "Protein", "g", totals.protein, goals.protein],
    ["carbs", "Carbs", "g", totals.carbs, goals.carbs],
    ["fat", "Fat", "g", totals.fat, goals.fat],
  ];
  macroRows.forEach(([key, , unit, current, goal]) => {
    setText(`nutrition-${key}-current`, `${Math.round(current).toLocaleString()}${unit}`);
    setText(`nutrition-${key}-goal`, `${Math.round(goal).toLocaleString()}${unit}`);
    setText(`nutrition-${key}-remaining`, `${Math.max(0, Math.round(goal - current)).toLocaleString()}${unit} remaining`);
    setBar(`nutrition-${key}-bar`, current, goal);
  });
  setText("nutrition-fiber-current", `${Math.round(totals.fiber)}g`);
  setText("nutrition-fiber-goal", `${Math.round(goals.fiber)}g`);
  setText("nutrition-fiber-remaining", `${Math.max(0, Math.round(goals.fiber - totals.fiber))}g remaining`);
  setBar("nutrition-fiber-bar", totals.fiber, goals.fiber);
  setText("nutrition-water-current", `${water.toLocaleString()} oz`);
  setText("nutrition-water-goal", `${goals.water.toLocaleString()} oz`);
  setText("nutrition-water-remaining", `${Math.max(0, goals.water - water).toLocaleString()} oz remaining`);
  setBar("nutrition-water-bar", water, goals.water);

  els.favoriteFoods.innerHTML = (state.favoriteFoods || defaultFavoriteFoods)
    .map((food, index) => `
      <button type="button" data-favorite-index="${index}">
        <strong>${escapeHtml(food.name)}</strong>
        <span>${escapeHtml(food.serving)} · ${Number(food.calories || 0)} cal · ${Number(food.protein || 0)}g protein</span>
      </button>
    `)
    .join("");

  const meals = nutritionMeals(entry);
  els.mealList.innerHTML = meals
    .map((foods, mealIndex) => {
      const mealTotals = sumFoods(foods);
      const open = mealIndex === 0 || foods.length;
      const foodRows = foods.length
        ? foods.map((food, foodIndex) => `
          <div class="food-row">
            <div>
              <strong>${escapeHtml(food.name)}</strong>
              <span>${escapeHtml(food.serving || "Serving")} · ${Number(food.calories || 0)} cal · P ${Number(food.protein || 0)}g · C ${Number(food.carbs || 0)}g · F ${Number(food.fat || 0)}g · Fiber ${Number(food.fiber || 0)}g</span>
            </div>
            <button type="button" data-delete-food="${mealIndex}:${foodIndex}">Delete</button>
          </div>
        `).join("")
        : `<p class="support-copy">No foods logged in this meal yet.</p>`;
      return `
        <details class="meal-card" ${open ? "open" : ""}>
          <summary>
            <div><span>Meal ${mealIndex + 1}</span><strong>${Math.round(mealTotals.calories)} cal</strong></div>
            <div class="meal-macros">
              <span>P ${Math.round(mealTotals.protein)}g</span>
              <span>C ${Math.round(mealTotals.carbs)}g</span>
              <span>F ${Math.round(mealTotals.fat)}g</span>
              <span>Fiber ${Math.round(mealTotals.fiber)}g</span>
            </div>
          </summary>
          <div class="meal-foods">${foodRows}</div>
          <div class="add-food-grid">
            <input data-food-field="name" data-meal-index="${mealIndex}" placeholder="Food name" />
            <input data-food-field="serving" data-meal-index="${mealIndex}" placeholder="Serving size" />
            <input data-food-field="calories" data-meal-index="${mealIndex}" type="number" min="0" placeholder="Calories" inputmode="numeric" />
            <input data-food-field="protein" data-meal-index="${mealIndex}" type="number" min="0" placeholder="Protein" inputmode="decimal" />
            <input data-food-field="carbs" data-meal-index="${mealIndex}" type="number" min="0" placeholder="Carbs" inputmode="decimal" />
            <input data-food-field="fat" data-meal-index="${mealIndex}" type="number" min="0" placeholder="Fat" inputmode="decimal" />
            <input data-food-field="fiber" data-meal-index="${mealIndex}" type="number" min="0" placeholder="Fiber" inputmode="decimal" />
            <button class="complete-button" type="button" data-add-food="${mealIndex}">+ Add Food</button>
          </div>
        </details>
      `;
    })
    .join("");
  renderMealBuilder();
}

function mealsForSelectedDay() {
  const day = weekdays[selectedWorkoutIndex()];
  return (state.meal_plans || []).filter(userScoped).filter((meal) => meal.day === "Daily" || meal.day === day);
}

function renderMealBuilder() {
  if (!els.dailyMealPlanView) return;
  const meals = mealsForSelectedDay();
  const totals = meals.reduce((sum, meal) => {
    sum.calories += Number(meal.calories) || 0;
    sum.protein += Number(meal.protein) || 0;
    return sum;
  }, { calories: 0, protein: 0 });
  setText("meal-plan-total", `${Math.round(totals.calories).toLocaleString()} cal · ${Math.round(totals.protein)}g protein`);
  els.dailyMealPlanView.innerHTML = mealSlots.map((slot) => {
    const slotMeals = meals.filter((meal) => meal.time === slot || (slot === "Snack" && meal.time === "Snacks"));
    return `
      <article class="meal-plan-slot">
        <h3>${slot}</h3>
        ${slotMeals.length ? slotMeals.map((meal) => `
          <div class="builder-item">
            <div>
              <strong>${escapeHtml(meal.name)}</strong>
              <span>${escapeHtml(meal.day)} · ${Number(meal.calories || 0)} cal · ${Number(meal.protein || 0)}g protein · C ${Number(meal.carbs || 0)}g · F ${Number(meal.fat || 0)}g</span>
              ${meal.notes ? `<small>${escapeHtml(meal.notes)}</small>` : ""}
            </div>
            <div class="row-actions">
              <button type="button" data-add-meal-template="${meal.id}">Log</button>
              <button type="button" data-copy-meal="${meal.id}">Copy</button>
              <button type="button" data-edit-meal="${meal.id}">Edit</button>
              ${meal.starter ? "" : `<button class="delete-mini" type="button" data-delete-meal="${meal.id}">Delete</button>`}
            </div>
          </div>`).join("") : `<p class="support-copy">No ${slot.toLowerCase()} assigned yet.</p>`}
      </article>
    `;
  }).join("");
}

function supplementItems() {
  return (state.supplements || []).filter(userScoped).filter((item) => item.active !== false);
}

function supplementKey(dateKey, supplementId) {
  return `${currentUserId()}:${dateKey}:${supplementId}`;
}

function supplementStatus(dateKey, supplementId) {
  return state.supplement_logs?.[supplementKey(dateKey, supplementId)]?.status || "";
}

function supplementStats(dateKey) {
  const items = supplementItems();
  const taken = items.filter((item) => supplementStatus(dateKey, item.id) === "taken").length;
  const skipped = items.filter((item) => supplementStatus(dateKey, item.id) === "skipped").length;
  return { total: items.length, taken, skipped, percent: items.length ? Math.round((taken / items.length) * 100) : 0, streak: supplementStreak(dateKey) };
}

function supplementStreak(dateKey) {
  let streak = 0;
  let cursor = dateKey;
  while (true) {
    const stats = supplementStatsNoStreak(cursor);
    if (!stats.total || stats.taken < stats.total) break;
    streak += 1;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

function supplementStatsNoStreak(dateKey) {
  const items = supplementItems();
  const taken = items.filter((item) => supplementStatus(dateKey, item.id) === "taken").length;
  return { total: items.length, taken };
}

function renderSupplements() {
  const key = els.entryDate.value || todayKey();
  const stats = supplementStats(key);
  els.supplementList.innerHTML = supplementItems()
    .map((item) => {
      const status = supplementStatus(key, item.id);
      return `
      <div class="supplement-row ${status ? `is-${status}` : ""}">
        <div>
          <strong>${escapeHtml(item.name)}</strong>
          <span>${escapeHtml(item.dosage)}${escapeHtml(item.unit)} · ${escapeHtml(item.time)} · ${escapeHtml(item.instructions)}</span>
          ${item.notes ? `<small>${escapeHtml(item.notes)}</small>` : ""}
        </div>
        <div class="row-actions">
          <button type="button" data-supplement-status="${item.id}" data-status="taken">${status === "taken" ? "Taken" : "Mark taken"}</button>
          <button type="button" data-supplement-status="${item.id}" data-status="skipped">${status === "skipped" ? "Skipped" : "Skip"}</button>
          <button type="button" data-edit-supplement="${item.id}">Edit</button>
          <button class="delete-mini" type="button" data-delete-supplement="${item.id}">Delete</button>
        </div>
      </div>`;
    })
    .join("") + `
      <div class="builder-summary">
        <strong>${stats.percent}% complete</strong>
        <span>Taken ${stats.taken} / ${stats.total} today · ${stats.streak} day streak</span>
      </div>
    `;
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
  els.caloriesEaten.value = entry.caloriesEaten ?? "";
  els.proteinGrams.value = entry.proteinGrams ?? "";
  els.waterOunces.value = entry.waterOunces ?? "";
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
  entry.caloriesEaten = els.caloriesEaten.value ? Number(els.caloriesEaten.value) : "";
  entry.proteinGrams = els.proteinGrams.value ? Number(els.proteinGrams.value) : "";
  entry.waterOunces = els.waterOunces.value ? Number(els.waterOunces.value) : "";
  entry.workoutDuration = els.workoutDuration.value ? Number(els.workoutDuration.value) : "";
  entry.heartRate = els.heartRate.value ? Number(els.heartRate.value) : "";
  if (Number(entry.proteinGrams) >= selectedProteinGoal()) entry.protein = true;
  if (Number(entry.waterOunces) >= Number(settings().waterTarget || 128)) entry.water = true;
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
  const node = $(id);
  if (node) node.textContent = value;
}

function renderDashboard() {
  const key = els.entryDate.value || todayKey();
  const entry = state.entries[key] || {};
  const score = scoreBreakdown(entry);
  renderWeekSelector();
  const latest = lastWeightEntry();
  const currentSettings = settings();
  const entryCount = entriesSorted().length;
  const currentWeight = latest ? Number(latest[1].weight) : Number(currentSettings.currentWeight || currentSettings.startWeight);
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
  const caloriesGoal = selectedCaloriesGoal();
  const proteinGoal = selectedProteinGoal();
  const waterGoal = Number(currentSettings.waterTarget || 128);
  const foodTotals = nutritionTotals(entry);
  const caloriesCurrent = foodTotals.calories || Number(entry.caloriesEaten) || (entry.caloriesTracked ? caloriesGoal : 0);
  const proteinCurrent = foodTotals.protein || Number(entry.proteinGrams) || (entry.protein ? proteinGoal : 0);
  const waterCurrent = Number(entry.waterOunces) || (entry.water ? waterGoal : 0);
  const stepsCurrent = Number(entry.steps) || 0;
  const cardioCurrent = Number(entry.cardioMinutes) || 0;
  const dayIndex = selectedWorkoutIndex();
  const plan = workoutForDay(dayIndex);
  const workoutPercent = workoutCompletion(entry, dayIndex);
  const workoutStatus = entry.workout ? "Completed" : workoutPercent > 0 ? "In Progress" : "Not Started";
  const suppStats = supplementStats(key);

  setText("dash-calories-current", caloriesCurrent.toLocaleString());
  setText("dash-calories-goal", caloriesGoal.toLocaleString());
  setText("dash-calories-remaining", Math.max(0, caloriesGoal - caloriesCurrent).toLocaleString());
  setText("dash-calories-badge", Math.round(caloriesCurrent / 1000).toLocaleString());
  setText("dash-protein-current", `${proteinCurrent.toLocaleString()}g`);
  setText("dash-protein-goal", `${proteinGoal.toLocaleString()}g`);
  setText("dash-nutrition-percent", `${Math.round(((Math.min(caloriesCurrent / caloriesGoal, 1) + Math.min(proteinCurrent / proteinGoal, 1)) / 2) * 100)}%`);
  ring(els.dashCalorieRing, (caloriesCurrent / caloriesGoal) * 100);
  if (els.dashCalorieRing) els.dashCalorieRing.style.setProperty("--pct2", Math.max(0, Math.min(100, Math.round((proteinCurrent / proteinGoal) * 100))));
  ring(els.dashProteinRing, (proteinCurrent / proteinGoal) * 100);
  setText("dash-water-current", waterCurrent.toLocaleString());
  setText("dash-water-goal", `/${waterGoal.toLocaleString()} oz`);
  setText("dash-water-remaining", `${Math.max(0, waterGoal - waterCurrent).toLocaleString()}oz Left`);
  setText("dash-water-badge", Math.round(waterCurrent / 16).toLocaleString());
  ring(els.dashWaterRing, (waterCurrent / waterGoal) * 100);
  setText("dash-steps-current", stepsCurrent.toLocaleString());
  setText("dash-steps-goal", `/${Number(currentSettings.stepTarget).toLocaleString()}`);
  setText("dash-steps-remaining", stepsCurrent >= Number(currentSettings.stepTarget) ? "Complete" : `${Math.max(0, Number(currentSettings.stepTarget) - stepsCurrent).toLocaleString()} Left`);
  setText("dash-steps-badge", Math.round(stepsCurrent / 1000).toLocaleString());
  ring(els.dashStepsRing, (stepsCurrent / Number(currentSettings.stepTarget)) * 100);
  setText("dash-workout-day", plan.day.toUpperCase());
  setText("dash-workout-name", isRestWorkout(dayIndex) ? "Recovery Day" : plan.title.replace(" + cardio", ""));
  setText("dash-workout-percent", `${workoutPercent}%`);
  setText("dash-workout-status", workoutStatus);
  setText("dash-workout-badge", entry.workout ? "1" : "0");
  els.dashWorkoutProgress.style.width = `${workoutPercent}%`;
  setText("dash-cardio-current", `${cardioCurrent.toLocaleString()} min`);
  setText("dash-cardio-goal", `Goal ${Number(currentSettings.cardioTarget).toLocaleString()} min`);
  ring(els.dashCardioRing, (cardioCurrent / Number(currentSettings.cardioTarget)) * 100);
  setText("dash-supplements-current", suppStats.taken);
  setText("dash-supplements-goal", `/${suppStats.total} today`);
  setText("dash-supplements-status", `Taken ${suppStats.taken} / ${suppStats.total} today`);
  setText("dash-supplement-streak", `${suppStats.streak}d`);
  ring(els.dashSupplementRing, suppStats.percent);
  renderAchievements(key);

  setText("today-score", `${formatScore(score.main)}/10`);
  setText("topbar-date-label", formatDate(key, { weekday: "short", month: "short", day: "numeric" }));
  setText("topbar-score-label", `${formatScore(score.main)}/10`);
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
  const cleanState = violationCount ? "Review" : "On track";
  els.todaySummary.innerHTML = `
    <div><span>Weight</span><strong>${loggedValue(entry.weight, (value) => `${Number(value).toFixed(1)} lb`)}</strong></div>
    <div><span>Steps</span><strong>${loggedValue(entry.steps, (value) => Number(value).toLocaleString())}</strong></div>
    <div><span>Cardio</span><strong>${loggedValue(entry.cardioMinutes, (value) => `${Number(value)} min`)}</strong></div>
    <div><span>Protein</span><strong>${yesNo(entry.protein)}</strong></div>
    <div><span>1st Phorm</span><strong>${yesNo(entry.caloriesTracked)}</strong></div>
    <div><span>Nutrition compliance</span><strong>${hasData ? cleanState : "<em>Not logged</em>"}</strong></div>
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
    ["Nutrition compliant", hasEntryData(entry) && countViolations(entry) === 0],
    ["No sugary drink", hasEntryData(entry) && countViolations(entry) === 0 && !entry.temptations?.soda],
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
  const dashboardDays = lastNDays(key, 14);
  const range = Number(state.progressRange || 7);
  const progressDays = lastNDays(key, range);
  const series = (days, getter) => days.map((item) => getter(item[1], item[0]));
  const weights = series(dashboardDays, (entry) => (Number(entry.weight) > 0 ? Number(entry.weight) : null));
  const scores = series(dashboardDays, (entry) => (hasEntryData(entry) ? scoreBreakdown(entry).main : null));
  const loggedDays = scores.filter((score) => score != null).length;
  const steps = series(dashboardDays, (entry) => (Number(entry.steps) > 0 ? Number(entry.steps) : null));
  const cardio = series(dashboardDays, (entry) => (Number(entry.cardioMinutes) > 0 ? Number(entry.cardioMinutes) : null));
  const progressWeights = series(progressDays, (entry) => (Number(entry.weight) > 0 ? Number(entry.weight) : null));
  const progressCalories = series(progressDays, (entry) => {
    const total = nutritionTotals(entry).calories || Number(entry.caloriesEaten);
    return total > 0 ? total : null;
  });
  const progressProtein = series(progressDays, (entry) => {
    const total = nutritionTotals(entry).protein || Number(entry.proteinGrams);
    return total > 0 ? total : null;
  });
  const progressSteps = series(progressDays, (entry) => (Number(entry.steps) > 0 ? Number(entry.steps) : null));
  const progressWater = series(progressDays, (entry) => {
    const water = Number(entry.waterOunces) || (entry.water ? Number(settings().waterTarget || 128) : 0);
    return water > 0 ? water : null;
  });
  const progressCardio = series(progressDays, (entry) => (Number(entry.cardioMinutes) > 0 ? Number(entry.cardioMinutes) : null));
  const progressWorkouts = progressDays.map(([dayKey, entry]) => hasEntryData(entry) ? workoutCompletion(entry, (parseDate(dayKey).getDay() + 6) % 7) : null);
  els.chartWeight.innerHTML = chartSvg(weights, { label: "Weight trend" });
  els.chartScore.innerHTML = chartSvg(scores, { label: "Daily score trend", min: 0, max: 10 });
  els.chartSteps.innerHTML = chartSvg(steps, { label: "Steps trend", type: "bar", min: 0 });
  els.chartCardio.innerHTML = chartSvg(cardio, { label: "Cardio minutes trend", type: "bar", min: 0 });
  document.querySelectorAll("[data-progress-range]").forEach((button) => button.classList.toggle("is-active", Number(button.dataset.progressRange) === range));
  ["weight", "calories", "protein", "steps", "water", "cardio", "workouts"].forEach((name) => setText(`progress-${name}-range`, `${range} days`));
  if (els.progressChartWeight) els.progressChartWeight.innerHTML = chartSvg(progressWeights, { label: "Weight trend" });
  if (els.progressChartCalories) els.progressChartCalories.innerHTML = chartSvg(progressCalories, { label: "Calories trend", type: "bar", min: 0 });
  if (els.progressChartProtein) els.progressChartProtein.innerHTML = chartSvg(progressProtein, { label: "Protein trend", type: "bar", min: 0 });
  if (els.progressChartSteps) els.progressChartSteps.innerHTML = chartSvg(progressSteps, { label: "Steps trend", type: "bar", min: 0 });
  if (els.progressChartWater) els.progressChartWater.innerHTML = chartSvg(progressWater, { label: "Water trend", type: "bar", min: 0 });
  if (els.progressChartCardio) els.progressChartCardio.innerHTML = chartSvg(progressCardio, { label: "Cardio trend", type: "bar", min: 0 });
  if (els.progressChartWorkouts) els.progressChartWorkouts.innerHTML = chartSvg(progressWorkouts, { label: "Workout compliance trend", type: "bar", min: 0, max: 100 });
}

function renderWeekly() {
  const key = els.entryDate.value || todayKey();
  const weekEnd = key;
  const weekStart = addDays(key, -6);
  const stats = weeklyStats(key);
  const onTrack = stats.averageScore >= 8 && stats.noGrazing >= 6 && (stats.weightLoss == null || stats.weightLoss >= 1);
  const bestLoss = bestWeek((week) => week.weightLoss);
  const bestCompliance = bestWeek((week) => week.loggedDays >= 3 ? week.compliance : null);
  const bestSteps = bestWeek((week) => week.loggedDays >= 3 ? week.totalSteps : null);

  setText("week-range", `${formatDate(weekStart)} - ${formatDate(weekEnd)}`);
  setText("review-weight", stats.averageWeight ? `${stats.averageWeight.toFixed(1)} lb` : "--");
  const hasWeekData = stats.loggedDays > 0;
  setText("review-score", hasWeekData ? stats.averageScore.toFixed(1) : "--");
  setText("review-cardio", hasWeekData ? stats.cardio : "--");
  setText("review-steps", hasWeekData ? Math.round(stats.steps).toLocaleString() : "--");
  setText("review-grazing", hasWeekData ? `${stats.noGrazing}/${stats.loggedDays}` : "--");
  const enoughForJudgment = stats.loggedDays >= 3;
  const statusText = !hasWeekData ? "No check-ins yet" : !enoughForJudgment ? "Building baseline" : onTrack ? "On track" : "Tighten up";
  setText("review-status", statusText);
  setText("review-best-loss", bestLoss ? `${bestLoss.value.toFixed(1)} lb` : "--");
  setText("review-best-compliance", bestCompliance ? `${bestCompliance.value}%` : "--");
  setText("review-best-steps", bestSteps ? Math.round(bestSteps.value).toLocaleString() : "--");
  setText("review-current-streak", `${cleanStreakEnding(key)} days`);
  setText("review-best-clean-streak", `${bestCleanStreak()} days`);
  setText("review-violations", hasWeekData ? stats.violations : "--");
  $("review-status").className = hasWeekData && enoughForJudgment && onTrack ? "status-good" : "status-warn";
}

function renderCoach() {
  if (!els.coachInsights) return;
  const key = els.entryDate.value || todayKey();
  const days = lastNDays(key, 7);
  const calories = days.map(([, entry]) => nutritionTotals(entry).calories || Number(entry.caloriesEaten)).filter(Boolean);
  const protein = days.map(([, entry]) => nutritionTotals(entry).protein || Number(entry.proteinGrams)).filter(Boolean);
  const steps = days.map(([, entry]) => Number(entry.steps)).filter(Boolean);
  const water = days.map(([, entry]) => Number(entry.waterOunces) || (entry.water ? Number(settings().waterTarget || 128) : 0)).filter(Boolean);
  const cardio = days.map(([, entry]) => Number(entry.cardioMinutes)).filter(Boolean);
  const weekly = weeklyWeightLossEnding(key);
  const avgCalories = average(calories);
  const avgProtein = average(protein);
  const avgSteps = average(steps);
  const avgWater = average(water);
  const avgCardio = average(cardio);
  const loggedMetrics = [avgCalories, avgProtein, avgSteps, avgWater, avgCardio].filter((value) => value != null).length;
  const enoughData = loggedMetrics >= 2 || entriesSorted().length >= 3;
  const focus = !enoughData
    ? "Log today’s weight, food, water, steps, and workout to unlock useful coaching."
    : !avgWater
      ? `Start logging water toward your ${Number(settings().waterTarget || 128)} oz/day goal.`
      : avgWater < Number(settings().waterTarget || 128)
        ? `Bring water up by about ${Math.max(8, Math.round((Number(settings().waterTarget || 128) - avgWater) / 8) * 8)} oz/day.`
        : !avgProtein
          ? `Start logging protein toward your ${selectedProteinGoal()}g/day goal.`
          : avgProtein < selectedProteinGoal()
            ? `Bring protein up toward ${selectedProteinGoal()}g daily.`
            : avgSteps < Number(settings().stepTarget)
              ? `Push average steps closer to ${Number(settings().stepTarget).toLocaleString()}.`
              : "Keep execution steady and watch the 7-day weight trend.";

  setText("coach-projection", weekly == null ? "Build data" : `${Math.max(0, weekly).toFixed(1)} lb/wk`);
  els.coachInsights.innerHTML = `
    ${!enoughData ? `<div class="coach-empty"><span>Coaching status</span><strong>Building baseline</strong><small>Log at least 3 days or two tracked metrics before FORGED makes performance judgments.</small></div>` : ""}
    <div><span>Average calories</span><strong>${avgCalories ? Math.round(avgCalories).toLocaleString() : "--"}</strong></div>
    <div><span>Average protein</span><strong>${avgProtein ? `${Math.round(avgProtein)}g` : "--"}</strong></div>
    <div><span>Average steps</span><strong>${avgSteps ? Math.round(avgSteps).toLocaleString() : "--"}</strong></div>
    <div><span>Average water</span><strong>${avgWater ? `${Math.round(avgWater)} oz` : "--"}</strong></div>
    <div><span>Cardio average</span><strong>${avgCardio ? `${Math.round(avgCardio)} min` : "--"}</strong></div>
    <div><span>Next focus</span><strong>${focus}</strong></div>
  `;
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
  els.settingUserName.value = current.userName || "";
  els.settingGoalType.value = current.goalType || "lose fat";
  els.settingCurrentWeight.value = current.currentWeight || current.startWeight;
  els.settingStartWeight.value = current.startWeight;
  els.settingGoalWeight.value = current.goalWeight;
  els.settingGoalDate.value = current.goalDate;
  els.settingProteinTarget.value = current.proteinTarget;
  els.settingStepTarget.value = current.stepTarget;
  els.settingCardioTarget.value = current.cardioTarget;
  els.settingWaterTarget.value = current.waterTarget;
  els.settingWorkoutDays.value = current.workoutDays || "";
  els.settingUnits.value = current.preferredUnits || "imperial";
  els.settingTheme.value = current.theme || "dark";
  els.settingTrainingCalories.value = current.trainingCalories;
  els.settingRestCalories.value = current.restCalories;
  const user = state.users?.find((item) => item.id === currentUserId());
  if (user) user.name = current.userName || "Demo User";
  state.user_profiles[currentUserId()] = { userId: currentUserId(), ...current };
  state.goals[currentUserId()] = current;
}

function renderAdmin() {
  if (!els.adminMetrics) return;
  const key = els.entryDate.value || todayKey();
  const entry = state.entries[key] || {};
  const stats = supplementStats(key);
  const meals = mealsForSelectedDay();
  const mealLogged = nutritionTotals(entry).calories > 0;
  const activeToday = hasEntryData(entry) ? 1 : 0;
  const latest = lastWeightEntry();
  const seven = sevenDayAverage(key);
  const workout = workoutsByDayCompletion(key);
  const stepPct = Math.round(((Number(entry.steps) || 0) / Math.max(1, Number(settings().stepTarget))) * 100);
  const mealPct = meals.length ? (mealLogged ? 100 : 0) : 0;
  const totalUsers = state.users?.length || 1;
  const values = [
    ["Total demo users", totalUsers, "Private beta roster"],
    ["Active today", `${activeToday} of ${totalUsers}`, `${Math.round((activeToday / Math.max(1, totalUsers)) * 100)}% active today`],
    ["Workout completion", `${workout}%`, "Selected day"],
    ["Meal plan completion", `${mealPct}%`, mealLogged ? "Food logged today" : "No meals logged today"],
    ["Supplement completion", `${stats.percent}%`, `Taken ${stats.taken} of ${stats.total}`],
    ["Step goal completion", `${Math.min(100, stepPct)}%`, `${Number(entry.steps || 0).toLocaleString()} / ${Number(settings().stepTarget).toLocaleString()} steps`],
    ["Weight trend", latest ? `${Number(latest[1].weight).toFixed(1)} lb${seven ? ` · 7-day ${seven.toFixed(1)}` : ""}` : "--", latest ? "Latest logged weight" : "Requires at least one weigh-in"],
  ];
  els.adminMetrics.innerHTML = `
    <div class="admin-context">
      <strong>Owner dashboard</strong>
      <span>Viewing ${formatDate(key, { weekday: "short", month: "short", day: "numeric" })} · Updated ${new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</span>
    </div>
    ${values.map(([label, value, helper]) => `
      <article class="metric-card">
        <span>${label}</span>
        <strong>${value}</strong>
        <small>${helper}</small>
      </article>
    `).join("")}
    <div class="admin-actions">
      <button type="button" data-open-tab="weekly">Open weekly review</button>
      <button type="button" data-open-tab="settings">Export / settings</button>
      <button type="button" data-open-tab="progress">View progress</button>
    </div>
  `;
}

function renderAll() {
  renderHabits();
  renderMission();
  renderCheckinWorkout();
  renderDashboard();
  renderNutrition();
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
  renderCoach();
  renderHistory();
  renderSettings();
  renderWorkoutBuilder();
  renderAdmin();
}

function cacheElements() {
  [
    "today-score",
    "today-bonus",
    "today-total",
    "today-streak",
    "topbar-date-label",
    "topbar-score-label",
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
    "week-selector",
    "dash-nutrition-percent",
    "dash-calorie-ring",
    "dash-protein-ring",
    "dash-calories-current",
    "dash-calories-goal",
    "dash-calories-remaining",
    "dash-calories-badge",
    "dash-protein-current",
    "dash-protein-goal",
    "dash-water-ring",
    "dash-water-current",
    "dash-water-goal",
    "dash-water-remaining",
    "dash-water-badge",
    "dash-steps-ring",
    "dash-steps-current",
    "dash-steps-goal",
    "dash-steps-remaining",
    "dash-steps-badge",
    "dash-workout-day",
    "dash-workout-name",
    "dash-workout-percent",
    "dash-workout-progress",
    "dash-workout-status",
    "dash-workout-badge",
    "dash-cardio-ring",
    "dash-cardio-current",
    "dash-cardio-goal",
    "dash-supplement-ring",
    "dash-supplements-current",
    "dash-supplements-goal",
    "dash-supplements-status",
    "dash-supplement-streak",
    "dash-badge-count",
    "dash-achievements",
    "copy-yesterday",
    "nutrition-calories-current",
    "nutrition-calories-goal",
    "nutrition-calories-remaining",
    "nutrition-calories-bar",
    "nutrition-protein-current",
    "nutrition-protein-goal",
    "nutrition-protein-remaining",
    "nutrition-protein-bar",
    "nutrition-carbs-current",
    "nutrition-carbs-goal",
    "nutrition-carbs-remaining",
    "nutrition-carbs-bar",
    "nutrition-fat-current",
    "nutrition-fat-goal",
    "nutrition-fat-remaining",
    "nutrition-fat-bar",
    "nutrition-fiber-current",
    "nutrition-fiber-goal",
    "nutrition-fiber-remaining",
    "nutrition-fiber-bar",
    "nutrition-water-current",
    "nutrition-water-goal",
    "nutrition-water-remaining",
    "nutrition-water-bar",
    "favorite-foods",
    "save-favorite-food",
    "meal-list",
    "daily-meal-plan-view",
    "meal-plan-total",
    "meal-builder-form",
    "meal-builder-id",
    "meal-builder-time",
    "meal-builder-day",
    "meal-builder-name",
    "meal-builder-calories",
    "meal-builder-protein",
    "meal-builder-carbs",
    "meal-builder-fat",
    "meal-builder-notes",
    "meal-builder-reset",
    "entry-date",
    "prev-day",
    "next-day",
    "weight",
    "sleep",
    "steps",
    "cardio-minutes",
    "active-calories",
    "calories-eaten",
    "protein-grams",
    "water-ounces",
    "activity-body-updates",
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
    "workout-builder-list",
    "workout-builder-form",
    "workout-builder-id",
    "workout-builder-name",
    "workout-builder-day",
    "workout-builder-muscle",
    "workout-builder-cardio",
    "workout-builder-rest",
    "workout-builder-restday",
    "workout-builder-exercises",
    "workout-builder-notes",
    "workout-builder-reset",
    "meal-plan",
    "meal-options",
    "meal-log",
    "supplement-list",
    "supplement-builder-form",
    "supplement-builder-id",
    "supplement-name",
    "supplement-dosage",
    "supplement-unit",
    "supplement-time",
    "supplement-instructions",
    "supplement-notes",
    "supplement-builder-reset",
    "picture-inputs",
    "progress-week-label",
    "measurement-inputs",
    "measurement-history",
    "chart-weight",
    "chart-score",
    "chart-steps",
    "chart-cardio",
    "progress-chart-weight",
    "progress-chart-calories",
    "progress-chart-protein",
    "progress-chart-steps",
    "progress-chart-water",
    "progress-chart-cardio",
    "progress-chart-workouts",
    "coach-insights",
    "coach-projection",
    "setting-start-weight",
    "setting-user-name",
    "setting-goal-type",
    "setting-current-weight",
    "setting-goal-weight",
    "setting-goal-date",
    "setting-protein-target",
    "setting-step-target",
    "setting-cardio-target",
    "setting-water-target",
    "setting-workout-days",
    "setting-units",
    "setting-theme",
    "setting-training-calories",
    "setting-rest-calories",
    "export-data",
    "import-data",
    "clear-all-data",
    "data-status",
    "dashboard-go-checkin",
    "auth-gate",
    "show-signup",
    "show-login",
    "signup-form",
    "signup-name",
    "signup-email",
    "signup-password",
    "signup-start-weight",
    "signup-goal-weight",
    "signup-goal-date",
    "login-form",
    "login-email",
    "login-password",
    "auth-status",
    "progress-status",
    "open-admin",
    "admin-metrics",
  ].forEach((id) => {
    els[id.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())] = $(id);
  });
}

function bindAuthGate() {
  const sessionUser = activeSessionUser();
  if (sessionUser) {
    applyAuthenticatedUser(sessionUser, { save: false });
    els.authGate.hidden = true;
  } else {
    els.authGate.hidden = false;
  }

  els.signupStartWeight.value ||= START_WEIGHT;
  els.signupGoalWeight.value ||= GOAL_WEIGHT;
  els.signupGoalDate.value ||= TARGET_DATE;
  els.showSignup.addEventListener("click", () => setAuthMode("signup"));
  els.showLogin.addEventListener("click", () => setAuthMode("login"));

  els.signupForm.addEventListener("submit", (event) => {
    event.preventDefault();
    try {
      const user = createAuthUser({
        name: els.signupName.value,
        email: els.signupEmail.value,
        password: els.signupPassword.value,
        startWeight: els.signupStartWeight.value,
        goalWeight: els.signupGoalWeight.value,
        goalDate: els.signupGoalDate.value,
      });
      applyAuthenticatedUser(user);
      els.authGate.hidden = true;
      loadForm();
      authStatus(`Welcome, ${user.name}. Your FORGED account is saved on this device.`, "status-good");
    } catch (error) {
      authStatus(error.message, "status-bad");
    }
  });

  els.loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    try {
      const user = signInAuthUser(els.loginEmail.value, els.loginPassword.value);
      applyAuthenticatedUser(user);
      els.authGate.hidden = true;
      loadForm();
      authStatus(`Welcome back, ${user.name}.`, "status-good");
    } catch (error) {
      authStatus(error.message, "status-bad");
    }
  });
}

function activatePanel(panelId) {
  document.querySelectorAll(".tab").forEach((item) => item.classList.toggle("is-active", item.dataset.tab === panelId));
  document.querySelectorAll(".tab-panel").forEach((panel) => panel.classList.remove("is-active"));
  $(panelId)?.classList.add("is-active");
}

function bindEvents() {
  bindAuthGate();
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      activatePanel(tab.dataset.tab);
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

  [els.weight, els.sleep, els.steps, els.cardioMinutes, els.activeCalories, els.caloriesEaten, els.proteinGrams, els.waterOunces, els.workoutDuration, els.heartRate, els.manualWatchImport, els.habitList].forEach((node) => {
    node.addEventListener("input", updateEntryFromForm);
    node.addEventListener("change", updateEntryFromForm);
  });

  els.weekSelector.addEventListener("click", (event) => {
    const button = event.target.closest("[data-week-day]");
    if (!button) return;
    els.entryDate.value = button.dataset.weekDay;
    loadForm();
  });

  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-open-tab]");
    if (!button) return;
    activatePanel(button.dataset.openTab);
    $(button.dataset.openTab)?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  els.openAdmin.addEventListener("click", () => {
    window.location.hash = "admin";
    activatePanel("admin");
    renderAdmin();
  });

  document.querySelectorAll("[data-progress-range]").forEach((button) => {
    button.addEventListener("click", () => {
      state.progressRange = Number(button.dataset.progressRange) || 7;
      saveState();
      renderCharts();
    });
  });

  document.querySelectorAll("[data-water-add]").forEach((button) => {
    button.addEventListener("click", () => {
      const entry = currentEntry();
      entry.waterOunces = Math.min(300, (Number(entry.waterOunces) || 0) + Number(button.dataset.waterAdd));
      if (entry.waterOunces >= Number(settings().waterTarget || 128)) entry.water = true;
      saveState();
      loadForm();
    });
  });

  els.copyYesterday.addEventListener("click", () => {
    const yesterday = state.entries[addDays(els.entryDate.value, -1)] || {};
    const sourceMeals = Array.isArray(yesterday.nutritionMeals) ? yesterday.nutritionMeals : null;
    if (!sourceMeals || !sourceMeals.flat().length) {
      showSaveStatus("Yesterday has no meals to copy.", "status-warn");
      return;
    }
    const entry = currentEntry();
    entry.nutritionMeals = JSON.parse(JSON.stringify(sourceMeals));
    const totals = nutritionTotals(entry);
    entry.caloriesEaten = totals.calories || "";
    entry.proteinGrams = totals.protein || "";
    saveState("Copied yesterday's meals");
    loadForm();
  });

  els.saveFavoriteFood.addEventListener("click", () => {
    if (!state.lastFood) {
      showSaveStatus("Add a food first, then save it as a favorite.", "status-warn");
      return;
    }
    state.favoriteFoods ||= defaultFavoriteFoods;
    const exists = state.favoriteFoods.some((food) => food.name.toLowerCase() === state.lastFood.name.toLowerCase() && food.serving.toLowerCase() === state.lastFood.serving.toLowerCase());
    if (!exists) state.favoriteFoods.push({ ...state.lastFood });
    saveState("Favorite food saved");
    renderNutrition();
  });

  els.favoriteFoods.addEventListener("click", (event) => {
    const button = event.target.closest("[data-favorite-index]");
    if (!button) return;
    const favorite = (state.favoriteFoods || defaultFavoriteFoods)[Number(button.dataset.favoriteIndex)];
    if (!favorite) return;
    addFoodToMeal(0, favorite);
  });

  els.mealList.addEventListener("click", (event) => {
    const addButton = event.target.closest("[data-add-food]");
    const deleteButton = event.target.closest("[data-delete-food]");
    if (addButton) {
      const mealIndex = Number(addButton.dataset.addFood);
      const fields = {};
      els.mealList.querySelectorAll(`[data-meal-index="${mealIndex}"]`).forEach((input) => {
        fields[input.dataset.foodField] = input.value;
      });
      if (!String(fields.name || "").trim()) {
        showSaveStatus("Food name is required.", "status-warn");
        return;
      }
      addFoodToMeal(mealIndex, fields);
    }
    if (deleteButton) {
      const [mealIndex, foodIndex] = deleteButton.dataset.deleteFood.split(":").map(Number);
      const entry = currentEntry();
      nutritionMeals(entry)[mealIndex].splice(foodIndex, 1);
      const totals = nutritionTotals(entry);
      entry.caloriesEaten = totals.calories || "";
      entry.proteinGrams = totals.protein || "";
      saveState("Food deleted");
      loadForm();
    }
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

  els.confirmCleanDay?.addEventListener("click", () => {
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
    ["settingUserName", "userName", String],
    ["settingGoalType", "goalType", String],
    ["settingCurrentWeight", "currentWeight", Number],
    ["settingStartWeight", "startWeight", Number],
    ["settingGoalWeight", "goalWeight", Number],
    ["settingGoalDate", "goalDate", String],
    ["settingProteinTarget", "proteinTarget", String],
    ["settingStepTarget", "stepTarget", Number],
    ["settingCardioTarget", "cardioTarget", Number],
    ["settingWaterTarget", "waterTarget", Number],
    ["settingWorkoutDays", "workoutDays", String],
    ["settingUnits", "preferredUnits", String],
    ["settingTheme", "theme", String],
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
    link.download = `forged-backup-${todayKey()}.json`;
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
        els.dataStatus.textContent = `Import failed: ${error.message}. Choose a FORGED JSON backup.`;
        els.dataStatus.className = "support-copy status-bad";
      } finally {
        els.importData.value = "";
      }
    });
    reader.readAsText(file);
  });

  els.clearAllData.addEventListener("click", () => {
    if (!window.confirm("Clear all FORGED data from this browser? Export a backup first if you may need it.")) return;
    if (window.prompt("Type CLEAR to permanently delete all local tracker data.") !== "CLEAR") return;
    localStorage.removeItem(STORAGE_KEY);
    state = { entries: {}, customSupplements: [], measurements: {}, progressPictures: {}, settings: { ...DEFAULT_SETTINGS } };
    ensurePlatformState();
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

  els.workoutBuilderList.addEventListener("click", (event) => {
    const edit = event.target.closest("[data-edit-workout]");
    const copy = event.target.closest("[data-copy-workout]");
    const del = event.target.closest("[data-delete-workout]");
    const id = edit?.dataset.editWorkout || copy?.dataset.copyWorkout || del?.dataset.deleteWorkout;
    const template = (state.workout_templates || []).find((item) => item.id === id);
    if (!template) return;
    if (del) {
      state.workout_templates = state.workout_templates.filter((item) => item.id !== id);
      saveState("Workout deleted");
      renderAll();
      return;
    }
    els.workoutBuilderId.value = copy ? "" : template.id;
    els.workoutBuilderName.value = copy ? `${template.name} Custom` : template.name;
    els.workoutBuilderDay.value = template.day;
    els.workoutBuilderMuscle.value = template.muscleGroup || "";
    els.workoutBuilderCardio.value = template.cardio || "";
    els.workoutBuilderRest.value = template.restTime || "";
    els.workoutBuilderRestday.checked = Boolean(template.isRestDay);
    els.workoutBuilderExercises.value = exerciseText(template);
    els.workoutBuilderNotes.value = template.notes || "";
    els.workoutBuilderForm.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  els.workoutBuilderForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = els.workoutBuilderName.value.trim();
    if (!name) { showSaveStatus("Workout name is required.", "status-warn"); return; }
    const id = els.workoutBuilderId.value || uid("workout");
    const next = {
      id,
      userId: currentUserId(),
      name,
      day: els.workoutBuilderDay.value,
      muscleGroup: els.workoutBuilderMuscle.value.trim(),
      cardio: els.workoutBuilderCardio.value.trim(),
      restTime: els.workoutBuilderRest.value.trim(),
      isRestDay: els.workoutBuilderRestday.checked,
      notes: els.workoutBuilderNotes.value.trim(),
      exercises: parseExerciseText(els.workoutBuilderExercises.value),
      starter: false,
    };
    state.workout_templates = (state.workout_templates || []).filter((item) => item.id !== id && !(item.day === next.day && !item.starter && item.userId === currentUserId()));
    state.workout_templates.push(next);
    els.workoutBuilderForm.reset();
    els.workoutBuilderId.value = "";
    saveState("Workout saved");
    renderAll();
  });

  els.workoutBuilderReset.addEventListener("click", () => {
    els.workoutBuilderForm.reset();
    els.workoutBuilderId.value = "";
  });

  els.temptationList?.addEventListener("click", (event) => {
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

  els.dailyMealPlanView.addEventListener("click", (event) => {
    const add = event.target.closest("[data-add-meal-template]");
    const copy = event.target.closest("[data-copy-meal]");
    const edit = event.target.closest("[data-edit-meal]");
    const del = event.target.closest("[data-delete-meal]");
    const id = add?.dataset.addMealTemplate || copy?.dataset.copyMeal || edit?.dataset.editMeal || del?.dataset.deleteMeal;
    const meal = (state.meal_plans || []).find((item) => item.id === id);
    if (!meal) return;
    if (add) {
      addFoodToMeal(mealSlots.indexOf(meal.time === "Snack" ? "Snack" : meal.time), { ...meal, serving: meal.day });
      return;
    }
    if (del) {
      state.meal_plans = state.meal_plans.filter((item) => item.id !== id);
      state.meals = state.meal_plans;
      saveState("Meal deleted");
      renderAll();
      return;
    }
    els.mealBuilderId.value = copy ? "" : meal.id;
    els.mealBuilderTime.value = meal.time;
    els.mealBuilderDay.value = copy ? weekdays[(weekdays.indexOf(meal.day) + 1) % 7] || "Daily" : meal.day;
    els.mealBuilderName.value = copy ? `${meal.name} Copy` : meal.name;
    els.mealBuilderCalories.value = meal.calories || "";
    els.mealBuilderProtein.value = meal.protein || "";
    els.mealBuilderCarbs.value = meal.carbs || "";
    els.mealBuilderFat.value = meal.fat || "";
    els.mealBuilderNotes.value = meal.notes || "";
    els.mealBuilderForm.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  els.mealBuilderForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = els.mealBuilderName.value.trim();
    if (!name) { showSaveStatus("Meal name is required.", "status-warn"); return; }
    const id = els.mealBuilderId.value || uid("meal");
    const next = {
      id,
      userId: currentUserId(),
      day: els.mealBuilderDay.value,
      time: els.mealBuilderTime.value,
      name,
      calories: Number(els.mealBuilderCalories.value) || 0,
      protein: Number(els.mealBuilderProtein.value) || 0,
      carbs: Number(els.mealBuilderCarbs.value) || 0,
      fat: Number(els.mealBuilderFat.value) || 0,
      notes: els.mealBuilderNotes.value.trim(),
      favorite: true,
      starter: false,
    };
    state.meal_plans = (state.meal_plans || []).filter((item) => item.id !== id);
    state.meal_plans.push(next);
    state.meals = state.meal_plans;
    els.mealBuilderForm.reset();
    els.mealBuilderId.value = "";
    saveState("Meal saved");
    renderAll();
  });

  els.mealBuilderReset.addEventListener("click", () => {
    els.mealBuilderForm.reset();
    els.mealBuilderId.value = "";
  });

  els.supplementList.addEventListener("click", (event) => {
    const statusButton = event.target.closest("[data-supplement-status]");
    const editButton = event.target.closest("[data-edit-supplement]");
    const deleteButton = event.target.closest("[data-delete-supplement]");
    if (statusButton) {
      const logKey = supplementKey(els.entryDate.value || todayKey(), statusButton.dataset.supplementStatus);
      const current = state.supplement_logs[logKey]?.status;
      state.supplement_logs[logKey] = { userId: currentUserId(), supplementId: statusButton.dataset.supplementStatus, date: els.entryDate.value || todayKey(), status: current === statusButton.dataset.status ? "" : statusButton.dataset.status };
      saveState("Supplement log updated");
      renderAll();
    }
    if (editButton) {
      const item = state.supplements.find((supp) => supp.id === editButton.dataset.editSupplement);
      if (!item) return;
      els.supplementBuilderId.value = item.id;
      els.supplementName.value = item.name;
      els.supplementDosage.value = item.dosage;
      els.supplementUnit.value = item.unit;
      els.supplementTime.value = item.time;
      els.supplementInstructions.value = item.instructions;
      els.supplementNotes.value = item.notes || "";
      els.supplementBuilderForm.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    if (deleteButton) {
      const id = deleteButton.dataset.deleteSupplement;
      state.supplements = state.supplements.filter((item) => item.id !== id);
      Object.keys(state.supplement_logs).forEach((key) => { if (key.endsWith(`:${id}`)) delete state.supplement_logs[key]; });
      saveState("Supplement deleted");
      renderAll();
    }
  });

  els.supplementBuilderForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = els.supplementName.value.trim();
    if (!name) { showSaveStatus("Supplement name is required.", "status-warn"); return; }
    const id = els.supplementBuilderId.value || uid("supp");
    const next = normalizeSupplement({
      id,
      userId: currentUserId(),
      name,
      dosage: els.supplementDosage.value.trim(),
      unit: els.supplementUnit.value,
      time: els.supplementTime.value,
      instructions: els.supplementInstructions.value,
      notes: els.supplementNotes.value.trim(),
      active: true,
    });
    state.supplements = (state.supplements || []).filter((item) => item.id !== id);
    state.supplements.push(next);
    els.supplementBuilderForm.reset();
    els.supplementBuilderId.value = "";
    saveState("Supplement saved");
    renderAll();
  });

  els.supplementBuilderReset.addEventListener("click", () => {
    els.supplementBuilderForm.reset();
    els.supplementBuilderId.value = "";
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

function arrangeSections() {
  if (!els.activityBodyUpdates) return;
  document.querySelectorAll("#progress > .weekly-card").forEach((card) => {
    els.activityBodyUpdates.appendChild(card);
  });
}

function init() {
  cacheElements();
  arrangeSections();
  loadState();
  const sessionUser = activeSessionUser();
  if (sessionUser) applyAuthenticatedUser(sessionUser, { save: false });
  renderHabits();
  renderMealPlan();
  els.entryDate.value = todayKey();
  setText("goal-date-line", `Goal by ${formatDate(settings().goalDate, { month: "short", day: "numeric", year: "numeric" })}`);
  bindEvents();
  loadForm();
  if (window.location.hash === "#admin") activatePanel("admin");
}

init();
