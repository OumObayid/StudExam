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
$conn->set_charset("utf8mb4"); // 🔑 Forcer l'encodage MySQL
try {
    // ⚡ Nouvelle requête avec jointures
    $sql = "
        SELECT 
            M.CinMembre, M.Nom, M.Prenom, M.DateNaissance, 
            M.Adresse, M.Email, M.Tel, M.TypeMembre, 
            M.IdNiveau, N.NomNiveau, 
            M.IdFiliere, F.NomFiliere, 
            M.ApprouveM
        FROM membre M
        LEFT JOIN niveau N ON M.IdNiveau = N.IdNiveau
        LEFT JOIN filiere F ON M.IdFiliere = F.IdFiliere
    ";

    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        throw new Exception("Erreur préparation requête : " . $conn->error);
    }

    // Exécuter la requête
    $stmt->execute();
    $result = $stmt->get_result();

    $users = [];
    while ($row = $result->fetch_assoc()) {
        unset($row['Password']); // sécurité
        $users[] = $row;
    }

    echo json_encode([
        "success" => true,
        "users" => $users,
        "message" => "Liste des utilisateurs récupérée avec succès"
    ]);

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
