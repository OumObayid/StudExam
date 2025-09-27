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

// Récupération des filtres
$data = json_decode(file_get_contents("php://input"), true);
$IdNiveau = isset($data['IdNiveau']) ? intval($data['IdNiveau']) : null;
$IdFiliere = isset($data['IdFiliere']) ? $conn->real_escape_string($data['IdFiliere']) : null;

$sql = "SELECT r.IdResultat, r.ScoreR, r.DateResultat,
               m.CinMembre, m.Nom, m.Prenom,
               e.IdExamen, e.DescriptionE,
               `mod`.IdModule,
               `mod`.NomModule,
               f.IdFiliere,
               f.NomFiliere,
               n.IdNiveau,
               n.NomNiveau
        FROM resultat r
        JOIN examen e ON r.IdExamenR = e.IdExamen
        JOIN membre m ON r.CinMembreR = m.CinMembre
        JOIN module `mod` ON e.IdModule = `mod`.IdModule
        JOIN filiere f ON m.IdFiliere = f.IdFiliere
        JOIN niveau n ON m.IdNiveau = n.IdNiveau
        WHERE 1=1";

if ($IdNiveau) {
    $sql .= " AND m.IdNiveau = $IdNiveau";
}

if ($IdFiliere) {
    $sql .= " AND m.IdFiliere = '$IdFiliere'";
}

$result = $conn->query($sql);

if (!$result) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Erreur SQL : ".$conn->error]);
    exit;
}

$resultats = [];
while ($row = $result->fetch_assoc()) {
    $resultats[] = $row;
}

echo json_encode(["success" => true, "resultats" => $resultats]);

$conn->close();
?>
