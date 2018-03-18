// UNUSED

SPACECRAFT_PARTICLES = {}

{

const particleSystem = new THREE.GPUParticleSystem({
  maxParticles: 250000,
});

SPACECRAFT_PARTICLES.initialize = (scene) => {
  scene.add(particleSystem);
}

// Syntax??
const optionsFactory = () => {
			options = {
				position: new THREE.Vector3(),
				positionRandomness: .3,
				velocity: new THREE.Vector3(),
				velocityRandomness: .5,
				color: 0xaa88ff,
				colorRandomness: .2,
				turbulence: .5,
				lifetime: 2,
				size: 5,
				sizeRandomness: 1
			};
return options;
  return {
    position: new THREE.Vector3(),
    positionRandomness: 0.3,
    velocity: new THREE.Vector3(),
    velocityRandomnesss: 0.5,
    color: 0x999999,
    colorRandomness: 0.2,
    turbulence: 0.1,
    lifetime: 5,
    size: 5,
    sizeRandomness: 5,
  };
};

const optionsPassive = optionsFactory();
const optionsThrust = optionsFactory();
optionsThrust.size = 10;
optionsThrust.sizeRandomness = 10;
optionsThrust.color = 0xAA88FF;

let tick = 0;
SPACECRAFT_PARTICLES.animate = (delta) => {
  tick += delta;
  // Read ships from LEVEL.spaceCrafts and add new particles.
  LEVEL.spaceCrafts.forEach((sc) => {
    if (sc.isThrusting) {
      optionsThrust.position.copy(sc.position);
      console.log(optionsThrust);
      for (let x = 0; x < 10000 * delta; x++) {
        particleSystem.spawnParticle(optionsThrust);
      }
    } else {
      optionsPassive.position.copy(sc.position);
      for (let x = 0; x < 10000 * delta; x++) {
        particleSystem.spawnParticle(optionsPassive);
      }
    }
  });

  particleSystem.update(tick);
};



}
