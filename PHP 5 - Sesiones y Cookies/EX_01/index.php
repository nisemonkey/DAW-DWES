<?php
session_start();

// Nombre de la cookie
$cookie_name = "contador_visitas";

// Verificar si la cookie existe
if(!isset($_COOKIE[$cookie_name])) {
    // Si la cookie no existe, establecerla con un valor inicial de 1
    setcookie($cookie_name, 1, time() + 3600); // Expira en 1 hora (3600 segundos)
} else {
    // Si la cookie existe, verificar si ha pasado al menos una hora
    $hora_actual = time();
    $hora_creacion = $_COOKIE[$cookie_name];

    // Si ha pasado una hora desde la última visita, incrementar el contador
    if($hora_actual - $hora_creacion >= 3600) {
        $nuevo_contador = $_COOKIE[$cookie_name] + 1;
        setcookie($cookie_name, $nuevo_contador, time() + 3600); // Actualizar la cookie y establecer la expiración en 1 hora
    }
}
?>
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Contador de sesiones</title>
</head>
<body>
    <h1>Test de cookies 1</h1>
    <?php
    // Mostrar el número de visitas
    if(isset($_COOKIE[$cookie_name])) {
        echo "<p>Número de visitas: " . $_COOKIE[$cookie_name] . "</p>";
    } else {
        echo "<p>Primera visita</p>";
    }
    ?>
</body>
</html>
