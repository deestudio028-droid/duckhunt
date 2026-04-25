const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const hud = {
  root: document.getElementById("hud"),
  score: document.getElementById("scoreValue"),
  hit: document.getElementById("hitValue"),
  misses: document.getElementById("missValue"),
  time: document.getElementById("timeValue"),
  round: document.getElementById("roundValue"),
  wave: document.getElementById("waveValue"),
  statusTip: document.getElementById("statusTip"),
  musicToggle: document.getElementById("hudMusicToggle"),
  webcamToggle: document.getElementById("hudWebcamToggle"),
};

const screens = {
  menu: document.getElementById("menuScreen"),
  results: document.getElementById("endScreen"),
  tutorialHint: document.getElementById("tutorialHint"),
};

const panels = {
  main: document.getElementById("mainMenuPanel"),
  setup: document.getElementById("setupPanel"),
  settings: document.getElementById("settingsPanel"),
  credits: document.getElementById("creditsPanel"),
};

const menuControls = {
  startBtn: document.getElementById("startBtn"),
  tutorialBtn: document.getElementById("tutorialBtn"),
  handSetupBtn: document.getElementById("handSetupBtn"),
  settingsBtn: document.getElementById("settingsBtn"),
  creditsBtn: document.getElementById("creditsBtn"),
  setupBackBtn: document.getElementById("setupBackBtn"),
  setupPlayBtn: document.getElementById("setupPlayBtn"),
  settingsBackBtn: document.getElementById("settingsBackBtn"),
  creditsBackBtn: document.getElementById("creditsBackBtn"),
  permissionNote: document.getElementById("permissionNote"),
};

const setupControls = {
  confidenceMeterFill: document.getElementById("confidenceMeterFill"),
  confidenceText: document.getElementById("confidenceText"),
  sensitivitySlider: document.getElementById("sensitivitySlider"),
  smoothnessSlider: document.getElementById("smoothnessSlider"),
  mirrorToggle: document.getElementById("mirrorToggle"),
  fingerPreview: document.getElementById("fingerPreview"),
  crosshairPreview: document.getElementById("crosshairPreview"),
  pinchPreview: document.getElementById("pinchPreview"),
  testPinchBtn: document.getElementById("testPinchBtn"),
};

const settingsControls = {
  music: document.getElementById("settingMusic"),
  sfx: document.getElementById("settingSfx"),
  webcam: document.getElementById("settingWebcam"),
  dwellSelect: document.getElementById("settingDwellSelect"),
  performance: document.getElementById("settingPerformance"),
  gestureProfile: document.getElementById("gestureProfile"),
  difficulty: document.getElementById("difficultySelect"),
  multiplayerMode: document.getElementById("multiplayerMode"),
  playerOneName: document.getElementById("playerOneName"),
  playerTwoName: document.getElementById("playerTwoName"),
  accessibilityPreset: document.getElementById("accessibilityPreset"),
  largeUi: document.getElementById("settingLargeUi"),
  seatedMode: document.getElementById("settingSeatedMode"),
  crosshairSize: document.getElementById("crosshairSize"),
  fullscreenBtn: document.getElementById("fullscreenBtn"),
};

const resultUI = {
  finalScore: document.getElementById("finalScore"),
  accuracy: document.getElementById("accuracyValue"),
  ducksHit: document.getElementById("ducksHitValue"),
  misses: document.getElementById("resultMissValue"),
  bestCombo: document.getElementById("bestComboValue"),
  xpGained: document.getElementById("xpGainedValue"),
  rank: document.getElementById("rankValue"),
  badges: document.getElementById("badgesValue"),
  replayList: document.getElementById("replayList"),
  leaderboardList: document.getElementById("leaderboardList"),
  signedStatus: document.getElementById("signedStatus"),
  versusResultText: document.getElementById("versusResultText"),
  submitScoreBtn: document.getElementById("submitScoreBtn"),
  retryBtn: document.getElementById("restartBtn"),
  backToMenuBtn: document.getElementById("backToMenuBtn"),
};

const tutorialUI = {
  title: document.getElementById("tutorialTitle"),
  text: document.getElementById("tutorialText"),
  progress: document.getElementById("tutorialProgress"),
};

const missionPanel = document.getElementById("missionPanel");
const missionList = document.getElementById("missionList");
const pauseOverlay = document.getElementById("pauseOverlay");
const resumeBtn = document.getElementById("resumeBtn");
const pauseMenuBtn = document.getElementById("pauseMenuBtn");

const video = document.getElementById("webcam");
const dogPopup = document.getElementById("dogPopup");
const menuHandCursor = document.getElementById("menuHandCursor");

const SETTINGS_KEY = "duckhunt_settings_v3";
const PROFILE_KEY = "duckhunt_profile_v3";
const LEADERBOARD_KEY = "duckhunt_leaderboard_v3";

const config = {
  sensitivity: 1,
  smoothness: 0.4,
  mirror: true,
  difficulty: "normal",
  crosshairSize: 20,
  musicOn: false,
  sfxOn: true,
  webcamOn: true,
  dwellSelect: true,
  gestureProfile: "auto",
  performanceMode: false,
  accessibilityPreset: "default",
  largeUi: false,
  seatedMode: false,
  multiplayerMode: "solo",
  playerOneName: "Player 1",
  playerTwoName: "Player 2",
};

const profile = {
  xp: 0,
  badges: [],
  unlockables: {
    crosshairSkins: ["classic"],
    dogReactions: ["smile"],
    backgroundThemes: ["default"],
    duckPacks: ["classic"],
  },
  personalBest: {
    score: 0,
    accuracy: 0,
    combo: 0,
  },
  missionsDateKey: "",
  missions: [],
};

let leaderboard = [];

const difficultyStats = {
  easy: { speed: 0.86, waveDelay: 1.35, timer: 65 },
  normal: { speed: 1, waveDelay: 1.1, timer: 60 },
  hard: { speed: 1.22, waveDelay: 0.9, timer: 55 },
};

const weatherTypes = ["clear", "wind", "dusk", "fog"];

const tutorialSteps = [
  { title: "Step 1: Show Hand", text: "Show one clear hand to the webcam.", done: (s) => s.handDetected },
  { title: "Step 2: Move to Aim", text: "Move your index finger to move the crosshair.", done: (s) => s.tutorial.aimDistance > 120 },
  { title: "Step 3: Pinch to Shoot", text: "Pinch thumb and index together one time.", done: (s) => s.tutorial.pinchFired },
  { title: "Step 4: Shoot Practice Ducks", text: "Shoot all 3 practice ducks.", done: (s) => s.tutorial.practiceHits >= 3 },
  { title: "Step 5: Complete", text: "Tutorial complete. You are ready to hunt!", done: (s) => s.tutorial.completed },
];

const duckPalettes = [
  { body: "#2d5f2a", belly: "#8ecd55", head: "#ffe082", wing: "#1f441b", beak: "#f4952f", feet: "#c47420" },
  { body: "#27506f", belly: "#6eb2d8", head: "#f5f6f8", wing: "#183a4d", beak: "#f8a64a", feet: "#d5802c" },
  { body: "#6d4f22", belly: "#d7b17c", head: "#fbe3b4", wing: "#523514", beak: "#e58c2a", feet: "#c27118" },
];

const state = {
  appMode: "menu",
  running: false,
  paused: false,
  gameplayMode: "game",
  score: 0,
  hits: 0,
  misses: 0,
  shots: 0,
  bestCombo: 0,
  comboCount: 0,
  lastHitTime: 0,
  comboText: "",
  comboTextTimer: 0,
  timeLeft: 60,
  gameEndTime: 0,
  round: 1,
  wave: 1,
  wavesCleared: 0,
  waveActive: false,
  waveCountdown: 1,
  currentWaveTotal: 0,
  currentWaveEscaped: 0,
  ducks: [],
  particles: [],
  hitFlash: 0,
  dogTimer: 0,
  weather: { type: "clear", wind: 0, fogAlpha: 0, duskAlpha: 0 },
  tutorial: {
    step: 0,
    aimStartX: 0,
    aimStartY: 0,
    aimDistance: 0,
    pinchFired: false,
    practiceHits: 0,
    completed: false,
  },
  missions: [],
  missionsAwarded: false,
  handReady: false,
  handDetected: false,
  handActive: false,
  confidence: 0,
  pinchDown: false,
  pauseHoldTime: 0,
  pauseArmRelease: false,
  lastShotTime: 0,
  shotCooldown: 280,
  lastFrameTime: 0,
  lastIndexX: 0,
  lastIndexY: 0,
  usingMouseShot: false,
  crosshair: {
    x: 0,
    y: 0,
    tx: 0,
    ty: 0,
    lastSeenAt: 0,
    holdSeconds: 2.8,
  },
  menuHoverButton: null,
  menuHoverStart: 0,
  dwellProgress: 0,
  replayEvents: [],
  lastScorePayload: null,
  multiplayer: {
    mode: "solo",
    players: ["Player 1", "Player 2"],
    currentPlayerIndex: 0,
    roundResults: [],
    opponent: {
      active: false,
      name: "Opponent",
      x: -100,
      y: -100,
      pinchDown: false,
      score: 0,
    }
  },
  duckIdCounter: 0,
};

