MAIN = {}

{

const renderer = new THREE.WebGLRenderer({
    antialias: true,
    logarithmicDepthBuffer: true,
});
const camera = new THREE.PerspectiveCamera(80, 1, 0.1, 1000 * 1000 * 2);
const scene = new THREE.Scene();
const stats = new Stats();
MAIN.listener = new THREE.AudioListener();
MAIN.camera = camera;
camera.add(MAIN.listener);

MAIN.scene = scene;

const skybox = SKYBOX.construct();

camera.position.set(0, -50, 12);
camera.up.set(0, 0, 1);  // Set +z as up.

renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1)
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
document.body.appendChild(stats.dom);
HUD.init();

//

let prevTime = performance.now();  // Can be replaced with THREE.Clock
let escPressed = false;
function render() {
  requestAnimationFrame(render);

  const time = performance.now();
  // Prevent large delta due to paused animation.
  const delta = Math.min((time - prevTime) / 1000, 0.1);
  prevTime = time;

  PHYSICS.update(delta);
  SPACECRAFT_TRAILS.update(scene, delta);
  SPACECRAFT_AI.update(delta, scene);
  PROJECTILES.update();
  VFX.update();
  camera.getWorldPosition(skybox.position);
  HUD.updateCrosshair();

  if (LEVEL.localSpaceCraft) {
    WEAPONS.update(delta, scene);
    LEVEL.localSpaceCraft.add(camera);
  }
  if (!!CONTROLS.keysPressed['escape'] != escPressed) {
    escPressed = !escPressed;
    if (escPressed) MENU.toggle();
  }

  renderer.render(scene, camera);
  stats.update();
}
render();

const onResize = () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  if (HUD.crosshair) {
    HUD.crosshair.width = window.innerWidth;
    HUD.crosshair.height = window.innerHeight;
  }
};
window.addEventListener('resize', onResize, false);
onResize();


// Lights
const ambient = new THREE.AmbientLight(0x333333);
scene.add(ambient);

const directionalLight = new THREE.DirectionalLight(0xffeedd);
directionalLight.position.set(0, 3, 1);
scene.add(directionalLight);

const dL = new THREE.DirectionalLight(0x555555);
dL.position.set(3, 0, 1);
scene.add(dL);

const hemiLight = new THREE.HemisphereLight(0x555555, 0x111111, 0.5);
scene.add(hemiLight);

// Loading manager
THREE.DefaultLoadingManager.onLoad = () => {
  scene.add(skybox);
  CONTROLS.setMode(CONTROLS.modes.ORBIT, camera, renderer);
  MENU.show();
};

THREE.DefaultLoadingManager.onProgress = (url, numLoaded, numTotal) => {
  console.log('Loading: ' + url + '\nLoaded ' + numLoaded + '/' + numTotal);
};



}
