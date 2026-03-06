const tokenInput = document.querySelector("#doctor-token");
const loadBtn = document.querySelector("#doctor-load-btn");
const statusView = document.querySelector("#doctor-status");
const doctorShareContext = document.querySelector("#doctor-share-context");
const doctorMe = document.querySelector("#doctor-me");
const doctorLogoutBtn = document.querySelector("#doctor-logout-btn");
const doctorQueueRefreshBtn = document.querySelector("#doctor-queue-refresh-btn");
const doctorQueueStatus = document.querySelector("#doctor-queue-status");
const doctorQueueList = document.querySelector("#doctor-queue-list");
const triageView = document.querySelector("#triage-view");
const patientView = document.querySelector("#patient-view");
const periodView = document.querySelector("#period-view");
const metricsView = document.querySelector("#metrics-view");
const doctorChartStatus = document.querySelector("#doctor-chart-status");
const doctorTrendChart = document.querySelector("#doctor-trend-chart");
const latestView = document.querySelector("#latest-view");
const imagesStatus = document.querySelector("#images-status");
const imagesView = document.querySelector("#images-view");
const symptomsView = document.querySelector("#symptoms-view");
const medicationView = document.querySelector("#medication-view");
const notesView = document.querySelector("#notes-view");
const providersView = document.querySelector("#providers-view");
const doctorAuthor = document.querySelector("#doctor-author");
const doctorNote = document.querySelector("#doctor-note");
const doctorSaveNoteBtn = document.querySelector("#doctor-save-note-btn");
const doctorNoteStatus = document.querySelector("#doctor-note-status");
const doctorHandoffTo = document.querySelector("#doctor-handoff-to");
const doctorHandoffNote = document.querySelector("#doctor-handoff-note");
const doctorHandoffExpires = document.querySelector("#doctor-handoff-expires");
const doctorHandoffCreateBtn = document.querySelector("#doctor-handoff-create-btn");
const doctorHandoffStatus = document.querySelector("#doctor-handoff-status");
const doctorHandoffLinks = document.querySelector("#doctor-handoff-links");
const imageModal = document.querySelector("#image-modal");
const imageModalImg = document.querySelector("#image-modal-img");
const imageModalClose = document.querySelector("#image-modal-close");
let currentToken = "";
let currentTimeline = [];

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

