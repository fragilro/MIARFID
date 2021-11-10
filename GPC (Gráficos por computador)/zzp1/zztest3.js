// Punto.js
// Dibuja un punto con shaders

// Shader de vertices
var VSHADER_SOURCE =
  'void main(){                             \n' +
    'gl_Position = vec4(0.0, 0.0, 0.0, 1.0);\n' +
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
  // Dibuja un punto
  gl.drawArrays(gl.POINTS, 0, 1);
}
