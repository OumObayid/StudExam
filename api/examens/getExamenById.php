<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

error_reporting(E_ALL);
ini_set('display_errors', 1);

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Charger la config
$config = include __DIR__ . '/../config.php';
$conn = new mysqli($config['db_host'], $config['db_user'], $config['db_pass'], $config['db_name']);

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Erreur connexion DB"]);
    exit;
}

// Lire le body JSON
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['idExamen']) || !isset($data['CinMembre'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Paramètres manquants (idExamen, CinMembre)"]);
    exit;
}

$idExamen = intval($data['idExamen']);
$cinMembre = $data['CinMembre'];

// 🔹 Requête principale
$sql = "
    SELECT 
        p.IdPassation,
        p.IdExamenP,
        p.IdQuestionP,
        p.CinMembreP,
        p.ReponseP,
        q.TitreQuestion,
        q.Reponse1,
        q.Reponse2,
        q.Reponse3,
        q.ReponseCorrecte,
        m.Nom,
        m.Prenom,
        e.DescriptionE,
        e.NbrQuestionsE,
        e.NotePourQuestion,
        e.DurationE,
        e.DateDebutE,
        e.DateFinE,
        mo.NomModule,
        f.NomFiliere,
        n.NomNiveau
    FROM Passation p
    INNER JOIN Question q ON p.IdQuestionP = q.IdQuestion
    INNER JOIN Membre m ON p.CinMembreP = m.CinMembre
    INNER JOIN Examen e ON p.IdExamenP = e.IdExamen
    INNER JOIN Module mo ON e.IdModule = mo.IdModule
    INNER JOIN Filiere f ON e.IdFiliere = f.IdFiliere
    INNER JOIN Niveau n ON e.IdNiveau = n.IdNiveau
    WHERE p.IdExamenP = ?
    AND p.CinMembreP = ?
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("is", $idExamen, $cinMembre);
$stmt->execute();
$result = $stmt->get_result();

$examenData = null;
$questions = [];

while ($row = $result->fetch_assoc()) {
    // Initialise les infos examen une seule fois
    if ($examenData === null) {
        $examenData = [
            "IdPassation"    => $row["IdPassation"],
            "IdExamenP"      => $row["IdExamenP"],
            "CinMembreP"     => $row["CinMembreP"],
            "Nom"            => $row["Nom"],
            "Prenom"         => $row["Prenom"],
            "DescriptionE"   => $row["DescriptionE"],
            "NbrQuestionsE"  => $row["NbrQuestionsE"],
            "NotePourQuestion" => $row["NotePourQuestion"],
            "DurationE"      => $row["DurationE"],
            "DateDebutE"     => $row["DateDebutE"],
            "DateFinE"       => $row["DateFinE"],
            "NomModule"      => $row["NomModule"],
            "NomFiliere"     => $row["NomFiliere"],
            "NomNiveau"      => $row["NomNiveau"],
            "Questions"      => []
        ];
    }

    // Ajouter chaque question
    $questions[] = [
        "IdQuestionP"     => $row["IdQuestionP"],
        "TitreQuestion"   => $row["TitreQuestion"],
        "Reponse1"        => $row["Reponse1"],
        "Reponse2"        => $row["Reponse2"],
        "Reponse3"        => $row["Reponse3"],
        "ReponseCorrecte" => $row["ReponseCorrecte"]
    ];
}
$stmt->close();

// 🔹 Vérifier si un score existe déjà
$sqlScore = "SELECT ScoreR FROM Resultat WHERE IdExamenR = ? AND CinMembreR = ?";
$stmtScore = $conn->prepare($sqlScore);
$stmtScore->bind_param("is", $idExamen, $cinMembre);
$stmtScore->execute();
$resScore = $stmtScore->get_result();

$score = null;
if ($resScore->num_rows > 0) {
    $scoreRow = $resScore->fetch_assoc();
    $score = $scoreRow['ScoreR'];
}
$stmtScore->close();

// 🔹 Ajouter les questions au tableau examen
if ($examenData !== null) {
    $examenData["Questions"] = $questions;
}

// 🔹 Réponse finale
echo json_encode([
    "success" => true,
    "score" => $score, // null si non passé
    "examen" => $examenData
], JSON_UNESCAPED_UNICODE);

$conn->close();
