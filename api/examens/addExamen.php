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

// Lire le body JSON
$data = json_decode(file_get_contents("php://input"), true);
if (!$data) {
    echo json_encode(["success" => false, "message" => "Aucune donnée reçue"]);
    exit;
}

// Récupérer et convertir les champs

$IdModule         = intval($data['IdModule']);           // int
$DescriptionE     = $data['DescriptionE'];               // string
$NbrQuestionsE    = intval($data['NbrQuestionsE']);      // int
$NotePourQuestion = intval($data['NotePourQuestion']);   // int
$DurationE        = intval($data['DurationE']);          // int
$DateDebutE       = $data['DateDebutE'];                 // string (YYYY-MM-DD)
$DateFinE         = $data['DateFinE'];                   // string (YYYY-MM-DD)
$PublieE          = $data['PublieE'];                    // string
$CreeParCinMembre = $data['CreeParCinMembre'];           // string
$ApprouveE        = $data['ApprouveE'];                  // string

// Préparer la requête d'insertion
$sql = "INSERT INTO examen 
        (IdModule, DescriptionE, NbrQuestionsE, NotePourQuestion, DurationE, DateDebutE, DateFinE, PublieE, CreeParCinMembre, ApprouveE)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);
if (!$stmt) {
    echo json_encode(["success" => false, "message" => "Erreur préparation requête : " . $conn->error]);
    exit;
}

// Associer les valeurs
$stmt->bind_param(
    "isiiisssss",
    $IdModule,
    $DescriptionE,
    $NbrQuestionsE,
    $NotePourQuestion,
    $DurationE,
    $DateDebutE,
    $DateFinE,
    $PublieE,
    $CreeParCinMembre,
    $ApprouveE
);

// Exécuter insertion
if ($stmt->execute()) {
    $IdExamen = $conn->insert_id;

    // Requête pour récupérer l'examen enrichi
    $sqlSelect = "
   SELECT 
    e.IdExamen,
    e.IdModule,
    m.NomModule,
    m.DescriptionModule,
    m.IdFiliere,
    f.NomFiliere,
    m.IdNiveau,
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
LIMIT 1;

    ";

    $stmt2 = $conn->prepare($sqlSelect);
    $stmt2->bind_param("i", $IdExamen);
    $stmt2->execute();
    $result = $stmt2->get_result();

    if ($result && $row = $result->fetch_assoc()) {
        echo json_encode(["success" => true, "examen" => $row], JSON_UNESCAPED_UNICODE);
    } else {
        echo json_encode(["success" => false, "message" => "Examen inséré mais impossible de récupérer les détails"]);
    }

    $stmt2->close();
} else {
    echo json_encode(["success" => false, "message" => "Erreur insertion : " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
