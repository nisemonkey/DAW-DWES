// Obtener referencia al botón y al menú de Team Builder
const teamBuilderButton = document.getElementById('teambuilder');
const teamBuilderMenu = document.getElementById('teamBuilderMenu');
const confirmButton = document.getElementById('confirmButton');
const loadingMessage = document.getElementById('loadingMessage');

// Variable para verificar si se ha mostrado la lista de Pokémon
let pokemonListDisplayed = false;

// Definir array para almacenar información del equipo
let team = [];


// Función para seleccionar un Pokémon y agregarlo al equipo
function selectPokemon(pokemon) {
  // Agregar el Pokémon al equipo si hay espacio
  if (team.length < 6) {
    team.push(pokemon);
    createPokemonCard(pokemon); // Crear la tarjeta de Pokémon
  } else {
    console.log('El equipo está completo. No se puede agregar más Pokémon.');
  }
}


// Función para crear una tarjeta de Pokémon
function createPokemonCard(pokemon) {
  const selectedPokemonContainer = document.getElementById('selectedPokemonContainer');
  const card = document.createElement('div');
  const cardImage = document.createElement('img');
  const cardName = document.createElement('span');
  const deleteButton = document.createElement('button'); // Nuevo: botón de eliminar
  
  // Asignar un ID único basado en el nombre del Pokémon
  card.id = pokemon.name.toLowerCase(); // Convertir el nombre del Pokémon a minúsculas como ID
  card.classList.add('pokemon-card');
  
  // Establecer la imagen del Pokémon en la tarjeta
  cardImage.src = pokemon.sprites.normal;
  cardImage.alt = pokemon.name;
  
  // Establecer el nombre del Pokémon en la tarjeta
  cardName.textContent = pokemon.name;
  
  // Configurar el botón de eliminar
  deleteButton.textContent = 'X'; // Contenido del botón
  deleteButton.classList.add('delete-button'); // Clase para el botón de eliminar
  
  // Agregar evento de clic para eliminar el Pokémon
  deleteButton.addEventListener('click', () => {
    removePokemon(pokemon);
    selectedPokemonContainer.removeChild(card); // Eliminar la tarjeta del contenedor al hacer clic en el botón de eliminar
  });
  
  // Agregar la imagen, el botón de eliminar y el nombre a la tarjeta
  card.appendChild(deleteButton); // Agregar el botón de eliminar a la tarjeta
  card.appendChild(cardImage);
  card.appendChild(cardName);
  
  // Agregar la tarjeta al contenedor
  selectedPokemonContainer.appendChild(card);
}

// Función para eliminar un Pokémon del equipo
function removePokemon(pokemon) {
  const index = team.findIndex(p => p.name === pokemon.name);
  if (index !== -1) {
    team.splice(index, 1);
  }
}

// Función para guardar el equipo de Pokémon
function saveTeam() {
  if (team.length === 6) {
    // Obtener el nombre de usuario desde sessionStorage
    let username = sessionStorage.getItem('username');

    console.log(username);

    // Si no hay nombre de usuario en sessionStorage, solicitarlo al usuario
    if (!username) {
      username = prompt('Introduce tu nombre de usuario');
      // Guardar el nombre de usuario en sessionStorage
      sessionStorage.setItem('username', username);
    }

    // Mostrar mensaje de carga temporal
    loadingMessage.textContent = "Guardando equipo...";
    
    // Realizar la solicitud POST al servidor
    fetch('/save-team', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: username, team: team }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Error al guardar el equipo');
      }
      return response.json();
    })
    .then(data => {
      console.log(data.message);
      // Simular una carga de datos (aquí puedes realizar la lógica real de guardado de equipo)
      setTimeout(() => {
        console.log("Equipo guardado correctamente." ,team);
        // Muestra un mensaje de éxito o realiza cualquier otra acción necesaria para indicar que el equipo ha sido guardado.
        alert("¡Equipo guardado correctamente!");

        // Restablecer mensaje de carga después de guardar el equipo
        loadingMessage.textContent = "";

        // Cambiar el texto del botón después de guardar el equipo
        teamBuilderButton.textContent = "Equipo Guardado";
        teamBuilderButton.disabled = true; // Deshabilitar el botón después de guardar el equipo
        teamBuilderButton.textContent = "Crear Equipo";
        window.location.href = 'index.html';
      }, 2000); // Simula una demora de 2 segundos para guardar el equipo
    })
    .catch(error => {
      console.error('Error al guardar el equipo:', error);
      // Aquí puedes manejar el error, por ejemplo, mostrar un mensaje de error al usuario
    });
  } else {
    console.log("El equipo debe tener 6 Pokémon.");
  }
}


