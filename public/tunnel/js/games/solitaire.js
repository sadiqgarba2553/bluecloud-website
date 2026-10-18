// Tunnel Arcade - Game 4: Retro Cyber Solitaire (Klondike)
class SolitaireGame {
  init(engine) {
    this.engine = engine;
    this.cardWidth = 72;
    this.cardHeight = 100;
    this.suits = ['♠', '♥', '♦', '♣'];
    this.suitColors = { '♠': '#00f0ff', '♥': '#ff0055', '♦': '#ff0055', '♣': '#00f0ff' };
    this.values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

    this.stock = [];
    this.waste = [];
    this.foundations = [[], [], [], []]; // 4 suit piles
    this.tableau = [[], [], [], [], [], [], []]; // 7 columns

    this.selectedCards = null; // { fromType: 'tableau'|'waste', colIndex, cardIndex, cards }
    this.dragPos = { x: 0, y: 0 };
    this.isDragging = false;
    this.history = [];
    this.timeElapsed = 0;
    this.won = false;
    this.winCascade = [];

    this.initDeck();
    this.deal();
    this.bindMouseEvents();
  }

  initDeck() {
    const deck = [];
    for (let s of this.suits) {
      for (let v = 0; v < this.values.length; v++) {
        deck.push({
          suit: s,
          val: v + 1, // 1 to 13
          name: this.values[v],
          faceUp: false
        });
      }
    }
    // Shuffle
    this.deck = deck.sort(() => Math.random() - 0.5);
  }

  deal() {
    for (let c = 0; c < 7; c++) {
      for (let r = 0; r <= c; r++) {
        const card = this.deck.pop();
        if (r === c) card.faceUp = true;
        this.tableau[c].push(card);
      }
    }
    this.stock = this.deck;
  }

  bindMouseEvents() {
    this.canvas = this.engine.canvas;
    this.onMouseDown = this.handleMouseDown.bind(this);
    this.onMouseMove = this.handleMouseMove.bind(this);
    this.onMouseUp = this.handleMouseUp.bind(this);

    this.canvas.addEventListener('mousedown', this.onMouseDown);
    this.canvas.addEventListener('mousemove', this.onMouseMove);
    this.canvas.addEventListener('mouseup', this.onMouseUp);

    // Touch support for mobile
    this.onTouchStart = (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const touch = e.touches[0];
      this.handleMouseDown({
        clientX: touch.clientX,
        clientY: touch.clientY,
        preventDefault: () => e.preventDefault()
      });
    };
    this.onTouchMove = (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const touch = e.touches[0];
      this.handleMouseMove({
        clientX: touch.clientX,
        clientY: touch.clientY
      });
    };
    this.onTouchEnd = (e) => {
      this.handleMouseUp({});
    };

    this.canvas.addEventListener('touchstart', this.onTouchStart, { passive: false });
    this.canvas.addEventListener('touchmove', this.onTouchMove, { passive: false });
    this.canvas.addEventListener('touchend', this.onTouchEnd, { passive: false });
  }

  getCoords(e) {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = 800 / rect.width;
    const scaleY = 600 / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  }

