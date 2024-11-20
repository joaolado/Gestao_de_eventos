
/* CREATE DATABASE - Event Management */

CREATE DATABASE event_management;

/* ----------------------------------------------------------------------------------------------------------------- */
/* CREATE TABLE - Users Type */

CREATE TABLE users_type (
    id INT AUTO_INCREMENT,
    users_type VARCHAR(250),
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (id) );

/* ----------------------------------------------------------------------------------------------------------------- */
/* CREATE TABLE - Users Address */

CREATE TABLE users_address (
    id INT AUTO_INCREMENT,
    address_line1 VARCHAR(250),
    address_line2 VARCHAR(250),
    postal_code VARCHAR(20),
    city VARCHAR(50),
    region VARCHAR(50),
    country VARCHAR(50),
    PRIMARY KEY (id) );

/* ----------------------------------------------------------------------------------------------------------------- */
/* CREATE TABLE - Users */

CREATE TABLE users (
    id INT AUTO_INCREMENT,
    user_name VARCHAR(100) NOT NULL,
    user_password VARCHAR(250) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(250),
    address_id INT,
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (id),
    CONSTRAINT address_fk1
		    FOREIGN KEY (address_id) REFERENCES users_address (id) );

/* ----------------------------------------------------------------------------------------------------------------- */
/* CREATE TABLE - Users Type / Users */

CREATE TABLE users_type_users (
    users_id INT,
    users_type_id INT,
    PRIMARY KEY (users_id, users_type_id),
    CONSTRAINT users_type_users_fk1
            FOREIGN KEY (users_id) REFERENCES users (id),
            FOREIGN KEY (users_type_id) REFERENCES users_type (id));

/* ----------------------------------------------------------------------------------------------------------------- */
/* CREATE TABLE - Users Payments */

CREATE TABLE users_payments (
    id INT AUTO_INCREMENT,
    users_id INT,
    payment_type VARCHAR(100),
    payment_provider VARCHAR(100),
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT users_fk1
		    FOREIGN KEY (users_id) REFERENCES users (id) );

/* ----------------------------------------------------------------------------------------------------------------- */
/* CREATE TABLE - Events Category */

CREATE TABLE events_category (
    id INT AUTO_INCREMENT,
    name VARCHAR(100),
    desc VARCHAR(250),
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (id));

/* ----------------------------------------------------------------------------------------------------------------- */
/* CREATE TABLE - Events */

CREATE TABLE events (
    id INT AUTO_INCREMENT,
    name VARCHAR(250),
    desc VARCHAR(500),
    cover VARCHAR(250),       /* IMAGE - BLOB Type ??? */
    d_day DATETIME,
    capacity INT,
    address_line1 VARCHAR(250),
    address_line2 VARCHAR(250),
    postal_code VARCHAR(20),
    city VARCHAR(50),
    region VARCHAR(50),
    country VARCHAR(50),
    category_id INT,
    status ENUM('Active', 'Scheduled', 'Cancelled') DEFAULT 'Scheduled',
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (id),
    CONSTRAINT category_fk1
        FOREIGN KEY (category_id) REFERENCES events_category (id) );

/* ----------------------------------------------------------------------------------------------------------------- */
/* CREATE TABLE - Tickets Type */

CREATE TABLE tickets_type (
    id INT AUTO_INCREMENT,
    tickets_type VARCHAR(100),
    desc VARCHAR(250),
    status ENUM('Active', 'Disabled') DEFAULT 'Active',
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (id) );

/* ----------------------------------------------------------------------------------------------------------------- */
/* CREATE TABLE - Tickets Info */

CREATE TABLE tickets_info (
    id INT AUTO_INCREMENT,
    events_id INT,
    tickets_type_id INT,
    SKU VARCHAR(250),
    price DECIMAL(10, 2),
    quantity INT,
    status ENUM('Available', 'Sold Out', 'Coming Soon') DEFAULT 'Available',
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (id),
    CONSTRAINT events_fk1
		    FOREIGN KEY (events_id) REFERENCES events (id),
    CONSTRAINT tickets_type_fk2
		    FOREIGN KEY (tickets_type_id) REFERENCES tickets_type (id) );

/* ----------------------------------------------------------------------------------------------------------------- */
/* CREATE TABLE - Ordered Tickets */

CREATE TABLE ordered_tickets (
    id INT AUTO_INCREMENT,
    tickets_info_id INT,
    quantity INT,
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT events_fk2
		    FOREIGN KEY (events_id) REFERENCES events (id), );

/* ----------------------------------------------------------------------------------------------------------------- */
/* CREATE TABLE - Order Details */

CREATE TABLE order_details (
    id INT AUTO_INCREMENT,
    users_id INT,
    ordered_tickets_id INT,
    order_total DECIMAL(10, 2),
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    on_cart ENUM('Active', 'Scheduled', 'Cancelled') DEFAULT 'Scheduled',
    status ENUM('Pending', 'Completed', 'Cancelled') DEFAULT 'Pending',
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT users_fk2
		    FOREIGN KEY (users_id) REFERENCES users (id),
    CONSTRAINT ordered_tickets_fk2
		    FOREIGN KEY (ordered_tickets_id) REFERENCES ordered_tickets (id) );

/* ----------------------------------------------------------------------------------------------------------------- */
/* CREATE TABLE - Payment Details */

CREATE TABLE payment_details (
    id INT AUTO_INCREMENT,
    order_id INT,
    users_payments_id INT,
    payment_amount DECIMAL(10, 2),
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('Paid', 'Failed', 'Refunded') DEFAULT 'Paid',
    PRIMARY KEY (id),
    CONSTRAINT order_fk1
		    FOREIGN KEY (order_id) REFERENCES order (id),
    CONSTRAINT users_payments_fk2
		    FOREIGN KEY (users_payments_id) REFERENCES users_payments (id) );

/* ----------------------------------------------------------------------------------------------------------------- */