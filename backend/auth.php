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
} elseif ($action === 'captcha') {
    generateCaptcha();
}

function login() {
    global $pdo;
    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';
    $captcha = $_POST['captcha'] ?? '';

    // Verify CAPTCHA
    if ($captcha != ($_SESSION['captcha_text'] ?? '')) {
        jsonResponse(['error' => 'Noto\'g\'ri CAPTCHA'], 400);
    }

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

function generateCaptcha() {
    $text = substr(str_shuffle("0123456789abcdefghijklmnopqrstuvwxyz"), 0, 5);
    $_SESSION['captcha_text'] = $text;
    
    $image = imagecreatetruecolor(60, 30);
    $bg = imagecolorallocate($image, 22, 33, 62);
    $fg = imagecolorallocate($image, 255, 255, 255);
    imagefill($image, 0, 0, $bg);
    imagestring($image, 5, 5, 5, $text, $fg);
    
    header('Content-Type: image/png');
    imagepng($image);
    imagedestroy($image);
    exit;
}
?>
