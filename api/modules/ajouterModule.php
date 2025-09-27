<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
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
$IdFiliere = trim($data['IdFiliere'] ?? '');
$IdNiveau = intval($data['IdNiveau'] ?? 0);
$NomModule = trim($data['NomModule'] ?? '');
$DescriptionModule = trim($data['DescriptionModule'] ?? '');

if (empty($IdFiliere) || $IdNiveau <= 0 || empty($NomModule)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "IdFiliere, IdNiveau et NomModule requis"]);
    exit;
}

// Vérifier que la filière existe
$stmtF = $conn->prepare("SELECT COUNT(*) as count FROM Filiere WHERE IdFiliere = ?");
$stmtF->bind_param("s", $IdFiliere);
$stmtF->execute();
$resultF = $stmtF->get_result();
$rowF = $resultF->fetch_assoc();
$stmtF->close();

if ($rowF['count'] == 0) {
    http_response_code(404);
    echo json_encode(["success" => false, "message" => "Filière non trouvée"]);
    exit;
}

// Vérifier que le niveau existe
$stmtN = $conn->prepare("SELECT COUNT(*) as count FROM Niveau WHERE IdNiveau = ?");
$stmtN->bind_param("i", $IdNiveau);
$stmtN->execute();
$resultN = $stmtN->get_result();
$rowN = $resultN->fetch_assoc();
$stmtN->close();

if ($rowN['count'] == 0) {
    http_response_code(404);
    echo json_encode(["success" => false, "message" => "Niveau non trouvé"]);
    exit;
}

// Préparer l'insertion
$stmt = $conn->prepare("INSERT INTO Module (NomModule, DescriptionModule, IdFiliere, IdNiveau) VALUES (?, ?, ?, ?)");
$stmt->bind_param("sssi", $NomModule, $DescriptionModule, $IdFiliere, $IdNiveau);

if ($stmt->execute()) {
    $idModule = $stmt->insert_id;
    echo json_encode([
        "success" => true,
        "module" => [
            "IdModule" => $idModule,
            "NomModule" => $NomModule,
            "DescriptionModule" => $DescriptionModule,
            "IdFiliere" => $IdFiliere,
            "IdNiveau" => $IdNiveau
        ]
    ]);
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Erreur lors de l'insertion"]);
}

$stmt->close();
$conn->close();
?>
