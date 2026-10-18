// Tunnel Arcade - Universal Input Manager (1P, 2P Local, Touch, Gamepads)
class InputManager {
  constructor() {
    this.keys = {};
    this.prevKeys = {};
    this.gamepads = [];
    
    // Virtual touch control state
    this.virtualKeys = {
      up: false,
      down: false,
      left: false,
      right: false,
      actionA: false,
      actionB: false,
      pause: false,
      // P2 Touch Controls
      p2_up: false,
      p2_down: false,
      p2_left: false,
      p2_right: false,
      p2_actionA: false
    };

    this.setupKeyboard();
    this.setupGamepad();
    this.setupVirtualControls();
  }

  setupKeyboard() {
    window.addEventListener('keydown', (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
        if (document.body.classList.contains('in-game')) {
          e.preventDefault();
        }
      }
      this.keys[e.code] = true;
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });

    window.addEventListener('blur', () => {
      this.keys = {};
    });
  }

  setupGamepad() {
    window.addEventListener('gamepadconnected', (e) => {
      console.log(`[InputManager] Controller ${e.gamepad.index} connected: ${e.gamepad.id}`);
      if (window.tunnelApp) {
        window.tunnelApp.showToast(`[ JOYSTICK ] CONTROLLER P${e.gamepad.index + 1} CONNECTED`);
      }
    });
  }

  setupVirtualControls() {
    const bindBtn = (id, keyName) => {
      const btn = document.getElementById(id);
      if (!btn) return;

      const press = (e) => {
        e.preventDefault();
        this.virtualKeys[keyName] = true;
        btn.classList.add('active');
        if (window.tunnelAudio) window.tunnelAudio.play('move');
      };

      const release = (e) => {
        e.preventDefault();
        this.virtualKeys[keyName] = false;
        btn.classList.remove('active');
      };

      btn.addEventListener('touchstart', press, { passive: false });
      btn.addEventListener('touchend', release, { passive: false });
      btn.addEventListener('touchcancel', release, { passive: false });
      btn.addEventListener('mousedown', press);
      btn.addEventListener('mouseup', release);
      btn.addEventListener('mouseleave', release);
    };

    bindBtn('vpad-up', 'up');
    bindBtn('vpad-down', 'down');
    bindBtn('vpad-left', 'left');
    bindBtn('vpad-right', 'right');
    bindBtn('vbtn-a', 'actionA');
    bindBtn('vbtn-b', 'actionB');
  }

  update() {
    // Poll Gamepads (GP0 = P1, GP1 = P2)
    if (navigator.getGamepads) {
      const gps = navigator.getGamepads();
      const deadzone = 0.35;
      
      // GP 0 (Player 1)
      if (gps[0]) {
        const gp = gps[0];
        this.virtualKeys.left = gp.axes[0] < -deadzone || (gp.buttons[14] && gp.buttons[14].pressed);
        this.virtualKeys.right = gp.axes[0] > deadzone || (gp.buttons[15] && gp.buttons[15].pressed);
        this.virtualKeys.up = gp.axes[1] < -deadzone || (gp.buttons[12] && gp.buttons[12].pressed);
        this.virtualKeys.down = gp.axes[1] > deadzone || (gp.buttons[13] && gp.buttons[13].pressed);
        this.virtualKeys.actionA = (gp.buttons[0] && gp.buttons[0].pressed) || (gp.buttons[7] && gp.buttons[7].pressed);
        this.virtualKeys.actionB = (gp.buttons[1] && gp.buttons[1].pressed) || (gp.buttons[2] && gp.buttons[2].pressed);
        this.virtualKeys.pause = gp.buttons[9] && gp.buttons[9].pressed;
      }

      // GP 1 (Player 2)
      if (gps[1]) {
        const gp2 = gps[1];
        this.virtualKeys.p2_left = gp2.axes[0] < -deadzone || (gp2.buttons[14] && gp2.buttons[14].pressed);
        this.virtualKeys.p2_right = gp2.axes[0] > deadzone || (gp2.buttons[15] && gp2.buttons[15].pressed);
        this.virtualKeys.p2_up = gp2.axes[1] < -deadzone || (gp2.buttons[12] && gp2.buttons[12].pressed);
        this.virtualKeys.p2_down = gp2.axes[1] > deadzone || (gp2.buttons[13] && gp2.buttons[13].pressed);
        this.virtualKeys.p2_actionA = gp2.buttons[0] && gp2.buttons[0].pressed;
      }
    }

    this.prevKeys = { ...this.keys, ...this.virtualKeys };
  }

  // General 1-Player checking
  isDown(action) {
    switch (action) {
      case 'left':
        return !!(this.keys['ArrowLeft'] || this.keys['KeyA'] || this.virtualKeys.left);
      case 'right':
        return !!(this.keys['ArrowRight'] || this.keys['KeyD'] || this.virtualKeys.right);
      case 'up':
        return !!(this.keys['ArrowUp'] || this.keys['KeyW'] || this.virtualKeys.up);
      case 'down':
        return !!(this.keys['ArrowDown'] || this.keys['KeyS'] || this.virtualKeys.down);
      case 'actionA':
      case 'jump':
      case 'shoot':
      case 'rotate':
      case 'drop':
        return !!(this.keys['Space'] || this.keys['KeyZ'] || this.keys['KeyJ'] || this.keys['Enter'] || this.virtualKeys.actionA);
      case 'actionB':
      case 'hold':
      case 'boost':
        return !!(this.keys['KeyX'] || this.keys['KeyK'] || this.keys['ShiftLeft'] || this.keys['ShiftRight'] || this.virtualKeys.actionB);
      case 'pause':
        return !!(this.keys['Escape'] || this.keys['KeyP'] || this.virtualKeys.pause);
      default:
        return !!(this.keys[action] || this.virtualKeys[action]);
    }
  }

  // Dedicated Player 1 Controls (WASD + Space + F)
  isP1Down(action) {
    switch (action) {
      case 'up': return !!(this.keys['KeyW'] || this.virtualKeys.up);
      case 'down': return !!(this.keys['KeyS'] || this.virtualKeys.down);
      case 'left': return !!(this.keys['KeyA'] || this.virtualKeys.left);
      case 'right': return !!(this.keys['KeyD'] || this.virtualKeys.right);
      case 'actionA': return !!(this.keys['Space'] || this.keys['KeyF'] || this.virtualKeys.actionA);
      default: return this.isDown(action);
    }
  }

  // Dedicated Player 2 Controls (Arrow Keys + Enter + L)
  isP2Down(action) {
    switch (action) {
      case 'up': return !!(this.keys['ArrowUp'] || this.virtualKeys.p2_up);
      case 'down': return !!(this.keys['ArrowDown'] || this.virtualKeys.p2_down);
      case 'left': return !!(this.keys['ArrowLeft'] || this.virtualKeys.p2_left);
      case 'right': return !!(this.keys['ArrowRight'] || this.virtualKeys.p2_right);
      case 'actionA': return !!(this.keys['Enter'] || this.keys['KeyL'] || this.virtualKeys.p2_actionA);
      default: return false;
    }
  }

  wasPressed(action) {
    return this.isDown(action) && !this._prevCheck(action);
  }

  wasP1Pressed(action) {
    return this.isP1Down(action) && !this._prevP1Check(action);
  }

  wasP2Pressed(action) {
    return this.isP2Down(action) && !this._prevP2Check(action);
  }

  _prevCheck(action) {
    switch (action) {
      case 'left': return !!(this.prevKeys['ArrowLeft'] || this.prevKeys['KeyA'] || this.prevKeys.left);
      case 'right': return !!(this.prevKeys['ArrowRight'] || this.prevKeys['KeyD'] || this.prevKeys.right);
      case 'up': return !!(this.prevKeys['ArrowUp'] || this.prevKeys['KeyW'] || this.prevKeys.up);
      case 'down': return !!(this.prevKeys['ArrowDown'] || this.prevKeys['KeyS'] || this.prevKeys.down);
      case 'actionA': return !!(this.prevKeys['Space'] || this.prevKeys['KeyZ'] || this.prevKeys['KeyJ'] || this.prevKeys['Enter'] || this.prevKeys.actionA);
      case 'actionB': return !!(this.prevKeys['KeyX'] || this.prevKeys['KeyK'] || this.prevKeys['ShiftLeft'] || this.prevKeys['ShiftRight'] || this.prevKeys.actionB);
      case 'pause': return !!(this.prevKeys['Escape'] || this.prevKeys['KeyP'] || this.prevKeys.pause);
      default: return !!(this.prevKeys[action]);
    }
  }

  _prevP1Check(action) {
    switch (action) {
      case 'up': return !!(this.prevKeys['KeyW'] || this.prevKeys.up);
      case 'down': return !!(this.prevKeys['KeyS'] || this.prevKeys.down);
      case 'left': return !!(this.prevKeys['KeyA'] || this.prevKeys.left);
      case 'right': return !!(this.prevKeys['KeyD'] || this.prevKeys.right);
      case 'actionA': return !!(this.prevKeys['Space'] || this.prevKeys['KeyF'] || this.prevKeys.actionA);
      default: return this._prevCheck(action);
    }
  }

  _prevP2Check(action) {
    switch (action) {
      case 'up': return !!(this.prevKeys['ArrowUp'] || this.prevKeys.p2_up);
      case 'down': return !!(this.prevKeys['ArrowDown'] || this.prevKeys.p2_down);
      case 'left': return !!(this.prevKeys['ArrowLeft'] || this.prevKeys.p2_left);
      case 'right': return !!(this.prevKeys['ArrowRight'] || this.prevKeys.p2_right);
      case 'actionA': return !!(this.prevKeys['Enter'] || this.prevKeys['KeyL'] || this.prevKeys.p2_actionA);
      default: return false;
    }
  }

  reset() {
    this.keys = {};
    this.prevKeys = {};
    for (let k in this.virtualKeys) {
      this.virtualKeys[k] = false;
    }
  }
}

window.tunnelInput = new InputManager();
