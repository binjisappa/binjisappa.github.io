import "./style.css";

import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const scene = new THREE.Scene();

//Setup Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

renderer.render(scene, camera);

//Adding Donut
const geometry = new THREE.TorusBufferGeometry(10, 3, 16, 100);
//const material = new THREE.MeshBasicMaterial({
//  color: 0xff6347,
//  wireframe: true,
//});
const material = new THREE.MeshStandardMaterial({
  color: 0xff6347,
});
const torus = new THREE.Mesh(geometry, material);
scene.add(torus);

//Lights
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);
const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

//Helper gadgets
const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(lightHelper, gridHelper);

//enable controller
const controls = new OrbitControls(camera, renderer.domElement); //listens to dom actions on mouse

//Random stars
function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24); //radius of 0.25
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100)); //rand generates num between -100 and 100

  star.position.set(x, y, z);
  scene.add(star);
}
Array(200).fill().forEach(addStar); //creates array of 200 values

//background sky graphic
const spaceTexture = new THREE.TextureLoader().load("space.jpg");
scene.background = spaceTexture;

//Textured Cube
const funnyTexture = new THREE.TextureLoader().load("download.png");
const laugh = new THREE.Mesh(
  new THREE.BoxGeometry(3, 3, 3),
  new THREE.MeshBasicMaterial({ map: funnyTexture })
);
scene.add(laugh);

//Moon
const moonTexture = new THREE.TextureLoader().load("moon.jpg");
const normalTexture = new THREE.TextureLoader().load("normal.jpg");
const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    normalMap: normalTexture,
  })
);
scene.add(moon);

moon.position.z = 30;
moon.position.setX(-10); //these are 2 different ways you can set the position

function moveCamera() {
  const t = document.body.getBoundingClientRect().top; //this will calculate how far to the top of our webpage
  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.05;

  laugh.rotation.y += 0.01;
  laugh.rotation.z += 0.01;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.position.y = t * -0.0002;
}
document.body.onscroll = moveCamera; //moveCamera function will fire everytime user scrolls

function animate() {
  requestAnimationFrame(animate);

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  controls.update();

  renderer.render(scene, camera);
}

animate();

//https://www.youtube.com/watch?v=Q7AOvWpIVHU
