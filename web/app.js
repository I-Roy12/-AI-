const output = document.querySelector("#output");
const form = document.querySelector("#log-form");
const insightRefreshBtn = document.querySelector("#insight-refresh-btn");
const matchBtn = document.querySelector("#match-btn");
const safetyBtn = document.querySelector("#safety-btn");
const safetyText = document.querySelector("#safety-text");
const meters = document.querySelectorAll(".meter");
const chips = document.querySelectorAll(".chip[data-chip]");
const symptomChips = document.querySelectorAll(".symptom-chip");
const summaryView = document.querySelector("#summary-view");
const summaryPraiseView = document.querySelector("#summary-praise-view");
const trendView = document.querySelector("#trend-view");
const nextStepView = document.querySelector("#next-step-view");
const recentList = document.querySelector("#recent-list");
const aiMessage = document.querySelector("#ai-message");
const consultChatMessages = document.querySelector("#consult-chat-messages");
const consultChatForm = document.querySelector("#consult-chat-form");
const consultChatInput = document.querySelector("#consult-chat-input");
const consultChatSendBtn = document.querySelector("#consult-chat-send-btn");
const consultChatStatus = document.querySelector("#consult-chat-status");
const consultChatShareBtn = document.querySelector("#consult-chat-share-btn");
const consultChatMatchBtn = document.querySelector("#consult-chat-match-btn");
const consultChatExampleBtns = document.querySelectorAll(".chat-example-btn");
const reviewDate = document.querySelector("#review-date");
const reviewBtn = document.querySelector("#review-btn");
const reviewEditBtn = document.querySelector("#review-edit-btn");
const reviewView = document.querySelector("#review-view");
const recordEntryCard = document.querySelector("#record-entry-card");
const recordEntryBody = document.querySelector("#record-entry-body");
const recordEntryToggleBtn = document.querySelector("#record-entry-toggle-btn");
const reservationView = document.querySelector("#reservation-view");
const locNearbyBtn = document.querySelector("#loc-nearby-btn");
const locClearBtn = document.querySelector("#loc-clear-btn");
const locStatus = document.querySelector("#loc-status");
const safetyStatus = document.querySelector("#safety-status");
const calendarMonth = document.querySelector("#calendar-month");
const calendarBtn = document.querySelector("#calendar-btn");
const calendarGrid = document.querySelector("#calendar-grid");
const statsView = document.querySelector("#stats-view");
const voiceMode = document.querySelector("#voice-mode");
const voiceBtn = document.querySelector("#voice-btn");
const voiceFileBtn = document.querySelector("#voice-file-btn");
const voiceFileInput = document.querySelector("#voice-file-input");
const voiceStatus = document.querySelector("#voice-status");
const voiceRoute = document.querySelector("#voice-route");
const voiceLast = document.querySelector("#voice-last");
const voiceAltBox = document.querySelector("#voice-alt-box");
const logImageInput = document.querySelector("#log-image-input");
const logImageClearBtn = document.querySelector("#log-image-clear-btn");
const logImageStatus = document.querySelector("#log-image-status");
const logImagePreview = document.querySelector("#log-image-preview");
const speakBtn = document.querySelector("#speak-btn");
const stopSpeakBtn = document.querySelector("#stop-speak-btn");
const autoSpeak = document.querySelector("#auto-speak");
const resetBtn = document.querySelector("#reset-btn");
const submitBtn = form.querySelector("button[type=submit]");
const editingStatus = document.querySelector("#editing-status");
const todayStatus = document.querySelector("#today-status");
const refreshBtn = document.querySelector("#refresh-btn");
const lastSync = document.querySelector("#last-sync");
const copyShareBtn = document.querySelector("#copy-share-btn");
const copyStatus = document.querySelector("#copy-status");
const tabRecordBtn = document.querySelector("#tab-record");
const tabMypageBtn = document.querySelector("#tab-mypage");
const recordPage = document.querySelector("#record-page");
const mypagePage = document.querySelector("#mypage-page");
const patientAuthStatus = document.querySelector("#patient-auth-status");
const patientAuthForm = document.querySelector("#patient-auth-form");
const patientDisplayNameInput = document.querySelector("#patient-display-name");
const patientLoginIdInput = document.querySelector("#patient-login-id");
const patientPasswordInput = document.querySelector("#patient-password");
const patientRegisterBtn = document.querySelector("#patient-register-btn");
const patientLoginBtn = document.querySelector("#patient-login-btn");
const patientLogoutBtn = document.querySelector("#patient-logout-btn");
const profileForm = document.querySelector("#profile-form");
const saveProfileBtn = document.querySelector("#save-profile-btn");
const resetProfileBtn = document.querySelector("#reset-profile-btn");
const profileStatus = document.querySelector("#profile-status");
const profileCompletion = document.querySelector("#profile-completion");
const bmiView = document.querySelector("#bmi-view");
const chartRange = document.querySelector("#chart-range");
const chartFrom = document.querySelector("#chart-from");
const chartTo = document.querySelector("#chart-to");
const chartRefreshBtn = document.querySelector("#chart-refresh-btn");
const trendChart = document.querySelector("#trend-chart");
const chartStatus = document.querySelector("#chart-status");
const exportUserBtn = document.querySelector("#export-user-btn");
const exportDoctorSummaryBtn = document.querySelector("#export-doctor-summary-btn");
const userIdBackupInput = document.querySelector("#user-id-backup-input");
const copyUserIdBtn = document.querySelector("#copy-user-id-btn");
const restoreUserIdBtn = document.querySelector("#restore-user-id-btn");
const userIdBackupStatus = document.querySelector("#user-id-backup-status");
const createShareLinkBtn = document.querySelector("#create-share-link-btn");
const shareStatus = document.querySelector("#share-status");
const shareLinksList = document.querySelector("#share-links-list");
const doctorNotesList = document.querySelector("#doctor-notes-list");
const doctorFollowupInput = document.querySelector("#doctor-followup-input");
const doctorFollowupBtn = document.querySelector("#doctor-followup-btn");
const doctorFollowupUseNoteBtn = document.querySelector("#doctor-followup-use-note-btn");
const doctorFollowupSampleBtn = document.querySelector("#doctor-followup-sample-btn");
const doctorFollowupStatus = document.querySelector("#doctor-followup-status");
const doctorFollowupOutput = document.querySelector("#doctor-followup-output");
const doctorFollowupSimple = document.querySelector("#doctor-followup-simple");
const doctorFollowupActions = document.querySelector("#doctor-followup-actions");
const doctorFollowupWatch = document.querySelector("#doctor-followup-watch");
const doctorFollowupConsult = document.querySelector("#doctor-followup-consult");
const exportStatus = document.querySelector("#export-status");
const revokeAllShareBtn = document.querySelector("#revoke-all-share-btn");
const seedDemoCleanBtn = document.querySelector("#seed-demo-clean-btn");
const cleanupStatus = document.querySelector("#cleanup-status");
const noteDisclaimerText = document.querySelector("#note-disclaimer-text");
const copyNoteDisclaimerBtn = document.querySelector("#copy-note-disclaimer-btn");
const noteDisclaimerStatus = document.querySelector("#note-disclaimer-status");
const feedbackRating = document.querySelector("#feedback-rating");
const feedbackCategory = document.querySelector("#feedback-category");
const feedbackComment = document.querySelector("#feedback-comment");
const feedbackSubmitBtn = document.querySelector("#feedback-submit-btn");
const feedbackStatus = document.querySelector("#feedback-status");
const draftNoteBtn = document.querySelector("#draft-note-btn");
const draftNoteStatus = document.querySelector("#draft-note-status");
const sleepStartTimeInput = document.querySelector("#sleep-start-time");
const sleepEndTimeInput = document.querySelector("#sleep-end-time");
const calcSleepHoursBtn = document.querySelector("#calc-sleep-hours-btn");
const sleepCalcStatus = document.querySelector("#sleep-calc-status");
const toast = document.querySelector("#toast");
const consentModal = document.querySelector("#consent-modal");
const consentCheck = document.querySelector("#consent-check");
const consentAgreeBtn = document.querySelector("#consent-agree-btn");
const consentReloadBtn = document.querySelector("#consent-reload-btn");
const consentStatus = document.querySelector("#consent-status");
const shareConfirmModal = document.querySelector("#share-confirm-modal");
const shareConfirmCheck = document.querySelector("#share-confirm-check");
const shareTargetLabelInput = document.querySelector("#share-target-label");
const shareConfirmSubmitBtn = document.querySelector("#share-confirm-submit-btn");
const shareConfirmCancelBtn = document.querySelector("#share-confirm-cancel-btn");
const shareConfirmStatus = document.querySelector("#share-confirm-status");
const userScopeStatus = document.querySelector("#user-scope-status");

const speechSynthesisSupported = "speechSynthesis" in window;
const settingsKey = "health_journal_ui_settings_v1";
const userIdStorageKey = "health_journal_user_id_v1";
const userIdBackupStorageKey = "health_journal_user_id_backup_v1";
const userIdCookieName = "health_journal_user_id";
const doctorFollowupStoragePrefix = "health_doctor_followup_v1";
const maxImageBytes = 3 * 1024 * 1024;
const supportedImageMimeTypes = new Set(["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"]);
let recognition = null;
let isListening = false;
let voiceEngine = "none";
let recorder = null;
let recorderStream = null;
let recorderChunks = [];
let voiceStatusConfigChecked = false;
let voiceTranscribeEnabled = false;
let selectedImageDataUrl = "";
let selectedImageName = "";
let editingLogId = "";
let editingSourceDate = "";
let reviewedLogItem = null;
let imageClearRequested = false;
let userLocation = null;
let consentGranted = false;
let consentStateChecked = false;
let consentVersionRequired = "consent_v1";
let consentFetchSeq = 0;
let consultChatSeq = 0;
let consultChatHistory = [];
let consultChatDraftSignature = "";
let latestConsultChatResult = null;
let latestDoctorNotes = [];
let patientAuthState = { authenticated: false, patient: null };

const sliderMeta = {
  symptom_score: {
    goodHigh: false,
    states: [
      { max: 2, emoji: "😊", label: "ラク" },
      { max: 4, emoji: "🙂", label: "やや平気" },
      { max: 6, emoji: "😐", label: "ふつう" },
      { max: 8, emoji: "😣", label: "つらい" },
      { max: 10, emoji: "🤒", label: "かなりつらい" }
    ]
  },
  mood_score: {
    goodHigh: true,
    states: [
      { max: 2, emoji: "😣", label: "かなり低い" },
      { max: 4, emoji: "😕", label: "低め" },
      { max: 6, emoji: "🙂", label: "ふつう" },
      { max: 8, emoji: "😊", label: "良い" },
      { max: 10, emoji: "😄", label: "かなり良い" }
    ]
  },
  sleep_quality_score: {
    goodHigh: true,
    states: [
      { max: 2, emoji: "🥱", label: "眠れてない" },
      { max: 4, emoji: "😪", label: "浅い" },
      { max: 6, emoji: "🙂", label: "ふつう" },
      { max: 8, emoji: "😌", label: "良い" },
      { max: 10, emoji: "😴", label: "ぐっすり" }
    ]
  }
};

function getSpeechRecognitionCtor() {
  return (
    window.SpeechRecognition ||
    window.webkitSpeechRecognition ||
    globalThis.SpeechRecognition ||
    globalThis.webkitSpeechRecognition ||
    null
  );
}

function isLocalhostHostName(hostname) {
  return hostname === "localhost" || hostname === "127.0.0.1";
}

function show(data) {
  if (output) output.textContent = JSON.stringify(data, null, 2);
  aiMessage.textContent = humanize(data);
  if (autoSpeak.checked) {
    speakText(aiMessage.textContent);
  }
}

function reportError(context, error, statusEl = null) {
  const message = extractErrorMessage(error);
  if (statusEl) statusEl.textContent = `${context}: ${message}`;
  show({ error: `${context}: ${message}` });
  showToast(`${context}: ${message}`, 2600);
  const rawCode = getRawErrorCode(error);
  if (rawCode === "consent_required" || rawCode === "consent_not_found") {
    consentGranted = false;
    consentStateChecked = true;
    syncConsentUiLock();
    setConsentModalVisible(true);
  }
}

function showToast(message, timeoutMs = 2000) {
  toast.textContent = message;
  toast.classList.remove("hidden");
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => {
    toast.classList.add("hidden");
  }, timeoutMs);
}

function setRecordEntryExpanded(expanded) {
  if (!recordEntryBody || !recordEntryToggleBtn || !recordEntryCard) return;
  const next = Boolean(expanded);
  recordEntryBody.classList.toggle("hidden", !next);
  recordEntryCard.classList.toggle("collapsed", !next);
  recordEntryToggleBtn.setAttribute("aria-expanded", String(next));
  recordEntryToggleBtn.textContent = next ? "詳しい記録を閉じる" : "詳しく記録を開く";
}

function setConsultChatStatus(text) {
  if (consultChatStatus) {
    consultChatStatus.textContent = text;
  }
}

function setConsultChatExampleButtons(items) {
  const safeItems = Array.isArray(items) ? items.slice(0, consultChatExampleBtns.length) : [];
  consultChatExampleBtns.forEach((btn, idx) => {
    const item = safeItems[idx];
    if (!item) return;
    btn.textContent = item.label;
    btn.dataset.chatExample = item.prompt;
  });
}

function buildConsultChatExamples() {
  const context = getConsultChatContext();
  const symptoms = context.symptoms;
  const symptomLabel = symptoms.length ? symptoms.slice(0, 2).join("と") : "体調";

  if (context.symptom_score >= 7) {
    return [
      {
        label: `${symptomLabel}がつらいです`,
        prompt: `${symptomLabel}がつらめです。今の状態だと何を優先して伝えるとよいですか？`
      },
      {
        label: "早めに受診した方がいい？",
        prompt: `つらさが強めです。早めに受診した方がよいか、確認するポイントを教えてください。`
      },
      {
        label: "どこの病院が合いそう？",
        prompt: `${symptomLabel}がある時、どの診療科や病院候補が合いそうですか？`
      }
    ];
  }

  if (context.mood_score <= 3) {
    return [
      {
        label: "気分がかなり低いです",
        prompt: "気分がかなり低いです。まず何を整理すると相談しやすいですか？"
      },
      {
        label: "心療内科に行く目安は？",
        prompt: "気分の落ち込みが続いています。心療内科などに相談する目安を教えてください。"
      },
      {
        label: "今日は何を減らせばいい？",
        prompt: "無理しすぎないために、今日は何を減らすとよさそうか整理してください。"
      }
    ];
  }

  if (context.sleep_hours <= 4 || context.sleep_quality_score <= 3) {
    return [
      {
        label: "あまり眠れていません",
        prompt: "あまり眠れていません。受診前に何を整理すると伝えやすいですか？"
      },
      {
        label: "睡眠の相談は何科？",
        prompt: "睡眠の不調が続く時は、何科に相談するとよいですか？"
      },
      {
        label: "今日気をつけることは？",
        prompt: "眠れていない日の過ごし方で、今日気をつけることを教えてください。"
      }
    ];
  }

  if (context.symptom_score <= 2 && context.mood_score >= 7 && context.sleep_quality_score >= 7) {
    return [
      {
        label: "今日は落ち着いています",
        prompt: "今日は比較的落ち着いています。この良い流れを続けるコツを教えてください。"
      },
      {
        label: "良い点を先生向けに整理したい",
        prompt: "最近よかった点を、先生向けに短く整理するとどうなりますか？"
      },
      {
        label: "今の状態を維持したい",
        prompt: "今の状態を維持するために、意識するとよいことを教えてください。"
      }
    ];
  }

  if (!symptoms.length && context.summary === "まだありません") {
    return [
      {
        label: "何から話せばいい？",
        prompt: "体調相談を始めたいです。最初に何から話せば整理しやすいですか？"
      },
      {
        label: "まず伝える項目は？",
        prompt: "受診前に、まず伝えるとよい項目を教えてください。"
      },
      {
        label: "体調相談を始めたいです",
        prompt: "体調相談を始めたいです。今の状態をどう整理するとよいですか？"
      }
    ];
  }

  return [
    {
      label: `${symptomLabel}について整理したい`,
      prompt: `${symptomLabel}について相談したいです。受診前に整理するとよいことを教えてください。`
    },
    {
      label: "どんな記録が役立つ？",
      prompt: "今の体調では、どんな記録を残しておくと次の相談に役立ちますか？"
    },
    {
      label: "病院に行く目安は？",
      prompt: "今の症状で病院に行く目安や、相談先の考え方を教えてください。"
    }
  ];
}

function scrollConsultChatToBottom() {
  if (!consultChatMessages) return;
  consultChatMessages.scrollTop = consultChatMessages.scrollHeight;
}

function renderConsultChatMessages() {
  if (!consultChatMessages) return;
  consultChatMessages.innerHTML = "";
  for (const item of consultChatHistory) {
    const wrap = document.createElement("article");
    wrap.className = `consult-chat-message is-${item.role}${item.pending ? " is-pending" : ""}`;

    const meta = document.createElement("p");
    meta.className = "consult-chat-meta";
    meta.textContent = item.role === "user" ? "あなた" : "AIサポート";

    const bubble = document.createElement("p");
    bubble.className = "consult-chat-bubble";
    bubble.textContent = item.pending ? "考え中..." : item.text;

    wrap.append(meta, bubble);
    consultChatMessages.append(wrap);
  }
  scrollConsultChatToBottom();
}

function appendConsultChatMessage(role, text, options = {}) {
  consultChatSeq += 1;
  consultChatHistory.push({
    id: consultChatSeq,
    role,
    text: String(text || ""),
    pending: Boolean(options.pending)
  });
  renderConsultChatMessages();
  return consultChatSeq;
}

function updateConsultChatMessage(messageId, patch = {}) {
  const item = consultChatHistory.find((entry) => entry.id === messageId);
  if (!item) return;
  if (Object.prototype.hasOwnProperty.call(patch, "text")) {
    item.text = String(patch.text || "");
  }
  if (Object.prototype.hasOwnProperty.call(patch, "pending")) {
    item.pending = Boolean(patch.pending);
  }
  renderConsultChatMessages();
}

function setConsultChatBusy(busy) {
  if (consultChatInput) consultChatInput.disabled = busy;
  if (consultChatSendBtn) consultChatSendBtn.disabled = busy;
  if (consultChatShareBtn) consultChatShareBtn.disabled = busy;
  if (consultChatMatchBtn) consultChatMatchBtn.disabled = busy;
  for (const btn of consultChatExampleBtns) {
    btn.disabled = busy;
  }
}

