/* =============================================
   BirthdayBliss — Main Application Logic
   ============================================= */

'use strict';

// ── App State ──────────────────────────────────
const state = {
  currentStep: 1,
  totalSteps: 5,
  milestone: '',
  relationship: '',
  mood: 'romantic',
  selectedColor: 'pink',
  signoff: '',
  selectedQualities: [],
  uploadedPhotos: [],
  isPlaying: false,
  previewTimer: null,
  previewProgress: 0,
  shareUrl: '',
};

const STEPS_META = [
  { label: 'Details', icon: '🎂' },
  { label: 'Photos',  icon: '📸' },
  { label: 'Message', icon: '💌' },
  { label: 'Note',    icon: '📝' },
  { label: 'Preview', icon: '🎬' },
];

const QUALITIES = [
  '✨ Kind', '💡 Smart', '🎨 Creative', '🌟 Funny',
  '💪 Strong', '🌸 Sweet', '🎯 Determined', '💕 Caring',
  '🦋 Free-spirited', '🌈 Joyful', '🎵 Talented', '🔥 Passionate',
];

const COLOR_MAP = {
  pink:   { from: '#FF6B9D', to: '#F43F7A', accent: '#FFE4F0' },
  purple: { from: '#A855F7', to: '#7C3AED', accent: '#F3E8FF' },
  gold:   { from: '#F59E0B', to: '#D97706', accent: '#FEF3C7' },
  red:    { from: '#EF4444', to: '#DC2626', accent: '#FFE4E6' },
  teal:   { from: '#14B8A6', to: '#0D9488', accent: '#CCFBF1' },
  blue:   { from: '#3B82F6', to: '#2563EB', accent: '#DBEAFE' },
};

// ── Init ───────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  buildProgressSteps();
  buildQualitiesGrid();
  setupTextareaCounters();
  // load assets
  const heroImg = document.querySelector('.hero-img');
  if (heroImg) heroImg.onerror = () => heroImg.style.display = 'none';
  // add video.css
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'video.css';
  document.head.appendChild(link);
});

// ── Particles Background ────────────────────────
function initParticles() {
  const bg = document.getElementById('particlesBg');
  if (!bg) return;
  const emojis = ['🎈', '💕', '❤️', '🌸', '✨', '🎉', '💫', '🎊', '🌷', '⭐', '💖', '🎀'];
  for (let i = 0; i < 20; i++) {
    const el = document.createElement('div');
    el.className = 'particle';
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    el.style.left = `${Math.random() * 100}%`;
    el.style.animationDuration = `${8 + Math.random() * 12}s`;
    el.style.animationDelay = `${Math.random() * 10}s`;
    el.style.fontSize = `${0.8 + Math.random() * 1.2}rem`;
    bg.appendChild(el);
  }
}

// ── Progress Steps Builder ─────────────────────
function buildProgressSteps() {
  const container = document.getElementById('progressSteps');
  if (!container) return;
  container.innerHTML = STEPS_META.map((s, i) => `
    <div class="p-step ${i === 0 ? 'active' : ''}" id="pStep${i+1}">
      <div class="p-step-dot">${i === 0 ? s.icon : i + 1}</div>
      <span class="p-step-label">${s.label}</span>
    </div>
  `).join('');
}

function updateProgress(step) {
  const fill = document.getElementById('progressFill');
  if (fill) fill.style.width = `${((step - 1) / (state.totalSteps - 1)) * 100}%`;

  const counter = document.getElementById('stepCounter');
  if (counter) counter.textContent = `Step ${step} of ${state.totalSteps}`;

  STEPS_META.forEach((_, i) => {
    const el = document.getElementById(`pStep${i + 1}`);
    if (!el) return;
    el.classList.remove('active', 'done');
    if (i + 1 === step) {
      el.classList.add('active');
      el.querySelector('.p-step-dot').textContent = STEPS_META[i].icon;
    } else if (i + 1 < step) {
      el.classList.add('done');
      el.querySelector('.p-step-dot').textContent = '✓';
    } else {
      el.querySelector('.p-step-dot').textContent = i + 1;
    }
  });
}

