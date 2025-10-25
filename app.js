const state = {
  currentPage: "login",
  user: JSON.parse(localStorage.getItem("xssy-user")) ?? null,
  checklist: [
    { id: 1, label: "确认行程信息", done: false },
    { id: 2, label: "完成健康申报", done: false },
    { id: 3, label: "准备环保出游装备", done: false },
    { id: 4, label: "预约农场体验项目", done: false },
  ],
  packingItems: JSON.parse(localStorage.getItem("xssy-packing")) ?? [
    "舒适运动鞋",
    "遮阳帽",
    "随身水杯",
  ],
  favorites: new Set(JSON.parse(localStorage.getItem("xssy-favorites")) ?? []),
  feedback: JSON.parse(localStorage.getItem("xssy-feedback")) ?? [],
};

const highlights = [
  "油菜花开最佳观赏期，记得早起看日出",
  "自然课堂开放：了解乡村生态系统",
  "亲子采摘区新增有机草莓可供体验",
];

const routes = [
  "迎宾驿站 → 生态展示馆 → 水稻梯田",
  "茶园步道 → 森林氧吧 → 户外野餐地",
  "竹林小径 → 手作工坊 → 星光露营地",
];

const destinations = [
  {
    id: "farm-morning",
    title: "晨光田野",
    description: "田园晨雾与鸟鸣，为一天带来清新的开始。",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=640&q=80",
    theme: "生态体验",
    tags: ["日出", "自然", "摄影"],
  },
  {
    id: "forest-therapy",
    title: "森林疗愈",
    description: "漫步森林氧吧，呼吸负氧离子，体验身心疗愈。",
    image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=640&q=80",
    theme: "康养度假",
    tags: ["徒步", "放松", "瑜伽"],
  },
  {
    id: "rural-market",
    title: "乡集手作市集",
    description: "体验农夫市集，选购当地手作与有机食材。",
    image: "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?auto=format&fit=crop&w=640&q=80",
    theme: "文化探索",
    tags: ["市集", "美食", "手作"],
  },
  {
    id: "star-camping",
    title: "星空露营夜",
    description: "帐篷露营与天文讲座，邂逅满天繁星。",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=640&q=80",
    theme: "户外冒险",
    tags: ["露营", "观星", "亲子"],
  },
  {
    id: "tea-ceremony",
    title: "茶园慢时光",
    description: "走进茶园，学习采茶制茶，品味慢生活。",
    image: "https://images.unsplash.com/photo-1451471016731-e963a8588be8?auto=format&fit=crop&w=640&q=80",
    theme: "文化探索",
    tags: ["茶艺", "手作", "文化"],
  },
  {
    id: "family-workshop",
    title: "亲子自然课堂",
    description: "互动式生态课堂，让孩子了解田园生物多样性。",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=640&q=80",
    theme: "亲子研学",
    tags: ["科普", "手工", "研学"],
  },
];

const events = [
  { time: "09:30", title: "乡村迎宾仪式" },
  { time: "11:00", title: "生态课堂 — 农田的四季" },
  { time: "14:00", title: "自然摄影打卡" },
  { time: "16:30", title: "田园音乐小憩" },
  { time: "19:00", title: "星空露营分享会" },
];

const elements = {
  navButtons: document.querySelectorAll(".nav-button"),
  pages: document.querySelectorAll(".page"),
  loginStatus: document.getElementById("login-status"),
  loginForm: document.getElementById("login-form"),
  overviewHighlightList: document.getElementById("highlight-list"),
  routeList: document.getElementById("route-list"),
  farmMap: document.getElementById("farm-map"),
  weatherInfo: document.getElementById("weather-info"),
  checklist: document.getElementById("checklist"),
  countdown: document.getElementById("countdown"),
  packingForm: document.getElementById("packing-form"),
  packingInput: document.getElementById("packing-input"),
  packingList: document.getElementById("packing-list"),
  themeFilter: document.getElementById("theme-filter"),
  searchInput: document.getElementById("search-input"),
  destinationGrid: document.getElementById("destination-grid"),
  refreshData: document.getElementById("refresh-data"),
  originChart: document.getElementById("origin-chart"),
  satisfactionChart: document.getElementById("satisfaction-chart"),
  heatScore: document.getElementById("heat-score"),
  feedbackForm: document.getElementById("feedback-form"),
  feedbackList: document.getElementById("feedback-list"),
  eventList: document.getElementById("event-list"),
  toggleMap: document.getElementById("toggle-map"),
  communityMap: document.getElementById("community-map"),
  mapCanvas: document.getElementById("map-canvas"),
};

