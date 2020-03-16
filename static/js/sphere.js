const canvas = document.getElementById('sphere');

function sizeCanvas() {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
};

// sizeCanvas();

window.addEventListener('resize', () => {
    sizeCanvas();
});

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true
});

renderer.shadowMap = true;

renderer.setSize(canvas.width, canvas.height);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height, 1, 4000);

scene.add(camera);

// const geometry = new THREE.BoxGeometry(2,2,2);

const geometry = new THREE.SphereGeometry(3, 32, 32);

// modify UVs to accommodate MatCap texture
let faceVertexUvs = geometry.faceVertexUvs[0];
faceVertexUvs.forEach((faceVertexUv, index) => {
    let face = geometry.faces[index];
    for (let j = 0; j < 3; j++) {
        faceVertexUv[j].x = face.vertexNormals[j].x * 0.5 + 0.5;
        faceVertexUv[j].y = face.vertexNormals[j].y * 0.5 + 0.5;
    }
});

const video = document.getElementById('video');
navigator.mediaDevices.getUserMedia({ video: {height: 720, width: 720}, audio: false })
    .then(function(mediaStream) {
        video.srcObject = mediaStream;
        video.play();
    });

const texture = new THREE.VideoTexture(video);
// texture.wrapS = THREE.RepeatWrapping;
// texture.repeat.x = - 1;

const material = new THREE.MeshBasicMaterial({
    map: texture
});

const cube = new THREE.Mesh(geometry, material);
cube.castShadow = true;

cube.scale.x = -1;

cube.position.z = -14;
// cube.rotation.x = Math.PI / 5;
// cube.rotation.y = Math.PI / 5;

scene.add(cube);


const boxGeometry = new THREE.BoxGeometry(8,8,8);


const woodTexture = new THREE.TextureLoader().load('/static/images/woodpanellight.jpg');
const woodMaterial = new THREE.MeshBasicMaterial({
    map: woodTexture
});
woodMaterial.side = THREE.BackSide;

let color1 = new THREE.MeshBasicMaterial({ color: '#00aaff' });
color1.side = THREE.BackSide;

let color2 = new THREE.MeshBasicMaterial({ color: '#0000ff' });
color2.side = THREE.BackSide;


let color3 = new THREE.MeshBasicMaterial({ color: '#0000aa' });
color3.side = THREE.BackSide;

var materials = [
    woodMaterial,
    new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 }),
];


for( var i = 0; i < boxGeometry.faces.length; i++ ) {
    boxGeometry.faces[i].materialIndex = 0;
}

//a 'hole' to look inside
// front wall
boxGeometry.faces[8].materialIndex = 1;
boxGeometry.faces[9].materialIndex = 1;

// left wall
// boxGeometry.faces[2].materialIndex = 2;
// boxGeometry.faces[3].materialIndex = 2;

// // ceiling
// boxGeometry.faces[4].materialIndex = 2;
// boxGeometry.faces[5].materialIndex = 2;

// // floor
// boxGeometry.faces[6].materialIndex = 2;
// boxGeometry.faces[7].materialIndex = 2;

// // back wall
// boxGeometry.faces[10].materialIndex = 3;
// boxGeometry.faces[11].materialIndex = 3;




mesh = new THREE.Mesh(boxGeometry, materials);

// debugger
// const boxMaterial = new THREE.MeshBasicMaterial( {color: 0xffff00, wireframe: true });
// const box = new THREE.Mesh( boxGeometry, boxMaterial );

mesh.position.z = -13;
// mesh.rotation.x = Math.PI / 5;
// mesh.rotation.y = Math.PI / 5;
scene.add( mesh );

const light = new THREE.DirectionalLight(0xffffff, 1.5);
light.position.set(2,2,1);
light.castShadow = true;
scene.add(light);


function animate(){
    requestAnimationFrame(animate);
    
    renderer.render(scene, camera);
    renderer.setClearColor( 0xffffff, 0);

    // mesh.rotation.x += 0.01
    // mesh.rotation.y += 0.01
}

animate();
