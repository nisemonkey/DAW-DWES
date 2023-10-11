# P5: Sesiones, Cookies y PDO

## Ejercicio 5

Exactamente lo mismo que el ejercicio anterior, con la única diferencia de que ahora es el usuario quien introduce los datos mediante un formulario de registro.
Además, también tiene la posibilidad de iniciar sesión con los datos introducidos. No obstante, el programa tiene algunos fallos en su funcionalidad:
- El registro admite duplicados. eg: pongo dos veces el mismo correo y me dejará. Esto hace que en el login solo se muestre el primer usuario insertado con dicho correo.
- No se permiten mostrar imágenes: este error quizá se deba a que mi máquina está más bloqueada que buscar fotos de barack obama en dall-E, y además solo se trata de un warning.

Mientras que la lógica del registro es idéntica a la del ejercicio 4 (solamente se incluye el que reciba los datos de un POST en vez de directamente), el login es algo diferente. 
El login recoge los datos de correo y contraseña mediante un POST y los verifica haciendo una consulta SELECT que busca primero los correos, y luego verifica que la contraseña sea correcta.
