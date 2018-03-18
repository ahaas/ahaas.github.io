SKYBOX = {};

{

const loader = new THREE.TextureLoader();
const imagePrefix = "img/skybox_";
const directions  = ["LF", "RT", "FR", "BK", "UP", "DN"];
const imageSuffix = ".jpg";
const s = 1000 * 1000;
const skyGeometry = new THREE.CubeGeometry(s, s, s);

const materialArray = [];
for (let i = 0; i < 6; i++) {
  loader.load(imagePrefix + directions[i] + imageSuffix, (texture) => {
    materialArray.push( new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.BackSide
    }));
  });
}

SKYBOX.construct = () => {
  const skyBox = new THREE.Mesh(skyGeometry, materialArray);
  return skyBox;
}



}
