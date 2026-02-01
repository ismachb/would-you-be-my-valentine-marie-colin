const cursor = document.getElementById('cursor');
const trailCount = 20;
const trails = [];
const trailColors = [
    '#e91e63', '#f06292', '#f48fb1', '#f8bbd0',
    '#ff80ab', '#ff4081', '#f50057', '#c51162',
    '#ec407a', '#d81b60', '#e91e63', '#f06292',
    '#f48fb1', '#f8bbd0', '#ff80ab', '#ff4081',
    '#f50057', '#c51162', '#ec407a', '#d81b60'
];

for (let i = 0; i < trailCount; i++) {
    const trail = document.createElement('div');
    trail.classList.add('cursor-trail');
    trail.style.background = trailColors[i % trailColors.length];
    trail.style.width = (8 - (i * 0.3)) + 'px';
    trail.style.height = (8 - (i * 0.3)) + 'px';
    trail.style.opacity = 1 - (i / trailCount);
    document.body.appendChild(trail);
    trails.push({ el: trail, x: 0, y: 0 });
}

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function animateTrail() {
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';

    let prevX = mouseX;
    let prevY = mouseY;

    trails.forEach((trail, i) => {
        const speed = 0.35 - (i * 0.012);
        trail.x += (prevX - trail.x) * speed;
        trail.y += (prevY - trail.y) * speed;
        trail.el.style.left = trail.x + 'px';
        trail.el.style.top = trail.y + 'px';
        prevX = trail.x;
        prevY = trail.y;
    });

    requestAnimationFrame(animateTrail);
}
animateTrail();

const heartsContainer = document.getElementById('floatingHearts');
const heartSymbols = ['\u2665', '\u2764', '\u2763'];

function createFloatingHeart() {
    const heart = document.createElement('div');
    heart.classList.add('floating-heart');
    heart.textContent = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
    heart.style.left = Math.random() * 100 + '%';
    heart.style.fontSize = (15 + Math.random() * 20) + 'px';
    heart.style.animationDuration = (6 + Math.random() * 8) + 's';
    heart.style.animationDelay = Math.random() * 2 + 's';
    heartsContainer.appendChild(heart);

    setTimeout(() => heart.remove(), 16000);
}

setInterval(createFloatingHeart, 500);
for (let i = 0; i < 15; i++) createFloatingHeart();

const btnNon = document.getElementById('btnNon');
const btnOui = document.getElementById('btnOui');
let dodgeCount = 0;
let isDodging = false;

const escapeMessages = [
    "TU NE M'AURAS PAS HEHEHE",
    "Essaie encore !",
    "Trop lente !",
    "Tu crois vraiment ?",
    "Meme pas en reve !",
    "NOPE, par ici !",
    "Raaaaate !",
    "La bonne reponse c'est OUI !",
    "Je suis trop rapide pour toi",
    "Tu me fais rire",
    "Allez, clique sur Oui...",
    "C'est perdu d'avance !",
    "Abandonne !",
    "OUI est juste la...",
    "Tu vas y arriver... ou pas !",
    "Hehe, tu me cherches ?",
    "Je suis INVISIBLE",
    "Attrape-moi si tu peux !",
    "C'est pas le bon bouton...",
    "Clique sur Oui, c'est plus simple !"
];

function getRandomPosition() {
    const margin = 80;
    const maxX = window.innerWidth - margin - btnNon.offsetWidth;
    const maxY = window.innerHeight - margin - btnNon.offsetHeight;
    return {
        x: margin + Math.random() * maxX,
        y: margin + Math.random() * maxY
    };
}

function showEscapeMessage(x, y) {
    const msg = document.createElement('div');
    msg.classList.add('escape-message');
    msg.textContent = escapeMessages[dodgeCount % escapeMessages.length];
    msg.style.left = x + 'px';
    msg.style.top = (y - 30) + 'px';
    document.body.appendChild(msg);
    setTimeout(() => msg.remove(), 1500);
}

function burstMiniHearts(x, y) {
    for (let i = 0; i < 6; i++) {
        const heart = document.createElement('div');
        heart.classList.add('mini-heart');
        heart.textContent = '\u2665';
        heart.style.left = x + 'px';
        heart.style.top = y + 'px';
        const angle = (Math.PI * 2 / 6) * i;
        const dist = 40 + Math.random() * 30;
        heart.style.setProperty('--tx', Math.cos(angle) * dist + 'px');
        heart.style.setProperty('--ty', Math.sin(angle) * dist + 'px');
        heart.style.color = trailColors[Math.floor(Math.random() * trailColors.length)];
        document.body.appendChild(heart);
        setTimeout(() => heart.remove(), 1000);
    }
}

