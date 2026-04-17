<?php
// api/posts.php - REST API for Posts CRUD
session_start();
require_once '../backend/db.php';

// Check if user is logged in for mutations
if ($_SERVER['REQUEST_METHOD'] !== 'GET' && !isset($_SESSION['user_id'])) {
    jsonResponse(['error' => 'Ruxsat berilmagan'], 403);
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        getPosts();
        break;
    case 'POST':
        createPost();
        break;
    case 'PUT':
        updatePost();
        break;
    case 'DELETE':
        deletePost();
        break;
}

function getPosts() {
    global $pdo;
    $stmt = $pdo->query("SELECT posts.*, users.username FROM posts JOIN users ON posts.user_id = users.id ORDER BY created_at DESC");
    jsonResponse($stmt->fetchAll());
}

function createPost() {
    global $pdo;
    $title = $_POST['title'] ?? '';
    $desc = $_POST['description'] ?? '';
    $user_id = $_SESSION['user_id'];
    $imageUrl = '';

    // Handle File Upload
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $ext = pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
        $filename = uniqid() . '.' . $ext;
        $path = '../uploads/' . $filename;
        if (move_uploaded_file($_FILES['image']['tmp_name'], $path)) {
            $imageUrl = 'uploads/' . $filename;
        }
    }

    $stmt = $pdo->prepare("INSERT INTO posts (user_id, title, description, image_url) VALUES (?, ?, ?, ?)");
    $stmt->execute([$user_id, $title, $desc, $imageUrl]);
    jsonResponse(['message' => 'Post yaratildi']);
}

function updatePost() {
    global $pdo;
    // For PUT, PHP doesn't populate $_POST. Use php://input
    parse_str(file_get_contents("php://input"), $vars);
    $id = $vars['id'] ?? null;
    $title = $vars['title'] ?? '';
    $desc = $vars['description'] ?? '';

    if (!$id) jsonResponse(['error' => 'ID topilmadi'], 400);

    $stmt = $pdo->prepare("UPDATE posts SET title = ?, description = ? WHERE id = ? AND user_id = ?");
    $stmt->execute([$title, $desc, $id, $_SESSION['user_id']]);
    jsonResponse(['message' => 'Post yangilandi']);
}

function deletePost() {
    global $pdo;
    parse_str(file_get_contents("php://input"), $vars);
    $id = $vars['id'] ?? null;

    if (!$id) jsonResponse(['error' => 'ID topilmadi'], 400);

    $stmt = $pdo->prepare("DELETE FROM posts WHERE id = ? AND user_id = ?");
    $stmt->execute([$id, $_SESSION['user_id']]);
    jsonResponse(['message' => 'Post o\'chirildi']);
}
?>
