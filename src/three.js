import * as THREE from 'three';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
let selectedObject = null;

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);
const geometry2 = new THREE.BoxGeometry();
const material2 = new THREE.MeshStandardMaterial({ color: 0xff0000 });
const cube2 = new THREE.Mesh(geometry2, material2);
scene.add(cube2);

const control = new TransformControls(camera, renderer.domElement);
scene.add(control);


const controls = new OrbitControls(camera, renderer.domElement);
controls.enableRotate = false;

let isRotating = false;
let initialMousePosition = new THREE.Vector2();


//////////////////////////////////// light ////////////////////////////////////
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); 
scene.add(ambientLight);

// Ajouter une lumière directionnelle
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8); 
directionalLight.position.set(1, 1, 1); 
scene.add(directionalLight);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
//helpers
const lightHelper = new THREE.Mesh(
    new THREE.SphereGeometry(0.1, 8, 8),
    new THREE.MeshBasicMaterial({ color: 0xffff00 })
);
lightHelper.position.copy(directionalLight.position);
scene.add(lightHelper);

function updateLightPosition() {
    directionalLight.position.copy(lightHelper.position);
}



/////////////////////////////////////////////////////////////////////////////////

//reglages light
directionalLight.castShadow = true;

directionalLight.shadow.camera.near = 0.1;
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.camera.left = -5;
directionalLight.shadow.camera.right = 5;
directionalLight.shadow.camera.top = 5;
directionalLight.shadow.camera.bottom = -5;
directionalLight.shadow.mapSize.width = 1024; 
directionalLight.shadow.mapSize.height = 1024; 


/////////////////////////////////////////////////////////////////////////////////

const planeGeometry = new THREE.PlaneGeometry(10, 10);
const planeMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00, side: THREE.DoubleSide });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = Math.PI / 2;
scene.add(plane);



cube.castShadow = true; 
cube.receiveShadow = true; 

cube2.castShadow = true; 
cube2.receiveShadow = true; 

plane.receiveShadow = true; 


renderer.domElement.addEventListener('mousedown', function(event) {
    if (event.button === 0 && event.altKey) {
        isRotating = true;
        initialMousePosition.set(event.clientX, event.clientY);
    }
    else {
        controls.enableRotate = false;
    }
    
});

renderer.domElement.addEventListener('mousemove', function(event) {
    if (isRotating) {
        controls.enableRotate = true;
    }
});

renderer.domElement.addEventListener('mouseup', function() {
    isRotating = false;
});

renderer.domElement.addEventListener('mouseleave', function() {
    isRotating = false;
});

controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;


document.getElementById('translate').addEventListener('click', function () {
    control.setMode('translate');
});

document.getElementById('rotate').addEventListener('click', function () {
    control.setMode('rotate');
});

document.getElementById('scale').addEventListener('click', function () {
    control.setMode('scale');
});

camera.position.z = 5;


control.attach(cube);

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

let objectSelected = false;


function onMouseDown(event) {
    objectSelected = false;
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects([cube, cube2, plane, lightHelper, ambientLight, directionalLight]);

    if (intersects.length > 0) {
        control.attach(intersects[0].object);
        selectedObject = intersects[0].object;
        console.log(selectedObject);
        objectSelected = true;
    }
     else {
    }
}

function onMouseUp(event) {
    if (!objectSelected && !control.dragging) {
        control.detach();
    }
}
document.getElementById('colorPickerButton').addEventListener('click', function () {
    console.log(selectedObject);
    if (selectedObject) {
        document.getElementById('colorPicker').click();
    } else {
        alert("Veuillez sélectionner un objet.");
    }
});

document.getElementById('colorPicker').addEventListener('input', function (event) {
    if (selectedObject) {
        selectedObject.material.color.set(event.target.value);
    }
});

window.addEventListener('mousedown', onMouseDown);
window.addEventListener('mouseup', onMouseUp);


window.addEventListener('mousedown', onMouseDown);


function update() {
    requestAnimationFrame(update);
    if (selectedObject === lightHelper) {
        updateLightPosition();
    }
    renderer.render(scene, camera);
  }
  update();