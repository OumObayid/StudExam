<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

error_reporting(E_ALL);
ini_set('display_errors', 1);

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(0);

// Connexion à la base
$config = include __DIR__ . '/../config.php';
$conn = new mysqli($config['db_host'], $config['db_user'], $config['db_pass'], $config['db_name']);
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Erreur connexion DB"]);
    exit;
}

// Récupérer les données POST
$data = json_decode(file_get_contents("php://input"), true);
if (!$data || !isset($data['idExamen'], $data['cinMembre'], $data['score'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Données invalides"]);
    exit;
}

$idExamen = intval($data['idExamen']);
$cinMembre = $conn->real_escape_string($data['cinMembre']);
$score = intval($data['score']);

// Commencer transaction
$conn->begin_transaction();

try {
    // 1️⃣ Inserer le score dans la table Resultat
    $stmt = $conn->prepare("
        INSERT INTO Resultat (IdExamenR, CinMembreR, ScoreR)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE ScoreR = VALUES(ScoreR)
    ");
    if (!$stmt) throw new Exception("Erreur préparation insert Resultat");

    $stmt->bind_param("isi", $idExamen, $cinMembre, $score);
    if (!$stmt->execute()) throw new Exception("Erreur exécution insert Resultat");
    $stmt->close();

    // 2️⃣ Mettre à jour les passations pour cet examen
    $stmt2 = $conn->prepare("
        UPDATE Passation 
        SET ReponseP = 'oui'
        WHERE IdExamenP = ?
        AND CinMembreP = ?
    ");
    if (!$stmt2) throw new Exception("Erreur préparation update Passation");

    $stmt2->bind_param("is", $idExamen, $cinMembre);
    if (!$stmt2->execute()) throw new Exception("Erreur exécution update Passation");
    $stmt2->close();

    // Commit
    $conn->commit();

    echo json_encode([
        "success" => true,
        "message" => "Score enregistré et passations mises à jour"
    ]);

} catch (Exception $e) {
    $conn->rollback();
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}

$conn->close();
