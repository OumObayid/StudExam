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

$data = json_decode(file_get_contents("php://input"), true);

// Vérification des champs obligatoires
$required = ["CinMembre", "Password", "Nom", "Prenom", "DateNaissance", "Adresse", "Email", "Tel", "TypeMembre"];
foreach ($required as $field) {
    if (empty($data[$field])) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Champ manquant : $field"]);
        exit;
    }
}

$cin        = $data['CinMembre'];
$password = password_hash($data['Password'], PASSWORD_DEFAULT);
$nom        = $data['Nom'];
$prenom     = $data['Prenom'];
$dateNaiss  = $data['DateNaissance'];
$adresse    = $data['Adresse'];
$email      = $data['Email'];
$tel        = $data['Tel'];
$type       = $data['TypeMembre'];
$idNiveau   = !empty($data['IdNiveau']) ? $data['IdNiveau'] : null;
$idFiliere  = !empty($data['IdFiliere']) ? $data['IdFiliere'] : null;

// Si c'est un Student, on exige IdNiveau et IdFiliere
if ($type === "Student") {
    if (empty($idNiveau) || empty($idFiliere)) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Niveau et Filière requis pour Student"]);
        exit;
    }
} else {
    // Instructor : on force à NULL
    $idNiveau = null;
    $idFiliere = null;
}

// Vérifier si le CIN existe déjà
$checkSql = "SELECT CinMembre FROM Membre WHERE CinMembre = ?";
$checkStmt = $conn->prepare($checkSql);
$checkStmt->bind_param("s", $cin);
$checkStmt->execute();
$checkStmt->store_result();

if ($checkStmt->num_rows > 0) {
    http_response_code(409);
    echo json_encode(["success" => false, "message" => "CIN déjà utilisé"]);
    $checkStmt->close();
    $conn->close();
    exit;
}
$checkStmt->close();

// Préparer l'insertion
$sql = "INSERT INTO Membre 
        (CinMembre, Password, Nom, Prenom, DateNaissance, Adresse, Email, Tel, TypeMembre, IdNiveau, IdFiliere, ApprouveM) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'non')";

$stmt = $conn->prepare($sql);
if (!$stmt) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Erreur préparation requête"]);
    $conn->close();
    exit;
}

$stmt->bind_param(
    "sssssssssss",
    $cin,
    $password,
    $nom,
    $prenom,
    $dateNaiss,
    $adresse,
    $email,
    $tel,
    $type,
    $idNiveau,
    $idFiliere
);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Inscription réussie"]);
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Erreur lors de l'inscription"]);
}

$stmt->close();
$conn->close();
