import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

//texture
const textureLoader = new THREE.TextureLoader();
const doorcolor = textureLoader.load("/textures/door/color.jpg");
const doorAlphaTexture = textureLoader.load("/textures/door/alpha.jpg");
const mat = textureLoader.load("/textures/matcaps/1.png");
const ambient = textureLoader.load("/textures/door/ambientOcclusion.jpg");
const height = textureLoader.load("/textures/door/height.jpg");
const normal = textureLoader.load("/textures/door/normal.jpg");

doorcolor.colorSpace = THREE.SRGBColorSpace;
mat.colorSpace = THREE.SRGBColorSpace;
// const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
// scene.add(ambientLight);
// const pointLight = new THREE.PointLight(0xffffff, 70);
// pointLight.position.set(2, 3, 4);
// scene.add(pointLight);

const rgbloader = new RGBELoader();
rgbloader.load("/textures/environmentMap/2k.hdr", (e) => {
  e.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = e;
  scene.environment = e;
});

//object
// const material = new THREE.MeshBasicMaterial();
// material.map = doorcolor;
// material.transparent = true;
// material.alphaMap = doorAlphaTexture;
// material.side = THREE.DoubleSide;

// const material = new THREE.MeshNormalMaterial();
// material.wireframe = true;

// const material = new THREE.MeshMatcapMaterial();
// material.map = mat;
// material.side = THREE.DoubleSide;

const material = new THREE.MeshStandardMaterial();
material.map = doorcolor;
material.side = THREE.DoubleSide;
material.aoMap = ambient;
material.transparent = true;
material.alphaMap = doorAlphaTexture;
// material.displacementMap = height;
// material.displacementScale = 0.3;
material.normalMap = normal;
material.roughness = 0;
material.metalness = 1;

const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 100, 100), material);
scene.add(plane);

const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 64, 64), material);
scene.add(sphere);
sphere.position.x = -1.5;
const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 64, 128),
  material
);
torus.position.x = 1.5;
scene.add(torus);
/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  plane.rotation.x = elapsedTime * 0.3;
  sphere.rotation.x = elapsedTime * 0.3;
  torus.rotation.x = elapsedTime * 0.3;
  plane.rotation.y = elapsedTime * 0.3;
  sphere.rotation.y = elapsedTime * 0.3;
  torus.rotation.y = elapsedTime * 0.3;
  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
