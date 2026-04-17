<?php
// backend/auth.php - Authentication Logic
session_start();
require_once 'db.php';

// Action dispatcher
$action = $_GET['action'] ?? '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if ($action === 'login') {
        login();
    } elseif ($action === 'register') {
        register();
    }
} elseif ($action === 'logout') {
    logout();
} elseif ($action === 'check') {
    checkAuth();
}

function login() {
    global $pdo;
    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';
    $captcha = $_POST['captcha'] ?? '';


    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if ($user && password_verify($password, $user['password'])) {
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['role'] = $user['role'];
        $_SESSION['username'] = $user['username'];
        
        // Set a cookie for 30 days
        setcookie('user_login', $user['username'], time() + (86400 * 30), "/");

        jsonResponse(['message' => 'Muvaffaqiyatli kirildi', 'user' => $user]);
    } else {
        jsonResponse(['error' => 'Email yoki parol noto\'g\'ri'], 401);
    }
}

function register() {
    global $pdo;
    $username = $_POST['username'] ?? '';
    $email = $_POST['email'] ?? '';
    $password = password_hash($_POST['password'] ?? '', PASSWORD_DEFAULT);
    $role = $_POST['role'] ?? 'student';

    try {
        $stmt = $pdo->prepare("INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)");
        $stmt->execute([$username, $email, $password, $role]);
        jsonResponse(['message' => 'Ro\'yxatdan muvaffaqiyatli o\'tdingiz']);
    } catch (Exception $e) {
        jsonResponse(['error' => 'Email yoki foydalanuvchi nomi band'], 400);
    }
}

function logout() {
    session_destroy();
    setcookie('user_login', '', time() - 3600, "/");
    jsonResponse(['message' => 'Tizimdan chiqildi']);
}

function checkAuth() {
    if (isset($_SESSION['user_id'])) {
        jsonResponse(['authenticated' => true, 'user' => $_SESSION]);
    } else {
        jsonResponse(['authenticated' => false], 401);
    }
}

?>
