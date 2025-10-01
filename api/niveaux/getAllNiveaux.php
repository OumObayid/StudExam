<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

error_reporting(E_ALL);
ini_set('display_errors', 1);

// Préflight CORS (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(0);

// Connexion DB
$config = include __DIR__ . '/../config.php';
$conn = new mysqli($config['db_host'], $config['db_user'], $config['db_pass'], $config['db_name']);
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Erreur connexion DB"]);
    exit;
}
$conn->set_charset("utf8mb4"); // 🔑 Forcer l'encodage MySQL
$sql = "SELECT * FROM niveau ORDER BY NomNiveau ASC";
$result = $conn->query($sql);

if ($result && $result->num_rows > 0) {
    $niveaux = [];
    while ($row = $result->fetch_assoc()) {
        $niveaux[] = $row;
    }
    echo json_encode(["success" => true, "niveaux" => $niveaux], JSON_UNESCAPED_UNICODE);
} else {
    echo json_encode(["success" => false, "message" => "Aucune niveau trouvée"]);
}

$conn->close();
