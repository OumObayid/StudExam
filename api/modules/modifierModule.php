<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT, OPTIONS");
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
$conn->set_charset("utf8mb4"); // 🔑 Forcer l'encodage MySQL
// Récupération des données JSON
$data = json_decode(file_get_contents("php://input"), true);
$IdModule = intval($data['IdModule'] ?? 0);
$IdFiliere = $data['IdFiliere'] ?? '';
$IdNiveau = intval($data['IdNiveau'] ?? 0);
$NomModule = trim($data['NomModule'] ?? '');
$DescriptionModule = trim($data['DescriptionModule'] ?? '');

if ($IdModule <= 0 || empty($IdFiliere) || $IdNiveau <= 0 || empty($NomModule)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "IdModule, IdFiliere, IdNiveau et NomModule requis"]);
    exit;
}

// Vérifier que le module existe
$stmtCheck = $conn->prepare("SELECT COUNT(*) as count FROM module WHERE IdModule = ?");
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

// Mise à jour
$stmt = $conn->prepare("UPDATE module SET NomModule = ?, DescriptionModule = ?, IdFiliere = ?, IdNiveau = ? WHERE IdModule = ?");
$stmt->bind_param("sssii", $NomModule, $DescriptionModule, $IdFiliere, $IdNiveau, $IdModule);

if ($stmt->execute()) {
    echo json_encode([
        "success" => true,
        "module" => [
            "IdModule" => $IdModule,
            "NomModule" => $NomModule,
            "DescriptionModule" => $DescriptionModule,
            "IdFiliere" => $IdFiliere,
            "IdNiveau" => $IdNiveau
        ]
    ]);
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Erreur lors de la mise à jour"]);
}

$stmt->close();
$conn->close();
?>
