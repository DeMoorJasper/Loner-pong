const cubeHeight = 0.5;
const cubeWidth = 2;

const sphereRadius = 0.15;

let cubeMovement = {
    left: false,
    right: false
}

let ball = {
    Up: false,
    Left: false,
    Right: false
};

document.addEventListener('DOMContentLoaded', function(event) {
    const canvasWidth = canvas.getAttribute('width');
    const canvasHeight = canvas.getAttribute('height');

    const animateScene = () => {
        if (cubeMovement.left) {
            cube.position.x -= 0.02;
        }

        if (cubeMovement.right) {
            cube.position.x += 0.02;
        }

        if (sphere.position.y <= (cube.position.y + cubeHeight)) {
            if (sphere.position.x < (cube.position.x - (cubeWidth / 2)) || sphere.position.x > (cube.position.x + (cubeWidth / 2))) {
                document.getElementById("warning").innerHTML = "Fuck u, u lose!";
                scene.remove(sphere);
                renderScene();
                return;
            }

            ball.Left = false;
            ball.Right = false;
            if (sphere.position.x < cube.position.x) {
                ball.Left = true;
            }
            if (sphere.position.x > cube.position.x) {
                ball.Right = true;
            }
            ball.Up = true;
            let score = parseInt(document.getElementById("score").innerHTML) + 1;
            document.getElementById("score").innerHTML = score;
            console.log(score);
        }

        if ((sphere.position.x + (sphereRadius * 2)) >= 3) {
            ball.Right = false;
            ball.Left = true;
        }

        if ((sphere.position.x - (sphereRadius * 2)) <= -3) {
            ball.Right = true;
            ball.Left = false;
        }

        if ((sphere.position.y + (sphereRadius * 2)) >= 3) {
            ball.Up = false;       
        }

        if (ball.Up) {
            sphere.position.y += 0.02;
        } else {
            sphere.position.y -= 0.02;
        }

        if (ball.Left) {
            sphere.position.x -= 0.02;
        }

        if (ball.Right) {
            sphere.position.x += 0.02;
        }

        renderScene();
    };

    const createSphere = () => {
        let material = new THREE.MeshLambertMaterial( { color: 0x64EDBD } );
        let sphereGeometry = new THREE.SphereGeometry(sphereRadius, 32, 32, 0, 6, 6, 3.2);

        sphere = new THREE.Mesh(sphereGeometry, material);
        
        return sphere;
    };

    const createCube = () => {
        let material = new THREE.MeshLambertMaterial( { color: 0x6495ED } );
        let cubeGeometry = new THREE.BoxGeometry(cubeWidth, cubeHeight, 1);

        cube = new THREE.Mesh(cubeGeometry, material);

        return cube;
    };

    const startScene = (cube, sphere) => {
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
        light.position.set( 0.5, 1, 0 );
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

    const renderScene = () => {
        render.render(scene, camera);
    };

    let cube = createCube();
    let sphere = createSphere();
    startScene(cube, sphere);
    window.setInterval(animateScene, 7);
    renderScene();

    const handleKeyDown = (e) => {
        if (e.code === "ArrowLeft") {
            console.log("move left");
            cubeMovement.left = true;
        }

        if (e.code === "ArrowRight") {
            console.log("move right");
            cubeMovement.right = true;
        }
    }

    const handleKeyUp = (e) => {
        if (e.code === "ArrowLeft") {
            console.log("Stop moving left");
            cubeMovement.left = false;
        }

        if (e.code === "ArrowRight") {
            console.log("Stop moving right");
            cubeMovement.right = false;
        }
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
});