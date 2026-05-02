ALTER TABLE reservations
  ADD COLUMN confirmation_code VARCHAR(40) NULL AFTER reservation_code,
  ADD UNIQUE KEY uq_reservations_confirmation_code (confirmation_code);

ALTER TABLE payments
  ADD COLUMN provider VARCHAR(40) NULL AFTER payment_channel,
  ADD COLUMN provider_event_id VARCHAR(120) NULL AFTER provider,
  ADD UNIQUE KEY uq_payments_provider_event_id (provider_event_id);

CREATE TABLE reservation_holds (
  id INT(11) NOT NULL AUTO_INCREMENT,
  hold_token VARCHAR(80) NOT NULL,
  guest_email VARCHAR(150) DEFAULT NULL,
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  expires_at DATETIME NOT NULL,
  status ENUM('active','converted','cancelled','expired') NOT NULL DEFAULT 'active',
  reservation_id INT(11) DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_reservation_holds_token (hold_token),
  KEY idx_reservation_holds_window (check_in_date, check_out_date, status, expires_at),
  KEY fk_reservation_holds_reservation (reservation_id),
  CONSTRAINT fk_reservation_holds_reservation FOREIGN KEY (reservation_id)
    REFERENCES reservations (id) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT reservation_holds_dates_chk CHECK (check_out_date > check_in_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE reservation_hold_rooms (
  id INT(11) NOT NULL AUTO_INCREMENT,
  hold_id INT(11) NOT NULL,
  room_id INT(11) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_reservation_hold_room_pair (hold_id, room_id),
  KEY idx_reservation_hold_rooms_room (room_id),
  CONSTRAINT fk_reservation_hold_rooms_hold FOREIGN KEY (hold_id)
    REFERENCES reservation_holds (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_reservation_hold_rooms_room FOREIGN KEY (room_id)
    REFERENCES rooms (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE payment_webhook_events (
  id INT(11) NOT NULL AUTO_INCREMENT,
  provider VARCHAR(40) NOT NULL,
  event_id VARCHAR(120) NOT NULL,
  reservation_id INT(11) DEFAULT NULL,
  payment_id INT(11) DEFAULT NULL,
  processing_status ENUM('received','processed','failed') NOT NULL DEFAULT 'received',
  error_message VARCHAR(255) DEFAULT NULL,
  payload_json LONGTEXT DEFAULT NULL,
  processed_at DATETIME DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_payment_webhook_provider_event (provider, event_id),
  KEY fk_payment_webhook_reservation (reservation_id),
  KEY fk_payment_webhook_payment (payment_id),
  CONSTRAINT fk_payment_webhook_payment FOREIGN KEY (payment_id)
    REFERENCES payments (id) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_payment_webhook_reservation FOREIGN KEY (reservation_id)
    REFERENCES reservations (id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
