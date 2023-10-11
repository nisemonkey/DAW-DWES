<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Login</title>
</head>
<body>
    <h1>Bienvenido al Sistema</h1>
    <?php

    /*$id = 1;

    try{
        // Código
        $conexion = new PDO('mysql:host=fmesasc.com;dbname=daw2', 'daw2', 'Gimbernat');
        echo "Conexion OK</br>";
        $resultados = $conexion->query("SELECT * FROM usuarios WHERE id = $id");
        foreach($resultados as $fila){
            echo $fila['id'] . " - " .$fila['nombre'] . '</br>';
        }


    }catch(PDOException $e){
        echo "Error: " . $e->getMessage();
    }*/


    try {
        // Establecer la conexión a la base de datos
        $conexion = new PDO('mysql:host=fmesasc.com;dbname=daw2', 'daw2', 'Gimbernat');
        $conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Consulta SQL para crear la tabla USERS si no existe
        $sqlCrearTabla = "CREATE TABLE IF NOT EXISTS USERS (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL,
        correo VARCHAR(255) NOT NULL,
        contrasena VARCHAR(255) NOT NULL,
        fecha_nacimiento DATE,
        permisos ENUM('admin', 'usuario') NOT NULL DEFAULT 'usuario',
        imagen VARCHAR(255) DEFAULT NULL
    )";

        // Ejecutar la consulta para crear la tabla
        $conexion->exec($sqlCrearTabla);

        echo "Tabla USERS creada correctamente.</br>";

        // Consulta SQL para insertar un usuario administrador
        $nombreAdmin = 'Admin';
        $correoAdmin = 'admin@example.com';
        $contrasenaAdmin = password_hash('tu_contraseña_admin', PASSWORD_DEFAULT); // Guardar la contraseña de forma segura
        $fechaNacimientoAdmin = '2000-01-01';
        $permisosAdmin = 'admin';

        $sqlInsertarAdmin = "INSERT INTO USERS (nombre, correo, contrasena, fecha_nacimiento, permisos) VALUES (:nombre, :correo, :contrasena, :fecha_nacimiento, :permisos)";

        // Preparar y ejecutar la consulta para insertar el usuario administrador
        $stmt = $conexion->prepare($sqlInsertarAdmin);
        $stmt->bindParam(':nombre', $nombreAdmin);
        $stmt->bindParam(':correo', $correoAdmin);
        $stmt->bindParam(':contrasena', $contrasenaAdmin);
        $stmt->bindParam(':fecha_nacimiento', $fechaNacimientoAdmin);
        $stmt->bindParam(':permisos', $permisosAdmin);
        $stmt->execute();

        echo "Usuario administrador creado correctamente:</br>";
        echo "Nombre: $nombreAdmin</br>";
        echo "Correo: $correoAdmin</br>";
        echo "Contraseña: tu_contraseña_admin</br>";
        echo "Fecha de Nacimiento: $fechaNacimientoAdmin</br>";
        echo "Permisos: $permisosAdmin</br>";

    } catch (PDOException $e) {
        echo "Error: " . $e->getMessage();
    }


    ?>
</body>
</html>

