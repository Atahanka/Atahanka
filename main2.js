import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

console.log("Three.js loaded");

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xd7f1db);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(100, 100, 100);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("cityCanvas"), antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Lights
scene.add(new THREE.AmbientLight(0xffffff, 0.8));
const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
dirLight.position.set(100, 100, 100);
scene.add(dirLight);

// Ground
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(300, 300),
  new THREE.MeshLambertMaterial({ color: 0xd7f1db })
);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// Trees
function createTree(x, z) {
  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.3, 0.3, 1),
    new THREE.MeshStandardMaterial({ color: 0x8b5a2b })
  );
  trunk.position.set(x, 0.5, z);
  const crown = new THREE.Mesh(
    new THREE.SphereGeometry(0.8, 16, 16),
    new THREE.MeshStandardMaterial({ color: 0x9bdd7d })
  );
  crown.position.set(x, 1.5, z);
  scene.add(trunk);
  scene.add(crown);
}
for (let i = 0; i < 50; i++) {
  const x = Math.random() * 250 - 125;
  const z = Math.random() * 250 - 125;
  createTree(x, z);
}

// Roads
const roadMaterial = new THREE.MeshLambertMaterial({ color: 0x999999 });
for (let i = -50; i <= 50; i += 20) {
  const road = new THREE.Mesh(new THREE.BoxGeometry(100, 0.1, 4), roadMaterial);
  road.position.set(0, 0.05, i);
  scene.add(road);

  const vertical = new THREE.Mesh(new THREE.BoxGeometry(4, 0.1, 100), roadMaterial);
  vertical.position.set(i, 0.05, 0);
  scene.add(vertical);
}

// Sidewalks
const walkMaterial = new THREE.MeshLambertMaterial({ color: 0xbbbbbb });
for (let i = -50; i <= 50; i += 20) {
  const hwalk = new THREE.Mesh(new THREE.BoxGeometry(100, 0.1, 2), walkMaterial);
  hwalk.position.set(0, 0.1, i + 3);
  scene.add(hwalk);

  const vwalk = new THREE.Mesh(new THREE.BoxGeometry(2, 0.1, 100), walkMaterial);
  vwalk.position.set(i + 3, 0.1, 0);
  scene.add(vwalk);
}

// Buildings
function createBuilding(x, z, h) {
  const bldg = new THREE.Mesh(
    new THREE.BoxGeometry(5, h, 5),
    new THREE.MeshStandardMaterial({ color: 0xcccccc })
  );
  bldg.position.set(x, h / 2, z);
  scene.add(bldg);
}
for (let i = -40; i <= 40; i += 20) {
  for (let j = -40; j <= 40; j += 20) {
    const h = Math.random() * 10 + 5;
    createBuilding(i, j, h);
  }
}

// Cars
const carGeometry = new THREE.BoxGeometry(2, 1, 1);
const carMaterial = new THREE.MeshLambertMaterial({ color: 0x3333ff });
const cars = [];
for (let i = 0; i < 6; i++) {
  const car = new THREE.Mesh(carGeometry, carMaterial);
  car.position.set(-50 + i * 20, 0.6, -50);
  scene.add(car);
  cars.push({ mesh: car, speed: 0.3 + Math.random() * 0.3, axis: 'x', forward: true });
}

// People
const humanGeometry = new THREE.CylinderGeometry(0.3, 0.3, 1.4, 8);
const humanMaterial = new THREE.MeshLambertMaterial({ color: 0xff6666 });
const people = [];
for (let i = 0; i < 10; i++) {
  const person = new THREE.Mesh(humanGeometry, humanMaterial);
  person.position.set(-40 + i * 8, 0.7, 40);
  scene.add(person);
  people.push({ mesh: person, speed: 0.1 + Math.random() * 0.1, axis: 'z', forward: true });
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();

  // Move cars
  cars.forEach(obj => {
    if (obj.axis === 'x') {
      obj.mesh.position.x += obj.forward ? obj.speed : -obj.speed;
      if (Math.abs(obj.mesh.position.x) > 50) obj.forward = !obj.forward;
    }
  });

  // Move people
  people.forEach(obj => {
    if (obj.axis === 'z') {
      obj.mesh.position.z += obj.forward ? obj.speed : -obj.speed;
      if (Math.abs(obj.mesh.position.z) > 40) obj.forward = !obj.forward;
    }
  });

  renderer.render(scene, camera);
}
animate();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
