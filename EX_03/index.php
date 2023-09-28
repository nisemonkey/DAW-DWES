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
    <h1>Impresora de números</h1>
    <form method="post">
        <label for="numero">Ingresa un número:</label>
        <input type="number" id="numero" name="numero" required>
        <input type="submit" value="Imprimir">
    </form>

    <?php
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $numero = $_POST["numero"];

        if (is_numeric($numero)) {
            $numero = intval($numero); //darle valor entero para que no haya bromitas

            echo "<p>Escribiendo $numero líneas:</p>";
            for ($i = 0; $i < $numero; $i++) {
                echo "Número $i<br>";
            }
        } else {
            echo "<p>Entrada no válida. Ingresa un número válido.</p>";
        }
    }
    ?>
</body>
</html>
