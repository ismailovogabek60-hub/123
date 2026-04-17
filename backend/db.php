<?php
// backend/db.php - Database connection using PDO (SQLite Version)

$dbFile = __DIR__ . '/../database/education.db';

try {
    // Create connection to SQLite
    $pdo = new PDO("sqlite:" . $dbFile);
    $pdo->setAttribute(PDO::ATTR_ERR_MODE, PDO::ERR_MODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

    // Automatically create tables if they don't exist (Useful for Vercel/Local)
    $pdo->exec("CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'student',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )");

    $pdo->exec("CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        title TEXT NOT NULL,
        description TEXT,
        image_url TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )");

    // Insert default users if table is empty
    $check = $pdo->query("SELECT COUNT(*) FROM users")->fetchColumn();
    if ($check == 0) {
        $pass = password_hash('password', PASSWORD_DEFAULT);
        $pdo->exec("INSERT INTO users (username, email, password, role) VALUES 
            ('admin', 'admin@example.com', '$pass', 'admin'),
            ('teacher', 'teacher@example.com', '$pass', 'teacher'),
            ('student', 'student@example.com', '$pass', 'student')");
    }

} catch (\PDOException $e) {
    die("Database Connection Error: " . $e->getMessage());
}

// Global functions for convenience
function jsonResponse($data, $status = 200) {
    header('Content-Type: application/json');
    http_response_code($status);
    echo json_encode($data);
    exit;
}
?>