// ── Qualities Grid ─────────────────────────────
function buildQualitiesGrid() {
  const grid = document.getElementById('qualitiesGrid');
  if (!grid) return;
  grid.innerHTML = QUALITIES.map(q => `
    <div class="quality-tag" onclick="toggleQuality(this, '${q}')">
      ${q}
    </div>
  `).join('');
}

function toggleQuality(el, val) {
  el.classList.toggle('selected');
  if (el.classList.contains('selected')) {
    if (!state.selectedQualities.includes(val)) state.selectedQualities.push(val);
  } else {
    state.selectedQualities = state.selectedQualities.filter(q => q !== val);
  }
}

function addCustomQuality(e) {
  if (e.key !== 'Enter') return;
  const input = document.getElementById('customQuality');
  const val = input.value.trim();
  if (!val) return;
  const grid = document.getElementById('qualitiesGrid');
  const tag = document.createElement('div');
  tag.className = 'quality-tag selected';
  tag.onclick = () => { tag.remove(); state.selectedQualities = state.selectedQualities.filter(q => q !== `✏️ ${val}`); };
  tag.textContent = `✏️ ${val}`;
  grid.appendChild(tag);
  state.selectedQualities.push(`✏️ ${val}`);
  input.value = '';
}

// ── Textarea Counters ─────────────────────────
function setupTextareaCounters() {
  const pairs = [
    ['birthdayMessage', 'msgCount'],
    ['favoriteMemory', 'memCount'],
    ['finalNote', 'noteCount'],
  ];
  pairs.forEach(([ta, cnt]) => {
    const el = document.getElementById(ta);
    const c = document.getElementById(cnt);
    if (el && c) {
      el.addEventListener('input', () => { c.textContent = el.value.length; });
    }
  });
}

// ── Navigation ────────────────────────────────
function showLanding() {
  showPage('landingPage');
}

function startCreating() {
  showPage('creatorPage');
  state.currentStep = 1;
  showStep(1);
  updateProgress(1);
}

function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const pg = document.getElementById(id);
  if (pg) pg.classList.add('active');
}

