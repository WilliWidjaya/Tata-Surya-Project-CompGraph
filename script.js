import * as THREE from 'three';
import {OrbitControls} from 'OrbitControls';

// import obstacle from './obstacle.js';asdsaasdada

// ================= Add Scene
const scene = new THREE.Scene();


// ================= Camera Setup
const camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);

// ================= camera positioning
camera.position.setZ(50);
// camera.position.setY(20);
// camera.rotation.x = -0.25;


// ================= Renderer
const renderer = new THREE.WebGLRenderer;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.innerWidth/ window.innerHeight);


// ===================== add to document
document.body.appendChild(renderer.domElement);


// ===================== set background color
renderer.setClearColor("#FFFF00");




// ===================== Car Block
const blockSize = 5;
const cubeGeometry = new THREE.BoxGeometry(blockSize, blockSize, blockSize);
const material = new THREE.MeshBasicMaterial({wireframe: true, color : 0x0000ff});
const cube = new THREE.Mesh(cubeGeometry, material);
scene.add(cube);
cube.position.setX(0);
cube.position.setY(blockSize / 2);

// ===================== Car bounding box
let carBB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
carBB.setFromObject(cube);


// ===================== Plane
const planeGeometry = new THREE.PlaneGeometry(100, 100);
const planeMaterial = new THREE.MeshBasicMaterial({color : 0x2b943b, side: THREE.DoubleSide});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(plane);
plane.rotation.y = 0;
plane.rotation.x = Math.PI / 2;



// ========= Jalan Raya Texture
const jalanTexture = new THREE.TextureLoader().load("./roadtexture.jpg");


// ===================== Jalan Raya
const jalanGeometry = new THREE.PlaneGeometry(50, 300);
const jalanMaterial = new THREE.MeshBasicMaterial({map: jalanTexture, side: THREE.DoubleSide});
const jalan = new THREE.Mesh(jalanGeometry, jalanMaterial);
const jalan2 = new THREE.Mesh(jalanGeometry,jalanMaterial);
const jalan3 = new THREE.Mesh(jalanGeometry, jalanMaterial);
const jalan4 = new THREE.Mesh(jalanGeometry, jalanMaterial);

scene.add(jalan);
scene.add(jalan2);
scene.add(jalan3);
scene.add(jalan4);

jalan.position.y = 0.25;
jalan.position.z = -150;
jalan.rotation.x = Math.PI / 2;

jalan2.position.y = 0.25;
jalan2.position.z = -300;
jalan2.rotation.x = Math.PI / 2;

jalan3.position.y = 0.25;
jalan3.position.z = -450;
jalan3.rotation.x = Math.PI / 2;

jalan4.position.y = 0.25;
jalan4.position.z = -600;
jalan4.rotation.x = Math.PI / 2;


/// add obstacle
const obsSize = 4;
const obstacleGeo = new THREE.BoxGeometry(obsSize, obsSize, obsSize);
const obsMaterial = new THREE.MeshBasicMaterial({wireframe: true, color: 0xde1507})
// const obstacle = new THREE.Mesh(obstacleGeo, obsMaterial);

var obsMesh = new THREE.Mesh(obstacleGeo, obsMaterial);
obsMesh.position.setX(-1500);
  obsMesh.position.setY(obsSize / 2);
  obsMesh.name = "obsMesh";
  let obsBB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
  obsBB.setFromObject(obsMesh);
  scene.add(obsMesh);

const ObstacleArray = [];
const BoundingArray = [];


function createObstacle() {
  var obsMesh = new THREE.Mesh(obstacleGeo, obsMaterial);
  obsMesh.position.setZ(-150);
  obsMesh.position.setY(obsSize / 2);
  obsMesh.name = "obsMesh";
  scene.add(obsMesh);

  var prevSpace = 0;

            prevSpace += 25;
            var obsMesh = new THREE.Mesh(obstacleGeo, obsMaterial)
            obsMesh.position.x = Math.random() * (25 + 25) - 25;
            obsMesh.position.z = -300;
            obsMesh.position.y = obsSize / 2;
            obsMesh.name = 'obstacle';

            let obsBB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
            obsBB.setFromObject(obsMesh);
            
            scene.add(obsMesh);
            ObstacleArray.push(obsMesh);
            BoundingArray.push(obsBB);
    
};






// ===================== axehelper
const axeshelper = new THREE.AxesHelper(5);
scene.add(axeshelper);

// ===================== gridhelper
const gridHelper = new THREE.GridHelper(200,200);
scene.add(gridHelper)







// ===================== orbit controls
const control = new OrbitControls(camera, renderer.domElement);




// const buat jarak antar segmentasi jalan
const midPoint = -350;
const moveTo = -500;



// posisi cube
const cubePosition = cube.position.clone();


// ================== KECEPATAN ke kiri dan ke kanan.
let movSpeed = 0;



var counter = 0;
var carSpeed = 1;
// ===================== Animate , ini mirip update di unity.
const animate = () => {
  // update bounding box ke posisi baru.
  carBB.copy( cube.geometry.boundingBox).applyMatrix4(cube.matrixWorld);


  // Automatic Obstacle Spawner
  if(counter % 50 === 0) {
    createObstacle();
  }

  // Pergerakan Jalan
  jalan.position.z += carSpeed;  
  jalan2.position.z += carSpeed;
  jalan3.position.z += carSpeed;
  jalan4.position.z += carSpeed;

  // Pergerakan Mobil kiri kanan
  cubePosition.x += movSpeed;
  
  // Pergerakan jalan 2
    if(jalan.position.z === midPoint) {
      // scene.remove(jalan);
      jalan2.position.z = moveTo;
      // scene.add(jalan2);
    }
    if(jalan2.position.z === midPoint) {
      // scene.remove(jalan2);
      jalan3.position.z = moveTo;
      // scene.add(jalan);
    } 
    if(jalan3.position.z === midPoint) {
      jalan4.position.z = moveTo;
    } 
    if(jalan4.position.z === midPoint) {
      jalan.position.z = moveTo;
    }
  
    

  // Obstacle Colission Detection
  ObstacleArray.forEach(function callBack(obsMesh, idx) {
    obsMesh.position.z += carSpeed;
    BoundingArray[idx].copy( obsMesh.geometry.boundingBox).applyMatrix4(obsMesh.matrixWorld);
    if(BoundingArray[idx].intersectsBox(carBB)){
      console.log("Game over fool");
    }
    if(obsMesh.position.z >= 150) {
      ObstacleArray.splice(idx ,1);
      BoundingArray[idx] = null;
      BoundingArray.splice(idx ,1);
      scene.remove(obsMesh);
    }
  });


  cube.position.lerp(cubePosition, 0.1);
  checkCollisions(); 

  // hitung setiap frame.
  counter++;


  requestAnimationFrame(animate);
  control.update();
  renderer.render(scene,camera);
}


// ===================== INPUTS
document.onkeydown = function(e) {
  
  if(e.keyCode === 68) {

    movSpeed = 0.5;
  } else if (e.keyCode === 65) {

    movSpeed = -0.5;

  } else if (e.keyCode === 83) {

    // cubePosition.z+= 1;

  } else if (e.keyCode === 87) {

    createObstacle();

  } 
}

document.onkeyup = function(e) {
  movSpeed = 0;
}


// ===================== Check Collision function
function checkCollisions() {
  // if(carBB.intersectsBox()) {
  //   hitObstacle()
  // }
}

function hitObstacle() {
  console.log("Game Over")
}

// render the screen
animate();
renderer.render(scene, camera);