const audio = {
  ctx: null,
  master: null,
  musicTimer: null,
  melodyStep: 0,
};

let hands = null;
let camera = null;

const socket = (typeof io !== 'undefined') ? io() : null;
let currentSeed = 1;
function seededRandom() {
    var x = Math.sin(currentSeed++) * 10000;
    return x - Math.floor(x);
}
function getRandom() {
    return (state.multiplayer && state.multiplayer.mode === 'online') ? seededRandom() : Math.random();
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function rand(min, max) {
  return getRandom() * (max - min) + min;
}

function randInt(min, max) {
  return Math.floor(rand(min, max + 1));
}

function landmarkDist(lm, a, b) {
  const dx = lm[a].x - lm[b].x;
  const dy = lm[a].y - lm[b].y;
  return Math.hypot(dx, dy);
}

function todayKey() {
  const d = new Date();
  return `${d.getUTCFullYear()}-${d.getUTCMonth() + 1}-${d.getUTCDate()}`;
}

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  if (!state.crosshair.x) {
    state.crosshair.x = canvas.width * 0.5;
    state.crosshair.y = canvas.height * 0.5;
    state.crosshair.tx = state.crosshair.x;
    state.crosshair.ty = state.crosshair.y;
  }
}

function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) {
      Object.assign(config, JSON.parse(raw));
    }
  } catch (err) {
    console.error("Settings load failed", err);
  }
}

function saveSettings() {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(config));
  } catch (err) {
    console.error("Settings save failed", err);
  }
}

function loadProfile() {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      Object.assign(profile, parsed);
      profile.personalBest = Object.assign({ score: 0, accuracy: 0, combo: 0 }, parsed.personalBest || {});
      profile.unlockables = Object.assign(profile.unlockables, parsed.unlockables || {});
      if (!Array.isArray(profile.badges)) {
        profile.badges = [];
      }
    }
  } catch (err) {
    console.error("Profile load failed", err);
  }

  if (profile.missionsDateKey !== todayKey()) {
    profile.missionsDateKey = todayKey();
    profile.missions = [
      { id: "combo3", text: "Make a 3-hit combo", target: 1, value: 0, done: false },
      { id: "noMissWave", text: "Finish 2 waves with no misses", target: 2, value: 0, done: false },
      { id: "timedClear", text: "Hit 6 ducks in first 20 seconds", target: 1, value: 0, done: false },
    ];
  }

  state.missions = profile.missions.map((m) => ({ ...m }));
}

function saveProfile() {
  try {
    profile.missions = state.missions.map((m) => ({ ...m }));
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (err) {
    console.error("Profile save failed", err);
  }
}

function loadLeaderboard() {
  if (socket) {
    socket.emit('get-leaderboard');
    return;
  }
  try {
    const raw = localStorage.getItem(LEADERBOARD_KEY);
    leaderboard = raw ? JSON.parse(raw) : [];
  } catch (err) {
    leaderboard = [];
  }
}

function saveLeaderboard() {
  if (socket) return;
  try {
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(leaderboard.slice(0, 20)));
  } catch (err) {
    console.error("Leaderboard save failed", err);
  }
}

function applyAccessibility() {
  document.body.classList.remove("access-deuteranopia", "access-high-contrast", "access-large-ui");

  if (config.accessibilityPreset === "deuteranopia") {
    document.body.classList.add("access-deuteranopia");
  }
  if (config.accessibilityPreset === "high-contrast") {
    document.body.classList.add("access-high-contrast");
  }
  if (config.largeUi) {
    document.body.classList.add("access-large-ui");
  }
}

function computeRank() {
  return 1 + Math.floor(profile.xp / 120);
}

function updateMissionPanel() {
  const visible = state.appMode === "game" && state.running;
  missionPanel.classList.toggle("hidden", !visible);
  missionList.innerHTML = "";

  for (const mission of state.missions) {
    const li = document.createElement("li");
    li.textContent = `${mission.text} (${mission.value}/${mission.target})`;
    if (mission.done) {
      li.classList.add("done");
    }
    missionList.appendChild(li);
  }
}

function markMission(id, amount = 1) {
  const mission = state.missions.find((m) => m.id === id);
  if (!mission || mission.done) {
    return;
  }
  mission.value = clamp(mission.value + amount, 0, mission.target);
  if (mission.value >= mission.target) {
    mission.done = true;
  }
}

function awardMissionXP() {
  if (state.missionsAwarded) {
    return 0;
  }
  const doneCount = state.missions.filter((m) => m.done).length;
  const xp = doneCount * 50;
  profile.xp += xp;
  state.missionsAwarded = true;
  return xp;
}

function updateUnlockables() {
  const rank = computeRank();

  if (rank >= 3 && !profile.unlockables.crosshairSkins.includes("neon")) {
    profile.unlockables.crosshairSkins.push("neon");
    profile.badges.push("Sharpshooter Rank 3");
  }
  if (rank >= 5 && !profile.unlockables.backgroundThemes.includes("dusk-pro")) {
    profile.unlockables.backgroundThemes.push("dusk-pro");
    profile.badges.push("Weather Veteran");
  }
  if (profile.personalBest.combo >= 5 && !profile.unlockables.dogReactions.includes("legend-laugh")) {
    profile.unlockables.dogReactions.push("legend-laugh");
    profile.badges.push("Combo Master");
  }
}

function initAudio() {
  if (audio.ctx) {
    return;
  }
  const ctxAudio = new (window.AudioContext || window.webkitAudioContext)();
  const master = ctxAudio.createGain();
  master.gain.value = 0.21;
  master.connect(ctxAudio.destination);
  audio.ctx = ctxAudio;
  audio.master = master;
}

function playTone(freq, duration, type = "square", volume = 0.2, attack = 0.004) {
  if (!audio.ctx || !audio.master || !config.sfxOn) {
    return;
  }

  const now = audio.ctx.currentTime;
  const osc = audio.ctx.createOscillator();
  const gain = audio.ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, now);
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(volume, now + attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  osc.connect(gain);
  gain.connect(audio.master);
  osc.start(now);
  osc.stop(now + duration + 0.03);
}

