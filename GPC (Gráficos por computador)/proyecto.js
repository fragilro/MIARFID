// Objetos estandar
var renderer, scene, camera;
var reloj, timeout1, timeout2;
var antes, ahora;
// Tamaños del escenario
var alturaPuerta = 80;
var anchoPuerta = 40;
var grosorPuerta = 6;
var alturaPared = 120;
var grosorPared = 10;
var distanciaParedes = 350; // Respecto al centro de la sala
// Variables del juego
var empiezaJuego = false;
var puntos = 0;
var jugando = false;
var avanzando = false;
var velocidad = 1;
var distanciaAccion = 50;
var puerta1, puerta2, puerta3;
let puerta1Abierta = {valor:false};
let puerta2Abierta = {valor:false};
let puerta3Abierta = {valor:false};
var juguete1, juguete2, juguete3;
var posicionInicial = distanciaParedes*2 - grosorPared*2;
var posicionActual1 = posicionInicial;
var posicionActual2 = posicionInicial;
var posicionActual3 = -posicionInicial;
var j1 = false;
var j2 = false;
var j3 = false;

// Controlar la cámara
var cameraControls;
// GUI
var effectController;

// Acciones

init();
setupGUI();
loadScene();
render();

function init(){
  // Reloj
  reloj = new THREE.Clock();
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
  empiezaJuego = false;
  document.getElementById("centered").style.visibility = "visible";
  puntos = 0;
  jugando = false;
  avanzando = false;
  camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 3000);
  camera.position.set(-distanciaParedes, alturaPared/2, 0);
  camera.lookAt(distanciaParedes,100,0);  // Luces
  luzAmbiente = new THREE.AmbientLight(0xFFFFFF, 0.1); //Color, intensidad
  scene.add(luzAmbiente);
  //Sala principal
  var luzPuntual = new THREE.PointLight(0xFFFFFF, 0.8, distanciaParedes*2);
  luzPuntual.position.set(0, alturaPared/2, 0); //Ubicación luz
  scene.add(luzPuntual);
  // Luz habitación 1
  var luzFocal1 = new THREE.SpotLight(0xFFFFFF, 0.4);
  luzFocal1.position.set(500, alturaPared, 0); //Donde está
  luzFocal1.target.position.set(distanciaParedes*1.5, 0, 0); //Donde enfoca
  luzFocal1.angle = Math.PI/3; //cono de luz
  luzFocal1.penumbra = 0.1; // zona de penumbra
  luzFocal1.castShadow = true; //Produce sombras
  luzFocal1.shadow.camera.far = 1000;
  scene.add(luzFocal1.target);
  scene.add(luzFocal1);
  // Luz habitación 2
  var luzFocal2 = new THREE.SpotLight(0xFFFFFF, 0.4);
  luzFocal2.position.set(0, alturaPared, 500); //Donde está
  luzFocal2.target.position.set(0, 0, distanciaParedes*1.5); //Donde enfoca
  luzFocal2.angle = Math.PI/3; //cono de luz
  luzFocal2.penumbra = 0.1; // zona de penumbra
  luzFocal2.castShadow = true; //Produce sombras
  luzFocal2.shadow.camera.far = 1000;
  scene.add(luzFocal2.target);
  scene.add(luzFocal2);
  // Luz habitación 3
  var luzFocal3 = new THREE.SpotLight(0xFFFFFF, 0.4);
  luzFocal3.position.set(0, alturaPared, -500); //Donde está
  luzFocal3.target.position.set(0, 0, -distanciaParedes*1.5); //Donde enfoca
  luzFocal3.angle = Math.PI/3; //cono de luz
  luzFocal3.penumbra = 0.1; // zona de penumbra
  luzFocal3.castShadow = true; //Produce sombras
  luzFocal3.shadow.camera.far = 1000;
  scene.add(luzFocal3.target);
  scene.add(luzFocal3);
  // Captura de eventos: hacer responsive
  window.addEventListener('resize', updateAspectRatio);
  // Capturar click
  renderer.domElement.addEventListener('click', clickFunction);
}

