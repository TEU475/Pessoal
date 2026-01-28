const particlesContainer = document.getElementById("particles");

const emojis = [
  "❤️", "💖", "💘", "💞", "💕", "💓", "💗",
  "🥰", "😍", "😘",
  "💑", "👩‍❤️‍👨",
  "💍", "🌹", "💌", "🤍"
];

/* ============================
   EMOJIS FLUTUANTES DE FUNDO
============================ */
function createParticle() {
  const particle = document.createElement("div");
  particle.classList.add("particle");

  particle.textContent = emojis[Math.floor(Math.random() * emojis.length)];

  const size = Math.random() * 18 + 22;
  particle.style.fontSize = size + "px";
  particle.style.left = Math.random() * 100 + "vw";

  const duration = Math.random() * 6 + 10;
  particle.style.animationDuration = duration + "s";

  particlesContainer.appendChild(particle);

  setTimeout(() => {
    particle.remove();
  }, duration * 1000);
}

setInterval(createParticle, 280);

/* ============================
   EMOJIS AO TOCAR NA TELA
   (PRIMEIRO PLANO, MAIS LENTOS)
============================ */
function spawnTapEmoji(x, y) {
  const emoji = document.createElement("div");
  emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];

  emoji.style.position = "fixed";
  emoji.style.left = x + "px";
  emoji.style.top = y + "px";
  emoji.style.fontSize = Math.random() * 18 + 28 + "px";
  emoji.style.pointerEvents = "none";

  // primeiro plano real
  emoji.style.zIndex = "999999";

  // cor viva
  emoji.style.filter = "saturate(1.7) brightness(1.15)";
  emoji.style.opacity = "1";

  document.body.appendChild(emoji);

  const angle = Math.random() * Math.PI * 2;
  const distance = Math.random() * 50 + 30; // menos espalhamento
  const dx = Math.cos(angle) * distance;
  const dy = Math.sin(angle) * distance;

  emoji.animate(
    [
      { transform: "translate(0, 0) scale(0.9)", opacity: 1 },
      { transform: `translate(${dx}px, ${dy}px) scale(1.35)`, opacity: 0 }
    ],
    {
      duration: 1500, // 🔥 mais lento
      easing: "cubic-bezier(0.22, 1, 0.36, 1)"
    }
  );

  setTimeout(() => emoji.remove(), 1500);
}

document.addEventListener("click", (e) => {
  spawnTapEmoji(e.clientX, e.clientY);
});

/* ============================
   CORAÇÃO INTERATIVO
============================ */
const heart = document.getElementById("heart");
const secret = document.getElementById("secret");

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playRomanticChime() {
  const now = audioCtx.currentTime;

  const osc1 = audioCtx.createOscillator();
  const osc2 = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc1.type = "sine";
  osc2.type = "triangle";

  osc1.frequency.setValueAtTime(523.25, now); // dó
  osc2.frequency.setValueAtTime(659.25, now); // mi

  gain.gain.setValueAtTime(0.001, now);
  gain.gain.exponentialRampToValueAtTime(0.18, now + 0.05);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

  osc1.connect(gain);
  osc2.connect(gain);
  gain.connect(audioCtx.destination);

  osc1.start(now);
  osc2.start(now);

  osc1.stop(now + 1.2);
  osc2.stop(now + 1.2);
}

/* ============================
   PARTÍCULAS AO CLICAR NO CORAÇÃO
   (MAIS CLEAN)
============================ */
function burstFromHeart() {
  const rect = heart.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  for (let i = 0; i < 7; i++) { // 🔥 menos partículas
    spawnTapEmoji(centerX, centerY);
  }
}

if (heart && secret) {
  heart.addEventListener("click", () => {
    heart.classList.add("clicked");
    secret.classList.add("show");

    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }

    playRomanticChime();
    burstFromHeart();
  });
}

/* ============================
   FUNDO QUE MUDA COM ROLAGEM
============================ */
const colors = [
  "rgb(255,180,185)",
  "rgb(250,155,165)",
  "rgb(242,130,150)",
  "rgb(232,105,135)",
  "rgb(220,85,120)",
  "rgb(205,65,105)",
  "rgb(192,52,96)",
  "rgb(186,48,92)",
  "rgb(179,48,89)"
];

function updateBackgroundByScroll() {
  const scrollTop = window.scrollY;
  const maxScroll = document.body.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? scrollTop / maxScroll : 0;

  const index = Math.min(
    Math.floor(progress * colors.length),
    colors.length - 1
  );

  document.body.style.transition = "background-color 0.8s ease";
  document.body.style.backgroundColor = colors[index];
}

updateBackgroundByScroll();
window.addEventListener("scroll", updateBackgroundByScroll);

/* ============================
   ÁUDIO – CORREÇÃO DEFINITIVA
============================ */
const music = document.getElementById("bg-music");
const toggle = document.getElementById("music-toggle");

let musicStarted = false;
let isPlaying = false;

// desbloqueio obrigatório do navegador
document.body.addEventListener("click", () => {
  if (!musicStarted) {
    music.volume = 0.6;
    music.play().then(() => {
      musicStarted = true;
      isPlaying = true;
      toggle.textContent = "🔊";
    }).catch(err => {
      console.log("Erro áudio:", err);
    });
  }
}, { once: true });

// botão mute
toggle.addEventListener("click", (e) => {
  e.stopPropagation();
  if (!musicStarted) return;

  if (isPlaying) {
    music.pause();
    toggle.textContent = "🔇";
  } else {
    music.play();
    toggle.textContent = "🔊";
  }
  isPlaying = !isPlaying;
});