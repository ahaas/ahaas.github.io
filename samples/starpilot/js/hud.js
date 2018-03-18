HUD = {};

{

HUD.init = () => {
  HUD.hud = document.createElement('div');
  HUD.hud.classList.add('hud');
  document.body.appendChild(HUD.hud);

  HUD.shipCounts = document.createElement('div');
  HUD.hud.appendChild(HUD.shipCounts);

  HUD.enemyCount = document.createElement('div');
  HUD.shipCounts.appendChild(HUD.enemyCount);
  HUD.friendlyCount = document.createElement('div');
  HUD.shipCounts.appendChild(HUD.friendlyCount);

  HUD.health = document.createElement('div');
  HUD.health.classList.add('health');
  HUD.hud.appendChild(HUD.health);

  HUD.crosshair = document.createElement('canvas');
  HUD.crosshair.classList.add('crosshair');
  document.body.appendChild(HUD.crosshair);
};

HUD.reset = () => {
  HUD.enemyCount.innerHTML = '';
  HUD.friendlyCount.innerHTML = '';
  HUD.health.innerHTML = '';
};

HUD.updateShipCounts = () => {
  if (!LEVEL.localSpaceCraft) {
    HUD.reset();
    return;
  }
  let enemies = 0;
  let friendlies = 0;
  LEVEL.spaceCrafts.forEach((ship) => {
    if (ship.team == LEVEL.teams.local) {
      friendlies++;
    } else if (ship.team == LEVEL.teams.enemy) {
      enemies++;
    }
  });
  HUD.enemyCount.innerHTML = '<span class="enemies">ENEMIES</span> ' + enemies;
  HUD.friendlyCount.innerHTML = '<span class="friendlies">FRIENDLIES</span> ' + friendlies;
};

HUD.updateHealth = () => {
  if (!LEVEL.localSpaceCraft) {
    HUD.reset();
    return;
  }
  HUD.health.innerHTML = LEVEL.localSpaceCraft.kills + ' KILLS<br>' + Math.max(0, LEVEL.localSpaceCraft.health) + ' HEALTH'
};

const v0 = new THREE.Vector3();
HUD.updateCrosshair = () => {
  const ctx = HUD.crosshair.getContext('2d');
  ctx.clearRect(0, 0, HUD.crosshair.width, HUD.crosshair.height);

  if (!LEVEL.localSpaceCraft) {
    return;
  }

  v0.copy(LEVEL.localSpaceCraft.worldFront()).multiplyScalar(500)
    .add(LEVEL.localSpaceCraft.position);
  const windowWidth = Math.max(window.innerWidth, 100)
  const widthHalf = windowWidth/2;
  const heightHalf = window.innerHeight/2;
  v0.project(MAIN.camera);
  const x = v0.x * widthHalf + widthHalf;
  const y = -v0.y * heightHalf + heightHalf;

  ctx.strokeStyle = 'white';
  ctx.strokeRect(x-5, y-5, 10, 10);
  //ctx.fillStyle = 'green';
  //ctx.fillRect(x-5, y-5, 10, 10);
};



}