function reiniciarCamara(){
  empiezaJuego = false;
  document.getElementById("centered2").style.visibility = "hidden";
  document.getElementById("centered").style.visibility = "visible";
  puntos = 0;
  indicador1.material.color.set('white');
  indicador2.material.color.set('white');
  indicador3.material.color.set('white');
  luzIndicador1.intensity = 0;
  luzIndicador2.intensity = 0;
  luzIndicador3.intensity = 0;
  jugando = false;
  avanzando = false;
  camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 3000);
  camera.position.set(-distanciaParedes, alturaPared/2, 0);
  camera.lookAt(distanciaParedes,100,0);
}

function comenzarJuego(){
  empiezaJuego = true;
  document.getElementById("centered").style.visibility = "hidden";
  document.getElementById("centered2").style.visibility = "hidden";
  antes = Date.now();
  puntos = 0;
  indicador1.material.color.set('white');
  indicador2.material.color.set('white');
  indicador3.material.color.set('white');
  luzIndicador1.intensity = 0;
  luzIndicador2.intensity = 0;
  luzIndicador3.intensity = 0;
  jugando = false;
  avanzando = false;
  juguete1.position.x = posicionInicial;
  juguete2.position.z = posicionInicial;
  juguete3.position.z = -posicionInicial;
  window.clearTimeout(timeout1);
  window.clearTimeout(timeout2);
  jugando = false;
  avanzando = false;
  camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1300);
  camera.position.set(-20, 55, 0);
  cameraControls = new THREE.FirstPersonControls(camera, renderer.domElement);
  cameraControls.lookSpeed = 0.25;
  cameraControls.movementSpeed = 200;
  cameraControls.lookVertical = false;
  cerrarPuerta(puerta1, puerta1Abierta);
  cerrarPuerta(puerta2, puerta2Abierta);
  cerrarPuerta(puerta3, puerta3Abierta);
  juguete1.position.x = posicionInicial;
  juguete2.position.z = posicionInicial;
  juguete3.position.z = -posicionInicial;
  posicionActual1 = posicionInicial;
  posicionActual2 = posicionInicial;
  posicionActual3 = -posicionInicial;
  timeout1 = window.setTimeout(function() {
    jugando = true
    jugar();
  }, 5000)
}

function abrirCerrarPuerta(puerta, estaAbierta){
  if (estaAbierta.valor == false){
    estaAbierta.valor = true;
    var giro = new TWEEN.Tween(puerta.rotation).to({x:0, y:Math.PI/2, z:0}, 1000);
    var movimiento = new TWEEN.Tween(puerta.position).to({x:anchoPuerta/2, y:-(alturaPared-alturaPuerta)/2, z:-anchoPuerta/2}, 1000);
  }else {
    estaAbierta.valor = false;
    var giro = new TWEEN.Tween(puerta.rotation).to({x:0, y:0, z:0}, 1000);
    var movimiento = new TWEEN.Tween(puerta.position).to({x:grosorPuerta/2, y:-(alturaPared-alturaPuerta)/2, z:0}, 1000);
  }
  giro.start();
  movimiento.start();
}

function cerrarPuerta(puerta, estaAbierta){
  estaAbierta.valor = false;
  var giro = new TWEEN.Tween(puerta.rotation).to({x:0, y:0, z:0}, 1000);
  var movimiento = new TWEEN.Tween(puerta.position).to({x:grosorPuerta/2, y:-(alturaPared-alturaPuerta)/2, z:0}, 1000);
  giro.start();
  movimiento.start();
}

function clickFunction(){
  if(jugando == true){
    // Puedes abrir la puerta en función de la Distancia euclidea a esa puerta
    if (Math.sqrt(Math.pow(distanciaParedes-cameraControls.object.position.x, 2) + Math.pow(0-cameraControls.object.position.z, 2)) < distanciaAccion){
      abrirCerrarPuerta(puerta1, puerta1Abierta);
      cerrarPuerta(puerta2, puerta2Abierta);
      cerrarPuerta(puerta3, puerta3Abierta);
    }else if(Math.sqrt(Math.pow(distanciaParedes-cameraControls.object.position.z, 2) + Math.pow(0-cameraControls.object.position.x, 2)) < distanciaAccion){
      abrirCerrarPuerta(puerta2, puerta2Abierta);
      cerrarPuerta(puerta1, puerta1Abierta);
      cerrarPuerta(puerta3, puerta3Abierta);
    }else if(Math.sqrt(Math.pow(-distanciaParedes-cameraControls.object.position.z, 2) + Math.pow(0-cameraControls.object.position.x, 2)) < distanciaAccion){
      abrirCerrarPuerta(puerta3, puerta3Abierta);
      cerrarPuerta(puerta2, puerta2Abierta);
      cerrarPuerta(puerta1, puerta1Abierta);
    }
  }
}

