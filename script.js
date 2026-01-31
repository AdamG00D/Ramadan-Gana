
const startOverlay = document.getElementById("startOverlay");
const startBtn = document.getElementById("startBtn");
const createNewBtn = document.getElementById("createNewBtn");
const greetingCard = document.getElementById("greetingCard");
const bgm = document.getElementById("bgm");
const audioBtn = document.getElementById("audioBtn");
let playing = false;

async function playAudio(){
  try{
    bgm.volume = 0.55;
    await bgm.play();
    playing = true;
    if(audioBtn) audioBtn.textContent = "⏸ إيقاف الموسيقى";
  }catch{
    playing = false;
    if(audioBtn) audioBtn.textContent = "▶ تشغيل الموسيقى";
  }
}
function pauseAudio(){
  bgm.pause();
  playing = false;
  if(audioBtn) audioBtn.textContent = "▶ تشغيل الموسيقى";
}
if(audioBtn && bgm){
  audioBtn.addEventListener("click", () => {
    if (!playing) playAudio();
    else pauseAudio();
  });
  bgm.addEventListener("play", () => {
    playing = true;
    if(audioBtn) audioBtn.textContent = "⏸ إيقاف الموسيقى";
  });
  bgm.addEventListener("pause", () => {
    playing = false;
    if(audioBtn) audioBtn.textContent = "▶ تشغيل الموسيقى";
  });
  setTimeout(() => {
    if (!bgm.paused) {
      playing = true;
      audioBtn.textContent = "⏸ إيقاف الموسيقى";
    } else {
      playing = false;
      audioBtn.textContent = "▶ تشغيل الموسيقى";
    }
  }, 500);
}

if (startOverlay && startBtn && greetingCard) {
  document.body.style.overflow = "hidden";
  greetingCard.style.visibility = "hidden";
  startBtn.addEventListener("click", () => {
    startOverlay.classList.add("hide");
    greetingCard.style.visibility = "visible";
    document.body.style.overflow = "";
    // محاولة تشغيل الموسيقى فوراً عند الضغط
    if (bgm && typeof bgm.play === "function") {
      bgm.volume = 0.7;
      bgm.play().catch(()=>{});
    }
    // إخفاء الزر فوراً بعد الضغط
    setTimeout(() => {
      startOverlay.style.display = "none";
    }, 350);
  });
  // دعم بعض المتصفحات التي تمنع التشغيل التلقائي إلا بعد تفاعل المستخدم
  window.addEventListener("pointerdown", () => {
    if (bgm && bgm.paused) {
      bgm.play().catch(()=>{});
    }
  }, { once: true });
}
if (createNewBtn) {
  createNewBtn.addEventListener("click", () => {
    window.location.href = "index.html";
  });
}

// ====== زر الموسيقى: تشغيل/إيقاف موثوق ======
// تعريف واحد فقط لدوال الموسيقى
// ...existing code...

// ====== 1) قراءة بيانات التهنئة من الرابط ======

const toNameEl = document.getElementById("toName");
function sanitize(v){
  return (v || "").toString().trim().replace(/[<>\"]/g, "").slice(0, 64);
}
const params = new URLSearchParams(location.search);
const name = sanitize(params.get("name"));
const type = params.get("type") || "male";
let greeting = params.get("greeting");
if (greeting) greeting = decodeURIComponent(greeting);

// جمل افتراضية مع إيموجي
const greetings = {
  male: [
    `كل سنة وأنت طيب يا ${name || "..."} 🌙✨`,
    `أسأل الله أن يبلغك رمضان وأنت في أتم الصحة والعافية يا ${name || "..."} 🤲`,
    `رمضان مبارك عليك وعلى أحبابك يا ${name || "..."} 💛`
  ],
  female: [
    `كل سنة وأنتِ طيبة يا ${name || "..."} 🌙✨`,
    `أسأل الله أن يبلغكِ رمضان وأنتِ في أتم الصحة والعافية يا ${name || "..."} 🤲`,
    `رمضان مبارك عليكِ وعلى أحبابكِ يا ${name || "..."} 💛`
  ],
  all: [
    "كل سنة وأنتم طيبين جميعًا، رمضان كريم! 🌙✨",
    "أسأل الله أن يبلغكم رمضان وأنتم في أتم الصحة والعافية 🤲",
    "رمضان مبارك عليكم جميعًا 💛"
  ]
};

let msg1 = "";
if (greeting) {
  msg1 = greeting;
} else {
  if (type === "all") {
    msg1 = greetings.all[0];
  } else if (type === "female") {
    msg1 = greetings.female[0];
  } else {
    msg1 = greetings.male[0];
  }
}
toNameEl.textContent = msg1;

// ====== 2) النجوم/البارتكلز على Canvas ======
const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d", { alpha: true });

let W, H, dpr;
function resize(){
  dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  W = canvas.width  = Math.floor(window.innerWidth * dpr);
  H = canvas.height = Math.floor(window.innerHeight * dpr);
  canvas.style.width = window.innerWidth + "px";
  canvas.style.height = window.innerHeight + "px";
}
window.addEventListener("resize", resize);
resize();

const rand = (a,b)=> a + Math.random()*(b-a);

const stars = Array.from({length: 160}, () => ({
  x: rand(0, W),
  y: rand(0, H),
  r: rand(0.6, 1.8) * dpr,
  a: rand(0.2, 0.9),
  tw: rand(0.004, 0.012),
}));

const dust = Array.from({length: 60}, () => ({
  x: rand(0, W),
  y: rand(0, H),
  r: rand(1.2, 2.6) * dpr,
  a: rand(0.05, 0.22),
  vx: rand(-0.04, 0.04) * dpr,
  vy: rand(-0.02, 0.06) * dpr,
}));

function draw(){
  ctx.clearRect(0,0,W,H);

  // Stars
  for (const s of stars){
    s.a += (Math.random() > 0.5 ? 1 : -1) * s.tw;
    s.a = Math.max(0.15, Math.min(0.95, s.a));
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
    ctx.fillStyle = `rgba(255,255,255,${s.a})`;
    ctx.fill();
  }

  // Golden dust
  for (const p of dust){
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < -20) p.x = W + 20;
    if (p.x > W + 20) p.x = -20;
    if (p.y < -20) p.y = H + 20;
    if (p.y > H + 20) p.y = -20;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
    ctx.fillStyle = `rgba(247,211,122,${p.a})`;
    ctx.fill();
  }

  requestAnimationFrame(draw);
}
draw();