function playMusicTone(freq, duration) {
  if (!audio.ctx || !audio.master || !config.musicOn) {
    return;
  }

  const now = audio.ctx.currentTime;
  const osc = audio.ctx.createOscillator();
  const gain = audio.ctx.createGain();

  osc.type = "square";
  osc.frequency.setValueAtTime(freq, now);
  gain.gain.setValueAtTime(0.001, now);
  gain.gain.linearRampToValueAtTime(0.08, now + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  osc.connect(gain);
  gain.connect(audio.master);
  osc.start(now);
  osc.stop(now + duration + 0.02);
}

function playShootSound() {
  playTone(540, 0.03, "square", 0.26);
  setTimeout(() => playTone(180, 0.08, "sawtooth", 0.11), 15);
  setTimeout(() => playTone(120, 0.06, "triangle", 0.08), 50);
}

function playHitSound() {
  playTone(760, 0.06, "triangle", 0.24);
  setTimeout(() => playTone(1020, 0.08, "triangle", 0.15), 38);
}

function playMissSound() {
  playTone(170, 0.05, "square", 0.08);
}

function playDogLaughSound() {
  const notes = [220, 280, 240, 320, 240];
  for (let i = 0; i < notes.length; i += 1) {
    setTimeout(() => playTone(notes[i], 0.09, "sawtooth", 0.09), i * 90);
  }
}

function startMusic() {
  if (!audio.ctx || audio.musicTimer) {
    return;
  }

  const melody = [329.63, 392.0, 523.25, 392.0, 349.23, 293.66, 261.63, 293.66];

  audio.musicTimer = setInterval(() => {
    if (!config.musicOn || state.appMode === "results") {
      return;
    }
    const note = melody[audio.melodyStep % melody.length];
    playMusicTone(note, 0.18);
    audio.melodyStep += 1;
  }, 240);
}

function stopMusic() {
  if (audio.musicTimer) {
    clearInterval(audio.musicTimer);
    audio.musicTimer = null;
  }
}

function setMusicOn(on) {
  config.musicOn = Boolean(on);
  settingsControls.music.checked = config.musicOn;
  hud.musicToggle.textContent = `MUSIC: ${config.musicOn ? "ON" : "OFF"}`;
  saveSettings();

  if (config.musicOn) {
    startMusic();
  } else {
    stopMusic();
  }
}

function setWebcamOn(on) {
  config.webcamOn = Boolean(on);
  settingsControls.webcam.checked = config.webcamOn;
  hud.webcamToggle.textContent = `WEBCAM: ${config.webcamOn ? "ON" : "OFF"}`;
  video.classList.toggle("cam-hidden", !config.webcamOn);
  saveSettings();
}

function updateHud() {
  hud.score.textContent = state.score;
  hud.hit.textContent = state.hits;
  hud.misses.textContent = state.misses;
  hud.time.textContent = Math.ceil(state.timeLeft);
  hud.round.textContent = state.round;
  hud.wave.textContent = state.wave;
}

function clearMenuHandHover() {
  if (state.menuHoverButton) {
    state.menuHoverButton.classList.remove("menu-hand-hover");
    state.menuHoverButton = null;
  }
  state.menuHoverStart = 0;
  state.dwellProgress = 0;
  menuHandCursor.style.setProperty("--dwell", "0");
}

function getVisibleMenuButtons() {
  return Array.from(screens.menu.querySelectorAll("button")).filter((btn) => !btn.disabled && btn.offsetParent !== null);
}

function handleMenuHandAction() {
  if (state.appMode === "menu" && state.menuHoverButton) {
    state.menuHoverButton.click();
  }
}

function updateMenuHandNavigation() {
  if (state.appMode !== "menu") {
    clearMenuHandHover();
    menuHandCursor.classList.add("hidden");
    return;
  }

  if (!state.handReady || !state.handActive) {
    clearMenuHandHover();
    menuHandCursor.classList.add("hidden");
    return;
  }

  menuHandCursor.classList.remove("hidden");
  menuHandCursor.style.left = `${state.crosshair.x}px`;
  menuHandCursor.style.top = `${state.crosshair.y}px`;

  const x = state.crosshair.x;
  const y = state.crosshair.y;
  const buttons = getVisibleMenuButtons();

  let hoverTarget = null;
  for (const btn of buttons) {
    const rect = btn.getBoundingClientRect();
    if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
      hoverTarget = btn;
      break;
    }
  }

  if (state.menuHoverButton !== hoverTarget) {
    clearMenuHandHover();
    if (hoverTarget) {
      hoverTarget.classList.add("menu-hand-hover");
      state.menuHoverButton = hoverTarget;
      state.menuHoverStart = performance.now();
    }
  }

  if (config.dwellSelect && state.menuHoverButton) {
    const elapsed = (performance.now() - state.menuHoverStart) / 1000;
    state.dwellProgress = clamp(elapsed / 0.8, 0, 1);
    menuHandCursor.style.setProperty("--dwell", state.dwellProgress.toFixed(3));

    if (state.dwellProgress >= 1) {
      state.menuHoverStart = performance.now() + 100000;
      state.dwellProgress = 0;
      menuHandCursor.style.setProperty("--dwell", "0");
      handleMenuHandAction();
    }
  }
}

function setAppMode(mode) {
  state.appMode = mode;

  if (mode === "menu") {
    screens.menu.classList.remove("hidden");
    screens.results.classList.add("hidden");
    pauseOverlay.classList.add("hidden");
    missionPanel.classList.add("hidden");
    hud.root.classList.add("hidden");
    hud.statusTip.classList.add("hidden");
    screens.tutorialHint.classList.add("hidden");
    state.running = false;
  }

  if (mode === "game") {
    screens.menu.classList.add("hidden");
    screens.results.classList.add("hidden");
    hud.root.classList.remove("hidden");
    hud.statusTip.classList.remove("hidden");
    updateMissionPanel();
  }

  if (mode === "results") {
    screens.results.classList.remove("hidden");
    pauseOverlay.classList.add("hidden");
    missionPanel.classList.add("hidden");
    hud.root.classList.add("hidden");
    hud.statusTip.classList.add("hidden");
    screens.tutorialHint.classList.add("hidden");
  }
}

function showMenuPanel(name) {
  panels.main.classList.add("hidden");
  panels.setup.classList.add("hidden");
  panels.settings.classList.add("hidden");
  panels.credits.classList.add("hidden");

  if (name === "main") {
    panels.main.classList.remove("hidden");
  }
  if (name === "setup") {
    panels.setup.classList.remove("hidden");
  }
  if (name === "settings") {
    panels.settings.classList.remove("hidden");
  }
  if (name === "credits") {
    panels.credits.classList.remove("hidden");
  }
}

function applyWeatherForRound() {
  const idx = (state.round + state.wave) % weatherTypes.length;
  const type = weatherTypes[idx];
  state.weather.type = type;
  state.weather.wind = type === "wind" ? rand(-22, 22) : 0;
  state.weather.fogAlpha = type === "fog" ? 0.16 : 0;
  state.weather.duskAlpha = type === "dusk" ? 0.24 : 0;
}

function resetRoundState() {
  const diff = difficultyStats[config.difficulty];

  state.score = 0;
  state.hits = 0;
  state.misses = 0;
  state.shots = 0;
  state.bestCombo = 0;
  state.comboCount = 0;
  state.comboText = "";
  state.comboTextTimer = 0;
  state.lastHitTime = 0;
  state.missionsAwarded = false;

  state.round = 1;
  state.wave = 1;
  state.wavesCleared = 0;
  state.waveActive = false;
  state.waveCountdown = diff.waveDelay;
  state.currentWaveTotal = 0;
  state.currentWaveEscaped = 0;
  state.duckIdCounter = 0;

  state.ducks = [];
  state.particles = [];
  state.hitFlash = 0;
  state.dogTimer = 0;
  state.paused = false;
  state.pauseHoldTime = 0;
  state.pauseArmRelease = false;

  state.replayEvents = [];
  state.usingMouseShot = false;

  state.timeLeft = diff.timer;
  state.gameEndTime = performance.now() + diff.timer * 1000;

  state.missions = profile.missions.map((m) => ({ ...m }));
  dogPopup.classList.add("hidden");
  dogPopup.classList.remove("show");

  applyWeatherForRound();
  updateMissionPanel();
}

function configureMultiplayer() {
  state.multiplayer.mode = config.multiplayerMode;
  state.multiplayer.players = [config.playerOneName || "Player 1", config.playerTwoName || "Player 2"];
  state.multiplayer.currentPlayerIndex = 0;
  state.multiplayer.roundResults = [];
}

function currentPlayerName() {
  return state.multiplayer.players[state.multiplayer.currentPlayerIndex] || "Player";
}

function startGameplay(mode = "game") {
  state.gameplayMode = mode;
  resetRoundState();
  setAppMode("game");

  state.running = true;
  hud.statusTip.textContent = "Pinch to shoot!";

  if (mode === "tutorial") {
    screens.tutorialHint.classList.remove("hidden");
    resetTutorialState();
  } else {
    screens.tutorialHint.classList.add("hidden");
  }

  if (state.multiplayer.mode === "local-versus" && mode === "game") {
    hud.statusTip.textContent = `${currentPlayerName()} turn`;
  }
}

function finishToMenu(message) {
  if (socket && state.multiplayer.mode === 'online') {
    socket.emit('leave-match');
    state.multiplayer.opponent.active = false;
  }
  setAppMode("menu");
  showMenuPanel("main");
  if (message) {
    menuControls.permissionNote.textContent = message;
  }
}

function addReplayEvent(type, text) {
  const elapsed = Math.max(0, difficultyStats[config.difficulty].timer - state.timeLeft).toFixed(1);
  state.replayEvents.push({ t: elapsed, type, text });
  if (state.replayEvents.length > 20) {
    state.replayEvents.shift();
  }
}

