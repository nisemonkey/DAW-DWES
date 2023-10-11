<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registro e Inicio de Sesión</title>
</head>

<body>
<h1>Registro e Inicio de Sesión</h1>

<!-- Formulario de Registro -->
<h2>Registro</h2>
<form action="index.php" method="post" enctype="multipart/form-data">
    <input type="hidden" name="registro">
    Nombre: <input type="text" name="nombre" required><br>
    Correo: <input type="email" name="correo" required><br>
    Contraseña: <input type="password" name="contrasena" required><br>
    Fecha de Nacimiento: <input type="date" name="fecha_nacimiento" required><br>
    Imagen: <input type="file" name="imagen"><br>
    <input type="submit" value="Registrarse">
</form>

<!-- Formulario de Inicio de Sesión -->
<h2>Iniciar Sesión</h2>
<form action="index.php" method="post">
    <input type="hidden" name="login">
    Correo: <input type="email" name="correo" required><br>
    Contraseña: <input type="password" name="contrasena" required><br>
    <input type="submit" value="Iniciar Sesión">
</form>

<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (isset($_POST["registro"])) {
        // Lógica para el formulario de registro
        $nombre = $_POST["nombre"];
        $correo = $_POST["correo"];
        $contrasena = password_hash($_POST["contrasena"], PASSWORD_DEFAULT);
        $fechaNacimiento = $_POST["fecha_nacimiento"];
        $permisos = 'usuario'; // Por defecto, los nuevos usuarios no son administradores

        // Manejo de la imagen
        $imagenNombre = $_FILES["imagen"]["name"];
        $imagenRuta = "uploads/" . $imagenNombre;
        move_uploaded_file($_FILES["imagen"]["tmp_name"], $imagenRuta);

        try {
            // Establecer la conexión a la base de datos
            $conexion = new PDO('mysql:host=fmesasc.com;dbname=daw2', 'daw2', 'Gimbernat');
            $conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            // Consulta SQL para insertar un nuevo usuario con la ruta de la imagen
            $sql = "INSERT INTO USERS (nombre, correo, contrasena, fecha_nacimiento, permisos, imagen) 
                        VALUES (:nombre, :correo, :contrasena, :fecha_nacimiento, :permisos, :imagen)";
            $stmt = $conexion->prepare($sql);
            $stmt->bindParam(':nombre', $nombre);
            $stmt->bindParam(':correo', $correo);
            $stmt->bindParam(':contrasena', $contrasena);
            $stmt->bindParam(':fecha_nacimiento', $fechaNacimiento);
            $stmt->bindParam(':permisos', $permisos);
            $stmt->bindParam(':imagen', $imagenRuta);
            $stmt->execute();

            echo "Usuario registrado correctamente.";
        } catch (PDOException $e) {
            echo "Error: " . $e->getMessage();
        }
    }

    if (isset($_POST["login"])) {
        // Lógica para el formulario de inicio de sesión
        $correo = $_POST["correo"];
        $contrasena = $_POST["contrasena"];

        try {
            // Establecer la conexión a la base de datos
            $conexion = new PDO('mysql:host=fmesasc.com;dbname=daw2', 'daw2', 'Gimbernat');
            $conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            // Consulta SQL para verificar las credenciales del usuario
            $sql = "SELECT * FROM USERS WHERE correo = :correo";
            $stmt = $conexion->prepare($sql);
            $stmt->bindParam(':correo', $correo);
            $stmt->execute();
            $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

            // Verificar la contraseña
            if ($usuario && password_verify($contrasena, $usuario['contrasena'])) {
                echo "Inicio de sesión exitoso. Bienvenido, " . $usuario['nombre'] . "!<br>";
                echo '<img src="' . $usuario['imagen'] . '" alt="Imagen del Usuario">';
            } else {
                echo "Credenciales incorrectas. Por favor, inténtalo de nuevo.";
            }
        } catch (PDOException $e) {
            echo "Error: " . $e->getMessage();
        }
    }
}
?>
</body>

</html>



