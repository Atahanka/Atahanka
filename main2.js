import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

console.log("Three.js loaded");

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x0f172a, 0.015);
scene.background = new THREE.Color(0x0f172a);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(50, 50, 50);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("cityCanvas"), antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.outputEncoding = THREE.sRGBEncoding;

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);
const dirLight = new THREE.DirectionalLight(0x00ccff, 1);
dirLight.position.set(30, 100, 30);
scene.add(dirLight);

// Grid ground
const gridSize = 200;
const gridDivisions = 100;
const grid = new THREE.GridHelper(gridSize, gridDivisions, 0x00ffff, 0x003344);
grid.material.opacity = 0.2;
grid.material.transparent = true;
scene.add(grid);

// Stylized building
function createBuilding(x, z, height, color, label) {
  const geometry = new THREE.BoxGeometry(6, height, 6);
  const material = new THREE.MeshStandardMaterial({
    color: color,
    metalness: 0.8,
    roughness: 0.2,
    emissive: color,
    emissiveIntensity: 0.2
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, height / 2, z);
  mesh.userData.label = label;
  scene.add(mesh);
  return mesh;
}

// Section buildings
createBuilding(0, 0, 20, 0x0099ff, 'Projects');
createBuilding(20, 0, 14, 0x66ff66, 'Domains');
createBuilding(-20, 0, 18, 0xff6666, 'Tools');
createBuilding(0, 20, 12, 0xffcc00, 'Stats');
createBuilding(0, -20, 10, 0xcc66ff, 'Contact');

// Project floors (glowing stack)
const projects = ['OmicsCL', 'ADAFAIREA', 'X-Ray Scatter Protection System', 'PictoSort', 'SOSM', 'Prime Sum Approximation'];
projects.forEach((name, i) => {
  const floor = new THREE.Mesh(
    new THREE.BoxGeometry(5.5, 0.6, 5.5),
    new THREE.MeshStandardMaterial({
      color: 0xff9900,
      emissive: 0xff6600,
      emissiveIntensity: 0.4,
      metalness: 0.6,
      roughness: 0.3
    })
  );
  floor.position.set(30, 1 + i * 0.8, 0);
  floor.userData.project = name;
  scene.add(floor);
});

// Interaction
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
