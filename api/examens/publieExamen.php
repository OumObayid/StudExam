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
$conn->set_charset("utf8mb4"); // 🔑 Forcer l'encodage MySQL
$data = json_decode(file_get_contents("php://input"), true);

// Vérifier champs obligatoires
if (!isset($data['IdExamen'], $data['PublieE'])) {
    echo json_encode(["success" => false, "message" => "Champs obligatoires manquants"]);
    exit;
}

// Conversion de IdExamen en entier
$IdExamen = intval($data['IdExamen']);
$PublieE = $data['PublieE'];

try {
    // Vérifier si l'examen existe
    $checkStmt = $conn->prepare("SELECT IdExamen FROM examen WHERE IdExamen = ?");
    $checkStmt->bind_param("i", $IdExamen);
    $checkStmt->execute();
    $checkStmt->store_result();

    if ($checkStmt->num_rows === 0) {
        echo json_encode(["success" => false, "message" => "Examen introuvable"]);
        $checkStmt->close();
        $conn->close();
        exit;
    }
    $checkStmt->close();

    // Mise à jour PublieE
    $stmt = $conn->prepare("UPDATE examen SET PublieE = ? WHERE IdExamen = ?");
    $stmt->bind_param("si", $PublieE, $IdExamen);

    if ($stmt->execute()) {
        echo json_encode([
            "success" => true,
            "message" => "Publication mise à jour avec succès"
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