function getConsultChatContext() {
  const symptoms = String(getSymptomsInput()?.value || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const note = String(form.querySelector("[name=note]")?.value || "").trim();
  return {
    recorded_date: getRecordedDate(),
    symptoms,
    symptom_score: normalizeScore(form.querySelector("[name=symptom_score]")?.value, 0),
    mood_score: normalizeScore(form.querySelector("[name=mood_score]")?.value, 0),
    sleep_hours: normalizeSleepHours(form.querySelector("[name=sleep_hours]")?.value, 0),
    sleep_quality_score: normalizeScore(form.querySelector("[name=sleep_quality_score]")?.value, 0),
    summary: String(summaryView?.textContent || "").trim(),
    trend: String(trendView?.textContent || "").trim(),
    next_step: String(nextStepView?.textContent || "").trim(),
    note: note.slice(0, 220)
  };
}

function buildConsultChatFallbackReply(message) {
  const text = String(message || "").trim();
  const context = getConsultChatContext();
  const lines = ["いまの情報をもとに、体調の整理を一緒に進めます。"];

  if (context.symptoms.length) {
    lines.push(`記録中の症状は ${context.symptoms.join("・")} です。`);
  } else {
    lines.push("まだ症状欄が空なら、いちばん気になる症状を1つだけ書くところから始めると整理しやすいです。");
  }

  if (context.symptom_score >= 8 || /息苦|胸|激しい|強い痛み|意識|救急|出血/.test(text)) {
    lines.push("強い痛み、息苦しさ、意識の変化などがある場合は、このチャットで様子見せず医療機関へ相談してください。");
  } else if (/受診|病院|何科|相談先/.test(text)) {
    lines.push("受診前には「いつから」「どのくらい続くか」「悪化するきっかけ」「服薬状況」をメモしておくと伝わりやすいです。");
  } else if (/眠れ|睡眠|夜中/.test(text)) {
    lines.push("睡眠の相談では、寝つきにくさ、中途覚醒、起床時のだるさがあるかを分けて書くと次の一歩が見えやすくなります。");
  } else if (/不安|心配|気分|しんど/.test(text) || context.mood_score <= 3) {
    lines.push("不安や気分の落ち込みがあるときは、いつ強くなるか、日常生活で困っていることは何かを一緒に書くと整理しやすいです。");
  } else {
    lines.push("症状の強さ、続いている日数、睡眠や食事の変化があれば、次の判断材料として十分役立ちます。");
  }

  if (context.summary && context.summary !== "まだありません") {
    lines.push(`今の記録では「${context.summary}」という要約が出ています。`);
  }

  if (context.note) {
    lines.push("必要なら、今のメモにある内容もそのまま送って大丈夫です。");
  }

  lines.push("この返答は診断確定ではありません。心配が強いときは受診や医療相談を優先してください。");
  return lines.join(" ");
}

function buildConsultChatFallbackDraft(message) {
  const text = String(message || "").trim();
  const lowered = text.replace(/\s+/g, "");
  const symptoms = [];

  for (const chip of symptomChips) {
    const token = String(chip.getAttribute("data-symptom") || "").trim();
    if (token && text.includes(token)) symptoms.push(token);
  }

  const sleepHoursMatch = lowered.match(/(\d+(?:\.\d+)?)時間(?=(?:半)?(?:しか)?(?:眠れ|寝|睡眠|休))/);
  const sleepHours = sleepHoursMatch ? normalizeSleepHours(sleepHoursMatch[1], 0) : null;

  let symptomScore = null;
  if (/救急|息苦|激しい|強い痛み|かなりつらい|動けない/.test(text)) symptomScore = 8;
  else if (/つらい|しんどい|だるい|痛い/.test(text)) symptomScore = 6;
  else if (/落ち着いている|平気|元気|ラク/.test(text)) symptomScore = 2;

  let moodScore = null;
  if (/かなり落ち込|消えたい|不安が強い|気分がかなり低い/.test(text)) moodScore = 2;
  else if (/落ち込|不安|気分が低い/.test(text)) moodScore = 3;
  else if (/落ち着いている|元気|気分が良い|調子が良い/.test(text)) moodScore = 8;

  let sleepQualityScore = null;
  if (/眠れない|寝つけない|何度も起き|中途覚醒|眠りが浅い/.test(text)) sleepQualityScore = 3;
  else if (/ぐっすり|しっかり眠れた|よく眠れた/.test(text)) sleepQualityScore = 8;
  else if (sleepHours !== null) sleepQualityScore = sleepHours <= 4 ? 3 : sleepHours >= 7 ? 7 : null;

  return {
    symptoms,
    symptom_score: symptomScore,
    mood_score: moodScore,
    sleep_hours: sleepHours,
    sleep_quality_score: sleepQualityScore,
    note_draft: `チャット相談メモ: ${text}`,
    should_open_detail: Boolean(symptoms.length || symptomScore !== null || moodScore !== null || sleepHours !== null || sleepQualityScore !== null)
  };
}

function buildConsultChatShareText() {
  const result = latestConsultChatResult;
  const summary = result?.structuredSummary || {};
  const department = result?.suggestedDepartment || "";
  const urgencyLevel = result?.urgencyLevel || "";
  const symptoms = Array.isArray(summary?.symptom_candidates) && summary.symptom_candidates.length
    ? summary.symptom_candidates.join("・")
    : formatSymptomsDisplay(
        String(getSymptomsInput()?.value || "")
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
      );
  const concern = String(summary?.chief_concern || consultChatHistory.filter((item) => item.role === "user").slice(-1)[0]?.text || "").trim() || "-";
  const doctorShare = String(summary?.doctor_share_summary || "").trim();

  return [
    "【体調相談チャット共有メモ】",
    `ユーザーID: ${getUserId()}`,
    `記録日: ${getRecordedDate()}`,
    `相談内容: ${concern}`,
    `症状候補: ${symptoms || "症状なし"}`,
    `相談先候補: ${department || "未整理"}`,
    `緊急度目安: ${urgencyLevel || "low"}`,
    doctorShare ? `先生向け要点: ${doctorShare}` : null
  ]
    .filter(Boolean)
    .join("\n");
}

async function copyTextToClipboard(text, statusEl = null) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    if (statusEl) statusEl.textContent = "コピーしました";
    return;
  }
  const area = document.createElement("textarea");
  area.value = text;
  document.body.append(area);
  area.select();
  document.execCommand("copy");
  area.remove();
  if (statusEl) statusEl.textContent = "コピーしました";
}

async function copyConsultChatShareText() {
  if (!latestConsultChatResult) {
    setConsultChatStatus("先にチャットで相談すると、この相談内容から共有メモを作れます。");
    showToast("先にチャットで相談してください");
    return false;
  }
  await copyTextToClipboard(buildConsultChatShareText(), copyStatus);
  return true;
}

async function showConsultChatMatches() {
  if (!latestConsultChatResult) {
    setConsultChatStatus("先にチャットで相談すると、この相談内容から相談先候補を出しやすくなります。");
    showToast("先にチャットで相談してください");
    return false;
  }
  const data = await loadMatch();
  renderReservationCandidates(data);
  setConsultChatStatus("チャット内容をもとに、相談先候補を下に表示しました。");
  return true;
}

function appendDraftNote(noteDraft) {
  const noteInput = form.querySelector("[name=note]");
  const next = String(noteDraft || "").trim();
  if (!noteInput || !next) return false;
  const current = String(noteInput.value || "").trim();
  if (current.includes(next)) return false;
  noteInput.value = current ? `${current}\n${next}` : next;
  setDraftNoteStatus("チャット相談からメモ下書きを反映しました");
  return true;
}

function applyConsultChatRecordDraft(draft) {
  if (!draft || typeof draft !== "object") return false;
  const normalizedDraft = {
    symptoms: Array.isArray(draft.symptoms) ? draft.symptoms.map((item) => String(item || "").trim()).filter(Boolean) : [],
    symptom_score: Number.isFinite(Number(draft.symptom_score)) ? normalizeScore(draft.symptom_score, 0) : null,
    mood_score: Number.isFinite(Number(draft.mood_score)) ? normalizeScore(draft.mood_score, 0) : null,
    sleep_hours: Number.isFinite(Number(draft.sleep_hours)) ? normalizeSleepHours(draft.sleep_hours, 0) : null,
    sleep_quality_score: Number.isFinite(Number(draft.sleep_quality_score)) ? normalizeScore(draft.sleep_quality_score, 0) : null,
    note_draft: String(draft.note_draft || "").trim(),
    should_open_detail: Boolean(draft.should_open_detail)
  };

  const signature = JSON.stringify(normalizedDraft);
  if (signature === consultChatDraftSignature) return false;
  consultChatDraftSignature = signature;

  let changed = false;
  for (const symptom of normalizedDraft.symptoms) {
    const before = String(getSymptomsInput()?.value || "");
    addSymptom(symptom);
    if (String(getSymptomsInput()?.value || "") !== before) changed = true;
  }

  const currentSymptomScore = normalizeScore(form.querySelector("[name=symptom_score]")?.value, 0);
  if (normalizedDraft.symptom_score !== null && currentSymptomScore === 0) {
    setRangeValue("symptom_score", normalizedDraft.symptom_score);
    changed = true;
  }

  const currentMoodScore = normalizeScore(form.querySelector("[name=mood_score]")?.value, 0);
  if (normalizedDraft.mood_score !== null && currentMoodScore === 0) {
    setRangeValue("mood_score", normalizedDraft.mood_score);
    changed = true;
  }

  const currentSleepHours = normalizeSleepHours(form.querySelector("[name=sleep_hours]")?.value, 0);
  if (normalizedDraft.sleep_hours !== null && currentSleepHours === 0) {
    setSleepHours(normalizedDraft.sleep_hours);
    changed = true;
  }

  const currentSleepQualityScore = normalizeScore(form.querySelector("[name=sleep_quality_score]")?.value, 0);
  if (normalizedDraft.sleep_quality_score !== null && currentSleepQualityScore === 0) {
    setRangeValue("sleep_quality_score", normalizedDraft.sleep_quality_score);
    changed = true;
  }

  if (appendDraftNote(normalizedDraft.note_draft)) changed = true;

  if (changed) {
    setConsultChatExampleButtons(buildConsultChatExamples());
    if (normalizedDraft.should_open_detail) setRecordEntryExpanded(true);
  }

  return changed;
}

async function requestConsultChatReply(message) {
  const payload = {
    user_id: getUserId(),
    text: String(message || "").trim(),
    history: consultChatHistory
      .filter((item) => !item.pending)
      .slice(-6)
      .map((item) => ({
        role: item.role,
        content: item.text
      })),
    context: getConsultChatContext()
  };

  try {
    const data = await api("/api/v1/chat/health", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const reply = [
      data?.reply,
      data?.message,
      data?.answer,
      data?.output_text,
      typeof data?.content === "string" ? data.content : ""
    ].find((item) => String(item || "").trim());
    if (reply) {
      return {
        reply: String(reply).trim(),
        mode: "api",
        suggestedDepartment: String(data?.suggested_department?.name || "").trim(),
        urgencyLevel: String(data?.urgency_hint?.level || "").trim(),
        recordDraft: data?.record_draft || data?.structured_summary?.record_draft || null,
        structuredSummary: data?.structured_summary || null,
        suggestedProviders: Array.isArray(data?.suggested_providers) ? data.suggested_providers : []
      };
    }
  } catch (error) {
    const status = Number(error?.status || 0);
    return {
      reply: buildConsultChatFallbackReply(message),
      mode: status === 404 ? "fallback_missing" : "fallback_error",
      recordDraft: buildConsultChatFallbackDraft(message),
      structuredSummary: null,
      suggestedProviders: []
    };
  }

  return {
    reply: buildConsultChatFallbackReply(message),
    mode: "fallback_empty",
    recordDraft: buildConsultChatFallbackDraft(message),
    structuredSummary: null,
    suggestedProviders: []
  };
}

async function submitConsultChatMessage(rawText) {
  const text = String(rawText || "").trim();
  if (!text) {
    setConsultChatStatus("相談内容を入力してください。");
    if (consultChatInput) consultChatInput.focus();
    return;
  }

  appendConsultChatMessage("user", text);
  if (consultChatInput) {
    consultChatInput.value = "";
    consultChatInput.style.height = "";
  }

  setConsultChatBusy(true);
  setConsultChatStatus("AIが相談内容を整理しています...");
  const pendingId = appendConsultChatMessage("assistant", "", { pending: true });

  try {
    const result = await requestConsultChatReply(text);
    latestConsultChatResult = result;
    updateConsultChatMessage(pendingId, { text: result.reply, pending: false });
    const draftApplied = applyConsultChatRecordDraft(result.recordDraft);
    if (result.mode === "api") {
      const details = [result.suggestedDepartment ? `相談先候補: ${result.suggestedDepartment}` : "", result.urgencyLevel ? `緊急度目安: ${result.urgencyLevel}` : ""]
        .filter(Boolean)
        .join(" / ");
      const message = details ? `AIが返答しました。${details}` : "AIが返答しました。続けて相談できます。";
      setConsultChatStatus(draftApplied ? `${message} 記録にも下書きを反映しました。` : message);
    } else {
      setConsultChatStatus(
        draftApplied
          ? "チャットAPI準備中のため、画面内の簡易返答で案内しています。記録にも下書きを反映しました。"
          : "チャットAPI準備中のため、画面内の簡易返答で案内しています。"
      );
    }
    if (draftApplied) showToast("チャット内容を記録の下書きに反映しました");
  } finally {
    setConsultChatBusy(false);
    if (consultChatInput) consultChatInput.focus();
  }
}

function initConsultChat() {
  if (!consultChatMessages) return;
  consultChatHistory = [];
  latestConsultChatResult = null;
  setConsultChatExampleButtons(buildConsultChatExamples());
  appendConsultChatMessage(
    "assistant",
    "体調の不安を短く相談できます。症状、いつからか、いちばん困っていることを1つずつ書いてください。強い症状がある場合は受診を優先してください。"
  );
  setConsultChatStatus("まずは相談例をタップするか、そのまま相談内容を入力してください。");
}

function switchPage(page) {
  const isMypage = page === "mypage";
  recordPage.classList.toggle("hidden", isMypage);
  mypagePage.classList.toggle("hidden", !isMypage);
  tabRecordBtn.classList.toggle("active", !isMypage);
  tabMypageBtn.classList.toggle("active", isMypage);
}

function humanize(data) {
  if (data?.saved?.status === "accepted") {
    return "記録を保存しました。必要なら「AI要約を更新」で最新表示にできます。";
  }
  if (data?.saved?.status === "updated") {
    return "記録を更新しました。必要なら「AI要約を更新」で最新表示にできます。";
  }
  if (data?.followup_summary?.simple_explanation) {
    return "診察後の説明を、患者向けのやさしい言葉で整理しました。";
  }
  if (data?.summary) return `今日のまとめ: ${data.summary}`;
  if (data?.step) return `次の一歩: ${data.step}`;
  if (data?.trend && Array.isArray(data.highlights)) return `傾向: ${data.trend}（${data.highlights.join(" / ")}）`;
  if (data?.risk_level) {
    return data.risk_level === "high"
      ? "緊急性の可能性があります。案内に従ってすぐ相談してください。"
      : "安全チェックを更新しました。";
  }
  if (data?.error) return `エラー: ${data.error}`;
  return "返答を更新しました。";
}

async function api(path, options = {}) {
  const res = await fetch(path, options);
  const text = await res.text();
  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch (_) {
    data = { message: text };
  }
  if (!res.ok) {
    const error = new Error(data.message || data.error || "request_failed");
    error.status = Number(res.status || 0);
    error.payload = data;
    throw error;
  }
  return data;
}

function setPatientAuthUi() {
  if (!patientAuthStatus) return;
  if (patientAuthState.authenticated && patientAuthState.patient) {
    const label = patientAuthState.patient.display_name || patientAuthState.patient.login_id || "ログイン中";
    patientAuthStatus.textContent = `ログイン中: ${label}`;
    if (patientDisplayNameInput && !patientDisplayNameInput.value) {
      patientDisplayNameInput.value = patientAuthState.patient.display_name || "";
    }
    if (patientLoginIdInput && !patientLoginIdInput.value) {
      patientLoginIdInput.value = patientAuthState.patient.login_id || "";
    }
    return;
  }
  patientAuthStatus.textContent = "未ログイン";
}

async function loadPatientAuthState() {
  const data = await api("/api/v1/patient/auth/me");
  patientAuthState = {
    authenticated: Boolean(data?.authenticated),
    patient: data?.patient || null
  };
  if (patientAuthState.authenticated && patientAuthState.patient?.user_id) {
    persistUserId(patientAuthState.patient.user_id);
    setActiveUserId(patientAuthState.patient.user_id);
  }
  setPatientAuthUi();
  return patientAuthState;
}

async function registerPatientAccount() {
  const data = await api("/api/v1/patient/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      display_name: String(patientDisplayNameInput?.value || "").trim(),
      login_id: String(patientLoginIdInput?.value || "").trim(),
      password: String(patientPasswordInput?.value || ""),
      user_id: getUserId()
    })
  });
  patientAuthState = {
    authenticated: true,
    patient: data?.patient || null
  };
  if (patientAuthState.patient?.user_id) {
    persistUserId(patientAuthState.patient.user_id);
    setActiveUserId(patientAuthState.patient.user_id);
  }
  setPatientAuthUi();
  await Promise.all([refreshOverview().catch(() => {}), loadProfile().catch(() => {}), refreshCalendar().catch(() => {})]);
  return data;
}

async function loginPatientAccount() {
  const data = await api("/api/v1/patient/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      login_id: String(patientLoginIdInput?.value || "").trim(),
      password: String(patientPasswordInput?.value || "")
    })
  });
  patientAuthState = {
    authenticated: true,
    patient: data?.patient || null
  };
  if (patientAuthState.patient?.user_id) {
    persistUserId(patientAuthState.patient.user_id);
    setActiveUserId(patientAuthState.patient.user_id);
  }
  setPatientAuthUi();
  await Promise.all([refreshOverview().catch(() => {}), loadProfile().catch(() => {}), refreshCalendar().catch(() => {})]);
  return data;
}

async function logoutPatientAccount() {
  await api("/api/v1/patient/auth/logout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({})
  });
  patientAuthState = { authenticated: false, patient: null };
  setPatientAuthUi();
}

