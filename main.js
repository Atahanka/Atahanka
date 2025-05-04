import * as THREE from 'https://cdn.skypack.dev/three@0.152.2';
import { OrbitControls } from 'https://cdn.skypack.dev/three/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(20, 20, 20);

const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('cityCanvas'), antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 20, 10);
scene.add(directionalLight);

function createBuilding(x, z, height, color, label) {
  const geometry = new THREE.BoxGeometry(4, height, 4);
  const material = new THREE.MeshStandardMaterial({ color });
  const building = new THREE.Mesh(geometry, material);
  building.position.set(x, height / 2, z);
  building.userData.label = label;
  scene.add(building);
  return building;
}

const buildings = [
  createBuilding(0, 0, 10, 0xff5555, 'Projects'),
  createBuilding(10, 0, 6, 0x55ff55, 'Domains'),
  createBuilding(-10, 0, 8, 0x5555ff, 'Tools')
];

// Add interactive Projects building floors
for (let i = 0; i < 6; i++) {
  const floor = new THREE.Mesh(
    new THREE.BoxGeometry(4, 0.4, 4),
    new THREE.MeshStandardMaterial({ color: 0xff9900 })
  );
  floor.position.set(0, 0.4 + i * 0.6, 10);
  floor.userData = { project: `Project ${i + 1}` };
  scene.add(floor);
}

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('click', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children);
  if (intersects.length > 0) {
    const obj = intersects[0].object;
    alert(obj.userData.label || obj.userData.project || 'No data');
  }
});

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
