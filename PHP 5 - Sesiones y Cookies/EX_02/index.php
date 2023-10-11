<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Preferencias del Usuario</title>
</head>
<body>
<h1>Preferencias del Usuario</h1>
    <?php
    // Verificar si las cookies existen
    if(isset($_COOKIE['username']) && isset($_COOKIE['language'])) {
        $username = $_COOKIE['username'];
        $language = $_COOKIE['language'];
    } else {
        $username = "";
        $language = "es"; // Lengua por defecto
    }
    ?>
<form action="cookies.php" method="post">
    <label for="username">Nombre de Usuario:</label>
    <input type="text" id="username" name="username" value="<?php echo $username; ?>" required><br><br>

    <label for="language">Lengua por Defecto:</label>
    <select id="language" name="language" required>
        <option value="es" <?php if($language == "es") echo "selected"; ?>>Español</option>
        <option value="en" <?php if($language == "en") echo "selected"; ?>>Inglés</option>
    </select><br><br>

    <input type="submit" value="Guardar Preferencias">
</form>
</body>
</html>