async function submitFeedback() {
  const payload = {
    user_id: getUserId(),
    rating: Number(feedbackRating?.value || 3),
    category: String(feedbackCategory?.value || "general"),
    comment: String(feedbackComment?.value || "").trim()
  };
  const data = await api("/api/v1/feedback", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (feedbackComment) feedbackComment.value = "";
  if (feedbackStatus) feedbackStatus.textContent = "送信しました";
  return data;
}

async function ensureVoiceTranscribeStatus() {
  if (voiceStatusConfigChecked) return voiceTranscribeEnabled;
  try {
    const data = await api("/api/v1/system/status");
    voiceTranscribeEnabled = Boolean(data?.config?.voice_transcribe_enabled);
  } catch (_) {
    voiceTranscribeEnabled = false;
  } finally {
    voiceStatusConfigChecked = true;
  }
  return voiceTranscribeEnabled;
}

function getRawErrorCode(error) {
  if (error && typeof error === "object" && error.payload) {
    const payload = error.payload || {};
    return String(payload.error || payload.message || error.message || "");
  }
  const fallback = String(error?.message || error || "");
  try {
    const parsed = JSON.parse(fallback);
    return String(parsed.error || parsed.message || fallback);
  } catch (_) {
    return fallback;
  }
}

function localizeErrorMessage(raw, statusCode = 0) {
  const code = String(raw || "").trim();
  if (code.startsWith("missing field:")) {
    const field = code.replace("missing field:", "").trim();
    const fieldMap = {
      user_id: "ユーザーID",
      recorded_at: "記録日時",
      symptoms: "症状",
      symptom_score: "つらさゲージ",
      mood_score: "気分ゲージ",
      sleep_hours: "睡眠時間",
      sleep_start_time: "寝た時間",
      sleep_end_time: "起きた時間",
      sleep_quality_score: "睡眠の質ゲージ",
      medication_status: "服薬"
    };
    const label = fieldMap[field] || field;
    return `入力項目が不足しています: ${label}`;
  }
  const map = {
    invalid_image_data_url: "画像形式が不正です。JPEG / PNG / WebP / GIF を選択してください",
    image_too_large: "画像サイズが上限を超えています。3MB以下の画像を選択してください",
    payload_too_large: "送信データが大きすぎます。入力内容を減らして再度お試しください",
    share_link_not_found: "共有リンクが無効です。患者側で新しいリンクを発行してください",
    share_link_expired: "共有リンクの有効期限が切れています。患者側で新しいリンクを発行してください",
    share_link_revoked: "この共有リンクは失効済みです。患者側で新しいリンクを発行してください",
    share_token_invalid: "共有リンクが無効です。患者側で新しいリンクを発行してください",
    log_not_found: "編集対象の記録が見つかりません。日付から再読み込みしてください",
    share_link_inactive: "共有リンクは期限切れまたは失効済みです。患者側で新しいリンクを発行してください",
    doctor_auth_required: "医師ログインが必要です。ログイン後に再度お試しください",
    doctor_session_expired: "ログインの有効期限が切れました。再ログインしてください",
    doctor_auth_invalid_session: "認証情報が無効です。再ログインしてください",
    patient_auth_required: "患者ログインが必要です。ログイン後に再度お試しください",
    patient_session_expired: "ログインの有効期限が切れました。再ログインしてください",
    patient_auth_invalid_session: "認証情報が無効です。再ログインしてください",
    "missing token": "共有トークンが見つかりません。リンクを確認してください",
    missing_token: "共有トークンが見つかりません。リンクを確認してください",
    invalid_credentials: "ログイン情報またはパスワードが正しくありません",
    missing_login_id: "ログインIDを入力してください",
    missing_user_id: "利用者データが見つかりません。再読み込みしてください",
    weak_password: "パスワードは6文字以上で入力してください",
    login_id_taken: "そのログインIDはすでに使われています",
    user_id_already_linked: "このデータはすでに別のログインに紐づいています。ログインしてください",
    too_many_login_attempts: "操作回数が上限に達しました。しばらく待ってから再試行してください",
    "no logs found": "記録が見つかりません。先に患者側で記録を保存してください",
    invalid_chronic_conditions: "持病の入力が長すぎます。600文字以内で入力してください",
    clipboard_write_denied: "ブラウザのコピー権限がないため自動コピーできません。リンクを手動でコピーしてください",
    consent_required: "データ保存には利用同意が必要です。画面の同意案内を確認してください",
    consent_not_found: "利用同意が未登録です。画面の同意案内から同意してください"
  };
  if (map[code]) return map[code];

  if (statusCode === 401) return "認証が必要です。再ログインしてからもう一度お試しください";
  if (statusCode === 403) return "この操作を行う権限がありません。入力内容と権限設定を確認してください";
  if (statusCode === 404) return "対象データが見つかりません。最新状態を再読み込みしてから再試行してください";
  if (statusCode === 428) return "この操作には利用同意が必要です。同意後に再試行してください";
  if (statusCode === 410) return "対象データは期限切れまたは失効済みです。再作成してください";
  return code;
}

function extractErrorMessage(error) {
  const statusCode = Number(error?.status || 0);
  return localizeErrorMessage(getRawErrorCode(error), statusCode);
}

function normalizeRecordedAt(raw) {
  const value = String(raw || "").trim();
  if (value && !Number.isNaN(Date.parse(value))) return value;
  return new Date().toISOString();
}

function normalizeScore(value, fallback = 5) {
  const num = Number(value);
  if (!Number.isFinite(num)) return fallback;
  return Math.max(0, Math.min(10, num));
}

function normalizeSleepHours(value, fallback = 7) {
  const num = Number(value);
  if (!Number.isFinite(num)) return fallback;
  return Math.max(0, Math.min(24, num));
}

function isClockTime(value) {
  return /^([01]\d|2[0-3]):([0-5]\d)$/.test(String(value || ""));
}

function computeSleepHoursFromTimes(startTime, endTime) {
  if (!isClockTime(startTime) || !isClockTime(endTime)) return null;
  const [startHour, startMinute] = String(startTime).split(":").map(Number);
  const [endHour, endMinute] = String(endTime).split(":").map(Number);
  let startTotal = startHour * 60 + startMinute;
  let endTotal = endHour * 60 + endMinute;
  if (endTotal < startTotal) endTotal += 24 * 60;
  const hours = (endTotal - startTotal) / 60;
  return Math.max(0, Math.min(24, Math.round(hours * 2) / 2));
}

function formatSymptomsDisplay(symptoms) {
  if (!Array.isArray(symptoms) || !symptoms.length) return "症状なし";
  return symptoms.join("・");
}

function describeScore(inputName, value) {
  const meta = sliderMeta[inputName];
  if (!meta) return `${value}`;
  const state = meta.states.find((item) => value <= item.max) || meta.states[meta.states.length - 1];
  return state.label;
}

function buildDraftNoteText() {
  const symptomsInput = getSymptomsInput();
  const medicationInput = form.querySelector("[name=medication_status]");
  const symptomScore = normalizeScore(form.querySelector("[name=symptom_score]")?.value, 0);
  const moodScore = normalizeScore(form.querySelector("[name=mood_score]")?.value, 0);
  const sleepQualityScore = normalizeScore(form.querySelector("[name=sleep_quality_score]")?.value, 0);
  const sleepHours = normalizeSleepHours(form.querySelector("[name=sleep_hours]")?.value, 0);
  const symptoms = String(symptomsInput?.value || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const medication = String(medicationInput?.value || "unknown");
  const opening = (() => {
    if (symptoms.length && symptomScore >= 7) {
      return `今日は${symptoms.join("と")}がけっこう気になりました。`;
    }
    if (symptoms.length) {
      return `今日は${symptoms.join("と")}が少し気になりました。`;
    }
    if (symptomScore <= 2 && moodScore >= 7) {
      return "今日は全体的にわりと落ち着いて過ごせました。";
    }
    return "今日は大きな症状はないけれど、体調の様子を記録しておきます。";
  })();

  const symptomSentence =
    symptomScore >= 8
      ? `しんどさは${symptomScore}/10くらいで、かなりつらめでした。`
      : symptomScore >= 5
        ? `しんどさは${symptomScore}/10くらいで、少し無理はしない方がよさそうでした。`
        : `しんどさは${symptomScore}/10くらいで、比較的落ち着いていました。`;

  const moodSentence =
    moodScore >= 8
      ? `気分は${moodScore}/10で、わりと前向きに過ごせました。`
      : moodScore >= 5
        ? `気分は${moodScore}/10で、ぼちぼちという感じでした。`
        : `気分は${moodScore}/10で、少し低めでした。`;

  const sleepSentence =
    sleepQualityScore >= 8
      ? `睡眠は${sleepHours}時間くらいで、わりとしっかり休めた感じです。`
      : sleepQualityScore >= 5
        ? `睡眠は${sleepHours}時間くらいで、いつも通りか少し浅めでした。`
        : `睡眠は${sleepHours}時間くらいで、あまり休めた感じはありませんでした。`;

  const medicationSentence =
    medication === "taken"
      ? "服薬はできました。"
      : medication === "missed"
        ? "服薬は少し抜けてしまいました。"
        : "服薬はありませんでした。";

  return [opening, symptomSentence, moodSentence, sleepSentence, medicationSentence].join(" ");
}

function isNotFoundError(error) {
  return Number(error?.status || 0) === 404 || getRawErrorCode(error) === "not found";
}

function getUserId() {
  return form.querySelector("[name=user_id]").value.trim();
}

function createLocalUserId() {
  if (globalThis.crypto?.randomUUID) {
    return `u_${crypto.randomUUID().replace(/-/g, "").slice(0, 12)}`;
  }
  const randomPart = Math.random().toString(36).slice(2, 10);
  return `u_${Date.now().toString(36)}${randomPart}`;
}

function readCookie(name) {
  const prefix = `${name}=`;
  return String(document.cookie || "")
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(prefix))
    ?.slice(prefix.length) || "";
}

function writeCookie(name, value) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${60 * 60 * 24 * 365 * 2}; samesite=lax`;
}

function persistUserId(userId) {
  const normalized = String(userId || "").trim();
  if (!normalized) return;
  try {
    localStorage.setItem(userIdStorageKey, normalized);
    localStorage.setItem(userIdBackupStorageKey, normalized);
  } catch (_) {
    // ignore
  }
  try {
    sessionStorage.setItem(userIdStorageKey, normalized);
  } catch (_) {
    // ignore
  }
  try {
    writeCookie(userIdCookieName, normalized);
  } catch (_) {
    // ignore
  }
}

function setActiveUserId(userId) {
  const normalized = String(userId || "").trim();
  const hidden = form.querySelector("[name=user_id]");
  if (hidden) hidden.value = normalized;
  if (userIdBackupInput) userIdBackupInput.value = normalized;
  if (userScopeStatus) {
    userScopeStatus.textContent = normalized
      ? `この端末の利用者ID: ${normalized}`
      : "この端末の利用者ID: 未設定";
  }
}

function ensureLocalUserId() {
  let userId = "";
  try {
    userId = String(localStorage.getItem(userIdStorageKey) || "").trim();
  } catch (_) {
    userId = "";
  }
  if (!userId) {
    try {
      userId = String(localStorage.getItem(userIdBackupStorageKey) || "").trim();
    } catch (_) {
      userId = "";
    }
  }
  if (!userId) {
    try {
      userId = String(sessionStorage.getItem(userIdStorageKey) || "").trim();
    } catch (_) {
      userId = "";
    }
  }
  if (!userId) {
    try {
      userId = decodeURIComponent(readCookie(userIdCookieName) || "").trim();
    } catch (_) {
      userId = "";
    }
  }
  if (!userId) {
    userId = createLocalUserId();
  }
  persistUserId(userId);
  setActiveUserId(userId);
  return userId;
}

function setUserIdBackupStatus(text = "未操作") {
  if (userIdBackupStatus) userIdBackupStatus.textContent = text;
}

async function restoreUserIdFromInput() {
  const nextUserId = String(userIdBackupInput?.value || "").trim();
  if (!nextUserId) {
    setUserIdBackupStatus("利用者IDを入力または貼り付けしてください");
    showToast("利用者IDを入れてください");
    return false;
  }
  persistUserId(nextUserId);
  setActiveUserId(nextUserId);
  clearEditMode({ keepForm: false });
  initDatetimeDefault();
  await Promise.all([
    refreshOverview().catch(() => {}),
    loadProfile().catch(() => {}),
    refreshCalendar().catch(() => {})
  ]);
  setUserIdBackupStatus("この利用者IDで復元しました");
  return true;
}

function getRecordedDate() {
  const input = form.querySelector("[name=recorded_at]");
  if (!input || !input.value) return todayDateString();
  return String(input.value).slice(0, 10);
}

function getSymptomsInput() {
  return form.querySelector("[name=symptoms]");
}

function setSafeText(el, text) {
  el.textContent = text;
}

function setConsentModalVisible(visible) {
  if (!consentModal) return;
  consentModal.classList.toggle("hidden", !visible);
}

function setShareConfirmVisible(visible) {
  if (!shareConfirmModal) return;
  shareConfirmModal.classList.toggle("hidden", !visible);
  if (!visible) {
    if (shareConfirmCheck) shareConfirmCheck.checked = false;
    if (shareTargetLabelInput) shareTargetLabelInput.value = "";
    if (shareConfirmStatus) shareConfirmStatus.textContent = "未確認";
  }
}

function syncConsentUiLock() {
  const locked = !consentGranted;
  if (submitBtn) submitBtn.disabled = locked;
  if (saveProfileBtn) saveProfileBtn.disabled = locked;
  if (createShareLinkBtn) createShareLinkBtn.disabled = locked;
  if (consentStatus) {
    consentStatus.textContent = locked
      ? "未同意です。記録保存には同意が必要です。"
      : `同意済み（${consentVersionRequired}）`;
  }
}

function applyConsentPayload(data) {
  const requiredVersion = String(data?.required?.consent_version || "").trim();
  if (requiredVersion) consentVersionRequired = requiredVersion;
  consentGranted = Boolean(data?.accepted);
  consentStateChecked = true;
  syncConsentUiLock();
  setConsentModalVisible(!consentGranted);
}

async function loadLatestConsent() {
  const seq = ++consentFetchSeq;
  const userId = getUserId();
  try {
    const data = await api(`/api/v1/consent/latest?user_id=${encodeURIComponent(userId)}`);
    if (seq !== consentFetchSeq) return data;
    applyConsentPayload(data);
    return data;
  } catch (error) {
    const code = getRawErrorCode(error);
    const requiredVersion = String(error?.payload?.required?.consent_version || "").trim();
    if (requiredVersion) consentVersionRequired = requiredVersion;
    if (seq !== consentFetchSeq) return null;
    if (Number(error?.status || 0) === 404 || code === "consent_not_found") {
      consentGranted = false;
      consentStateChecked = true;
      syncConsentUiLock();
      setConsentModalVisible(true);
      return null;
    }
    throw error;
  }
}

async function saveConsentAgreement() {
  const userId = getUserId();
  const doPost = async (version) =>
    api("/api/v1/consent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        agreed: true,
        consent_version: version,
        policy_version: version,
        scopes: ["daily_log", "profile", "doctor_share", "safety_check", "voice_transcribe"],
        source: "web_modal"
      })
    });

  let data = await doPost(consentVersionRequired);
  const requiredVersion = String(data?.required?.consent_version || "").trim();
  if (!data?.accepted && requiredVersion && requiredVersion !== consentVersionRequired) {
    consentVersionRequired = requiredVersion;
    data = await doPost(consentVersionRequired);
  }
  consentFetchSeq += 1;
  applyConsentPayload(data);
  return data;
}

async function ensureConsentForWrite(actionText = "保存") {
  if (!consentStateChecked) {
    try {
      await loadLatestConsent();
    } catch (error) {
      reportError("同意状態確認エラー", error, consentStatus || null);
      return false;
    }
  }
  if (consentGranted) return true;
  setConsentModalVisible(true);
  if (consentStatus) {
    consentStatus.textContent = `${actionText}には利用同意が必要です。`;
  }
  showToast("利用同意が必要です");
  return false;
}

function formatLocalDateKey(dateObj) {
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, "0");
  const d = String(dateObj.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function recordedAtDateKey(value) {
  const raw = String(value || "");
  const parsed = new Date(raw);
  if (!Number.isNaN(parsed.getTime())) {
    return formatLocalDateKey(parsed);
  }
  return raw.slice(0, 10);
}

function updateVoiceRouteText() {
  if (!voiceRoute) return;
  if (voiceMode.value === "command") {
    voiceRoute.textContent = "入力先: コマンド解釈（未解釈なら ひとことメモ に追記）";
    return;
  }
  voiceRoute.textContent = "追記先: 今日の記録 ＞ ひとことメモ";
}

function appendVoiceToDailyNote(text) {
  const note = form.querySelector("textarea[name=note]");
  if (!note) return false;
  const clean = String(text || "").trim();
  if (!clean) return false;
  note.value = note.value.trim() ? `${note.value} / ${clean}` : clean;
  note.focus();
  note.scrollTop = note.scrollHeight;
  return true;
}

function applyDraftNote() {
  const note = form.querySelector("textarea[name=note]");
  if (!note) return false;
  const draft = buildDraftNoteText();
  const current = String(note.value || "").trim();
  if (!current) {
    note.value = draft;
    return true;
  }
  if (current.includes(draft)) return false;
  note.value = `${current}\n${draft}`;
  return true;
}

function setDraftNoteStatus(text = "未作成") {
  if (draftNoteStatus) draftNoteStatus.textContent = text;
}

function setSleepCalcStatus(text = "未計算") {
  if (sleepCalcStatus) sleepCalcStatus.textContent = text;
}

function applySleepTimeCalculation({ announce = false } = {}) {
  const start = String(sleepStartTimeInput?.value || "").trim();
  const end = String(sleepEndTimeInput?.value || "").trim();
  if (!start || !end) {
    setSleepCalcStatus("寝た時間と起きた時間を入れると計算できます");
    if (announce) showToast("寝た時間と起きた時間を両方入れてください");
    return false;
  }
  const hours = computeSleepHoursFromTimes(start, end);
  if (!Number.isFinite(hours)) {
    setSleepCalcStatus("時刻形式を確認してください");
    if (announce) showToast("時刻の形式を確認してください");
    return false;
  }
  setSleepHours(hours);
  setSleepCalcStatus(`自動計算: ${hours}時間`);
  if (announce) showToast(`睡眠時間を ${hours}時間 に更新しました`);
  return true;
}

function setVoiceLastText(text, prefix = "最新の音声") {
  if (!voiceLast) return;
  voiceLast.textContent = `${prefix}: ${text || "（空）"}`;
}

function setImageUiState({ dataUrl = "", name = "", status = "未添付" } = {}) {
  selectedImageDataUrl = dataUrl;
  selectedImageName = name;
  if (logImageStatus) logImageStatus.textContent = status;
  if (logImagePreview) {
    if (dataUrl) {
      logImagePreview.src = dataUrl;
      logImagePreview.classList.remove("hidden");
    } else {
      logImagePreview.removeAttribute("src");
      logImagePreview.classList.add("hidden");
    }
  }
}

function setEditingStatus(isEditing, text = "") {
  if (!editingStatus) return;
  editingStatus.classList.toggle("is-editing", Boolean(isEditing));
  if (isEditing) {
    setRecordEntryExpanded(true);
    editingStatus.textContent = text || `編集中: ${editingSourceDate || "-"} の記録`;
    return;
  }
  editingStatus.textContent = "新規記録モード";
}

function submitButtonLabel() {
  return editingLogId ? "この内容で更新する" : "この内容で記録する";
}

function enterEditMode(item, sourceDate = "") {
  if (!item || !item.log_id) return;
  editingLogId = String(item.log_id);
  editingSourceDate = sourceDate || recordedAtDateKey(item.recorded_at);
  reviewedLogItem = item;
  imageClearRequested = false;

  const recordedAtInput = form.querySelector("[name=recorded_at]");
  const symptomsInput = getSymptomsInput();
  const medicationInput = form.querySelector("[name=medication_status]");
  const noteInput = form.querySelector("[name=note]");

  if (recordedAtInput) recordedAtInput.value = item.recorded_at || recordedAtInput.value;
  if (symptomsInput) symptomsInput.value = Array.isArray(item.symptoms) ? item.symptoms.join(",") : "";
  if (medicationInput) medicationInput.value = item.medication_status || "unknown";
  if (noteInput) noteInput.value = item.note || "";
  if (sleepStartTimeInput) sleepStartTimeInput.value = item.sleep_start_time || "";
  if (sleepEndTimeInput) sleepEndTimeInput.value = item.sleep_end_time || "";

  setRangeValue("symptom_score", item.symptom_score ?? 5);
  setRangeValue("mood_score", item.mood_score ?? 5);
  setRangeValue("sleep_quality_score", item.sleep_quality_score ?? 5);
  setSleepHours(item.sleep_hours ?? 7);
  if (item.sleep_start_time && item.sleep_end_time) {
    setSleepCalcStatus(`計算済み: ${item.sleep_hours ?? 0}時間`);
  } else {
    setSleepCalcStatus();
  }

  for (const chip of symptomChips) {
    const token = chip.getAttribute("data-symptom");
    const active = Array.isArray(item.symptoms) && token ? item.symptoms.includes(token) : false;
    chip.classList.toggle("active", active);
  }

  selectedImageDataUrl = "";
  selectedImageName = "";
  if (item.image?.url) {
    if (logImagePreview) {
      logImagePreview.src = item.image.url;
      logImagePreview.classList.remove("hidden");
    }
    if (logImageStatus) {
      logImageStatus.textContent = `既存画像: ${item.image.file_name || "添付画像"}（変更しない場合はそのまま保持されます）`;
    }
  } else {
    setImageUiState({ dataUrl: "", name: "", status: "未添付" });
  }
  if (logImageInput) logImageInput.value = "";

  switchPage("record");
  setEditingStatus(true, `編集中: ${editingSourceDate} の記録`);
  if (submitBtn) submitBtn.textContent = submitButtonLabel();
  showToast("編集モードで読み込みました");
}

function clearEditMode({ keepForm = true } = {}) {
  editingLogId = "";
  editingSourceDate = "";
  reviewedLogItem = null;
  imageClearRequested = false;
  setEditingStatus(false);
  if (submitBtn) submitBtn.textContent = submitButtonLabel();
  if (!keepForm) {
    resetFormInputs();
    setDraftNoteStatus();
  }
}

async function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("image_read_failed"));
    reader.readAsDataURL(file);
  });
}

function stampSync() {
  const now = new Date();
  lastSync.textContent = `最終更新: ${now.toLocaleString("ja-JP")}`;
}

function saveSettings() {
  const payload = {
    voice_mode: voiceMode.value,
    auto_speak: autoSpeak.checked
  };
  localStorage.setItem(settingsKey, JSON.stringify(payload));
}

function loadSettings() {
  try {
    const raw = localStorage.getItem(settingsKey);
    if (!raw) return;
    const saved = JSON.parse(raw);
    if (saved.voice_mode === "note" || saved.voice_mode === "command") {
      voiceMode.value = saved.voice_mode;
    }
    autoSpeak.checked = Boolean(saved.auto_speak);
  } catch (_) {
    // ignore
  }
}

function getDoctorFollowupStorageKey() {
  return `${doctorFollowupStoragePrefix}:${getUserId() || "guest"}`;
}

function setDoctorFollowupStatus(text = "未整理") {
  if (doctorFollowupStatus) doctorFollowupStatus.textContent = text;
}

function renderFollowupList(el, items, emptyText) {
  if (!el) return;
  el.innerHTML = "";
  const safeItems = Array.isArray(items) ? items.filter(Boolean) : [];
  if (!safeItems.length) {
    const li = document.createElement("li");
    li.textContent = emptyText;
    el.append(li);
    return;
  }
  for (const item of safeItems) {
    const li = document.createElement("li");
    li.textContent = item;
    el.append(li);
  }
}

function renderDoctorFollowupResult(result) {
  if (!doctorFollowupOutput || !doctorFollowupSimple) return;
  if (!result) {
    doctorFollowupOutput.classList.add("hidden");
    doctorFollowupSimple.textContent = "まだありません";
    renderFollowupList(doctorFollowupActions, [], "まだありません");
    renderFollowupList(doctorFollowupWatch, [], "まだありません");
    renderFollowupList(doctorFollowupConsult, [], "まだありません");
    return;
  }

  doctorFollowupOutput.classList.remove("hidden");
  doctorFollowupSimple.textContent = result.simple_explanation || "まだありません";
  renderFollowupList(doctorFollowupActions, result.now_actions, "今すぐの行動は見つかりませんでした");
  renderFollowupList(doctorFollowupWatch, result.watch_points, "気になる変化があればメモしておきましょう");
  renderFollowupList(doctorFollowupConsult, result.consult_timing, "迷ったら受診先へ確認しましょう");
}

function saveDoctorFollowupState({ inputText = "", result = null } = {}) {
  try {
    localStorage.setItem(
      getDoctorFollowupStorageKey(),
      JSON.stringify({
        input_text: String(inputText || ""),
        result: result || null
      })
    );
  } catch (_) {
    // ignore
  }
}

function loadDoctorFollowupState() {
  if (!doctorFollowupInput) return null;
  try {
    const raw = localStorage.getItem(getDoctorFollowupStorageKey());
    if (!raw) {
      renderDoctorFollowupResult(null);
      setDoctorFollowupStatus("未整理");
      return null;
    }
    const saved = JSON.parse(raw);
    doctorFollowupInput.value = String(saved?.input_text || "");
    renderDoctorFollowupResult(saved?.result || null);
    setDoctorFollowupStatus(saved?.result ? "前回の整理結果を表示中" : doctorFollowupInput.value ? "下書きあり" : "未整理");
    return saved;
  } catch (_) {
    renderDoctorFollowupResult(null);
    setDoctorFollowupStatus("未整理");
    return null;
  }
}

function normalizeDoctorFollowupText(text) {
  return String(text || "")
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{2,}/g, "\n")
    .trim();
}

function splitJapaneseSentences(text) {
  return normalizeDoctorFollowupText(text)
    .split(/[\n。！？]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function simplifyMedicalLanguage(text) {
  const replacements = [
    [/頓服/g, "つらい時だけ使う薬"],
    [/経過観察/g, "今すぐ大きな処置はせず、様子を見ること"],
    [/再診/g, "もう一度相談すること"],
    [/服薬継続/g, "薬を続けること"],
    [/安静/g, "無理をせず休むこと"],
    [/水分摂取/g, "こまめに水分をとること"],
    [/炎症/g, "体の中の刺激やはれ"],
    [/鎮痛剤/g, "痛みをやわらげる薬"],
    [/解熱剤/g, "熱を下げる薬"],
    [/症状増悪/g, "症状が強くなること"],
    [/疼痛/g, "痛み"],
    [/呼吸苦/g, "息苦しさ"],
    [/食思不振/g, "食欲が出ないこと"],
    [/発熱/g, "熱が出ること"]
  ];

  let outputText = String(text || "");
  for (const [pattern, replacement] of replacements) {
    outputText = outputText.replace(pattern, replacement);
  }
  return outputText;
}

function uniqueTexts(items) {
  return Array.from(new Set((items || []).map((item) => String(item || "").trim()).filter(Boolean)));
}

function pickSentencesByKeywords(sentences, keywords, limit = 3) {
  return uniqueTexts(
    sentences.filter((sentence) => keywords.some((keyword) => sentence.includes(keyword)))
  ).slice(0, limit);
}

function buildSimpleExplanation(sentences) {
  if (!sentences.length) {
    return "先生の説明を、やさしい言葉に整理できませんでした。";
  }
  const core = sentences.slice(0, 2).join("。");
  return `先生の話をやさしく言うと、${core}。`;
}

function buildActionFallback(text) {
  if (text.includes("薬")) return "薬の使い方は、先生に言われた通りに続けます。";
  if (text.includes("水分")) return "水分を少しずつでもこまめにとります。";
  if (text.includes("休")) return "今日は無理をしすぎず、休める時間を確保します。";
  return "まずは今日やることを1つずつ確認し、無理のない範囲で続けます。";
}

function buildWatchFallback(text) {
  if (text.includes("熱")) return "熱の上がり方と、しんどさの強まり方を見ます。";
  if (text.includes("痛")) return "痛みの強さや広がり方を見ます。";
  if (text.includes("咳") || text.includes("息")) return "息苦しさや咳の変化を見ます。";
  return "症状の強さ、食事や水分の取りやすさ、眠りやすさを見ます。";
}

function buildConsultFallback(text) {
  if (text.includes("再") || text.includes("相談")) return "よくならない時や不安が強い時は、次の相談先へ連絡します。";
  return "症状が強くなる、長引く、説明と違う感じがする時は受診先へ相談します。";
}

function buildDoctorFollowupSummary(text) {
  const normalized = normalizeDoctorFollowupText(text);
  const simplifiedSentences = splitJapaneseSentences(simplifyMedicalLanguage(normalized));
  const actionKeywords = ["飲", "薬", "使", "休", "安静", "水分", "睡眠", "記録", "続け", "控え", "塗", "貼"];
  const watchKeywords = ["熱", "痛", "息", "苦", "咳", "腫", "むくみ", "しびれ", "ふらつ", "吐", "食べ", "眠れ"];
  const consultKeywords = ["相談", "受診", "再", "連絡", "救急", "すぐ", "早め", "悪化", "続く", "1週間", "数日"];

  const nowActions = pickSentencesByKeywords(simplifiedSentences, actionKeywords, 3);
  const watchPoints = pickSentencesByKeywords(simplifiedSentences, watchKeywords, 3);
  const consultTiming = pickSentencesByKeywords(simplifiedSentences, consultKeywords, 3);

  if (!nowActions.length) nowActions.push(buildActionFallback(simplifyMedicalLanguage(normalized)));
  if (!watchPoints.length) watchPoints.push(buildWatchFallback(simplifyMedicalLanguage(normalized)));
  if (!consultTiming.length) consultTiming.push(buildConsultFallback(simplifyMedicalLanguage(normalized)));

  return {
    input_text: normalized,
    simple_explanation: buildSimpleExplanation(simplifiedSentences),
    now_actions: uniqueTexts(nowActions),
    watch_points: uniqueTexts(watchPoints),
    consult_timing: uniqueTexts(consultTiming),
    generated_at: new Date().toISOString(),
    disclaimer: "診断ではなく、先生の説明を理解しやすくするための整理文です。"
  };
}

function fillDoctorFollowupInput(text, statusText = "入力しました") {
  if (!doctorFollowupInput) return;
  doctorFollowupInput.value = String(text || "").trim();
  renderDoctorFollowupResult(null);
  setDoctorFollowupStatus(statusText);
  saveDoctorFollowupState({ inputText: doctorFollowupInput.value, result: null });
}

function doctorFollowupSampleText() {
  return "炎症がまだあるので、まずは1週間は薬を続けて、水分をしっかり取ってください。痛みが強い時は頓服を使って大丈夫です。熱が上がる、食べられない、息苦しい時は早めに相談してください。1週間くらいで良くならなければ再診しましょう。";
}

function toNumberOrNull(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function updateProfileDerived(profile) {
  const required = ["display_name", "height_cm", "weight_kg", "birth_date", "sex"];
  let filled = 0;
  for (const key of required) {
    const value = profile[key];
    if (value !== null && value !== undefined && String(value).trim() !== "") filled += 1;
  }
  const percent = Math.round((filled / required.length) * 100);
  profileCompletion.textContent = `入力充足率: ${percent}%`;

  const h = toNumberOrNull(profile.height_cm);
  const w = toNumberOrNull(profile.weight_kg);
  if (h && w && h > 0) {
    const bmi = w / (h / 100) ** 2;
    bmiView.textContent = `BMI: ${bmi.toFixed(1)}`;
  } else {
    bmiView.textContent = "BMI: -";
  }
}

function isProfileEmpty(profile) {
  const keys = ["display_name", "height_cm", "weight_kg", "birth_date", "sex", "chronic_conditions", "note"];
  return keys.every((key) => {
    const value = profile?.[key];
    if (value === null || value === undefined) return true;
    if (typeof value === "string") return !value.trim();
    return false;
  });
}

function clearProfileFormInputs() {
  profileForm.querySelector("[name=display_name]").value = "";
  profileForm.querySelector("[name=height_cm]").value = "";
  profileForm.querySelector("[name=weight_kg]").value = "";
  profileForm.querySelector("[name=birth_date]").value = "";
  profileForm.querySelector("[name=sex]").value = "";
  profileForm.querySelector("[name=chronic_conditions]").value = "";
  profileForm.querySelector("[name=note]").value = "";
}

function getProfileSummaryText() {
  const name = profileForm.querySelector("[name=display_name]").value || "-";
  const height = profileForm.querySelector("[name=height_cm]").value || "-";
  const weight = profileForm.querySelector("[name=weight_kg]").value || "-";
  const chronic = profileForm.querySelector("[name=chronic_conditions]").value?.trim() || "-";
  const bmi = bmiView.textContent?.replace("BMI: ", "") || "-";
  return `表示名: ${name} / 身長: ${height}cm / 体重: ${weight}kg / BMI: ${bmi} / 持病: ${chronic}`;
}

function drawTrendChart(items) {
  const canvas = trendChart;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    chartStatus.textContent = "グラフを描画できません（canvas未対応）。";
    return false;
  }

  const dpr = window.devicePixelRatio || 1;
  const cssWidth = canvas.clientWidth || 640;
  const cssHeight = canvas.clientHeight || 220;
  if (cssWidth < 40 || cssHeight < 40) {
    chartStatus.textContent = "グラフ表示領域が確保できていません。ページ表示後に再試行します。";
    return false;
  }
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
    ctx.fillText("まだグラフ表示用の記録がありません", 14, cssHeight / 2);
    return true;
  }

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

  const xFor = (idx) => pad.left + (items.length === 1 ? w / 2 : (idx / (items.length - 1)) * w);
  const yFor = (value) => pad.top + h - (Math.max(0, Math.min(10, Number(value) || 0)) / 10) * h;

  ctx.strokeStyle = "#decdb9";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(pad.left, pad.top + h);
  ctx.lineTo(pad.left + w, pad.top + h);
  ctx.stroke();

  function drawPointMarker(x, y, shape, color) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.strokeStyle = "#fffdf9";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    if (shape === "square") {
      ctx.rect(x - 4, y - 4, 8, 8);
    } else if (shape === "triangle") {
      ctx.moveTo(x, y - 5);
      ctx.lineTo(x + 5, y + 4);
      ctx.lineTo(x - 5, y + 4);
      ctx.closePath();
    } else {
      ctx.arc(x, y, 4, 0, Math.PI * 2);
    }
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  function drawSeries(key, color, shape) {
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
    items.forEach((item, i) => {
      const x = xFor(i);
      const y = yFor(item[key]);
      drawPointMarker(x, y, shape, color);
    });
  }

  drawSeries("symptom_score", "#d36b2c", "circle");
  drawSeries("mood_score", "#4f82cf", "square");
  drawSeries("sleep_quality_score", "#47a17a", "triangle");

  const dayMs = 24 * 60 * 60 * 1000;
  const ticks = [];
  let lastTickTime = null;
  for (let i = 0; i < items.length; i += 1) {
    const dateText = String(items[i].recorded_at || "").slice(0, 10);
    const time = Number.isNaN(Date.parse(`${dateText}T00:00:00`)) ? null : Date.parse(`${dateText}T00:00:00`);
    if (i === 0) {
      ticks.push(i);
      lastTickTime = time;
      continue;
    }
    if (time !== null && lastTickTime !== null && time - lastTickTime >= 7 * dayMs) {
      ticks.push(i);
      lastTickTime = time;
    }
  }
  if (items.length > 1 && ticks[ticks.length - 1] !== items.length - 1) {
    ticks.push(items.length - 1);
  }

  ctx.fillStyle = "#7f6f63";
  ctx.font = "11px sans-serif";
  ctx.textBaseline = "top";
  for (const idx of ticks) {
    const x = xFor(idx);
    const label = recordedAtDateKey(items[idx].recorded_at).slice(5, 10).replace("-", "/");
    ctx.strokeStyle = "#decdb9";
    ctx.beginPath();
    ctx.moveTo(x, pad.top + h);
    ctx.lineTo(x, pad.top + h + 4);
    ctx.stroke();

    if (x < pad.left + 22) ctx.textAlign = "left";
    else if (x > pad.left + w - 22) ctx.textAlign = "right";
    else ctx.textAlign = "center";
    ctx.fillText(label, x, pad.top + h + 6);
  }
  return true;
}

function todayDateString() {
  return formatLocalDateKey(new Date());
}

async function refreshTodayStatus() {
  try {
    const data = await loadByDate(todayDateString());
    if (data?.item) {
      todayStatus.textContent = "今日の記録: 完了";
      todayStatus.classList.add("done");
      return;
    }
    todayStatus.textContent = "今日の記録: 未完了";
    todayStatus.classList.remove("done");
  } catch (_) {
    todayStatus.textContent = "今日の記録: 確認できません";
  }
}

async function refreshOverview() {
  await Promise.all([
    loadRecent().catch(() => {}),
    loadStats().catch(() => {}),
    refreshTodayStatus().catch(() => {}),
    refreshCalendar().catch(() => {}),
    loadShareLinks().catch(() => {}),
    loadDoctorNotes().catch(() => {})
  ]);
  if (!mypagePage.classList.contains("hidden")) {
    try {
      await refreshChartBySelection();
    } catch (error) {
      chartStatus.textContent = `グラフ更新エラー: ${extractErrorMessage(error)}`;
    }
  }
  setConsultChatExampleButtons(buildConsultChatExamples());
  stampSync();
}

async function runSafetyCheckFromText(text, source) {
  const userId = getUserId();
  if (!text || !userId) return null;
  if (!(await ensureConsentForWrite("安全チェック保存"))) return null;
  try {
    const result = await api("/api/v1/safety/evaluate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, text })
    });
    setSafetyStatus(result);
    if (result.risk_level === "high") {
      const warning = result.emergency_guidance || "緊急性の可能性があります。早めに相談してください。";
      setSafeText(voiceStatus, `高リスクを検知: ${warning}`);
      speakText(warning);
      show({ voice: source, transcript: text, safety: result });
    }
    return result;
  } catch (_) {
    return null;
  }
}

function setRangeValue(name, value) {
  const input = form.querySelector(`[name=${name}]`);
  if (!input) return;
  const num = Number(value);
  if (Number.isNaN(num)) return;
  const clamped = Math.max(0, Math.min(10, num));
  input.value = String(clamped);
  syncMeter(name);
}

function setSleepHours(value) {
  const input = form.querySelector("[name=sleep_hours]");
  if (!input) return;
  const num = Number(value);
  if (Number.isNaN(num)) return;
  input.value = String(Math.max(0, Math.min(24, num)));
}

function addSymptom(token) {
  const symptomsInput = getSymptomsInput();
  if (!symptomsInput || !token) return;
  const set = new Set(
    String(symptomsInput.value)
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
  );
  set.add(token);
  symptomsInput.value = Array.from(set).join(",");
  for (const chip of symptomChips) {
    if (chip.getAttribute("data-symptom") === token) {
      chip.classList.add("active");
    }
  }
}

function syncMeter(inputName) {
  const input = form.querySelector(`[name=${inputName}]`);
  const meter = document.querySelector(`[data-for=${inputName}]`);
  if (!input || !meter) return;
  const value = Number(input.value || 0);
  const meta = sliderMeta[inputName];
  if (!meta) {
    meter.textContent = String(input.value);
    return;
  }
  const state = meta.states.find((item) => value <= item.max) || meta.states[meta.states.length - 1];
  const visualRatio = meta.goodHigh ? value / 10 : 1 - value / 10;
  const hue = Math.round(visualRatio * 120);
  const dark = `hsl(${hue} 65% 40%)`;
  const soft = `hsl(${hue} 85% 92%)`;
  const trackLow = meta.goodHigh ? "#f58b8b" : "#78c88b";
  const trackHigh = meta.goodHigh ? "#78c88b" : "#f58b8b";
  input.style.setProperty("--track-bg", `linear-gradient(90deg, ${trackLow} 0%, #f1d26b 50%, ${trackHigh} 100%)`);
  input.style.setProperty("--thumb-border", dark);
  meter.style.setProperty("--meter-bg", soft);
  meter.style.setProperty("--meter-border", dark);
  meter.style.setProperty("--meter-ink", dark);
  meter.textContent = `${state.emoji} ${value} ${state.label}`;
}

for (const meter of meters) {
  const inputName = meter.getAttribute("data-for");
  syncMeter(inputName);
  const input = form.querySelector(`[name=${inputName}]`);
  if (input) {
    input.addEventListener("input", () => syncMeter(inputName));
  }
}

for (const chip of chips) {
  chip.addEventListener("click", () => {
    const note = form.querySelector("[name=note]");
    const tag = chip.getAttribute("data-chip");
    if (!note || !tag) return;
    const current = note.value.trim();
    note.value = current ? `${current} / ${tag}` : tag;
  });
}

for (const chip of symptomChips) {
  chip.addEventListener("click", () => {
    const symptomsInput = getSymptomsInput();
    const token = chip.getAttribute("data-symptom");
    if (!symptomsInput || !token) return;
    const set = new Set(
      String(symptomsInput.value)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    );
    if (set.has(token)) {
      set.delete(token);
      chip.classList.remove("active");
    } else {
      set.add(token);
      chip.classList.add("active");
    }
    symptomsInput.value = Array.from(set).join(",");
  });
}

async function loadSummary() {
  const userId = getUserId();
  const date = getRecordedDate();
  const data = await api(
    `/api/v1/insights/daily-summary?user_id=${encodeURIComponent(userId)}&date=${encodeURIComponent(date)}`
  );
  setSafeText(summaryView, data.summary || "まとめなし");
  if (summaryPraiseView) {
    if (data.praise) {
      setSafeText(summaryPraiseView, `よかった点: ${data.praise}`);
      summaryPraiseView.classList.remove("hidden");
    } else {
      setSafeText(summaryPraiseView, "");
      summaryPraiseView.classList.add("hidden");
    }
  }
  return data;
}

async function loadTrend() {
  const userId = getUserId();
  const data = await api(`/api/v1/insights/trend?user_id=${encodeURIComponent(userId)}&window_days=7`);
  const highlights = Array.isArray(data.highlights) ? data.highlights.join(" / ") : "";
  setSafeText(trendView, `${data.trend || "stable"}: ${highlights}`);
  return data;
}

async function loadMatch() {
  const userId = getUserId();
  const params = new URLSearchParams({ user_id: userId });
  if (userLocation && Number.isFinite(userLocation.lat) && Number.isFinite(userLocation.lng)) {
    params.set("lat", String(userLocation.lat));
    params.set("lng", String(userLocation.lng));
  }
  return api(`/api/v1/match/providers?${params.toString()}`);
}

function renderReservationCandidates(data) {
  if (!reservationView) return;
  const providers = Array.isArray(data?.providers) ? data.providers : [];
  if (!providers.length) {
    reservationView.textContent = "候補が見つかりませんでした。症状メモを追加して再度お試しください。";
    return;
  }
  reservationView.innerHTML = "";
  const locationInfo = document.createElement("p");
  locationInfo.className = "reservation-meta";
  locationInfo.textContent = data?.location_used
    ? "現在地を使って距離も加味したおすすめ順で表示しています。"
    : "症状適合度を優先して表示しています。現在地を使うと近い順も反映できます。";
  reservationView.append(locationInfo);

  for (const provider of providers) {
    const card = document.createElement("article");
    card.className = "reservation-item";

    const title = document.createElement("p");
    title.className = "reservation-title";
    const fitPercent = Math.round(Number(provider.fit_score || 0) * 100);
    const recommendPercent = Math.round(Number(provider.recommendation_score || provider.fit_score || 0) * 100);
    title.textContent = `${provider.name || "医療機関"}（AIおすすめ ${recommendPercent}% / 適合度 ${fitPercent}%）`;
    card.append(title);

    const meta = document.createElement("p");
    meta.className = "reservation-meta";
    const online = provider.online_available ? "オンライン可" : "対面中心";
    const next = provider.next_available_at ? ` / 最短: ${formatDateTime(provider.next_available_at)}` : "";
    const distance = Number.isFinite(Number(provider.distance_km))
      ? ` / 距離: ${Number(provider.distance_km).toFixed(1)}km`
      : "";
    meta.textContent = `${online}${distance}${next}`;
    card.append(meta);

    if (provider.address) {
      const address = document.createElement("p");
      address.className = "reservation-meta";
      address.textContent = `住所: ${provider.address}`;
      card.append(address);
    }

    if (provider.recommendation_reason) {
      const reason = document.createElement("p");
      reason.className = "reservation-reason";
      reason.textContent = `AIおすすめ理由: ${provider.recommendation_reason}`;
      card.append(reason);
    }

    const actions = document.createElement("div");
    actions.className = "reservation-actions";
    if (provider.booking_url) {
      const webLink = document.createElement("a");
      webLink.href = provider.booking_url;
      webLink.target = "_blank";
      webLink.rel = "noopener noreferrer";
      webLink.textContent = "Web予約";
      actions.append(webLink);
    }
    if (provider.phone) {
      const telLink = document.createElement("a");
      telLink.href = `tel:${String(provider.phone).replace(/[^\d+]/g, "")}`;
      telLink.textContent = `電話予約 (${provider.phone})`;
      actions.append(telLink);
    }
    if (!actions.children.length) {
      const noAction = document.createElement("p");
      noAction.className = "reservation-meta";
      noAction.textContent = "予約導線の登録がまだありません";
      card.append(noAction);
    } else {
      card.append(actions);
    }
    reservationView.append(card);
  }
}

function setLocationStatus(text) {
  if (!locStatus) return;
  locStatus.textContent = text;
}

function geolocationErrorMessage(error) {
  const code = Number(error?.code || 0);
  if (code === 1) return "位置情報が許可されていません。ブラウザ設定で許可してください。";
  if (code === 2) return "位置情報を取得できませんでした。電波状況をご確認ください。";
  if (code === 3) return "位置情報の取得がタイムアウトしました。";
  return "位置情報の取得に失敗しました。";
}

function clearUserLocation() {
  userLocation = null;
  setLocationStatus("位置情報: 未使用");
}

function getCurrentPosition() {
  if (!navigator.geolocation) {
    const err = new Error("geolocation_not_supported");
    err.code = 0;
    throw err;
  }
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: false,
      timeout: 10000,
      maximumAge: 5 * 60 * 1000
    });
  });
}

