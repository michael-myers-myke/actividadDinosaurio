//******  Juego LOOP ********//


var time = new Date();// Variable 'time' para almacenar el tiempo actual (se usara para calcular el deltaTime)
var deltaTime = 0;//'deltaTime' se usara para calcular el tiempo que ha pasado entre cuadros del juego

if(document.readyState === "complete" || document.readyState === "interactive"){ // Este código se ejecuta cuando el documento está completamente cargado o es interactivo
    setTimeout(Init, 1); // Llama a la función Init después de 1 ms para iniciar el juego
}else{
    document.addEventListener("DOMContentLoaded", Init); // Si no está listo, espera a que el DOM esté cargado para inicializar
}
//Funcion que inicializa el juego
function Init() { 
    time = new Date(); //Guarda el tiempo actual
    Start(); // Llama a la función Start para configurar los elementos iniciales
    Loop(); // Inicia el ciclo del juego llamando a la función Loop
}
// Ciclo principal del juego. Este ciclo se repite constantemente
function Loop() {
    // Calcula el tiempo que ha pasado desde la última vez que se ejecutó 'Loop' en segundos
    deltaTime = (new Date() - time) / 1000;
    // Actualiza el tiempo a la nueva marca de tiempo
    time = new Date();
    // Llama a la función 'Update' para actualizar la lógica del juego en cada cuadro
    Update();
    // Vuelve a llamar a 'Loop' en el siguiente cuadro de animación
    requestAnimationFrame(Loop);
}

//****** Juego Logica ********//

// Variables que definen el comportamiento físico del dinosaurio y el entorno
var sueloY = 22; //Altura del suelo
var velY = 0; //Velocidad vertical del dinosaurio
var impulso = 900; //Fuerza con la que el dinosaurio salta
var gravedad = 2500; //Gravedad que afecta al dinosaurio

//Posicion inicial del dinosaurio
var dinoPosX = 42; //Posicion X (horizontal)
var dinoPosY = sueloY; //Posicion Y (vertical), empieza en el suelo

//Variables para el movimiento del escenario
var sueloX = 0; //Posicion x del suelo
var velEscenario = 1280/3; //Velocidad del escenario
var gameVel = 1; //Velocidad del juego (inicialmente Normal)
var score = 0; //Puntuacion del jugador

//Controladores del estado del juego
var parado = false; //Si el juego esta detenido (Game Over)
var saltando = false; //Si el dinosaurio esta saltando

//Variables para la creacion de obstaculos y nubes
var tiempoHastaObstaculo = 2; //Tiempo hasta que aparezca el prximo obstaculo
var tiempoObstaculoMin = 0.7; //Tiempo minimo entre obstaculos
var tiempoObstaculoMax = 1.8; //Tiempo maximo entre obstaculos
var obstaculoPosY = 16; //Altura a la que aparecen los obstaculos
var obstaculos = []; //Array que almacena los obstaculos en pantalla


var tiempoHastaNube = 0.5; //Tiempo hasta que aparezca la proxima nube
var tiempoNubeMin = 0.7; //Tiempo minimo entre nubes
var tiempoNubeMax = 2.7; //Tiempo maximo entre nubes
var maxNubeY = 270; //Altura maxima a la que pueden aparecer las nubes
var minNubeY = 100; //Altura mínima a la que pueden aparecer las nubes
var nubes = []; //Array que almacena las nubes en pantalla
var velNube = 0.5;  //Velocidad a la que se mueven las nubes

//Referencias a elementos HTML que se usarán en el juego
var contenedor; //Contenedor del juego
var dino; //Elemento del dinosaurio
var textoScore; //Elemento que muestra el puntaje
var suelo; //Elemento del suelo
var gameOver; //Mensaje de 'Game Over'

//Función que se llama al iniciar el juego, configura referencias a los elementos HTML
function Start() {
    gameOver = document.querySelector(".game-over"); //Selecciona el mensaje de 'Game Over'
    suelo = document.querySelector(".suelo"); // Selecciona el suelo
    contenedor = document.querySelector(".contenedor"); // Selecciona el contenedor del juego
    textoScore = document.querySelector(".score"); // Selecciona el texto de puntaje
    dino = document.querySelector(".dino"); // Selecciona el dinosaurio
    document.addEventListener("keydown", HandleKeyDown); // Agrega un listener para detectar teclas (salto)
}

