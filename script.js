const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let currentLevel = 1;
let score = 0;
let foodScore = 0;
let lives = 3;
let gameState = "START";
let puzzleActive = true;
let keys = {};

const player = {
    x: 100, y: 0, w: 40, h: 40,
    vX: 0, vY: 0, speed: 5,
    jump: -16.5, gravity: 0.7, friction: 0.8,
    jumping: false
};

const levels = {
    1: {
        plats: [[0, 0.9, 1, 0.1], [0.4, 0.78, 0.2, 0.03], [0.2, 0.65, 0.15, 0.03], [0.5, 0.52, 0.15, 0.03], [0.1, 0.40, 0.15, 0.03], [0.75, 0.45, 0.2, 0.03]],
        items: [[0.22, 0.6], [0.52, 0.47], [0.12, 0.35], [0.9, 0.85]],
        food: [[0.8, 0.4, "🥕"], [0.6, 0.85, "🌽"]],
        enemies: [[0.4, 0.85, 2.5]],
        btn: [0.95, 0.88], gate: [0.8, 0.45, 0.02, 0.15]
    },
    2: {
        plats: [[0, 0.9, 1, 0.1], [0.1, 0.78, 0.15, 0.03], [0.35, 0.65, 0.15, 0.03], [0.6, 0.55, 0.15, 0.03], [0.3, 0.42, 0.3, 0.03]],
        items: [[0.15, 0.7], [0.4, 0.6], [0.65, 0.5], [0.45, 0.35]],
        food: [[0.05, 0.85, "🌽"], [0.95, 0.85, "🥕"]],
        enemies: [[0.3, 0.85, 3], [0.7, 0.85, -3]],
        btn: [0.05, 0.75], gate: [0.9, 0.75, 0.02, 0.2]
    },
    3: {
        plats: [[0, 0.9, 0.3, 0.1], [0.7, 0.9, 0.3, 0.1], [0.4, 0.78, 0.2, 0.03], [0.15, 0.65, 0.2, 0.03], [0.65, 0.65, 0.2, 0.03], [0.4, 0.5, 0.2, 0.03]],
        items: [[0.45, 0.7], [0.15, 0.6], [0.75, 0.6], [0.45, 0.45]],
        food: [[0.1, 0.85, "🥕"], [0.9, 0.85, "🌽"]],
        enemies: [[0.15, 0.6, 3.5], [0.75, 0.6, -3.5]],
        btn: [0.45, 0.48], gate: [0.8, 0.8, 0.02, 0.1]
    }
};

let platforms = [], items = [], foods = [], enemies = [], projectiles = [];
let puzzleBtn = { x: 0, y: 0, w: 40, h: 12 };
let puzzleGate = { x: 0, y: 0, w: 20, h: 100 };

function loadLevel(n) {
    const data = levels[n];
    platforms = data.plats.map(p => ({ x: p[0]*canvas.width, y: p[1]*canvas.height, w: p[2]*canvas.width, h: p[3]*canvas.height }));
    items = data.items.map(i => ({ x: i[0]*canvas.width, y: i[1]*canvas.height, collected: false }));
    foods = data.food.map(f => ({ x: f[0]*canvas.width, y: f[1]*canvas.height, type: f[2], collected: false }));
    enemies = data.enemies.map(e => ({ x: e[0]*canvas.width, y: e[1]*canvas.height, w: 45, h: 45, dir: 1, speed: e[2], lastShot: 0 }));
    puzzleBtn = { x: data.btn[0]*canvas.width, y: data.btn[1]*canvas.height, w: 40, h: 12 };
    puzzleGate = { x: data.gate[0]*canvas.width, y: data.gate[1]*canvas.height, w: data.gate[2]*canvas.width, h: data.gate[3]*canvas.height };
    
    score = 0;
    projectiles = [];
    puzzleActive = true;
    player.x = 50; player.y = canvas.height - 180;
    player.vX = 0; player.vY = 0;
    
    document.getElementById("lvlDisplay").innerText = n;
    document.getElementById("total").innerText = items.length;
    document.getElementById("score").innerText = 0;
}

window.addEventListener("keydown", e => keys[e.code] = true);
window.addEventListener("keyup", e => keys[e.code] = false);

function startLevel() {
    document.getElementById("msg").style.display = "none";
    if (gameState !== "PAUSE") {
        if (gameState === "START" || gameState === "WIN" || gameState === "OVER") {
            currentLevel = 1; foodScore = 0; lives = 3;
            document.getElementById("foodScore").innerText = 0;
            document.getElementById("lives").innerText = 3;
        }
    }
    loadLevel(currentLevel);
    gameState = "PLAYING";
    gameLoop();
}

