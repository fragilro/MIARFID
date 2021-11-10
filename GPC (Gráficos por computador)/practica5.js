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

// GUI
var effectController;

// Acciones
init();
setupGUI();
loadScene();
loadKeyboard();
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


function init(){
  // Instanciar el motor (renderer), el canvas, la escena y la cámara
  // Motor
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(new THREE.Color(0xFFFFFF));
  renderer.shadowMap.enabled = true; //hay sombras
  renderer.antialias = true; //antialiasing
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
  cameraControls.enableKeys = false; // Desactivar control de cámara con las flechitas
  // Captura de eventos: hacer responsive
  window.addEventListener('resize', updateAspectRatio);

  // Luces
  var luzAmbiente = new THREE.AmbientLight(0xFFFFFF, 0.5); //Color, intensidad
  scene.add(luzAmbiente);

  var luzPuntual = new THREE.PointLight(0xFFFFFF, 0.6);
  luzPuntual.position.set(100, 150, 0); //Ubicación luz
  scene.add(luzPuntual);

  var luzFocal = new THREE.SpotLight(0xFFFFFF, 0.4);
  luzFocal.position.set(0, 500, 0); //Donde está
  luzFocal.target.position.set(0, 0, 0); //Donde enfoca
  luzFocal.angle = Math.PI/6; //cono de luz
  luzFocal.penumbra = 0.1; // zona de penumbra
  luzFocal.castShadow = true; //Produce sombras
  luzFocal.shadowCameraFar = 1000;
  luzFocal.shadowCameraNear = 1;
  scene.add(luzFocal);
}

function setupGUI(){
  // Objeto controlador
  effectController = {
    giroBase: 0.0,
    giroBrazo: 0.0,
    giroAntebrazoY: 0.0,
    giroAntebrazoZ: 0.0,
    giroPinza: 0.0,
    separacionPinza: 15.0,
  }
  var gui = new dat.GUI();
  var carpeta = gui.addFolder('Control Robot');
  carpeta.add(effectController, 'giroBase', -180.0, 180.0, 1).name('Giro base');
  carpeta.add(effectController, 'giroBrazo', -45.0, 45.0, 1).name('Giro brazo');
  carpeta.add(effectController, 'giroAntebrazoY', -180.0, 180.0, 1).name('Giro Antebrazo Y');
  carpeta.add(effectController, 'giroAntebrazoZ', -90.0, 90.0, 1).name('Giro Antebrazo Z');
  carpeta.add(effectController, 'giroPinza', -40.0, 220.0, 1).name('Giro Pinza');
  carpeta.add(effectController, 'separacionPinza', 0.0, 15.0, 1).name('Separación pinzas');
}

