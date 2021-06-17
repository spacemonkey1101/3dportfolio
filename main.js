import './style.css'

//import the 3js library
import * as THREE from 'three' ;
//import * as THREE from 'https://unpkg.com/three@0.124.0/build/three.module.js';

//allow us to move around using mouse
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
//import { OrbitControls } from 'https://unpkg.com/three/examples/jsm/controls/OrbitControls.js';

/*we need 3 objects to start
Scene , Camera and a renderer*/

//scene is a continer which holds everything together
const scene = new THREE.Scene()

//camera is required to see things in the scene
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/ window.innerHeight,0.1 , 1000) 
// arguments: field of view , aspect ratio , view frustum

//renderer renders the graphics on to the screen
const renderer =  new THREE.WebGL1Renderer({
  canvas: document.querySelector('#bg'),
})

renderer.setPixelRatio(window.devicePixelRatio)
//full screen cnvs
renderer.setSize(window.innerWidth, window.innerHeight)

//set camera position
camera.position.setZ(30)

//draw
renderer.render(scene,camera)

//add an object
const geometry = new THREE.TorusGeometry(10,3,16,100)

//material = wrapping paper for the object
//so that geometry can get the color and other propertis  
//const material = new THREE.MeshBasicMaterial({color: 0xFF6347 , wireframe : true})
//from mesh basic material to mesh standard material with reacts to light
const material = new THREE.MeshStandardMaterial({color: 0xFF6347 })
//mesh = geomerty + materia;
const torus = new THREE.Mesh(geometry,material)

//add object to the scene
scene.add(torus)

//adding a light
const pointLight = new THREE.PointLight(0xffffff)
const ambientLight = new THREE.AmbientLight(0xffffff)
//move it away from the center
pointLight.position.set(20,20,20)

scene.add(pointLight,ambientLight)

//lighthelper to show us the position of point light
const lightHelper = new THREE.PointLightHelper(pointLight)
//gridhelper draws a 2d grid around the scene
const gridHelper = new THREE.GridHelper(200,50);
scene.add(lightHelper,gridHelper)

//listen to dom events on the mouse and update the camera positions
const controls = new OrbitControls(camera,renderer.domElement);

function addStar() {
  const geomerty = new THREE.SphereGeometry(0.25,24,24);
  const material = new THREE.MeshStandardMaterial({color: 0xffffff });
  //mesh
  const star = new THREE.Mesh(geomerty , material);

  //random position of each star
  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set( x,y,z);
  scene.add(star)
}

Array(200).fill().forEach(addStar)

//get the space image to the scene
const spaceTexture = new THREE.TextureLoader().load('space.jpg');
scene.background = spaceTexture

//get the Authors image
const ritamTexture = new THREE.TextureLoader().load('ritam.jpg')
const ritam = new THREE.Mesh(
  new THREE.BoxGeometry(3,3,3),
  new THREE.MeshBasicMaterial( { map: ritamTexture } )
)


const moonTexture = new THREE.TextureLoader().load('moon.jpg')
//a 'normal map' for realistic effect to the moon
const normalTexture = new THREE.TextureLoader().load('normal.jpg')

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3,32,32),
  new THREE.MeshStandardMaterial({
    map:moonTexture,
    normalMap:normalTexture
  })
);

moon.position.z = 30
moon.position.x = -10

ritam.position.z = -5;
ritam.position.x = 2;

scene.add(moon)
scene.add(ritam);

//this funtion is used every time the user scrolls
function moveCamera() {

  //where the user is currently scrolled to
  const t = document.body.getBoundingClientRect().top;

  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.05;

  ritam.rotation.z += 0.01
  ritam.rotation.y += 0.01 

  //changing the position of the actual camera
  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.position.y = t * -0.0002;
}

document.body.onscroll = moveCamera

//re render to make it visible
//renderer.render(scene,camera)

//we need to call the render method again and again - nflinite loop
//like a game loop
function animate() {
  //tells the browser to 
  requestAnimationFrame(animate)

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  //controls.update();
  moon.rotation.x += 0.005;
  renderer.render(scene,camera)
}

animate()
