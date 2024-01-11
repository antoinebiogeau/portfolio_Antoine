import * as THREE from 'three';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {FBXLoader} from 'three/examples/jsm/loaders/FBXLoader.js';



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
    new THREE.SphereGeometry(0.5, 8, 8), 
    new THREE.MeshBasicMaterial({ color: 0xffff00 })
);
lightHelper.position.copy(directionalLight.position);
scene.add(lightHelper);

function updateLightPosition() {
    directionalLight.position.copy(lightHelper.position);
}

let currentEdges = null;
let currentPoints = null;
let edgesVisible = false;
let pointsVisible = false;

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

let interactableObjects = [cube, cube2, plane, lightHelper, ambientLight, directionalLight];
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
        if (control.dragging) {
        return;
    }
    objectSelected = false;
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(interactableObjects);

    if (intersects.length > 0) {
        control.attach(intersects[0].object);
        selectedObject = intersects[0].object;
        objectSelected = true;
        updateEdgeAndPointRepresentations(selectedObject);
    } else {
  
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

const fileInput = document.getElementById('fileInput');
fileInput.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const url = URL.createObjectURL(file);
        loadFBX(url);
    }
});

function loadFBX(url) {
    const loader = new FBXLoader();
    loader.load(url, function(object) {
        object.position.set(0, 0, 0);
        scene.add(object);
        //ajout shadow
        object.castShadow = true;
        object.receiveShadow = true;
        interactableObjects.push(object);
    }, undefined, function(error) {
        console.error(error);
    });
}




function createEdgeRepresentation(mesh) {
    const edges = new THREE.EdgesGeometry(mesh.geometry);
    const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xffffff }));
    line.position.copy(mesh.position);
    line.rotation.copy(mesh.rotation);
    line.scale.copy(mesh.scale);

    return line;
}

function createPointRepresentation(mesh) {
    if (!(mesh.geometry instanceof THREE.BufferGeometry)) {
        console.error('La géométrie n\'est pas une instance de THREE.BufferGeometry.');
        return;
    }

    const positionAttribute = mesh.geometry.getAttribute('position');
    const points = [];
    for (let i = 0; i < positionAttribute.count; i++) {
        points.push(new THREE.Vector3().fromBufferAttribute(positionAttribute, i));
    }

    const pointsGeometry = new THREE.BufferGeometry().setFromPoints(points);
    const pointsMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1 });
    const pointsMesh = new THREE.Points(pointsGeometry, pointsMaterial);
    pointsMesh.position.copy(mesh.position);
    pointsMesh.rotation.copy(mesh.rotation);
    pointsMesh.scale.copy(mesh.scale);

    return pointsMesh;
}
function updateEdgeAndPointRepresentations() {
    if (!selectedObject) return;
    if (currentEdges) scene.remove(currentEdges);
    if (currentPoints) scene.remove(currentPoints);
    currentEdges = createEdgeRepresentation(selectedObject);
    currentPoints = createPointRepresentation(selectedObject);
    currentEdges.visible = edgesVisible;
    currentPoints.visible = pointsVisible;
    scene.add(currentEdges);
    scene.add(currentPoints);
}

document.getElementById('toggleEdges').addEventListener('click', function () {
    edgesVisible = !edgesVisible;
    if (currentEdges) {
        currentEdges.visible = edgesVisible;
    }
});

document.getElementById('togglePoints').addEventListener('click', function () {
    pointsVisible = !pointsVisible;
    if (currentPoints) {
        currentPoints.visible = pointsVisible;
    }
});

function update() {
    requestAnimationFrame(update);
    updateEdgeAndPointRepresentations();
    if (selectedObject === lightHelper) {
        updateLightPosition();
    }

    renderer.render(scene, camera);
}
  update();