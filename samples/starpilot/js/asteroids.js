ASTEROIDS = {}

{

const spawners = [];

const loader = new THREE.JSONLoader();
loader.load('models/asteroid1_threejs/asteroid1.json', (geo, mats) => {
  spawners.push(() => {
    const obj = new THREE.Mesh(geo, mats[0]);
    obj.scale.set(100, 100, 100);
    return obj;
  });
});
loader.load('models/asteroid1_threejs/asteroid2.json', (geo, mats) => {
  spawners.push(() => {
    const obj = new THREE.Mesh(geo, mats[0]);
    obj.scale.set(60, 60, 60);
    return obj;
  });
});

ASTEROIDS.populate = (scene, seed) => {
  const rand = new Random(seed + 9999);
  const genX = (max) => (rand.next() % (max * 2)) - max;
  const newAsts = [];
  for (let i=0; i < 500; i++) {
    const ast = spawners[i % spawners.length]();
    ast.position.x = genX(5000);
    ast.position.y = genX(5000);
    ast.position.z = genX(1000);
    ast.rotation.x = rand.nextFloat() * Math.PI * 2;
    ast.rotation.y = rand.nextFloat() * Math.PI * 2;
    ast.rotation.z = rand.nextFloat() * Math.PI * 2;
    const baseScale = rand.floatRange(20, 150);
    ast.scale.set(
        baseScale * rand.floatRange(0.8, 1),
        baseScale * rand.floatRange(0.8, 1),
        baseScale * rand.floatRange(0.8, 1),
    )
    scene.add(ast);
    ast.staticObjRadius = baseScale * 0.9;
    newAsts.push(ast);
  }
  return newAsts;
}


}
