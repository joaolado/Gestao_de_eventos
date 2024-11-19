
/* CREATE DATABASE - Event Management */

CREATE DATABASE event_management;

/* ----------------------------------------------------------------------------------------------------------------- */
/* CREATE TABLE - Permissions */

CREATE TABLE permissions (
    id INT AUTO_INCREMENT,
    name VARCHAR(100),
    desc VARCHAR(250),
    PRIMARY KEY (id));

/* ----------------------------------------------------------------------------------------------------------------- */
/* CREATE TABLE - Admin Type */

CREATE TABLE admin_type (
    id INT AUTO_INCREMENT,
    admin_type VARCHAR(250),
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id) );

/* ----------------------------------------------------------------------------------------------------------------- */
/* CREATE TABLE - Admin Permissions */

CREATE TABLE admin_permissions (
    admin_type_id INT,
    permission_id INT,
    PRIMARY KEY (admin_type_id, permission_id),
    CONSTRAINT admin_permissions_fk1
            FOREIGN KEY (admin_type_id) REFERENCES admin_type (id),
            FOREIGN KEY (permission_id) REFERENCES permissions (id));

/* ----------------------------------------------------------------------------------------------------------------- */
/* CREATE TABLE - Admin User */

CREATE TABLE admin_user (
    id INT AUTO_INCREMENT,
    user_name VARCHAR(100) NOT NULL,
    user_password VARCHAR(250) NOT NULL,
    first_name VARCHAR(100),    
    last_name VARCHAR(100),
    email VARCHAR(250),
    type_id INT,
    last_login DATETIME,
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT type_id_fk1
		    FOREIGN KEY (type_id) REFERENCES admin_type (id) );

/* ----------------------------------------------------------------------------------------------------------------- */
/* CREATE TABLE - User Address */

CREATE TABLE user_address (
    id INT AUTO_INCREMENT,
    address_line1 VARCHAR(250),
    address_line2 VARCHAR(250),
    postal_code VARCHAR(20),
    city VARCHAR(50),
    region VARCHAR(50),
    country VARCHAR(50),
    PRIMARY KEY (id) );

/* ----------------------------------------------------------------------------------------------------------------- */
/* CREATE TABLE - User */

CREATE TABLE user (
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
    CONSTRAINT address_id_fk1
		    FOREIGN KEY (address_id) REFERENCES user_address (id) );

/* ----------------------------------------------------------------------------------------------------------------- */
/* CREATE TABLE - User Payment */

CREATE TABLE user_payment (
    id INT AUTO_INCREMENT,
    user_id INT,
    payment_type VARCHAR(100),
    provider VARCHAR(100),
    expiry DATE,
    PRIMARY KEY (id),
    CONSTRAINT user_id_fk1
		    FOREIGN KEY (user_id) REFERENCES user (id) );

/* ----------------------------------------------------------------------------------------------------------------- */
/* CREATE TABLE - Events Location */

CREATE TABLE events_location (
    id INT AUTO_INCREMENT,
    address_line1 VARCHAR(250),
    address_line2 VARCHAR(250),
    postal_code VARCHAR(20),
    city VARCHAR(50),
    region VARCHAR(50),
    country VARCHAR(50),
    PRIMARY KEY (id) );

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
    location_id INT,
    category_id INT,
    status ENUM('Active', 'Scheduled', 'Cancelled') DEFAULT 'Scheduled',
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (id),
    CONSTRAINT location_id_fk1
        FOREIGN KEY (location_id) REFERENCES events_location (id),
    CONSTRAINT category_id_fk2
        FOREIGN KEY (category_id) REFERENCES events_category (id) );

/* ----------------------------------------------------------------------------------------------------------------- */
/* CREATE TABLE - Ticket Type */

CREATE TABLE ticket_type (
    id INT AUTO_INCREMENT,
    type VARCHAR(100),
    desc VARCHAR(250),
    status ENUM('Active', 'Disabled') DEFAULT 'Active',
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (id) );

/* ----------------------------------------------------------------------------------------------------------------- */
/* CREATE TABLE - Events Info */

CREATE TABLE events_info (
    id INT AUTO_INCREMENT,
    event_id INT,
    type_id INT,
    SKU VARCHAR(250),
    price DECIMAL(10, 2),
    quantity INT,
    status ENUM('Available', 'Sold Out', 'Coming Soon') DEFAULT 'Available',
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (id),
    CONSTRAINT event_id_fk1
		    FOREIGN KEY (event_id) REFERENCES events (id),
    CONSTRAINT type_id_fk2
		    FOREIGN KEY (type_id) REFERENCES ticket_type (id) );

/* ----------------------------------------------------------------------------------------------------------------- */
/* CREATE TABLE - Shopping Session */

CREATE TABLE shopping_session (
    id INT AUTO_INCREMENT,
    user_id INT,
    total DECIMAL(10, 2),
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT user_id_fk2
		    FOREIGN KEY (user_id) REFERENCES user (id) );

/* ----------------------------------------------------------------------------------------------------------------- */
/* CREATE TABLE - Cart Item */

CREATE TABLE cart_item (
    id INT AUTO_INCREMENT,
    session_id INT,
    events_info_id INT,
    quantity INT,
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT session_id_fk1
		    FOREIGN KEY (session_id) REFERENCES shopping_session (id),
    CONSTRAINT events_info_id_fk1
		    FOREIGN KEY (events_info_id) REFERENCES events_info (id) );

/* ----------------------------------------------------------------------------------------------------------------- */
/* CREATE TABLE - Payment Details */



/* ----------------------------------------------------------------------------------------------------------------- */
/* CREATE TABLE - Order Details */



/* ----------------------------------------------------------------------------------------------------------------- */
/* CREATE TABLE - Order Ticket */



/* ----------------------------------------------------------------------------------------------------------------- */