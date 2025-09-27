<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
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

// Récupération des données
$data = json_decode(file_get_contents("php://input"), true);
$IdNiveau = intval($data['IdNiveau'] ?? 0);
$NomNiveau = trim($data['NomNiveau'] ?? '');

if (empty($NomNiveau) || $IdNiveau <= 0) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "IdNiveau et NomNiveau requis"]);
    exit;
}

// Vérifier si IdNiveau existe déjà
$stmtCheck = $conn->prepare("SELECT COUNT(*) as count FROM Niveau WHERE IdNiveau = ?");
$stmtCheck->bind_param("i", $IdNiveau);
$stmtCheck->execute();
$result = $stmtCheck->get_result();
$row = $result->fetch_assoc();
$stmtCheck->close();

if ($row['count'] > 0) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Ce niveau existe déjà"]);
    exit;
}

// Préparation de l'insertion
$stmt = $conn->prepare("INSERT INTO Niveau (IdNiveau, NomNiveau) VALUES (?, ?)");
$stmt->bind_param("is", $IdNiveau, $NomNiveau);

if ($stmt->execute()) {
    echo json_encode([
        "success" => true,
        "niveau" => [
            "IdNiveau" => $IdNiveau,
            "NomNiveau" => $NomNiveau
        ]
    ]);
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Erreur lors de l'insertion"]);
}

$stmt->close();
$conn->close();
?>
