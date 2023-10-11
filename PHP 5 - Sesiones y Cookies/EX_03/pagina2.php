<?php
session_start();

if(isset($_SESSION['puntos_acumulados'])) {
    $_SESSION['puntos_acumulados'] += 10;
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Página 2</title>
</head>
<body>
<h1>Hola, <?php echo $_SESSION['username']; ?>!</h1>
<p>Tienes <?php echo $_SESSION['puntos_acumulados']; ?> puntos acumulados.</p>
<a href="pagina1.php">Volver a la Página 1</a><br>
<a href="index.php">Cerrar Sesión</a>
</body>
</html>

