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
  'precision highp float; \n' +
  'uniform vec4 color;                 \n' +
  'void main(){                              \n' +
    'gl_FragColor = color;\n' +
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
  // var aristas = [0,1, 0,2, 0,3, 1,2, 2,3, 3,1];
  var triangulos = [0,3,2, 0,2,1, 0,1,3, 1,3,2]
  var tetraedro = [];
  // for (var i = 0; i < aristas.length; i++){
  //   tetraedro.push(coord[aristas[i]*3]);
  //   tetraedro.push(coord[aristas[i]*3+1]);
  //   tetraedro.push(coord[aristas[i]*3+2]);
  // }
  for (var i = 0; i < triangulos.length; i++){
    tetraedro.push(coord[triangulos[i]*3]);
    tetraedro.push(coord[triangulos[i]*3+1]);
    tetraedro.push(coord[triangulos[i]*3+2]);
  }
  // Borra el canvas con el color de fondo
  gl.clear(gl.COLOR_BUFFER_BIT);
  // Localiza los atributos con el shader
  var coordenadas = gl.getAttribLocation(gl.program, 'posicion')
  // Creamos buffer
  var bufferVertices = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferVertices);
  gl.vertexAttribPointer(coordenadas, 3, gl.FLOAT, false, 0, 0);
  // activar atributo
  gl.enableVertexAttribArray(coordenadas);
  var color = gl.getUniformLocation(gl.program, 'color')
  // escribir los datos en el buffer
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tetraedro), gl.STATIC_DRAW);
  // Silueta triangulo
  gl.uniform4f(color ,1.0, 1.0, 1.0, 1.0);
  gl.drawArrays(gl.LINES, 0, tetraedro.length/3);
  // Triangulo relleno
  gl.uniform4f(color ,1.0, 0.0, 0.0, 1.0);
  gl.drawArrays(gl.TRIANGLES, 0, tetraedro.length/3);
}
