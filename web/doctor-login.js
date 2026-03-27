const form = document.querySelector("#doctor-login-form");
const emailInput = document.querySelector("#doctor-email");
const passwordInput = document.querySelector("#doctor-password");
const loginBtn = document.querySelector("#doctor-login-btn");
const statusView = document.querySelector("#doctor-login-status");

class ApiHttpError extends Error {
  constructor(status, payload) {
    super(payload?.message || payload?.error || "login_failed");
    this.name = "ApiHttpError";
    this.status = Number(status || 0);
    this.payload = payload || {};
  }
}

function localizeLoginError(error) {
  if (error instanceof ApiHttpError) {
    if (error.payload?.message) return String(error.payload.message);
    if (error.status === 401) return "メールアドレスまたはパスワードが正しくありません。入力内容を確認してください";
    if (error.status === 403) return "このアカウントはログイン権限がありません";
    if (error.status === 404) return "ログイン先が見つかりません。時間をおいて再度お試しください";
    if (error.status === 410) return "セッションが無効です。ページを再読み込みして再試行してください";
    if (error.status === 429) return "ログイン試行回数が上限に達しました。少し待ってから再試行してください";
    return String(error.payload?.error || error.message || "login_failed");
  }
  return String(error?.message || error || "login_failed");
}

function nextPath() {
  const params = new URLSearchParams(window.location.search);
  const next = params.get("next");
  const allowed =
    next &&
    (next.startsWith("/doctor") || next.startsWith("/feedback-admin"));
  if (!allowed) return "/doctor";
  return next;
}

async function login(email, password) {
  const res = await fetch("/api/v1/doctor/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  const text = await res.text();
  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch (_) {
    data = { message: text };
  }
  if (!res.ok) throw new ApiHttpError(res.status, data);
  return data;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  loginBtn.disabled = true;
  const before = loginBtn.textContent;
  loginBtn.textContent = "ログイン中...";
  statusView.textContent = "認証中...";
  try {
    await login(emailInput.value.trim(), passwordInput.value);
    statusView.textContent = "ログイン成功";
    window.location.href = nextPath();
  } catch (error) {
    statusView.textContent = `ログイン失敗: ${localizeLoginError(error)}`;
  } finally {
    loginBtn.disabled = false;
    loginBtn.textContent = before;
  }
});
