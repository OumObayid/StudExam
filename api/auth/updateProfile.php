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

if (!$data || !isset($data['CinMembre'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Données invalides"]);
    exit;
}

// Conversion de la date en format YYYY-MM-DD si nécessaire
$dateNaissance = null;
if (!empty($data['DateNaissance'])) {
    $timestamp = strtotime($data['DateNaissance']);
    if ($timestamp !== false) {
        $dateNaissance = date('Y-m-d', $timestamp);
    } else {
        $dateNaissance = null;
    }
}

// Préparer la requête pour mise à jour
$stmt = $conn->prepare("
    UPDATE Membre SET
        Nom = ?,
        Prenom = ?,
        DateNaissance = ?,
        Adresse = ?,
        Email = ?,
        Tel = ?,
        IdNiveau = ?,
        IdFiliere = ?
    WHERE CinMembre = ?
");

if (!$stmt) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Erreur préparation requête"]);
    exit;
}

// Bind des paramètres : tout en string sauf IdNiveau et IdFiliere (int)
$stmt->bind_param(
    "ssssssiss",
    $data['Nom'],
    $data['Prenom'],
    $dateNaissance,
    $data['Adresse'],
    $data['Email'],
    $data['Tel'],
    $data['IdNiveau'],
    $data['IdFiliere'],
    $data['CinMembre']
);

// Exécution
if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Profil mis à jour avec succès"]);
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Erreur lors de la mise à jour"]);
}

$stmt->close();
$conn->close();
