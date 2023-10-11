<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Recibe los datos del formulario
    $username = $_POST["username"];
    $language = $_POST["language"];

    // Guarda los datos en cookies
    setcookie("username", $username, time() + 3600); // Caduca en 1 hora (3600 segundos)
    setcookie("language", $language, time() + 3600); // Caduca en 1 hora (3600 segundos)
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Guardado de Preferencias</title>
</head>
<body>
<h1>Preferencias Guardadas</h1>
<p>Tus preferencias han sido guardadas.</p>
<p><a href="index.php">Volver al Formulario</a></p>
</body>
</html>

