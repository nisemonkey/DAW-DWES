<?php
session_start();

if(isset($_POST['username'])) {
    $_SESSION['username'] = $_POST['username'];
    $_SESSION['puntos_acumulados'] = 0;
}

if(isset($_SESSION['puntos_acumulados'])) {
    $_SESSION['puntos_acumulados'] += 10;
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Página 1</title>
</head>
<body>
<h1>Hola, <?php echo $_SESSION['username']; ?>!</h1>
<p>Tienes <?php echo $_SESSION['puntos_acumulados']; ?> puntos acumulados.</p>
<a href="pagina2.php">Ir a la Página 2</a><br>
<a href="index.php">Cerrar Sesión</a>
</body>
</html>