const trickTexts = ["Ouiii !", "Oui ?", "Oui !", "Ok oui"];

function dodgeButton() {
    if (isDodging) return;
    isDodging = true;

    const rect = btnNon.getBoundingClientRect();
    const btnCenterX = rect.left + rect.width / 2;
    const btnCenterY = rect.top + rect.height / 2;

    showEscapeMessage(btnCenterX, btnCenterY);
    burstMiniHearts(btnCenterX, btnCenterY);

    const pos = getRandomPosition();
    btnNon.style.position = 'fixed';
    btnNon.style.left = pos.x + 'px';
    btnNon.style.top = pos.y + 'px';

    dodgeCount++;

    if (dodgeCount > 3 && Math.random() < 0.3) {
        btnNon.textContent = trickTexts[Math.floor(Math.random() * trickTexts.length)];
        btnNon.style.background = 'linear-gradient(135deg, #e91e63, #c2185b)';
        setTimeout(() => {
            btnNon.textContent = 'Non';
            btnNon.style.background = 'linear-gradient(135deg, #9e9e9e, #757575)';
        }, 800);
    }

    // Make Non shrink and Oui grow over time
    const ouiScale = 1 + dodgeCount * 0.06;
    btnOui.style.transform = `scale(${Math.min(ouiScale, 2)})`;
    const nonScale = 1 - dodgeCount * 0.02;
    btnNon.style.transform = `scale(${Math.max(nonScale, 0.5)})`;

    setTimeout(() => { isDodging = false; }, 500);
}

btnNon.addEventListener('mouseenter', dodgeButton);
btnNon.addEventListener('click', dodgeButton);
btnNon.addEventListener('touchstart', (e) => {
    e.preventDefault();
    dodgeButton();
});

document.addEventListener('mousemove', (e) => {
    const rect = btnNon.getBoundingClientRect();
    const btnCenterX = rect.left + rect.width / 2;
    const btnCenterY = rect.top + rect.height / 2;
    const dist = Math.hypot(e.clientX - btnCenterX, e.clientY - btnCenterY);

    if (dist < 150) {
        dodgeButton();
    }
});

const successOverlay = document.getElementById('successOverlay');
const fireworksCanvas = document.getElementById('fireworks-canvas');
const ctx = fireworksCanvas.getContext('2d');

btnOui.addEventListener('click', () => {
    successOverlay.classList.add('active');
    fireworksCanvas.width = window.innerWidth;
    fireworksCanvas.height = window.innerHeight;
    launchFireworks();
});

const particles = [];
const fireworkColors = [
    '#e91e63', '#ff4081', '#f50057', '#ff80ab',
    '#f48fb1', '#FFD700', '#ff6f00', '#ff1744',
    '#d500f9', '#651fff', '#00e5ff', '#76ff03'
];

class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 5 + 2;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.alpha = 1;
        this.decay = Math.random() * 0.015 + 0.008;
        this.size = Math.random() * 3 + 1;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.04;
        this.alpha -= this.decay;
        this.size *= 0.99;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = Math.max(this.alpha, 0);
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

function createFirework() {
    const x = Math.random() * fireworksCanvas.width;
    const y = Math.random() * fireworksCanvas.height * 0.5;
    const color = fireworkColors[Math.floor(Math.random() * fireworkColors.length)];
    for (let i = 0; i < 80; i++) {
        particles.push(new Particle(x, y, color));
    }
}

let fireworksRunning = false;

function animateFireworks() {
    if (!fireworksRunning) return;
    ctx.clearRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);

    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw();
        if (particles[i].alpha <= 0) {
            particles.splice(i, 1);
        }
    }

    requestAnimationFrame(animateFireworks);
}

function launchFireworks() {
    fireworksRunning = true;
    animateFireworks();

    createFirework();
    createFirework();
    createFirework();

    let count = 0;
    const interval = setInterval(() => {
        createFirework();
        if (Math.random() > 0.5) createFirework();
        count++;
        if (count > 30) {
            clearInterval(interval);
            setInterval(() => {
                createFirework();
            }, 2000);
        }
    }, 400);
}

window.addEventListener('resize', () => {
    if (fireworksRunning) {
        fireworksCanvas.width = window.innerWidth;
        fireworksCanvas.height = window.innerHeight;
    }
});