function getDisplayError(error) {
  if (error instanceof ApiHttpError) {
    if (error.payload?.message) return String(error.payload.message);
    if (error.status === 401) return "ログイン状態が切れました。再ログインしてください";
    if (error.status === 403) return "この操作を行う権限がありません。管理者に確認してください";
    if (error.status === 404) return "共有情報が見つかりません。患者側で共有リンクを再発行してください";
    if (error.status === 410) return "共有リンクは期限切れまたは失効済みです。患者側に再発行を依頼してください";
    if (error.status === 429) return "アクセスが集中しています。少し待ってから再試行してください";
    return String(error.payload?.error || error.message || "request_failed");
  }
  return String(error?.message || error || "request_failed");
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

async function ensureDoctorAuth() {
  try {
    const data = await api("/api/v1/doctor/auth/me");
    const name = data?.doctor?.display_name || data?.doctor?.email || "-";
    if (doctorMe) doctorMe.textContent = `医師: ${name}`;
    return true;
  } catch (error) {
    if (error instanceof ApiHttpError && error.status !== 401) {
      if (doctorMe) doctorMe.textContent = `医師: ${getDisplayError(error)}`;
      return false;
    }
    const next = `${window.location.pathname}${window.location.search}`;
    window.location.href = `/doctor-login?next=${encodeURIComponent(next)}`;
    return false;
  }
}

function renderList(el, items, mapper) {
  el.innerHTML = "";
  if (!items.length) {
    const li = document.createElement("li");
    li.textContent = "なし";
    el.append(li);
    return;
  }
  for (const item of items) {
    const li = document.createElement("li");
    li.textContent = mapper(item);
    el.append(li);
  }
}

function setText(el, text) {
  if (!el) return;
  el.textContent = text;
}

async function copyText(text) {
  if (!text) return;
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const area = document.createElement("textarea");
  area.value = text;
  document.body.append(area);
  area.select();
  document.execCommand("copy");
  area.remove();
}

function openImageModal(src, alt = "拡大画像") {
  if (!imageModal || !imageModalImg) return;
  imageModalImg.src = src;
  imageModalImg.alt = alt;
  imageModal.classList.remove("hidden");
}

function closeImageModal() {
  if (!imageModal || !imageModalImg) return;
  imageModal.classList.add("hidden");
  imageModalImg.removeAttribute("src");
}

function renderImages(items) {
  if (!imagesView || !imagesStatus) return;
  imagesView.innerHTML = "";
  if (!items.length) {
    imagesStatus.textContent = "画像なし";
    return;
  }
  imagesStatus.textContent = `${items.length}件の画像メモ`;
  for (const item of items) {
    const card = document.createElement("figure");
    card.className = "doctor-image-card";
    const img = document.createElement("img");
    img.src = item.url;
    img.alt = item.file_name || "画像メモ";
    img.loading = "lazy";
    img.addEventListener("click", () => openImageModal(item.url, item.file_name || "画像メモ"));
    const cap = document.createElement("figcaption");
    cap.textContent = `${item.date || "-"} ${item.note ? ` / ${item.note}` : ""}`;
    card.append(img, cap);
    imagesView.append(card);
  }
}

function renderHandoffLinks(items) {
  if (!doctorHandoffLinks) return;
  doctorHandoffLinks.innerHTML = "";
  if (!items.length) {
    const li = document.createElement("li");
    li.textContent = "引き継ぎリンクはまだありません";
    doctorHandoffLinks.append(li);
    return;
  }
  for (const item of items) {
    const li = document.createElement("li");
    const kindLabel = item.kind === "doctor_handoff" ? "医師連携" : "患者共有";
    const toLabel = item.handoff_to ? ` / 宛先: ${item.handoff_to}` : "";
    const byLabel = item.issued_by_doctor_name ? ` / 発行: ${item.issued_by_doctor_name}` : "";
    li.textContent = `${kindLabel} / 状態:${item.status} / 期限:${new Date(item.expires_at).toLocaleString("ja-JP")}${toLabel}${byLabel}`;

    const row = document.createElement("div");
    row.className = "review-row";
    const openLink = document.createElement("a");
    openLink.href = item.doctor_url;
    openLink.target = "_blank";
    openLink.rel = "noopener noreferrer";
    openLink.textContent = "医師ビューを開く";
    row.append(openLink);

    const copyBtn = document.createElement("button");
    copyBtn.type = "button";
    copyBtn.textContent = "リンクをコピー";
    copyBtn.addEventListener("click", async () => {
      await copyText(`${window.location.origin}${item.doctor_url}`);
      setText(doctorHandoffStatus, "引き継ぎリンクをコピーしました");
    });
    row.append(copyBtn);

    if (item.handoff_note) {
      const note = document.createElement("p");
      note.className = "last-sync";
      note.textContent = `メモ: ${item.handoff_note}`;
      li.append(note);
    }
    li.append(row);
    doctorHandoffLinks.append(li);
  }
}

function queueTierClass(tier) {
  if (tier === "urgent") return "queue-tier-urgent";
  if (tier === "high") return "queue-tier-high";
  if (tier === "medium") return "queue-tier-medium";
  return "queue-tier-low";
}

function formatDateTime(value) {
  const date = new Date(String(value || ""));
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString("ja-JP");
}

function renderDoctorQueue(data) {
  if (!doctorQueueList) return;
  const items = Array.isArray(data?.items) ? data.items : [];
  doctorQueueList.innerHTML = "";

  if (!items.length) {
    const li = document.createElement("li");
    li.textContent = "優先確認対象はありません";
    doctorQueueList.append(li);
    return;
  }

  for (const item of items) {
    const li = document.createElement("li");
    li.className = "doctor-queue-item";

    const row = document.createElement("div");
    row.className = "review-row";

    const badge = document.createElement("span");
    badge.className = `queue-tier ${queueTierClass(item.priority_tier)}`;
    badge.textContent = `${item.priority_label || "-"} (${item.priority_score ?? 0})`;
    row.append(badge);

    const meta = document.createElement("span");
    meta.className = "last-sync";
    meta.textContent = `${item.display_name || item.user_id} / リスク:${item.risk_level || "-"} / 傾向:${item.trend || "-"}`;
    row.append(meta);

    const openBtn = document.createElement("button");
    openBtn.type = "button";
    openBtn.textContent = "この患者を開く";
    openBtn.addEventListener("click", () => {
      const doctorUrl = String(item.doctor_url || "");
      const match = doctorUrl.match(/[?&]token=([a-f0-9]{32})/);
      if (!match) return;
      const token = match[1];
      if (tokenInput) tokenInput.value = token;
      loadDoctorView(token).catch(() => {});
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    row.append(openBtn);
    li.append(row);

    const detail = document.createElement("p");
    detail.className = "last-sync";
    detail.textContent = `最終記録: ${formatDateTime(item.last_recorded_at)} / つらさ${
      item.symptom_score ?? "-"
    } / 気分${item.mood_score ?? "-"}`;
    li.append(detail);

    if (Array.isArray(item.priority_reasons) && item.priority_reasons.length) {
      const reason = document.createElement("p");
      reason.className = "queue-reason";
      reason.textContent = `優先理由: ${item.priority_reasons.join(" / ")}`;
      li.append(reason);
    }

    doctorQueueList.append(li);
  }
}

async function loadDoctorQueue() {
  if (!doctorQueueStatus) return;
  setText(doctorQueueStatus, "更新中...");
  try {
    const data = await api("/api/v1/doctor/queue?window_days=14");
    renderDoctorQueue(data);
    setText(
      doctorQueueStatus,
      `更新済み: ${data.total || 0}件 (最優先:${data?.counts?.urgent || 0} / 高:${data?.counts?.high || 0})`
    );
  } catch (error) {
    setText(doctorQueueStatus, `更新失敗: ${getDisplayError(error)}`);
  }
}

function drawDoctorTrendChart(items) {
  const canvas = doctorTrendChart;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    setText(doctorChartStatus, "グラフ描画不可: canvas非対応");
    return;
  }

  const dpr = window.devicePixelRatio || 1;
  const cssWidth = canvas.clientWidth || 640;
  const cssHeight = canvas.clientHeight || 220;
  canvas.width = Math.floor(cssWidth * dpr);
  canvas.height = Math.floor(cssHeight * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, cssWidth, cssHeight);

  const pad = { top: 16, right: 12, bottom: 30, left: 38 };
  const w = cssWidth - pad.left - pad.right;
  const h = cssHeight - pad.top - pad.bottom;
  if (!items.length) {
    ctx.fillStyle = "#7f6f63";
    ctx.font = "13px sans-serif";
    ctx.fillText("表示できるデータがありません", 14, cssHeight / 2);
    setText(doctorChartStatus, "表示データなし");
    return;
  }

  const xFor = (idx) => pad.left + (items.length === 1 ? w / 2 : (idx / (items.length - 1)) * w);
  const yFor = (v) => pad.top + h - (Math.max(0, Math.min(10, Number(v) || 0)) / 10) * h;

  ctx.strokeStyle = "#eadcca";
  ctx.lineWidth = 1;
  ctx.fillStyle = "#8e7b6a";
  ctx.font = "10px sans-serif";
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  for (let y = 0; y <= 10; y += 2) {
    const yy = pad.top + h - (y / 10) * h;
    ctx.beginPath();
    ctx.moveTo(pad.left, yy);
    ctx.lineTo(pad.left + w, yy);
    ctx.stroke();
    ctx.fillText(String(y), pad.left - 6, yy);
  }

  function drawSeries(key, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    items.forEach((item, i) => {
      const x = xFor(i);
      const y = yFor(item[key]);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
  }

  drawSeries("symptom_score", "#d36b2c");
  drawSeries("mood_score", "#4f82cf");
  drawSeries("sleep_quality_score", "#47a17a");

  ctx.strokeStyle = "#decdb9";
  ctx.beginPath();
  ctx.moveTo(pad.left, pad.top + h);
  ctx.lineTo(pad.left + w, pad.top + h);
  ctx.stroke();

  const tickIndices = [0];
  for (let i = 1; i < items.length - 1; i += 1) {
    if (i % 7 === 0) tickIndices.push(i);
  }
  if (items.length > 1) tickIndices.push(items.length - 1);

  ctx.fillStyle = "#7f6f63";
  ctx.font = "11px sans-serif";
  ctx.textBaseline = "top";
  for (const idx of tickIndices) {
    const x = xFor(idx);
    const label = String(items[idx].date || "").slice(5, 10).replace("-", "/");
    ctx.beginPath();
    ctx.moveTo(x, pad.top + h);
    ctx.lineTo(x, pad.top + h + 4);
    ctx.stroke();
    if (x < pad.left + 22) ctx.textAlign = "left";
    else if (x > pad.left + w - 22) ctx.textAlign = "right";
    else ctx.textAlign = "center";
    ctx.fillText(label, x, pad.top + h + 6);
  }

  setText(
    doctorChartStatus,
    `表示中: ${items.length}件（${items[0].date || "-"} 〜 ${items[items.length - 1].date || "-"}）`
  );
}

function applyData(data) {
  const summary = data.summary || {};
  const share = data.share || {};
  const triage = summary.triage || {};
  const patient = summary.patient || {};
  const period = summary.period || {};
  const metrics = summary.metrics || {};
  const latest = summary.latest_record || {};

  const kindLabel = share.kind === "doctor_handoff" ? "医師間引き継ぎ" : "患者共有";
  const fromLabel = share.issued_by_doctor_name ? ` / 発行医: ${share.issued_by_doctor_name}` : "";
  const toLabel = share.handoff_to ? ` / 宛先: ${share.handoff_to}` : "";
  const noteLabel = share.handoff_note ? ` / メモ: ${share.handoff_note}` : "";
  setText(doctorShareContext, `共有種別: ${kindLabel}${fromLabel}${toLabel}${noteLabel}`);

  setText(
    triageView,
    `リスク: ${triage.risk_level || "-"} / 傾向: ${triage.trend || "-"} / 提案: ${triage.recommendation || "-"}`
  );
  setText(
    patientView,
    `ID: ${patient.user_id || "-"} / 名前: ${patient.display_name || "-"} / 年齢: ${patient.age ?? "-"} / 性別: ${
      patient.sex || "-"
    } / BMI: ${patient.bmi ?? "-"} / 持病: ${patient.chronic_conditions || "-"}`
  );
  setText(periodView, `${period.from || "-"} 〜 ${period.to || "-"} / 記録 ${period.records || 0}件`);
  setText(
    metricsView,
    `症状平均 ${metrics.symptom_score_avg ?? "-"} / 気分平均 ${metrics.mood_score_avg ?? "-"} / 睡眠時間平均 ${
      metrics.sleep_hours_avg ?? "-"
    }h / 睡眠質平均 ${metrics.sleep_quality_score_avg ?? "-"}`
  );
  currentTimeline = Array.isArray(summary.timeline_scores) ? summary.timeline_scores : [];
  drawDoctorTrendChart(currentTimeline);
  setText(
    latestView,
    `${String(latest.recorded_at || "-").slice(0, 16)} / 症状: ${(latest.symptoms || []).join("・") || "-"} / つらさ${
      latest.symptom_score ?? "-"
    } / 気分${latest.mood_score ?? "-"} / 睡眠${latest.sleep_hours ?? "-"}h / 服薬${latest.medication_status || "-"}`
  );
  renderImages(Array.isArray(summary.image_evidence) ? summary.image_evidence : []);

  renderList(symptomsView, summary.top_symptoms || [], (s) => `${s.symptom}: ${s.count}回`);

  const med = summary.medication_summary || {};
  setText(
    medicationView,
    `飲んだ ${med.taken || 0} / 飲み忘れ ${med.missed || 0} / なし ${med.none || 0} / 不明 ${med.unknown || 0}`
  );

  renderList(notesView, summary.note_digest || [], (n) => n);
  renderList(
    providersView,
    summary.provider_suggestions || [],
    (p) => `${p.name} (適合 ${p.fit_score}, ${p.online_available ? "オンライン可" : "対面"})`
  );
}

async function loadDoctorHandoffs(token) {
  if (!token) return;
  try {
    const data = await api(`/api/v1/doctor/handoffs?token=${encodeURIComponent(token)}`);
    renderHandoffLinks(data.items || []);
  } catch (error) {
    if (doctorHandoffLinks) {
      doctorHandoffLinks.innerHTML = "";
      const li = document.createElement("li");
      li.textContent = `引き継ぎリンク読込失敗: ${getDisplayError(error)}`;
      doctorHandoffLinks.append(li);
    }
  }
}

async function loadDoctorView(token) {
  if (!token) {
    setText(statusView, "トークンを入力してください");
    return;
  }
  currentToken = token;
  setText(statusView, "読み込み中...");
  try {
    const data = await api(`/api/v1/doctor/view?token=${encodeURIComponent(token)}`);
    applyData(data);
    await loadDoctorHandoffs(token);
    const exp = data.share?.expires_at ? new Date(data.share.expires_at).toLocaleString("ja-JP") : "-";
    setText(statusView, `読み込み完了 / 有効期限: ${exp}`);
  } catch (error) {
    setText(statusView, `読み込み失敗: ${getDisplayError(error)}`);
    setText(doctorShareContext, "共有種別: -");
  }
}

async function saveDoctorNote() {
  if (!currentToken) {
    setText(doctorNoteStatus, "先に情報を読み込んでください");
    return;
  }
  const note = String(doctorNote.value || "").trim();
  const author = String(doctorAuthor.value || "担当医").trim() || "担当医";
  if (!note) {
    setText(doctorNoteStatus, "コメントを入力してください");
    return;
  }
  setText(doctorNoteStatus, "保存中...");
  try {
    await apiPost("/api/v1/doctor/notes", {
      token: currentToken,
      author,
      note
    });
    setText(doctorNoteStatus, "保存しました");
    doctorNote.value = "";
  } catch (error) {
    setText(doctorNoteStatus, `保存失敗: ${getDisplayError(error)}`);
  }
}

async function createDoctorHandoff() {
  if (!currentToken) {
    setText(doctorHandoffStatus, "先に情報を読み込んでください");
    return;
  }
  const handoffTo = String(doctorHandoffTo?.value || "").trim();
  const handoffNote = String(doctorHandoffNote?.value || "").trim();
  const expiresHours = Number(doctorHandoffExpires?.value || 24);
  setText(doctorHandoffStatus, "引き継ぎリンク発行中...");
  try {
    const data = await apiPost("/api/v1/doctor/handoffs", {
      token: currentToken,
      handoff_to: handoffTo,
      handoff_note: handoffNote,
      expires_hours: expiresHours
    });
    if (doctorHandoffNote) doctorHandoffNote.value = "";
    const url = `${window.location.origin}${data?.item?.doctor_url || ""}`;
    if (url && data?.item?.doctor_url) {
      await copyText(url);
      setText(doctorHandoffStatus, "引き継ぎリンクを発行し、クリップボードにコピーしました");
    } else {
      setText(doctorHandoffStatus, "引き継ぎリンクを発行しました");
    }
    await loadDoctorHandoffs(currentToken);
  } catch (error) {
    setText(doctorHandoffStatus, `引き継ぎリンク発行失敗: ${getDisplayError(error)}`);
  }
}

loadBtn.addEventListener("click", () => {
  loadDoctorView(tokenInput.value.trim());
});

const params = new URLSearchParams(window.location.search);
const initialToken = params.get("token") || "";
ensureDoctorAuth().then((ok) => {
  if (!ok) return;
  loadDoctorQueue().catch(() => {});
  if (initialToken) {
    tokenInput.value = initialToken;
    loadDoctorView(initialToken).catch(() => {});
  }
});

doctorSaveNoteBtn.addEventListener("click", () => {
  saveDoctorNote().catch(() => {});
});

if (doctorHandoffCreateBtn) {
  doctorHandoffCreateBtn.addEventListener("click", () => {
    createDoctorHandoff().catch(() => {});
  });
}

if (doctorQueueRefreshBtn) {
  doctorQueueRefreshBtn.addEventListener("click", () => {
    loadDoctorQueue().catch(() => {});
  });
}

doctorLogoutBtn.addEventListener("click", async () => {
  try {
    await apiPost("/api/v1/doctor/auth/logout", {});
  } finally {
    window.location.href = "/doctor-login";
  }
});

if (imageModalClose) {
  imageModalClose.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    closeImageModal();
  });
}
if (imageModal) {
  imageModal.addEventListener("click", (event) => {
    if (event.target === imageModal) closeImageModal();
  });
}
document.addEventListener("click", (event) => {
  const target = event.target;
  if (target instanceof Element && target.id === "image-modal-close") {
    event.preventDefault();
    closeImageModal();
  }
});
window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeImageModal();
});

window.addEventListener("resize", () => {
  if (!currentTimeline.length) return;
  drawDoctorTrendChart(currentTimeline);
});