function initNavigation() {
  elements.navButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.dataset.target;
      state.currentPage = target;
      elements.navButtons.forEach((btn) => btn.classList.toggle("active", btn === button));
      elements.pages.forEach((page) => page.classList.toggle("active", page.id === target));
      if (target === "overview") {
        drawFarmMap();
      }
      if (target === "data") {
        renderDataCharts();
      }
      if (target === "community" && !elements.communityMap.hidden) {
        drawCommunityMap();
      }
    });
  });
}

function initLogin() {
  updateLoginStatus();
  elements.loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const username = document.getElementById("username").value.trim();
    const phone = document.getElementById("phone").value.trim();
    if (!username || !phone) return;

    state.user = { username, phone, loggedInAt: new Date().toISOString() };
    localStorage.setItem("xssy-user", JSON.stringify(state.user));
    updateLoginStatus();
  });
}

function updateLoginStatus() {
  if (state.user) {
    elements.loginStatus.textContent = `欢迎回来，${state.user.username}！点击上方导航继续探索。`;
  } else {
    elements.loginStatus.textContent = "尚未登录";
  }
}

function initOverview() {
  elements.overviewHighlightList.innerHTML = highlights
    .map((item) => `<li>${item}</li>`)
    .join("");
  elements.routeList.innerHTML = routes.map((route) => `<li>${route}</li>`).join("");
  renderWeather();
  drawFarmMap();
}

function renderWeather() {
  const mockWeather = getMockWeather();
  elements.weatherInfo.innerHTML = `
    <strong>${mockWeather.location}</strong>
    <span>${mockWeather.condition}</span>
    <span>${mockWeather.temperature}℃ · ${mockWeather.humidity}% 湿度</span>
  `;
}

function getMockWeather() {
  const conditions = ["晴朗", "多云", "小雨", "微风", "晴转多云"];
  const condition = conditions[Math.floor(Math.random() * conditions.length)];
  return {
    location: "田园生态园",
    condition,
    temperature: (18 + Math.random() * 10).toFixed(1),
    humidity: Math.floor(40 + Math.random() * 40),
  };
}

function drawFarmMap() {
  const ctx = elements.farmMap.getContext("2d");
  ctx.clearRect(0, 0, elements.farmMap.width, elements.farmMap.height);
  ctx.fillStyle = "#e9f7ef";
  ctx.fillRect(0, 0, 320, 240);

  ctx.fillStyle = "#b5d99c";
  ctx.fillRect(20, 20, 120, 80);
  ctx.fillRect(160, 30, 140, 90);
  ctx.fillRect(40, 120, 110, 90);
  ctx.fillRect(180, 140, 100, 70);

  ctx.strokeStyle = "#4f772d";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(20, 200);
  ctx.bezierCurveTo(80, 140, 200, 180, 300, 60);
  ctx.stroke();

  ctx.fillStyle = "#386641";
  ctx.font = "14px sans-serif";
  ctx.fillText("迎宾驿站", 30, 40);
  ctx.fillText("生态展示馆", 170, 50);
  ctx.fillText("茶园步道", 50, 150);
  ctx.fillText("星空营地", 190, 180);
}

function initPreparation() {
  renderChecklist();
  renderPackingList();
  startCountdown();
  elements.packingForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const value = elements.packingInput.value.trim();
    if (!value) return;
    state.packingItems.push(value);
    elements.packingInput.value = "";
    persistPacking();
    renderPackingList();
  });
}

function renderChecklist() {
  elements.checklist.innerHTML = state.checklist
    .map(
      (item) => `
        <li>
          <label class="checklist-item">
            <input type="checkbox" data-id="${item.id}" ${item.done ? "checked" : ""} />
            <span>${item.label}</span>
          </label>
        </li>
      `
    )
    .join("");

  elements.checklist.querySelectorAll("input[type=checkbox]").forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      const id = Number(checkbox.dataset.id);
      const item = state.checklist.find((entry) => entry.id === id);
      if (item) {
        item.done = checkbox.checked;
      }
    });
  });
}

function persistPacking() {
  localStorage.setItem("xssy-packing", JSON.stringify(state.packingItems));
}

function renderPackingList() {
  elements.packingList.innerHTML = "";
  state.packingItems.forEach((item, index) => {
    const tag = document.createElement("li");
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = `✕ ${item}`;
    button.addEventListener("click", () => {
      state.packingItems.splice(index, 1);
      persistPacking();
      renderPackingList();
    });
    tag.append(button);
    elements.packingList.append(tag);
  });
}

