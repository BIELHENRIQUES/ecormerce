
<?php

$arquivoEnv = __DIR__ . '/.env';

if (!file_exists($arquivoEnv)) {
    die("Arquivo .env não encontrado.");
}

$env = parse_ini_file($arquivoEnv);

$host = $env['DB_HOST'] ?? 'localhost';
$banco = $env['DB_NAME'] ?? '';
$usuario = $env['DB_USER'] ?? '';
$senha = $env['DB_PASS'] ?? '';

try {
    $pdo = new PDO(
        "mysql:host=$host;dbname=$banco;charset=utf8mb4",
        $usuario,
        $senha
    );

    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

} catch (PDOException $erro) {
    die("Erro ao conectar ao banco de dados.");
}
?>
