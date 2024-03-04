// Importa la biblioteca socket.io-client 
const socket = io('http://localhost:3001'); // Conecta con el servidor Socket.IO en el puerto 3001
const username = sessionStorage.getItem('username');

// Manejar eventos de conexión y errores
socket.on('connect', function() {
    console.log('Conexión establecida');
    // Agregar evento de clic al nombre de usuario para eliminar el nombre de usuario del sessionStorage
    document.getElementById("usernameDisplay").addEventListener("click", function(event) {
        sessionStorage.removeItem("username");
        // Actualizar el texto del nombre de usuario para borrarlo de la pantalla y mostrar el botón "Registrar nombre"
        document.getElementById("usernameDisplay").style.display = "none";
        document.getElementById("registerButton").style.display = "block";
        window.location.href = 'index.html';
    });
    verificarLogueoForo();
    // Verificar si hay un nombre de usuario en sessionStorage
    let username = sessionStorage.getItem('username');
    if (username) {
        // Si hay un nombre de usuario, mostrarlo y ocultar el botón "Registrar nombre"
        document.getElementById("usernameDisplay").innerText = username;
        document.getElementById("registerButton").style.display = "none";
        guardarEquiposUser(username);
    } else {
        // Si no hay un nombre de usuario, ocultar el nombre de usuario y mostrar el botón "Registrar nombre"
        document.getElementById("usernameDisplay").style.display = "none";
    }
    obtenerMensajesDelServidor();
});

socket.on('message', function(data) {
    console.log(data);
    // Manejar los mensajes recibidos y mostrarlos en el chat
    mostrarMensaje(`${data.nombreusuario}: ${data.mensaje}`);
});

socket.on('error', function(error) {
    console.error('Error al recibir mensajes:', error);
});

// Función para manejar la redirección a la página de batalla cuando el combate ha iniciado
function redirigirABatalla() {
    let combatbtn = document.getElementById('start-battle-btn');
    combatbtn.innerHTML = "Combatir"
    window.location.href = 'battle.html';
}

// Escuchar el evento 'start_combat' y redirigir a la página de batalla cuando se emite
socket.on('startcombat', redirigirABatalla);

document.getElementById("send-btn").addEventListener("click", enviarMensaje);

document.getElementById("input-msg").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        enviarMensaje();
    }
});

function enviarMensaje() {
    var mensaje = document.getElementById("input-msg").value;
    if (mensaje !== "") {
        socket.emit('message', { username: username, message: mensaje }); // Emite un evento 'message' al servidor
        guardarMensajeEnDB(username, mensaje); // Llama a la función para guardar el mensaje en la base de datos
        document.getElementById("input-msg").value = "";
    }
}

function mostrarMensaje(mensaje) {
    var chatBox = document.getElementById("chat-box");
    var nuevoMensaje = document.createElement("p");
    
    // Comprueba si el mensaje es propio o ajeno
    if (mensaje.includes(username)) {
        nuevoMensaje.className = "own-message"; // Aplica una clase CSS para los mensajes propios
    } else {
        nuevoMensaje.className = "other-message"; // Aplica una clase CSS para los mensajes ajenos
    }

    nuevoMensaje.textContent = mensaje;
    chatBox.appendChild(nuevoMensaje);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function guardarMensajeEnDB(username, mensaje) {
    // Realiza una solicitud HTTP para guardar el mensaje en la base de datos
    fetch('/savechat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: username, message: mensaje })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        // Llama a la función para mostrar el mensaje en el chat después de guardarlo
        mostrarMensaje(`${username}: ${mensaje}`);
    })
    .catch(error => console.error('Error al guardar el mensaje en la base de datos:', error));
}

function obtenerMensajesDelServidor() {
    // Realizar una solicitud HTTP al servidor para obtener mensajes
    fetch('/get-messages')
        .then(response => response.json())
        .then(data => {
            // Mostrar cada mensaje en el chat
            data.forEach(mensaje => {
                mostrarMensaje(`${mensaje.nombreusuario}: ${mensaje.mensaje}`);
            });
        })
        .catch(error => console.error('Error al obtener mensajes del servidor:', error));
}
function guardarEquiposUser(username) {
    $.get('/get-personalteams', { username: username }, function(teams) {
        var teamContainer = $('#team-container');

        teams.forEach(function(team, index) {
            var teamDiv = $('<div>').addClass('team');

            team.team.forEach(function(pokemon) {
                var img = $('<img>').attr('src', pokemon.sprites.normal); // URL de la imagen del Pokémon
                img.attr('width', '30'); // Establecer el ancho de la imagen en 30 píxeles
                img.attr('alt', pokemon.name); // Establecer el texto alternativo de la imagen

                teamDiv.append(img);
            });

            teamContainer.append(teamDiv);

            // Guardar el equipo en sessionStorage con un identificador único
            sessionStorage.setItem(`userTeam_${index}`, JSON.stringify(team));
        });
    });
}





function verificarLogueoForo() {
    let username = sessionStorage.getItem('username');
    let forumContainer = document.querySelector('.forum');
    let welcomeMessage = forumContainer.querySelector('p');
    let forumTitle = forumContainer.querySelector('h2');
    let chatbox = forumContainer.querySelector('div');
    if (!username) {
        // Si el usuario no está logueado
        welcomeMessage.style.display = 'none'; // Oculta el párrafo de bienvenida
        chatbox.style.display = 'none';
        forumTitle.textContent = 'Debes iniciar sesión para usar el foro'; // Cambia el texto del título
    } else {
        // Si el usuario está logueado, muestra el contenido normalmente
        welcomeMessage.style.display = 'block'; // Asegura que el párrafo de bienvenida esté visible
        chatbox.style.display = 'flex';
        forumTitle.textContent = 'Foro Pokemon Showdown'; // Restaura el texto del título
    }
}