function startCountdown() {
  const departure = new Date();
  departure.setDate(departure.getDate() + 5);
  departure.setHours(8, 30, 0, 0);
  const update = () => {
    const now = new Date();
    const diff = departure - now;
    if (diff <= 0) {
      elements.countdown.textContent = "旅程开始啦！";
      return;
    }
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    elements.countdown.textContent = `距离出发还有 ${days} 天 ${hours} 小时 ${minutes} 分`;
    setTimeout(update, 60000);
  };
  update();
}

function initExplore() {
  populateThemeFilter();
  renderDestinationCards();
  elements.themeFilter.addEventListener("change", renderDestinationCards);
  elements.searchInput.addEventListener("input", renderDestinationCards);
}

function populateThemeFilter() {
  const themes = ["全部主题", ...new Set(destinations.map((item) => item.theme))];
  elements.themeFilter.innerHTML = themes
    .map((theme) => `<option value="${theme}">${theme}</option>`)
    .join("");
}

function renderDestinationCards() {
  const filter = elements.themeFilter.value;
  const keyword = elements.searchInput.value.trim().toLowerCase();
  const filtered = destinations.filter((destination) => {
    const matchTheme = filter === "全部主题" || destination.theme === filter;
    const matchKeyword =
      destination.title.toLowerCase().includes(keyword) ||
      destination.description.toLowerCase().includes(keyword) ||
      destination.tags.some((tag) => tag.toLowerCase().includes(keyword));
    return matchTheme && matchKeyword;
  });

  elements.destinationGrid.innerHTML = "";
  const template = document.getElementById("destination-card-template");
  filtered.forEach((destination) => {
    const node = template.content.cloneNode(true);
    const article = node.querySelector("article");
    const img = node.querySelector("img");
    const title = node.querySelector(".card-title");
    const description = node.querySelector(".card-description");
    const tags = node.querySelector(".card-tags");
    const action = node.querySelector(".card-action");

    img.src = destination.image;
    img.alt = destination.title;
    title.textContent = destination.title;
    description.textContent = destination.description;
    tags.innerHTML = destination.tags.map((tag) => `<li>${tag}</li>`).join("");

    const isFavorite = state.favorites.has(destination.id);
    updateFavoriteButton(action, isFavorite);
    action.addEventListener("click", () => {
      const currentlyFavorite = state.favorites.has(destination.id);
      if (currentlyFavorite) {
        state.favorites.delete(destination.id);
      } else {
        state.favorites.add(destination.id);
      }
      localStorage.setItem("xssy-favorites", JSON.stringify([...state.favorites]));
      updateFavoriteButton(action, !currentlyFavorite);
    });

    elements.destinationGrid.append(article);
  });

  if (!filtered.length) {
    elements.destinationGrid.innerHTML = `<p class="muted">没有找到符合条件的目的地，请尝试其他筛选。</p>`;
  }
}

function updateFavoriteButton(button, isFavorite) {
  button.textContent = isFavorite ? "已收藏" : "收藏";
  button.classList.toggle("primary", isFavorite);
  button.classList.toggle("secondary", !isFavorite);
}

function initDataBoard() {
  elements.refreshData.addEventListener("click", renderDataCharts);
  renderDataCharts();
}

function renderDataCharts() {
  const originDataset = generateOriginDataset();
  const satisfactionDataset = generateSatisfactionDataset();
  drawBarChart(elements.originChart, originDataset);
  drawLineChart(elements.satisfactionChart, satisfactionDataset);
  const heatScore = (70 + Math.random() * 30).toFixed(0);
  elements.heatScore.textContent = heatScore;
}

function generateOriginDataset() {
  return [
    { label: "本地", value: randomInt(30, 60) },
    { label: "周边城市", value: randomInt(20, 45) },
    { label: "省外", value: randomInt(10, 25) },
    { label: "海外", value: randomInt(2, 10) },
  ];
}

