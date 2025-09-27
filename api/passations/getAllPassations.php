<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
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

// Requête pour récupérer les passations avec infos membre, examen et résultat
$sql = "
    SELECT 
        p.IdPassation,
        p.IdExamenP,
        p.IdQuestionP,
        p.CinMembreP,
        p.ReponseP,
        p.DatePassation,
        p.EstCorrecte,

        -- Infos membre
        m.Nom AS NomMembre,
        m.Prenom AS PrenomMembre,
        m.DateNaissance,
        m.Adresse,
        m.Email,
        m.Tel,
        m.IdNiveau,
        n.NomNiveau,
        m.IdFiliere,
        f.NomFiliere,

        -- Infos examen
        e.IdExamen,
        e.IdModule,
        modl.IdFiliere AS ExamenIdFiliere,
        fil.IdFiliere AS ExamenNomFiliere,
        modl.IdNiveau AS ExamenIdNiveau,
        niv.IdNiveau AS ExamenNomNiveau,
        e.DescriptionE,
        e.NbrQuestionsE,
        e.NotePourQuestion,
        e.DurationE,
        e.DateDebutE,
        e.DateFinE,
        e.PublieE,
        e.CreeParCinMembre,
        e.ApprouveE,

        -- Infos résultat (ScoreR et DateResultat)
        r.ScoreR,
        r.DateResultat

    FROM passation p
    LEFT JOIN membre m ON p.CinMembreP = m.CinMembre
    LEFT JOIN filiere f ON m.IdFiliere = f.IdFiliere
    LEFT JOIN niveau n ON m.IdNiveau = n.IdNiveau

    LEFT JOIN examen e ON p.IdExamenP = e.IdExamen
    LEFT JOIN module modl ON e.IdModule = modl.IdModule
    LEFT JOIN filiere fil ON modl.IdFiliere = fil.IdFiliere
    LEFT JOIN niveau niv ON modl.IdNiveau = niv.IdNiveau

    LEFT JOIN resultat r ON r.IdExamenR = e.IdExamen AND r.CinMembreR = m.CinMembre

    ORDER BY p.DatePassation DESC
";


$stmt = $conn->prepare($sql);
if (!$stmt) {
    echo json_encode(["success" => false, "message" => "Erreur préparation requête : " . $conn->error]);
    exit;
}

if ($stmt->execute()) {
    $result = $stmt->get_result();
    $passations = [];
    while ($row = $result->fetch_assoc()) {
        $passations[] = $row;
    }

    echo json_encode(["success" => true, "passations" => $passations], JSON_UNESCAPED_UNICODE);
} else {
    echo json_encode(["success" => false, "message" => "Erreur exécution requête : " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