function showStep(step) {
  document.querySelectorAll('.step-panel').forEach(p => p.classList.remove('active'));
  const panel = document.getElementById(`step${step}`);
  if (panel) panel.classList.add('active');
  updateProgress(step);
  state.currentStep = step;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function nextStep(from) {
  if (!validateStep(from)) return;
  if (from === 4) {
    buildPreview();
    showStep(5);
    startPreviewAnimation();
  } else {
    showStep(from + 1);
  }
}

function prevStep(from) {
  showStep(from - 1);
}

// ── Validation ────────────────────────────────
function validateStep(step) {
  if (step === 1) {
    const name = document.getElementById('birthdayPersonName').value.trim();
    const sender = document.getElementById('senderName').value.trim();
    const date = document.getElementById('birthdayDate').value;
    if (!name) { toast('Please enter the birthday person\'s name 🎂'); shake('birthdayPersonName'); return false; }
    if (!sender) { toast('Please enter your name 💕'); shake('senderName'); return false; }
    if (!date) { toast('Please select the birthday date 📅'); shake('birthdayDate'); return false; }
  }
  if (step === 3) {
    const msg = document.getElementById('birthdayMessage').value.trim();
    if (!msg) { toast('Please write a birthday message 💌'); shake('birthdayMessage'); return false; }
  }
  if (step === 4) {
    const note = document.getElementById('finalNote').value.trim();
    if (!note) { toast('Please write a final note 📝'); shake('finalNote'); return false; }
  }
  return true;
}

function shake(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.style.animation = 'none';
  el.offsetHeight; // reflow
  el.style.animation = 'shakeField 0.4s ease';
  setTimeout(() => el.style.animation = '', 500);
}

// ── Form Field Handlers ───────────────────────
function selectMilestone(el, val) {
  document.querySelectorAll('.milestone-btn').forEach(b => b.classList.remove('selected'));
  el.classList.add('selected');
  state.milestone = val;
  const custom = document.getElementById('customMilestone');
  if (val === '' && el.classList.contains('custom-milestone')) {
    custom.classList.remove('hidden');
  } else {
    custom.classList.add('hidden');
  }
}

function toggleCustomMilestone() {
  const custom = document.getElementById('customMilestone');
  custom.classList.toggle('hidden');
  if (!custom.classList.contains('hidden')) custom.focus();
}

function selectRel(el, val) {
  document.querySelectorAll('.rel-btn').forEach(b => b.classList.remove('selected'));
  el.classList.add('selected');
  state.relationship = val;
}

function selectMood(el, mood) {
  document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  state.mood = mood;
}

function selectColor(el, color) {
  document.querySelectorAll('.color-opt').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  state.selectedColor = color;
}

function selectSignoff(el, text) {
  document.querySelectorAll('.signoff-btn').forEach(b => b.classList.remove('selected'));
  el.classList.add('selected');
  state.signoff = text;
  document.getElementById('signoffText').value = text;
}

// ── Photo Upload ──────────────────────────────
function handleDragOver(e) {
  e.preventDefault();
  document.getElementById('photoDropZone').classList.add('drag-over');
}
function handleDragLeave(e) {
  document.getElementById('photoDropZone').classList.remove('drag-over');
}
function handleDrop(e) {
  e.preventDefault();
  document.getElementById('photoDropZone').classList.remove('drag-over');
  const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
  addPhotos(files);
}
function handlePhotoInput(e) {
  const files = Array.from(e.target.files);
  addPhotos(files);
}

function addPhotos(files) {
  const remaining = 6 - state.uploadedPhotos.length;
  if (remaining <= 0) { toast('Maximum 6 photos allowed 📸'); return; }
  files.slice(0, remaining).forEach(file => {
    if (file.size > 5 * 1024 * 1024) { toast(`${file.name} is too large (max 5MB)`); return; }
    const reader = new FileReader();
    reader.onload = (ev) => {
      state.uploadedPhotos.push({ url: ev.target.result, name: file.name });
      renderPhotos();
    };
    reader.readAsDataURL(file);
  });
}

function renderPhotos() {
  const grid = document.getElementById('photoGrid');
  if (!grid) return;
  grid.innerHTML = state.uploadedPhotos.map((p, i) => `
    <div class="photo-item">
      <img src="${p.url}" alt="Photo ${i+1}" />
      <div class="photo-num">${i+1}</div>
      <button class="photo-remove" onclick="removePhoto(${i})">✕</button>
      <div class="photo-caption">Memory #${i+1}</div>
    </div>
  `).join('');
}

function removePhoto(idx) {
  state.uploadedPhotos.splice(idx, 1);
  renderPhotos();
}

// ── Preview Builder ────────────────────────────
function buildPreview() {
  const name = document.getElementById('birthdayPersonName').value.trim();
  const sender = document.getElementById('senderName').value.trim();
  const date = document.getElementById('birthdayDate').value;
  const msg = document.getElementById('birthdayMessage').value.trim();
  const note = document.getElementById('finalNote').value.trim();
  const memory = document.getElementById('favoriteMemory')?.value.trim() || '';
  const milestone = document.getElementById('customMilestone')?.value.trim() || state.milestone;
  const signoff = document.getElementById('signoffText')?.value.trim() || state.signoff || 'With Love 💕';

  const colors = COLOR_MAP[state.selectedColor] || COLOR_MAP.pink;

  // Build animated scene
  const scene = document.getElementById('previewScene');
  if (scene) {
    scene.innerHTML = buildVideoScene({
      name, sender, date, msg, note, memory,
      milestone, signoff, colors,
      photos: state.uploadedPhotos,
      qualities: state.selectedQualities,
      mood: state.mood,
    });
  }

  // Details below player
  const details = document.getElementById('previewDetails');
  if (details) {
    const formattedDate = date ? new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '—';
    details.innerHTML = `
      <div class="detail-item">
        <h4>🎁 For</h4>
        <p>${name}</p>
      </div>
      <div class="detail-item">
        <h4>💝 From</h4>
        <p>${sender}</p>
      </div>
      <div class="detail-item">
        <h4>📅 Birthday Date</h4>
        <p>${formattedDate}</p>
      </div>
      <div class="detail-item">
        <h4>🎊 Milestone</h4>
        <p>${milestone || 'Celebrating every year!'}</p>
      </div>
      <div class="detail-item">
        <h4>📸 Photos</h4>
        <p>${state.uploadedPhotos.length} photo${state.uploadedPhotos.length !== 1 ? 's' : ''} added</p>
      </div>
      <div class="detail-item">
        <h4>🎨 Theme</h4>
        <p style="color: ${colors.from}; font-weight: 800; text-transform: capitalize">${state.selectedColor}</p>
      </div>
    `;
  }
}

function buildVideoScene({ name, sender, date, msg, note, memory, milestone, signoff, colors, photos, qualities, mood }) {
  // Balloon & heart emojis
  const balloons = ['🎈', '🎈', '💕', '🎈', '❤️', '🎈', '💜', '🎈'];
  const balloonHtml = balloons.map((b, i) => `
    <div class="bv-balloon" style="left:${5 + i*12}%;bottom:${-5}%;animation-duration:${3+i*0.5}s;animation-delay:${i*0.3}s">${b}</div>
  `).join('');

  const heartHtml = Array.from({length: 14}, (_, i) => `
    <div class="bv-heart" style="left:${Math.random()*90+5}%;animation-duration:${4+Math.random()*6}s;animation-delay:${Math.random()*6}s">
      ${['💕','❤️','💗','💖','🌸','✨'][Math.floor(Math.random()*6)]}
    </div>
  `).join('');

  const confettiColors = [colors.from, colors.to, '#FBBF24', '#A855F7', '#10B981', '#3B82F6'];
  const confettiHtml = Array.from({length: 20}, (_, i) => `
    <div class="bv-confetti" style="
      left:${Math.random()*95}%;
      background:${confettiColors[Math.floor(Math.random()*confettiColors.length)]};
      width:${6+Math.random()*8}px;height:${6+Math.random()*8}px;
      border-radius:${Math.random()>0.5?'50%':'2px'};
      animation-duration:${4+Math.random()*5}s;
      animation-delay:${Math.random()*5}s;
    "></div>
  `).join('');

  const starHtml = Array.from({length: 10}, (_, i) => `
    <div class="bv-star" style="left:${Math.random()*90}%;top:${Math.random()*70}%;animation-duration:${1.5+Math.random()*2}s;animation-delay:${Math.random()*3}s">✨</div>
  `).join('');

  const photoHtml = photos.length > 0 ? `
    <div class="bv-photo-collage">
      ${photos.slice(0, 4).map((p, i) => `
        <img class="bv-photo" src="${p.url}" alt="Memory ${i+1}" style="animation-delay:${i*0.2}s" />
      `).join('')}
    </div>
  ` : '';

  const milestoneHtml = milestone ? `
    <div class="bv-milestone-badge">🎊 ${milestone} Birthday 🎊</div>
  ` : '';

  const qualitiesHtml = qualities.length > 0 ? `
    <div class="bv-qualities">
      ${qualities.slice(0, 5).map((q, i) => `
        <span class="bv-quality" style="animation-delay:${i*0.1}s">${q}</span>
      `).join('')}
    </div>
  ` : '';

  const noteSection = note ? `
    <div class="bv-final-note">
      <div class="bv-note-text">"${note.substring(0, 180)}${note.length > 180 ? '...' : ''}"</div>
      <div class="bv-signoff">${signoff}</div>
      <div class="bv-from">— ${sender} 💕</div>
    </div>
  ` : '';

  return `
    <div class="preview-scene-inner" style="background:radial-gradient(ellipse at 30% 40%, rgba(${hexToRgb(colors.from)},0.3) 0%, transparent 60%), radial-gradient(ellipse at 70% 60%, rgba(${hexToRgb(colors.to)},0.2) 0%, transparent 60%), #1A0A1E;">
      <div class="video-bg-hearts">${heartHtml}${confettiHtml}${starHtml}</div>
      ${balloonHtml}
      <div class="bv-content">
        <div class="bv-cake-emoji">🎂</div>
        <span class="bv-to-label">Happy Birthday</span>
        <div class="bv-name" style="color:${colors.accent}">${name}</div>
        ${milestoneHtml}
        ${photoHtml}
        ${qualitiesHtml}
        <p class="bv-message">${msg.substring(0, 200)}${msg.length > 200 ? '...' : ''}</p>
        ${noteSection}
        <div class="bv-sparkle-row">✨ 🎈 💕 🎊 💖 🎈 ✨</div>
      </div>
    </div>
  `;
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? `${parseInt(result[1],16)},${parseInt(result[2],16)},${parseInt(result[3],16)}` : '244,63,122';
}

// ── Preview Animation / Play ──────────────────
let previewPlaying = false;
let previewInterval = null;
let previewSecs = 0;
const PREVIEW_LIMIT = 5; // seconds before lock overlay shows
const TOTAL_DURATION = 30;

function startPreviewAnimation() {
  previewSecs = 0;
  previewPlaying = false;
  const overlay = document.getElementById('previewOverlay');
  // Hide overlay initially so user can see the scene, then show it after a brief look
  if (overlay) overlay.style.display = 'none';
  updatePreviewUI();
  // Auto show the preview for 3s then show lock overlay
  setTimeout(() => {
    if (!previewPlaying) {
      if (overlay) overlay.style.display = 'flex';
    }
  }, 3000);
}

function togglePlay() {
  if (!previewPlaying) {
    // Hide overlay, start playing
    const overlay = document.getElementById('previewOverlay');
    if (overlay) overlay.style.display = 'none';
    previewPlaying = true;
    document.getElementById('playPauseBtn').textContent = '⏸ Pause';
    previewInterval = setInterval(() => {
      previewSecs++;
      updatePreviewUI();
      if (previewSecs >= PREVIEW_LIMIT) {
        // Show lock after 5s
        clearInterval(previewInterval);
        previewPlaying = false;
        document.getElementById('playPauseBtn').textContent = '▶ Play';
        if (overlay) overlay.style.display = 'flex';
      }
    }, 1000);
  } else {
    clearInterval(previewInterval);
    previewPlaying = false;
    document.getElementById('playPauseBtn').textContent = '▶ Play';
  }
}

function updatePreviewUI() {
  const prog = document.getElementById('previewProgress');
  const time = document.getElementById('previewTime');
  if (prog) prog.style.width = `${(previewSecs / TOTAL_DURATION) * 100}%`;
  if (time) time.textContent = `${fmtTime(previewSecs)} / ${fmtTime(TOTAL_DURATION)}`;
}

function fmtTime(s) {
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

// ── Payment Flow ───────────────────────────────
function goToPayment() {
  showPage('paymentPage');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

let activePayment = 'upi';
function selectPayment(el, type) {
  document.querySelectorAll('.pay-opt').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  activePayment = type;
  ['payUPI', 'payCard', 'payNetbanking'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add('hidden');
  });
  const map = { upi: 'payUPI', card: 'payCard', netbanking: 'payNetbanking' };
  const target = document.getElementById(map[type]);
  if (target) target.classList.remove('hidden');
}

function fillUPIApp(app) {
  const el = document.getElementById('upiId');
  const suffixes = { GPay: '@okaxis', PhonePe: '@ybl', Paytm: '@paytm' };
  if (el) el.placeholder = `yourname${suffixes[app] || ''}`;
  el.focus();
}

function formatCard(input) {
  let val = input.value.replace(/\D/g, '').substring(0, 16);
  input.value = val.match(/.{1,4}/g)?.join(' ') || '';
}

function processPayment() {
  // Validation
  if (activePayment === 'upi') {
    const upi = document.getElementById('upiId').value.trim();
    if (!upi || !upi.includes('@')) { toast('Please enter a valid UPI ID (e.g. name@paytm) 💳'); return; }
  }

  const btn = document.getElementById('payBtnText');
  btn.textContent = '⏳ Processing...';

  const modal = document.getElementById('processingModal');
  modal.classList.remove('hidden');

  const messages = [
    'Gathering all the love...',
    'Adding magical touches...',
    'Sprinkling birthday sparkles...',
    'Wrapping it with hearts...',
    'Almost ready! 💕',
  ];

  let progress = 0;
  let msgIdx = 0;
  const fill = document.getElementById('processingFill');
  const text = document.getElementById('processingText');

  const interval = setInterval(() => {
    progress += Math.random() * 25 + 10;
    if (progress > 100) progress = 100;
    if (fill) fill.style.width = `${progress}%`;
    if (text && msgIdx < messages.length) {
      text.textContent = messages[msgIdx++];
    }
    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        modal.classList.add('hidden');
        showSuccessPage();
      }, 600);
    }
  }, 700);
}

