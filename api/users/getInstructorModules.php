<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

error_reporting(E_ALL);
ini_set('display_errors', 1);

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(0);

// Charger la configuration DB
$config = include __DIR__ . '/../config.php';

// Connexion à la base
$conn = new mysqli($config['db_host'], $config['db_user'], $config['db_pass'], $config['db_name']);
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Erreur connexion DB",
        "data" => []
    ]);
    exit;
}
$conn->set_charset("utf8mb4"); // 🔑 Forcer l'encodage MySQL
// Requête pour récupérer toutes les liaisons
$sql = "SELECT CinInstructor, IdModule FROM instructor_module";
$result = $conn->query($sql);

if (!$result) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Erreur requête DB",
        "data" => []
    ]);
    exit;
}

$instructorModules = [];
while ($row = $result->fetch_assoc()) {
    $instructorModules[] = $row;
}

echo json_encode([
    "success" => true,
    "message" => "Liste des liaisons récupérée",
    "instructorModules" => $instructorModules
]);

$conn->close();
