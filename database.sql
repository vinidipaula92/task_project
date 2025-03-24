CREATE DATABASE IF NOT EXISTS tecsatask;

USE tecsatask;

CREATE TABLE IF NOT EXISTS tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status ENUM('pendente', 'em andamento', 'concluida') NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL
);
