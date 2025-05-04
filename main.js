import * as THREE from './three.module.js';
import { OrbitControls } from './OrbitControls.js';

console.log("Three.js loaded");

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0d1117);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(40, 40, 40);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("cityCanvas"), antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(30, 50, 20);
scene.add(directionalLight);

const groundGeometry = new THREE.PlaneGeometry(200, 200);
const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x222222, side: THREE.DoubleSide });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

const debugBox = new THREE.Mesh(
  new THREE.BoxGeometry(5, 5, 5),
  new THREE.MeshStandardMaterial({ color: 0xffff00 })
);
debugBox.position.set(0, 2.5, 0);
scene.add(debugBox);

function createBuilding(x, z, height, color, label) {
  const geometry = new THREE.BoxGeometry(6, height, 6);
  const material = new THREE.MeshStandardMaterial({ color });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, height / 2, z);
  mesh.userData.label = label;
  scene.add(mesh);
  return mesh;
}

createBuilding(0, -20, 16, 0xff5f5f, 'Projects');
createBuilding(20, -20, 10, 0x5fff5f, 'Domains');
createBuilding(-20, -20, 10, 0x5f5fff, 'Tools');
createBuilding(-20, 0, 8, 0xffbf00, 'Stats');
createBuilding(20, 0, 6, 0x00bfff, 'Contact');

const projects = ['OmicsCL', 'ADAFAIREA', 'X-Ray Scatter Protection System', 'PictoSort', 'SOSM', 'Prime Sum Approximation'];
projects.forEach((name, i) => {
  const floor = new THREE.Mesh(
    new THREE.BoxGeometry(5.5, 0.5, 5.5),
    new THREE.MeshStandardMaterial({ color: 0xff9900 })
  );
  floor.position.set(0, 1 + i * 1.1, -5);
  floor.userData.project = name;
  scene.add(floor);
});

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener("click", (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children);
  if (intersects.length > 0) {
    const obj = intersects[0].object;
    const data = obj.userData;
    if (data.label) alert("Section: " + data.label);
    else if (data.project) alert("Project: " + data.project);
  }
});

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
