<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

error_reporting(E_ALL);
ini_set('display_errors', 1);

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(0);

$config = include __DIR__ . '/../config.php';

// Connexion DB
$conn = new mysqli($config['db_host'], $config['db_user'], $config['db_pass'], $config['db_name']);
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Erreur connexion DB"]);
    exit;
}

// Récupération des données JSON
$data = json_decode(file_get_contents("php://input"), true);
$IdModule = intval($data['IdModule'] ?? 0);

if ($IdModule <= 0) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "IdModule requis"]);
    exit;
}

// Vérifier que le module existe
$stmtCheck = $conn->prepare("SELECT COUNT(*) as count FROM Module WHERE IdModule = ?");
$stmtCheck->bind_param("i", $IdModule);
$stmtCheck->execute();
$result = $stmtCheck->get_result();
$row = $result->fetch_assoc();
$stmtCheck->close();

if ($row['count'] == 0) {
    http_response_code(404);
    echo json_encode(["success" => false, "message" => "Module non trouvé"]);
    exit;
}

// Supprimer le module
$stmt = $conn->prepare("DELETE FROM Module WHERE IdModule = ?");
$stmt->bind_param("i", $IdModule);

if ($stmt->execute()) {
    echo json_encode([
        "success" => true,
        "message" => "Module supprimé",
        "IdModule" => $IdModule
    ]);
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Erreur lors de la suppression"]);
}

$stmt->close();
$conn->close();
?>
