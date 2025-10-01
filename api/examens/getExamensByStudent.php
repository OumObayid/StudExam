<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

error_reporting(E_ALL);
ini_set('display_errors', 1);

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(0);

$config = include __DIR__ . '/../config.php';
$conn = new mysqli($config['db_host'], $config['db_user'], $config['db_pass'], $config['db_name']);
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Erreur connexion DB"]);
    exit;
}
$conn->set_charset("utf8mb4"); // 🔑 Forcer l'encodage MySQL
$data = json_decode(file_get_contents("php://input"), true);
if (!$data || !isset($data['CinMembre'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Données invalides"]);
    exit;
}

// 🔹 Nouvelle requête adaptée : on ne prend plus IdFiliere / IdNiveau depuis Examen
$sql = "
SELECT 
    e.IdExamen, e.DescriptionE, e.NbrQuestionsE, e.NotePourQuestion, e.DurationE, 
    e.DateDebutE, e.DateFinE, e.PublieE, e.IdModule, 
    m.NomModule, m.DescriptionModule, 
    f.NomFiliere AS Filiere, n.NomNiveau AS Niveau
FROM examen e
INNER JOIN module m ON e.IdModule = m.IdModule
INNER JOIN filiere f ON m.IdFiliere = f.IdFiliere
INNER JOIN niveau n ON m.IdNiveau = n.IdNiveau
WHERE m.IdFiliere = (SELECT IdFiliere FROM membre WHERE CinMembre = ?)
  AND m.IdNiveau = (SELECT IdNiveau FROM membre WHERE CinMembre = ?)
  AND e.PublieE = 'oui'
ORDER BY e.DateDebutE DESC
";

$stmt = $conn->prepare($sql);
if (!$stmt) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Erreur préparation requête"]);
    exit;
}

$stmt->bind_param("ss", $data['CinMembre'], $data['CinMembre']);
$stmt->execute();
$result = $stmt->get_result();

$examens = [];
while ($row = $result->fetch_assoc()) {
    // Vérifier si un résultat existe pour cet examen et cet étudiant
    $sqlResult = "SELECT ScoreR FROM Resultat WHERE IdExamenR = ? AND CinMembreR = ?";
    $stmtResult = $conn->prepare($sqlResult);
    $stmtResult->bind_param("is", $row['IdExamen'], $data['CinMembre']);
    $stmtResult->execute();
    $res = $stmtResult->get_result();
    if ($res->num_rows > 0) {
        $scoreRow = $res->fetch_assoc();
        $row['ScoreR'] = $scoreRow['ScoreR'];
    } else {
        $row['ScoreR'] = null;
    }
    $stmtResult->close();

    // Vérifier la passation pour cet examen et ce membre
    $sqlPass = "SELECT 1 FROM Passation WHERE IdExamenP = ? AND CinMembreP = ? LIMIT 1";
    $stmtPass = $conn->prepare($sqlPass);
    $stmtPass->bind_param("is", $row['IdExamen'], $data['CinMembre']);
    $stmtPass->execute();
    $resPass = $stmtPass->get_result();
    $row['IsPassed'] = $resPass->num_rows > 0 ? true : false;
    $stmtPass->close();

    $examens[] = $row;
}

echo json_encode(["success" => true, "examens" => $examens]);

$stmt->close();
$conn->close();
?>