function avanzar(juguete, estaAbierta) { // Avanza mientras la puerta sigue cerrada
  if (jugando == true){
    if (estaAbierta.valor == false) {
      if(juguete == juguete1){
        luzIndicador1.intensity = 0.8;
        indicador1.material.color.set('red');
        posicionActual1 = posicionActual1 - 10*velocidad;
        if(posicionActual1 <= (distanciaParedes + anchoPuerta)){
          acabar(juguete1, puerta1, puerta1Abierta);
        }else{
          var avance = new TWEEN.Tween(juguete.position).to({x:posicionActual1, y:0, z:0}, 500);
          avance.start();
        }
      }else if(juguete == juguete2){
        luzIndicador2.intensity = 0.8;
        indicador2.material.color.set('red');
        posicionActual2 = posicionActual2 - 10*velocidad;
        if(posicionActual2 <= (distanciaParedes + anchoPuerta)){
          acabar(juguete2, puerta2, puerta2Abierta);
        }else{
          var avance = new TWEEN.Tween(juguete.position).to({x:0, y:0, z:posicionActual2}, 500);
          avance.start();
        }
      }else if(juguete == juguete3){
        luzIndicador3.intensity = 0.8;
        indicador3.material.color.set('red');
        posicionActual3 = posicionActual3 + 10*velocidad;
        if(posicionActual3 >= -(distanciaParedes + anchoPuerta)){
          acabar(juguete3, puerta3, puerta3Abierta);
        }else{
          var avance = new TWEEN.Tween(juguete.position).to({x:0, y:0, z:posicionActual3}, 500);
          avance.start();
        }
      }
      timeout2 = window.setTimeout(function() {
        avanzar(juguete, estaAbierta);
      }, 1000);
    } else{
      indicador1.material.color.set('white');
      indicador2.material.color.set('white');
      indicador3.material.color.set('white');
      luzIndicador1.intensity = 0;
      luzIndicador2.intensity = 0;
      luzIndicador3.intensity = 0;
      avanzando = false;
      timeout2 = window.setTimeout(function() {
        jugar();
      }, 5000)
    }
  }
}

function acabar(juguete, puerta, estaAbierta){
  jugando = false;
  avanzando = false;
  window.clearTimeout(timeout1);
  window.clearTimeout(timeout2);
  jugando = false;
  avanzando = false;
  abrirCerrarPuerta(puerta, estaAbierta);
  setTimeout(function() {
    document.getElementById("labels2").innerHTML = "Has conseguido ".concat(puntos).concat(' puntos');
    document.getElementById("centered2").style.visibility = "visible";
  }, 3000);
  cameraControls.enabled = false;
}

function jugar(){
  if(jugando == true){
    if (avanzando == false){
      avanzando = true;
      // setTimeout(function(){
        juguetesConPuertaCerrada = [] //Lista con los candidatos a empezar a avanzar
        if(puerta1Abierta.valor == false){juguetesConPuertaCerrada.push([juguete1, puerta1Abierta])}
        if(puerta2Abierta.valor == false){juguetesConPuertaCerrada.push([juguete2, puerta2Abierta])}
        if(puerta3Abierta.valor == false){juguetesConPuertaCerrada.push([juguete3, puerta3Abierta])}
        // Seleccionamos uno al azar
        seleccionado = juguetesConPuertaCerrada[Math.floor(Math.random() * juguetesConPuertaCerrada.length)];
        avanzar(seleccionado[0], seleccionado[1]);
      // }, 5000);
    }
  }
}

function setupGUI(){
  // Objeto controlador
  effectController = {
    iniciar: function(){
      comenzarJuego();
    },
    orbitControls: function(){
      reiniciarCamara();
    },
    check: true,
    intensidadLuzAmbiente: 0.1,
    velocidad: 1,
  }
  var gui = new dat.GUI();
  var carpeta = gui.addFolder('Controles');
  carpeta.add(effectController, 'orbitControls').name('Salir');
  carpeta.add(effectController, 'iniciar').name('Reiniciar');
  carpeta.add(effectController, 'intensidadLuzAmbiente', 0, 1, 0.1).name('Luz ambiente');
  carpeta.add(effectController, 'velocidad', 0.1, 2, 0.1).name('Velocidad');
}

