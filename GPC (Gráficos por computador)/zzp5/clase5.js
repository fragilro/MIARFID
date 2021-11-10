// Seminario #2. Escena básica en Threejs

// Objetos estandar
var renderer, scene, camera;

var cameraControls;
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
  renderer.shadowMap.enabled = true; //hay sombras
  renderer.antialias = true; //antialiasing
  document.getElementById('container').appendChild(renderer.domElement);
  // Escena
  scene = new THREE.Scene();
  // Cámara
  camera = new THREE.PerspectiveCamera(50, window.innerWidth/window.innerHeight, 0.1, 500);
  cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
  camera.position.set(0.5, 3, 9);
  camera.lookAt(new THREE.Vector3(0, 2, 0));
  cameraControls.target.set(0,2,0);

  // Luces
  var luzAmbiente = new THREE.AmbientLight(0xFFFFFF, 0.1); //Color, intensidad
  scene.add(luzAmbiente);

  var luzPuntual = new THREE.PointLight(0xFFFFFF, 0.5);
  luzPuntual.position.set(-10, 10, -10); //Ubicación luz
  scene.add(luzPuntual);

  var luzDireccional = new THREE.DirectionalLight(0xFFFFFF, 0.5);
  luzDireccional.position.set(-10, 5, 10); //De donde viene la luz
  scene.add(luzDireccional);

  var luzFocal = new THREE.SpotLight(0xFFFFFF, 0.5);
  luzFocal.position.set(10, 10, 3); //Donde está
  luzFocal.target.position.set(0, 0, 0); //Donde enfoca
  luzFocal.angle = Math.PI/10; //cono de luz
  luzFocal.penumbra = 0.4; // zona de penumbra
  luzFocal.castShadow = true; //Produce sombras
  scene.add(luzFocal);
}

function loadScene(){
  //Texturas
  var path = "../images/";
  var txsuelo = new THREE.TextureLoader().load(path+'wet_ground_512x512.jpg');
  txsuelo.magfilter = THREE.LinearFilter;
  txsuelo.minfilter = THREE.LinearFilter;
  txsuelo.repeat.set(2,2); //Se repite 2 veces en S y en T
  txsuelo.wrapS = txsuelo.wrapT = THREE.MirroredRepeatWrapping; //Donde acaba una empieza la otra, dando la vuelta en S y en T

  var txcubo = new THREE.TextureLoader().load(path+'wood512.jpg');

  var txesfera = new THREE.TextureLoader().load(path+'Earth.jpg');

  var paredes = [path+'posx.jpg', path+'negx.jpg', path+'posy.jpg',path+'negy.jpg', path+'posz.jpg', path+'negz.jpg'];
  var txmapaentorno = new THREE.CubeTextureLoader().load(paredes);

  //Materiales
  var materialSuelo = new THREE.MeshLambertMaterial({color:'white', map:txsuelo});
  var materialMate = new THREE.MeshLambertMaterial({color: 'brown', map:txcubo});
  var materialBrillante = new THREE.MeshPhongMaterial({color:'white',specular:'white',shininess:50, envMap:txmapaentorno}); //Color, color del brillo, brillo

  var geoCubo = new THREE.BoxGeometry(2, 2, 2);
  var cubo = new THREE.Mesh(geoCubo, materialMate);
  cubo.castShadow = true; //hace sombras
  cubo.receiveShadow = true;
  // esfera = radio, nº meridianos, nº paralelos
  var geoEsfera = new THREE.SphereGeometry(0.8, 20, 20);
  var esfera = new THREE.Mesh(geoEsfera, materialBrillante);
  esfera.castShadow = true;
  esfera.receiveShadow = true;
  // Suelo : tamaño 10x10, teselación 10x10
  // var geoSuelo =
  var suelo = new THREE.Mesh(new THREE.PlaneGeometry(10, 10, 100, 100), materialSuelo);
  suelo.rotation.x = -Math.PI/2; //Girar 90º, el plano viene paralelo al eje Y
  suelo.receiveShadow = true; //sombras sobre suelo
  scene.add(suelo);

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
      objeto.castShadow = true;
      objeto.receiveShadow = true;
      cubo.add(objeto);
      objeto.position.y = 1;
      var txsoldado = new THREE.TextureLoader().load('../models/soldado/soldado.png');
      objeto.material.map = txsoldado;
    }
  );

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
