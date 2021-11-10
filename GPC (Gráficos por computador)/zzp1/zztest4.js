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
  // Le damos valor al atributo
  gl.vertexAttrib3f(coordenadas, 0.0, 0.0, 0.0);
  // Dibuja un punto
  gl.drawArrays(gl.POINTS, 0, 1);
}
