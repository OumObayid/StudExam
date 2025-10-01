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
// Lire le body JSON
$data = json_decode(file_get_contents("php://input"), true);
if (!$data) {
    echo json_encode(["success" => false, "message" => "Aucune donnée reçue"]);
    exit;
}

// Vérifier que IdExamen est fourni
if (!isset($data['IdExamen']) || empty($data['IdExamen'])) {
    echo json_encode(["success" => false, "message" => "IdExamen est requis"]);
    exit;
}

// Préparer et sécuriser les champs
$IdExamen = intval($data['IdExamen']);
$IdModule = intval($data['IdModule']);
$DescriptionE = $conn->real_escape_string($data['DescriptionE']);
$NbrQuestionsE = intval($data['NbrQuestionsE']);
$NotePourQuestion = intval($data['NotePourQuestion']);
$DurationE = intval($data['DurationE']);
$DateDebutE = $conn->real_escape_string($data['DateDebutE']);
$DateFinE = $conn->real_escape_string($data['DateFinE']);

// Requête SQL UPDATE (⚠️ plus de IdFiliere / IdNiveau)
$sql = "UPDATE examen 
        SET IdModule = ?, 
            DescriptionE = ?, 
            NbrQuestionsE = ?, 
            NotePourQuestion = ?, 
            DurationE = ?, 
            DateDebutE = ?, 
            DateFinE = ?
        WHERE IdExamen = ?";

$stmt = $conn->prepare($sql);
if (!$stmt) {
    echo json_encode(["success" => false, "message" => "Erreur préparation requête: " . $conn->error]);
    exit;
}

$stmt->bind_param(
    "isiiissi",
    $IdModule,
    $DescriptionE,
    $NbrQuestionsE,
    $NotePourQuestion,
    $DurationE,
    $DateDebutE,
    $DateFinE,
    $IdExamen
);

if ($stmt->execute()) {
    // Sélectionner l'examen enrichi après update
    $selectSql = "SELECT 
            e.IdExamen,
            e.IdModule,
            m.NomModule,
            m.DescriptionModule,
            f.IdFiliere,
            f.NomFiliere,
            n.IdNiveau,
            n.NomNiveau,
            e.DescriptionE,
            e.NbrQuestionsE,
            e.NotePourQuestion,
            e.DurationE,
            e.DateDebutE,
            e.DateFinE,
            e.PublieE,
            e.CreeParCinMembre,
            u.Nom AS NomCreePar,
            u.Prenom AS PrenomCreePar,
            e.ApprouveE
        FROM examen e
        LEFT JOIN module m ON e.IdModule = m.IdModule
        LEFT JOIN filiere f ON m.IdFiliere = f.IdFiliere
        LEFT JOIN niveau n ON m.IdNiveau = n.IdNiveau
        LEFT JOIN membre u ON e.CreeParCinMembre = u.CinMembre
        WHERE e.IdExamen = ?
        LIMIT 1";

    $stmtSelect = $conn->prepare($selectSql);
    $stmtSelect->bind_param("i", $IdExamen);
    $stmtSelect->execute();
    $result = $stmtSelect->get_result();

    if ($result && $row = $result->fetch_assoc()) {
        echo json_encode(["success" => true, "examen" => $row], JSON_UNESCAPED_UNICODE);
    } else {
        echo json_encode(["success" => false, "message" => "Examen mis à jour mais non retrouvé"]);
    }

    $stmtSelect->close();
} else {
    echo json_encode(["success" => false, "message" => "Erreur mise à jour: " . $stmt->error]);
}

$stmt->close();
$conn->close();
