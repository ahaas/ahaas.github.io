(function() {

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(
  80, window.innerWidth / window.innerHeight, 0.1, 20000);
camera.up.set(0, 0, 1);  // Set +z as up

var DPR = (window.devicePixelRatio) ? window.devicePixelRatio : 1;
var renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1)
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var controls = new THREE.OrbitControls( camera, renderer.domElement );

function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);

  if (cube) {
    cube.rotation.x += 0.005;
    cube.rotation.y += 0.005;
  }
}
render();

window.addEventListener('resize', function() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}, false);

var geometry = new THREE.BoxGeometry(1, 1, 1);
var material = new THREE.MeshBasicMaterial({color: 0x00ff00});
var cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5

////////////
// SKYBOX //
////////////

var axes = new THREE.AxisHelper(100);
scene.add( axes );

var imagePrefix = "img/skybox_";
var directions  = ["LF", "RT", "FR", "BK", "UP", "DN"];
var imageSuffix = ".jpg";
var skyGeometry = new THREE.CubeGeometry( 5000, 5000, 5000 ); 

var materialArray = [];
for (var i = 0; i < 6; i++)
  materialArray.push( new THREE.MeshBasicMaterial({
    map: THREE.ImageUtils.loadTexture( imagePrefix + directions[i] + imageSuffix ),
    side: THREE.BackSide
  }));
var skyMaterial = new THREE.MeshFaceMaterial( materialArray );
var skyBox = new THREE.Mesh( skyGeometry, skyMaterial );
scene.add( skyBox );

})();