// Agregar evento de clic al botón
teamBuilderButton.addEventListener('click', () => {
  if (!pokemonListDisplayed) {
    // Mostrar el menú de Team Builder al hacer clic en el botón por primera vez
    teamBuilderMenu.style.display = 'block';
    pokemonListDisplayed = true;
  } else {
    // Si la lista de Pokémon ya se ha mostrado, simplemente llamar a la función saveTeam()
    saveTeam();
  }
});

// Llama a la función renderTeamBuilderMenu cuando se obtienen los datos de Pokémon
fetch('/getpokemon')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(pokemonList => {
    // Renderizar el menú de Team Builder
    renderTeamBuilderMenu(pokemonList);
  })
  .catch(error => {
    console.error('Error al obtener los Pokémon:', error);
  });

function renderTeamBuilderMenu(pokemonList) {
  const teamBuilderMenu = document.getElementById('teamBuilderMenu');
  
  // Crear la tabla
  const table = document.createElement('table');
  
  // Encabezados de la tabla
  const headerRow = table.insertRow();
  const headers = [' ', 'Pokemon', 'HP', 'ATK', 'DEF', 'SPA', 'SPD', 'SPE'];
  headers.forEach(headerText => {
    const th = document.createElement('th');
    th.textContent = headerText;
    headerRow.appendChild(th);
  });
  
  // Variable para almacenar la fila seleccionada actualmente
  let selectedRow = null;

  // Agregar filas de datos para cada Pokémon
  pokemonList.forEach(pokemon => {
    const row = table.insertRow();
    
    // Celda para la imagen y nombre del Pokémon
    const imgCell = row.insertCell();
    const img = document.createElement('img');
    img.src = pokemon.sprites.normal;
    img.width = 30; // Tamaño pequeño
    img.alt = pokemon.name;
    imgCell.appendChild(img);

    // Insertar el nombre del Pokémon en la primera celda
    const nameCell = row.insertCell();
    nameCell.textContent = pokemon.name; // Ajustar el contenido

    // Asignar el id del Pokémon al tr
    row.id = pokemon.name;

    // Celdas para las estadísticas del Pokémon
    ['hp', 'atk', 'def', 'spa', 'spd', 'spe'].forEach(stat => {
      const cell = row.insertCell();
      cell.textContent = pokemon.baseStats[stat];
    });

    // Agregar evento de clic a la fila para seleccionar el Pokémon
    row.addEventListener('click', () => {
      selectPokemon(pokemon, row);
    });
  });

  // Agregar la tabla al menú de Team Builder
  teamBuilderMenu.appendChild(table);
  // Mostrar el campo de búsqueda una vez que se haya generado la tabla
  const searchInput = document.getElementById('searchInput');
  teamBuilderButton.textContent = "Guardar Equipo"; //Cambiar nombre del botón
  searchInput.style.display = 'block';
}

// Función para filtrar la tabla de Pokémon por nombre
function filterPokemonTable() {
  const searchInput = document.getElementById('searchInput');
  const filter = searchInput.value.toUpperCase();
  const table = document.getElementById('teamBuilderMenu').getElementsByTagName('table')[0];
  const rows = table.getElementsByTagName('tr');

  for (let i = 0; i < rows.length; i++) {
    const nameCell = rows[i].getElementsByTagName('td')[1]; // La segunda celda contiene el nombre del Pokémon
    if (nameCell) {
      const txtValue = nameCell.textContent || nameCell.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        rows[i].style.display = ''; // Mostrar la fila si coincide con la búsqueda
      } else {
        rows[i].style.display = 'none'; // Ocultar la fila si no coincide con la búsqueda
      }
    }
  }
}

// Agregar evento de entrada al campo de búsqueda
const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('input', filterPokemonTable);

