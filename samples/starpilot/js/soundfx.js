SOUNDFX = {}

{

let photonBuffer;
let photonBufferDistant;
let expl1Buffer, expl2Buffer;
let hitBuffer;

const audioLoader = new THREE.AudioLoader();
audioLoader.load('sounds/photon.ogg', (buffer) => {
  photonBuffer = buffer;
});
audioLoader.load('sounds/photon_distant.ogg', (buffer) => {
  photonBufferDistant = buffer;
});
audioLoader.load('sounds/expl1.ogg', (buffer) => {
  expl1Buffer = buffer;
});
audioLoader.load('sounds/expl2.ogg', (buffer) => {
  expl2Buffer = buffer;
});
audioLoader.load('sounds/hit.ogg', (buffer) => {
  hitBuffer = buffer;
});

SOUNDFX.initLevel = () => {
  console.log('SOUNDFX INIT LEVEL', photonBuffer, photonBufferDistant);
  LEVEL.spaceCrafts.forEach((ship) => {
    const sound = new THREE.PositionalAudio(MAIN.listener);
    if (ship == LEVEL.localSpaceCraft) {
      sound.setBuffer(photonBuffer);
    } else {
      sound.setBuffer(photonBufferDistant);
      sound.setVolume(0.6);
      sound.setRolloffFactor(0.3);
    }
    sound.setRefDistance(20);
    ship.add(sound);
    ship.photonSound = sound;

    const hitSound = new THREE.PositionalAudio(MAIN.listener);
    hitSound.setBuffer(hitBuffer);
    hitSound.setRefDistance(20);
    ship.add(hitSound);
    ship.hitSound = hitSound;

    const explSound = new THREE.PositionalAudio(MAIN.listener);
    if (Math.random() < 0.5) {
      explSound.setBuffer(expl1Buffer);
    } else {
      explSound.setBuffer(expl2Buffer);
    }
    explSound.setRefDistance(100);
    explSound.setRolloffFactor(0.2);
    ship.add(explSound);
    ship.explSound = explSound;
  });
}

SOUNDFX.fireShip = (ship) => {
  if (ship.photonSound.isPlaying) ship.photonSound.stop();
  ship.photonSound.play();
}

SOUNDFX.hitShip = (ship) => {
  if (ship.hitSound.isPlaying) ship.hitSound.stop();
  ship.hitSound.play();
}

SOUNDFX.explShip = (ship) => {
  MAIN.scene.add(ship.explSound);
  ship.explSound.position.copy(ship.position);
  ship.explSound.play();
}



}