// ── Success Page ───────────────────────────────
function showSuccessPage() {
  const name = document.getElementById('birthdayPersonName').value.trim();
  const nameEl = document.getElementById('successName');
  if (nameEl) nameEl.textContent = name;

  // Generate fake-but-realistic share URL
  const code = Math.random().toString(36).substring(2, 10);
  state.shareUrl = `https://birthdaybliss.app/wish/${code}`;
  const urlEl = document.getElementById('shareUrl');
  if (urlEl) urlEl.textContent = state.shareUrl;

  // Mini preview
  const msg = document.getElementById('birthdayMessage').value.trim();
  const sender = document.getElementById('senderName').value.trim();
  const mini = document.getElementById('wishPreviewMini');
  if (mini) {
    mini.innerHTML = `
      <span class="mini-to">🎂 Happy Birthday, ${name}! 🎂</span>
      <p class="mini-msg">"${msg.substring(0, 120)}${msg.length > 120 ? '...' : ''}"</p>
      <div style="margin-top:10px;font-size:0.85rem;color:rgba(255,228,240,0.5);">— ${sender} 💕</div>
    `;
  }

  showPage('successPage');
  launchConfetti();
}

// ── Share Actions ──────────────────────────────
function copyLink() {
  navigator.clipboard.writeText(state.shareUrl).then(() => {
    const btn = document.getElementById('copyBtn');
    if (btn) {
      btn.textContent = '✅ Copied!';
      btn.classList.add('copied');
      setTimeout(() => {
        btn.textContent = '📋 Copy';
        btn.classList.remove('copied');
      }, 2500);
    }
  }).catch(() => {
    // Fallback
    const input = document.createElement('input');
    input.value = state.shareUrl;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
    toast('Link copied! 📋');
  });
}

