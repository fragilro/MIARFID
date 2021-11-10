// Shader de vertices
var VSHADER_SOURCE =
// Declaramos variable atributo en el shader, y la posicion recibirá su valor
  'attribute vec4 posicion;                 \n' +
  'uniform mat4 modelMatrix;                \n' +
  'uniform mat4 viewMatrix;                 \n' +
  'uniform mat4 projMatrix;                 \n' +
  'void main(){                             \n' +
    'gl_Position = projMatrix * viewMatrix * modelMatrix * posicion;                \n' +
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
  render(gl);
}

function render(gl)
{
  var coord = [0.0, 0.0, 0.5,
               0.0, 0.9, 0.0,
               0.7, -0.6, 0.0,
               -0.7, -0.6, 0.0];
  var triangulos = [0,3,2, 0,2,1, 0,1,3, 1,3,2];
  // Borra el canvas con el color de fondo
  gl.clear(gl.COLOR_BUFFER_BIT);
  // Inicializar matriz del modelo
  var modelMatrix = new Matrix4();
  var viewMatrix = new Matrix4();
  var projMatrix = new Matrix4();
  modelMatrix.setIdentity();
  viewMatrix.setIdentity();
  projMatrix.setIdentity();
  // Localiza las matrices en shader
  var u_modelMAtrix = gl.getUniformLocation(gl.program, 'modelMatrix');
  var u_viewMAtrix = gl.getUniformLocation(gl.program, 'viewMatrix');
  var u_projMAtrix = gl.getUniformLocation(gl.program, 'projMatrix');
  // Rotación de 90º eje Z matriz del modelo
  modelMatrix.rotate(90,0,0,1);
  // Creamos buffer
  var bufferVertices = gl.createBuffer();
  var bufferIndices = gl.createBuffer();
  // activamos y rellenamos vertices
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferVertices);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(coord), gl.STATIC_DRAW);
  // Localiza los atributos con el shader
  var coordenadas = gl.getAttribLocation(gl.program, 'posicion');
  gl.vertexAttribPointer(coordenadas, 3, gl.FLOAT, false, 0, 0);
  // activar atributo
  gl.enableVertexAttribArray(coordenadas);
  // activamos y rellenamos indices
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, bufferIndices);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(triangulos), gl.STATIC_DRAW);
  // Triangulo relleno
  gl.drawElements(gl.TRIANGLES, 12, gl.UNSIGNED_BYTE, 0);
}