// Función que actualiza el estado del juego en cada ciclo
function Update() {
    if(parado) return; // Si el juego está detenido, no hace nada
    
    MoverDinosaurio(); // Mueve al dinosaurio
    MoverSuelo(); // Mueve el suelo para simular movimiento
    DecidirCrearObstaculos(); // Decide si crear un nuevo obstáculo
    DecidirCrearNubes(); // Decide si crear una nueva nube
    MoverObstaculos(); // Mueve los obstáculos
    MoverNubes(); // Mueve las nubes
    DetectarColision(); // Verifica si hay colisiones con obstáculos

    // Aplica la gravedad al dinosaurio en cada cuadro
    velY -= gravedad * deltaTime;
}

// Función que detecta si se presiona una tecla, en este caso, la barra espaciadora (salto)
function HandleKeyDown(ev){
    if(ev.keyCode == 32){ // Si se presiona la tecla de espacio (keyCode 32)
        Saltar(); // Llama a la función Saltar
    }
}

// Función que controla el salto del dinosaurio
function Saltar(){
    if(dinoPosY === sueloY){ // Si el dinosaurio está en el suelo
        saltando = true; // Marca que está saltando
        velY = impulso; // Aplica la fuerza del salto
        dino.classList.remove("dino-corriendo"); // Quita la clase de correr mientras está en el aire
    }
}

// Función que mueve el dinosaurio basándose en la velocidad vertical
function MoverDinosaurio() {
    dinoPosY += velY * deltaTime; // Actualiza la posición Y del dinosaurio con base en la velocidad y el deltaTime
    if(dinoPosY < sueloY){ // Si el dinosaurio cae por debajo del suelo
        
        TocarSuelo(); // Llama a la función para tocar el suelo
    }
    dino.style.bottom = dinoPosY+"px"; // Actualiza la posición del dinosaurio en el DOM
}

// Función que controla cuando el dinosaurio toca el suelo
function TocarSuelo() {
    dinoPosY = sueloY; // Fija la posición Y del dinosaurio al suelo
    velY = 0; // Resetea la velocidad vertical a 0
    if(saltando){  // Si estaba saltando
        dino.classList.add("dino-corriendo"); // Vuelve a poner al dinosaurio a correr
    }
    saltando = false; // Marca que ya no está saltando
}

// Función que mueve el suelo para simular que el dinosaurio corre
function MoverSuelo() {
    sueloX += CalcularDesplazamiento(); // Incrementa la posición del suelo
    suelo.style.left = -(sueloX % contenedor.clientWidth) + "px"; // Mueve el suelo visualmente
}

// Calcula el desplazamiento del escenario según la velocidad del juego y deltaTime
function CalcularDesplazamiento() {
    return velEscenario * deltaTime * gameVel; // Retorna cuánto se debe mover el escenario
}

// Función que detiene el juego cuando el dinosaurio choca
function Estrellarse() {
    dino.classList.remove("dino-corriendo"); // Quita la animación de correr
    dino.classList.add("dino-estrellado"); // Añade la animación de chocar
    parado = true; // Marca que el juego se ha detenido
}

// Decide cuándo crear un nuevo obstáculo en el juego
function DecidirCrearObstaculos() {
    tiempoHastaObstaculo -= deltaTime; // Resta el tiempo hasta el próximo obstáculo
    if(tiempoHastaObstaculo <= 0) { // Si ha pasado el tiempo
        CrearObstaculo(); // Crea un nuevo obstáculo
    }
}

// Decide cuándo crear una nueva nube en el juego
function DecidirCrearNubes() {
    tiempoHastaNube -= deltaTime; // Resta el tiempo hasta la próxima nube
    if(tiempoHastaNube <= 0) { // Si ha pasado el tiempo
        CrearNube(); // Crea una nueva nube
    }
}

// Crea un nuevo obstáculo (cactus) en el juego
function CrearObstaculo() {
    var obstaculo = document.createElement("div"); // Crea un nuevo div para el obstáculo
    contenedor.appendChild(obstaculo); // Lo agrega al contenedor del juego
    obstaculo.classList.add("cactus"); //Añande la clase cactus
    if(Math.random() > 0.5) obstaculo.classList.add("cactus2"); //Añande el segundo cactus
    obstaculo.posX = contenedor.clientWidth;
    obstaculo.style.left = contenedor.clientWidth+"px";

    obstaculos.push(obstaculo); //Leañande el array a los obstaculos
    tiempoHastaObstaculo = tiempoObstaculoMin + Math.random() * (tiempoObstaculoMax-tiempoObstaculoMin) / gameVel; //Calcula el tiempo para el proximo obstaculo
}

