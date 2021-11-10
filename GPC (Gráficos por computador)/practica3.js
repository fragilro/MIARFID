// Seminario #2. Escena básica en Threejs

// Objetos estandar
var renderer, scene, camera;
// Otras globales
var angulo = 0;

// Controlar la cámara
var cameraControls;

// Camaras adicionales planta, alcado y perfil
var cenital;
var L = 150; // semilado de la caja ortográfica

// Acciones
init();
loadScene();
render();

function setCameras(ar){
  // Configurar la cámara adicional (ortográficas)
  var camaraOrtografica;
  camaraOrtografica = new THREE.OrthographicCamera(-L+80, L-80, L-80, -L+80, -80, 200);

  cenital = camaraOrtografica.clone();
  cenital.position.set(0,L,0);
  cenital.lookAt(0,0,0);
  cenital.up = new THREE.Vector3(0,0,-1); // Se ve desde arriba, hay que ponerle up
  scene.add(cenital);
}


function init()
{
  // Instanciar el motor (renderer), el canvas, la escena y la cámara
  // Motor
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(new THREE.Color(0xFFFFFF));
  document.getElementById('container').appendChild(renderer.domElement);
  renderer.autoClear = false; // No se borra hasta que se lo indique
  // Escena
  scene = new THREE.Scene();
  // Cámara
  aspectRatio = window.innerWidth/window.innerHeight
  camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1300);
  camera.position.set(200, 250, 160);

  setCameras(aspectRatio);

  cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
  cameraControls.target.set(0,0,0);
  // Captura de eventos: hacer responsive
  window.addEventListener('resize', updateAspectRatio);
}

