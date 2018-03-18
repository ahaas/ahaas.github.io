SPACECRAFT_AI = {};

{

SPACECRAFT_AI.update = (delta, scene) => {
  LEVEL.spaceCrafts.forEach((sc) => {
    if (sc != LEVEL.localSpaceCraft) {
      simulate(sc);
    }
  });
}

const states = {
  attack: 2,  // Attack nearest enemy by aiming and keeping in range.
  flee: 3,  // Move away from nearest enemy.
  wait: 4,  // no inputs
}

const MIN_STATE_CHANGE_INTERVAL = 5;
const v2 = new THREE.Vector3();
const v3 = new THREE.Vector3();
const v4 = new THREE.Vector3();
const m1 = new THREE.Matrix4();
const simulate = (sc) => {
  const now = performance.now() / 1000;
  const nearest = nearestEnemy(sc);
  if (!nearest) {
    sc.ai.state = states.wait;
    resetInputs(sc);
    return;
  }

  if (sc.ai == undefined) {
    sc.ai = {
      state: states.attack,
      lastStateChange: now,
    }
  }

  // Update state, if possible.
  if (now > sc.ai.lastStateChange + MIN_STATE_CHANGE_INTERVAL) {
    sc.ai.lastStateChange = now;

    const dist = sc.position.distanceTo(nearest.position);
    if (dist > 100) {
      sc.ai.state = states.attack;
    } else {
      sc.ai.state = states.flee;
    }
  }

  const dir = v2.copy(posInLocalSpace(sc, nearest));
  const onRight = dir.x > 0;
  const onTop = dir.z > 0;
  const lookingTowards = shipAngle(sc, nearest) < Math.PI * 0.10;  // 45 deg

  // Get pitch angle to target. Positive means above.
  v3.copy(dir);
  v3.x = 0;
  const pitchAng = SPACECRAFT.localFront.angleTo(v3) * (onTop ? 1 : -1);

  // Get roll angle from, from -90 to 90 degrees. Positive means on right.
  v3.copy(dir);
  v3.y = 0;
  const rollAng = SPACECRAFT.localUp.angleTo(v3) * (onRight ? 1 : -1);

  sc.worldFront(v4);
  const forwardSpeed = v4.dot(sc.vel);

  //sc.ai.state = states.attack; // DEBUG

  // Act based on state.
  resetInputs(sc);

  const STEER_AGGRO = 1;  // LOWER IS MORE AGGRESSIVE.
  if (sc.ai.state == states.attack) {
    //console.log(dir.y, forwardSpeed);
    sc.inputs.thrust = lookingTowards && dir.y - forwardSpeed * 5 > 0;
    sc.inputs.thrustReverse = !sc.inputs.thrust;

    sc.inputs.rollRight = rollAng - sc.angVel.y * STEER_AGGRO > 0;
    sc.inputs.rollLeft = !sc.inputs.rollRight;

    // TODO: Only pitch up/down if roll ang is not too great. Otherwise pitch
    // is misdirected.
    sc.inputs.pitchUp = pitchAng - sc.angVel.x * STEER_AGGRO > 0;
    sc.inputs.pitchDown = !sc.inputs.pitchUp;
    //console.log(pitchAng, sc.angVel.x, sc.inputs.pitchUp);
  } else if (sc.ai.state == states.flee) {
    sc.inputs.thrust = true;
  }

  // Fire if target is within cone.
  sc.inputs.fire = shipAngle(sc, nearest) < Math.PI * 0.03;
}

const nearestEnemy = (ship) => {
  let closestDist = 1e10;
  let closestShip = null;
  LEVEL.spaceCrafts.forEach((otherShip) => {
    if (otherShip.team == ship.team) {
      return;
    }
    const dist = otherShip.position.distanceTo(ship.position);
    if (dist < closestDist) {
      closestDist = dist;
      closestShip = otherShip;
    }
  });

  return closestShip;
};

const v0 = new THREE.Vector3();
const v1 = new THREE.Vector3();
const m0 = new THREE.Matrix4();

const shipAngle = (ship, target) => {
  v0.copy(target.position).sub(ship.position);
  ship.worldFront(v1);
  const angle = v0.angleTo(v1);  // Angle between 0 and pi.
  return angle;
  return angle < Math.PI / 2;
};

const posInLocalSpace = (ship, target) => {
  m0.getInverse(ship.matrix);
  v0.copy(target.position);
  v0.applyMatrix4(m0);
  return v0;
}

const resetInputs = (ship) => {
  for (const input in PHYSICS.inputMap) {
    ship.inputs[input] = false;
  }
}


}
