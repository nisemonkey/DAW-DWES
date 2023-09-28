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
    <h1>Calculadora</h1>
    <form method="post">
        <label for="formula">Ingresa una fórmula:</label>
        <input type="text" id="formula" name="formula" required>
        <input type="submit" value="Calcular">
    </form>


    <?php
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $formula = $_POST["formula"];
        try {
            $resultado = eval("return $formula;");
            if ($resultado !== false) {
                echo "<h2>Resultado: $resultado</h2>";
            } else {
                echo "<h2>Fórmula inválida</h2>";
            }
        } catch (Exception $e) {
            echo "<p>Error: " . $e->getMessage() . "</p>";
        }
    }
    ?>
</body>
</html>
