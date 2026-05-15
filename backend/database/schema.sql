
/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `activity_logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `entity_type` varchar(50) NOT NULL,
  `entity_id` int(11) NOT NULL,
  `action` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_activity_logs_user` (`user_id`),
  KEY `idx_activity_logs_entity` (`entity_type`,`entity_id`),
  KEY `idx_activity_logs_created_at` (`created_at`),
  CONSTRAINT `fk_activity_logs_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `amenities_card_images` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `amenities_card_id` int(11) NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `alt_text` varchar(255) DEFAULT NULL,
  `sort_order` int(11) NOT NULL DEFAULT 1,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_amenities_card_images_card` (`amenities_card_id`),
  CONSTRAINT `fk_amenities_card_images_card` FOREIGN KEY (`amenities_card_id`) REFERENCES `amenities_cards` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `amenities_cards` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(150) NOT NULL,
  `description` text NOT NULL,
  `sort_order` int(11) NOT NULL DEFAULT 1,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `updated_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_amenities_cards_updated_by` (`updated_by`),
  CONSTRAINT `fk_amenities_cards_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `amenities_content` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `eyebrow` varchar(150) NOT NULL,
  `title` varchar(255) NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `image_alt` varchar(255) DEFAULT NULL,
  `subtitle` text DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_amenities_content_updated_by` (`updated_by`),
  CONSTRAINT `fk_amenities_content_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `announcements` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(150) NOT NULL,
  `body` text NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `starts_at` datetime DEFAULT NULL,
  `ends_at` datetime DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_announcements_created_by` (`created_by`),
  CONSTRAINT `fk_announcements_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `availability_blocks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `room_id` int(11) DEFAULT NULL,
  `block_scope` enum('room','whole_resort') NOT NULL DEFAULT 'room',
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `reason` varchar(255) DEFAULT NULL,
  `status` enum('active','lifted') NOT NULL DEFAULT 'active',
  `created_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_availability_blocks_room` (`room_id`),
  KEY `fk_availability_blocks_created_by` (`created_by`),
  KEY `idx_availability_blocks_dates` (`start_date`,`end_date`,`status`),
  CONSTRAINT `fk_availability_blocks_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_availability_blocks_room` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `chk_availability_blocks_date_range` CHECK (`end_date` >= `start_date`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cancellation_requests` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `reservation_id` int(11) NOT NULL,
  `requested_by` enum('guest','frontdesk','admin') NOT NULL,
  `reason` text NOT NULL,
  `request_status` enum('pending','approved','denied','completed') NOT NULL DEFAULT 'pending',
  `requested_at` datetime NOT NULL DEFAULT current_timestamp(),
  `reviewed_by_user_id` int(11) DEFAULT NULL,
  `reviewed_at` datetime DEFAULT NULL,
  `review_notes` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_cancellation_requests_reservation` (`reservation_id`),
  KEY `fk_cancellation_requests_reviewed_by` (`reviewed_by_user_id`),
  KEY `idx_cancellation_requests_status` (`request_status`),
  CONSTRAINT `fk_cancellation_requests_reservation` FOREIGN KEY (`reservation_id`) REFERENCES `reservations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_cancellation_requests_reviewed_by` FOREIGN KEY (`reviewed_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `guests` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `phone` varchar(30) DEFAULT NULL,
  `address_line` varchar(255) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `province` varchar(100) DEFAULT NULL,
  `country` varchar(100) DEFAULT 'Philippines',
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_guests_email` (`email`),
  KEY `idx_guests_name` (`last_name`,`first_name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `homepage_slides` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(150) NOT NULL,
  `subtitle` text DEFAULT NULL,
  `image_url` varchar(255) NOT NULL,
  `alt_text` varchar(255) DEFAULT NULL,
  `button_label` varchar(80) DEFAULT NULL,
  `button_link` varchar(255) DEFAULT NULL,
  `sort_order` int(11) NOT NULL DEFAULT 1,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_homepage_slides_created_by` (`created_by`),
  KEY `fk_homepage_slides_updated_by` (`updated_by`),
  CONSTRAINT `fk_homepage_slides_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_homepage_slides_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `landing_content` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `eyebrow` varchar(150) NOT NULL,
  `title` varchar(255) NOT NULL,
  `subtitle` text DEFAULT NULL,
  `primary_button_label` varchar(80) NOT NULL,
  `primary_button_link` varchar(255) NOT NULL,
  `secondary_button_label` varchar(80) DEFAULT NULL,
  `secondary_button_link` varchar(255) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_landing_content_updated_by` (`updated_by`),
  CONSTRAINT `fk_landing_content_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `payments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `reservation_id` int(11) NOT NULL,
  `payment_method` enum('e_wallet','bank_transfer','cash') NOT NULL,
  `payment_channel` varchar(100) DEFAULT NULL,
  `amount` decimal(12,2) NOT NULL,
  `payment_status` enum('pending','paid','partial','failed','refunded','cancelled') NOT NULL DEFAULT 'pending',
  `reference_number` varchar(100) DEFAULT NULL,
  `proof_image_url` varchar(255) DEFAULT NULL,
  `paid_at` datetime DEFAULT NULL,
  `recorded_by_user_id` int(11) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_payments_recorded_by` (`recorded_by_user_id`),
  KEY `idx_payments_reservation` (`reservation_id`,`payment_status`),
  CONSTRAINT `fk_payments_recorded_by` FOREIGN KEY (`recorded_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_payments_reservation` FOREIGN KEY (`reservation_id`) REFERENCES `reservations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `chk_payments_amount_positive` CHECK (`amount` > 0)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `policies` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `policy_key` varchar(100) NOT NULL,
  `title` varchar(150) NOT NULL,
  `content` text NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `updated_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `policy_key` (`policy_key`),
  KEY `fk_policies_updated_by` (`updated_by`),
  CONSTRAINT `fk_policies_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `promos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(150) NOT NULL,
  `description` text DEFAULT NULL,
  `promo_code` varchar(50) DEFAULT NULL,
  `discount_type` enum('percentage','fixed_amount') NOT NULL,
  `discount_value` decimal(10,2) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `minimum_nights` int(11) NOT NULL DEFAULT 1,
  `minimum_rooms` int(11) NOT NULL DEFAULT 1,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `promo_code` (`promo_code`),
  KEY `fk_promos_created_by` (`created_by`),
  KEY `idx_promos_active_dates` (`is_active`,`start_date`,`end_date`),
  CONSTRAINT `fk_promos_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `chk_promos_discount_value` CHECK (`discount_value` >= 0),
  CONSTRAINT `chk_promos_date_range` CHECK (`end_date` >= `start_date`),
  CONSTRAINT `chk_promos_minimum_nights` CHECK (`minimum_nights` > 0),
  CONSTRAINT `chk_promos_minimum_rooms` CHECK (`minimum_rooms` > 0)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `refund_requests` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `reservation_id` int(11) NOT NULL,
  `payment_id` int(11) DEFAULT NULL,
  `reason` text NOT NULL,
  `request_status` enum('pending','approved','denied','processed') NOT NULL DEFAULT 'pending',
  `requested_amount` decimal(12,2) NOT NULL,
  `approved_amount` decimal(12,2) DEFAULT NULL,
  `requested_at` datetime NOT NULL DEFAULT current_timestamp(),
  `reviewed_by_user_id` int(11) DEFAULT NULL,
  `reviewed_at` datetime DEFAULT NULL,
  `review_notes` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_refund_requests_reservation` (`reservation_id`),
  KEY `fk_refund_requests_payment` (`payment_id`),
  KEY `fk_refund_requests_reviewed_by` (`reviewed_by_user_id`),
  KEY `idx_refund_requests_status` (`request_status`),
  CONSTRAINT `fk_refund_requests_payment` FOREIGN KEY (`payment_id`) REFERENCES `payments` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_refund_requests_reservation` FOREIGN KEY (`reservation_id`) REFERENCES `reservations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_refund_requests_reviewed_by` FOREIGN KEY (`reviewed_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `chk_refund_requests_requested_amount` CHECK (`requested_amount` >= 0),
  CONSTRAINT `chk_refund_requests_approved_amount` CHECK (`approved_amount` is null or `approved_amount` >= 0)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `reservation_charges` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `reservation_id` int(11) NOT NULL,
  `reservation_room_id` int(11) DEFAULT NULL,
  `charge_type` enum('room_rate','extra_guest','extension','transfer_fee','damage','service','other') NOT NULL,
  `description` varchar(255) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `unit_price` decimal(10,2) NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `charge_date` datetime NOT NULL DEFAULT current_timestamp(),
  `added_by_user_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_reservation_charges_reservation` (`reservation_id`),
  KEY `fk_reservation_charges_room` (`reservation_room_id`),
  KEY `fk_reservation_charges_added_by` (`added_by_user_id`),
  CONSTRAINT `fk_reservation_charges_added_by` FOREIGN KEY (`added_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_reservation_charges_reservation` FOREIGN KEY (`reservation_id`) REFERENCES `reservations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_reservation_charges_room` FOREIGN KEY (`reservation_room_id`) REFERENCES `reservation_rooms` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `chk_reservation_charges_quantity` CHECK (`quantity` > 0),
  CONSTRAINT `chk_reservation_charges_unit_price` CHECK (`unit_price` >= 0),
  CONSTRAINT `chk_reservation_charges_amount` CHECK (`amount` >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `reservation_rooms` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `reservation_id` int(11) NOT NULL,
  `room_id` int(11) NOT NULL,
  `nightly_rate` decimal(10,2) NOT NULL,
  `nights` int(11) NOT NULL,
  `adult_count` int(11) NOT NULL DEFAULT 1,
  `child_count` int(11) NOT NULL DEFAULT 0,
  `extra_guest_count` int(11) NOT NULL DEFAULT 0,
  `line_total` decimal(12,2) NOT NULL,
  `room_status` enum('reserved','checked_in','checked_out','cancelled','transferred') NOT NULL DEFAULT 'reserved',
  `check_in_date` date NOT NULL,
  `check_out_date` date NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_reservation_room_pair` (`reservation_id`,`room_id`),
  KEY `idx_reservation_rooms_room_dates` (`room_id`,`check_in_date`,`check_out_date`),
  CONSTRAINT `fk_reservation_rooms_reservation` FOREIGN KEY (`reservation_id`) REFERENCES `reservations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_reservation_rooms_room` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `chk_reservation_rooms_nightly_rate` CHECK (`nightly_rate` >= 0),
  CONSTRAINT `chk_reservation_rooms_nights` CHECK (`nights` > 0),
  CONSTRAINT `chk_reservation_rooms_adult_count` CHECK (`adult_count` >= 1),
  CONSTRAINT `chk_reservation_rooms_child_count` CHECK (`child_count` >= 0),
  CONSTRAINT `chk_reservation_rooms_extra_guest_count` CHECK (`extra_guest_count` >= 0),
  CONSTRAINT `chk_reservation_rooms_line_total` CHECK (`line_total` >= 0),
  CONSTRAINT `chk_reservation_rooms_check_out_date` CHECK (`check_out_date` > `check_in_date`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `reservation_status_history` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `reservation_id` int(11) NOT NULL,
  `old_status` varchar(50) DEFAULT NULL,
  `new_status` varchar(50) NOT NULL,
  `changed_by_user_id` int(11) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `changed_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_reservation_status_history_reservation` (`reservation_id`),
  KEY `fk_reservation_status_history_changed_by` (`changed_by_user_id`),
  CONSTRAINT `fk_reservation_status_history_changed_by` FOREIGN KEY (`changed_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_reservation_status_history_reservation` FOREIGN KEY (`reservation_id`) REFERENCES `reservations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `reservations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `reservation_code` varchar(30) NOT NULL,
  `guest_id` int(11) NOT NULL,
  `promo_id` int(11) DEFAULT NULL,
  `booking_scope` enum('single_room','multi_room','whole_resort') NOT NULL DEFAULT 'single_room',
  `booking_source` enum('online','walk_in','phone','frontdesk_assisted') NOT NULL DEFAULT 'online',
  `arrival_type` enum('same_day','advance') NOT NULL DEFAULT 'advance',
  `check_in_date` date NOT NULL,
  `check_out_date` date NOT NULL,
  `adult_count` int(11) NOT NULL DEFAULT 1,
  `child_count` int(11) NOT NULL DEFAULT 0,
  `special_requests` text DEFAULT NULL,
  `booking_notes` text DEFAULT NULL,
  `reservation_status` enum('pending','confirmed','checked_in','checked_out','cancelled','no_show','overstayed') NOT NULL DEFAULT 'pending',
  `payment_status` enum('pending','partial','paid','failed','refunded','cancelled') NOT NULL DEFAULT 'pending',
  `subtotal_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `discount_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `extra_charges_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `refund_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `total_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `amount_paid` decimal(12,2) NOT NULL DEFAULT 0.00,
  `balance_due` decimal(12,2) NOT NULL DEFAULT 0.00,
  `cancelled_at` datetime DEFAULT NULL,
  `cancellation_reason` text DEFAULT NULL,
  `checked_in_at` datetime DEFAULT NULL,
  `checked_out_at` datetime DEFAULT NULL,
  `created_by_user_id` int(11) DEFAULT NULL,
  `updated_by_user_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `reservation_code` (`reservation_code`),
  KEY `fk_reservations_guest` (`guest_id`),
  KEY `fk_reservations_promo` (`promo_id`),
  KEY `fk_reservations_created_by` (`created_by_user_id`),
  KEY `fk_reservations_updated_by` (`updated_by_user_id`),
  KEY `idx_reservations_dates` (`check_in_date`,`check_out_date`),
  KEY `idx_reservations_status` (`reservation_status`,`payment_status`),
  CONSTRAINT `fk_reservations_created_by` FOREIGN KEY (`created_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_reservations_guest` FOREIGN KEY (`guest_id`) REFERENCES `guests` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_reservations_promo` FOREIGN KEY (`promo_id`) REFERENCES `promos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_reservations_updated_by` FOREIGN KEY (`updated_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `chk_reservations_check_out_date` CHECK (`check_out_date` > `check_in_date`),
  CONSTRAINT `chk_reservations_adult_count` CHECK (`adult_count` >= 1),
  CONSTRAINT `chk_reservations_child_count` CHECK (`child_count` >= 0),
  CONSTRAINT `chk_reservations_subtotal_amount` CHECK (`subtotal_amount` >= 0),
  CONSTRAINT `chk_reservations_discount_amount` CHECK (`discount_amount` >= 0),
  CONSTRAINT `chk_reservations_extra_charges_amount` CHECK (`extra_charges_amount` >= 0),
  CONSTRAINT `chk_reservations_refund_amount` CHECK (`refund_amount` >= 0),
  CONSTRAINT `chk_reservations_total_amount` CHECK (`total_amount` >= 0),
  CONSTRAINT `chk_reservations_amount_paid` CHECK (`amount_paid` >= 0),
  CONSTRAINT `chk_reservations_balance_due` CHECK (`balance_due` >= 0)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `room_images` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `room_id` int(11) NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `alt_text` varchar(255) DEFAULT NULL,
  `sort_order` int(11) NOT NULL DEFAULT 1,
  `is_primary` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_room_images_room` (`room_id`),
  CONSTRAINT `fk_room_images_room` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `room_transfers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `reservation_id` int(11) NOT NULL,
  `reservation_room_id` int(11) NOT NULL,
  `from_room_id` int(11) NOT NULL,
  `to_room_id` int(11) NOT NULL,
  `reason` text NOT NULL,
  `transfer_status` enum('pending','approved','completed','cancelled') NOT NULL DEFAULT 'pending',
  `effective_date` date NOT NULL,
  `additional_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `processed_by_user_id` int(11) DEFAULT NULL,
  `processed_at` datetime DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_room_transfers_reservation` (`reservation_id`),
  KEY `fk_room_transfers_reservation_room` (`reservation_room_id`),
  KEY `fk_room_transfers_from_room` (`from_room_id`),
  KEY `fk_room_transfers_to_room` (`to_room_id`),
  KEY `fk_room_transfers_processed_by` (`processed_by_user_id`),
  KEY `idx_room_transfers_status` (`transfer_status`),
  CONSTRAINT `fk_room_transfers_from_room` FOREIGN KEY (`from_room_id`) REFERENCES `rooms` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_room_transfers_processed_by` FOREIGN KEY (`processed_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_room_transfers_reservation` FOREIGN KEY (`reservation_id`) REFERENCES `reservations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_room_transfers_reservation_room` FOREIGN KEY (`reservation_room_id`) REFERENCES `reservation_rooms` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_room_transfers_to_room` FOREIGN KEY (`to_room_id`) REFERENCES `rooms` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `chk_room_transfers_additional_amount` CHECK (`additional_amount` >= 0)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `room_types` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `base_capacity` int(11) NOT NULL,
  `max_capacity` int(11) NOT NULL,
  `base_price` decimal(10,2) NOT NULL,
  `extra_guest_fee` decimal(10,2) NOT NULL DEFAULT 0.00,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  CONSTRAINT `chk_room_types_base_capacity` CHECK (`base_capacity` > 0),
  CONSTRAINT `chk_room_types_max_capacity` CHECK (`max_capacity` >= `base_capacity`),
  CONSTRAINT `chk_room_types_base_price` CHECK (`base_price` >= 0),
  CONSTRAINT `chk_room_types_extra_guest_fee` CHECK (`extra_guest_fee` >= 0)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `rooms` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `room_type_id` int(11) NOT NULL,
  `room_number` varchar(50) NOT NULL,
  `room_name` varchar(150) NOT NULL,
  `description` text DEFAULT NULL,
  `floor_label` varchar(50) DEFAULT NULL,
  `max_guests_override` int(11) DEFAULT NULL,
  `price_override` decimal(10,2) DEFAULT NULL,
  `status` enum('available','occupied','reserved','cleaning','maintenance','inactive') NOT NULL DEFAULT 'available',
  `is_featured` tinyint(1) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `room_number` (`room_number`),
  KEY `fk_rooms_room_type` (`room_type_id`),
  KEY `idx_rooms_status` (`status`,`is_active`),
  CONSTRAINT `fk_rooms_room_type` FOREIGN KEY (`room_type_id`) REFERENCES `room_types` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `chk_rooms_price_override` CHECK (`price_override` is null or `price_override` >= 0),
  CONSTRAINT `chk_rooms_max_guests_override` CHECK (`max_guests_override` is null or `max_guests_override` > 0)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `schema_migrations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `filename` varchar(255) NOT NULL,
  `applied_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `filename` (`filename`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `stay_extensions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `reservation_id` int(11) NOT NULL,
  `reservation_room_id` int(11) NOT NULL,
  `current_check_out_date` date NOT NULL,
  `requested_check_out_date` date NOT NULL,
  `approved_check_out_date` date DEFAULT NULL,
  `status` enum('pending','approved','denied','completed') NOT NULL DEFAULT 'pending',
  `additional_nights` int(11) DEFAULT NULL,
  `additional_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `reason` text DEFAULT NULL,
  `requested_at` datetime NOT NULL DEFAULT current_timestamp(),
  `reviewed_by_user_id` int(11) DEFAULT NULL,
  `reviewed_at` datetime DEFAULT NULL,
  `notes` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_stay_extensions_reservation` (`reservation_id`),
  KEY `fk_stay_extensions_reservation_room` (`reservation_room_id`),
  KEY `fk_stay_extensions_reviewed_by` (`reviewed_by_user_id`),
  KEY `idx_stay_extensions_status` (`status`),
  CONSTRAINT `fk_stay_extensions_reservation` FOREIGN KEY (`reservation_id`) REFERENCES `reservations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_stay_extensions_reservation_room` FOREIGN KEY (`reservation_room_id`) REFERENCES `reservation_rooms` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_stay_extensions_reviewed_by` FOREIGN KEY (`reviewed_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `chk_stay_extensions_requested_date` CHECK (`requested_check_out_date` > `current_check_out_date`),
  CONSTRAINT `chk_stay_extensions_approved_date` CHECK (`approved_check_out_date` is null or `approved_check_out_date` > `current_check_out_date`),
  CONSTRAINT `chk_stay_extensions_additional_amount` CHECK (`additional_amount` >= 0)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `full_name` varchar(150) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('admin','frontdesk') NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `last_login_at` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