function shareVia(platform) {
  const name = document.getElementById('birthdayPersonName').value.trim();
  const msg = encodeURIComponent(`🎂 I made a special birthday wish for ${name}! Check it out: ${state.shareUrl}`);
  const urls = {
    whatsapp:  `https://wa.me/?text=${msg}`,
    instagram: `https://www.instagram.com/`,
    email:     `mailto:?subject=Birthday%20Wish%20for%20${encodeURIComponent(name)}&body=${msg}`,
    sms:       `sms:?body=${msg}`,
  };
  if (platform === 'instagram') {
    toast('Copy the link and share on Instagram Stories! 📸');
    return;
  }
  window.open(urls[platform], '_blank');
}

function createAnother() {
  // Reset state
  state.milestone = '';
  state.relationship = '';
  state.mood = 'romantic';
  state.selectedColor = 'pink';
  state.signoff = '';
  state.selectedQualities = [];
  state.uploadedPhotos = [];
  state.isPlaying = false;

  // Clear form fields
  ['birthdayPersonName','senderName','birthdayDate','birthdayMessage','favoriteMemory','finalNote','signoffText','customMilestone','customQuality'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  ['msgCount','memCount','noteCount'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = '0';
  });

  document.querySelectorAll('.milestone-btn, .rel-btn, .signoff-btn').forEach(b => b.classList.remove('selected'));
  document.querySelectorAll('.quality-tag').forEach(b => b.classList.remove('selected'));
  document.querySelectorAll('.mood-btn').forEach((b, i) => {
    b.classList.toggle('active', b.dataset.mood === 'romantic');
  });
  document.querySelectorAll('.color-opt').forEach((b, i) => {
    b.classList.toggle('active', b.dataset.color === 'pink');
  });

  renderPhotos();
  startCreating();
}

