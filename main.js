import * as THREE from 'three';
import {OrbitControls} from 'OrbitControls';
import { Raycaster } from 'three';

/*
Perlu ditambah:
- Path planet
- Interaksi saat planet diklik
- Data planet (setelah interaksi)

*/

// Add Scene
const scene = new THREE.Scene();

// Camera Setup
const camera = new THREE.PerspectiveCamera(90, window.innerWidth/window.innerHeight, 0.1, 1000)
camera.position.set(-30, 90, 120);

// ================= Renderer
const renderer = new THREE.WebGLRenderer;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.innerWidth/ window.innerHeight);

// ===================== add to document
document.body.appendChild(renderer.domElement)

// ===================== set background color
renderer.setClearColor("blue");

// ===================== Space Background
let bgtexture = new THREE.TextureLoader().load('./star_texture2.jpg');
let bgplane = new THREE.Mesh(
  new THREE.PlaneGeometry(3, 3),
  new THREE.MeshBasicMaterial({ map: bgtexture, side: THREE.DoubleSide})
);

bgplane.material.depthTest = false;
bgplane.material.depthWrite = false;

var bgscene = new THREE.Scene();
var bgcam = new THREE.Camera();
bgscene.add(bgcam);
bgscene.add(bgplane);

// Orbit Controls
const control = new OrbitControls(camera, renderer.domElement);


// <<< Planets >>>

class planet{
    constructor(radius, positionFromCenter, texture) {
        this.radius = radius;
        this.positionFromCenter = positionFromCenter;
        this.texture = texture
      }
    createPlanet() {
        const geo = new THREE.SphereGeometry(this.radius)
        const map = new THREE.TextureLoader().load(this.texture)
        const mat = new THREE.MeshPhongMaterial({map: map})
        this.planetMesh = new THREE.Mesh(geo,mat)

        return this.planetMesh
    }
}


// Urutan Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune.
// Matahari
const sunGeo = new THREE.SphereGeometry(10)
const sunMap = new THREE.TextureLoader().load('./mataharitexture.jpg')
const sunMaterial = new THREE.MeshBasicMaterial({map : sunMap})
const sun = new THREE.Mesh(sunGeo, sunMaterial)

scene.add(sun)

// Mercury
const mercuryinit = new planet(4, 25, './mercurytexture.jpg')
const mercury = mercuryinit.createPlanet()
const mercuryObject = new THREE.Object3D();
mercuryObject.add(mercury)
mercury.position.x = mercuryinit.positionFromCenter
scene.add(mercuryObject)



// Venus
const venusinit = new planet(8, 50, './venussurface.jpg')
const venus = venusinit.createPlanet()
const venusObject = new THREE.Object3D();
venusObject.add(venus)
venus.position.x = venusinit.positionFromCenter
scene.add(venusObject)


// Bumi
const earthinit = new planet( 8, 95, './earthtexture.jpg')
const earth = earthinit.createPlanet()
const earthObject = new THREE.Object3D();
earthObject.add(earth)
earth.position.x = earthinit.positionFromCenter
scene.add(earthObject)

// mars
const marsinit = new planet( 5, 135, './marstexture.jpg')
const mars = marsinit.createPlanet()
const marsObject = new THREE.Object3D()
marsObject.add(mars)
mars.position.x = marsinit.positionFromCenter
scene.add(marsObject)

// jupiter
const jupiterinit = new planet( 10, 180, './jupitertexture.jpg')
const jupiter = jupiterinit.createPlanet()
const jupiterObject = new THREE.Object3D()
jupiterObject.add(jupiter)
jupiter.position.x = jupiterinit.positionFromCenter
scene.add(jupiterObject)


// saturn
const saturninit = new planet(9, 225, './saturntexture.jpg')
const saturn = saturninit.createPlanet()


// saturn ring
const ringGeo = new THREE.RingGeometry(12, 15, 20)
const ringTexture = new THREE.TextureLoader().load('./saturnring.png')
const ringMaterial = new THREE.MeshBasicMaterial({map : ringTexture, side: THREE.DoubleSide})
const saturnRing = new THREE.Mesh(ringGeo, ringMaterial)
saturnRing.rotation.x = 0.75
saturn.add(saturnRing)

const saturnObject = new THREE.Object3D()
saturnObject.add(saturn)
saturn.position.x = saturninit.positionFromCenter
scene.add(saturnObject)


