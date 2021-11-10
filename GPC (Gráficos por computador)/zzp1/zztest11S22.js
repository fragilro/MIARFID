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
  // Localiza los atributos con el shader
  var coordenadas = gl.getAttribLocation(gl.program, 'posicion')
  // Creamos el buffer y lo activamos
  var bufferVertices = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferVertices);
  // Asignar buffer object al atributo elegido
  gl.vertexAttribPointer(coordenadas, 3, gl.FLOAT, false, 0, 0);
  // activar atributo
  gl.enableVertexAttribArray(coordenadas);
  // El valor del atributo ahora se lo da el click. Registrar call-back del raton
  canvas.onmousedown = function(evento){click(evento, gl, canvas);};
}

// array de clicks
var clicks = [];
function click(evento, gl, canvas)
{
  var x = evento.clientX; // coordenada x del cursor respecto al documento
  var y = evento.clientY; // coordenada y del cursor respecto al documento
  var rect = evento.target.getBoundingClientRect(); // rectangulo del canvas
  // conversión de coordenadas al cuadrado 2x2
  x = ((x - rect.left) - canvas.width/2) * 2/canvas.width;
  y = (canvas.height/2 - (y- rect.top)) * 2/canvas.height;
  // Guardar las coordenadas
  clicks.push(x); clicks.push(y); clicks.push(0.0);
  var aristas = [];
  for (var i = 0; i < clicks.length; i++){
    aristas.push(clicks[i*3]);
    aristas.push(clicks[i*3+1]);
    aristas.push(clicks[i*3+2]);
    aristas.push(clicks[(i+1)*3]);
    aristas.push(clicks[(i+1)*3+1]);
    aristas.push(clicks[(i+1)*3+2]);
  }
  // Borra el canvas con el color de fondo
  gl.clear(gl.COLOR_BUFFER_BIT);
  // escribir los datos en el buffer
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(aristas), gl.STATIC_DRAW);
  // Dibujar todos de una
  gl.drawArrays(gl.POINTS, 0, aristas.length/3);
  gl.drawArrays(gl.LINES, 0, aristas.length/3);
}
