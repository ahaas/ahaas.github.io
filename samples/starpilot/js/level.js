LEVEL = {};

{

LEVEL.localSpaceCraft = null;
LEVEL.spaceCrafts = [];
LEVEL.staticObjs = [];
LEVEL.teams = {
  local: 1,
  enemy: 2,
}

LEVEL.teamConfigs = [];
LEVEL.teamConfigs[LEVEL.teams.local] = {
  trailColor: 0xAAAAFF,
  photonColor: 0x88AAFF,
};
LEVEL.teamConfigs[LEVEL.teams.enemy] = {
  trailColor: 0xFF9999,
  photonColor: 0xFF9999,
};

LEVEL.clear = (scene) => {
  scene = MAIN.scene;
  LEVEL.spaceCrafts.forEach((ship) => {
    scene.remove(ship);
    if (ship.line) {
      scene.remove(ship.line);
    }
  });
  if (LEVEL.staticObjs) {
    scene.remove(...LEVEL.staticObjs);
  }
  LEVEL.localSpaceCraft = null;
  LEVEL.spaceCrafts = [];
}

LEVEL.loadLevelNum = (num, scene) => {
  scene = MAIN.scene;
  HUD.reset();
  LEVEL.clear(scene);
  levelSetupFuncs[num](scene);
  if (LEVEL.localSpaceCraft) {
    HUD.updateShipCounts();
    HUD.updateHealth();
  }
  // TODO: FIX THIS
  /*window.setTimeout(() => {
  }, 3000);*/
  SOUNDFX.initLevel();

  MENU.hide();
}

LEVEL.removeShip = (ship) => {
  const i = LEVEL.spaceCrafts.indexOf(ship);
  if (i > -1) { LEVEL.spaceCrafts.splice(i, 1); }
  MAIN.scene.remove(ship.line);
  MAIN.scene.remove(ship);
  HUD.updateShipCounts();

  let enemies = 0;
  LEVEL.spaceCrafts.forEach((ship) => {
    if (ship.team == LEVEL.teams.enemy) {
      enemies++;
    }
  });
  if (enemies == 0) {
    LEVEL.clear();
    MENU.victory();
  }
}

const createLocalSpaceCraft = (scName, scene) => {
  LEVEL.localSpaceCraft = SPACECRAFT.spawners[scName]();
  LEVEL.localSpaceCraft.team = LEVEL.teams.local;

  LEVEL.localSpaceCraft.kills = 0;
  LEVEL.spaceCrafts.push(LEVEL.localSpaceCraft);
  scene.add(LEVEL.localSpaceCraft);
}

const createSpaceCraft = (scName, scene, team) => {
  newSc = SPACECRAFT.spawners[scName]();
  newSc.team = team || LEVEL.teams.enemy;

  LEVEL.spaceCrafts.push(newSc);
  scene.add(newSc);

  return newSc;
}

const levelSetupFuncs = [
  // Level 0: Menu.
  (scene) => {
    LEVEL.staticObjs = ASTEROIDS.populate(scene, 1000);
    createLocalSpaceCraft('dstar', scene);
  },
  // Level 1: Easy small battle.
  (scene) => {
    LEVEL.staticObjs = ASTEROIDS.populate(scene, 1001);
    createLocalSpaceCraft('dstar', scene);
    LEVEL.localSpaceCraft.position.y = -220;

    let enemy
    enemy = createSpaceCraft('dstar', scene, LEVEL.teams.enemy);
    enemy.position.y = 200;
    enemy.position.x = 50;
    enemy.rotateZ(Math.PI);

    enemy = createSpaceCraft('dstar', scene, LEVEL.teams.enemy);
    enemy.position.y = 100;
    enemy.position.x = -50;

    enemy = createSpaceCraft('dstar', scene, LEVEL.teams.local);
    enemy.position.y = -200;
    enemy.position.x = 0;
    enemy.position.z = 100;

    enemy = createSpaceCraft('dstar', scene, LEVEL.teams.local);
    enemy.position.y = -200;
    enemy.position.x = -200;
    enemy.position.z = 150;
  },
  // Level 2: Large battle.
  (scene) => {
    LEVEL.staticObjs = ASTEROIDS.populate(scene, 1001);
    createLocalSpaceCraft('dstar', scene);
    LEVEL.localSpaceCraft.position.y = -1300;

    let enemy;
    const interval = 100;
    for (let i = -4; i <= 4; i++) {
      if (i == 0) continue;
      enemy = createSpaceCraft('dstar', scene, LEVEL.teams.local);
      enemy.position.y = -1000;
      enemy.position.x = i * interval + 50;
      enemy.rotateZ(Math.PI * -.3);
    }
    for (let i = -5; i <= 5; i++) {
      enemy = createSpaceCraft('dstar', scene, LEVEL.teams.enemy);
      enemy.position.y = 1000;
      enemy.position.z = i * interval;
      enemy.rotateZ(Math.PI * 1.3);
    }
    /**/

  },
];



}