function loadScene()
{
  // Suelo : tamaño 1000x1000, teselación 10x10
  var geoSuelo = new THREE.PlaneGeometry(1000, 1000, 10, 10);
  var mat = new THREE.MeshBasicMaterial({color:'red', wireframe: true});
  var suelo = new THREE.Mesh(geoSuelo, mat);
  suelo.rotation.x = -Math.PI/2;
  // suelo.add(new THREE.AxesHelper(100));
  scene.add(suelo);

  // radio superior, radio inferior, altura, cantidad vértices
  var geoCilindro = new THREE.CylinderGeometry(50, 50, 15, 40);
  var base = new THREE.Mesh( geoCilindro, mat);

  var geoEsparrago = new THREE.CylinderGeometry(20, 20, 18, 40);
  var esparrago = new THREE.Mesh( geoEsparrago, mat);
  esparrago.rotation.x = Math.PI/2; //Girar 90º, el plano viene paralelo al eje Y

  // esfera = radio, nº meridianos, nº paralelos
  var geoRotula = new THREE.SphereGeometry(20, 20, 20);
  var rotula = new THREE.Mesh( geoRotula, mat);
  rotula.position.y = 120;

  var geoEje = new THREE.BoxGeometry(18, 120, 12);
  var eje = new THREE.Mesh( geoEje, mat);
  eje.position.y = 60;

  brazo = new THREE.Object3D();
  brazo.add(esparrago);
  brazo.add(eje);
  brazo.add(rotula);

  var geoDisco = new THREE.CylinderGeometry(22, 22, 6, 30);
  var disco = new THREE.Mesh( geoDisco, mat);
  var distanciaNervios = 10;
  var geoNervio = new THREE.BoxGeometry(4, 80, 4);
  var nervio1 = new THREE.Mesh( geoNervio, mat);
  nervio1.position.y = 40;
  nervio1.position.x = distanciaNervios;
  nervio1.position.z = distanciaNervios;
  var nervio2 = new THREE.Mesh( geoNervio, mat);
  nervio2.position.y = 40;
  nervio2.position.x = -distanciaNervios;
  nervio2.position.z = distanciaNervios;
  var nervio3 = new THREE.Mesh( geoNervio, mat);
  nervio3.position.y = 40;
  nervio3.position.x = distanciaNervios;
  nervio3.position.z = -distanciaNervios;
  var nervio4 = new THREE.Mesh( geoNervio, mat);
  nervio4.position.y = 40;
  nervio4.position.x = -distanciaNervios;
  nervio4.position.z = -distanciaNervios;

  var geoPinza = new THREE.Geometry();
  var coordenadas = [
    0,0,0, 0,0,4, 19,0,0, 19,0,4,    //  base
    0,20,0, 0,20,4, 19,20,0, 19,20,4, //  base
    38,5,0, 38,5,2, 38,15,0, 38,15,2  // punta
  ];
  var indices = [
    //  base
    0,2,1, 1,2,3,
    4,5,6, 5,7,6,
    0,1,4, 1,5,4,
    2,6,3, 3,6,7,
    1,3,7, 1,7,5,
    0,6,2, 0,4,6,
    // punta
    3,2,8, 3,8,9,
    7,11,10, 6,7,10,
    9,8,10, 10,11,9,
    3,9,7, 7,9,11,
    2,6,8, 6,10,8
  ];
  for (var i = 0; i<coordenadas.length; i+=3){
    var vertice = new THREE.Vector3(coordenadas[i], coordenadas[i+1], coordenadas[i+2]);
    geoPinza.vertices.push(vertice);
  }
  for (var i = 0; i<indices.length; i+=3){
    var triangulo = new THREE.Face3(indices[i], indices[i+1], indices[i+2]);
    geoPinza.faces.push(triangulo);
  }
  var pinzaL = new THREE.Mesh(geoPinza,mat);
  var pinzaD = new THREE.Mesh(geoPinza,mat);
  pinzaD.rotation.x = Math.PI;
  pinzaL.position.z = distanciaNervios;
  pinzaD.position.z = -distanciaNervios;
  pinzaL.position.y = -10;
  pinzaD.position.y = 10;

  var geoBaseMano = new THREE.CylinderGeometry(15, 15, 40, 40);
  var baseMano = new THREE.Mesh( geoBaseMano, mat);
  baseMano.rotation.x = Math.PI/2;

  mano = new THREE.Object3D();
  mano.add(baseMano);
  mano.add(pinzaL);
  mano.add(pinzaD);
  mano.position.y = 80;

  antebrazo = new THREE.Object3D();
  antebrazo.add(disco);
  antebrazo.add(nervio1);
  antebrazo.add(nervio2);
  antebrazo.add(nervio3);
  antebrazo.add(nervio4);
  antebrazo.add(mano);
  antebrazo.position.y = 120;

  brazocompleto = new THREE.Object3D();
  // brazocompleto.add(new THREE.AxesHelper(100));
  brazocompleto.add(base);
  brazocompleto.add(brazo);
  brazocompleto.add(antebrazo);
  scene.add(brazocompleto);
}

function updateAspectRatio(){
  // Se diapra cuando se cambia el area de dibujo
  renderer.setSize(window.innerWidth, window.innerHeight);
  var ar = window.innerWidth/window.innerHeight;
  camera.aspect = ar; // Nuevo aspect ratio
  camera.updateProjectionMatrix();
  // Actualizar las cámara adicional
  cenital.left = -L;
  cenital.right = L;
  cenital.bottom = -L;
  cenital.top = L;
  cenital.updateProjectionMatrix();
}

function update()
{
  // Añade animación.
  // angulo += 0.01;
  // brazocompleto.rotation.y = angulo;
}

function render()
{
  requestAnimationFrame(render);
  update();
  renderer.clear(); // Ya que el autoclear está desactivado
  // Perspectiva intercativa
  // renderer.setViewport(window.innerWidth/2, window.innerHeight/2, window.innerWidth/2, window.innerHeight/2);
  renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
  renderer.render(scene, camera);
  // Cenital
  if (window.innerWidth > window.innerHeight){
    var tamanoCenital = window.innerHeight/4;
  }
  else{
    var tamanoCenital = window.innerWidth/4;
  }
  // updateAspectRatio();
  renderer.setViewport(0, 0, tamanoCenital, tamanoCenital);
  renderer.render(scene, cenital);
}
