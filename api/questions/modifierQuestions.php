<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

error_reporting(E_ALL);
ini_set('display_errors', 1);

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(0);

// Connexion DB
$config = include __DIR__ . '/../config.php';
$conn = new mysqli($config['db_host'], $config['db_user'], $config['db_pass'], $config['db_name']);
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Erreur connexion DB"]);
    exit;
}
$conn->set_charset("utf8mb4"); // 🔑 Forcer l'encodage MySQL
// Lire le body JSON
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['questions']) || !is_array($data['questions'])) {
    echo json_encode([
        "success" => false,
        "message" => "Aucune question valide reçue"
    ]);
    exit;
}

$questions = $data['questions'];

// Préparer la requête UPDATE
$stmt = $conn->prepare("
    UPDATE question 
    SET TitreQuestion = ?, Reponse1 = ?, Reponse2 = ?, Reponse3 = ?, ReponseCorrecte = ?
    WHERE IdQuestion = ? AND IdExamenQ = ?
");

if (!$stmt) {
    echo json_encode([
        "success" => false,
        "message" => "Erreur préparation requête: " . $conn->error
    ]);
    exit;
}

$count = 0;

foreach ($questions as $q) {
    if (!isset($q['IdQuestion'], $q['IdExamenQ'], $q['TitreQuestion'], $q['Reponse1'], $q['Reponse2'], $q['Reponse3'], $q['ReponseCorrecte'])) {
        continue; // ignorer si données incomplètes
    }

    $IdQuestion = (int)$q['IdQuestion'];
    $IdExamenQ = (int)$q['IdExamenQ'];
    $ReponseCorrecte = (int)$q['ReponseCorrecte'];
    $TitreQuestion = $q['TitreQuestion'];
    $Reponse1 = $q['Reponse1'];
    $Reponse2 = $q['Reponse2'];
    $Reponse3 = $q['Reponse3'];

    $stmt->bind_param(
        "ssssiii", // TitreQuestion, Reponse1, Reponse2, Reponse3, ReponseCorrecte, IdQuestion, IdExamenQ
        $TitreQuestion,
        $Reponse1,
        $Reponse2,
        $Reponse3,
        $ReponseCorrecte,
        $IdQuestion,
        $IdExamenQ
    );

    if ($stmt->execute()) {
        $count++;
    }
}

$stmt->close();
$conn->close();

echo json_encode([
    "success" => true,
    "message" => "$count question(s) modifiée(s) avec succès",
    "count" => $count
]);
