import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';
import  {GLTFLoader} from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js';

const camera = new THREE.PerspectiveCamera(
    80,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.z = 5;

const scene = new THREE.Scene();

// Softer ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
scene.add(ambientLight);

// Directional sunlight (like the Sun shining from one side)
const sunLight = new THREE.DirectionalLight(0xffffff, 1);
sunLight.position.set(5, 3, 5);
scene.add(sunLight);

// Optional: subtle hemisphere light for sky vs. ground effect
const hemiLight = new THREE.HemisphereLight(0x87ceeb, 0x222222, 0.3); 
scene.add(hemiLight);

let earth;
const loader = new GLTFLoader();

const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('earth3D').appendChild(renderer.domElement);

// Proper animation loop
function animate() {
    requestAnimationFrame(animate); // Fixed: pass the callback function
    
    // Rotate earth if loaded
    if (earth) {
        earth.rotation.y += 0.005;
    }
    
    renderer.render(scene, camera);
}

// Load the model
loader.load(
    '/models/earth.glb',
    function (gltf) {
        earth = gltf.scene;
        scene.add(earth);
        console.log('Earth model loaded successfully');
        
        // Optional: scale the model if needed
        earth.scale.set(1, 1, 1);
        if (window.innerWidth < 492) {
            earth.scale.set(0.5, 0.5, 0.5);
        }
        if (window.innerWidth < 768) {
            earth.scale.set(0.7, 0.7, 0.7);
        }
        if (window.innerWidth < 1200) {
            earth.scale.set(0.8, 0.8, 0.8);
        }
    },
    function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function (error) {
        console.error('Error loading model:', error);
        
        // Fallback: create a simple sphere if model fails to load
        const geometry = new THREE.SphereGeometry(1, 32, 32);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        earth = new THREE.Mesh(geometry, material);
        scene.add(earth);
        console.log('Using fallback sphere');
    }
);

// Start the animation loop
animate();

window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

    if (earth) {
        if (window.innerWidth < 492) {
            earth.scale.set(0.5, 0.5, 0.5);
        }
        else if (window.innerWidth < 768) {
            earth.scale.set(0.7, 0.7, 0.7);
        }
        else if (window.innerWidth < 1200) {
            earth.scale.set(0.8, 0.8, 0.8);
        } 
        else {
            earth.scale.set(1, 1, 1);
        }
    }
});

const card = document.getElementById("weatherCard");
const weatherForm = document.getElementById("weatherForm");
const cityInput = document.getElementById("cityInput");


weatherForm.addEventListener("submit", async e => {
    e.preventDefault();

    card.style.display = "block";
    const city = cityInput.value;

    try {
        const weatherData = await getWeatherData(city);
        displayWeatherData(weatherData);
    } catch (error) {
        window.alert(error)
    }
})

async function getWeatherData(city){
    try {
        const response = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
        if(!response.ok){
            throw new Error("Error fetching cities");
        }
        const data = await response.json()
        return data
    } catch (error) {
        displayError(error)
    }
}

function displayWeatherData(data){
    try {
        const {
            name: city,
            main: {temp, feels_like, humidity},
            clouds: {all},
            weather: [{main, description}],
            visibility: visibility,
            wind: {speed}
        } = data;

        document.getElementById("cityName").textContent = city;
        document.getElementById("temp").textContent = temp;
        document.getElementById("weatherMain").textContent = main;
        document.getElementById("weatherDescription").textContent = description;
        document.getElementById("feelsLike").textContent = feels_like;
        document.getElementById("humidity").textContent = humidity;
        document.getElementById("clouds").textContent = all;

        const mps = speed;     
        const kmph = mps * 3.6; 
        document.getElementById("windSpeed").textContent = kmph;

        const mtrs = visibility;
        const kmtrs = mtrs/1000;
        document.getElementById("visibility").textContent = kmtrs;
    } catch (error) {
        
    }
}

function displayError(error){
    window.alert(error.message || "Something went wrong while fetching weather data.");
}