function generateSatisfactionDataset() {
  return Array.from({ length: 6 }, (_, index) => ({
    label: `${index + 1}月`,
    value: randomInt(80, 98),
  }));
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function drawBarChart(canvas, dataset) {
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const padding = 30;
  const width = canvas.width - padding * 2;
  const height = canvas.height - padding * 2;
  const max = Math.max(...dataset.map((item) => item.value));
  const barWidth = width / dataset.length - 20;

  ctx.strokeStyle = "#cbd5f5";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(padding, canvas.height - padding);
  ctx.lineTo(canvas.width - padding, canvas.height - padding);
  ctx.stroke();

  dataset.forEach((item, index) => {
    const barHeight = (item.value / max) * height;
    const x = padding + index * (barWidth + 20) + 10;
    const y = canvas.height - padding - barHeight;

    const gradient = ctx.createLinearGradient(x, y, x, y + barHeight);
    gradient.addColorStop(0, "#6ee7b7");
    gradient.addColorStop(1, "#34d399");

    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, barWidth, barHeight);

    ctx.fillStyle = "#1f2937";
    ctx.font = "12px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(item.label, x + barWidth / 2, canvas.height - padding + 16);
    ctx.fillText(item.value, x + barWidth / 2, y - 6);
  });
}

function drawLineChart(canvas, dataset) {
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const padding = 30;
  const width = canvas.width - padding * 2;
  const height = canvas.height - padding * 2;
  const max = Math.max(...dataset.map((item) => item.value));
  const step = width / (dataset.length - 1);

  ctx.strokeStyle = "#d1d5db";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(padding, canvas.height - padding);
  ctx.lineTo(canvas.width - padding, canvas.height - padding);
  ctx.stroke();

  ctx.beginPath();
  dataset.forEach((item, index) => {
    const x = padding + index * step;
    const y = canvas.height - padding - (item.value / max) * height;
    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });
  ctx.strokeStyle = "#60a5fa";
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.fillStyle = "#3b82f6";
  dataset.forEach((item, index) => {
    const x = padding + index * step;
    const y = canvas.height - padding - (item.value / max) * height;
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#1f2937";
    ctx.font = "12px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(item.label, x, canvas.height - padding + 16);
    ctx.fillText(item.value, x, y - 10);
    ctx.fillStyle = "#3b82f6";
  });
}

function initCommunity() {
  renderFeedback();
  renderEvents();
  elements.feedbackForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = document.getElementById("feedback-name").value.trim();
    const message = document.getElementById("feedback-message").value.trim();
    if (!name || !message) return;

    const entry = {
      id: (crypto?.randomUUID?.() ?? `feedback-${Date.now()}`),
      name,
      message,
      time: new Date().toLocaleString(),
    };
    state.feedback.unshift(entry);
    localStorage.setItem("xssy-feedback", JSON.stringify(state.feedback));
    elements.feedbackForm.reset();
    renderFeedback();
  });

  elements.toggleMap.addEventListener("click", () => {
    elements.communityMap.hidden = !elements.communityMap.hidden;
    elements.toggleMap.textContent = elements.communityMap.hidden ? "显示互动地图" : "隐藏互动地图";
    if (!elements.communityMap.hidden) {
      drawCommunityMap();
    }
  });
}

function renderFeedback() {
  elements.feedbackList.innerHTML = state.feedback
    .map(
      (item) => `
        <li class="feedback-item">
          <strong>${item.name}</strong>
          <small>${item.time}</small>
          <p>${item.message}</p>
        </li>
      `
    )
    .join("");

  if (!state.feedback.length) {
    elements.feedbackList.innerHTML = "<li class=\"feedback-item\">还没有留言，快来成为第一位分享者吧！</li>";
  }
}

function renderEvents() {
  elements.eventList.innerHTML = events
    .map((event) => `<li><strong>${event.time}</strong> ${event.title}</li>`)
    .join("");
}

function drawCommunityMap() {
  const ctx = elements.mapCanvas.getContext("2d");
  ctx.clearRect(0, 0, elements.mapCanvas.width, elements.mapCanvas.height);
  ctx.fillStyle = "#eef2ff";
  ctx.fillRect(0, 0, elements.mapCanvas.width, elements.mapCanvas.height);

  const points = [
    { x: 40, y: 180, label: "咖啡露台" },
    { x: 120, y: 80, label: "自然课堂" },
    { x: 220, y: 140, label: "童趣乐园" },
    { x: 260, y: 50, label: "艺术谷仓" },
  ];

  ctx.fillStyle = "#4c1d95";
  ctx.font = "12px sans-serif";
  points.forEach((point) => {
    ctx.beginPath();
    ctx.arc(point.x, point.y, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillText(point.label, point.x + 10, point.y + 4);
  });
}

function initApp() {
  initNavigation();
  initLogin();
  initOverview();
  initPreparation();
  initExplore();
  initDataBoard();
  initCommunity();
}

initApp();