  handleMouseDown(e) {
    if (this.won) return;
    const { x, y } = this.getCoords(e);

    // 1. Check Stock Click
    if (x >= 40 && x <= 40 + this.cardWidth && y >= 40 && y <= 40 + this.cardHeight) {
      this.drawCardFromStock();
      return;
    }

    // 2. Check Waste Click
    if (this.waste.length > 0) {
      if (x >= 130 && x <= 130 + this.cardWidth && y >= 40 && y <= 40 + this.cardHeight) {
        // Tap to auto-move or drag
        const card = this.waste[this.waste.length - 1];
        if (!this.autoMoveCard(card, 'waste')) {
          this.selectedCards = { fromType: 'waste', cards: [card] };
          this.isDragging = true;
          this.dragPos = { x, y };
        }
        return;
      }
    }

    // 3. Check Tableau Click
    for (let c = 0; c < 7; c++) {
      const col = this.tableau[c];
      const colX = 40 + c * 105;
      
      for (let r = col.length - 1; r >= 0; r--) {
        const card = col[r];
        const cardY = 170 + r * 28;
        if (x >= colX && x <= colX + this.cardWidth && y >= cardY && y <= cardY + this.cardHeight) {
          if (!card.faceUp && r === col.length - 1) {
            // Flip top card
            card.faceUp = true;
            this.engine.addScore(10);
            if (window.tunnelAudio) window.tunnelAudio.play('move');
            return;
          }

          if (card.faceUp) {
            // If top card clicked, try quick auto-move first
            if (r === col.length - 1 && this.autoMoveCard(card, 'tableau', c)) {
              return;
            }

            // Start drag of stack
            const cardsToMove = col.slice(r);
            this.selectedCards = { fromType: 'tableau', colIndex: c, cardIndex: r, cards: cardsToMove };
            this.isDragging = true;
            this.dragPos = { x, y };
            return;
          }
          break;
        }
      }
    }
  }

  handleMouseMove(e) {
    if (!this.isDragging) return;
    this.dragPos = this.getCoords(e);
  }

  handleMouseUp(e) {
    if (!this.isDragging || !this.selectedCards) {
      this.isDragging = false;
      this.selectedCards = null;
      return;
    }

    const { x, y } = this.dragPos;
    let placed = false;

    // Check Foundation drop (single card only)
    if (this.selectedCards.cards.length === 1) {
      const card = this.selectedCards.cards[0];
      for (let f = 0; f < 4; f++) {
        const fX = 355 + f * 105;
        const fY = 40;
        if (x >= fX && x <= fX + this.cardWidth && y >= fY && y <= fY + this.cardHeight) {
          const fPile = this.foundations[f];
          if ((fPile.length === 0 && card.val === 1) || (fPile.length > 0 && fPile[fPile.length - 1].suit === card.suit && fPile[fPile.length - 1].val === card.val - 1)) {
            this.removeSelectedFromSource();
            fPile.push(card);
            this.engine.addScore(25);
            if (window.tunnelAudio) window.tunnelAudio.play('score');
            placed = true;
            break;
          }
        }
      }
    }

    // Check Tableau drop
    if (!placed) {
      for (let c = 0; c < 7; c++) {
        const col = this.tableau[c];
        const colX = 40 + c * 105;
        const colY = 170 + Math.max(0, col.length - 1) * 28;

        if (x >= colX - 20 && x <= colX + this.cardWidth + 20 && y >= 170 && y <= colY + this.cardHeight + 40) {
          const bottomCard = col.length > 0 ? col[col.length - 1] : null;
          const topMoving = this.selectedCards.cards[0];

          // Valid move rule: King on empty spot, or descending value with alternating color
          const isOppositeColor = (c1, c2) => (['♥', '♦'].includes(c1.suit) !== ['♥', '♦'].includes(c2.suit));

          if ((!bottomCard && topMoving.val === 13) || (bottomCard && bottomCard.faceUp && isOppositeColor(bottomCard, topMoving) && bottomCard.val === topMoving.val + 1)) {
            this.removeSelectedFromSource();
            col.push(...this.selectedCards.cards);
            this.engine.addScore(15);
            if (window.tunnelAudio) window.tunnelAudio.play('move');
            placed = true;
            break;
          }
        }
      }
    }

    this.isDragging = false;
    this.selectedCards = null;
    this.checkWin();
  }

  removeSelectedFromSource() {
    if (this.selectedCards.fromType === 'waste') {
      this.waste.pop();
    } else if (this.selectedCards.fromType === 'tableau') {
      this.tableau[this.selectedCards.colIndex].splice(this.selectedCards.cardIndex);
      // Flip new top card if needed
      const col = this.tableau[this.selectedCards.colIndex];
      if (col.length > 0 && !col[col.length - 1].faceUp) {
        col[col.length - 1].faceUp = true;
        this.engine.addScore(10);
      }
    }
  }

