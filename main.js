import * as THREE from 'https://cdn.skypack.dev/three@0.152.2';
import { OrbitControls } from 'https://cdn.skypack.dev/three/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0d1117);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(20, 20, 20);

const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('cityCanvas'), antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight.position.set(30, 50, 10);
scene.add(dirLight);

function createBuilding(x, z, height, color, label) {
  const geometry = new THREE.BoxGeometry(6, height, 6);
  const material = new THREE.MeshStandardMaterial({ color });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, height / 2, z);
  mesh.userData.label = label;
  scene.add(mesh);
  return mesh;
}

// Buildings representing sections
createBuilding(0, 0, 16, 0xff5f5f, 'Projects');
createBuilding(12, -12, 10, 0x5fff5f, 'Domains');
createBuilding(-12, -12, 10, 0x5f5fff, 'Tools');
createBuilding(-12, 12, 8, 0xffbf00, 'Stats');
createBuilding(12, 12, 6, 0x00bfff, 'Contact');

// Projects floors
const projects = [
  'OmicsCL', 'ADAFAIREA', 'X-Ray Scatter Protection System',
  'PictoSort', 'SOSM', 'Prime Sum Approximation'
];
projects.forEach((name, i) => {
  const geometry = new THREE.BoxGeometry(6, 0.6, 6);
  const material = new THREE.MeshStandardMaterial({ color: 0xff9900 });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(0, 0.6 + i * 0.7, 10);
  mesh.userData.project = name;
  scene.add(mesh);
});

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('click', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children);
  if (intersects.length > 0) {
    const obj = intersects[0].object;
    const data = obj.userData;
    if (data.label) {
      alert('Entering section: ' + data.label);
    } else if (data.project) {
      alert('Viewing project: ' + data.project);
    }
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
