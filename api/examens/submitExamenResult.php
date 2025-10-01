<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

error_reporting(E_ALL);
ini_set('display_errors', 1);

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(0);

// Connexion DB
$config = include __DIR__ . '/../config.php';
$conn = new mysqli($config['db_host'], $config['db_user'], $config['db_pass'], $config['db_name']);
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Erreur connexion DB"]);
    exit;
}
$conn->set_charset("utf8mb4"); // 🔑 Forcer l'encodage MySQL
// Lire le body JSON
$data = json_decode(file_get_contents("php://input"), true);

// Vérification simple
if (
    empty($data['IdExamen']) ||
    empty($data['CinMembre']) ||
    !isset($data['Score']) ||
    !isset($data['Reponses']) ||
    !is_array($data['Reponses'])
) {
    echo json_encode(["success" => false, "message" => "Données invalides"]);
    exit;
}

$IdExamen = (int)$data['IdExamen'];
$CinMembre = $data['CinMembre'];
$Score = (float)$data['Score'];
$Reponses = $data['Reponses'];

// 🔹 Commencer transaction
$conn->begin_transaction();

try {
    // Mettre à jour les réponses existantes dans passation
    $stmtPass = $conn->prepare("
        UPDATE passation
        SET ReponseP = ?, EstCorrecte = ?, DatePassation = NOW()
        WHERE IdExamenP = ? AND IdQuestionP = ? AND CinMembreP = ?
    ");
    foreach ($Reponses as $r) {
        $stmtPass->bind_param(
            "siisi",
            $r['ReponseP'],
            $r['EstCorrecte'],
            $r['IdExamenP'],
            $r['IdQuestionP'],
            $r['CinMembreP']
        );
        $stmtPass->execute();
    }
    $stmtPass->close();

    // Insertion ou mise à jour du score dans resultat
    $stmtCheck = $conn->prepare("SELECT IdResultat FROM resultat WHERE IdExamenR = ? AND CinMembreR = ?");
    $stmtCheck->bind_param("is", $IdExamen, $CinMembre);
    $stmtCheck->execute();
    $resCheck = $stmtCheck->get_result();
    
    if ($resCheck->num_rows > 0) {
        $stmtUpd = $conn->prepare("UPDATE resultat SET ScoreR = ?, DateResultat = NOW() WHERE IdExamenR = ? AND CinMembreR = ?");
        $stmtUpd->bind_param("dis", $Score, $IdExamen, $CinMembre);
        $stmtUpd->execute();
        $stmtUpd->close();
    } else {
        $stmtIns = $conn->prepare("INSERT INTO resultat (IdExamenR, CinMembreR, ScoreR, DateResultat) VALUES (?, ?, ?, NOW())");
        $stmtIns->bind_param("isd", $IdExamen, $CinMembre, $Score);
        $stmtIns->execute();
        $stmtIns->close();
    }

    $stmtCheck->close();

    $conn->commit();

    echo json_encode(["success" => true, "message" => "Examen enregistré avec succès"]);
} catch (Exception $e) {
    $conn->rollback();
    echo json_encode(["success" => false, "message" => "Erreur lors de l'enregistrement : " . $e->getMessage()]);
}

$conn->close();
?>