  drawCardFromStock() {
    if (this.stock.length === 0) {
      if (this.waste.length === 0) return;
      this.stock = this.waste.reverse().map(c => { c.faceUp = false; return c; });
      this.waste = [];
      if (window.tunnelAudio) window.tunnelAudio.play('move');
      return;
    }

    const card = this.stock.pop();
    card.faceUp = true;
    this.waste.push(card);
    if (window.tunnelAudio) window.tunnelAudio.play('move');
  }

  autoMoveCard(card, fromType, colIndex) {
    // Try to auto move to foundations
    for (let f = 0; f < 4; f++) {
      const fPile = this.foundations[f];
      if ((fPile.length === 0 && card.val === 1) || (fPile.length > 0 && fPile[fPile.length - 1].suit === card.suit && fPile[fPile.length - 1].val === card.val - 1)) {
        if (fromType === 'waste') {
          this.waste.pop();
        } else if (fromType === 'tableau') {
          this.tableau[colIndex].pop();
          const col = this.tableau[colIndex];
          if (col.length > 0 && !col[col.length - 1].faceUp) {
            col[col.length - 1].faceUp = true;
            this.engine.addScore(10);
          }
        }
        fPile.push(card);
        this.engine.addScore(30);
        this.engine.spawnFloatingText(`+30 ${card.name}${card.suit}`, 355 + f * 105, 70, '#00f0ff', 20);
        if (window.tunnelAudio) window.tunnelAudio.play('score');
        this.checkWin();
        return true;
      }
    }
    return false;
  }

  checkWin() {
    const totalInFoundations = this.foundations.reduce((acc, p) => acc + p.length, 0);
    if (totalInFoundations === 52 && !this.won) {
      this.won = true;
      this.engine.addScore(5000);
      this.engine.spawnFloatingText('VICTORY! +5000', 400, 300, '#ffb700', 36);
      if (window.tunnelAudio) window.tunnelAudio.play('levelUp');

      // Create win cascade cards
      this.foundations.forEach(pile => {
        pile.forEach(c => {
          this.winCascade.push({
            card: c,
            x: Math.random() * 700 + 50,
            y: Math.random() * 200 + 50,
            vx: (Math.random() - 0.5) * 300,
            vy: -Math.random() * 200,
            gravity: 600
          });
        });
      });
    }
  }

  update(dt, input) {
    this.timeElapsed += dt;

    // Win animation
    if (this.won) {
      this.winCascade.forEach(c => {
        c.vy += c.gravity * dt;
        c.x += c.vx * dt;
        c.y += c.vy * dt;
        if (c.y > 600 - this.cardHeight) {
          c.y = 600 - this.cardHeight;
          c.vy = -c.vy * 0.85;
        }
      });
    }
  }

