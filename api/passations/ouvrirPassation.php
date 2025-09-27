<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(0);

// Connexion DB
$config = include __DIR__ . '/../config.php';
$conn = new mysqli($config['db_host'], $config['db_user'], $config['db_pass'], $config['db_name']);
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Erreur connexion DB"]);
    exit;
}

// Lecture du body JSON
$data = json_decode(file_get_contents("php://input"), true);

// Vérification basique
if (empty($data['IdExamen']) || empty($data['CinMembre']) || !isset($data['Questions']) || !is_array($data['Questions'])) {
    echo json_encode(["success" => false, "message" => "Données invalides"]);
    exit;
}

$IdExamen = (int)$data['IdExamen'];
$CinMembre = $data['CinMembre'];
$Questions = $data['Questions'];

try {
    // 🔹 Vérifier si une passation existe déjà
    $stmtCheck = $conn->prepare("
        SELECT * 
        FROM passation 
        WHERE IdExamenP = ? AND CinMembreP = ? 
       
    ");
    $stmtCheck->bind_param("is", $IdExamen, $CinMembre);
    $stmtCheck->execute();
    $resCheck = $stmtCheck->get_result();

    if ($resCheck->num_rows > 0) {
        echo json_encode(["success" => false, "message" => "Vous avez déjà ouvert ou passé cet examen."]);
        exit;
    }

    // 🔹 Préparer l'insertion initiale pour chaque question
    $stmtInsert = $conn->prepare("
        INSERT INTO passation (IdExamenP, IdQuestionP, CinMembreP, ReponseP, EstCorrecte, DatePassation)
        VALUES (?, ?, ?, NULL, NULL, NOW())
    ");

    foreach ($Questions as $q) {
        if (!isset($q['IdQuestion'])) continue; // sécuriser au cas où
        $IdQuestion = (int)$q['IdQuestion'];
        $stmtInsert->bind_param("iis", $IdExamen, $IdQuestion, $CinMembre);
        $stmtInsert->execute();
    }

    $stmtInsert->close();

    echo json_encode(["success" => true, "message" => "Passation ouverte avec succès"]);

} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "Erreur : " . $e->getMessage()]);
}

$conn->close();
