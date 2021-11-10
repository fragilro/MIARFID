// MULTIVISTA
// Seminario 3. Ejemplo de Multivista

// Variables usuales
var renderer, scene, camera;

// Camaras adicionales planta, alcado y perfil
var planta, alzado, perfil;
var L = 3; // semilado de la caja ortográfica

// Controlar la cámara
var cameraControls;

// Acciones
init();
loadScene();
render();

function setCameras(ar){
  // Configurar las 3 cámaras adicionales (ortográficas)
  var camaraOrtografica;
  if(ar > 1){ // más ancho que alto
    camaraOrtografica = new THREE.OrthographicCamera(-L*ar, L*ar, L, -L, -100, 100);
  }
  else{ // más alto que ancho
    camaraOrtografica = new THREE.OrthographicCamera(-L, L, L/ar, -L/ar, -100, 100);
  }

  alzado = camaraOrtografica.clone();
  alzado.position.set(0,0,L);
  alzado.lookAt(0,0,0);

  planta = camaraOrtografica.clone();
  planta.position.set(0,L,0);
  planta.lookAt(0,0,0);
  planta.up = new THREE.Vector3(0,0,-1); // Se ve desde arriba, hay que ponerle up

  perfil = camaraOrtografica.clone();
  perfil.position.set(L,0,0);
  perfil.lookAt(0,0,0);

  scene.add(alzado);
  scene.add(planta);
  scene.add(perfil);
}

function init(){
  // Configuramos motor y canvas
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(new THREE.Color(0x0000AA));
  document.getElementById('container').appendChild(renderer.domElement);
  renderer.autoClear = false; // No se borra hasta que se lo indique
  // Escena
  scene = new THREE.Scene();
  // cámara
  var aspectRatio = window.innerWidth/window.innerHeight;
  camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 200);
  camera.position.set(2,2,3);
  // camera.lookAt(new THREE.Vector3(0,0,0)); // Con el cameraControls.target ya no importa este

  setCameras(aspectRatio);

  cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
  cameraControls.target.set(0,0,0);

  // Captura de eventos: hacer responsive
  window.addEventListener('resize', updateAspectRatio);
  // Doble click
  renderer.domElement.addEventListener('dblclick', rotateCube);
}

function rotateCube(event){
  //Capturamos coordenadas de click
  var x = event.clientX;
  var y = event.clientY;

  // En qué zona se ha hecho el click
  var derecha = false, abajo = false;
  var cam = null; // qué cámara sufre el click
  if(x > window.innerWidth/2){
    derecha = true;
    x -= window.innerWidth/2;
  }
  if(y > window.innerHeight/2){
    abajo = true;
    y -= window.innerHeight/2;
  }
  // Cámara que recibe el click
  if(derecha){
    if(abajo) {cam = camera;}
    else{cam = perfil;}
  }
  else{
    if(abajo){cam = planta;}
    else{cam = alzado;}
  }
  // Normaliza a cuadrado de 2x2
  x = (x*4/window.innerWidth) - 1;
  y = -(y*4/window.innerHeight) + 1;

  // Construir el rayo
  var rayo = new THREE.Raycaster();
  rayo.setFromCamera(new THREE.Vector2(x,y), cam);
  // Calcular intersecciones
  var intersecciones = rayo.intersectObjects(scene.children, true);
  if(intersecciones.length > 0){
    intersecciones[0].object.rotation.x += Math.PI/8;
  }
}

function loadScene(){
  // 5 cubos iguales en tirereta
  var geoCubo = new THREE.BoxGeometry(0.9, 0.9, 0.9);
  var material = new THREE.MeshBasicMaterial({color:'yellow', wireframe:true});
  for (var i = 0; i < 5; i++){
    var cubo = new THREE.Mesh(geoCubo, material);
    cubo.position.set(-2+i, 0, 0);
    scene.add(cubo);
  }
  scene.add(new THREE.AxesHelper(3));
}

function updateAspectRatio(){
  // Se dispara cuando se cambia el area de dibujo
  renderer.setSize(window.innerWidth, window.innerHeight);
  var ar = window.innerWidth/window.innerHeight;
  camera.aspect = ar; // Nuevo aspect ratio
  camera.updateProjectionMatrix();
  // Actualizar las cámaras adicionales
  if(ar > 1){ // más ancho que alto
    alzado.left = perfil.left = planta.left = -L*ar;
    alzado.right = perfil.right = planta.right = L*ar;
    alzado.bottom = perfil.bottom = planta.bottom = -L;
    alzado.top = perfil.top = planta.top = L;
  }
  else{ //más alto que ancho
    alzado.left = perfil.left = planta.left = -L;
    alzado.right = perfil.right = planta.right = L;
    alzado.bottom = perfil.bottom = planta.bottom = -L/ar;
    alzado.top = perfil.top = planta.top = L/ar;
  }
  alzado.updateProjectionMatrix();
  perfil.updateProjectionMatrix();
  planta.updateProjectionMatrix();
}

function update(){

}

function render(){
  requestAnimationFrame(render);
  update();
  renderer.clear(); // Ya que el autoclear está desactivado
  // Alzado
  renderer.setViewport(0,0, window.innerWidth/2, window.innerHeight/2); // empieza en 0,0 con el tamaño de mitad ancho y mitad largo
  renderer.render(scene, alzado);
  // Planta
  renderer.setViewport(0, window.innerHeight/2, window.innerWidth/2, window.innerHeight/2);
  renderer.render(scene, planta);
  // Perfil
  renderer.setViewport(window.innerWidth/2, 0, window.innerWidth/2, window.innerHeight/2);
  renderer.render(scene, perfil);
  // Perspectiva intercativa
  renderer.setViewport(window.innerWidth/2, window.innerHeight/2, window.innerWidth/2, window.innerHeight/2);
  renderer.render(scene, camera);
}
