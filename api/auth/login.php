<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
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
$conn->set_charset("utf8mb4"); // 🔑 Forcer l'encodage MySQL

$data = json_decode(file_get_contents("php://input"), true);

if (empty($data['CinMembre']) || empty($data['Password'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "CIN et mot de passe requis"]);
    exit;
}

$cin = $data['CinMembre'];
$pwd = $data['Password'];

// Requête pour récupérer l'utilisateur
$stmt = $conn->prepare("SELECT CinMembre, Password, Nom, Prenom, DateNaissance, Adresse, Email, Tel, TypeMembre, IdNiveau, IdFiliere, ApprouveM
                        FROM membre
                        WHERE CinMembre = ?");
$stmt->bind_param("s", $cin);
$stmt->execute();
$result = $stmt->get_result();

if ($result && $result->num_rows > 0) {
    $user = $result->fetch_assoc();

    // Vérifier le mot de passe
    if (password_verify($pwd, $user['Password'])) {
        unset($user['Password']); // ne jamais renvoyer le mot de passe
        echo json_encode(["success" => true, "user" => $user]);
    } else {
        http_response_code(401);
        echo json_encode(["success" => false, "message" => "CIN ou mot de passe incorrect"]);
    }

} else {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "CIN ou mot de passe incorrect"]);
}

$stmt->close();
$conn->close();
