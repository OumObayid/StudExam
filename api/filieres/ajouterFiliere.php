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
$NomFiliere = trim($data['NomFiliere'] ?? '');

if (empty($IdFiliere) || empty($NomFiliere)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "IdFiliere et NomFiliere requis"]);
    exit;
}

// Vérifier que l'IdFiliere n'existe pas déjà
$stmtCheck = $conn->prepare("SELECT COUNT(*) as count FROM Filiere WHERE IdFiliere = ?");
$stmtCheck->bind_param("s", $IdFiliere);
$stmtCheck->execute();
$result = $stmtCheck->get_result();
$row = $result->fetch_assoc();
$stmtCheck->close();

if ($row['count'] > 0) {
    http_response_code(409);
    echo json_encode(["success" => false, "message" => "IdFiliere existe déjà"]);
    exit;
}

// Insérer la nouvelle filière
$stmt = $conn->prepare("INSERT INTO Filiere (IdFiliere, NomFiliere) VALUES (?, ?)");
$stmt->bind_param("ss", $IdFiliere, $NomFiliere);

if ($stmt->execute()) {
    echo json_encode([
        "success" => true,
        "filiere" => [
            "IdFiliere" => $IdFiliere,
            "NomFiliere" => $NomFiliere
        ]
    ]);
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Erreur lors de l'insertion"]);
}

$stmt->close();
$conn->close();
?>
