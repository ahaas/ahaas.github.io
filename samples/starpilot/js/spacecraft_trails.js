SPACECRAFT_TRAILS = {}

{

const TRAIL_LENGTH = 200;


function getPosHistory(sc, ago) {
  let cursor = (sc.posHistoryCursor - ago) % TRAIL_LENGTH;
  cursor = (cursor + TRAIL_LENGTH) % TRAIL_LENGTH;
  return sc.posHistory[cursor];
}


let time = 0;
let lastUpdate = 0;
SPACECRAFT_TRAILS.update = (scene, delta) => {
  time += delta;

  if (time < lastUpdate + 0.05) {
    return;
  }
  lastUpdate = time;

  LEVEL.spaceCrafts.forEach((sc) => {
    // Initialize posHistory.
    if (sc.posHistory == undefined) {
      sc.posHistory = [];
      sc.posHistoryCursor = 0;
      for (let x = 0; x < TRAIL_LENGTH; x++) {
        sc.posHistory[x] = sc.position.clone();
      }
    }

    // Increment cursor and store new position.
    sc.posHistoryCursor = (sc.posHistoryCursor + 1) % TRAIL_LENGTH;
    const pos = sc.posHistory[sc.posHistoryCursor]

    sc.worldFront(pos);
    pos.multiplyScalar(-15).add(sc.position);

    const material = new THREE.LineBasicMaterial({
      color: LEVEL.teamConfigs[sc.team].trailColor || 0xFFFFFF,
      linewidth: 5,
    });
    let geometry = sc.line && sc.line.geometry;
    if (!geometry) {
      geometry = new THREE.Geometry();
      const line = new THREE.Line(geometry, material);
      for (let i = 0; i < TRAIL_LENGTH; i++) {
        geometry.vertices.push(getPosHistory(sc, i));
      }
      line.frustumCulled = false;
      scene.add(line);
      sc.line = line;
    } else {
      for (let i = 0; i < TRAIL_LENGTH; i++) {
        geometry.vertices[i] = getPosHistory(sc, i);
      }
      geometry.verticesNeedUpdate = true;
    }
  });

}


}
