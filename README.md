# agrinho-2026
# 🌾 AgroEco Quest: Pulo Ajustado

O **AgroEco Quest: Pulo Ajustado** é um jogo de plataforma 2D com temática ecológica e agrícola desenvolvido para navegadores. O objetivo do projeto é aliar mecânicas clássicas de jogos de plataformas com a conscientização sobre a preservação ambiental e a limpeza dos campos de cultivo.

## 🎮 Como Funciona o Jogo

O jogo funciona num ciclo tradicional de plataforma onde o jogador precisa explorar o cenário, cumprir objetivos ecológicos e encontrar a saída para avançar de nível.

### 🚀 Objetivo Principal
Para completar uma fase, o jogador deve:
1. **Recolher todo o lixo** (🗑️) espalhado pelo mapa.
2. **Ativar o mecanismo de saída:** Pisar num **botão vermelho** para abrir o portão cinza (fim da fase).

---

## 🕹️ Mecânicas e Controlos

* **Movimentação:**
  * `⬅️` / `➡️` : Mover o personagem para a esquerda e para a direita.
  * `⬆️` : Saltar (mecanismo central do jogo).
* **Combate / Defesa:**
  * 👾 **Mutantes:** Os inimigos do jogo podem ser derrotados ao **saltar em cima deles** (estilo clássico *Mario Bros*).
  * 💩 **Projéteis:** O jogador deve esquivar-se dos tiros de "cocó" lançados pelos inimigos para não perder vida.
* **Sistema de Vidas:** O jogador inicia a partida com **3 vidas** (`❤️`). Se forem a zero, o jogo termina.

---

## 🧺 Elementos e Itens do Jogo

| Elemento | Ícone | Função |
| :--- | :---: | :--- |
| **Lixo** | 🗑️ | Item obrigatório. É necessário recolher todos para abrir a fase. |
| **Bónus (Milho/Cenoura)** | 🌽🥕 | Itens opcionais. Concedem pontos de Estrela (⭐) para aumentar a pontuação final. |
| **Mutante** | 👾 | Inimigo da fase. Deve ser eliminado ou evitado. |
| **Botão Vermelho** | 🔴 | Interruptor que desbloqueia o portão de saída. |

---

## 🛠️ Estrutura Técnica do Projeto

O projeto é construído de forma leve e nativa para a web, dividido em três ficheiros principais:
* **`index.html`:** Estrutura o ecrã do jogo, a interface de utilizador (UI) e o menu/tutorial inicial.
* **`style.css`:** Define o aspeto visual do jogo, o posicionamento da UI e o estilo responsivo do menu modal.
* **`script.js`:** Contém o motor do jogo através da API `Canvas`, gerindo a física dos saltos, colisões, lógica de pontuação e comportamento dos inimigos.