// uranus
const uranusinit = new planet(4, 255, './uranustexture.jpg')
const uranus = uranusinit.createPlanet()
const uranusObject = new THREE.Object3D()
uranusObject.add(uranus)
uranus.position.x = uranusinit.positionFromCenter
scene.add(uranusObject)

// neptune
const neptuneinit = new planet(6, 285, './neptunetexture.jpg')
const neptune = neptuneinit.createPlanet()
const neptuneObject = new THREE.Object3D()
neptuneObject.add(neptune)
neptune.position.x = neptuneinit.positionFromCenter
scene.add(neptuneObject)


const planets = [];
planets.push(mercury);
planets.push(venus);
planets.push(earth);
planets.push(mars);
planets.push(jupiter);
planets.push(saturn);
planets.push(uranus);
planets.push(neptune);


// =============== Cahaya matahari (semua planet akan diubah jadi phong material supaya ini bekerja)
function ptlight(){
  let light = new THREE.PointLight('white');
  //Posisinya di dalam matahari
  //light.intensity = 1;
  scene.add(light);

  let help = new THREE.PointLightHelper(light);
  scene.add(help);
}
ptlight();

// ================ Planet Path

let speed = 1; //buat ini adjustable
let selectedPlanet = null;


// Interaksi
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('mousedown',onMouseDown, false);
function onMouseDown(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY/ window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(planets,true);

  if(intersects.length > 0) {
    if (selectedPlanet) {
      selectedPlanet.scale.set(1, 1, 1); 
    }


    selectedPlanet = intersects[0].object;
    selectedPlanet.scale.set(4, 4, 4);

    const planetInfo = document.getElementById('planetInfo');
    const planetName = document.getElementById('planetName');
    const planetDescription = document.getElementById('planetDescription');
    

    // earth mars jupiter saturn uranus neptune
    if(selectedPlanet === mercury) {
      planetName.textContent = 'Mercury';
      planetDescription.textContent = 'Mercury ni bang'
    } else if (selectedPlanet === venus) {
      planetName.textContent = 'Venus';
      planetDescription.textContent = 'Venus ni bang'
    }else if (selectedPlanet === earth) {
      planetName.textContent = 'Earth';
      planetDescription.textContent = 'Earth ni bang'
    }else if (selectedPlanet === mars) {
      planetName.textContent = 'Mars';
      planetDescription.textContent = 'Mars ni bang'
    }else if (selectedPlanet === jupiter) {
      planetName.textContent = 'Jupiter';
      planetDescription.textContent = 'Jupiter ni bang'
    }else if (selectedPlanet === saturn) {
      planetName.textContent = 'Saturn';
      planetDescription.textContent = 'Saturn ni bang'
    }else if (selectedPlanet === uranus) {
      planetName.textContent = 'Uranus';
      planetDescription.textContent = 'Uranus ni bang'
    }else if (selectedPlanet === neptune) {
      planetName.textContent = 'Neptune';
      planetDescription.textContent = 'Neptune ni bang'
    }

    
      planetInfo.style.display = 'block';
    } else {
      if (selectedPlanet) {
        selectedPlanet.scale.set(1, 1, 1);
      }
      selectedPlanet = null;
  
      const planetInfo = document.getElementById('planetInfo');
      planetInfo.style.display = 'none';
    }
}


// Animate
const animate = () => {
    sun.rotation.y += speed * 0.0025

    mercuryObject.rotation.y += speed * 0.0025
    mercury.rotation.y += speed *  0.0025

    venusObject.rotation.y += speed *  0.0015
    venus.rotation.y += speed *  0.0025

    earthObject.rotation.y += speed *  0.0010
    earth.rotation.y += speed *  0.0025

    marsObject.rotation.y += speed *  0.0010
    mars.rotation.y += speed *  0.0025

    jupiterObject.rotation.y += speed * 0.0005
    jupiter.rotation.y += speed * 0.0025

    saturnObject.rotation.y += speed * 0.0006
    saturn.rotation.y += speed * 0.0025

    uranusObject.rotation.y += speed * 0.0007
    uranus.rotation.y += speed * 0.0025

    neptuneObject.rotation.y += speed * 0.0003
    neptune.rotation.y += speed * 0.0025

    if(selectedPlanet){
      selectedPlanet.scale.set(4,4,4);
    }

    requestAnimationFrame(animate);
    control.update();

    renderer.autoClear = false;
    renderer.clear();
    renderer.render(bgscene, bgcam);
    renderer.render(scene,camera);
  }


// render scene
animate()
renderer.render(scene, camera);