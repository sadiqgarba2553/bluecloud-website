// Tunnel Arcade - Universal Input Manager (Keyboard, Touch, Gamepad)
class InputManager {
  constructor() {
    this.keys = {};
    this.prevKeys = {};
    this.touchActive = false;
    this.gamepadConnected = false;
    this.gamepadIndex = null;
    
    // Virtual touch control state
    this.virtualKeys = {
      up: false,
      down: false,
      left: false,
      right: false,
      actionA: false,
      actionB: false,
      pause: false
    };

    this.setupKeyboard();
    this.setupGamepad();
    this.setupVirtualControls();
  }

  setupKeyboard() {
    window.addEventListener('keydown', (e) => {
      // Prevent scrolling on game keys when arena is open
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

    // Reset keys on window blur
    window.addEventListener('blur', () => {
      this.keys = {};
    });
  }

  setupGamepad() {
    window.addEventListener('gamepadconnected', (e) => {
      console.log(`[InputManager] Gamepad connected at index ${e.gamepad.index}: ${e.gamepad.id}`);
      this.gamepadConnected = true;
      this.gamepadIndex = e.gamepad.index;
      if (window.tunnelApp) {
        window.tunnelApp.showToast(`[ JOYSTICK ] CONTROLLER CONNECTED: ${e.gamepad.id.substring(0, 16)}...`);
      }
    });

    window.addEventListener('gamepaddisconnected', (e) => {
      console.log(`[InputManager] Gamepad disconnected from index ${e.gamepad.index}`);
      if (this.gamepadIndex === e.gamepad.index) {
        this.gamepadConnected = false;
        this.gamepadIndex = null;
      }
    });
  }

  setupVirtualControls() {
    // Touch D-Pad / Buttons event binding
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
    bindBtn('vbtn-pause', 'pause');
  }

  // Update loop called each frame
  update() {
    // Poll Gamepad if available
    if (this.gamepadConnected && navigator.getGamepads) {
      const gamepads = navigator.getGamepads();
      const gp = gamepads[this.gamepadIndex];
      if (gp) {
        // D-Pad / Left Stick
        const deadzone = 0.35;
        this.virtualKeys.left = gp.axes[0] < -deadzone || (gp.buttons[14] && gp.buttons[14].pressed);
        this.virtualKeys.right = gp.axes[0] > deadzone || (gp.buttons[15] && gp.buttons[15].pressed);
        this.virtualKeys.up = gp.axes[1] < -deadzone || (gp.buttons[12] && gp.buttons[12].pressed);
        this.virtualKeys.down = gp.axes[1] > deadzone || (gp.buttons[13] && gp.buttons[13].pressed);

        // Buttons (A / X / RT / Start)
        this.virtualKeys.actionA = (gp.buttons[0] && gp.buttons[0].pressed) || (gp.buttons[7] && gp.buttons[7].pressed);
        this.virtualKeys.actionB = (gp.buttons[1] && gp.buttons[1].pressed) || (gp.buttons[2] && gp.buttons[2].pressed);
        this.virtualKeys.pause = gp.buttons[9] && gp.buttons[9].pressed;
      }
    }

    // Save previous state for edge detection
    this.prevKeys = { ...this.keys, ...this.virtualKeys };
  }

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

  wasPressed(action) {
    const current = this.isDown(action);
    const prev = this._prevCheck(action);
    return current && !prev;
  }

  _prevCheck(action) {
    switch (action) {
      case 'left':
        return !!(this.prevKeys['ArrowLeft'] || this.prevKeys['KeyA'] || this.prevKeys.left);
      case 'right':
        return !!(this.prevKeys['ArrowRight'] || this.prevKeys['KeyD'] || this.prevKeys.right);
      case 'up':
        return !!(this.prevKeys['ArrowUp'] || this.prevKeys['KeyW'] || this.prevKeys.up);
      case 'down':
        return !!(this.prevKeys['ArrowDown'] || this.prevKeys['KeyS'] || this.prevKeys.down);
      case 'actionA':
      case 'jump':
      case 'shoot':
      case 'rotate':
      case 'drop':
        return !!(this.prevKeys['Space'] || this.prevKeys['KeyZ'] || this.prevKeys['KeyJ'] || this.prevKeys['Enter'] || this.prevKeys.actionA);
      case 'actionB':
      case 'hold':
      case 'boost':
        return !!(this.prevKeys['KeyX'] || this.prevKeys['KeyK'] || this.prevKeys['ShiftLeft'] || this.prevKeys['ShiftRight'] || this.prevKeys.actionB);
      case 'pause':
        return !!(this.prevKeys['Escape'] || this.prevKeys['KeyP'] || this.prevKeys.pause);
      default:
        return !!(this.prevKeys[action]);
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
