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

// Vérification directe des champs obligatoires
if (empty($data['CinMembre']) || empty($data['Nom']) || empty($data['Prenom']) ||
    empty($data['DateNaissance']) || empty($data['Adresse']) || empty($data['Email']) ||
    empty($data['Tel'])
) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Certains champs obligatoires sont manquants ou vides"]);
    exit;
}

// Conversion de la date
$dateNaissance = strtotime($data['DateNaissance']) !== false
    ? date('Y-m-d', strtotime($data['DateNaissance']))
    : null;

// Préparer la requête UPDATE
$stmt = $conn->prepare("
    UPDATE membre SET
        Nom = ?, Prenom = ?, DateNaissance = ?, Adresse = ?,
        Email = ?, Tel = ?, IdNiveau = ?, IdFiliere = ?
    WHERE CinMembre = ?
");

if (!$stmt) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Erreur préparation requête"]);
    exit;
}

// IdNiveau et IdFiliere facultatifs
$idNiveau = !empty($data['IdNiveau']) ? $data['IdNiveau'] : null;
$idFiliere = !empty($data['IdFiliere']) ? $data['IdFiliere'] : null;

$stmt->bind_param(
    "ssssssiss",
    $data['Nom'],
    $data['Prenom'],
    $dateNaissance,
    $data['Adresse'],
    $data['Email'],
    $data['Tel'],
    $idNiveau,
    $idFiliere,
    $data['CinMembre']
);

if ($stmt->execute()) {
    $stmt->close();

    $stmt2 = $conn->prepare("SELECT * FROM membre WHERE CinMembre = ?");
    $stmt2->bind_param("s", $data['CinMembre']);
    $stmt2->execute();
    $result = $stmt2->get_result();
    $user = $result->fetch_assoc();
    $stmt2->close();

    echo json_encode(["success" => true, "message" => "Profil mis à jour avec succès", "user" => $user]);
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Erreur lors de la mise à jour"]);
}

$conn->close();