// ── Demo ──────────────────────────────────────
function showDemo() {
  // Pre-fill with demo data and go to preview
  document.getElementById('birthdayPersonName').value = 'Priya';
  document.getElementById('senderName').value = 'Rahul';
  document.getElementById('birthdayDate').value = '2024-11-15';
  document.getElementById('birthdayMessage').value = 'Every moment with you feels like a celebration. You light up every room you walk into, and I feel so lucky to have you in my life. You are my sunshine on the cloudiest of days!';
  document.getElementById('finalNote').value = 'No matter where life takes us, know that I\'ll always be here cheering for you. You deserve every happiness that comes your way. Happy Birthday, my love. Here\'s to you and all your beautiful dreams. 🌹';
  document.getElementById('signoffText').value = 'Forever Yours 💕';
  state.milestone = '30th';
  state.mood = 'romantic';
  state.selectedColor = 'pink';
  state.selectedQualities = ['✨ Kind', '💡 Smart', '💕 Caring'];

  showPage('creatorPage');
  buildPreview();
  showStep(5);
  startPreviewAnimation();
}

// ── Confetti ───────────────────────────────────
function launchConfetti() {
  const canvas = document.getElementById('confettiCanvas');
  if (!canvas) return;
  canvas.style.display = 'block';
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const pieces = Array.from({ length: 120 }, () => ({
    x: Math.random() * canvas.width,
    y: -10,
    vx: (Math.random() - 0.5) * 4,
    vy: Math.random() * 4 + 2,
    size: Math.random() * 10 + 4,
    color: ['#FF6B9D','#F43F7A','#FBBF24','#A855F7','#10B981','#3B82F6','#FDE68A'][Math.floor(Math.random()*7)],
    rot: Math.random() * 360,
    rotV: (Math.random() - 0.5) * 10,
    shape: Math.random() > 0.5 ? 'rect' : 'circle',
  }));

  let frame = 0;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach(p => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot * Math.PI / 180);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0, 1 - frame / 180);
      if (p.shape === 'rect') ctx.fillRect(-p.size/2, -p.size/4, p.size, p.size/2);
      else { ctx.beginPath(); ctx.arc(0,0,p.size/2,0,Math.PI*2); ctx.fill(); }
      ctx.restore();
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.1;
      p.rot += p.rotV;
      if (p.y > canvas.height) { p.y = -10; p.x = Math.random() * canvas.width; p.vy = Math.random() * 3 + 1; }
    });
    frame++;
    if (frame < 220) requestAnimationFrame(draw);
    else { ctx.clearRect(0,0,canvas.width,canvas.height); canvas.style.display='none'; }
  }
  draw();
}

