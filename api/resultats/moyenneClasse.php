<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

error_reporting(E_ALL);
ini_set('display_errors', 1);

// Préflight CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Connexion DB
$config = include __DIR__ . '/../config.php';
$conn = new mysqli($config['db_host'], $config['db_user'], $config['db_pass'], $config['db_name']);
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Erreur connexion DB"]);
    exit;
}
$conn->set_charset("utf8mb4"); // 🔑 Forcer l'encodage MySQL
$data = json_decode(file_get_contents("php://input"), true);
if (empty($data['IdExamen'])) {
    echo json_encode(["success" => false, "message" => "IdExamen manquant"]);
    exit;
}

$IdExamen = (int)$data['IdExamen'];

// Calcul moyenne de la classe
$sql = "SELECT COUNT(*) AS nb, SUM(ScoreR) AS total FROM resultat WHERE IdExamenR = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $IdExamen);
$stmt->execute();
$res = $stmt->get_result()->fetch_assoc();
$stmt->close();

$moyenneClasse = $res['nb'] > 0 ? round($res['total'] / $res['nb'], 2) : null;

echo json_encode(["success" => true, "MoyenneClasse" => $moyenneClasse]);
$conn->close();
?>
