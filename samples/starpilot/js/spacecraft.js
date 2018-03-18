SPACECRAFT = {};

{

// Load all spaceship models and create spawner funcs.
SPACECRAFT.spawners = {};
SPACECRAFT.localFront = new THREE.Vector3(0, 1, 0);
SPACECRAFT.localFrontAxis = 'y';
SPACECRAFT.localRight = new THREE.Vector3(1, 0, 0);
SPACECRAFT.localRightAxis = 'x';
SPACECRAFT.localUp = new THREE.Vector3(0, 0, 1);
SPACECRAFT.localUpAxis = 'z';

const halfPi = Math.PI / 2;

// Moment is a Vector3 of (pitch, roll, yaw).
const scSpecs = [
  {
    name: 'dstar',
    url: 'models/dstar_threejs/dstar.json',
    mass: 10000,
    radius: 8,
    moment: new THREE.Vector3(5000, 1500, 3000),
    thrust: 5000 * 3,
    reverseThrust: 5000 * 2,
    angularThrust: 10000 * 4,
  },
]
SPACECRAFT.specs = scSpecs;

const tmpQuaternion = new THREE.Quaternion();

const loader = new THREE.JSONLoader();
scSpecs.forEach((scSpec) => {
  loader.load(scSpec.url, function(geo, mats) {
    SPACECRAFT.spawners[scSpec.name] = () => {
      mats[0].emissive.set(0x111111);
      const obj = new THREE.Mesh(geo, mats[0]);
      obj.rotation.x = halfPi;
      obj.rotation.y = halfPi;

      // Wrapper obj is unrotated.
      const wrapperObj = new THREE.Object3D();
      wrapperObj.add(obj);
      wrapperObj.actual = obj;

      // +y is front of ship. +x is right. +z is upwards.
      wrapperObj.worldFront = (vec3) => {
        wrapperObj.getWorldQuaternion(tmpQuaternion);
        return (vec3 || new THREE.Vector3()).copy(SPACECRAFT.localFront)
            .applyQuaternion(tmpQuaternion);
      }

      // Ship initalizers.
      wrapperObj.shipName = scSpec.name;
      PHYSICS.initializeObject(wrapperObj, scSpec);
      WEAPONS.initializeShip(wrapperObj);
      return wrapperObj;
    };
  });
});



}
