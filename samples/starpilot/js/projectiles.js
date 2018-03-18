PROJECTILES = {}

{

let nextProjectileID = 0;
projectiles = {};

const v0 = new THREE.Vector3();
const v1 = new THREE.Vector3();
PROJECTILES.add = (obj, length, origin, end, time, cb) => {
  const dir = v0.copy(end).sub(origin).normalize().clone();
  origin = origin.clone().add(
    dir.clone().multiplyScalar(length/2));
  end = end.clone().sub(
    dir.clone().multiplyScalar(length/2));

  obj.projectileData = {
    origin, end, time, dir, cb,
    id: nextProjectileID,
    distance: origin.distanceTo(end),
    start: performance.now() / 1000,
  }
  projectiles[nextProjectileID] = obj;
  nextProjectileID++;

  obj.position.copy(origin);
  MAIN.scene.add(obj);
}

PROJECTILES.update = () => {
  const now = performance.now() / 1000;
  const toRemove = [];
  for (let id in projectiles) {
    const obj = projectiles[id];
    const pj = obj.projectileData;
    if (now > pj.start + pj.time) {
      MAIN.scene.remove(obj);
      toRemove.push(pj.id);
      pj.cb();
    } else {
      v0.copy(pj.dir);
      obj.position.copy(pj.origin)
                  .add(v0.multiplyScalar(
                       pj.distance * (now - pj.start) / pj.time));
    }
  }
  toRemove.forEach((id) => { delete projectiles[id]; });
}


}
