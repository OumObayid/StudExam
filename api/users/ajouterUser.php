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

// Vérification des champs obligatoires
if (
    !isset(
        $data['CinMembre'],
        $data['Password'],
        $data['Nom'],
        $data['Prenom'],
        $data['DateNaissance'],
        $data['Adresse'],
        $data['Email'],
        $data['Tel']
    )
) {
    echo json_encode(["success" => false, "message" => "Champs obligatoires manquants"]);
    exit;
}

try {
    // Vérifier si le CinMembre existe déjà
    $checkStmt = $conn->prepare("SELECT CinMembre FROM membre WHERE CinMembre = ?");
    $checkStmt->bind_param("s", $data['CinMembre']);
    $checkStmt->execute();
    $checkStmt->store_result();

    if ($checkStmt->num_rows > 0) {
        echo json_encode([
            "success" => false,
            "message" => "Un utilisateur avec ce CIN existe déjà"
        ]);
        $checkStmt->close();
        $conn->close();
        exit;
    }
    $checkStmt->close();

    // Hasher le mot de passe
    $hashedPassword = password_hash($data['Password'], PASSWORD_DEFAULT);

    // Préparer la requête d'insertion
    $stmt = $conn->prepare("INSERT INTO membre 
        (CinMembre, Password, Nom, Prenom, DateNaissance, Adresse, Email, Tel, TypeMembre, ApprouveM) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Instructor', 'non')");

    if (!$stmt) {
        throw new Exception("Erreur préparation requête : " . $conn->error);
    }

    $stmt->bind_param(
        "ssssssss",
        $data['CinMembre'],
        $hashedPassword,
        $data['Nom'],
        $data['Prenom'],
        $data['DateNaissance'],
        $data['Adresse'],
        $data['Email'],
        $data['Tel']
    );

    if ($stmt->execute()) {
        echo json_encode([
            "success" => true,
            "message" => "Utilisateur ajouté avec succès"
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Erreur lors de l'ajout : " . $stmt->error
        ]);
    }

    $stmt->close();
    $conn->close();

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
    $conn->close();
}
?>
