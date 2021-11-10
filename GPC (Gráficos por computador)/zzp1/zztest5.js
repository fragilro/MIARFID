// Punto.js
// Dibuja un punto con shaders
// Igual que el 3, pero ahora con coordenadas

// Shader de vertices
var VSHADER_SOURCE =
// Declaramos variable atributo en el shader, y la posicion recibirá su valor
  'attribute vec4 posicion;                 \n' +
  'void main(){                             \n' +
    'gl_Position = posicion;                \n' +
    'gl_PointSize = 10.0;                   \n' +
  '}                                        \n' ;

// Shader de fragmentos
var FSHADER_SOURCE =
  'void main(){                              \n' +
    'gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' +
  '}                                         \n' ;

function main()
{
  // Recupera el area de dibujo (lienzo)
  var canvas = document.getElementById("canvas");
  if (!canvas) {
    console.log("Fallo al recuperar el canvas");
    return;
  }
  // Recupera el pincel de area de dibujo
  // como contexto WebGL
  var gl = getWebGLContext(canvas);
  if (!gl){
    console.log("Fallo al recuperar el contexto WebGL");
    return;
  }
  // Carga, compila y monta los shaders
  if(!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)){
    console.log("Fallo al inicializar los shaders");
  }
  // Fija color de fondo azul oscuro
  gl.clearColor(0.0, 0.0, 0.3, 1.0);
  // Borra el canvas con el color de fondo
  gl.clear(gl.COLOR_BUFFER_BIT);
  // Localiza el atributo con el shader
  var coordenadas = gl.getAttribLocation(gl.program, 'posicion')
  // El valor del atributo ahora se lo da el click. Registrar call-back del raton
  canvas.onmousedown = function(evento){click(evento, gl, canvas, coordenadas);};
}

// array de puntos
var puntos = [];
function click(evento, gl, canvas, coordenadas)
{
  var x = evento.clientX; // coordenada x del cursor respecto al documento
  var y = evento.clientY; // coordenada y del cursor respecto al documento
  var rect = evento.target.getBoundingClientRect(); // rectangulo del canvas
  // conversión de coordenadas al cuadrado 2x2
  x = ((x - rect.left) - canvas.width/2) * 2/canvas.width;
  y = (canvas.height/2 - (y- rect.top)) * 2/canvas.height;
  // Guardar las coordenadas
  puntos.push(x); puntos.push(y);
  // Borra el canvas con el color de fondo
  gl.clear(gl.COLOR_BUFFER_BIT);
  // Insertar las coordenadas como atributos y procesar uno a uno
  for(var i = 0; i < puntos.length; i += 2){
    gl.vertexAttrib3f(coordenadas,puntos[i], puntos[i+1], 0.0);
    // Dibuja un punto
    gl.drawArrays(gl.POINTS, 0, 1);
  }
}
