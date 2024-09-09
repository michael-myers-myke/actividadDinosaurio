function calcular() { //Obtiene los valores de los numeros ingresados 
    let num1 = parseFloat(document.getElementById("num1").value);
    let num2 = parseFloat(document.getElementById("num2").value);
    let operacion = document.getElementById("operacion").value; //Obtener el valor de la operacion seleccionada por el usuario
    let resultado; //Variable para almacenar el resultado

    switch(operacion) { //Switch para realizar la operacion que se seleccione
        case "+":
            resultado = num1 + num2;
            break;
        case "-":
            resultado = num1 - num2;
            break;
        case "*":
            resultado = num1 * num2;
            break;
        case "/":
            resultado = num1 / num2;
            break;
        default:
            resultado = "Operacion no valida";
    }
    document.getElementById("resultado").innerText = "Resultado: " +resultado; //Mostrar el resultado
}
calcular();