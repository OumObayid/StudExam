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

if (!isset($data['IdExamen'], $data['ApprouveE'])) {
    echo json_encode(["success" => false, "message" => "IdExamen ou ApprouveE manquant"]);
    exit;
}

try {
    $stmt = $conn->prepare("UPDATE examen SET ApprouveE = ? WHERE IdExamen = ?");
    if (!$stmt) {
        throw new Exception("Erreur préparation requête : " . $conn->error);
    }

    $stmt->bind_param("si", $data['ApprouveE'], $data['IdExamen']);

    if ($stmt->execute()) {
        echo json_encode([
            "success" => true,
            "message" => "État d'approbation mis à jour avec succès"
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Erreur lors de la mise à jour : " . $stmt->error
        ]);
    }

    $stmt->close();
    $conn->close();

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
    $conn->close();
}
?>