async function signPayload(payload) {
  const secret = "duckhunt-local-sign-v1";
  const enc = new TextEncoder();
  const data = enc.encode(`${secret}|${JSON.stringify(payload)}`);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

function renderReplayList() {
  resultUI.replayList.innerHTML = "";
  const items = state.replayEvents.slice(-8).reverse();
  for (const ev of items) {
    const li = document.createElement("li");
    li.textContent = `${ev.t}s - ${ev.text}`;
    resultUI.replayList.appendChild(li);
  }
  if (!items.length) {
    const li = document.createElement("li");
    li.textContent = "No highlights this round.";
    resultUI.replayList.appendChild(li);
  }
}

function renderLeaderboardList() {
  resultUI.leaderboardList.innerHTML = "";

  if (!leaderboard.length) {
    const li = document.createElement("li");
    li.textContent = "No scores yet.";
    resultUI.leaderboardList.appendChild(li);
    return;
  }

  leaderboard.slice(0, 8).forEach((entry, idx) => {
    const li = document.createElement("li");
    li.textContent = `#${idx + 1} ${entry.player} - ${entry.score} pts (${entry.accuracy}% acc)`;
    resultUI.leaderboardList.appendChild(li);
  });
}

function computeAndApplyProgression(accuracy) {
  const baseXp = state.score * 10 + Math.round(accuracy * 0.4);
  profile.xp += baseXp;
  const missionXp = awardMissionXP();
  const totalXp = baseXp + missionXp;

  profile.personalBest.score = Math.max(profile.personalBest.score, state.score);
  profile.personalBest.accuracy = Math.max(profile.personalBest.accuracy, accuracy);
  profile.personalBest.combo = Math.max(profile.personalBest.combo, state.bestCombo);

  if (state.bestCombo >= 5 && !profile.badges.includes("Combo Hunter")) {
    profile.badges.push("Combo Hunter");
  }
  if (accuracy >= 80 && !profile.badges.includes("Eagle Eye")) {
    profile.badges.push("Eagle Eye");
  }

  updateUnlockables();
  saveProfile();
  return totalXp;
}

function showResults() {
  state.running = false;
  setAppMode("results");

  const accuracy = state.shots > 0 ? Math.round((state.hits / state.shots) * 100) : 0;
  const gainedXp = computeAndApplyProgression(accuracy);

  resultUI.finalScore.textContent = state.score;
  resultUI.accuracy.textContent = `${accuracy}%`;
  resultUI.ducksHit.textContent = state.hits;
  resultUI.misses.textContent = state.misses;
  resultUI.bestCombo.textContent = state.bestCombo;
  resultUI.xpGained.textContent = gainedXp;
  resultUI.rank.textContent = computeRank();
  resultUI.badges.textContent = profile.badges.slice(-3).join(", ") || "-";

  renderReplayList();
  renderLeaderboardList();

  const payload = {
    ts: Date.now(),
    player: currentPlayerName(),
    score: state.score,
    accuracy,
    hits: state.hits,
    misses: state.misses,
    combo: state.bestCombo,
    antiCheat: {
      handOnlyRound: !state.usingMouseShot,
      gestureProfile: config.gestureProfile,
      seatedMode: config.seatedMode,
    },
  };
  state.lastScorePayload = payload;
  resultUI.signedStatus.textContent = "Pending submit";

  if (state.multiplayer.mode === "local-versus" && state.gameplayMode === "game") {
    state.multiplayer.roundResults.push({ player: currentPlayerName(), score: state.score, accuracy });

    if (state.multiplayer.currentPlayerIndex === 0) {
      resultUI.versusResultText.textContent = "Next: Player 2 turn. Press RETRY.";
    } else {
      const a = state.multiplayer.roundResults[0];
      const b = state.multiplayer.roundResults[1];
      const winner = a.score === b.score ? "Draw" : (a.score > b.score ? a.player : b.player);
      resultUI.versusResultText.textContent = winner === "Draw"
        ? `Versus Result: Draw (${a.score} - ${b.score})`
        : `Versus Winner: ${winner} (${a.score} - ${b.score})`;
    }
  } else {
    resultUI.versusResultText.textContent = "";
  }
}

function getWaveDuckCount() {
  if (state.gameplayMode === "tutorial") {
    return state.tutorial.step >= 3 && state.tutorial.practiceHits < 3 ? 3 - state.tutorial.practiceHits : 1;
  }

  if (state.round === 1) {
    return randInt(1, 2);
  }
  if (state.round <= 3) {
    return randInt(1, 3);
  }
  return randInt(2, 3);
}

function makeDuck(isBoss = false) {
  const fromLeft = getRandom() < 0.5;
  const y = rand(canvas.height * 0.17, canvas.height * 0.56);
  const speedScale = difficultyStats[config.difficulty].speed;
  const baseMin = 90 + (state.round - 1) * 16;
  const baseMax = 130 + (state.round - 1) * 22;
  const speed = rand(baseMin, baseMax) * speedScale;
  const dir = fromLeft ? 1 : -1;
  const x = fromLeft ? -80 : canvas.width + 80;

  return {
    id: state.duckIdCounter++,
    x,
    y,
    vx: speed * dir,
    vy: rand(-14, 18),
    r: isBoss ? rand(34, 40) : rand(24, 32),
    wingPhase: rand(0, Math.PI * 2),
    wingSpeed: rand(7, 11),
    bobSeed: rand(0, Math.PI * 2),
    hit: false,
    fallSpeed: rand(210, 350),
    rot: 0,
    variant: randInt(0, duckPalettes.length - 1),
    hp: isBoss ? 2 : 1,
    isBoss,
    zigzag: isBoss,
  };
}

function spawnWave() {
  state.waveActive = true;
  state.currentWaveEscaped = 0;
  state.currentWaveTotal = clamp(getWaveDuckCount(), 1, 3);

  const bossWave = state.gameplayMode === "game" && state.wave % 5 === 0;
  if (bossWave) {
    state.currentWaveTotal = 1;
    state.ducks.push(makeDuck(true));
  } else {
    for (let i = 0; i < state.currentWaveTotal; i += 1) {
      state.ducks.push(makeDuck(false));
    }
  }

  if (state.gameplayMode === "tutorial") {
    hud.statusTip.textContent = "Tutorial: practice ducks are live!";
  } else if (bossWave) {
    hud.statusTip.textContent = `Wave ${state.wave}: Boss duck incoming!`;
  } else {
    hud.statusTip.textContent = `Wave ${state.wave}: ${state.currentWaveTotal} duck${state.currentWaveTotal > 1 ? "s" : ""}`;
  }
}

function finishWave() {
  state.waveActive = false;

  const missedWave = state.currentWaveEscaped >= state.currentWaveTotal && state.currentWaveTotal > 0;
  if (missedWave) {
    showDogPopup();
    playDogLaughSound();
  } else {
    markMission("noMissWave", 1);
  }

  if (state.gameplayMode !== "tutorial") {
    state.wavesCleared += 1;
    state.round = Math.min(9, 1 + Math.floor(state.wavesCleared / 3));
    state.wave += 1;
    state.waveCountdown = difficultyStats[config.difficulty].waveDelay + rand(0.1, 0.8);
    applyWeatherForRound();
  } else {
    state.waveCountdown = 0.8;
  }

  updateMissionPanel();
}

function spawnHitParticles(x, y) {
  const count = config.performanceMode ? 8 : 20;
  for (let i = 0; i < count; i += 1) {
    const angle = rand(0, Math.PI * 2);
    const speed = rand(90, 280);
    const life = rand(0.22, 0.55);

    state.particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life,
      maxLife: life,
      size: rand(2, 5),
      color: getRandom() < 0.45 ? "#ffe281" : "#ffffff",
    });
  }
}

function showDogPopup() {
  state.dogTimer = 2;
  dogPopup.classList.remove("hidden");
  requestAnimationFrame(() => dogPopup.classList.add("show"));
}