  render(ctx) {
    const w = 800;
    const h = 600;

    // Green Felt / Cyber Velvet Canvas
    const bgGrad = ctx.createRadialGradient(w / 2, h / 2, 50, w / 2, h / 2, 450);
    bgGrad.addColorStop(0, '#0a2318');
    bgGrad.addColorStop(1, '#040d09');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // Render Stock & Waste Piles
    this.drawCardSlot(ctx, 40, 40, 'STOCK');
    if (this.stock.length > 0) {
      this.drawCard(ctx, 40, 40, null, false);
      ctx.fillStyle = '#00f0ff';
      ctx.font = '700 12px "Outfit", sans-serif';
      ctx.fillText(`${this.stock.length}`, 40 + 26, 40 + 55);
    }

    this.drawCardSlot(ctx, 130, 40, 'WASTE');
    if (this.waste.length > 0) {
      const topWaste = this.waste[this.waste.length - 1];
      if (!(this.isDragging && this.selectedCards && this.selectedCards.fromType === 'waste')) {
        this.drawCard(ctx, 130, 40, topWaste, true);
      }
    }

    // Render 4 Foundations
    for (let f = 0; f < 4; f++) {
      const fX = 355 + f * 105;
      this.drawCardSlot(ctx, fX, 40, `[ ${this.suits[f]} ]`);
      const fPile = this.foundations[f];
      if (fPile.length > 0) {
        this.drawCard(ctx, fX, 40, fPile[fPile.length - 1], true);
      }
    }

    // Render 7 Tableau Columns
    for (let c = 0; c < 7; c++) {
      const colX = 40 + c * 105;
      this.drawCardSlot(ctx, colX, 170, 'K');

      const col = this.tableau[c];
      for (let r = 0; r < col.length; r++) {
        // Skip rendering dragged cards here
        if (this.isDragging && this.selectedCards && this.selectedCards.fromType === 'tableau' && this.selectedCards.colIndex === c && r >= this.selectedCards.cardIndex) {
          continue;
        }
        const card = col[r];
        const cardY = 170 + r * 28;
        this.drawCard(ctx, colX, cardY, card, card.faceUp);
      }
    }

    // Render Dragging Cards
    if (this.isDragging && this.selectedCards) {
      const { x, y } = this.dragPos;
      this.selectedCards.cards.forEach((card, idx) => {
        this.drawCard(ctx, x - this.cardWidth / 2, y - 20 + idx * 28, card, true, true);
      });
    }

    // Render Win Waterfall
    if (this.won) {
      this.winCascade.forEach(c => {
        this.drawCard(ctx, c.x, c.y, c.card, true);
      });
    }
  }

  drawCardSlot(ctx, x, y, label) {
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.2)';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, this.cardWidth, this.cardHeight);
    ctx.fillStyle = 'rgba(0, 240, 255, 0.25)';
    ctx.font = '700 13px "Outfit", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(label, x + this.cardWidth / 2, y + this.cardHeight / 2 + 5);
  }

  drawCard(ctx, x, y, card, faceUp, isFloating = false) {
    ctx.save();
    if (isFloating) {
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 16;
    }

    // Card background
    ctx.fillStyle = faceUp ? '#ffffff' : '#10172e';
    ctx.fillRect(x, y, this.cardWidth, this.cardHeight);

    // Card border
    ctx.strokeStyle = faceUp ? '#000000' : '#00f0ff';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x, y, this.cardWidth, this.cardHeight);

    if (!faceUp) {
      // Cyber Card Back Pattern
      ctx.strokeStyle = '#7000ff';
      ctx.lineWidth = 1;
      ctx.strokeRect(x + 6, y + 6, this.cardWidth - 12, this.cardHeight - 12);
      ctx.fillStyle = '#ff007f';
      ctx.beginPath();
      ctx.arc(x + this.cardWidth / 2, y + this.cardHeight / 2, 12, 0, Math.PI * 2);
      ctx.fill();
    } else if (card) {
      // Front of Card
      const color = this.suitColors[card.suit];
      ctx.fillStyle = color;
      ctx.font = '900 16px "Outfit", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`${card.name}${card.suit}`, x + 6, y + 20);

      // Large Center Suit Emblem
      ctx.font = '32px "Outfit", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(card.suit, x + this.cardWidth / 2, y + this.cardHeight / 2 + 10);
    }
    ctx.restore();
  }

  destroy() {
    if (this.canvas) {
      this.canvas.removeEventListener('mousedown', this.onMouseDown);
      this.canvas.removeEventListener('mousemove', this.onMouseMove);
      this.canvas.removeEventListener('mouseup', this.onMouseUp);
      this.canvas.removeEventListener('touchstart', this.onTouchStart);
      this.canvas.removeEventListener('touchmove', this.onTouchMove);
      this.canvas.removeEventListener('touchend', this.onTouchEnd);
    }
  }
}

window.SolitaireGame = SolitaireGame;
