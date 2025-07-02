let player;  // Personagem
let obstacles = [];  // Lista de obstáculos
let seeds = [];  // Sementes para coletar
let score = 0;  // Pontuação
let gameState = 'campo';  // Estado do jogo (campo, cidade)
let level = 1;  // Nível do jogo

function setup() {
  createCanvas(800, 600);
  player = new Player();
  frameRate(60);
}

function draw() {
  background(220);
  
  if (gameState === 'campo') {
    campo();
  } else if (gameState === 'cidade') {
    cidade();
  }

  // Exibir a pontuação
  fill(0);
  textSize(20);
  text("Pontuação: " + score, 10, 30);

  player.update();
  player.show();
  player.move();
  
  // Criar e gerenciar obstáculos
  for (let i = obstacles.length - 1; i >= 0; i--) {
    obstacles[i].update();
    obstacles[i].show();
    if (obstacles[i].hits(player)) {
      gameOver();
    }
    if (obstacles[i].offscreen()) {
      obstacles.splice(i, 1);
    }
  }

  // Criar e gerenciar sementes
  for (let i = seeds.length - 1; i >= 0; i--) {
    seeds[i].update();
    seeds[i].show();
    if (seeds[i].hits(player)) {
      score += 10;
      seeds.splice(i, 1);
    }
    if (seeds[i].offscreen()) {
      seeds.splice(i, 1);
    }
  }

  // Spawn novos obstáculos e sementes
  if (frameCount % 60 === 0) {
    let obstacle = new Obstacle();
    obstacles.push(obstacle);

    let seed = new Seed();
    seeds.push(seed);
  }
}

function campo() {
  // Desenha o cenário do campo
  fill(100, 200, 100);
  rect(0, height - 100, width, 100);  // Terreno do campo

  fill(150, 100, 50);  // Cor das árvores
  ellipse(200, height - 150, 50, 50);  // Árvore
  ellipse(400, height - 150, 50, 50);  // Outra árvore

  fill(255, 0, 0);  // Cor das casas
  rect(300, height - 150, 80, 60);  // Casa

  // Instruções
  textSize(20);
  fill(0);
  text("Pressione as teclas de seta para mover", 250, 50);
}

function cidade() {
  // Desenha o cenário da cidade
  fill(100, 100, 255);  // Cor do céu da cidade
  rect(0, 0, width, height);

  fill(50, 50, 50);  // Cor dos prédios
  for (let i = 0; i < 5; i++) {
    rect(100 + i * 140, height - 250, 100, 200);
  }

  fill(255, 255, 0);  // Luzes da cidade
  ellipse(600, height - 300, 20, 20);  // Luz de rua

  // Mensagem de vitória
  fill(0);
  textSize(30);
  text("Você chegou à cidade! Pontuação final: " + score, 200, height / 2);
}

function gameOver() {
  // Quando o jogador perde
  gameState = 'campo';  // Reiniciar no campo
  level = 1;
  score = 0;
  obstacles = [];
  seeds = [];
  player.x = 100;  // Reiniciar posição do jogador
  player.y = height - 150;
  textSize(40);
  fill(255, 0, 0);
  text("GAME OVER", width / 2 - 100, height / 2);
  noLoop();
}

class Player {
  constructor() {
    this.x = 100;
    this.y = height - 150;
    this.size = 30;
  }

  update() {
    // Checa se o jogador chegou à cidade
    if (this.x > width - 100) {
      gameState = 'cidade';
    }
  }

  show() {
    fill(0);
    ellipse(this.x, this.y, this.size, this.size);  // Desenha a pessoa
  }

  move() {
    if (keyIsDown(LEFT_ARROW)) {
      this.x -= 5;
    } else if (keyIsDown(RIGHT_ARROW)) {
      this.x += 5;
    } else if (keyIsDown(UP_ARROW)) {
      this.y -= 5;
    } else if (keyIsDown(DOWN_ARROW)) {
      this.y += 5;
    }
  }
}

class Obstacle {
  constructor() {
    this.x = random(width);
    this.y = 0;
    this.size = 30;
    this.speed = random(3, 5);
  }

  update() {
    this.y += this.speed;
  }

  show() {
    fill(255, 0, 0);
    rect(this.x, this.y, this.size, this.size);
  }

  hits(player) {
    if (player.x < this.x + this.size && player.x + player.size > this.x &&
        player.y < this.y + this.size && player.y + player.size > this.y) {
      return true;
    }
    return false;
  }

  offscreen() {
    return this.y > height;
  }
}

class Seed {
  constructor() {
    this.x = random(width);
    this.y = 0;
    this.size = 15;
    this.speed = 2;
  }

  update() {
    this.y += this.speed;
  }

  show() {
    fill(0, 255, 0);
    ellipse(this.x, this.y, this.size, this.size);
  }

  hits(player) {
    if (player.x < this.x + this.size && player.x + player.size > this.x &&
        player.y < this.y + this.size && player.y + player.size > this.y) {
      return true;
    }
    return false;
  }

  offscreen() {
    return this.y > height;
  }
}