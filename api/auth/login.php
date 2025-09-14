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

$data = json_decode(file_get_contents("php://input"), true);

if (empty($data['CinMembre']) || empty($data['Password'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "CIN et mot de passe requis"]);
    exit;
}

$cin = $conn->real_escape_string($data['CinMembre']);
$pwd = $conn->real_escape_string($data['Password']);

$sql = "SELECT CinMembre, Password, Nom, Prenom, DateNaissance, Adresse, Email, Tel, TypeMembre, IdNiveau, IdFiliere, ApprouveM 
        FROM Membre 
        WHERE CinMembre='$cin' AND Password='$pwd' AND ApprouveM='oui'";
$result = $conn->query($sql);

if ($result && $result->num_rows > 0) {
    $user = $result->fetch_assoc();
    unset($user['Password']); // ne jamais renvoyer le mot de passe
    echo json_encode([
        "success" => true,
        "user" => $user
    ]);
} else {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "CIN ou mot de passe incorrect / non approuvé"]);
}

$conn->close();
?>
