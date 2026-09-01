// Tunnel Arcade - Central Game Catalog Registry (12-Game Nostalgic Suite)
const TUNNEL_GAMES = [
  {
    id: 'tunnel-runner',
    title: 'Tunnel Rush 3D',
    category: 'Action',
    badge: 'VECTOR 3D',
    accentColor: '#00f0ff',
    iconType: 'tunnel',
    description: 'Blaze through an accelerating 3D perspective warp corridor, dodging polygon barriers and collecting energy cells.',
    tags: ['3D', 'Vector', 'Speed', 'High-Octane', 'Arcade'],
    controls: {
      desktop: 'Left / Right Arrow (or A / D) to steer along the tunnel perimeter.',
      mobile: 'Use Left / Right D-Pad or swipe to dodge obstacles.'
    },
    canvasWidth: 800,
    canvasHeight: 600,
    gameClass: 'TunnelRunnerGame'
  },
  {
    id: 'space-invaders',
    title: 'Alien Assault',
    category: 'Action',
    badge: 'SPACE CAB',
    accentColor: '#ff0055',
    iconType: 'invaders',
    description: 'Defend Earth from descending vector alien formations. Utilize defensive bunkers and target the mystery command saucer.',
    tags: ['Space', 'Shooter', 'Invaders', 'Retro', 'Classic'],
    controls: {
      desktop: 'Left / Right to steer turret, Space to fire lasers.',
      mobile: 'Left / Right D-Pad, Button A to fire.'
    },
    canvasWidth: 800,
    canvasHeight: 600,
    gameClass: 'SpaceInvadersGame'
  },
  {
    id: 'tetris',
    title: 'Neon Tetris',
    category: 'Puzzle',
    badge: '16-BIT CLASSIC',
    accentColor: '#cc00ff',
    iconType: 'tetris',
    description: 'The definitive falling tetromino challenge with ghost piece projection, hold reservoir, and authentic line clear mechanics.',
    tags: ['Tetris', 'Puzzle', 'Retro', 'Classic', 'Blocks'],
    controls: {
      desktop: 'Left / Right to steer, Up / A to rotate, Down for soft drop, Space for instant drop, B / Shift to hold piece.',
      mobile: 'Use D-pad / swipe to steer, Button A to rotate, Button B to hold piece.'
    },
    canvasWidth: 800,
    canvasHeight: 600,
    gameClass: 'TetrisGame'
  },
  {
    id: 'pac-maze',
    title: 'Cyber Maze',
    category: 'Retro',
    badge: 'MAZE RUNNER',
    accentColor: '#ffdd00',
    iconType: 'pacmaze',
    description: 'Navigate the neon grid matrix, collect energy modules, and engage power energizers to neutralize roaming cyber sentinels.',
    tags: ['Maze', 'Pacman', 'Arcade', 'Retro', 'Action'],
    controls: {
      desktop: 'Arrow keys / WASD to steer runner.',
      mobile: 'Use D-pad or swipe gestures on screen.'
    },
    canvasWidth: 800,
    canvasHeight: 600,
    gameClass: 'PacMazeGame'
  },
  {
    id: 'flappy',
    title: 'Cyber Flyer',
    category: 'Action',
    badge: 'ARCADE TAP',
    accentColor: '#ff007f',
    iconType: 'flyer',
    description: 'Guide your micro-drone through high-voltage laser gates. Maintain altitude rhythm and intercept energy cores.',
    tags: ['Flyer', 'Endless', 'Tap', 'Precision', 'Action'],
    controls: {
      desktop: 'Space / Up Arrow / Left Click to engage thrusters.',
      mobile: 'Tap canvas or press Action Button A to engage thrusters.'
    },
    canvasWidth: 800,
    canvasHeight: 600,
    gameClass: 'FlappyBirdGame'
  },
  {
    id: 'solitaire',
    title: 'Retro Solitaire',
    category: 'Classic',
    badge: 'KLONDIKE PATIENCE',
    accentColor: '#00ff66',
    iconType: 'solitaire',
    description: 'Classic 52-card Klondike patience with intelligent auto-placement, undo stack, and vintage victory cascade.',
    tags: ['Solitaire', 'Cards', 'Klondike', 'Classic', 'Patience'],
    controls: {
      desktop: 'Click / Drag cards to move. Tap any card to auto-place onto foundation piles.',
      mobile: 'Tap cards to auto-place or drag to tableau columns.'
    },
    canvasWidth: 800,
    canvasHeight: 600,
    gameClass: 'SolitaireGame'
  },
  {
    id: 'snake',
    title: 'Cyber Snake',
    category: 'Retro',
    badge: '8-BIT RETRO',
    accentColor: '#00ff66',
    iconType: 'snake',
    description: 'Smooth vector snake equipped with power-up capsules including Phase Shift, 2X Score Multiplier, and Warp Shrink.',
    tags: ['Snake', 'Retro', 'Arcade', 'Powerups', 'Casual'],
    controls: {
      desktop: 'Arrow keys or W/A/S/D to steer direction.',
      mobile: 'Use directional D-Pad or swipe gestures on screen.'
    },
    canvasWidth: 800,
    canvasHeight: 600,
    gameClass: 'SnakeGame'
  },
  {
    id: 'brick-breaker',
    title: 'Neon Breakout',
    category: 'Action',
    badge: 'PADDLE BALL',
    accentColor: '#ffb700',
    iconType: 'breakout',
    description: 'High-velocity paddle brick destroyer featuring multi-ball splits, laser cannons, and explosive chain reaction blocks.',
    tags: ['Breakout', 'Bricks', 'Paddle', 'Action', 'Lasers'],
    controls: {
      desktop: 'Left / Right Arrow to steer paddle, Space / Button A to discharge laser cannons.',
      mobile: 'Use Left / Right D-pad, Button A to discharge lasers.'
    },
    canvasWidth: 800,
    canvasHeight: 600,
    gameClass: 'BrickBreakerGame'
  },
  {
    id: 'pong',
    title: 'Neon Pong',
    category: 'Classic',
    badge: '1972 HARDWARE',
    accentColor: '#00f0ff',
    iconType: 'pong',
    description: 'The foundational video game modernized with neon deflection physics, rally multiplier combos, and adaptive Cyber AI.',
    tags: ['Pong', 'Tennis', 'Paddle', '2-Player', 'Retro'],
    controls: {
      desktop: 'Up / Down Arrow to steer player paddle.',
      mobile: 'Up / Down D-pad or drag on the left screen.'
    },
    canvasWidth: 800,
    canvasHeight: 600,
    gameClass: 'PongGame'
  },
  {
    id: 'game-2048',
    title: '2048 Cyber Grid',
    category: 'Puzzle',
    badge: 'LOGIC MATRIX',
    accentColor: '#ff9900',
    iconType: 'grid2048',
    description: 'Slide and synthesize numbered power modules across the magnetic grid to synthesize the 2048 core module.',
    tags: ['2048', 'Puzzle', 'Numbers', 'Strategy', 'Matrix'],
    controls: {
      desktop: 'Arrow keys or WASD to slide matrix, B to undo previous shift.',
      mobile: 'Swipe across matrix in any direction, Button B to undo.'
    },
    canvasWidth: 800,
    canvasHeight: 600,
    gameClass: 'Game2048'
  },
  {
    id: 'minesweeper',
    title: 'Minesweeper Protocol',
    category: 'Puzzle',
    badge: 'DEFUSAL MATRIX',
    accentColor: '#00ff66',
    iconType: 'minesweeper',
    description: 'Tactical sector defusal protocol. Calculate mine proximities, deploy safety flags, and clear contaminated sectors.',
    tags: ['Minesweeper', 'Logic', 'Puzzle', 'Tactical', 'Retro'],
    controls: {
      desktop: 'Left Click to dig, Right Click (or B key) to place flag.',
      mobile: 'Tap to dig, Button B to toggle Flag/Dig mode.'
    },
    canvasWidth: 800,
    canvasHeight: 600,
    gameClass: 'MinesweeperGame'
  },
  {
    id: 'asteroids',
    title: 'Space Asteroids',
    category: 'Retro',
    badge: 'VECTOR CAB',
    accentColor: '#00f0ff',
    iconType: 'asteroids',
    description: 'Authentic vector cabinet space shooter. Master rotational inertia, blast geometric asteroids, and engage emergency hyperspace.',
    tags: ['Asteroids', 'Space', 'Vector', 'Retro', 'Shooter'],
    controls: {
      desktop: 'Left / Right to rotate, Up Arrow for thrusters, Space to fire lasers, B for Hyperspace.',
      mobile: 'Use D-pad to steer/thrust, Button A to fire, Button B for Hyperspace.'
    },
    canvasWidth: 800,
    canvasHeight: 600,
    gameClass: 'AsteroidsGame'
  },
  {
    id: 'galaga',
    title: 'Cyber Galaga',
    category: 'Action',
    badge: 'SWARM CAB',
    accentColor: '#00f0ff',
    iconType: 'galaga',
    description: 'Master the classic space dogfight against swooping alien wings, tractor beams, and dual-fighter firepower.',
    tags: ['Galaga', 'Space', 'Shooter', 'Retro', 'Aliens'],
    controls: {
      desktop: 'Left / Right Arrow to steer, Space to fire twin lasers.',
      mobile: 'Use Left / Right D-pad, Button A to fire.'
    },
    canvasWidth: 800,
    canvasHeight: 600,
    gameClass: 'GalagaGame'
  },
  {
    id: 'frogger',
    title: 'Cyber Crossing',
    category: 'Retro',
    badge: 'GRID HOPPER',
    accentColor: '#00ff66',
    iconType: 'frogger',
    description: 'Cross hyper-speed highway lanes and navigate floating data logs to land safely in target bays.',
    tags: ['Frogger', 'Crossing', 'Grid', 'Retro', 'Timing'],
    controls: {
      desktop: 'Arrow keys or W/A/S/D to hop grid sectors.',
      mobile: 'Use directional D-Pad or swipe gestures.'
    },
    canvasWidth: 800,
    canvasHeight: 600,
    gameClass: 'FroggerGame'
  },
  {
    id: 'lunar-lander',
    title: 'Lunar Lander',
    category: 'Action',
    badge: 'GRAVITY CAB',
    accentColor: '#ffb700',
    iconType: 'lander',
    description: 'Manage thrusters and fuel physics to perform pinpoint landings across rocky vector lunar craters.',
    tags: ['Lander', 'Lunar', 'Physics', 'Vector', 'Gravity'],
    controls: {
      desktop: 'Left / Right to rotate, Up Arrow / Space to fire thruster.',
      mobile: 'Use D-pad to pitch lander, Button A to fire thruster.'
    },
    canvasWidth: 800,
    canvasHeight: 600,
    gameClass: 'LunarLanderGame'
  },
  {
    id: 'pinball',
    title: 'Neon Pinball',
    category: 'Classic',
    badge: 'ARCADE TABLE',
    accentColor: '#ff007f',
    iconType: 'pinball',
    description: 'Electric kinetic pinball action with reactive bumpers, dual flippers, drop targets, and score cascades.',
    tags: ['Pinball', 'Arcade', 'Table', 'Physics', 'Neon'],
    controls: {
      desktop: 'A / Left Arrow for Left Flipper, D / Right Arrow for Right Flipper, Down Arrow / Space for Plunger.',
      mobile: 'Left D-pad for Left Flipper, Button A for Right Flipper, Button B for Plunger.'
    },
    canvasWidth: 800,
    canvasHeight: 600,
    gameClass: 'PinballGame'
  }
];

