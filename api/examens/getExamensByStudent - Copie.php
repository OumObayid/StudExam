<?php header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
error_reporting(E_ALL);
ini_set('display_errors', 1);
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS')
    exit(0);
$config = include __DIR__ . '/../config.php';
$conn = new mysqli($config['db_host'], $config['db_user'], $config['db_pass'], $config['db_name']);
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Erreur connexion DB"]);
    exit;
}
$data = json_decode(file_get_contents("php://input"), true);
if (!$data || !isset($data['CinMembre'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Données invalides"]);
    exit;
} // Récupérer les examens que l'utilisateur a passés ou non 
$sql = " SELECT e.IdExamen, e.DescriptionE, e.NbrQuestionsE, e.NotePourQuestion, e.DurationE, e.DateDebutE, e.DateFinE, e.PublieE, e.IdModule, m.NomModule, m.DescriptionModule, e.IdFiliere, f.NomFiliere AS Filiere, e.IdNiveau, n.NomNiveau AS Niveau FROM Examen e LEFT JOIN Module m ON e.IdModule = m.IdModule LEFT JOIN Filiere f ON e.IdFiliere = f.IdFiliere LEFT JOIN Niveau n ON e.IdNiveau = n.IdNiveau WHERE e.IdFiliere = (SELECT IdFiliere FROM Membre WHERE CinMembre = ?) AND e.IdNiveau = (SELECT IdNiveau FROM Membre WHERE CinMembre = ?) AND e.PublieE = 'oui' ORDER BY e.DateDebutE DESC ";
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
    $examens[] = $row;
}
echo json_encode(["success" => true, "examens" => $examens]);
$stmt->close();
$conn->close(); 