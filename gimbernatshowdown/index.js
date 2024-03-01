const express = require('express');
const path = require('path');
const { MongoClient, ObjectId } = require('mongodb'); // Importa ObjectId desde MongoDB
const http = require('http'); // Requerido para utilizar Socket.IO
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app); // Crear un servidor HTTP con Express
const io = socketIo(server); // Integrar Socket.IO con el servidor HTTP
const PORT = process.env.PORT || 3001;

// Establecer el directorio de archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Manejar el BODY
app.use(express.json());

// Configurar el tipo MIME para archivos JavaScript
app.use((req, res, next) => {
  if (req.url.endsWith('.js')) {
    res.type('application/javascript');
  }
  next();
});

// Conexión a la base de datos MongoDB
const uri = 'mongodb+srv://mono:mono@dwes.rria2.mongodb.net/pokemon?retryWrites=true&w=majority';
const client = new MongoClient(uri);
let waitingPlayers = 0;
// Manejar las conexiones de Socket.IO
io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');

    // Manejar los mensajes enviados por el cliente
    socket.on('message', (data) => {
        const chat = { nombreusuario: data.username, mensaje: data.message };

        // Enviar el mensaje a todos los clientes conectados
        socket.broadcast.emit('message', chat);
    });

    // Manejar la solicitud de inicio de combate
    socket.on('startcombatrequest', () => {
        waitingPlayers++;
        console.log("Solicitud de inicio de combate recibida. Total de jugadores en espera:", waitingPlayers);
        if (waitingPlayers === 2) {
            // Cuando hay dos jugadores listos, enviar mensaje de inicio de combate
            console.log("Empezando combate...")
            io.emit('startcombat');
            waitingPlayers = 0;
        }
    });

    // Manejar evento 'randomTeam' enviado por el cliente
    socket.on('randomTeam', (randomTeam) => {
        console.log('Equipo aleatorio recibido del cliente:', randomTeam);

        // Enviar el equipo aleatorio al otro usuario
        socket.broadcast.emit('randomTeamCli', randomTeam);
    });

});



// Maneja la solicitud POST para guardar mensajes en la base de datos
app.post('/savechat', async (req, res) => {
    const { username, message } = req.body;
  
    try {
      await client.connect();
  
      const collection = client.db().collection('chats');
  
      // Insertar el mensaje en la base de datos
      await collection.insertOne({ nombreusuario: username, mensaje: message });
  
      res.status(201).json({ message: 'Mensaje guardado exitosamente' });
    } catch (error) {
      console.error('Error al guardar el mensaje:', error);
      res.status(500).json({ error: 'Error al guardar el mensaje en la base de datos' });
    } finally {
      await client.close();
    }
});

// Manejador de ruta para obtener todos los mensajes
app.get('/get-messages', async (req, res) => {
    try {
        const messages = await getAllMessages();
        res.json(messages);
    } catch (error) {
        console.error('Error al obtener los mensajes:', error);
        res.status(500).json({ error: 'Error al obtener los mensajes de la base de datos' });
    }
});

async function getAllMessages() {
    // Crear un cliente de MongoDB
    const client = new MongoClient(uri);

    try {
        // Conectar al servidor MongoDB
        await client.connect();

        // Seleccionar la colección de mensajes
        const collection = client.db().collection('chats');

        // Inicializar una lista para almacenar todos los mensajes
        const allMessages = await collection.find().toArray();

        return allMessages; // Devolver la lista de todos los mensajes
    } catch (error) {
        console.error('Error al buscar los mensajes:', error);
        throw error; // Propagar el error hacia arriba
    } finally {
        // Cerrar la conexión al finalizar la consulta
        await client.close();
    }
}




