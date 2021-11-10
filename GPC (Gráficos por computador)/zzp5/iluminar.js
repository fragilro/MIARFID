// Seminario #2. Escena básica en Threejs

// Objetos estandar
var renderer, scene, camera;
// Otras globales
var esferaCubo, angulo = 0;

// Acciones
init();
loadScene();
render();

function init()
{
  // Instanciar el motor (renderer), el canvas, la escena y la cámara
  // Motor
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(new THREE.Color(0x0000AA));
  document.getElementById('container').appendChild(renderer.domElement);
  // Escena
  scene = new THREE.Scene();
  // Cámara
  camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
  camera.position.set(0.5, 2, 7);
  camera.lookAt(new THREE.Vector3(0, 0, 0));
}

function loadScene()
{
  var geoCubo = new THREE.BoxGeometry(2, 2, 2);
  // amarillo y mediante alambre, no sólido
  var matCubo = new THREE.MeshBasicMaterial({color:'yellow', wireframe: true});
  var cubo = new THREE.Mesh(geoCubo, matCubo);

  // esfera = radio, nº meridianos, nº paralelos
  var geoEsfera = new THREE.SphereGeometry(0.8, 20, 20);
  var esfera = new THREE.Mesh(geoEsfera, matCubo);

  // Mostrarlo en escena
  // scene.add(cubo);
  // scene.add(esfera);

  // Alternativa: crear un objeto con ambas juntos en lugar de mostarlos por separado
  esferaCubo = new THREE.Object3D();
  esferaCubo.position.y = 1; // Cambiar posición del elemento, en conjunto
  cubo.position.x = -1; // Cambiar posición de uno de los 2 elementos
  esfera.position.x = 1; // Cambiar posición de uno de los 2 elementos
  cubo.rotation.y = Math.PI/6;  // Rotar el cubo

  esferaCubo.add(cubo);
  esferaCubo.add(esfera);
  cubo.add(new THREE.AxesHelper(1)); // Añadir ejes del cubo
  scene.add(esferaCubo);
  scene.add(new THREE.AxesHelper(3)); // Añadir ejes de la escena

  // Importar objetos externos
  var loader = new THREE.ObjectLoader();
  loader.load('../models/soldado/soldado.json',
    function(objeto){
      cubo.add(objeto);
      objeto.position.y = 1;
    }
  );
  // Suelo : tamaño 10x10, teselación 10x10
  var geoSuelo = new THREE.PlaneGeometry(10, 10, 10, 10);
  var suelo = new THREE.Mesh(geoSuelo, matCubo);
  suelo.rotation.x = Math.PI/2; //Girar 90º, el plano viene paralelo al eje Y
  scene.add(suelo);
}

function update()
{
  // Añade animación.
  angulo += 0.01;
  esferaCubo.rotation.y = angulo;
}

function render()
{
  requestAnimationFrame(render);
  update();
  renderer.render(scene, camera);
}