async function loadNextStep() {
  const userId = getUserId();
  const data = await api(`/api/v1/insights/next-step?user_id=${encodeURIComponent(userId)}`);
  setSafeText(nextStepView, data.step || "提案なし");
  return data;
}

async function refreshInsights() {
  const [summaryData, trendData, nextStepData] = await Promise.all([loadSummary(), loadTrend(), loadNextStep()]);
  return { summary: summaryData, trend: trendData, next_step: nextStepData };
}

function renderRecent(items) {
  recentList.innerHTML = "";
  if (!items.length) {
    const li = document.createElement("li");
    li.textContent = "まだ記録はありません";
    recentList.append(li);
    return;
  }
  for (const item of items) {
    const li = document.createElement("li");
    const symptoms = formatSymptomsDisplay(item.symptoms);
    li.textContent = `${item.recorded_at} / ${symptoms} / つらさ${item.symptom_score} / 気分${item.mood_score}`;
    recentList.append(li);
  }
}

async function loadRecent() {
  const userId = getUserId();
  const data = await api(`/api/v1/logs/recent?user_id=${encodeURIComponent(userId)}&limit=5`);
  renderRecent(data.items || []);
  return data;
}

async function loadTrendChartData(limit = 14) {
  const userId = getUserId();
  let items = [];
  try {
    const data = await api(`/api/v1/logs/recent?user_id=${encodeURIComponent(userId)}&limit=${encodeURIComponent(limit)}`);
    items = (data.items || []).slice().reverse();
  } catch (error) {
    // Backward compatibility: if recent endpoint is unavailable, derive from export payload.
    if (isNotFoundError(error)) {
      const exported = await api(`/api/v1/user/export?user_id=${encodeURIComponent(userId)}`);
      const logs = Array.isArray(exported.logs) ? exported.logs : [];
      items = logs.slice(-Math.max(1, Number(limit) || 14));
    } else {
      throw error;
    }
  }
  const ok = drawTrendChart(items);
  chartStatus.textContent = items.length
    ? items.length === 1
      ? `表示中: 1件（${recordedAtDateKey(items[0].recorded_at)}、点で表示）`
      : `表示中: ${items.length}件（${recordedAtDateKey(items[0].recorded_at)} ～ ${recordedAtDateKey(items[items.length - 1].recorded_at)}）`
    : "グラフが空です: 記録データが未保存、または期間外です。";
  if (!ok && !mypagePage.classList.contains("hidden")) {
    setTimeout(() => {
      drawTrendChart(items);
    }, 120);
  }
  return items;
}

