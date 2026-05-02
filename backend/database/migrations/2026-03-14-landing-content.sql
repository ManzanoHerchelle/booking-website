CREATE TABLE IF NOT EXISTS landing_content (
    id INT AUTO_INCREMENT PRIMARY KEY,
    eyebrow VARCHAR(150) NOT NULL,
    title VARCHAR(255) NOT NULL,
    subtitle TEXT NULL,
    primary_button_label VARCHAR(80) NOT NULL,
    primary_button_link VARCHAR(255) NOT NULL,
    secondary_button_label VARCHAR(80) NULL,
    secondary_button_link VARCHAR(255) NULL,
    updated_by INT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_landing_content_updated_by
        FOREIGN KEY (updated_by) REFERENCES users(id)
        ON UPDATE CASCADE
        ON DELETE SET NULL
) ENGINE=InnoDB;