function updateAspectRatio(){
  // Se dispara cuando se cambia el area de dibujo
  renderer.setSize(window.innerWidth, window.innerHeight);
  var ar = window.innerWidth/window.innerHeight;
  camera.aspect = ar; // Nuevo aspect ratio
  camera.updateProjectionMatrix();
}

function loadScene(){
  // Texturas y materiales
  cemento1 = 'images/cemento.jpg';
  cemento2 = 'images/cemento2.jpg';
  cemento3 = 'images/cemento3.jpg';
  madera1 = 'images/madera1.jpg';
  madera2 = 'images/madera2.jpg';
  madera3 = 'images/wood512.jpg';
  prueba = 'images/pisometal_1024x1024.jpg';
  var mat = new THREE.MeshBasicMaterial({color:'red', wireframe: true});
  var txsuelo = new THREE.TextureLoader().load(madera2, function ( texture ) {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.offset.set( 0, 0 );
    texture.repeat.set( 20, 20 );
  });
  var materialSuelo = new THREE.MeshLambertMaterial({color:'white', map:txsuelo});
  var txpuerta = new THREE.TextureLoader().load(madera3);
  var materialPuerta = new THREE.MeshLambertMaterial({color:'white', map:txpuerta});
  var txpared = new THREE.TextureLoader().load(cemento2);
  var materialPared = new THREE.MeshLambertMaterial({color:'white', map:txpared});
  var txbrillante = new THREE.TextureLoader().load('images/metal_128.jpg');
  var materialBrillante = new THREE.MeshPhongMaterial({color: 'grey',specular:'white',shininess:50, map:txbrillante});
  var txindicador = new THREE.TextureLoader().load('images/metal_128.jpg');
  var materialIndicador1 = new THREE.MeshPhongMaterial({color: 'white',specular:'white',shininess:30, opacity:0.8, transparent:true});
  var materialIndicador2 = new THREE.MeshPhongMaterial({color: 'white',specular:'white',shininess:30, opacity:0.8, transparent:true});
  var materialIndicador3 = new THREE.MeshPhongMaterial({color: 'white',specular:'white',shininess:30, opacity:0.8, transparent:true});
  // Suelo : tamaño 1000x1000, teselación 10x10
  var geoSuelo = new THREE.PlaneGeometry(distanciaParedes*3, distanciaParedes*4, 100, 100);
  var suelo = new THREE.Mesh(geoSuelo, materialSuelo);
  suelo.rotation.x = -Math.PI/2;
  suelo.position.x = distanciaParedes/2;
  var techo = new THREE.Mesh(geoSuelo, materialPared);
  techo.rotation.x = Math.PI/2;
  techo.position.x = distanciaParedes/2;
  techo.position.y = alturaPared;
  // suelo.add(new THREE.AxesHelper(100));
  suelo.receiveShadow = true; //sombras sobre suelo
  techo.receiveShadow = true;
  scene.add(techo);
  scene.add(suelo);
  // Geometrías
  var geoParedTrasera = new THREE.BoxGeometry(grosorPared, alturaPared, distanciaParedes*2/3-anchoPuerta + grosorPared);
  var geoPomo = new THREE.SphereGeometry(2, 10, 10);
  var geoIndicador = new THREE.SphereGeometry(6, 10, 10);
  var geoVentana = new THREE.BoxGeometry(grosorPuerta, alturaPuerta/2, anchoPuerta+grosorPared);
  var geoBarrote = new THREE.CylinderGeometry(grosorPuerta/4, grosorPuerta/4, alturaPuerta/2, 40);
  var geoPared = new THREE.BoxGeometry(grosorPared, alturaPared, distanciaParedes-anchoPuerta/2-grosorPared);
  var geoParedSobrePuerta = new THREE.BoxGeometry(grosorPared, alturaPared-alturaPuerta, anchoPuerta+grosorPared);
  var geoPuerta = new THREE.BoxGeometry(grosorPuerta, alturaPuerta, anchoPuerta+grosorPared);
  var geoParedHabitacion = new THREE.BoxGeometry(grosorPared, alturaPared, distanciaParedes-grosorPared);
  var geoTecho = new THREE.BoxGeometry(grosorPared, distanciaParedes*2, distanciaParedes*2);
  var geoTechoHabitacion = new THREE.BoxGeometry(grosorPared, distanciaParedes, distanciaParedes);
  // Pared trasera
  var pared0 = new THREE.Object3D();
  var pared01 = new THREE.Mesh(geoParedTrasera, materialPared);
  pared01.castShadow = true;
  pared01.receiveShadow = true;
  var pared02 = new THREE.Mesh(geoParedTrasera, materialPared);
  pared02.castShadow = true;
  pared02.receiveShadow = true;
  var pared03 = new THREE.Mesh(geoParedTrasera, materialPared);
  pared03.castShadow = true;
  pared03.receiveShadow = true;
  var pared04 = new THREE.Mesh(geoParedSobrePuerta, materialPared);
  pared04.castShadow = true;
  pared04.receiveShadow = true;
  var pared05 = new THREE.Mesh(geoParedSobrePuerta, materialPared);
  pared05.castShadow = true;
  pared05.receiveShadow = true;
  var pared06 = new THREE.Mesh(geoParedSobrePuerta, materialPared);
  pared06.castShadow = true;
  pared06.receiveShadow = true;
  var pared07 = new THREE.Mesh(geoParedSobrePuerta, materialPared);
  pared07.castShadow = true;
  pared07.receiveShadow = true;
  pared01.position.z = -(distanciaParedes - (distanciaParedes-anchoPuerta/2)/3 + 1.5*grosorPared - 2);
  pared0.add(pared01);
  pared02.position.z = distanciaParedes - (distanciaParedes-anchoPuerta/2)/3 + 1.5*grosorPared - 2;
  pared0.add(pared02);
  pared0.add(pared03)
  ventana0 = new THREE.Object3D();
  var barrote1 = new THREE.Mesh(geoBarrote, materialBrillante);
  var barrote2 = new THREE.Mesh(geoBarrote, materialBrillante);
  barrote1.position.z = anchoPuerta/3;
  barrote2.position.z = -anchoPuerta/3;
  ventana0.add(barrote1);
  ventana0.add(barrote2);
  pared01.receiveShadow = true;
  ventana0.position.z = -distanciaParedes/3 - grosorPared;
  pared0.add(ventana0)
  pared04.position.y = alturaPuerta/2;
  pared04.position.z = -distanciaParedes/3 - grosorPared;
  pared0.add(pared04);
  pared05.position.y = -alturaPuerta/2;
  pared05.position.z = -distanciaParedes/3 - grosorPared;
  pared0.add(pared05);
  ventana1 = new THREE.Object3D();
  var barrote3 = new THREE.Mesh(geoBarrote, materialBrillante);
  var barrote4 = new THREE.Mesh(geoBarrote, materialBrillante);
  barrote3.position.z = anchoPuerta/3;
  barrote4.position.z = -anchoPuerta/3;
  ventana1.add(barrote3);
  ventana1.add(barrote4);
  ventana1.position.z = distanciaParedes/3 + grosorPared;
  pared0.add(ventana1)
  pared06.position.y = alturaPuerta/2;
  pared06.position.z = distanciaParedes/3 + grosorPared;
  pared0.add(pared06);
  pared07.position.y = -alturaPuerta/2;
  pared07.position.z = distanciaParedes/3 + grosorPared;
  pared0.add(pared07);
  pared0.position.x = -distanciaParedes;
  pared0.position.y = alturaPared/2;
  scene.add(pared0)
  // Pared y puerta frontal
  var pared1 = new THREE.Object3D();
  var pared11 = new THREE.Mesh(geoPared, materialPared);
  pared11.castShadow = true;
  pared11.receiveShadow = true;
  var pared12 = new THREE.Mesh(geoPared, materialPared);
  pared12.castShadow = true;
  pared12.receiveShadow = true;
  var pared13 = new THREE.Mesh(geoParedSobrePuerta, materialPared);
  pared13.castShadow = true;
  pared13.receiveShadow = true;
  pared11.position.z = -(distanciaParedes - (distanciaParedes-anchoPuerta/2)/2);
  pared1.add(pared11);
  pared12.position.z = distanciaParedes - (distanciaParedes-anchoPuerta/2)/2;
  pared1.add(pared12);
  pared13.position.y = alturaPuerta/2;
  pared1.add(pared13)
  puerta1 = new THREE.Object3D();
  tabla1 = new THREE.Mesh(geoPuerta, materialPuerta);
  tabla1.castShadow = true;
  tabla1.receiveShadow = true;
  pomo1 = new THREE.Mesh(geoPomo, materialBrillante);
  pomo1.position.z = anchoPuerta/2;
  pomo1.position.x = -grosorPuerta/1.5;
  puerta1.add(tabla1);
  puerta1.add(pomo1);
  puerta1.position.y = -(alturaPared-alturaPuerta)/2;
  pared1.add(puerta1);
  indicador1 = new THREE.Mesh(geoIndicador, materialIndicador1);
  indicador1.position.y = alturaPuerta/2.5;
  indicador1.position.x = -5;
  pared1.add(indicador1);
  luzIndicador1 = new THREE.SpotLight('red', 0);
  luzIndicador1.position.y = alturaPuerta/2.5;
  luzIndicador1.position.x = -5;
  luzIndicador1.target.position.set(distanciaParedes - grosorPared*2, 0, 0); //Donde enfoca
  luzIndicador1.angle = Math.PI/5; //cono de luz
  luzIndicador1.penumbra = 1; // zona de penumbra
  scene.add(luzIndicador1.target);
  pared1.add(luzIndicador1);
  pared1.position.x = distanciaParedes;
  pared1.position.y = alturaPared/2;
  scene.add(pared1)
  // Pared y puerta lateral derecha
  var pared2 = new THREE.Object3D();
  var pared21 = new THREE.Mesh(geoPared, materialPared);
  pared21.castShadow = true;
  pared21.receiveShadow = true;
  var pared22 = new THREE.Mesh(geoPared, materialPared);
  pared22.castShadow = true;
  pared22.receiveShadow = true;
  var pared23 = new THREE.Mesh(geoParedSobrePuerta, materialPared);
  pared23.castShadow = true;
  pared23.receiveShadow = true;
  pared21.position.z = -(distanciaParedes - (distanciaParedes-anchoPuerta/2)/2);
  pared2.add(pared21);
  pared22.position.z = distanciaParedes - (distanciaParedes-anchoPuerta/2)/2;
  pared2.add(pared22);
  pared23.position.y = alturaPuerta/2;
  pared2.add(pared23)
  puerta2 = new THREE.Object3D();
  tabla2 = new THREE.Mesh(geoPuerta, materialPuerta);
  tabla2.castShadow = true;
  tabla2.receiveShadow = true;
  pomo2 = new THREE.Mesh(geoPomo, materialBrillante);
  pomo2.position.z = anchoPuerta/2;
  pomo2.position.x = -grosorPuerta/1.5;
  puerta2.add(pomo2);
  puerta2.add(tabla2);
  puerta2.position.y = -(alturaPared-alturaPuerta)/2;
  pared2.add(puerta2);
  indicador2 = new THREE.Mesh(geoIndicador, materialIndicador2);
  indicador2.position.y = alturaPuerta/2.5;
  indicador2.position.x = -5;
  pared2.add(indicador2);
  luzIndicador2 = new THREE.SpotLight('red', 0);
  luzIndicador2.position.y = alturaPuerta/2.5;
  luzIndicador2.position.x = -5;
  luzIndicador2.target.position.set(0, 0, distanciaParedes - grosorPared*2); //Donde enfoca
  luzIndicador2.angle = Math.PI/5; //cono de luz
  luzIndicador2.penumbra = 1; // zona de penumbra
  scene.add(luzIndicador2.target);
  pared2.add(luzIndicador2);
  pared2.rotation.y = -Math.PI/2;
  pared2.position.z = distanciaParedes;
  pared2.position.y = alturaPared/2;
  scene.add(pared2)
  // Pared y puerta lateral izquierda
  var pared3 = new THREE.Object3D();
  var pared31 = new THREE.Mesh(geoPared, materialPared);
  pared31.castShadow = true;
  pared31.receiveShadow = true;
  var pared32 = new THREE.Mesh(geoPared, materialPared);
  pared32.castShadow = true;
  pared32.receiveShadow = true;
  var pared33 = new THREE.Mesh(geoParedSobrePuerta, materialPared);
  pared33.castShadow = true;
  pared33.receiveShadow = true;
  pared31.position.z = -(distanciaParedes - (distanciaParedes-anchoPuerta/2)/2);
  pared3.add(pared31);
  pared32.position.z = distanciaParedes - (distanciaParedes-anchoPuerta/2)/2;
  pared3.add(pared32);
  pared33.position.y = alturaPuerta/2;
  pared3.add(pared33)
  puerta3 = new THREE.Object3D();
  tabla3 = new THREE.Mesh(geoPuerta, materialPuerta);
  tabla3.castShadow = true;
  tabla3.receiveShadow = true;
  pomo3 = new THREE.Mesh(geoPomo, materialBrillante);
  pomo3.position.z = anchoPuerta/2;
  pomo3.position.x = -grosorPuerta/1.5;
  puerta3.add(tabla3);
  puerta3.add(pomo3);
  puerta3.position.y = -(alturaPared-alturaPuerta)/2;
  pared3.add(puerta3)
  indicador3 = new THREE.Mesh(geoIndicador, materialIndicador3);
  indicador3.position.y = alturaPuerta/2.5;
  indicador3.position.x = -5;
  pared3.add(indicador3);
  luzIndicador3 = new THREE.SpotLight('red', 0);
  luzIndicador3.position.y = alturaPuerta/2.5;
  luzIndicador3.position.x = -5;
  luzIndicador3.target.position.set(0, 0, -(distanciaParedes - grosorPared*2)); //Donde enfoca
  luzIndicador3.angle = Math.PI/5; //cono de luz
  luzIndicador3.penumbra = 1; // zona de penumbra
  scene.add(luzIndicador3.target);
  pared3.add(luzIndicador3);
  pared3.rotation.y = Math.PI/2;
  pared3.position.z = -distanciaParedes;
  pared3.position.y = alturaPared/2;
  scene.add(pared3);

  let loader = new THREE.GLTFLoader();
  loader.load('./models/pingu/scene.gltf', function(gltf){
    juguete1 = gltf.scene.children[0];
    juguete1.scale.set(20,20,20);
    juguete1.position.x = posicionInicial;
    juguete1.rotation.z = -Math.PI/2;
    juguete1.castShadow = true;
    juguete1.receiveShadow = true;
    gltf.scene.traverse( function( node ) {
        if ( node.isMesh ) { node.castShadow = true; }
    } );
    scene.add(gltf.scene);
    j1 = true;
  });

  loader.load('./models/woody/scene.gltf', function(gltf){
    juguete2 = gltf.scene.children[0];
    juguete2.scale.set(0.2,0.2,0.2);
    juguete2.position.z = posicionInicial;
    juguete2.rotation.z = Math.PI;
    juguete2.castShadow = true;
    juguete2.receiveShadow = true;
    gltf.scene.traverse( function( node ) {
        if ( node.isMesh ) { node.castShadow = true; }
    } );
    scene.add(gltf.scene);
    j2 = true;
  });

  loader.load('./models/baby_groot/scene.gltf', function(gltf){
    juguete3 = gltf.scene.children[0];
    juguete3.scale.set(50,50,50);
    juguete3.position.z = -posicionInicial;
    juguete3.castShadow = true;
    juguete3.receiveShadow = true;
    gltf.scene.traverse( function( node ) {
        if ( node.isMesh ) { node.castShadow = true; }
    } );
    scene.add(gltf.scene);
    j3 = true;
  });
  // habitación frontal
  var habitacion1 = new THREE.Object3D();
  var pared41 = new THREE.Mesh(geoParedHabitacion, materialPared);
  pared41.receiveShadow = true;
  var pared42 = new THREE.Mesh(geoParedHabitacion, materialPared);
  pared42.receiveShadow = true;
  var pared43 = new THREE.Mesh(geoParedHabitacion, materialPared);
  pared43.receiveShadow = true;
  pared41.rotation.y = Math.PI/2;
  pared41.position.z = -(distanciaParedes/2);
  habitacion1.add(pared41);
  pared42.rotation.y = Math.PI/2;
  pared42.position.z = distanciaParedes/2;
  habitacion1.add(pared42);
  pared43.position.x = distanciaParedes/2;
  habitacion1.add(pared43);
  habitacion1.position.x = distanciaParedes*1.5;
  habitacion1.position.y = alturaPared/2;
  scene.add(habitacion1)
  // habitación derecha
  var habitacion2 = new THREE.Object3D();
  var pared51 = new THREE.Mesh(geoParedHabitacion, materialPared);
  pared51.receiveShadow = true;
  var pared52 = new THREE.Mesh(geoParedHabitacion, materialPared);
  pared52.receiveShadow = true;
  var pared53 = new THREE.Mesh(geoParedHabitacion, materialPared);
  pared53.receiveShadow = true;
  pared51.rotation.y = Math.PI/2;
  pared51.position.z = -(distanciaParedes/2);
  habitacion2.add(pared51);
  pared52.rotation.y = Math.PI/2;
  pared52.position.z = distanciaParedes/2;
  habitacion2.add(pared52);
  pared53.position.x = distanciaParedes/2;
  habitacion2.add(pared53);
  habitacion2.rotation.y = -Math.PI/2;
  habitacion2.position.z = distanciaParedes*1.5;
  habitacion2.position.y = alturaPared/2;
  scene.add(habitacion2)
  // habitación izquierda
  var habitacion3 = new THREE.Object3D();
  var pared61 = new THREE.Mesh(geoParedHabitacion, materialPared);
  pared61.receiveShadow = true;
  var pared62 = new THREE.Mesh(geoParedHabitacion, materialPared);
  pared62.receiveShadow = true;
  var pared63 = new THREE.Mesh(geoParedHabitacion, materialPared);
  pared63.receiveShadow = true;
  pared61.rotation.y = Math.PI/2;
  pared61.position.z = -(distanciaParedes/2);
  habitacion3.add(pared61);
  pared62.rotation.y = Math.PI/2;
  pared62.position.z = distanciaParedes/2;
  habitacion3.add(pared62);
  pared63.position.x = distanciaParedes/2;
  habitacion3.add(pared63);
  habitacion3.rotation.y = Math.PI/2;
  habitacion3.position.z = -distanciaParedes*1.5;
  habitacion3.position.y = alturaPared/2;
  scene.add(habitacion3)

  var paredes = ['images/NightPath/posx.jpg', 'images/NightPath/negx.jpg', 'images/NightPath/posy.jpg','images/NightPath/negy.jpg', 'images/NightPath/posz.jpg', 'images/NightPath/negz.jpg'];
  var mapaEntorno = new THREE.CubeTextureLoader().load(paredes);
  var shader = THREE.ShaderLib.cube;
  shader.uniforms.tCube.value = mapaEntorno;
  var matEntorno = new THREE.ShaderMaterial(
    {
              fragmentShader: shader.fragmentShader,
              vertexShader: shader.vertexShader,
              uniforms: shader.uniforms,
              depthWrite: false,
              side: THREE.BackSide
    }
  );
  var entorno = new THREE.Mesh(new THREE.BoxGeometry(5000, 5000, 5000), matEntorno);
  scene.add(entorno);
}

