"use strict";

let scene;
let render;
let camera;

const animateScene = function (cubeMovement, ballMovement, sphere, cube, cubeHeight, cubeWidth, sphereRadius) {
    let collision = collisionDetect(sphere, cube, cubeHeight, cubeWidth, sphereRadius, ballMovement);
    if (collision === true) {
        let score = parseInt(document.getElementById("score").innerHTML) + 1;
        updateScore(score);
    } else if (collision === "lost") {
        document.getElementById("warning").innerHTML = "U lost!";
        scene.remove(sphere);
        renderScene();
    }
    moveCube(cubeMovement, cube);
    moveBall(ballMovement, sphere);
    renderScene();
};

/* TODO: Rework function to just detect collision and offload movement changes of elements */
const collisionDetect = function (sphere, cube, cubeHeight, cubeWidth, sphereRadius, ballMovement) {
    let result = false;

    if (sphere.position.y <= (cube.position.y + cubeHeight)) {
        if (sphere.position.x < (cube.position.x - (cubeWidth / 2)) || sphere.position.x > (cube.position.x + (cubeWidth / 2))) {
            return "lost";
        }
        ballMovement.Left = false;
        ballMovement.Right = false;
        if (sphere.position.x < cube.position.x) {
            ballMovement.Left = true;
        }
        if (sphere.position.x > cube.position.x) {
            ballMovement.Right = true;
        }
        ballMovement.Up = true;

        result = true;
    }

    if ((sphere.position.x + (sphereRadius * 2)) >= 3) {
        ballMovement.Right = false;
        ballMovement.Left = true;
    }

    if ((sphere.position.x - (sphereRadius * 2)) <= -3) {
        ballMovement.Right = true;
        ballMovement.Left = false;
    }

    if ((sphere.position.y + (sphereRadius * 2)) >= 3) {
        ballMovement.Up = false;
    }

    return result;
};

const updateScore = function (value) {
    document.getElementById("score").innerHTML = value;
    console.log("Score: " + value);
};

const moveBall = function (ballMovement, sphere) {
    if (ballMovement.Up) {
        sphere.position.y += 0.02;
    } else {
        sphere.position.y -= 0.02;
    }

    if (ballMovement.Left) {
        sphere.position.x -= 0.02;
    }

    if (ballMovement.Right) {
        sphere.position.x += 0.02;
    }
};

const moveCube = function (cubeMovement, cube) {
    if (cubeMovement.left) {
        cube.position.x -= 0.02;
    }

    if (cubeMovement.right) {
        cube.position.x += 0.02;
    }
}

const createSphere = function (radius) {
    let material = new THREE.MeshLambertMaterial({ color: 0x64EDBD });
    let sphereGeometry = new THREE.SphereGeometry(radius, 32, 32, 0, 6, 6, 3.2);

    let sphere = new THREE.Mesh(sphereGeometry, material);

    return sphere;
};

const createCube = function (width, height) {
    let material = new THREE.MeshLambertMaterial({ color: 0x6495ED });
    let cubeGeometry = new THREE.BoxGeometry(width, height, 1);

    let cube = new THREE.Mesh(cubeGeometry, material);

    return cube;
};

const startScene = function (cube, sphere, canvasWidth, canvasHeight) {
    let canvas = document.getElementById('canvas');
    render = new THREE.WebGLRenderer();
    render.shadowMap.enabled = true;
    render.shadowMap.type = THREE.PCFSoftShadowMap;

    render.setClearColor(0xEDBD64, 1);

    render.setSize(canvasWidth, canvasHeight);

    canvas.appendChild(render.domElement);

    scene = new THREE.Scene();
    let aspect = canvasWidth / canvasHeight;

    camera = new THREE.PerspectiveCamera(45, aspect);
    camera.position.set(0, 0, 0);
    camera.lookAt(scene.position);
    scene.add(camera);

    // Lighting
    let light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(0.5, 1, 0);
    light.castShadow = true;

    //Set up shadow properties for the light
    light.shadow.mapSize.width = 512;
    light.shadow.mapSize.height = 512;
    light.shadow.camera.near = 0.5;
    light.shadow.camera.far = 500

    scene.add(light);

    // Create a helper for the shadow camera
    // let helper = new THREE.CameraHelper( light.shadow.camera );
    // scene.add( helper );

    cube.position.set(-1, -2.2, -7.0);
    scene.add(cube);

    sphere.position.set(0, 0, -7.0);
    scene.add(sphere);
};

const renderScene = function () {
    render.render(scene, camera);
};

const handleKeyDown = function (e, cubeMovement) {
    if (e.code === "ArrowLeft") {
        console.log("move left");
        cubeMovement.left = true;
    }

    if (e.code === "ArrowRight") {
        console.log("move right");
        cubeMovement.right = true;
    }
};

const handleKeyUp = function (e, cubeMovement) {
    if (e.code === "ArrowLeft") {
        console.log("Stop moving left");
        cubeMovement.left = false;
    }

    if (e.code === "ArrowRight") {
        console.log("Stop moving right");
        cubeMovement.right = false;
    }
};

document.addEventListener('DOMContentLoaded', function (event) {
    const settings = {
        cube: {
            height: 0.5,
            width: 2
        },
        sphere: {
            radius: 0.15
        },
        canvas: {
            height: canvas.getAttribute('height'),
            width: canvas.getAttribute('width')
        }
    }

    let movement = {
        cube: {
            left: false,
            right: false
        },
        ball: {
            Up: false,
            Left: false,
            Right: false
        }
    };

    let elements = {
        cube: createCube(settings.cube.width, settings.cube.height),
        sphere: createSphere(settings.sphere.radius)
    };

    window.addEventListener("keydown", function (e) { handleKeyDown(e, movement.cube) });
    window.addEventListener("keyup", function (e) { handleKeyUp(e, movement.cube) });

    startScene(elements.cube, elements.sphere, settings.canvas.width, settings.canvas.height);
    window.setInterval(function () {
        return animateScene(movement.cube, movement.ball, elements.sphere, elements.cube, settings.cube.height, settings.cube.width, settings.sphere.radius);
    }, 7);
    renderScene();
});