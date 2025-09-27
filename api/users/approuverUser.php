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

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['CinMembre']) || !isset($data['ApprouveM'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Champs manquants"]);
    exit;
}

$cin = $data['CinMembre'];
$approuve = $data['ApprouveM'];

// Mise à jour de l'utilisateur
$stmt = $conn->prepare("UPDATE membre SET ApprouveM = ? WHERE CinMembre = ?");
if (!$stmt) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Erreur préparation requête"]);
    exit;
}

$stmt->bind_param("ss", $approuve, $cin);

if ($stmt->execute()) {
    echo json_encode([
        "success" => true,
        "message" => "Utilisateur mis à jour avec succès",
        "CinMembre" => $cin,
        "ApprouveM" => $approuve
    ]);
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Erreur lors de la mise à jour"]);
}

$stmt->close();
$conn->close();