class GameRegistry {
  constructor() {
    this.games = TUNNEL_GAMES;
    this.favorites = JSON.parse(localStorage.getItem('tunnel_favorites') || '[]');
  }

  getAll() {
    return this.games;
  }

  getById(id) {
    return this.games.find(g => g.id === id);
  }

  getCategories() {
    const cats = new Set(['ALL']);
    this.games.forEach(g => cats.add(g.category.toUpperCase()));
    return Array.from(cats);
  }

  filter(category = 'ALL', query = '') {
    let result = this.games;
    if (category === 'FAVORITES') {
      result = result.filter(g => this.isFavorite(g.id));
    } else if (category && category !== 'ALL') {
      result = result.filter(g => g.category.toUpperCase() === category.toUpperCase());
    }

    if (query && query.trim() !== '') {
      const q = query.toLowerCase().trim();
      result = result.filter(g =>
        g.title.toLowerCase().includes(q) ||
        g.description.toLowerCase().includes(q) ||
        g.category.toLowerCase().includes(q) ||
        g.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    return result;
  }

  isFavorite(id) {
    return this.favorites.includes(id);
  }

  toggleFavorite(id) {
    if (this.isFavorite(id)) {
      this.favorites = this.favorites.filter(favId => favId !== id);
    } else {
      this.favorites.push(id);
    }
    localStorage.setItem('tunnel_favorites', JSON.stringify(this.favorites));
    return this.isFavorite(id);
  }

  // Returns clean nostalgic vector SVG glyph for each game
  getGameSvgIcon(iconType, color = '#00f0ff') {
    switch (iconType) {
      case 'tunnel':
        return `<svg viewBox="0 0 48 48" width="48" height="48" fill="none" stroke="${color}" stroke-width="2"><polygon points="24,4 44,16 44,32 24,44 4,32 4,16"/><polygon points="24,12 36,19 36,29 24,36 12,29 12,19" opacity="0.7"/><polygon points="24,19 30,22 30,26 24,29 18,26 18,22" opacity="0.9"/><circle cx="24" cy="24" r="2" fill="${color}"/></svg>`;
      case 'invaders':
        return `<svg viewBox="0 0 48 48" width="48" height="48" fill="none" stroke="${color}" stroke-width="2"><rect x="16" y="10" width="16" height="4" fill="${color}"/><rect x="12" y="14" width="24" height="8" fill="${color}"/><rect x="8" y="22" width="6" height="8" fill="${color}"/><rect x="34" y="22" width="6" height="8" fill="${color}"/><rect x="18" y="22" width="12" height="6" fill="${color}"/><circle cx="18" cy="18" r="2" fill="#05060c"/><circle cx="30" cy="18" r="2" fill="#05060c"/><rect x="22" y="34" width="4" height="8" fill="#ff0055"/></svg>`;
      case 'tetris':
        return `<svg viewBox="0 0 48 48" width="48" height="48" fill="none" stroke="${color}" stroke-width="2"><rect x="14" y="8" width="10" height="10" fill="${color}" fill-opacity="0.3"/><rect x="24" y="8" width="10" height="10" fill="${color}" fill-opacity="0.3"/><rect x="24" y="18" width="10" height="10" fill="${color}" fill-opacity="0.3"/><rect x="24" y="28" width="10" height="10" fill="${color}" fill-opacity="0.3"/><rect x="4" y="28" width="10" height="10" stroke="#00f0ff"/><rect x="14" y="28" width="10" height="10" stroke="#00f0ff"/><rect x="34" y="28" width="10" height="10" stroke="#ff007f"/></svg>`;
      case 'pacmaze':
        return `<svg viewBox="0 0 48 48" width="48" height="48" fill="none" stroke="${color}" stroke-width="2"><path d="M 22,24 L 38,14 A 16,16 0 1,0 38,34 Z" fill="${color}"/><circle cx="20" cy="16" r="2" fill="#05060c"/><circle cx="38" cy="24" r="2.5" fill="#00f0ff"/><circle cx="44" cy="24" r="2.5" fill="#00f0ff"/></svg>`;
      case 'flyer':
        return `<svg viewBox="0 0 48 48" width="48" height="48" fill="none" stroke="${color}" stroke-width="2"><ellipse cx="24" cy="24" rx="14" ry="8" fill="${color}" fill-opacity="0.25"/><circle cx="30" cy="22" r="3" fill="#ffffff"/><path d="M16,24 L6,24 M10,20 L4,20 M10,28 L4,28" stroke="#ff007f" stroke-width="2"/></svg>`;
      case 'solitaire':
        return `<svg viewBox="0 0 48 48" width="48" height="48" fill="none" stroke="${color}" stroke-width="2"><rect x="10" y="8" width="22" height="30" rx="3" stroke="#ffffff" fill="#0f172a"/><path d="M21,18 L21,28 M16,23 L26,23" stroke="#00ff66" stroke-width="2"/><rect x="16" y="12" width="22" height="30" rx="3" stroke="${color}" fill="#0f172a" opacity="0.85"/><text x="27" y="32" font-family="'Press Start 2P', monospace" font-size="12" fill="${color}" text-anchor="middle">A</text></svg>`;
      case 'snake':
        return `<svg viewBox="0 0 48 48" width="48" height="48" fill="none" stroke="${color}" stroke-width="2"><rect x="6" y="14" width="8" height="8" fill="${color}"/><rect x="14" y="14" width="8" height="8" fill="${color}"/><rect x="22" y="14" width="8" height="8" fill="${color}"/><rect x="22" y="22" width="8" height="8" fill="${color}"/><rect x="30" y="22" width="8" height="8" fill="${color}"/><rect x="30" y="30" width="8" height="8" fill="#ffffff"/><circle cx="40" cy="34" r="3" fill="#ff007f"/></svg>`;
      case 'breakout':
        return `<svg viewBox="0 0 48 48" width="48" height="48" fill="none" stroke="${color}" stroke-width="2"><rect x="8" y="10" width="9" height="5" fill="#ff007f"/><rect x="20" y="10" width="9" height="5" fill="#00f0ff"/><rect x="32" y="10" width="9" height="5" fill="#ffb700"/><rect x="8" y="18" width="9" height="5" fill="#00ff66"/><rect x="20" y="18" width="9" height="5" fill="#cc00ff"/><rect x="32" y="18" width="9" height="5" fill="#00f0ff"/><circle cx="24" cy="30" r="3" fill="#ffffff"/><rect x="14" y="38" width="20" height="4" rx="2" fill="${color}"/></svg>`;
      case 'pong':
        return `<svg viewBox="0 0 48 48" width="48" height="48" fill="none" stroke="${color}" stroke-width="2"><rect x="6" y="12" width="4" height="24" fill="${color}"/><rect x="38" y="18" width="4" height="24" fill="#ff0055"/><circle cx="22" cy="24" r="3" fill="#ffffff"/><line x1="24" y1="4" x2="24" y2="44" stroke="rgba(255,255,255,0.2)" stroke-dasharray="4 4"/></svg>`;
      case 'grid2048':
        return `<svg viewBox="0 0 48 48" width="48" height="48" fill="none" stroke="${color}" stroke-width="2"><rect x="6" y="6" width="36" height="36" rx="4" stroke="${color}" fill="#0f1426"/><line x1="24" y1="6" x2="24" y2="42" stroke="rgba(255,255,255,0.2)"/><line x1="6" y1="24" x2="42" y2="24" stroke="rgba(255,255,255,0.2)"/><text x="15" y="20" font-family="'Press Start 2P', monospace" font-size="8" fill="#00f0ff" text-anchor="middle">2</text><text x="33" y="20" font-family="'Press Start 2P', monospace" font-size="8" fill="#ff9900" text-anchor="middle">4</text><text x="15" y="37" font-family="'Press Start 2P', monospace" font-size="8" fill="#ff0055" text-anchor="middle">8</text><text x="33" y="37" font-family="'Press Start 2P', monospace" font-size="8" fill="#ffb700" text-anchor="middle">G</text></svg>`;
      case 'minesweeper':
        return `<svg viewBox="0 0 48 48" width="48" height="48" fill="none" stroke="${color}" stroke-width="2"><rect x="8" y="8" width="32" height="32" rx="3" stroke="${color}" fill="#0f172a"/><circle cx="24" cy="24" r="6" fill="#ff0055"/><line x1="24" y1="12" x2="24" y2="36" stroke="#ff0055" stroke-width="2"/><line x1="12" y1="24" x2="36" y2="24" stroke="#ff0055" stroke-width="2"/><line x1="16" y1="16" x2="32" y2="32" stroke="#ff0055" stroke-width="2"/><line x1="16" y1="32" x2="32" y2="16" stroke="#ff0055" stroke-width="2"/><circle cx="22" cy="22" r="1.5" fill="#ffffff"/></svg>`;
      case 'asteroids':
        return `<svg viewBox="0 0 48 48" width="48" height="48" fill="none" stroke="${color}" stroke-width="2"><polygon points="24,10 32,34 24,29 16,34" fill="#0f172a" stroke="#ffffff"/><polygon points="8,12 14,8 18,12 16,18 10,18" stroke="${color}"/><polygon points="34,26 42,22 44,30 38,36 32,32" stroke="${color}"/><circle cx="24" cy="6" r="1.5" fill="#ff0055"/></svg>`;
      case 'galaga':
        return `<svg viewBox="0 0 48 48" width="48" height="48" fill="none" stroke="${color}" stroke-width="2"><polygon points="24,6 36,24 30,38 24,32 18,38 12,24" fill="${color}" fill-opacity="0.3"/><polygon points="24,14 30,26 18,26" stroke="#ff0055"/><circle cx="24" cy="20" r="2" fill="#ffffff"/><line x1="12" y1="24" x2="4" y2="20" stroke="${color}"/><line x1="36" y1="24" x2="44" y2="20" stroke="${color}"/></svg>`;
      case 'frogger':
        return `<svg viewBox="0 0 48 48" width="48" height="48" fill="none" stroke="${color}" stroke-width="2"><rect x="14" y="14" width="20" height="20" rx="4" fill="${color}" fill-opacity="0.3"/><rect x="8" y="10" width="8" height="8" rx="2" fill="${color}"/><rect x="32" y="10" width="8" height="8" rx="2" fill="${color}"/><rect x="8" y="30" width="8" height="8" rx="2" fill="${color}"/><rect x="32" y="30" width="8" height="8" rx="2" fill="${color}"/><circle cx="18" cy="18" r="2" fill="#05060c"/><circle cx="30" cy="18" r="2" fill="#05060c"/></svg>`;
      case 'lander':
        return `<svg viewBox="0 0 48 48" width="48" height="48" fill="none" stroke="${color}" stroke-width="2"><rect x="16" y="12" width="16" height="14" rx="2" stroke="#ffffff" fill="#0f172a"/><line x1="16" y1="26" x2="10" y2="36" stroke="${color}" stroke-width="2"/><line x1="32" y1="26" x2="38" y2="36" stroke="${color}" stroke-width="2"/><line x1="8" y1="36" x2="12" y2="36" stroke="${color}" stroke-width="2"/><line x1="36" y1="36" x2="40" y2="36" stroke="${color}" stroke-width="2"/><polygon points="22,26 26,26 24,34" fill="#ff0055"/></svg>`;
      case 'pinball':
        return `<svg viewBox="0 0 48 48" width="48" height="48" fill="none" stroke="${color}" stroke-width="2"><path d="M10,40 L10,18 A14,14 0 0,1 38,18 L38,40" stroke="${color}" stroke-width="2"/><circle cx="24" cy="20" r="5" fill="#ff0055"/><line x1="14" y1="38" x2="22" y2="34" stroke="#00f0ff" stroke-width="3"/><line x1="34" y1="38" x2="26" y2="34" stroke="#ff007f" stroke-width="3"/><circle cx="24" cy="28" r="3" fill="#ffffff"/></svg>`;
      default:
        return `<svg viewBox="0 0 48 48" width="48" height="48" fill="none" stroke="${color}" stroke-width="2"><rect x="8" y="8" width="32" height="32" rx="4"/></svg>`;
    }
  }
}

window.tunnelRegistry = new GameRegistry();