function loadScene(){
  // Suelo : tamaño 1000x1000, teselación 10x10
  var geoSuelo = new THREE.PlaneGeometry(1000, 1000, 10, 10);
  var txsuelo = new THREE.TextureLoader().load('images/pisometal_1024x1024.jpg', function ( texture ) {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.offset.set( 0, 0 );
    texture.repeat.set(2,2 );
  });
  var materialSuelo = new THREE.MeshLambertMaterial({color:'white', map:txsuelo});
  var txmate = new THREE.TextureLoader().load('images/wood512.jpg');
  var materialMate = new THREE.MeshLambertMaterial({color: 'white', map:txmate});
  var txbrillante = new THREE.TextureLoader().load('images/metal_128.jpg');
  var materialBrillante = new THREE.MeshPhongMaterial({color: 'white',specular:'white',shininess:50, map:txbrillante});
  var paredes = ['images/posx.jpg', 'images/negx.jpg', 'images/posy.jpg','images/negy.jpg', 'images/posz.jpg', 'images/negz.jpg'];
  var txrotula = new new THREE.CubeTextureLoader().load(paredes);
  var materialRotula = new THREE.MeshPhongMaterial({color:'white',specular:'white',shininess:50, envMap:txrotula}); //Color, color del brillo, brillo

  var mapaEntorno = new THREE.CubeTextureLoader().load(paredes);

  var shader = THREE.ShaderLib.cube;
  shader.uniforms.tCube.value = mapaEntorno;

  var matParedes = new THREE.ShaderMaterial(
    {
              fragmentShader: shader.fragmentShader,
              vertexShader: shader.vertexShader,
              uniforms: shader.uniforms,
              depthWrite: false,
              side: THREE.BackSide
    }
  );

  var habitacion = new THREE.Mesh(new THREE.BoxGeometry(1000, 1000, 1000), matParedes);
  scene.add(habitacion);

  var suelo = new THREE.Mesh(geoSuelo, materialSuelo);
  suelo.rotation.x = -Math.PI/2;
  suelo.receiveShadow = true; //sombras sobre suelo
  // suelo.add(new THREE.AxesHelper(100));
  scene.add(suelo);

  // radio superior, radio inferior, altura, cantidad vértices
  var geoCilindro = new THREE.CylinderGeometry(50, 50, 15, 40);
  var base = new THREE.Mesh( geoCilindro, materialMate);
  base.castShadow = true;
  base.receiveShadow = true;

  var geoEsparrago = new THREE.CylinderGeometry(20, 20, 18, 40);
  var esparrago = new THREE.Mesh( geoEsparrago, materialMate);
  esparrago.castShadow = true;
  esparrago.receiveShadow = true;
  esparrago.rotation.x = Math.PI/2; //Girar 90º, el plano viene paralelo al eje Y

  // esfera = radio, nº meridianos, nº paralelos
  var geoRotula = new THREE.SphereGeometry(20, 20, 20);
  var rotula = new THREE.Mesh( geoRotula, materialRotula);
  rotula.castShadow = true;
  rotula.receiveShadow = true;
  rotula.position.y = 120;

  var geoEje = new THREE.BoxGeometry(18, 120, 12);
  var eje = new THREE.Mesh( geoEje, materialMate);
  eje.castShadow = true;
  eje.receiveShadow = true;
  eje.position.y = 60;

  brazo = new THREE.Object3D();
  brazo.add(esparrago);
  brazo.add(eje);
  brazo.add(rotula);

  var geoDisco = new THREE.CylinderGeometry(22, 22, 6, 30);
  var disco = new THREE.Mesh( geoDisco, materialBrillante);
  disco.castShadow = true;
  disco.receiveShadow = true;
  var distanciaNervios = 10;
  var geoNervio = new THREE.BoxGeometry(4, 80, 4);
  var nervio1 = new THREE.Mesh( geoNervio, materialBrillante);
  nervio1.castShadow = true;
  nervio1.receiveShadow = true;
  nervio1.position.y = 40;
  nervio1.position.x = distanciaNervios;
  nervio1.position.z = distanciaNervios;
  var nervio2 = new THREE.Mesh( geoNervio, materialBrillante);
  nervio2.castShadow = true;
  nervio2.receiveShadow = true;
  nervio2.position.y = 40;
  nervio2.position.x = -distanciaNervios;
  nervio2.position.z = distanciaNervios;
  var nervio3 = new THREE.Mesh( geoNervio, materialBrillante);
  nervio3.castShadow = true;
  nervio3.receiveShadow = true;
  nervio3.position.y = 40;
  nervio3.position.x = distanciaNervios;
  nervio3.position.z = -distanciaNervios;
  var nervio4 = new THREE.Mesh( geoNervio, materialBrillante);
  nervio4.castShadow = true;
  nervio4.receiveShadow = true;
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
  geoPinza.computeVertexNormals(); //Para que se ilumine bien la geometría creada
  pinzaL = new THREE.Mesh(geoPinza,materialMate);
  pinzaL.castShadow = true;
  pinzaL.receiveShadow = true;
  pinzaD = new THREE.Mesh(geoPinza,materialMate);
  pinzaD.castShadow = true;
  pinzaD.receiveShadow = true;
  pinzaD.rotation.x = Math.PI;
  // pinzaL.position.z = distanciaNervios; Ya no hace falta, ahora actualizamos desde el controlador
  // pinzaD.position.z = -distanciaNervios;
  pinzaL.position.y = -10;
  pinzaD.position.y = 10;

  var geoBaseMano = new THREE.CylinderGeometry(15, 15, 40, 40);
  var baseMano = new THREE.Mesh( geoBaseMano, materialBrillante);
  baseMano.castShadow = true;
  baseMano.receiveShadow = true;
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
  brazocompleto.add(brazo);
  brazocompleto.add(antebrazo);
  robot = new THREE.Object3D();
  robot.add(base);
  robot.add(brazocompleto);
  scene.add(robot);
}

function loadKeyboard(){
  // Control de teclado
  var keyboard = new THREEx.KeyboardState(renderer.domElement);
  renderer.domElement.setAttribute('tabIndex', 0);
  renderer.domElement.focus();
  // No funciona al clickar controles
  // keyboard.domElement.addEventListener('keydown', function (event){
  //   if(keyboard.eventMatches(event, 'up')){robot.position.x += 1;}  //up
  //   if(keyboard.eventMatches(event, 'down')){robot.position.x += -1;}  //down
  //   if(keyboard.eventMatches(event, 'left')){robot.position.z += -1;}  //left
  //   if(keyboard.eventMatches(event, 'right')){robot.position.z += 1;}  //right
  // });
  document.addEventListener('keydown', function (event){
    if(keyboard.eventMatches(event, 'up')){robot.position.x += 1;}  //up
    if(keyboard.eventMatches(event, 'down')){robot.position.x += -1;}  //down
    if(keyboard.eventMatches(event, 'left')){robot.position.z += -1;}  //left
    if(keyboard.eventMatches(event, 'right')){robot.position.z += 1;}  //right
  });
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
  var giroBase = effectController.giroBase;
  anguloBase = giroBase * Math.PI/180;
  robot.rotation.y = anguloBase;
  var giroBrazo =  effectController.giroBrazo;
  anguloBrazo = giroBrazo * Math.PI/180;
  brazocompleto.rotation.z = anguloBrazo;
  var giroAntebrazoY = effectController.giroAntebrazoY;
  anguloAntebrazoY = giroAntebrazoY * Math.PI/180;
  antebrazo.rotation.y = anguloAntebrazoY;
  var giroAntebrazoZ = effectController.giroAntebrazoZ;
  anguloAntebrazoZ = giroAntebrazoZ * Math.PI/180;
  antebrazo.rotation.z = anguloAntebrazoZ;
  var giroPinza = effectController.giroPinza;
  anguloPinza = giroPinza * Math.PI/180;
  mano.rotation.z = anguloPinza;
  var separacionPinza = effectController.separacionPinza;
  pinzaL.position.z = separacionPinza;
  pinzaD.position.z = -separacionPinza;
  TWEEN.update();
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