function update(){
  if (jugando == true){
    ahora = Date.now();
    puntos = parseInt((ahora-antes)/1000) - 5;
  }
  if (empiezaJuego == true){
    if (cameraControls.object.position.x > (distanciaParedes - grosorPared*2)){
      cameraControls.object.position.x = distanciaParedes - grosorPared*2;
    }
    if (cameraControls.object.position.x < -(distanciaParedes - grosorPared*2)){
      cameraControls.object.position.x = - (distanciaParedes - grosorPared*2);
    }
    if (cameraControls.object.position.z > (distanciaParedes - grosorPared*2)){
      cameraControls.object.position.z = distanciaParedes - grosorPared*2;
    }
    if (cameraControls.object.position.z < -(distanciaParedes - grosorPared*2)){
      cameraControls.object.position.z = -(distanciaParedes - grosorPared*2);
    }
    var delta = reloj.getDelta();
    cameraControls.update(delta);
  }
  var intensidadLuzAmbiente = effectController.intensidadLuzAmbiente;
  luzAmbiente.intensity = intensidadLuzAmbiente;
  velocidad = effectController.velocidad;
  TWEEN.update();
  if (j1 == true && j2 == true && j3 == true){
    document.getElementById("cargando").style.display = "none";
    document.getElementById("jugar").style.display = "block";
  }
  // else{
  //   document.getElementById("cargando").style.visibility = "visible";
  // }
  document.getElementById("labels").innerHTML = "Puntuación actual: ".concat(puntos);
}

function render(){
  requestAnimationFrame(render);
  update();
  renderer.clear(); // Ya que el autoclear está desactivado
  renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
  renderer.render(scene, camera);
}
