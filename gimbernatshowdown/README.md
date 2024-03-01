# Guía de uso Gimbernat Showdown

- La aplicación puede ser ejecutada tanto por el archivo ejecutable (ejecutar_el_cliente.bat) como por línea de comando usando la instrucción (suponiendo que estás en la ruta raíz de la app) docker-compose up.
- Esto instalará automáticamente todo lo necesario para correr tanto el servidor como el cliente.
- El servidor está en escucha en **localhost:3001**; accede ahí para utilizar la app.
- Emplea socket.io, node.js y mongodb para gestionar solicitudes entre cliente-servidor y almacenar los datos.

## La app Gimbernat Showdown ya está aquí!

Un pequeño proyecto personal creado por Marc López, Jon Díaz y Adrián Marchena. Inspirados por la web https://play.pokemonshowdown.com, quisimos realizar algo que se asemejase empleando lo que se nos enseñó en clase y un poco de lo que vimos por ahí.
El resultado no es tal y como se había esperado, pero de todos modos posee casi todo lo que habíamos planteado en un inicio.
- **Chat en tiempo real**: los usuarios pueden chattear desde el inicio de la web en tiempo real.
- **Edición de equipos**: los usuarios pueden crear y borrar equipos con hasta más de 500 tipos de pokémon diferentes.
- **Combate (*inacabado*)**: el objetivo era emular un entorno de combate con un chat implementado, pero por falta de tiempo solamente se pudó configurar el servidor para que se muestren los equipos de ambos competidores junto a sus nombres.
- **Base de datos MongoDB**: una base de datos NoSQL preparada para controlar todos los datos que se mueven por la app.
- **Soporte docker**: docker completamente funcional que descargará todas las dependencias sin que tengas que mover un dedo.

### Aspectos técnicos 
La web tiene cariño, sí, pero nada es perfecto. ¡Aquí te dejo unas cuantas cosas que debes tener en cuenta antes de juguetear con la app!
- **Velocidades de carga**: no conseguimos darle mucha optimización al apartado de equipos, y es posible que la tarda donde existen todos los pokémon tarde en cargar. Tanto incluso que quizá aparece antes una barra de navegación. Pero no te asustes, solo espera un poco tras darle a "crear equipo" y aparecerá.
- **Gestión de usuarios**: esto no está del todo confirmado, pero es posible que surjan problemas al recargar la página o al pasar de una pestaña a otra. Sugerimos recargar la página si el header o alguna característica que funciona con usuario loggeado dejase de funcionar.
- **Sección del combate**: la parte que circula por el botón del combate es la menos tratada. Es por eso que, cabe la posibilidad de encontrar algún que otro fallo:
  - **Recargar la página en combate**: esto hace cosas raras con la sesión dentro del server y lo confunde. No es recomendable.
  - **Carga de datos en la página**: haciendo pruebas a veces los equipos no llegaban a cargar. Reintentando se soluciona.
