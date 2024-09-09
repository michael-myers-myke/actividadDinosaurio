var contador = 1; //variable que inicializa en 1 como contador
var temporizador; //variable sin valor inicial

function iniciar() {
    temporizador = setInterval(rotarImagenes, 3000); //Hace rotar las imagenes cada 3 segundos
}

function rotarImagenes() { //Reinicial el contador a 0 si llega a 10
    if (contador >= 10) {
        contador = 0;
    }
    var img = document.getElementById('imgSlide'); //llama a la imagen por su id
    img.src = './images/img' + ++contador + '.jpg'; //cambia la imagen mostrada incrementando el numero en el nombre del archivo
}
iniciar();