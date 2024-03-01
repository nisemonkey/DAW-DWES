// Importa la biblioteca socket.io-client 
const socket = io('http://localhost:3001'); // Conecta con el servidor Socket.IO en el puerto 3001
// Manejar eventos de conexión y errores
let username = sessionStorage.getItem('username');
socket.on('connect', function() {
    console.log('Conexión establecida');
    username = sessionStorage.getItem('username');
    if (username) {
        // Si hay un nombre de usuario, mostrarlo y ocultar el botón "Registrar nombre"
        document.getElementById("usernameDisplay").innerText = username;
        document.getElementById("registerButton").style.display = "none";
    } else {
        // Si no hay un nombre de usuario, ocultar el nombre de usuario y mostrar el botón "Registrar nombre"
        document.getElementById("usernameDisplay").style.display = "none";
    }
});

// Función para obtener un número aleatorio entre min y max (incluidos)
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

var randomTeamLocal;

function obtenerEquipoAleatorio(){
    // Obtener la cantidad de equipos almacenados en sessionStorage
  var teamCount = Object.keys(sessionStorage).filter(key => key.startsWith('userTeam_')).length;
  
  // Verificar si hay equipos almacenados
  if (teamCount > 0) {
    // Generar un número aleatorio entre 0 y teamCount - 1
    var randomIndex = getRandomInt(0, teamCount - 1);
  
    // Construir la clave del equipo aleatorio
    var randomTeamKey = 'userTeam_' + randomIndex;
  
    // Obtener el equipo aleatorio del sessionStorage
    randomTeamLocal = JSON.parse(sessionStorage.getItem(randomTeamKey));
  
    console.log('Equipo aleatorio seleccionado:', randomTeamLocal);
  } else {
    console.log('No hay equipos almacenados en sessionStorage.');
  }
}

// Función para mostrar los equipos en el panel izquierdo
function mostrarEquipos(randomTeam, randomTeamLocal) {
    // Aquí debes construir el HTML para mostrar ambos equipos en el panel izquierdo
    var leftPanel = document.getElementById('battle-options');
    username = sessionStorage.getItem('username');
    
    // Limpiar contenido existente en el panel izquierdo
    leftPanel.innerHTML = '';
    
    // Construir HTML para mostrar el equipo del otro usuario (randomTeam)
    var otroUsuarioHTML = '<div class="equipo-container"><h3>Equipo de ' + randomTeam.username + '</h3><ul>';
    randomTeam.team.forEach(pokemon => {
        otroUsuarioHTML += '<li class="pokemon-item">' + pokemon.name + ' - HP: ' + pokemon.baseStats.hp + '</li>';
        otroUsuarioHTML += '<img class="pokemon-image" src="' + pokemon.sprites.normal + '" alt="' + pokemon.name + '">';
    });
    otroUsuarioHTML += '</ul></div>';
    
    // Construir HTML para mostrar el equipo del usuario local (randomTeamLocal)
    var usuarioLocalHTML = '<div class="equipo-container"><h3>Equipo de ' + username + '</h3><ul>';
    randomTeamLocal.team.forEach(pokemon => {
        usuarioLocalHTML += '<li class="pokemon-item">' + pokemon.name + ' - HP: ' + pokemon.baseStats.hp + '</li>';
        usuarioLocalHTML += '<img class="pokemon-image" src="' + pokemon.sprites.back + '" alt="' + pokemon.name + '">';
    });
    usuarioLocalHTML += '</ul></div>';
    
    // Agregar HTML al panel izquierdo
    leftPanel.innerHTML = usuarioLocalHTML + otroUsuarioHTML;
}




// Obtener el equipo aleatorio
var randomTeam = obtenerEquipoAleatorio();

//------Cosas del socket-----------

// Emitir el equipo aleatorio al servidor
socket.emit('randomTeam', randomTeamLocal);

// Escuchar el evento 'randomTeam' enviado por el servidor
socket.on('randomTeamCli', (randomTeam) => {
    console.log('Equipo aleatorio recibido del servidor:', randomTeam);
    
    // Obtener el equipo del otro usuario (randomTeam) y el equipo del cliente (randomTeamLocal)
    // Aquí asumimos que ya tienes almacenado el equipo del usuario local en la variable randomTeamLocal
    
    // Mostrar ambos equipos en el panel izquierdo
    mostrarEquipos(randomTeam, randomTeamLocal);
});