function shoot() {
  const now = performance.now();
  if (now - state.lastShotTime < state.shotCooldown) {
    return;
  }

  state.lastShotTime = now;
  state.shots += 1;
  playShootSound();

  let hitDuck = null;
  for (let i = state.ducks.length - 1; i >= 0; i -= 1) {
    const duck = state.ducks[i];
    if (duck.hit) {
      continue;
    }

    const dx = duck.x - state.crosshair.x;
    const dy = duck.y - state.crosshair.y;
    const hitRadius = duck.r * 1.26;
    if (dx * dx + dy * dy <= hitRadius * hitRadius) {
      hitDuck = duck;
      break;
    }
  }

  if (!hitDuck) {
    playMissSound();
    addReplayEvent("miss", "Missed shot");
    return;
  }

  hitDuck.hp -= 1;
  if (hitDuck.hp > 0) {
    playHitSound();
    spawnHitParticles(hitDuck.x, hitDuck.y);
    addReplayEvent("hit", "Boss armor hit");
    return;
  }

  hitDuck.hit = true;
  hitDuck.vx *= 0.2;
  hitDuck.vy = rand(10, 48);
  hitDuck.rot = rand(-0.4, 0.4);

  if (socket && state.multiplayer.mode === 'online') {
    socket.emit('duck-hit', hitDuck.id);
  }

  state.hits += 1;
  state.score += hitDuck.isBoss ? 3 : 1;
  state.hitFlash = 0.12;
  spawnHitParticles(hitDuck.x, hitDuck.y);
  playHitSound();
  addReplayEvent("hit", hitDuck.isBoss ? "Boss down" : "Duck down");

  if (now - state.lastHitTime < 900) {
    state.comboCount += 1;
  } else {
    state.comboCount = 1;
  }

  state.bestCombo = Math.max(state.bestCombo, state.comboCount);
  state.lastHitTime = now;

  if (state.comboCount >= 2) {
    state.comboText = `COMBO x${state.comboCount}!`;
    state.comboTextTimer = 0.9;
  }

  if (state.comboCount >= 3) {
    markMission("combo3", 1);
  }

  if (state.gameplayMode === "tutorial" && state.tutorial.step === 3) {
    state.tutorial.practiceHits += 1;
  }

  const elapsed = difficultyStats[config.difficulty].timer - state.timeLeft;
  if (elapsed <= 20 && state.hits >= 6) {
    markMission("timedClear", 1);
  }

  updateMissionPanel();
}

function resetTutorialState() {
  state.tutorial.step = 0;
  state.tutorial.aimStartX = state.crosshair.x;
  state.tutorial.aimStartY = state.crosshair.y;
  state.tutorial.aimDistance = 0;
  state.tutorial.pinchFired = false;
  state.tutorial.practiceHits = 0;
  state.tutorial.completed = false;
  applyTutorialStep();
}

function applyTutorialStep() {
  const step = tutorialSteps[state.tutorial.step];
  tutorialUI.title.textContent = step.title;
  tutorialUI.text.textContent = step.text;
  tutorialUI.progress.textContent = `Step ${state.tutorial.step + 1} / ${tutorialSteps.length}`;

  if (state.tutorial.step === 3) {
    state.waveActive = false;
    state.waveCountdown = 0.6;
    state.ducks = [];
  }

  if (state.tutorial.step === 4) {
    state.tutorial.completed = true;
    state.running = false;
    finishToMenu("Tutorial complete. You are ready to hunt.");
  }
}

function updateTutorialProgress() {
  if (state.gameplayMode !== "tutorial") {
    return;
  }

  if (state.tutorial.step === 1) {
    const dx = state.crosshair.x - state.tutorial.aimStartX;
    const dy = state.crosshair.y - state.tutorial.aimStartY;
    state.tutorial.aimDistance = Math.hypot(dx, dy);
  }

  const step = tutorialSteps[state.tutorial.step];
  if (step.done(state)) {
    state.tutorial.step += 1;
    if (state.tutorial.step < tutorialSteps.length) {
      applyTutorialStep();
    }
  }
}

function updateHandAim(dt) {
  const now = performance.now();
  const handAge = (now - state.crosshair.lastSeenAt) / 1000;
  state.handActive = state.crosshair.lastSeenAt > 0 && handAge <= state.crosshair.holdSeconds;

  const trackingSmooth = clamp(config.smoothness, 0.15, 0.9);
  const smoothingSpeed = state.handActive ? 7 + trackingSmooth * 18 : 7;
  const smoothing = 1 - Math.exp(-dt * smoothingSpeed);

  state.crosshair.x += (state.crosshair.tx - state.crosshair.x) * smoothing;
  state.crosshair.y += (state.crosshair.ty - state.crosshair.y) * smoothing;

  state.crosshair.x = clamp(state.crosshair.x, 14, canvas.width - 14);
  state.crosshair.y = clamp(state.crosshair.y, 14, canvas.height - 14);

  if (socket && state.multiplayer.mode === 'online' && state.multiplayer.opponent.active) {
    socket.emit('crosshair-update', { x: state.crosshair.x, y: state.crosshair.y, pinchDown: state.pinchDown });
  }
}

function updateDucks(dt, elapsed) {
  if (!state.waveActive) {
    state.waveCountdown -= dt;
    if (state.waveCountdown <= 0 && state.running) {
      spawnWave();
    }
  }

  for (let i = state.ducks.length - 1; i >= 0; i -= 1) {
    const duck = state.ducks[i];

    if (!duck.hit) {
      const zig = duck.zigzag ? Math.sin(elapsed * 8 + duck.bobSeed) * 38 : Math.sin(elapsed * 2 + duck.bobSeed) * 22;
      duck.x += (duck.vx + state.weather.wind) * dt;
      duck.y += (zig + duck.vy) * dt;
      duck.wingPhase += duck.wingSpeed * dt;

      const escaped = duck.x < -120 || duck.x > canvas.width + 120 || duck.y < -95;
      if (escaped) {
        state.ducks.splice(i, 1);
        state.currentWaveEscaped += 1;
        state.misses += duck.isBoss ? 2 : 1;
        addReplayEvent("escape", duck.isBoss ? "Boss escaped" : "Duck escaped");
      }
    } else {
      duck.vy += duck.fallSpeed * dt;
      duck.y += duck.vy * dt;
      duck.x += duck.vx * dt;
      duck.rot += 1.8 * dt;

      if (duck.y > canvas.height + 150) {
        state.ducks.splice(i, 1);
      }
    }
  }

  if (state.waveActive && state.ducks.length === 0) {
    finishWave();
  }
}

function updateParticles(dt) {
  for (let i = state.particles.length - 1; i >= 0; i -= 1) {
    const p = state.particles[i];
    p.life -= dt;

    if (p.life <= 0) {
      state.particles.splice(i, 1);
      continue;
    }

    p.vy += 250 * dt;
    p.x += p.vx * dt;
    p.y += p.vy * dt;
  }
}

function updateDogPopup(dt) {
  if (state.dogTimer <= 0) {
    return;
  }

  state.dogTimer -= dt;
  if (state.dogTimer <= 0) {
    dogPopup.classList.remove("show");
    setTimeout(() => dogPopup.classList.add("hidden"), 260);
  }
}

function togglePause() {
  state.paused = !state.paused;
  pauseOverlay.classList.toggle("hidden", !state.paused);
}

function updatePauseHold(dt, shootingGesture) {
  if (state.appMode !== "game" || !state.running) {
    state.pauseHoldTime = 0;
    return;
  }

  if (state.pauseArmRelease && !shootingGesture) {
    state.pauseArmRelease = false;
  }

  if (state.pauseArmRelease) {
    state.pauseHoldTime = 0;
    return;
  }

  if (shootingGesture) {
    state.pauseHoldTime += dt;
    if (state.pauseHoldTime >= 1.0) {
      togglePause();
      state.pauseArmRelease = true;
      state.pauseHoldTime = 0;
    }
  } else {
    state.pauseHoldTime = 0;
  }
}

function updateTimer() {
  if (!state.running || state.gameplayMode === "tutorial") {
    return;
  }

  state.timeLeft = Math.max(0, (state.gameEndTime - performance.now()) / 1000);
  if (state.timeLeft <= 0) {
    showResults();
  }
}

function updateStatusTip() {
  if (state.appMode !== "game") {
    return;
  }

  if (state.paused) {
    hud.statusTip.textContent = "Game paused";
    return;
  }

  if (!state.handActive) {
    const handMissingFor = state.crosshair.lastSeenAt > 0
      ? (performance.now() - state.crosshair.lastSeenAt) / 1000
      : 99;

    if (handMissingFor < state.crosshair.holdSeconds) {
      hud.statusTip.textContent = "Hand lost... keeping your last aim.";
    } else {
      hud.statusTip.textContent = "Show one hand. Index aims, pinch shoots.";
    }
    return;
  }

  if (state.gameplayMode === "tutorial") {
    hud.statusTip.textContent = "Tutorial Mode";
    return;
  }

  if (!state.waveActive) {
    hud.statusTip.textContent = `Next wave in ${Math.max(0, state.waveCountdown).toFixed(1)}s | ${state.weather.type.toUpperCase()}`;
  } else {
    hud.statusTip.textContent = `Round ${state.round} Wave ${state.wave} | ${state.weather.type.toUpperCase()}`;
  }
}

