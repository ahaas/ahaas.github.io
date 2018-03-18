CONTROLS = {}

{

CONTROLS.keysPressed = {};

CONTROLS.modes = {
  DISABLED: 0,
  ORBIT: 1,
}

CONTROLS.mode = CONTROLS.modes.ORBIT;

let orbitControls;

CONTROLS.setMode = (mode, camera, renderer) => {
  if (mode == CONTROLS.modes.ORBIT) {
    if (!orbitControls) {
      orbitControls = new THREE.OrbitControls(camera, document);
    }
    orbitControls.enabled = true;
  }
  CONTROLS.mode = mode;
};

const trackedKeyCodes = [];
trackedKeyCodes[16] = 'shift';
trackedKeyCodes[32] = 'space';
trackedKeyCodes[81] = 'q';
trackedKeyCodes[69] = 'e';
trackedKeyCodes[87] = 'w';
trackedKeyCodes[65] = 'a';
trackedKeyCodes[83] = 's';
trackedKeyCodes[68] = 'd';
trackedKeyCodes[67] = 'c';
trackedKeyCodes[27] = 'escape';

document.addEventListener('keydown', (event) => {
  const keyName = trackedKeyCodes[event.keyCode];
  if (keyName) {
    CONTROLS.keysPressed[keyName] = true;
  };
}, false);

document.addEventListener('keyup', (event) => {
  const keyName = trackedKeyCodes[event.keyCode];
  if (keyName) {
    CONTROLS.keysPressed[keyName] = false;
  };
}, false);



}