async function loadTrendChartRange(from, to) {
  const userId = getUserId();
  let items = [];
  try {
    const data = await api(
      `/api/v1/logs/range?user_id=${encodeURIComponent(userId)}&from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`
    );
    items = data.items || [];
  } catch (error) {
    const msg = getRawErrorCode(error);
    // Backward compatibility: if range endpoint is unavailable, derive from recent logs.
    if (msg === "not found") {
      try {
        const recent = await api(`/api/v1/logs/recent?user_id=${encodeURIComponent(userId)}&limit=120`);
        items = (recent.items || [])
          .filter((log) => {
            const date = recordedAtDateKey(log.recorded_at);
            return date >= from && date <= to;
          })
          .sort((a, b) => new Date(a.recorded_at) - new Date(b.recorded_at));
      } catch (fallbackError) {
        if (!isNotFoundError(fallbackError)) throw fallbackError;
        const exported = await api(`/api/v1/user/export?user_id=${encodeURIComponent(userId)}`);
        items = (Array.isArray(exported.logs) ? exported.logs : [])
          .filter((log) => {
            const date = recordedAtDateKey(log.recorded_at);
            return date >= from && date <= to;
          })
          .sort((a, b) => new Date(a.recorded_at) - new Date(b.recorded_at));
      }
    } else {
      throw error;
    }
  }
  const ok = drawTrendChart(items);
  chartStatus.textContent = items.length
    ? items.length === 1
      ? `期間表示: 1件（${from} ～ ${to}、点で表示）`
      : `期間表示: ${items.length}件（${from} ～ ${to}）`
    : `グラフが空です: ${from} ～ ${to} の記録がありません。`;
  if (!ok && !mypagePage.classList.contains("hidden")) {
    setTimeout(() => {
      drawTrendChart(items);
    }, 120);
  }
  return items;
}

async function refreshChartBySelection() {
  if (chartRange.value === "custom") {
    if (!chartFrom.value || !chartTo.value) {
      chartStatus.textContent = "グラフが空です: 期間指定では開始日・終了日の入力が必要です。";
      return;
    }
    await loadTrendChartRange(chartFrom.value, chartTo.value);
    return;
  }
  await loadTrendChartData(Number(chartRange.value || 14));
}

async function loadByDate(date) {
  const userId = getUserId();
  return api(`/api/v1/logs/by-date?user_id=${encodeURIComponent(userId)}&date=${encodeURIComponent(date)}`);
}

async function loadProfile() {
  const userId = getUserId();
  const data = await api(`/api/v1/profile?user_id=${encodeURIComponent(userId)}`);
  const profile = data.profile || {};
  profileForm.querySelector("[name=display_name]").value = profile.display_name || "";
  profileForm.querySelector("[name=height_cm]").value = profile.height_cm ?? "";
  profileForm.querySelector("[name=weight_kg]").value = profile.weight_kg ?? "";
  profileForm.querySelector("[name=birth_date]").value = profile.birth_date || "";
  profileForm.querySelector("[name=sex]").value = profile.sex || "";
  profileForm.querySelector("[name=chronic_conditions]").value = profile.chronic_conditions || "";
  profileForm.querySelector("[name=note]").value = profile.note || "";
  profileStatus.textContent =
    profile.updated_at && !isProfileEmpty(profile) ? `更新済み: ${new Date(profile.updated_at).toLocaleString("ja-JP")}` : "未保存";
  updateProfileDerived(profile);
  return data;
}

async function saveProfile() {
  const userId = getUserId();
  const formData = new FormData(profileForm);
  const payload = {
    user_id: userId,
    display_name: formData.get("display_name"),
    height_cm: formData.get("height_cm"),
    weight_kg: formData.get("weight_kg"),
    birth_date: formData.get("birth_date"),
    sex: formData.get("sex"),
    chronic_conditions: formData.get("chronic_conditions"),
    note: formData.get("note")
  };
  const data = await api("/api/v1/profile", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  const savedProfile = data.profile || {};
  profileStatus.textContent = isProfileEmpty(savedProfile) ? "未保存" : "保存しました";
  updateProfileDerived(savedProfile);
  return data;
}

async function loadCalendar(month) {
  const userId = getUserId();
  return api(`/api/v1/logs/calendar?user_id=${encodeURIComponent(userId)}&month=${encodeURIComponent(month)}`);
}

async function loadStats() {
  const userId = getUserId();
  const data = await api(`/api/v1/logs/stats?user_id=${encodeURIComponent(userId)}`);
  statsView.textContent = `連続記録 ${data.streak_days || 0}日 / 記録日数 ${data.total_days || 0}日 / 総記録 ${data.total_logs || 0}件`;
  return data;
}

function setSafetyStatus(result) {
  safetyStatus.classList.remove("is-high", "is-medium", "is-low");
  if (!result || !result.risk_level) {
    safetyStatus.textContent = "安全チェック待ちです。";
    return;
  }
  safetyStatus.classList.add(`is-${result.risk_level}`);
  if (result.risk_level === "high") {
    safetyStatus.textContent = "高リスク: 緊急性の可能性があります。早めに相談してください。";
    return;
  }
  if (result.risk_level === "medium") {
    safetyStatus.textContent = "中リスク: 体調の変化を見ながら、必要なら受診相談してください。";
    return;
  }
  safetyStatus.textContent = "低リスク: 今のところ緊急ワードは検知されていません。";
}

function renderCalendar(month, items) {
  calendarGrid.innerHTML = "";
  const heads = ["日", "月", "火", "水", "木", "金", "土"];
  for (const head of heads) {
    const el = document.createElement("div");
    el.className = "calendar-head";
    el.textContent = head;
    calendarGrid.append(el);
  }

  const [yearStr, monthStr] = month.split("-");
  const year = Number(yearStr);
  const monthNum = Number(monthStr);
  const firstDay = new Date(year, monthNum - 1, 1).getDay();
  const maxDay = new Date(year, monthNum, 0).getDate();
  const byDate = new Map((items || []).map((item) => [item.date, item]));

  for (let i = 0; i < firstDay; i += 1) {
    const blank = document.createElement("div");
    blank.className = "calendar-cell blank";
    calendarGrid.append(blank);
  }

  for (let day = 1; day <= maxDay; day += 1) {
    const date = `${yearStr}-${monthStr}-${String(day).padStart(2, "0")}`;
    const item = byDate.get(date);
    const cell = document.createElement("div");
    cell.className = "calendar-cell";
    if (item) cell.classList.add("has-log", "is-clickable");
    if (item && item.symptom_avg >= 7) cell.classList.add("hard-day");
    if (item) {
      cell.dataset.date = date;
      cell.setAttribute("role", "button");
      cell.setAttribute("tabindex", "0");
      cell.setAttribute("aria-label", `${date} の記録を編集`);
    }
    cell.innerHTML = `<strong>${day}</strong>${item ? `<small>${item.count}件</small><span class="calendar-hint">編集</span>` : ""}`;
    calendarGrid.append(cell);
  }
}

async function openCalendarDateForEdit(date) {
  if (!date) return;
  reviewDate.value = date;
  const data = await loadByDate(date);
  if (!data.item) {
    reviewView.textContent = "その日の記録はまだありません。";
    if (reviewEditBtn) reviewEditBtn.classList.add("hidden");
    reviewedLogItem = null;
    showToast("その日の記録はまだありません");
    return;
  }
  reviewedLogItem = data.item;
  if (reviewEditBtn) reviewEditBtn.classList.remove("hidden");
  reviewView.textContent = `${data.item.recorded_at} / 症状: ${formatSymptomsDisplay(data.item.symptoms)} / つらさ${data.item.symptom_score} / 気分${data.item.mood_score} / メモ: ${data.item.note || "-"}`;
  enterEditMode(data.item, date);
}

async function refreshCalendar() {
  if (!calendarMonth.value) return;
  const data = await loadCalendar(calendarMonth.value);
  renderCalendar(data.month, data.items || []);
}

function initDatetimeDefault() {
  const recordedAtInput = form.querySelector("[name=recorded_at]");
  if (!recordedAtInput) return;
  const now = new Date();
  const offset = -now.getTimezoneOffset();
  const sign = offset >= 0 ? "+" : "-";
  const abs = Math.abs(offset);
  const hh = String(Math.floor(abs / 60)).padStart(2, "0");
  const mm = String(abs % 60).padStart(2, "0");
  const iso = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}T${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:00${sign}${hh}:${mm}`;
  recordedAtInput.value = iso;
  reviewDate.value = iso.slice(0, 10);
  calendarMonth.value = iso.slice(0, 7);
  const from = new Date(now);
  from.setDate(now.getDate() - 13);
  chartFrom.value = formatLocalDateKey(from);
  chartTo.value = formatLocalDateKey(now);
}

function resetFormInputs() {
  editingLogId = "";
  editingSourceDate = "";
  reviewedLogItem = null;
  imageClearRequested = false;
  setEditingStatus(false);
  const now = new Date();
  const recordedAtInput = form.querySelector("[name=recorded_at]");
  const symptomsInput = getSymptomsInput();
  const note = form.querySelector("[name=note]");
  if (recordedAtInput) {
    const offset = -now.getTimezoneOffset();
    const sign = offset >= 0 ? "+" : "-";
    const abs = Math.abs(offset);
    const hh = String(Math.floor(abs / 60)).padStart(2, "0");
    const mm = String(abs % 60).padStart(2, "0");
    recordedAtInput.value = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}T${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:00${sign}${hh}:${mm}`;
  }
  if (symptomsInput) symptomsInput.value = "";
  if (note) note.value = "";
  consultChatDraftSignature = "";
  setDraftNoteStatus();
  if (sleepStartTimeInput) sleepStartTimeInput.value = "";
  if (sleepEndTimeInput) sleepEndTimeInput.value = "";
  setSleepCalcStatus();
  setRangeValue("symptom_score", 0);
  setRangeValue("mood_score", 0);
  setRangeValue("sleep_quality_score", 0);
  setSleepHours(0);
  const medicationInput = form.querySelector("[name=medication_status]");
  if (medicationInput) medicationInput.value = "none";
  for (const chip of symptomChips) chip.classList.remove("active");
  setConsultChatExampleButtons(buildConsultChatExamples());
  if (logImageInput) logImageInput.value = "";
  setImageUiState({ dataUrl: "", name: "", status: "未添付" });
  setSafeText(voiceStatus, "入力をリセットしました。");
  if (submitBtn) submitBtn.textContent = submitButtonLabel();
}

