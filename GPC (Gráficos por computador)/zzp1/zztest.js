function main()
{
  // Recupera el area de dibujo (lienzo)
  var canvas = document.getElementById("canvas");
  if (!canvas) {
    console.log("Fallo al recuperar el canvas");
    return;
  }
  // Recupera el pincel de area de dibujo
  // y dibuja un rectangulo
  var pincel = canvas.getContext("2d");
  pincel.fillStyle = "rgba(0,0,255,1)";
  // Posición 120, 70 tamaño 150x150
  pincel.fillRect(120,70,150,150)
}