// ── Toast Notification ─────────────────────────
function toast(msg) {
  let t = document.getElementById('__toast');
  if (!t) {
    t = document.createElement('div');
    t.id = '__toast';
    t.style.cssText = `
      position:fixed;bottom:28px;left:50%;transform:translateX(-50%) translateY(20px);
      background:linear-gradient(135deg,#FF6B9D,#F43F7A);color:white;
      padding:12px 28px;border-radius:40px;font-family:'Nunito',sans-serif;
      font-size:0.95rem;font-weight:700;z-index:9999;
      box-shadow:0 8px 30px rgba(244,63,122,0.4);
      opacity:0;transition:all 0.3s cubic-bezier(0.34,1.56,0.64,1);
      pointer-events:none;white-space:nowrap;max-width:90vw;
    `;
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.style.opacity = '1';
  t.style.transform = 'translateX(-50%) translateY(0)';
  clearTimeout(t._hide);
  t._hide = setTimeout(() => {
    t.style.opacity = '0';
    t.style.transform = 'translateX(-50%) translateY(20px)';
  }, 3000);
}

// ── Shake Animation CSS (inject) ───────────────
const shakeCSS = document.createElement('style');
shakeCSS.textContent = `
  @keyframes shakeField {
    0%, 100% { transform: translateX(0); }
    15%       { transform: translateX(-8px); }
    30%       { transform: translateX(7px); }
    45%       { transform: translateX(-6px); }
    60%       { transform: translateX(5px); }
    75%       { transform: translateX(-4px); }
    90%       { transform: translateX(3px); }
  }
`;
document.head.appendChild(shakeCSS);

// ── Window Resize ──────────────────────────────
window.addEventListener('resize', () => {
  const canvas = document.getElementById('confettiCanvas');
  if (canvas && canvas.style.display !== 'none') {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
});

console.log('%c🎂 BirthdayBliss Loaded!', 'background: linear-gradient(135deg, #FF6B9D, #F43F7A); color: white; padding: 8px 16px; border-radius: 20px; font-weight: bold; font-size: 14px;');