function update() {
    if (gameState !== "PLAYING") return;
    if (keys["ArrowUp"] && !player.jumping) { player.vY = player.jump; player.jumping = true; }
    if (keys["ArrowLeft"]) player.vX = -player.speed;
    if (keys["ArrowRight"]) player.vX = player.speed;

    player.vY += player.gravity;
    player.x += player.vX;
    player.y += player.vY;
    player.vX *= player.friction;

    player.jumping = true;
    let obs = [...platforms];
    if (puzzleActive) obs.push(puzzleGate);
    obs.forEach(p => {
        if (player.x < p.x + p.w && player.x + player.w > p.x && player.y + player.h > p.y && player.y + player.h < p.y + p.h + 10 && player.vY >= 0) {
            player.jumping = false; player.y = p.y - player.h; player.vY = 0;
        }
    });

    if (player.x < puzzleBtn.x + puzzleBtn.w && player.x + player.w > puzzleBtn.x && player.y + player.h > puzzleBtn.y && player.y < puzzleBtn.y + puzzleBtn.h) {
        puzzleActive = false;
    }

    items.forEach(it => {
        if (!it.collected && player.x < it.x + 30 && player.x + player.w > it.x && player.y < it.y + 30 && player.y + player.h > it.y) {
            it.collected = true; score++;
            document.getElementById("score").innerText = score;
            if (score >= items.length) {
                if (currentLevel < 3) {
                    currentLevel++;
                    gameState = "PAUSE";
                    showUIMessage("LIMPEZA CONCLUÍDA!", "A próxima área precisa de você!", "AVANÇAR");
                } else {
                    gameState = "WIN";
                    showUIMessage("MISSÃO CUMPRIDA!", "O campo está limpo e produtivo!", "REINICIAR");
                }
            }
        }
    });

    foods.forEach(f => {
        if (!f.collected && player.x < f.x + 30 && player.x + player.w > f.x && player.y < f.y + 30 && player.y + player.h > f.y) {
            f.collected = true; foodScore += 15;
            document.getElementById("foodScore").innerText = foodScore;
        }
    });

    enemies.forEach(en => {
        en.x += en.speed * en.dir;
        if (en.x <= 0 || en.x > canvas.width - en.w) en.dir *= -1;
        let now = Date.now();
        if (now - en.lastShot > 2500) {
            projectiles.push({ x: en.x + en.w/2, y: en.y + 15, vX: en.dir * 6 });
            en.lastShot = now;
        }
        if (player.x < en.x + en.w && player.x + player.w > en.x && player.y < en.y + en.h && player.y + player.h > en.y) {
            if (player.vY > 0 && player.y < en.y) { en.y = -2000; player.vY = -10; } else hit();
        }
    });

    projectiles.forEach((proj, i) => {
        proj.x += proj.vX;
        if (player.x < proj.x + 20 && player.x + player.w > proj.x && player.y < proj.y + 20 && player.y + player.h > proj.y) {
            projectiles.splice(i, 1); hit();
        }
    });
    if (player.y > canvas.height) hit();
}

function hit() {
    lives--;
    document.getElementById("lives").innerText = lives;
    if (lives <= 0) {
        gameState = "OVER";
        showUIMessage("GAME OVER", "A poluição tomou conta.", "RECOMEÇAR");
    } else {
        player.x = 50; player.y = canvas.height - 250;
        player.vX = 0; player.vY = 0;
    }
}

function showUIMessage(t, d, b) {
    document.getElementById("msg").style.display = "block";
    document.getElementById("tutorialContent").style.display = "none";
    document.getElementById("statusTitle").innerText = t;
    document.getElementById("statusDesc").style.display = "block";
    document.getElementById("statusDesc").innerText = d;
    document.getElementById("btnStart").innerText = b;
}

function draw() {
    let sky = ctx.createLinearGradient(0, 0, 0, canvas.height);
    sky.addColorStop(0, "#4facfe"); sky.addColorStop(1, "#00f2fe");
    ctx.fillStyle = sky; ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.font = "40px Arial";
    ctx.fillText("☁️", 100, 100); ctx.fillText("☁️", 700, 150); ctx.fillText("☀️", canvas.width - 100, 80);

    platforms.forEach(p => {
        ctx.fillStyle = "#5D4037"; ctx.fillRect(p.x, p.y, p.w, p.h);
        ctx.fillStyle = "#2E7D32"; ctx.fillRect(p.x, p.y, p.w, 8);
    });

    ctx.fillStyle = puzzleActive ? "#F44336" : "#4CAF50";
    ctx.fillRect(puzzleBtn.x, puzzleBtn.y, puzzleBtn.w, puzzleBtn.h);
    if (puzzleActive) {
        ctx.fillStyle = "rgba(100,100,100,0.7)"; ctx.fillRect(puzzleGate.x, puzzleGate.y, puzzleGate.w, puzzleGate.h);
    }

    ctx.font = "28px Arial";
    items.forEach(it => { if(!it.collected) ctx.fillText("🗑️", it.x, it.y + 25); });
    foods.forEach(f => { if(!f.collected) ctx.fillText(f.type, f.x, f.y + 25); });
    enemies.forEach(en => {
        ctx.fillStyle = "#333"; ctx.beginPath(); ctx.arc(en.x+22, en.y+22, 22, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = "red"; ctx.fillRect(en.x+10, en.y+15, 8, 4); ctx.fillRect(en.x+27, en.y+15, 8, 4);
    });
    projectiles.forEach(p => { ctx.fillText("💩", p.x, p.y + 15); });

    ctx.fillStyle = "#388E3C"; ctx.fillRect(player.x, player.y, player.w, player.h);
    ctx.fillStyle = "#FFD54F"; ctx.fillRect(player.x - 4, player.y, player.w + 8, 6);
    ctx.fillStyle = "white"; ctx.fillRect(player.x + 8, player.y + 12, 6, 6); ctx.fillRect(player.x + 26, player.y + 12, 6, 6);
}

function gameLoop() {
    update(); draw();
    if (gameState === "PLAYING") requestAnimationFrame(gameLoop);
}

// Inicia o loop quando a página carregar (opcional, já que startLevel é chamado pelo botão)
window.onload = () => {
    // Redimensionar se a janela mudar
    window.onresize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
};