<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

error_reporting(E_ALL);
ini_set('display_errors', 1);

// Préflight CORS (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(0);

// Connexion DB
$config = include __DIR__ . '/../config.php';
$conn = new mysqli($config['db_host'], $config['db_user'], $config['db_pass'], $config['db_name']);
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Erreur connexion DB"]);
    exit;
}

$sql = "SELECT IdFiliere, NomFiliere FROM filiere ORDER BY NomFiliere ASC";
$result = $conn->query($sql);

if ($result && $result->num_rows > 0) {
    $filieres = [];
    while ($row = $result->fetch_assoc()) {
        $filieres[] = $row;
    }
    echo json_encode(["success" => true, "filieres" => $filieres], JSON_UNESCAPED_UNICODE);
} else {
    echo json_encode(["success" => false, "message" => "Aucune filière trouvée"]);
}

$conn->close();