function updateSetupPanel() {
  if (panels.setup.classList.contains("hidden")) {
    return;
  }

  const percent = Math.round(state.confidence * 100);
  setupControls.confidenceMeterFill.style.width = `${percent}%`;
  setupControls.confidenceText.textContent = `${percent}%`;
  setupControls.fingerPreview.textContent = `Index: ${Math.round(state.lastIndexX)}, ${Math.round(state.lastIndexY)}`;
  setupControls.crosshairPreview.textContent = `Crosshair: ${Math.round(state.crosshair.x)}, ${Math.round(state.crosshair.y)}`;
  setupControls.pinchPreview.textContent = `Pinch: ${state.pinchDown ? "Detected" : "Not detected"}`;
}

function update(dt, elapsed) {
  updateHandAim(dt);
  updateMenuHandNavigation();
  updateParticles(dt);
  updateDogPopup(dt);

  if (!state.running || state.paused) {
    updateStatusTip();
    updateHud();
    updateSetupPanel();
    return;
  }

  updateDucks(dt, elapsed);
  updateTimer();
  updateTutorialProgress();

  if (state.comboTextTimer > 0) {
    state.comboTextTimer -= dt;
  }
  if (state.hitFlash > 0) {
    state.hitFlash -= dt;
  }

  updateStatusTip();
  updateHud();
  updateSetupPanel();
}