function triggerSaveFromVoice() {
  if (submitBtn) {
    submitBtn.disabled = true;
  }
  setSafeText(voiceStatus, "音声コマンドで保存しています...");
  form.requestSubmit();
}

function applyVoiceCommand(text) {
  const normalized = String(text).replace(/\s+/g, "");
  let handled = false;

  if (/(確認して保存して|保存して|記録して|送信して)$/.test(normalized)) {
    triggerSaveFromVoice();
    handled = true;
  }

  const symptomMatch = normalized.match(/^(.+?)(追加|あり)$/);
  if (symptomMatch) {
    addSymptom(symptomMatch[1]);
    handled = true;
  }

  const symptomScoreMatch = normalized.match(/(つらさ|症状)(\d+(\.\d+)?)/);
  if (symptomScoreMatch) {
    setRangeValue("symptom_score", symptomScoreMatch[2]);
    handled = true;
  }

  const moodScoreMatch = normalized.match(/(気分)(\d+(\.\d+)?)/);
  if (moodScoreMatch) {
    setRangeValue("mood_score", moodScoreMatch[2]);
    handled = true;
  }

  const sleepQualityMatch = normalized.match(/(睡眠の質|睡眠質)(\d+(\.\d+)?)/);
  if (sleepQualityMatch) {
    setRangeValue("sleep_quality_score", sleepQualityMatch[2]);
    handled = true;
  }

  const sleepHourMatch = normalized.match(/(睡眠)(\d+(\.\d+)?)/);
  if (sleepHourMatch) {
    setSleepHours(sleepHourMatch[2]);
    handled = true;
  }

  return handled;
}

async function applyVoiceText(text) {
  const cleanText = String(text || "").trim();
  if (!cleanText) return;
  setVoiceLastText(cleanText);

  if (voiceMode.value === "command") {
    const handled = applyVoiceCommand(cleanText);
    if (handled) {
      setSafeText(voiceStatus, `コマンド反映: 「${cleanText}」`);
    } else {
      const appended = appendVoiceToDailyNote(cleanText);
      setSafeText(
        voiceStatus,
        appended
          ? `コマンド未解釈のためメモ追記: 「${cleanText}」`
          : `コマンド解釈できず（メモ追記先が見つかりません）: 「${cleanText}」`
      );
    }
    await runSafetyCheckFromText(cleanText, "command");
    show({ voice: "command", transcript: cleanText });
    return;
  }
  const appended = appendVoiceToDailyNote(cleanText);
  setSafeText(
    voiceStatus,
    appended
      ? `メモに反映: 「${cleanText}」`
      : `メモ追記先が見つかりませんでした: 「${cleanText}」`
  );
  await runSafetyCheckFromText(cleanText, "note");
  show({ voice: "note", transcript: cleanText });
}

function renderVoiceAlternatives(texts) {
  voiceAltBox.innerHTML = "";
  if (!texts.length) return;
  const title = document.createElement("p");
  title.className = "chips-title";
  title.textContent = "聞き取り候補（タップで再適用）";
  voiceAltBox.append(title);
  for (const text of texts) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "chip voice-alt-chip";
    btn.textContent = text;
    btn.addEventListener("click", () => {
      applyVoiceText(text).catch(() => {});
    });
    voiceAltBox.append(btn);
  }
}

function speakText(text) {
  if (!speechSynthesisSupported || !text) return;
  window.speechSynthesis.cancel();
  const uttr = new SpeechSynthesisUtterance(text);
  uttr.lang = "ja-JP";
  uttr.rate = 1;
  uttr.pitch = 1;
  window.speechSynthesis.speak(uttr);
}

function recorderMimeType() {
  const candidates = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/ogg"];
  for (const type of candidates) {
    if (window.MediaRecorder && MediaRecorder.isTypeSupported(type)) {
      return type;
    }
  }
  return "";
}

async function transcribeBlob(blob) {
  const buffer = await blob.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  const audioBase64 = btoa(binary);
  const data = await api("/api/v1/voice/transcribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id: getUserId(),
      audio_base64: audioBase64,
      mime_type: blob.type || "audio/webm"
    })
  });
  return String(data.text || "").trim();
}

async function startRecorderFallback() {
  const secureNeeded = !window.isSecureContext && location.hostname !== "localhost" && location.hostname !== "127.0.0.1";
  if (secureNeeded) {
    setSafeText(voiceStatus, "この接続(HTTP)ではマイク録音が制限されます。HTTPSで開くか、「ファイルから入力」を使ってください。");
    return;
  }
  if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
    setSafeText(voiceStatus, "このブラウザでは音声入力が利用できません。");
    return;
  }
  recorderStream = await navigator.mediaDevices.getUserMedia({ audio: true });
  recorderChunks = [];
  const mimeType = recorderMimeType();
  recorder = mimeType ? new MediaRecorder(recorderStream, { mimeType }) : new MediaRecorder(recorderStream);
  recorder.ondataavailable = (event) => {
    if (event.data && event.data.size > 0) recorderChunks.push(event.data);
  };
  recorder.onstop = async () => {
    try {
      const blob = new Blob(recorderChunks, { type: recorder.mimeType || "audio/webm" });
      setSafeText(voiceStatus, "音声を文字起こし中...");
      const text = await transcribeBlob(blob);
      if (!text) {
        setSafeText(voiceStatus, "音声を認識できませんでした。もう一度お試しください。");
        return;
      }
      await applyVoiceText(text);
      renderVoiceAlternatives([text]);
    } catch (error) {
      const msg = extractErrorMessage(error);
      if (msg.includes("voice_transcribe_not_configured")) {
        setSafeText(voiceStatus, "文字起こし未設定です。OPENAI_API_KEYを設定してください。");
      } else {
        setSafeText(voiceStatus, `文字起こしに失敗しました: ${msg}`);
      }
      show({ error: String(error.message || error) });
    } finally {
      if (recorderStream) {
        for (const track of recorderStream.getTracks()) track.stop();
      }
      recorderStream = null;
      recorder = null;
      recorderChunks = [];
      isListening = false;
      voiceBtn.textContent = "🎤 その場で話す";
    }
  };
  recorder.start();
  isListening = true;
  voiceBtn.textContent = "■ 音声停止";
  setSafeText(voiceStatus, "その場で話す録音中... もう一度押すと終了します。");
}

function stopRecorderFallback() {
  if (recorder && recorder.state !== "inactive") {
    recorder.stop();
  }
}

function buildShareText() {
  const userId = getUserId();
  const recordedAt = form.querySelector("[name=recorded_at]")?.value || "-";
  const symptoms = getSymptomsInput()?.value || "-";
  const profileSummary = getProfileSummaryText();
  const summary = summaryView.textContent || "-";
  const trend = trendView.textContent || "-";
  const nextStep = nextStepView.textContent || "-";
  return [
    `【体調共有メモ】`,
    `ユーザーID: ${userId}`,
    `プロフィール: ${profileSummary}`,
    `記録日時: ${recordedAt}`,
    `症状: ${symptoms}`,
    `今日のまとめ: ${summary}`,
    `最近の傾向: ${trend}`,
    `次の一歩: ${nextStep}`
  ].join("\n");
}

async function copyShareText() {
  const text = buildShareText();
  await copyTextToClipboard(text, copyStatus);
}

async function exportUserData() {
  const userId = getUserId();
  const data = await api(`/api/v1/user/export?user_id=${encodeURIComponent(userId)}`);
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `health-data-${userId}-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.append(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  return data;
}

function formatDateTime(isoText) {
  if (!isoText) return "-";
  const d = new Date(isoText);
  if (Number.isNaN(d.getTime())) return String(isoText);
  return d.toLocaleString("ja-JP");
}

async function exportDoctorSummary() {
  const userId = getUserId();
  const data = await api(`/api/v1/share/doctor-summary?user_id=${encodeURIComponent(userId)}&window_days=14`);
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `doctor-summary-${userId}-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.append(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  return data;
}

async function createDoctorShareLink() {
  const userId = getUserId();
  const shareTargetLabel = String(shareTargetLabelInput?.value || "").trim();
  return api("/api/v1/share-links", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id: userId,
      expires_hours: 24,
      window_days: 14,
      share_target_label: shareTargetLabel
    })
  });
}

async function runCreateShareLinkFlow() {
  if (!shareConfirmCheck?.checked) {
    if (shareConfirmStatus) shareConfirmStatus.textContent = "共有前に確認チェックが必要です";
    showToast("共有範囲の確認が必要です");
    return;
  }
  createShareLinkBtn.disabled = true;
  const before = createShareLinkBtn.textContent;
  createShareLinkBtn.textContent = "発行中...";
  if (shareConfirmSubmitBtn) {
    shareConfirmSubmitBtn.disabled = true;
    shareConfirmSubmitBtn.textContent = "発行中...";
  }
  try {
    const data = await createDoctorShareLink();
    const url = absoluteUrl(data.doctor_url);
    let copied = false;
    try {
      copied = await copyText(url);
    } catch (_) {
      copied = false;
    }
    if (shareStatus) {
      shareStatus.textContent = copied
        ? `共有リンク発行: ${formatDateTime(data.expires_at)} まで有効（コピー済み）`
        : `共有リンク発行: ${formatDateTime(data.expires_at)} まで有効（コピーは手動）`;
    }
    show({
      message: copied ? "共有リンクを発行してコピーしました" : "共有リンクを発行しました。手動でコピーしてください。",
      doctor_url: url,
      expires_at: data.expires_at
    });
    setShareConfirmVisible(false);
    showToast(copied ? "共有リンクを発行してコピーしました" : "共有リンクを発行しました（手動コピー）");
    await loadShareLinks();
  } catch (error) {
    if (shareStatus) shareStatus.textContent = `失敗: ${extractErrorMessage(error)}`;
    reportError("共有リンク発行エラー", error, shareConfirmStatus || shareStatus);
  } finally {
    createShareLinkBtn.disabled = false;
    createShareLinkBtn.textContent = before;
    if (shareConfirmSubmitBtn) {
      shareConfirmSubmitBtn.disabled = false;
      shareConfirmSubmitBtn.textContent = "この内容で共有リンクを発行";
    }
  }
}

async function revokeShareLink(shareId) {
  const userId = getUserId();
  return api(`/api/v1/share-links/${encodeURIComponent(shareId)}?user_id=${encodeURIComponent(userId)}`, {
    method: "DELETE"
  });
}

async function revokeAllShareLinks() {
  const userId = getUserId();
  try {
    const bulk = await api("/api/v1/share-links/revoke-all", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId })
    });
    const nonRevokedFound = Number(bulk.non_revoked_found ?? bulk.active_found ?? 0);
    const activeFound = Number(bulk.active_found || 0);
    const expiredFound = Number(bulk.expired_found || 0);
    const revoked = Number(bulk.revoked || 0);
    await loadShareLinks().catch(() => {});
    return {
      total: Number(bulk.total_found ?? nonRevokedFound),
      non_revoked: nonRevokedFound,
      active: activeFound,
      expired: expiredFound,
      revoked,
      failed: Math.max(0, nonRevokedFound - revoked)
    };
  } catch (error) {
    if (Number(error?.status || 0) !== 404) throw error;
    // Backward compatibility: old server without bulk endpoint.
    const listed = await api(`/api/v1/share-links?user_id=${encodeURIComponent(userId)}`);
    const items = Array.isArray(listed?.items) ? listed.items : [];
    const nonRevokedItems = items.filter((item) => String(item.status || "") !== "revoked");
    const active = nonRevokedItems.filter((item) => String(item.status || "") === "active");
    const expired = nonRevokedItems.filter((item) => String(item.status || "") === "expired");
    let revoked = 0;
    let failed = 0;
    for (const item of nonRevokedItems) {
      try {
        await revokeShareLink(item.share_id);
        revoked += 1;
      } catch (_) {
        failed += 1;
      }
    }
    await loadShareLinks().catch(() => {});
    return {
      total: items.length,
      non_revoked: nonRevokedItems.length,
      active: active.length,
      expired: expired.length,
      revoked,
      failed
    };
  }
}

async function seedDemoLogs(days = 12) {
  const userId = getUserId();
  return api("/api/v1/dev/seed-demo", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id: userId,
      days: Math.max(7, Math.min(120, Number(days) || 12)),
      clear_existing: true
    })
  });
}

function absoluteUrl(path) {
  return `${window.location.origin}${path}`;
}

async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (_) {
      // Fall back to legacy copy flow.
    }
  }
  const area = document.createElement("textarea");
  area.value = text;
  area.setAttribute("readonly", "true");
  area.style.position = "fixed";
  area.style.left = "-9999px";
  document.body.append(area);
  area.select();
  const copied = document.execCommand("copy");
  area.remove();
  if (!copied) {
    const error = new Error("clipboard_write_denied");
    error.statusCode = 0;
    throw error;
  }
  return true;
}

function renderShareLinks(items) {
  if (!shareLinksList) return;
  shareLinksList.innerHTML = "";
  const safeItems = Array.isArray(items) ? items : [];
  const visibleItems = safeItems.filter((item) => String(item?.status || "") !== "revoked");
  const hiddenRevokedCount = safeItems.length - visibleItems.length;
  if (!visibleItems.length) {
    const li = document.createElement("li");
    li.textContent = hiddenRevokedCount > 0 ? "有効/期限切れの共有リンクはありません（失効済みは非表示）" : "共有リンクはまだありません";
    shareLinksList.append(li);
    return;
  }
  if (hiddenRevokedCount > 0) {
    const info = document.createElement("li");
    info.textContent = `失効済みリンク ${hiddenRevokedCount}件は一覧から非表示です`;
    shareLinksList.append(info);
  }
  for (const item of visibleItems) {
    const li = document.createElement("li");
    const meta = document.createElement("span");
    const targetLabel = item.share_target_label ? ` / 宛先メモ:${item.share_target_label}` : "";
    meta.textContent = `状態:${item.status}${targetLabel} / 期限:${formatDateTime(item.expires_at)} / 閲覧:${item.access_count}回 / 最終閲覧:${formatDateTime(item.last_access_at)}`;
    li.append(meta);

    const row = document.createElement("div");
    row.className = "review-row";
    const copyBtn = document.createElement("button");
    copyBtn.type = "button";
    copyBtn.textContent = "リンクをコピー";
    copyBtn.addEventListener("click", async () => {
      try {
        await copyText(absoluteUrl(item.doctor_url));
        if (shareStatus) shareStatus.textContent = "共有リンクをコピーしました";
        showToast("共有リンクをコピーしました");
      } catch (error) {
        if (shareStatus) {
          shareStatus.textContent = "リンク発行は済みです。下の「医師ビューを開く」またはURL手動コピーをご利用ください。";
        }
        reportError("クリップボードコピー失敗", error, shareStatus);
      }
    });
    row.append(copyBtn);

    const openLink = document.createElement("a");
    openLink.href = item.doctor_url;
    openLink.target = "_blank";
    openLink.rel = "noopener noreferrer";
    openLink.textContent = "医師ビューを開く";
    row.append(openLink);

    if (item.status === "active") {
      const revokeBtn = document.createElement("button");
      revokeBtn.type = "button";
      revokeBtn.textContent = "失効する";
      revokeBtn.addEventListener("click", async () => {
        revokeBtn.disabled = true;
        try {
          await revokeShareLink(item.share_id);
          if (shareStatus) shareStatus.textContent = "共有リンクを失効しました";
          await loadShareLinks();
          showToast("共有リンクを失効しました");
        } catch (error) {
          if (shareStatus) shareStatus.textContent = `失効失敗: ${extractErrorMessage(error)}`;
        } finally {
          revokeBtn.disabled = false;
        }
      });
      row.append(revokeBtn);
    }
    li.append(row);
    shareLinksList.append(li);
  }
}

async function loadShareLinks() {
  const userId = getUserId();
  const data = await api(`/api/v1/share-links?user_id=${encodeURIComponent(userId)}`);
  renderShareLinks(data.items || []);
  return data;
}

function renderDoctorNotes(items) {
  if (!doctorNotesList) return;
  latestDoctorNotes = Array.isArray(items) ? items.slice() : [];
  doctorNotesList.innerHTML = "";
  if (!items.length) {
    const li = document.createElement("li");
    li.textContent = "まだコメントはありません";
    doctorNotesList.append(li);
    return;
  }
  for (const item of items) {
    const li = document.createElement("li");
    li.textContent = `${formatDateTime(item.created_at)} / ${item.author || "担当医"}: ${item.note || "-"}`;
    doctorNotesList.append(li);
  }
}