// Función para obtener la información de todos los Pokémon
async function getAllPokemon() {
    // Crear un cliente de MongoDB
    const client = new MongoClient(uri);

    try {
        // Conectar al servidor MongoDB
        await client.connect();

        // Seleccionar la colección de Pokémon
        const collection = client.db().collection('pokemons');

        // Inicializar una lista para almacenar todos los Pokémon
        const allPokemon = [];

        // Iterar a través de los números de los Pokémon y obtener los datos de cada uno
        for (let pokemonNumber = 1; ; pokemonNumber++) {
            // Realizar la consulta para encontrar el Pokémon por su número
            const pokemon = await collection.findOne({ num: pokemonNumber });

            // Si no se encuentra ningún Pokémon, salir del bucle
            if (!pokemon) break;

            // Agregar el Pokémon a la lista de todos los Pokémon
            allPokemon.push(pokemon);
        }

        return allPokemon; // Devolver la lista de todos los Pokémon
    } catch (error) {
        console.error('Error al buscar los Pokémon:', error);
        throw error; // Propagar el error hacia arriba
    } finally {
        // Cerrar la conexión al finalizar la consulta
        await client.close();
    }
}

// Ruta para obtener y enviar los Pokémon a get_pkm.js
app.get('/getpokemon', async (req, res) => {
  try {
      const pokemonList = await getAllPokemon();
      res.json(pokemonList); // Enviar los Pokémon como respuesta al cliente en formato JSON
  } catch (error) {
      console.error('Error al obtener los Pokémon:', error);
      res.status(500).json({ error: 'Error al obtener los Pokémon' });
  }
});

// Manejador de ruta para el registro de usuarios
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        await client.connect();

        const collection = client.db().collection('users');

        // Verificar si el usuario ya existe en la base de datos
        const existingUser = await collection.findOne({ username });

        if (existingUser) {
            return res.status(400).json({ error: 'El usuario ya existe' });
        }

        // Insertar el nuevo usuario en la base de datos
        await collection.insertOne({ username, password });

        res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).json({ error: 'Error al registrar usuario' });
    } finally {
        await client.close();
    }
});

// Manejador de ruta para el inicio de sesión de usuarios
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        await client.connect();

        const collection = client.db().collection('users');

        // Verificar si el usuario existe en la base de datos
        const existingUser = await collection.findOne({ username, password });

        if (!existingUser) {
            return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
        }

        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error en la autenticación:', error);
        res.status(500).json({ error: 'Error en la autenticación' });
    } finally {
        await client.close();
    }
});

// Manejador de ruta para guardar el equipo en la base de datos
app.post('/save-team', async (req, res) => {
    const { username, team } = req.body;
  
    try {
      await client.connect();
  
      const collection = client.db().collection('teams');
  
      // Insertar el equipo en la base de datos
      await collection.insertOne({ username, team });
  
      res.status(201).json({ message: 'Equipo guardado exitosamente' });
    } catch (error) {
      console.error('Error al guardar el equipo:', error);
      res.status(500).json({ error: 'Error al guardar el equipo' });
    } finally {
      await client.close();
    }
  });

// Ruta para obtener y enviar los equipos personales del usuario
app.get('/get-personalteams', async (req, res) => {
    const { username } = req.query; // Obtener el nombre de usuario de la solicitud
    
    try {
        await client.connect();

        const collection = client.db().collection('teams');

        // Buscar equipos pertenecientes al usuario específico
        const userTeams = await collection.find({ username }).toArray();

        res.json(userTeams); // Enviar los equipos como respuesta al cliente en formato JSON
    } catch (error) {
        console.error('Error al obtener los equipos personales:', error);
        res.status(500).json({ error: 'Error al obtener los equipos personales' });
    } finally {
        await client.close();
    }
});

// Función para eliminar un equipo
app.delete('/delete-team/:teamId', async (req, res) => {
    const teamId = req.params.teamId; // Obtener el ID del equipo a eliminar
    
    try {
        await client.connect();

        const collection = client.db().collection('teams');

        // Eliminar el equipo de la base de datos
        const result = await collection.deleteOne({ _id: new ObjectId(teamId) });// Convierte teamId a ObjectId

        if (result.deletedCount === 1) {
            res.status(200).json({ success: true, message: 'Equipo eliminado exitosamente' });
        } else {
            res.status(404).json({ success: false, error: 'Equipo no encontrado' });
        }
    } catch (error) {
        console.error('Error al eliminar el equipo:', error);
        res.status(500).json({ success: false, error: 'Error al eliminar el equipo' });
    } finally {
        await client.close();
    }
});

// Iniciar el servidor
server.listen(PORT, () => {
    console.log(`Servidor en ejecución en http://localhost:3001`);
});
