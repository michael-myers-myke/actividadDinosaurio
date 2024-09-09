function cambiarColor() { //Cambia el color de los elementos con los id
    document.getElementById("rojo").style.backgroundColor = color === 'rojo' ? 'red' : 'grey'; //el color pasado rojo se pone el fondo de color rojo con el id 'rojo'
    document.getElementById("amarillo").style.backgroundColor = color === 'amarillo' ? 'yellow' : 'grey'; //el color pasado amarillo se pone el fondo de color amarillo con el id 'amarillo'
    document.getElementById("verde").style.backgroundColor = color === 'verde' ? 'green' : 'grey'; // el color pasado verde se pone el fondo de color verde con el id 'verde'
}

function iniciarSemaforo() { //Inicia el ciclo del semaforo
    setTimeout(() => cambiarColor('rojo'), 0); //Cambia el color a rojo de manera inmediata
    setTimeout(() => cambiarColor('amarillo'), 3000); //Cambia el color a amarillo despues de 3000 milisegundos
    setTimeout(() => cambiarColor('verde'), 6000); //cambia el color a verde despues de 6000 milisegundos
    setTimeout(iniciarSemaforo, 9000); //Reinicia el ciclo
}