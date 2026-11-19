CREATE DATABASE IF NOT EXISTS zuula_db;

USE zuula_db;


CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    student_number VARCHAR(50) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('student', 'admin') NOT NULL DEFAULT 'student',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    report_type ENUM('lost', 'found') NOT NULL,
    title VARCHAR(150) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    private_details TEXT,
    location VARCHAR(200) NOT NULL,
    incident_date DATE NOT NULL,
    image_url VARCHAR(500),
    status ENUM('active', 'claimed', 'returned', 'closed')
        NOT NULL DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE,

    INDEX idx_report_type_status (report_type, status),
    INDEX idx_report_category (category)
);

CREATE TABLE IF NOT EXISTS claims (
    id INT AUTO_INCREMENT PRIMARY KEY,
    report_id INT NOT NULL,
    claimant_id INT NOT NULL,
    evidence TEXT NOT NULL,
    status ENUM('pending', 'approved', 'rejected', 'returned')
        NOT NULL DEFAULT 'pending',
    admin_reason TEXT,
    reviewed_by INT,
    reviewed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (report_id) REFERENCES reports(id)
        ON DELETE CASCADE,

    FOREIGN KEY (claimant_id) REFERENCES users(id)
        ON DELETE CASCADE,

    FOREIGN KEY (reviewed_by) REFERENCES users(id)
        ON DELETE SET NULL,

    INDEX idx_claim_report_status (report_id, status),
    INDEX idx_claimant (claimant_id)
);

SHOW TABLES;

DESCRIBE users;
DESCRIBE reports;
DESCRIBE claims;

USE zuula_db;

SELECT
    id,
    full_name,
    email,
    password_hash
FROM users
ORDER BY id DESC;

SELECT* FROM users;

USE zuula_db;

INSERT INTO reports (
    user_id,
    report_type,
    title,
    category,
    description,
    private_details,
    location,
    incident_date,
    image_url,
    status
)
VALUES
(
    1,
    'lost',
    'Samsung Smartphone',
    'Electronics',
    'A Samsung smartphone was lost around the university campus.',
    NULL,
    'University Library',
    '2026-11-15',
    '/uploads/phone.jpg',
    'active'
),
(
    2,
    'found',
    'Black School Backpack',
    'Bags',
    'A black backpack was found near the student centre.',
    'Contains a distinctive blue keychain inside the front pocket.',
    'Student Centre',
    '2026-11-16',
    '/uploads/bag.jpg',
    'active'
),
(
    3,
    'lost',
    'HP Laptop',
    'Electronics',
    'An HP laptop was misplaced after a lecture.',
    NULL,
    'Lecture Room',
    '2026-11-17',
    '/uploads/laptop.jpg',
    'active'
),
(
    4,
    'found',
    'Business Studies Textbooks',
    'Books',
    'Several business studies textbooks were found on campus.',
    'One book has handwritten initials on the inside cover.',
    'University Library',
    '2026-11-18',
    '/uploads/books.jpg',
    'active'
),
(
    5,
    'lost',
    'Set of Keys',
    'Other',
    'A set of keys attached to a small keyring was lost.',
    NULL,
    'University Cafeteria',
    '2026-11-19',
    '/uploads/keys.jpg',
    'active'
);

SELECT
    id,
    user_id,
    report_type,
    title,
    image_url,
    status
FROM reports
ORDER BY id DESC
LIMIT 5;

Select * from reports;