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
  // Fija color de fondo azul oscuro
  gl.clearColor(0.0, 0.0, 0.3, 1.0);
  // Borra el canvas con el color de fondo
  gl.clear(gl.COLOR_BUFFER_BIT);
}
