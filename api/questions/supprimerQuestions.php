<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

error_reporting(E_ALL);
ini_set('display_errors', 1);

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Connexion à la base de données
$config = include __DIR__ . '/../config.php';
$conn = new mysqli($config['db_host'], $config['db_user'], $config['db_pass'], $config['db_name']);
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Erreur connexion DB"]);
    exit;
}
$conn->set_charset("utf8mb4"); // 🔑 Forcer l'encodage MySQL
// Récupérer les données JSON
$data = json_decode(file_get_contents("php://input"), true);
if (!isset($data['IdExamen']) || $data['IdExamen'] === "") {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "IdExamen manquant"]);
    exit;
}

$IdExamen = $data['IdExamen'];

// Préparer la requête DELETE
$stmt = $conn->prepare("DELETE FROM question WHERE IdExamenQ = ?");
if (!$stmt) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Erreur préparation requête"]);
    exit;
}

$stmt->bind_param("i", $IdExamen);

if ($stmt->execute()) {
    echo json_encode([
        "success" => true,
        "message" => "Toutes les questions de l'examen $IdExamen ont été supprimées"
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Erreur lors de la suppression"
    ]);
}

$stmt->close();
$conn->close();
