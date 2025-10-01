<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

error_reporting(E_ALL);
ini_set('display_errors', 1);

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(0);

$config = include __DIR__ . '/../config.php';
$conn = new mysqli($config['db_host'], $config['db_user'], $config['db_pass'], $config['db_name']);
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Erreur connexion DB"]);
    exit;
}
$conn->set_charset("utf8mb4"); // 🔑 Forcer l'encodage MySQL
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['CinMembre']) || !isset($data['IdModule'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "CinMembre et IdModule requis"]);
    exit;
}

$cin = $conn->real_escape_string($data['CinMembre']);
$idModule = (int) $data['IdModule'];

// Vérifier que l'instructeur existe
$resultInstructor = $conn->query("SELECT * FROM membre WHERE CinMembre = '$cin' AND TypeMembre = 'Instructor'");
if ($resultInstructor->num_rows === 0) {
    http_response_code(404);
    echo json_encode(["success" => false, "message" => "Instructor non trouvé"]);
    exit;
}

// Vérifier que le module existe
$resultModule = $conn->query("SELECT * FROM module WHERE IdModule = $idModule");
if ($resultModule->num_rows === 0) {
    http_response_code(404);
    echo json_encode(["success" => false, "message" => "Module non trouvé"]);
    exit;
}

// Supprimer l’ancienne affectation de ce module (si déjà assigné à un autre instructeur)
$conn->query("DELETE FROM instructor_module WHERE IdModule = $idModule");

// Insérer la nouvelle liaison
if ($conn->query("INSERT INTO instructor_module (CinInstructor, IdModule) VALUES ('$cin', $idModule)")) {
    echo json_encode([
        "success" => true,
        "message" => "Module $idModule assigné à l'instructor $cin avec succès"
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Erreur lors de l’insertion : " . $conn->error
    ]);
}

$conn->close();