async function loadDoctorNotes() {
  const userId = getUserId();
  const data = await api(`/api/v1/patient/doctor-notes?user_id=${encodeURIComponent(userId)}`);
  renderDoctorNotes(data.items || []);
  return data;
}


function ensureRecognition() {
  const SpeechRecognitionCtor = getSpeechRecognitionCtor();
  if (!SpeechRecognitionCtor) {
    voiceEngine = "recorder";
    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
      voiceEngine = "none";
      const secureNeeded = !window.isSecureContext && !isLocalhostHostName(location.hostname);
      if (secureNeeded) {
        setSafeText(
          voiceStatus,
          "このURL(HTTP)ではChromeの音声APIが使えません。https か localhost で開いてください。"
        );
      } else {
        setSafeText(voiceStatus, "このブラウザでは音声入力が利用できません。「ファイルから入力」をお試しください。");
      }
      return false;
    }
    setSafeText(voiceStatus, "録音→文字起こしモードで音声入力できます。");
    return false;
  }
  voiceEngine = "speech-recognition";

  if (recognition) return true;
  recognition = new SpeechRecognitionCtor();
  recognition.lang = "ja-JP";
  recognition.interimResults = false;
  recognition.continuous = false;
  recognition.maxAlternatives = 3;

  recognition.onstart = () => {
    isListening = true;
    voiceBtn.textContent = "■ 音声停止";
    setSafeText(voiceStatus, "その場で話してください。聞き取り中です...");
  };

  recognition.onend = () => {
    isListening = false;
    voiceBtn.textContent = "🎤 その場で話す";
  };

  recognition.onerror = (event) => {
    if (event.error === "not-allowed" || event.error === "service-not-allowed") {
      setSafeText(voiceStatus, "マイク権限が未許可です。ブラウザ設定でマイクを許可してください。");
      return;
    }
    setSafeText(voiceStatus, `音声入力エラー: ${event.error}`);
  };

  recognition.onresult = (event) => {
    const alternatives = Array.from(event.results?.[0] || [])
      .map((alt) => String(alt.transcript || "").trim())
      .filter(Boolean);
    const text = alternatives[0] || "";
    if (!text) return;
    applyVoiceText(text).catch(() => {});
    renderVoiceAlternatives(alternatives);
  };
  return true;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const isEditing = Boolean(editingLogId);
  if (!(await ensureConsentForWrite(isEditing ? "記録更新" : "記録保存"))) {
    return;
  }
  try {
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = isEditing ? "更新中..." : "保存中...";
    }
    const formData = new FormData(form);
    const symptoms = String(formData.get("symptoms") || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const payload = {
      user_id: String(formData.get("user_id") || getUserId()).trim(),
      recorded_at: normalizeRecordedAt(formData.get("recorded_at")),
      symptoms,
      symptom_score: normalizeScore(formData.get("symptom_score"), 0),
      mood_score: normalizeScore(formData.get("mood_score"), 0),
      sleep_hours: normalizeSleepHours(formData.get("sleep_hours"), 0),
      sleep_start_time: String(formData.get("sleep_start_time") || "").trim(),
      sleep_end_time: String(formData.get("sleep_end_time") || "").trim(),
      sleep_quality_score: normalizeScore(formData.get("sleep_quality_score"), 0),
      medication_status: String(formData.get("medication_status") || "unknown"),
      note: String(formData.get("note") || ""),
      log_id: isEditing ? editingLogId : undefined,
      image_keep: isEditing && !selectedImageDataUrl && !imageClearRequested,
      image_clear: isEditing && imageClearRequested,
      image_data_url: selectedImageDataUrl || undefined,
      image_name: selectedImageName || undefined
    };
    const data = await api("/api/v1/logs/daily", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (data?.image?.url) {
      setImageUiState({ dataUrl: "", name: "", status: isEditing ? "画像を更新しました" : "画像を保存しました" });
      if (logImagePreview) {
        logImagePreview.src = data.image.url;
        logImagePreview.classList.remove("hidden");
      }
      if (logImageInput) logImageInput.value = "";
    } else {
      setImageUiState({ dataUrl: "", name: "", status: "未添付" });
      if (logImageInput) logImageInput.value = "";
    }
    let insights = {};
    const postSaveWarnings = [];
    try {
      insights = await refreshInsights();
    } catch (error) {
      postSaveWarnings.push(`AI要約更新: ${extractErrorMessage(error)}`);
    }
    try {
      await loadRecent();
    } catch (error) {
      postSaveWarnings.push(`最近の記録更新: ${extractErrorMessage(error)}`);
    }
    if (!mypagePage.classList.contains("hidden")) {
      try {
        await loadTrendChartData(Number(chartRange.value || 14));
      } catch (error) {
        postSaveWarnings.push(`グラフ更新: ${extractErrorMessage(error)}`);
      }
    }
    try {
      await refreshCalendar();
    } catch (error) {
      postSaveWarnings.push(`カレンダー更新: ${extractErrorMessage(error)}`);
    }
    try {
      await loadStats();
    } catch (error) {
      postSaveWarnings.push(`統計更新: ${extractErrorMessage(error)}`);
    }
    try {
      await refreshTodayStatus();
    } catch (error) {
      postSaveWarnings.push(`今日の状態更新: ${extractErrorMessage(error)}`);
    }
    if (reviewDate.value) {
      try {
        const refreshed = await loadByDate(reviewDate.value);
        if (refreshed?.item) {
          reviewView.textContent = `${refreshed.item.recorded_at} / 症状: ${formatSymptomsDisplay(refreshed.item.symptoms)} / つらさ${refreshed.item.symptom_score} / 気分${refreshed.item.mood_score} / メモ: ${refreshed.item.note || "-"}`;
          reviewedLogItem = refreshed.item;
        }
      } catch (error) {
        postSaveWarnings.push(`日付ふりかえり更新: ${extractErrorMessage(error)}`);
      }
    }
    stampSync();
    show({ saved: data, ...insights });
    if (postSaveWarnings.length) {
      showToast(`保存済み: ${postSaveWarnings[0]}`);
    }
    if (isEditing) {
      setEditingStatus(false);
      editingLogId = "";
      editingSourceDate = "";
      reviewedLogItem = null;
      imageClearRequested = false;
      if (submitBtn) submitBtn.textContent = submitButtonLabel();
      showToast("過去記録を更新しました");
    }
  } catch (error) {
    reportError("記録保存エラー", error);
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = submitButtonLabel();
    }
  }
});

if (insightRefreshBtn) {
  insightRefreshBtn.addEventListener("click", async () => {
    const before = insightRefreshBtn.textContent;
    insightRefreshBtn.disabled = true;
    insightRefreshBtn.textContent = "更新中...";
    try {
      const data = await refreshInsights();
      show(data);
      showToast("AI要約を更新しました");
    } catch (error) {
      reportError("AI要約更新エラー", error);
    } finally {
      insightRefreshBtn.disabled = false;
      insightRefreshBtn.textContent = before;
    }
  });
}

matchBtn.addEventListener("click", async () => {
  try {
    const data = await loadMatch();
    renderReservationCandidates(data);
    showToast("相談先候補と予約導線を更新しました");
    show(data);
  } catch (error) {
    reportError("相談先候補エラー", error);
  }
});

if (locNearbyBtn) {
  locNearbyBtn.addEventListener("click", async () => {
    const before = locNearbyBtn.textContent;
    locNearbyBtn.disabled = true;
    locNearbyBtn.textContent = "取得中...";
    try {
      if (!window.isSecureContext && !isLocalhostHostName(location.hostname)) {
        setLocationStatus("位置情報は https または localhost でのみ利用できます。");
        showToast("位置情報は https/localhost で利用できます");
        return;
      }
      const pos = await getCurrentPosition();
      userLocation = {
        lat: Number(pos.coords.latitude),
        lng: Number(pos.coords.longitude),
        accuracy_m: Number(pos.coords.accuracy || 0)
      };
      const accText = Number.isFinite(userLocation.accuracy_m) && userLocation.accuracy_m > 0
        ? ` (誤差±${Math.round(userLocation.accuracy_m)}m)`
        : "";
      setLocationStatus(`位置情報: 取得済み${accText}`);
      const data = await loadMatch();
      renderReservationCandidates(data);
      show(data);
      showToast("現在地を使って候補を更新しました");
    } catch (error) {
      clearUserLocation();
      const message = error?.message === "geolocation_not_supported" ? "この端末は位置情報に対応していません。" : geolocationErrorMessage(error);
      setLocationStatus(`位置情報: ${message}`);
      showToast(message);
    } finally {
      locNearbyBtn.disabled = false;
      locNearbyBtn.textContent = before;
    }
  });
}

if (locClearBtn) {
  locClearBtn.addEventListener("click", async () => {
    clearUserLocation();
    try {
      const data = await loadMatch();
      renderReservationCandidates(data);
      showToast("位置情報なしの候補に戻しました");
    } catch (error) {
      reportError("相談先候補エラー", error);
    }
  });
}

safetyBtn.addEventListener("click", async () => {
  if (!(await ensureConsentForWrite("安全チェック保存"))) {
    return;
  }
  try {
    const userId = getUserId();
    const data = await api("/api/v1/safety/evaluate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, text: safetyText.value })
    });
    setSafetyStatus(data);
    show(data);
  } catch (error) {
    reportError("安全チェックエラー", error);
  }
});

reviewBtn.addEventListener("click", async () => {
  try {
    if (reviewEditBtn) reviewEditBtn.classList.add("hidden");
    reviewedLogItem = null;
    if (!reviewDate.value) {
      reviewView.textContent = "日付を選んでください。";
      return;
    }
    const data = await loadByDate(reviewDate.value);
    if (!data.item) {
      reviewView.textContent = "その日の記録はまだありません。";
      show(data);
      return;
    }
    const item = data.item;
    reviewedLogItem = item;
    if (reviewEditBtn) reviewEditBtn.classList.remove("hidden");
    reviewView.textContent = `${item.recorded_at} / 症状: ${formatSymptomsDisplay(item.symptoms)} / つらさ${item.symptom_score} / 気分${item.mood_score} / メモ: ${item.note || "-"}`;
    show(data);
  } catch (error) {
    reportError("日付確認エラー", error);
  }
});

if (draftNoteBtn) {
  draftNoteBtn.addEventListener("click", () => {
    const applied = applyDraftNote();
    setDraftNoteStatus(applied ? "下書きをメモに追加しました" : "同じ下書きがあるため追加していません");
    showToast(applied ? "メモ下書きを入れました" : "同じ内容がすでに入っています");
  });
}

if (calcSleepHoursBtn) {
  calcSleepHoursBtn.addEventListener("click", () => {
    applySleepTimeCalculation({ announce: true });
  });
}

for (const input of [sleepStartTimeInput, sleepEndTimeInput]) {
  if (input) {
    input.addEventListener("change", () => {
      applySleepTimeCalculation();
    });
  }
}

if (reviewEditBtn) {
  reviewEditBtn.addEventListener("click", () => {
    if (!reviewedLogItem) {
      showToast("先に「この日の記録を見る」で対象を読み込んでください");
      return;
    }
    enterEditMode(reviewedLogItem, reviewDate.value);
  });
}

if (doctorFollowupInput) {
  doctorFollowupInput.addEventListener("input", () => {
    renderDoctorFollowupResult(null);
    setDoctorFollowupStatus(doctorFollowupInput.value.trim() ? "入力を更新しました。もう一度整理できます" : "未整理");
    saveDoctorFollowupState({ inputText: doctorFollowupInput.value, result: null });
  });
}

if (doctorFollowupBtn) {
  doctorFollowupBtn.addEventListener("click", () => {
    const text = String(doctorFollowupInput?.value || "").trim();
    if (!text) {
      setDoctorFollowupStatus("先生の説明やメモを入力してください");
      showToast("説明文を入れてから整理してください");
      return;
    }
    const result = buildDoctorFollowupSummary(text);
    renderDoctorFollowupResult(result);
    setDoctorFollowupStatus("整理しました");
    saveDoctorFollowupState({ inputText: text, result });
    show({ followup_summary: result });
    showToast("診察後の説明を整理しました");
  });
}

if (doctorFollowupUseNoteBtn) {
  doctorFollowupUseNoteBtn.addEventListener("click", () => {
    const latest = latestDoctorNotes[0];
    if (!latest?.note) {
      setDoctorFollowupStatus("使える医師コメントがまだありません");
      showToast("先に医師コメントを読み込むか入力してください");
      return;
    }
    fillDoctorFollowupInput(latest.note, "最新の医師コメントを入力しました");
    showToast("最新の医師コメントを入れました");
  });
}

if (doctorFollowupSampleBtn) {
  doctorFollowupSampleBtn.addEventListener("click", () => {
    fillDoctorFollowupInput(doctorFollowupSampleText(), "サンプル文を入力しました");
    showToast("サンプル文を入れました");
  });
}

initDatetimeDefault();
ensureLocalUserId();
setPatientAuthUi();
loadDoctorFollowupState();
loadSettings();
updateVoiceRouteText();
syncConsentUiLock();
setRecordEntryExpanded(false);
initConsultChat();
refreshOverview().catch(() => {});
loadProfile().catch(() => {});
loadPatientAuthState().catch((error) => {
  reportError("ログイン状態確認エラー", error, patientAuthStatus || null);
});
loadLatestConsent().catch((error) => {
  reportError("同意状態確認エラー", error, consentStatus || null);
});

calendarBtn.addEventListener("click", async () => {
  try {
    await refreshCalendar();
    show({ message: "カレンダーを更新しました。" });
  } catch (error) {
    reportError("カレンダー更新エラー", error);
  }
});

if (calendarGrid) {
  calendarGrid.addEventListener("click", async (event) => {
    const cell = event.target instanceof Element ? event.target.closest(".calendar-cell.is-clickable[data-date]") : null;
    if (!cell) return;
    try {
      await openCalendarDateForEdit(String(cell.getAttribute("data-date") || ""));
    } catch (error) {
      reportError("カレンダー編集読込エラー", error);
    }
  });

  calendarGrid.addEventListener("keydown", async (event) => {
    if (!(event.target instanceof Element)) return;
    const cell = event.target.closest(".calendar-cell.is-clickable[data-date]");
    if (!cell) return;
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    try {
      await openCalendarDateForEdit(String(cell.getAttribute("data-date") || ""));
    } catch (error) {
      reportError("カレンダー編集読込エラー", error);
    }
  });
}

if (ensureRecognition()) {
  voiceBtn.addEventListener("click", () => {
    if (!recognition) return;
    if (isListening) {
      recognition.stop();
      return;
    }
    recognition.start();
  });
} else if (voiceEngine === "recorder") {
  voiceBtn.addEventListener("click", async () => {
    try {
      if (isListening) {
        stopRecorderFallback();
        return;
      }
      await startRecorderFallback();
    } catch (error) {
      setSafeText(voiceStatus, `録音開始に失敗しました: ${String(error.message || error)}`);
    }
  });
} else {
  voiceBtn.addEventListener("click", async () => {
    const enabledNow = ensureRecognition();
    if (enabledNow && recognition) {
      try {
        if (isListening) {
          recognition.stop();
        } else {
          recognition.start();
        }
      } catch (error) {
        setSafeText(voiceStatus, `音声入力を開始できませんでした: ${String(error?.message || error)}`);
      }
      return;
    }

    if (voiceEngine === "recorder") {
      try {
        if (isListening) {
          stopRecorderFallback();
        } else {
          await startRecorderFallback();
        }
      } catch (error) {
        setSafeText(voiceStatus, `録音開始に失敗しました: ${String(error?.message || error)}`);
      }
      return;
    }

    const secureNeeded = !window.isSecureContext && !isLocalhostHostName(location.hostname);
    if (secureNeeded) {
      setSafeText(voiceStatus, "Chromeの音声入力は https または localhost でのみ利用できます。");
      return;
    }
    setSafeText(voiceStatus, "この端末のChromeではWeb音声APIが無効です。");
  });
}

if (voiceFileBtn && voiceFileInput) {
  voiceFileBtn.addEventListener("click", async () => {
    await ensureVoiceTranscribeStatus();
    if (voiceTranscribeEnabled) {
      setSafeText(voiceStatus, "録音済みファイルを選択してください。");
      voiceFileInput.click();
      return;
    }

    if (voiceEngine === "speech-recognition" && recognition) {
      try {
        if (isListening) {
          recognition.stop();
          return;
        }
        setSafeText(voiceStatus, "ファイル文字起こし未設定のため、「その場で話す」に切り替えます。");
        recognition.start();
      } catch (error) {
        setSafeText(voiceStatus, `音声入力を開始できませんでした: ${String(error?.message || error)}`);
      }
      return;
    }

    setSafeText(voiceStatus, "ファイル文字起こし未設定です。OPENAI_API_KEY設定後にお試しください。");
  });

  voiceFileInput.addEventListener("change", async () => {
    const file = voiceFileInput.files && voiceFileInput.files[0];
    if (!file) return;
    if (!String(file.type || "").startsWith("audio/")) {
      setSafeText(voiceStatus, "音声ファイルを選択してください。");
      voiceFileInput.value = "";
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setSafeText(voiceStatus, "音声ファイルは10MB以下にしてください。");
      voiceFileInput.value = "";
      return;
    }
    setSafeText(voiceStatus, "録音ファイルを文字起こし中...");
    try {
      const text = await transcribeBlob(file);
      if (!text) {
        setSafeText(voiceStatus, "文字起こし結果が空でした。");
      } else {
        await applyVoiceText(text);
        renderVoiceAlternatives([text]);
      }
    } catch (error) {
      const msg = extractErrorMessage(error);
      setSafeText(voiceStatus, `ファイルから入力エラー: ${msg}`);
      show({ error: String(error.message || error) });
    } finally {
      voiceFileInput.value = "";
    }
  });
}

if (!speechSynthesisSupported) {
  speakBtn.disabled = true;
  stopSpeakBtn.disabled = true;
}

if (consultChatForm) {
  consultChatForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    await submitConsultChatMessage(consultChatInput?.value || "");
  });
}

if (recordEntryToggleBtn) {
  recordEntryToggleBtn.addEventListener("click", () => {
    const expanded = recordEntryToggleBtn.getAttribute("aria-expanded") === "true";
    setRecordEntryExpanded(!expanded);
  });
}

if (consultChatInput) {
  consultChatInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      consultChatForm?.requestSubmit();
    }
  });
}

for (const btn of consultChatExampleBtns) {
  btn.addEventListener("click", async () => {
    const example = String(btn.dataset.chatExample || btn.textContent || "").trim();
    await submitConsultChatMessage(example);
  });
}

