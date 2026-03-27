const feedbackAdminMe = document.querySelector("#feedback-admin-me");
const feedbackAdminLogoutBtn = document.querySelector("#feedback-admin-logout-btn");
const feedbackAdminRefreshBtn = document.querySelector("#feedback-admin-refresh-btn");
const feedbackAdminStatus = document.querySelector("#feedback-admin-status");
const feedbackAdminSummary = document.querySelector("#feedback-admin-summary");
const feedbackAdminList = document.querySelector("#feedback-admin-list");

class ApiHttpError extends Error {
  constructor(status, payload) {
    super(payload?.message || payload?.error || "request_failed");
    this.name = "ApiHttpError";
    this.status = Number(status || 0);
    this.payload = payload || {};
  }
}

async function parseApiResponse(res) {
  const text = await res.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch (_) {
    return { message: text };
  }
}

async function api(path) {
  const res = await fetch(path);
  const data = await parseApiResponse(res);
  if (!res.ok) throw new ApiHttpError(res.status, data);
  return data;
}

async function apiPost(path, payload) {
  const res = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  const data = await parseApiResponse(res);
  if (!res.ok) throw new ApiHttpError(res.status, data);
  return data;
}

function getDisplayError(error) {
  if (error instanceof ApiHttpError) {
    if (error.payload?.message) return String(error.payload.message);
    if (error.status === 401) return "ログイン状態が切れました。再ログインしてください";
    return String(error.payload?.error || error.message || "request_failed");
  }
  return String(error?.message || error || "request_failed");
}

function formatFeedbackCategory(category) {
  const map = {
    general: "全体の感想",
    ui: "使いやすさ",
    chat: "チャット相談",
    record: "記録機能",
    share: "共有・医師向け機能",
    bug: "不具合"
  };
  return map[String(category || "").trim()] || String(category || "その他");
}

async function ensureOperatorAuth() {
  try {
    const data = await api("/api/v1/doctor/auth/me");
    const name = data?.doctor?.display_name || data?.doctor?.email || "-";
    if (feedbackAdminMe) feedbackAdminMe.textContent = `運営: ${name}`;
    return true;
  } catch (_) {
    const next = `${window.location.pathname}${window.location.search}`;
    window.location.href = `/doctor-login?next=${encodeURIComponent(next)}`;
    return false;
  }
}

function renderFeedbackList(data) {
  if (!feedbackAdminList || !feedbackAdminSummary || !feedbackAdminStatus) return;
  const items = Array.isArray(data?.items) ? data.items : [];
  feedbackAdminList.innerHTML = "";
  feedbackAdminSummary.textContent = `平均満足度: ${Number(data?.avg_rating || 0).toFixed(1)} / 5 (${items.length}件)`;
  feedbackAdminStatus.textContent = `更新: ${new Date(data?.generated_at || Date.now()).toLocaleString("ja-JP")}`;
  if (!items.length) {
    const li = document.createElement("li");
    li.textContent = "まだフィードバックはありません";
    feedbackAdminList.append(li);
    return;
  }
  for (const item of items) {
    const li = document.createElement("li");
    li.textContent = `${new Date(item.created_at).toLocaleString("ja-JP")} / ★${item.rating} / ${formatFeedbackCategory(item.category)} / ${item.comment}`;
    feedbackAdminList.append(li);
  }
}

async function loadFeedbackList() {
  const data = await api("/api/v1/doctor/feedback?limit=100");
  renderFeedbackList(data);
  return data;
}

ensureOperatorAuth().then((ok) => {
  if (!ok) return;
  loadFeedbackList().catch((error) => {
    if (feedbackAdminStatus) feedbackAdminStatus.textContent = getDisplayError(error);
  });
});

if (feedbackAdminRefreshBtn) {
  feedbackAdminRefreshBtn.addEventListener("click", () => {
    loadFeedbackList().catch((error) => {
      if (feedbackAdminStatus) feedbackAdminStatus.textContent = getDisplayError(error);
    });
  });
}

if (feedbackAdminLogoutBtn) {
  feedbackAdminLogoutBtn.addEventListener("click", async () => {
    try {
      await apiPost("/api/v1/doctor/auth/logout", {});
    } finally {
      window.location.href = "/doctor-login";
    }
  });
}