// Crea una nueva nube en el juego
function CrearNube() {
    var nube = document.createElement("div"); // Crea un nuevo div para la nube
    contenedor.appendChild(nube); // Lo agrega al contenedor del juego
    nube.classList.add("nube"); // Añade la clase 'nube'
    nube.posX = contenedor.clientWidth; // Posiciona la nube fuera de la pantalla, a la derecha
    nube.style.left = contenedor.clientWidth+"px"; // Actualiza la posición en el DOM
    nube.style.bottom = minNubeY + Math.random() * (maxNubeY-minNubeY)+"px"; // Posiciona la nube en una altura aleatoria

    nubes.push(nube); // La añade al array de nubes
    tiempoHastaNube = tiempoNubeMin + Math.random() * (tiempoNubeMax-tiempoNubeMin) / gameVel; // Calcula el tiempo para la próxima nube
}

//Mueve los obstaculos hacia la izquierda
function MoverObstaculos() {
    for (var i = obstaculos.length - 1; i >= 0; i--) { 
        if(obstaculos[i].posX < -obstaculos[i].clientWidth) { // Si el obstáculo sale de la pantalla
            obstaculos[i].parentNode.removeChild(obstaculos[i]); // Lo elimina del DOM
            obstaculos.splice(i, 1); // Lo elimina del array
            GanarPuntos(); //Aumenta el puntaje
        }else{
            obstaculos[i].posX -= CalcularDesplazamiento(); //Mueve el obstaculo hacia la izquierda
            obstaculos[i].style.left = obstaculos[i].posX+"px"; //Actualiza la posicion en el DOM
        }
    }
}

//Mueve las nubes hacia la izquierda
function MoverNubes() {
    for (var i = nubes.length - 1; i >= 0; i--) {
        if(nubes[i].posX < -nubes[i].clientWidth) { // Si la nube sale de la pantalla
            nubes[i].parentNode.removeChild(nubes[i]); //La elimina del DOM
            nubes.splice(i, 1); //La elimina del Array
        }else{
            nubes[i].posX -= CalcularDesplazamiento() * velNube; // Mueve la nube hacia la izquierda (mas lento que los obstaculos)
            nubes[i].style.left = nubes[i].posX+"px"; //Actualiza la posicion en el DOM
        }
    }
}

//Funcion para que Conforme el jugador gana puntos, el fondo cambia (mediodía, tarde, noche, noche negra) y la velocidad del juego aumenta.
function GanarPuntos() {
    score++;
    textoScore.innerText = score;
    if(score == 5){
        gameVel = 1.5;
        contenedor.classList.add("mediodia");
    }else if(score == 10) { //Aqui se cambia a medio dia
        gameVel = 2;
        contenedor.classList.add("tarde");
    } else if(score == 20) { //Aqui se cambia a tarde
        gameVel = 3;
        contenedor.classList.add("noche");
    } else if(score == 30) { // Aquí se cambia a fondo negro (noche)
        gameVel = 3.5;
        contenedor.classList.add("nocheNegra");
    }
    suelo.style.animationDuration = (3/gameVel)+"s";
}

function GameOver() {
    Estrellarse();
    gameOver.style.display = "block";
}

//Detecta si el dinosaurio choca con un obstaculo
function DetectarColision() {
    for (var i = 0; i < obstaculos.length; i++) {
        if(obstaculos[i].posX > dinoPosX + dino.clientWidth) { 
            //EVADE
            break; //al estar en orden, no puede chocar con más
        }else{
            if(IsCollision(dino, obstaculos[i], 10, 30, 15, 20)) { // Si el dinosaurio choca
                GameOver(); //Llama a la funcion para detener el juego
            }
        }
    }
}

//Funcion que determina si hay colision entre dos elementos 
function IsCollision(a, b, paddingTop, paddingRight, paddingBottom, paddingLeft) {
    var aRect = a.getBoundingClientRect(); // Obtiene las dimensiones del dinosaurio
    var bRect = b.getBoundingClientRect(); // Obtiene las dimensiones del obstáculo

    return !(
        ((aRect.top + aRect.height - paddingBottom) < (bRect.top)) || // Si la parte inferior del dinosaurio está por encima del obstáculo
        (aRect.top + paddingTop > (bRect.top + bRect.height)) || 
        ((aRect.left + aRect.width - paddingRight) < bRect.left) ||
        (aRect.left + paddingLeft > (bRect.left + bRect.width))
    );
}
