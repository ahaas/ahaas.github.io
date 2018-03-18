VFX = {}

{

explosions = [];

VFX.explode = (pos, size, duration, colorStart, colorEnd) => {
  const geo = new THREE.SphereGeometry(1, 32, 16);
  const mat = new THREE.MeshBasicMaterial({ color: colorStart });
  //mat.side = THREE.DoubleSide;
  mat.transparent = true;
  const explosion = new THREE.Mesh(geo, mat);

  explosion.position.copy(pos);
  explosion.colorStart = new THREE.Color().set(colorStart);
  explosion.colorEnd = new THREE.Color().set(colorEnd);
  explosion.duration = duration;
  explosion.size = size;
  explosion.start = performance.now() / 1000;

  MAIN.scene.add(explosion);
  explosions.push(explosion);
};

const c0 = new THREE.Color();
VFX.update = () => {
  const now = performance.now() / 1000;
  explosions.forEach((ex, i) => {
    if (!ex) {
      return;
    }
    if (now > ex.start + ex.duration) {
      MAIN.scene.remove(ex);
      explosions[i] = undefined;
    }
    const frac = (now - ex.start)/ex.duration;

    const s = frac * ex.size + 0.0001;
    ex.scale.set(s, s, s);

    ex.material.opacity = 1 - frac;
    ex.material.color.copy(ex.colorStart);
    ex.material.color.lerp(ex.colorEnd, frac);
  });
}


}
