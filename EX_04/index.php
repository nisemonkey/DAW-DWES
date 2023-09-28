<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Formulario del Chill</title>
</head>
<body>
    <h1>Formulario Final</h1>
    <form method="post" enctype="multipart/form-data">
        <label for="nombre">Nombre:</label>
        <input type="text" id="nombre" name="nombre" required><br><br>

        <label for="apellidos">Apellidos:</label>
        <input type="text" id="apellidos" name="apellidos" required><br><br>

        <label for="contrasena">Contraseña:</label>
        <input type="password" id="contrasena" name="contrasena" required><br><br>

        <label>Alumno o Profesor:</label>
        <input type="checkbox" id="alumno" name="tipo" value="Alumno">
        <label for="alumno">Alumno</label>
        <input type="checkbox" id="profesor" name="tipo" value="Profesor">
        <label for="profesor">Profesor</label><br><br>

        <label for="foto">Foto (Nombre del fichero):</label>
        <input type="file" id="foto" name="foto"><br><br>

        <label for="edad">Edad:</label>
        <input type="number" id="edad" name="edad" required><br><br>

        <label for="comentarios">Comentarios:</label><br>
        <textarea id="comentarios" name="comentarios" rows="4" cols="50"></textarea><br><br>

        <input type="hidden" name="test" value="myPrueba">

        <input type="submit" value="Enviar">
    </form>

    <?php
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        echo "<h2>Resultados:</h2>";
        echo "<p>Nombre: " . $_POST["nombre"] . "</p>";
        echo "<p>Apellidos: " . $_POST["apellidos"] . "</p>";
        echo "<p>Contraseña: " . $_POST["contrasena"] . "</p>";

        if (isset($_POST["tipo"])) {
            if (is_array($_POST["tipo"])) {
                echo "<p>Tipo: " . implode(", ", $_POST["tipo"]) . "</p>";
            } else {
                echo "<p>Tipo: " . $_POST["tipo"] . "</p>";
            }
        }

        if (isset($_FILES["foto"]) && $_FILES["foto"]["error"] == 0) {
            $nombreFoto = $_FILES["foto"]["name"];
            echo "<p>Foto (Nombre del fichero): $nombreFoto</p>";
        } else {
            echo "<p>Foto (Nombre del fichero): No se seleccionó una foto</p>";
        }

        echo "<p>Edad: " . $_POST["edad"] . "</p>";
        echo "<p>Comentarios: " . $_POST["comentarios"] . "</p>";
        if (isset($_POST["test"])) {
            echo "<p>Campo oculto: " . $_POST["test"] . "</p>";
        }

    }
    ?>
</body>
</html>
