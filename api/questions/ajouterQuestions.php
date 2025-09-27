<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
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

// Préparer la requête
$stmt = $conn->prepare("INSERT INTO question (IdExamenQ, TitreQuestion, Reponse1, Reponse2, Reponse3, ReponseCorrecte) 
                        VALUES (?, ?, ?, ?, ?, ?)");

if (!$stmt) {
    echo json_encode([
        "success" => false,
        "message" => "Erreur préparation requête: " . $conn->error
    ]);
    exit;
}

$count = 0;

foreach ($questions as $q) {
    if (!isset($q['IdExamenQ'], $q['TitreQuestion'], $q['Reponse1'], $q['Reponse2'], $q['Reponse3'], $q['ReponseCorrecte'])) {
        continue; // ignorer si données incomplètes
    }

    // Conversion en int pour IdExamenQ et ReponseCorrecte
    $IdExamenQ = (int)$q['IdExamenQ'];
    $ReponseCorrecte = (int)$q['ReponseCorrecte'];
    $TitreQuestion = $q['TitreQuestion'];
    $Reponse1 = $q['Reponse1'];
    $Reponse2 = $q['Reponse2'];
    $Reponse3 = $q['Reponse3'];

    $stmt->bind_param(
        "issssi", // i = int, s = string, ici 2 int et 4 string
        $IdExamenQ,
        $TitreQuestion,
        $Reponse1,
        $Reponse2,
        $Reponse3,
        $ReponseCorrecte
    );

    if ($stmt->execute()) {
        $count++;
    }
}

$stmt->close();
$conn->close();

echo json_encode([
    "success" => true,
    "message" => "$count question(s) insérée(s) avec succès",
    "count" => $count
]);
