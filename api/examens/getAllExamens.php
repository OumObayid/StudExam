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

try {
    // 🔹 Récupérer tous les examens
    $sqlExamens = "
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
    ORDER BY e.IdExamen DESC
";


    $stmt = $conn->prepare($sqlExamens);
    if (!$stmt) {
        throw new Exception("Erreur préparation requête : " . $conn->error);
    }

    $stmt->execute();
    $result = $stmt->get_result();
    $examens = $result->fetch_all(MYSQLI_ASSOC);
    $stmt->close();

    // 🔹 Récupérer les questions pour chaque examen
    $sqlQuestions = "
        SELECT 
            q.IdQuestion,
            q.IdExamenQ,
            q.TitreQuestion,
            q.Reponse1,
            q.Reponse2,
            q.Reponse3,
            q.ReponseCorrecte
        FROM question q
        WHERE q.IdExamenQ = ?
        ORDER BY q.IdQuestion ASC
    ";
    $stmtQuestions = $conn->prepare($sqlQuestions);
    if (!$stmtQuestions) {
        throw new Exception("Erreur préparation requête (questions) : " . $conn->error);
    }

    foreach ($examens as &$examen) {
        $stmtQuestions->bind_param("i", $examen['IdExamen']);
        $stmtQuestions->execute();
        $resQ = $stmtQuestions->get_result();
        $examen['questions'] = $resQ->fetch_all(MYSQLI_ASSOC);
    }

    $stmtQuestions->close();
    $conn->close();

    echo json_encode([
        "success" => true,
        "message" => "Examens et questions récupérés avec succès",
        "examens" => $examens
    ], JSON_UNESCAPED_UNICODE);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
    $conn->close();
}
