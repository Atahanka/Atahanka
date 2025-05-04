import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FontLoader } from './jsm/loaders/FontLoader.js';

console.log("Three.js loaded");

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xe0f7f5);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(80, 60, 80);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('cityCanvas'), antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.maxPolarAngle = Math.PI / 2.1; // prevent camera from going below ground

// LIGHTING
scene.add(new THREE.AmbientLight(0xffffff, 0.8));
const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
dirLight.position.set(50, 100, 50);
scene.add(dirLight);

// EXTENDED GROUND
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(1000, 1000),
  new THREE.MeshLambertMaterial({ color: 0xc5ebdf })
);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// ROAD MATERIAL (curved paths simulated with positioned planes)
const roadMat = new THREE.MeshLambertMaterial({ color: 0xaaaaaa });
function createRoad(x, z, w, h, r = 0) {
  const road = new THREE.Mesh(new THREE.PlaneGeometry(w, h), roadMat);
  road.rotation.x = -Math.PI / 2;
  road.rotation.z = r;
  road.position.set(x, 0.05, z);
  scene.add(road);
}
createRoad(0, 0, 60, 6);         // main road horizontal
createRoad(20, 30, 6, 60);       // main road vertical
createRoad(-30, 20, 40, 6, 0.4); // curved road

// BUILDING CREATION
const fontLoader = new THREE.FontLoader();
let fontReady = false;
let font;
fontLoader.load('./helvetiker_regular.typeface.json', f => {
  font = f;
  fontReady = true;
});

// label + building
function createBuilding(label, x, z, h, color, section) {
  const mat = new THREE.MeshStandardMaterial({ color });
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(5, h, 5), mat);
  mesh.position.set(x, h / 2, z);
  mesh.userData = { label, section };
  scene.add(mesh);

  if (fontReady) {
    const textGeo = new THREE.TextGeometry(label, {
      font,
      size: 1,
      height: 0.1
    });
    const textMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const text = new THREE.Mesh(textGeo, textMat);
    text.position.set(x - 2.5, h + 1, z - 2);
    scene.add(text);
  }
  buildings.push(mesh);
}

// SECTION GROUPS
const buildings = [];
createBuilding("LinkedIn", 10, 0, 10, 0x2978b5, "Contact");
createBuilding("Email", 17, -5, 8, 0xd7263d, "Contact");
createBuilding("GitHub", 25, 4, 12, 0x000000, "Contact");

createBuilding("Academia", -20, -15, 10, 0x414141, "Profile");
createBuilding("Resume", -25, -20, 9, 0x777777, "Profile");

createBuilding("Projects HQ", -10, 20, 14, 0x46b1c9, "TechnoPark");
createBuilding("AI Lab", -18, 24, 12, 0x2a9d8f, "TechnoPark");
createBuilding("Bio Lab", -5, 28, 10, 0xf4a261, "TechnoPark");

// TREES
function plantTree(x, z) {
  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.2, 0.2, 1),
    new THREE.MeshStandardMaterial({ color: 0x8b5a2b })
  );
  trunk.position.set(x, 0.5, z);
  const leaves = new THREE.Mesh(
    new THREE.SphereGeometry(0.6, 12, 12),
    new THREE.MeshStandardMaterial({ color: 0x55aa55 })
  );
  leaves.position.set(x, 1.3, z);
  scene.add(trunk, leaves);
}
for (let i = 0; i < 50; i++) {
  const x = Math.random() * 100 - 50;
  const z = Math.random() * 100 - 50;
  plantTree(x, z);
}

// POPUP INTERACTION
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
window.addEventListener("click", event => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const hits = raycaster.intersectObjects(buildings);
  if (hits.length > 0) {
    const { label, section } = hits[0].object.userData;
    const card = document.getElementById("infoCard");
    document.getElementById("buildingTitle").innerText = label;
    document.getElementById("buildingDesc").innerText = `This is the ${label} building in the ${section} section.`;
    card.classList.remove("hidden");
  }
});

// ANIMATION LOOP
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