speakBtn.addEventListener("click", () => speakText(aiMessage.textContent));
stopSpeakBtn.addEventListener("click", () => {
  if (!speechSynthesisSupported) return;
  window.speechSynthesis.cancel();
});

resetBtn.addEventListener("click", () => {
  resetFormInputs();
});

if (logImageInput) {
  logImageInput.addEventListener("change", async () => {
    const file = logImageInput.files && logImageInput.files[0];
    imageClearRequested = false;
    if (!file) {
      setImageUiState({ dataUrl: "", name: "", status: "未添付" });
      return;
    }
    if (!String(file.type || "").startsWith("image/")) {
      setImageUiState({ dataUrl: "", name: "", status: "画像ファイルを選択してください" });
      logImageInput.value = "";
      return;
    }
    if (file.type && !supportedImageMimeTypes.has(String(file.type).toLowerCase())) {
      setImageUiState({ dataUrl: "", name: "", status: "画像形式は JPEG / PNG / WebP / GIF のみ対応しています" });
      logImageInput.value = "";
      return;
    }
    if (file.size > maxImageBytes) {
      setImageUiState({ dataUrl: "", name: "", status: "画像サイズは3MB以下にしてください" });
      logImageInput.value = "";
      return;
    }
    try {
      const dataUrl = await readFileAsDataUrl(file);
      setImageUiState({
        dataUrl,
        name: file.name || "",
        status: `添付中: ${file.name || "image"} (${Math.round(file.size / 1024)}KB)`
      });
    } catch (error) {
      setImageUiState({ dataUrl: "", name: "", status: `画像読込エラー: ${extractErrorMessage(error)}` });
      logImageInput.value = "";
    }
  });
}

if (logImageClearBtn) {
  logImageClearBtn.addEventListener("click", () => {
    if (editingLogId) {
      imageClearRequested = true;
      selectedImageDataUrl = "";
      selectedImageName = "";
      if (logImagePreview) {
        logImagePreview.removeAttribute("src");
        logImagePreview.classList.add("hidden");
      }
      if (logImageStatus) {
        logImageStatus.textContent = "画像を削除予定（更新時に反映）";
      }
      showToast("画像を削除予定にしました");
      return;
    }
    if (logImageInput) logImageInput.value = "";
    setImageUiState({ dataUrl: "", name: "", status: "未添付" });
    showToast("画像添付を外しました");
  });
}

voiceMode.addEventListener("change", () => {
  saveSettings();
  updateVoiceRouteText();
});
autoSpeak.addEventListener("change", saveSettings);

if (shareConfirmCancelBtn) {
  shareConfirmCancelBtn.addEventListener("click", () => {
    setShareConfirmVisible(false);
    showToast("共有リンク発行をキャンセルしました");
  });
}

if (shareConfirmSubmitBtn) {
  shareConfirmSubmitBtn.addEventListener("click", async () => {
    await runCreateShareLinkFlow();
  });
}

refreshBtn.addEventListener("click", async () => {
  refreshBtn.disabled = true;
  const before = refreshBtn.textContent;
  refreshBtn.textContent = "更新中...";
  try {
    await refreshOverview();
    show({ message: "最新状態に更新しました。" });
    showToast("最新状態に更新しました");
  } catch (error) {
    reportError("最新状態更新エラー", error);
  } finally {
    refreshBtn.disabled = false;
    refreshBtn.textContent = before;
  }
});

profileForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!(await ensureConsentForWrite("プロフィール保存"))) {
    return;
  }
  saveProfileBtn.disabled = true;
  const before = saveProfileBtn.textContent;
  saveProfileBtn.textContent = "保存中...";
  try {
    const data = await saveProfile();
    show({ message: "プロフィールを保存しました。", profile: data.profile });
    showToast("プロフィールを保存しました");
  } catch (error) {
    profileStatus.textContent = "保存失敗";
    reportError("プロフィール保存エラー", error, profileStatus);
  } finally {
    saveProfileBtn.disabled = false;
    saveProfileBtn.textContent = before;
  }
});

tabRecordBtn.addEventListener("click", () => switchPage("record"));
tabMypageBtn.addEventListener("click", async () => {
  switchPage("mypage");
  chartStatus.textContent = "グラフ読み込み中...";
  try {
    await loadProfile();
    await loadShareLinks();
    await loadDoctorNotes();
    await refreshCalendar();
    await new Promise((resolve) => requestAnimationFrame(resolve));
    await refreshChartBySelection();
    setTimeout(() => {
      refreshChartBySelection().catch((error) => {
        chartStatus.textContent = `グラフ更新エラー: ${extractErrorMessage(error)}`;
      });
    }, 220);
  } catch (error) {
    chartStatus.textContent = `グラフ更新エラー: ${extractErrorMessage(error)}`;
  }
});

copyShareBtn.addEventListener("click", async () => {
  copyShareBtn.disabled = true;
  const before = copyShareBtn.textContent;
  copyShareBtn.textContent = "コピー中...";
  try {
    await copyShareText();
    show({ message: "共有メモをコピーしました。" });
    showToast("共有メモをコピーしました");
  } catch (error) {
    copyStatus.textContent = "コピー失敗";
    reportError("共有メモコピーエラー", error, copyStatus);
  } finally {
    copyShareBtn.disabled = false;
    copyShareBtn.textContent = before;
  }
});

if (patientRegisterBtn) {
  patientRegisterBtn.addEventListener("click", async () => {
    patientRegisterBtn.disabled = true;
    const before = patientRegisterBtn.textContent;
    patientRegisterBtn.textContent = "登録中...";
    try {
      await registerPatientAccount();
      if (patientPasswordInput) patientPasswordInput.value = "";
      showToast("今のデータを引き継いで新規登録しました");
    } catch (error) {
      reportError("新規登録エラー", error, patientAuthStatus);
    } finally {
      patientRegisterBtn.disabled = false;
      patientRegisterBtn.textContent = before;
    }
  });
}

if (patientLoginBtn) {
  patientLoginBtn.addEventListener("click", async () => {
    patientLoginBtn.disabled = true;
    const before = patientLoginBtn.textContent;
    patientLoginBtn.textContent = "ログイン中...";
    try {
      await loginPatientAccount();
      if (patientPasswordInput) patientPasswordInput.value = "";
      showToast("ログインしました");
    } catch (error) {
      reportError("ログインエラー", error, patientAuthStatus);
    } finally {
      patientLoginBtn.disabled = false;
      patientLoginBtn.textContent = before;
    }
  });
}

if (patientLogoutBtn) {
  patientLogoutBtn.addEventListener("click", async () => {
    patientLogoutBtn.disabled = true;
    const before = patientLogoutBtn.textContent;
    patientLogoutBtn.textContent = "ログアウト中...";
    try {
      await logoutPatientAccount();
      showToast("ログアウトしました");
    } catch (error) {
      reportError("ログアウトエラー", error, patientAuthStatus);
    } finally {
      patientLogoutBtn.disabled = false;
      patientLogoutBtn.textContent = before;
    }
  });
}

if (feedbackSubmitBtn) {
  feedbackSubmitBtn.addEventListener("click", async () => {
    feedbackSubmitBtn.disabled = true;
    const before = feedbackSubmitBtn.textContent;
    feedbackSubmitBtn.textContent = "送信中...";
    try {
      await submitFeedback();
      showToast("感想を送信しました");
    } catch (error) {
      reportError("感想送信エラー", error, feedbackStatus);
    } finally {
      feedbackSubmitBtn.disabled = false;
      feedbackSubmitBtn.textContent = before;
    }
  });
}

if (copyUserIdBtn) {
  copyUserIdBtn.addEventListener("click", async () => {
    copyUserIdBtn.disabled = true;
    const before = copyUserIdBtn.textContent;
    copyUserIdBtn.textContent = "コピー中...";
    try {
      await copyTextToClipboard(String(userIdBackupInput?.value || getUserId()).trim(), userIdBackupStatus);
      showToast("利用者IDをコピーしました");
    } catch (error) {
      reportError("利用者IDコピーエラー", error, userIdBackupStatus);
    } finally {
      copyUserIdBtn.disabled = false;
      copyUserIdBtn.textContent = before;
    }
  });
}

if (restoreUserIdBtn) {
  restoreUserIdBtn.addEventListener("click", async () => {
    restoreUserIdBtn.disabled = true;
    const before = restoreUserIdBtn.textContent;
    restoreUserIdBtn.textContent = "復元中...";
    try {
      const restored = await restoreUserIdFromInput();
      if (restored) showToast("この利用者IDでデータを復元しました");
    } catch (error) {
      reportError("利用者ID復元エラー", error, userIdBackupStatus);
    } finally {
      restoreUserIdBtn.disabled = false;
      restoreUserIdBtn.textContent = before;
    }
  });
}

if (consultChatShareBtn) {
  consultChatShareBtn.addEventListener("click", async () => {
    consultChatShareBtn.disabled = true;
    const before = consultChatShareBtn.textContent;
    consultChatShareBtn.textContent = "作成中...";
    try {
      const copied = await copyConsultChatShareText();
      if (copied) showToast("チャット共有メモをコピーしました");
    } catch (error) {
      reportError("チャット共有メモ作成エラー", error, consultChatStatus);
    } finally {
      consultChatShareBtn.disabled = false;
      consultChatShareBtn.textContent = before;
    }
  });
}

if (consultChatMatchBtn) {
  consultChatMatchBtn.addEventListener("click", async () => {
    consultChatMatchBtn.disabled = true;
    const before = consultChatMatchBtn.textContent;
    consultChatMatchBtn.textContent = "表示中...";
    try {
      const shown = await showConsultChatMatches();
      if (shown) showToast("相談先候補を更新しました");
    } catch (error) {
      reportError("相談先候補表示エラー", error, consultChatStatus);
    } finally {
      consultChatMatchBtn.disabled = false;
      consultChatMatchBtn.textContent = before;
    }
  });
}

profileForm.addEventListener("input", () => {
  const profile = {
    display_name: profileForm.querySelector("[name=display_name]").value,
    height_cm: profileForm.querySelector("[name=height_cm]").value,
    weight_kg: profileForm.querySelector("[name=weight_kg]").value,
    birth_date: profileForm.querySelector("[name=birth_date]").value,
    sex: profileForm.querySelector("[name=sex]").value,
    chronic_conditions: profileForm.querySelector("[name=chronic_conditions]").value
  };
  updateProfileDerived(profile);
});

if (resetProfileBtn) {
  resetProfileBtn.addEventListener("click", async () => {
    if (!(await ensureConsentForWrite("プロフィール初期化"))) {
      return;
    }
    const before = resetProfileBtn.textContent;
    resetProfileBtn.disabled = true;
    resetProfileBtn.textContent = "リセット中...";
    try {
      clearProfileFormInputs();
      await saveProfile();
      profileStatus.textContent = "未保存";
      showToast("プロフィールを初期表示に戻しました");
      show({ message: "プロフィールを初期表示に戻しました" });
    } catch (error) {
      reportError("プロフィール初期化エラー", error, profileStatus);
    } finally {
      resetProfileBtn.disabled = false;
      resetProfileBtn.textContent = before;
    }
  });
}

exportUserBtn.addEventListener("click", async () => {
  exportUserBtn.disabled = true;
  const before = exportUserBtn.textContent;
  exportUserBtn.textContent = "生成中...";
  try {
    await exportUserData();
    exportStatus.textContent = "保存しました";
    show({ message: "データJSONを保存しました。" });
    showToast("データJSONを保存しました");
  } catch (error) {
    exportStatus.textContent = "失敗";
    reportError("データ保存エラー", error, exportStatus);
  } finally {
    exportUserBtn.disabled = false;
    exportUserBtn.textContent = before;
  }
});

if (exportDoctorSummaryBtn) {
  exportDoctorSummaryBtn.addEventListener("click", async () => {
    exportDoctorSummaryBtn.disabled = true;
    const before = exportDoctorSummaryBtn.textContent;
    exportDoctorSummaryBtn.textContent = "生成中...";
    try {
      await exportDoctorSummary();
      if (shareStatus) shareStatus.textContent = "医師向けサマリーを保存しました";
      showToast("医師向けサマリーを保存しました");
    } catch (error) {
      if (shareStatus) shareStatus.textContent = `失敗: ${extractErrorMessage(error)}`;
      reportError("医師サマリー保存エラー", error, shareStatus);
    } finally {
      exportDoctorSummaryBtn.disabled = false;
      exportDoctorSummaryBtn.textContent = before;
    }
  });
}

if (createShareLinkBtn) {
  createShareLinkBtn.addEventListener("click", async () => {
    if (!(await ensureConsentForWrite("共有リンク発行"))) return;
    setShareConfirmVisible(true);
    if (shareConfirmStatus) shareConfirmStatus.textContent = "共有範囲を確認してください";
  });
}

if (revokeAllShareBtn) {
  revokeAllShareBtn.addEventListener("click", async () => {
    const ok = window.confirm("現在発行済みの共有リンクを全て失効します。続けますか？");
    if (!ok) return;
    const before = revokeAllShareBtn.textContent;
    revokeAllShareBtn.disabled = true;
    revokeAllShareBtn.textContent = "失効中...";
    if (cleanupStatus) cleanupStatus.textContent = "共有リンクを失効しています...";
    try {
      const result = await revokeAllShareLinks();
      const msg = `失効完了: 未失効${result.non_revoked ?? result.active ?? 0}件（active:${result.active ?? 0} / expired:${result.expired ?? 0}） / 失効${result.revoked}件 / 失敗${result.failed}件`;
      if (cleanupStatus) cleanupStatus.textContent = msg;
      showToast(msg);
      show({ message: msg, result });
    } catch (error) {
      if (cleanupStatus) cleanupStatus.textContent = `失効失敗: ${extractErrorMessage(error)}`;
      reportError("共有リンク全失効エラー", error, cleanupStatus || null);
    } finally {
      revokeAllShareBtn.disabled = false;
      revokeAllShareBtn.textContent = before;
    }
  });
}

if (seedDemoCleanBtn) {
  seedDemoCleanBtn.addEventListener("click", async () => {
    const ok = window.confirm(
      "現在の記録・プロフィール・共有リンク等を削除し、デモ12日分へ置き換えます。実データは戻せません。続けますか？"
    );
    if (!ok) return;
    const before = seedDemoCleanBtn.textContent;
    seedDemoCleanBtn.disabled = true;
    seedDemoCleanBtn.textContent = "処理中...";
    if (cleanupStatus) cleanupStatus.textContent = "実データ削除とデモ再投入を実行中...";
    try {
      const data = await seedDemoLogs(12);
      await refreshOverview().catch(() => {});
      await refreshInsights().catch(() => {});
      await loadProfile().catch(() => {});
      if (!mypagePage.classList.contains("hidden")) {
        await refreshChartBySelection().catch(() => {});
      }
      const msg = `デモ化完了: ${data.logs_count || 0}件を投入しました`;
      if (cleanupStatus) cleanupStatus.textContent = msg;
      showToast(msg);
      show({ message: msg, seeded: data });
    } catch (error) {
      if (cleanupStatus) cleanupStatus.textContent = `デモ化失敗: ${extractErrorMessage(error)}`;
      reportError("デモ化リセットエラー", error, cleanupStatus || null);
    } finally {
      seedDemoCleanBtn.disabled = false;
      seedDemoCleanBtn.textContent = before;
    }
  });
}

if (copyNoteDisclaimerBtn) {
  copyNoteDisclaimerBtn.addEventListener("click", async () => {
    const text = String(noteDisclaimerText?.value || "").trim();
    if (!text) {
      if (noteDisclaimerStatus) noteDisclaimerStatus.textContent = "コピー対象テキストが空です";
      return;
    }
    const before = copyNoteDisclaimerBtn.textContent;
    copyNoteDisclaimerBtn.disabled = true;
    copyNoteDisclaimerBtn.textContent = "コピー中...";
    try {
      await copyText(text);
      if (noteDisclaimerStatus) noteDisclaimerStatus.textContent = "コピーしました";
      showToast("note注意文をコピーしました");
    } catch (error) {
      if (noteDisclaimerStatus) noteDisclaimerStatus.textContent = `コピー失敗: ${extractErrorMessage(error)}`;
      reportError("note注意文コピーエラー", error, noteDisclaimerStatus || null);
    } finally {
      copyNoteDisclaimerBtn.disabled = false;
      copyNoteDisclaimerBtn.textContent = before;
    }
  });
}

chartRefreshBtn.addEventListener("click", async () => {
  chartRefreshBtn.disabled = true;
  const before = chartRefreshBtn.textContent;
  chartRefreshBtn.textContent = "更新中...";
  try {
    await refreshChartBySelection();
    showToast("グラフを更新しました");
  } catch (error) {
    chartStatus.textContent = `グラフ更新エラー: ${extractErrorMessage(error)}`;
    reportError("グラフ更新エラー", error, chartStatus);
  } finally {
    chartRefreshBtn.disabled = false;
    chartRefreshBtn.textContent = before;
  }
});

chartRange.addEventListener("change", () => {
  if (!mypagePage.classList.contains("hidden")) {
    refreshChartBySelection().catch((error) => {
      chartStatus.textContent = `グラフ更新エラー: ${extractErrorMessage(error)}`;
    });
  }
});

window.addEventListener("resize", () => {
  if (mypagePage.classList.contains("hidden")) return;
  refreshChartBySelection().catch(() => {});
});

if (consentAgreeBtn) {
  consentAgreeBtn.addEventListener("click", async () => {
    if (!consentCheck?.checked) {
      if (consentStatus) consentStatus.textContent = "同意チェックを入れてから進んでください。";
      return;
    }
    const before = consentAgreeBtn.textContent;
    consentAgreeBtn.disabled = true;
    consentAgreeBtn.textContent = "保存中...";
    try {
      await saveConsentAgreement();
      setConsentModalVisible(false);
      switchPage("record");
      if (consentCheck) consentCheck.checked = false;
      showToast("同意を登録しました");
      await refreshOverview().catch(() => {});
      await loadProfile().catch(() => {});
    } catch (error) {
      reportError("同意保存エラー", error, consentStatus || null);
    } finally {
      consentAgreeBtn.disabled = false;
      consentAgreeBtn.textContent = before;
    }
  });
}

if (consentReloadBtn) {
  consentReloadBtn.addEventListener("click", async () => {
    const before = consentReloadBtn.textContent;
    consentReloadBtn.disabled = true;
    consentReloadBtn.textContent = "確認中...";
    try {
      await loadLatestConsent();
      if (consentGranted) {
        setConsentModalVisible(false);
      }
    } catch (error) {
      reportError("同意状態確認エラー", error, consentStatus || null);
    } finally {
      consentReloadBtn.disabled = false;
      consentReloadBtn.textContent = before;
    }
  });
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  });
}
