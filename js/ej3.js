let numeroSecreto = Math.floor(Math.ramdom() * 100) + 1; //Genera un numero entre 1 y 100
let intentos = 0; //variable inicializada en 0

function adivinar() {
    let intento = document.getElementById("numero").value; //Obtiene el numero ingresado por el usuario
    intentos++; //Incrementa la variable intentos
    if (intento == numeroSecreto) { //si el numero ingresado es igual al secreto muestra mensaje de que gano
        document.getElementById("resultado").innerText = "¡Correcto adivinaste en "+intentos+ "intentos.";
    }else if (intento < numeroSecreto) { // Si el numero ingresado es  mayor al secreto muestra un mensaje de que es mayor
        document.getElementById("resultado").innerText = "¡EL numero es mayor. Intentalo de nuevo";
    }else { // Si el numero ingresado es menor al secreto muestra mebsaje de que es menor al secreto
        document.getElementById("resultado").innerText = "¡El numero es menor. Intentalo de nuevo";
    }
}
adivinar();