function drawBackground(elapsed) {
  const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  grad.addColorStop(0, "#7fd7ff");
  grad.addColorStop(0.55, "#bcecff");
  grad.addColorStop(1, "#eafaff");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const horizon = canvas.height * 0.66;

  ctx.fillStyle = "#7faec5";
  ctx.beginPath();
  ctx.moveTo(0, horizon);
  const step = config.performanceMode ? 140 : 80;
  for (let x = 0; x <= canvas.width; x += step) {
    const y = horizon - 90 - Math.sin(x * 0.009 + elapsed * 0.05) * 24;
    ctx.lineTo(x, y);
  }
  ctx.lineTo(canvas.width, canvas.height);
  ctx.lineTo(0, canvas.height);
  ctx.closePath();
  ctx.fill();

  if (!config.performanceMode) {
    for (let i = 0; i < 6; i += 1) {
      const drift = (elapsed * (8 + i) + i * 180) % (canvas.width + 300);
      const x = drift - 180;
      const y = 80 + i * 35;
      ctx.fillStyle = i % 2 ? "rgba(255,255,255,0.68)" : "rgba(255,255,255,0.5)";
      ctx.beginPath();
      ctx.arc(x, y, 28, 0, Math.PI * 2);
      ctx.arc(x + 26, y - 10, 20, 0, Math.PI * 2);
      ctx.arc(x + 52, y, 18, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const groundH = canvas.height * 0.25;
  const y0 = canvas.height - groundH;

  ctx.fillStyle = "#3f7f45";
  const trees = config.performanceMode ? 6 : 12;
  for (let i = 0; i < trees; i += 1) {
    const tx = (i / Math.max(1, trees - 1)) * canvas.width;
    const th = 120 + (i % 3) * 24;
    const tw = 130 + (i % 2) * 26;
    ctx.fillRect(tx - 6, y0 - th * 0.4, 12, th * 0.4);

    ctx.beginPath();
    ctx.arc(tx, y0 - th * 0.5, tw * 0.2, 0, Math.PI * 2);
    ctx.arc(tx - tw * 0.12, y0 - th * 0.4, tw * 0.16, 0, Math.PI * 2);
    ctx.arc(tx + tw * 0.12, y0 - th * 0.4, tw * 0.16, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = "#2f6f35";
  const bushes = config.performanceMode ? 12 : 22;
  for (let i = 0; i < bushes; i += 1) {
    const bx = (i / Math.max(1, bushes - 1)) * canvas.width + Math.sin(elapsed * 0.5 + i) * 6;
    ctx.beginPath();
    ctx.arc(bx, y0 + groundH * 0.12, 24 + (i % 3) * 6, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = "#56ad46";
  ctx.fillRect(0, y0, canvas.width, groundH);

  ctx.fillStyle = "#4a983c";
  const tile = 20;
  for (let y = y0; y < canvas.height; y += tile) {
    for (let x = 0; x < canvas.width; x += tile) {
      if ((x / tile + y / tile) % 2 === 0) {
        ctx.fillRect(x, y, tile, tile);
      }
    }
  }

  if (!config.performanceMode) {
    ctx.strokeStyle = "rgba(35, 102, 44, 0.75)";
    for (let x = 0; x < canvas.width; x += 14) {
      const sway = Math.sin(elapsed * 2 + x * 0.03) * 4;
      ctx.beginPath();
      ctx.moveTo(x, canvas.height);
      ctx.lineTo(x + sway, canvas.height - 14);
      ctx.stroke();
    }
  }

  if (state.weather.duskAlpha > 0) {
    ctx.fillStyle = `rgba(110, 60, 30, ${state.weather.duskAlpha})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  if (state.weather.fogAlpha > 0) {
    ctx.fillStyle = `rgba(235, 245, 255, ${state.weather.fogAlpha})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}

function drawDuck(duck) {
  const p = duckPalettes[duck.variant];
  const wingFlap = Math.sin(duck.wingPhase) * 0.6;

  ctx.save();
  ctx.translate(duck.x, duck.y);
  if (duck.hit) {
    ctx.rotate(duck.rot);
  }

  ctx.fillStyle = p.body;
  ctx.beginPath();
  ctx.ellipse(0, 0, duck.r, duck.r * 0.76, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = p.belly;
  ctx.beginPath();
  ctx.ellipse(-duck.r * 0.2, duck.r * 0.02, duck.r * 0.66, duck.r * 0.44, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = p.head;
  ctx.beginPath();
  ctx.arc(duck.r * 0.52, -duck.r * 0.48, duck.r * 0.34, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#101010";
  ctx.beginPath();
  ctx.arc(duck.r * 0.64, -duck.r * 0.5, duck.r * 0.09, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = p.beak;
  ctx.beginPath();
  ctx.moveTo(duck.r * 0.84, -duck.r * 0.35);
  ctx.lineTo(duck.r * 1.24, -duck.r * 0.23);
  ctx.lineTo(duck.r * 0.84, -duck.r * 0.09);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = p.wing;
  ctx.save();
  ctx.rotate(-0.4 + wingFlap);
  ctx.beginPath();
  ctx.ellipse(-duck.r * 0.12, -duck.r * 0.26, duck.r * 0.72, duck.r * 0.24, -0.7, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.fillStyle = p.feet;
  ctx.fillRect(-duck.r * 0.18, duck.r * 0.46, 3, 9);
  ctx.fillRect(duck.r * 0.02, duck.r * 0.5, 3, 9);

  if (duck.isBoss && !duck.hit) {
    ctx.strokeStyle = "#ffd86d";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, duck.r + 8, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.restore();
}

function drawParticles() {
  for (const p of state.particles) {
    const alpha = p.life / p.maxLife;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x, p.y, p.size, p.size);
  }
  ctx.globalAlpha = 1;
}

function drawCrosshair(elapsed) {
  const x = state.crosshair.x;
  const y = state.crosshair.y;
  const pulse = 1 + Math.sin(elapsed * 8) * 0.06;
  const r = config.crosshairSize * pulse;

  ctx.save();
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = "#ff3d2f";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x, y, r - 3, 0, Math.PI * 2);
  ctx.moveTo(x - (r + 12), y);
  ctx.lineTo(x - (r - 4), y);
  ctx.moveTo(x + (r - 4), y);
  ctx.lineTo(x + (r + 12), y);
  ctx.moveTo(x, y - (r + 12));
  ctx.lineTo(x, y - (r - 4));
  ctx.moveTo(x, y + (r - 4));
  ctx.lineTo(x, y + (r + 12));
  ctx.stroke();

  ctx.fillStyle = "#ff3d2f";
  ctx.fillRect(x - 2, y - 2, 4, 4);

  if (state.pauseHoldTime > 0 && state.appMode === "game") {
    const p = clamp(state.pauseHoldTime / 1, 0, 1);
    ctx.strokeStyle = "#ffe27a";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(x, y, r + 8, -Math.PI / 2, -Math.PI / 2 + p * Math.PI * 2);
    ctx.stroke();
  }

  if (state.multiplayer.opponent.active) {
    const ox = state.multiplayer.opponent.x;
    const oy = state.multiplayer.opponent.y;
    ctx.strokeStyle = state.multiplayer.opponent.pinchDown ? "#00ff00" : "#44ccff";
    ctx.beginPath();
    ctx.arc(ox, oy, r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = ctx.strokeStyle;
    ctx.fillRect(ox - 2, oy - 2, 4, 4);
    ctx.font = "12px 'Press Start 2P'";
    ctx.fillText(state.multiplayer.opponent.name, ox + r + 5, oy + 4);
  }

  ctx.restore();
}

function drawCombo() {
  if (state.comboTextTimer <= 0 || !state.comboText) {
    return;
  }

  const pulse = 1 + Math.sin(performance.now() * 0.02) * 0.08;
  ctx.save();
  ctx.translate(canvas.width * 0.5, canvas.height * 0.2);
  ctx.scale(pulse, pulse);
  ctx.textAlign = "center";
  ctx.fillStyle = "#ffe06f";
  ctx.strokeStyle = "#2e1e08";
  ctx.lineWidth = 5;
  ctx.font = "34px 'Press Start 2P'";
  ctx.strokeText(state.comboText, 0, 0);
  ctx.fillText(state.comboText, 0, 0);
  ctx.restore();
}

function drawHitFlash() {
  if (state.hitFlash <= 0) {
    return;
  }
  ctx.save();
  ctx.fillStyle = `rgba(255,255,255,${Math.min(0.34, state.hitFlash * 2.2)})`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.restore();
}

function drawPauseTint() {
  if (!state.paused) {
    return;
  }
  ctx.fillStyle = "rgba(5, 10, 20, 0.45)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function render(elapsed) {
  drawBackground(elapsed);

  for (const duck of state.ducks) {
    drawDuck(duck);
  }

  drawParticles();
  drawCrosshair(elapsed);
  drawCombo();
  drawHitFlash();
  drawPauseTint();
}

function loop(ts) {
  if (!state.lastFrameTime) {
    state.lastFrameTime = ts;
  }

  const dt = Math.min(0.033, (ts - state.lastFrameTime) / 1000);
  state.lastFrameTime = ts;

  update(dt, ts / 1000);
  render(ts / 1000);

  requestAnimationFrame(loop);
}

async function initHandTracking() {
  if (state.handReady) {
    return true;
  }

  hands = new Hands({
    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
  });

  hands.setOptions({
    maxNumHands: 1,
    modelComplexity: 1,
    minDetectionConfidence: 0.58,
    minTrackingConfidence: 0.52,
  });

  hands.onResults((results) => {
    const now = performance.now();
    const dt = state.lastFrameTime ? Math.min(0.033, (now - state.lastFrameTime) / 1000) : 0.016;

    state.handDetected = false;
    state.confidence *= 0.92;

    if (!results.multiHandLandmarks || !results.multiHandLandmarks.length) {
      state.pauseHoldTime = 0;
      return;
    }

    const lm = results.multiHandLandmarks[0];
    const idx = lm[8];
    const thumb = lm[4];

    state.handDetected = true;
    state.confidence += (1 - state.confidence) * 0.26;

    const x01 = config.mirror ? 1 - idx.x : idx.x;
    const rawX = x01 * canvas.width;
    const rawY = idx.y * canvas.height;

    const centerX = canvas.width * 0.5;
    const centerY = canvas.height * 0.5;
    const tx = centerX + (rawX - centerX) * config.sensitivity;
    const ty = centerY + (rawY - centerY) * config.sensitivity;

    state.crosshair.tx += (tx - state.crosshair.tx) * config.smoothness;
    state.crosshair.ty += (ty - state.crosshair.ty) * config.smoothness;

    state.crosshair.lastSeenAt = now;
    state.lastIndexX = rawX;
    state.lastIndexY = rawY;

    const palmSize = Math.max(landmarkDist(lm, 5, 17), 0.01);
    const pinchDist = Math.hypot(idx.x - thumb.x, idx.y - thumb.y);
    const pinchThreshold = clamp(palmSize * 0.34, 0.03, 0.075);
    const pinching = pinchDist < pinchThreshold;

    const indexExtended = landmarkDist(lm, 8, 0) > landmarkDist(lm, 6, 0) * 1.16;
    const middleCurled = landmarkDist(lm, 12, 0) < landmarkDist(lm, 10, 0) * 1.06;
    const ringCurled = landmarkDist(lm, 16, 0) < landmarkDist(lm, 14, 0) * 1.06;
    const pinkyCurled = landmarkDist(lm, 20, 0) < landmarkDist(lm, 18, 0) * 1.06;
    const thumbTrigger = landmarkDist(lm, 4, 9) < palmSize * 0.95;
    const gunTrigger = indexExtended && middleCurled && ringCurled && pinkyCurled && thumbTrigger;

    let shootingGesture = pinching || gunTrigger;
    if (config.gestureProfile === "pinch") {
      shootingGesture = pinching;
    }
    if (config.gestureProfile === "gun") {
      shootingGesture = gunTrigger;
    }

    updatePauseHold(dt, shootingGesture);

    if (!state.paused && shootingGesture && !state.pinchDown) {
      if (state.appMode === "game" && state.running) {
        shoot();
      }
      if (state.appMode === "menu") {
        handleMenuHandAction();
      }
      if (state.gameplayMode === "tutorial") {
        state.tutorial.pinchFired = true;
      }
    }

    state.pinchDown = shootingGesture;
  });

  try {
    camera = new Camera(video, {
      onFrame: async () => {
        await hands.send({ image: video });
      },
      width: 640,
      height: 480,
    });

    await camera.start();
    state.handReady = true;
    menuControls.permissionNote.textContent = "Camera connected. Hand controls ready.";
    return true;
  } catch (err) {
    menuControls.permissionNote.textContent = "Camera permission denied. Allow webcam and retry.";
    console.error("Webcam init failed", err);
    return false;
  }
}

async function ensureTrackingReady() {
  initAudio();
  return initHandTracking();
}

async function onStartGameClick() {
  const ok = await ensureTrackingReady();
  if (!ok) {
    return;
  }
  configureMultiplayer();

  if (state.multiplayer.mode === 'online' && socket) {
    menuControls.permissionNote.textContent = "Connecting to matchmaking...";
    socket.emit('find-match', { name: currentPlayerName() });
  } else {
    startGameplay("game");
  }
}

async function onTutorialClick() {
  const ok = await ensureTrackingReady();
  if (!ok) {
    return;
  }
  startGameplay("tutorial");
}

async function onSetupClick() {
  const ok = await ensureTrackingReady();
  if (!ok) {
    return;
  }
  setAppMode("menu");
  showMenuPanel("setup");
  menuControls.permissionNote.textContent = "Tune your tracking values and test pinch.";
}

function syncSettingsUI() {
  settingsControls.music.checked = config.musicOn;
  settingsControls.sfx.checked = config.sfxOn;
  settingsControls.webcam.checked = config.webcamOn;
  settingsControls.dwellSelect.checked = config.dwellSelect;
  settingsControls.performance.checked = config.performanceMode;
  settingsControls.gestureProfile.value = config.gestureProfile;
  settingsControls.difficulty.value = config.difficulty;
  settingsControls.multiplayerMode.value = config.multiplayerMode;
  settingsControls.playerOneName.value = config.playerOneName;
  settingsControls.playerTwoName.value = config.playerTwoName;
  settingsControls.accessibilityPreset.value = config.accessibilityPreset;
  settingsControls.largeUi.checked = config.largeUi;
  settingsControls.seatedMode.checked = config.seatedMode;
  settingsControls.crosshairSize.value = config.crosshairSize;

  setupControls.sensitivitySlider.value = config.sensitivity;
  setupControls.smoothnessSlider.value = config.smoothness;
  setupControls.mirrorToggle.checked = config.mirror;

  applyAccessibility();
}

function attachEvents() {
  menuControls.startBtn.addEventListener("click", onStartGameClick);
  menuControls.tutorialBtn.addEventListener("click", onTutorialClick);
  menuControls.handSetupBtn.addEventListener("click", onSetupClick);

  menuControls.settingsBtn.addEventListener("click", () => showMenuPanel("settings"));
  menuControls.creditsBtn.addEventListener("click", () => showMenuPanel("credits"));
  menuControls.setupBackBtn.addEventListener("click", () => showMenuPanel("main"));
  menuControls.settingsBackBtn.addEventListener("click", () => showMenuPanel("main"));
  menuControls.creditsBackBtn.addEventListener("click", () => showMenuPanel("main"));
  menuControls.setupPlayBtn.addEventListener("click", onStartGameClick);

  resultUI.retryBtn.addEventListener("click", async () => {
    if (state.multiplayer.mode === "local-versus" && state.multiplayer.currentPlayerIndex === 0 && state.multiplayer.roundResults.length === 1) {
      state.multiplayer.currentPlayerIndex = 1;
      startGameplay("game");
      return;
    }
    onStartGameClick();
  });

  resultUI.backToMenuBtn.addEventListener("click", () => finishToMenu("Ready for another round?"));

  hud.musicToggle.addEventListener("click", () => {
    initAudio();
    setMusicOn(!config.musicOn);
  });

  hud.webcamToggle.addEventListener("click", () => {
    setWebcamOn(!config.webcamOn);
  });

  setupControls.sensitivitySlider.addEventListener("input", () => {
    config.sensitivity = Number(setupControls.sensitivitySlider.value);
    saveSettings();
  });

  setupControls.smoothnessSlider.addEventListener("input", () => {
    config.smoothness = Number(setupControls.smoothnessSlider.value);
    saveSettings();
  });

  setupControls.mirrorToggle.addEventListener("change", () => {
    config.mirror = setupControls.mirrorToggle.checked;
    saveSettings();
  });

  setupControls.testPinchBtn.addEventListener("click", () => {
    initAudio();
    playShootSound();
  });

  settingsControls.music.addEventListener("change", () => {
    initAudio();
    setMusicOn(settingsControls.music.checked);
  });

  settingsControls.sfx.addEventListener("change", () => {
    config.sfxOn = settingsControls.sfx.checked;
    saveSettings();
  });

  settingsControls.webcam.addEventListener("change", () => {
    setWebcamOn(settingsControls.webcam.checked);
  });

  settingsControls.dwellSelect.addEventListener("change", () => {
    config.dwellSelect = settingsControls.dwellSelect.checked;
    saveSettings();
  });

  settingsControls.performance.addEventListener("change", () => {
    config.performanceMode = settingsControls.performance.checked;
    saveSettings();
  });

  settingsControls.gestureProfile.addEventListener("change", () => {
    config.gestureProfile = settingsControls.gestureProfile.value;
    saveSettings();
  });

  settingsControls.difficulty.addEventListener("change", () => {
    config.difficulty = settingsControls.difficulty.value;
    saveSettings();
  });

  settingsControls.multiplayerMode.addEventListener("change", () => {
    config.multiplayerMode = settingsControls.multiplayerMode.value;
    saveSettings();
  });

  settingsControls.playerOneName.addEventListener("change", () => {
    config.playerOneName = settingsControls.playerOneName.value.trim() || "Player 1";
    saveSettings();
  });

  settingsControls.playerTwoName.addEventListener("change", () => {
    config.playerTwoName = settingsControls.playerTwoName.value.trim() || "Player 2";
    saveSettings();
  });

  settingsControls.accessibilityPreset.addEventListener("change", () => {
    config.accessibilityPreset = settingsControls.accessibilityPreset.value;
    applyAccessibility();
    saveSettings();
  });

  settingsControls.largeUi.addEventListener("change", () => {
    config.largeUi = settingsControls.largeUi.checked;
    applyAccessibility();
    saveSettings();
  });

  settingsControls.seatedMode.addEventListener("change", () => {
    config.seatedMode = settingsControls.seatedMode.checked;
    state.crosshair.holdSeconds = config.seatedMode ? 4 : 2.8;
    saveSettings();
  });

  settingsControls.crosshairSize.addEventListener("input", () => {
    config.crosshairSize = Number(settingsControls.crosshairSize.value);
    saveSettings();
  });

  settingsControls.fullscreenBtn.addEventListener("click", async () => {
    if (!document.fullscreenElement) {
      try {
        await document.documentElement.requestFullscreen();
      } catch (err) {
        console.error("Fullscreen failed", err);
      }
    } else {
      await document.exitFullscreen();
    }
  });

  resumeBtn.addEventListener("click", () => {
    state.paused = false;
    pauseOverlay.classList.add("hidden");
  });

  pauseMenuBtn.addEventListener("click", () => {
    state.paused = false;
    pauseOverlay.classList.add("hidden");
    finishToMenu("Paused session ended.");
  });

  resultUI.submitScoreBtn.addEventListener("click", async () => {
    if (!state.lastScorePayload) {
      return;
    }

    const signature = await signPayload(state.lastScorePayload);
    const entry = {
      player: state.lastScorePayload.player,
      score: state.lastScorePayload.score,
      accuracy: state.lastScorePayload.accuracy,
      when: new Date().toISOString(),
      signature,
      antiCheat: state.lastScorePayload.antiCheat,
    };

    if (socket) {
      socket.emit('submit-score', entry);
      resultUI.signedStatus.textContent = `Sent to Global Leaderboard!`;
    } else {
      leaderboard.push(entry);
      leaderboard.sort((a, b) => b.score - a.score || b.accuracy - a.accuracy);
      leaderboard = leaderboard.slice(0, 20);
      saveLeaderboard();
      renderLeaderboardList();
      resultUI.signedStatus.textContent = `Signed: ${signature.slice(0, 12)}...`;
    }
    resultUI.submitScoreBtn.disabled = true;
  });

  window.addEventListener("mousemove", (e) => {
    if (!state.handActive && state.appMode === "game") {
      state.crosshair.tx = e.clientX;
      state.crosshair.ty = e.clientY;
    }
  });

  window.addEventListener("click", () => {
    if (!state.handActive && state.running && state.appMode === "game" && !state.paused) {
      state.usingMouseShot = true;
      shoot();
    }
  });

  window.addEventListener("resize", resizeCanvas);
}

function boot() {
  loadSettings();
  loadProfile();
  loadLeaderboard();

  resizeCanvas();
  syncSettingsUI();
  setMusicOn(config.musicOn);
  setWebcamOn(config.webcamOn);
  state.crosshair.holdSeconds = config.seatedMode ? 4 : 2.8;

  showMenuPanel("main");
  setAppMode("menu");
  attachEvents();
  updateHud();
  updateMissionPanel();
  renderLeaderboardList();

  if (socket) {
    socket.on('leaderboard', (data) => {
      leaderboard = data;
      renderLeaderboardList();
    });
    socket.on('waiting-match', () => {
      menuControls.permissionNote.textContent = "Waiting for an opponent...";
    });
    socket.on('match-found', (data) => {
      state.multiplayer.opponent.active = true;
      currentSeed = data.seed * 10000;
      const opponentData = data.players.find(p => p.id !== socket.id);
      state.multiplayer.opponent.name = opponentData ? opponentData.name : "Opponent";
      startGameplay("game");
    });
    socket.on('opponent-crosshair', (data) => {
      state.multiplayer.opponent.x = data.x;
      state.multiplayer.opponent.y = data.y;
      state.multiplayer.opponent.pinchDown = data.pinchDown;
    });
    socket.on('opponent-duck-hit', (duckId) => {
      const duck = state.ducks.find(d => d.id === duckId);
      if (duck && !duck.hit) {
         duck.hit = true;
         duck.hp = 0;
         duck.vx *= 0.2;
         duck.vy = rand(10, 48);
         duck.rot = rand(-0.4, 0.4);
         spawnHitParticles(duck.x, duck.y);
         playHitSound();
         state.multiplayer.opponent.score += duck.isBoss ? 3 : 1;
      }
    });
    socket.on('opponent-left', () => {
      if (state.multiplayer.opponent.active) {
         state.multiplayer.opponent.active = false;
         hud.statusTip.textContent = "Opponent left the match.";
      }
    });
  }

  initHandTracking().then((ok) => {
    if (ok) {
      menuControls.permissionNote.textContent = "Hand menu navigation ready: point and pinch to select.";
    }
  });

  requestAnimationFrame(loop);
}

boot();
