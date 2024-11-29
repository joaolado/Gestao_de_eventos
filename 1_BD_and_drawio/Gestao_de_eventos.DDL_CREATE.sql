
/* CREATE DATABASE - Event Management */

CREATE DATABASE Gestao_de_eventos;

/* ----------------------------------------------------------------------------------------------------------------- */
/* CREATE TABLE - Users Address */

CREATE TABLE users_address (
    id SERIAL PRIMARY KEY,
    address_line1 VARCHAR(250),
    address_line2 VARCHAR(250),
    postal_code VARCHAR(20),
    city VARCHAR(50),
    region VARCHAR(50),
    country VARCHAR(50),
    PRIMARY KEY (id) );

/* ----------------------------------------------------------------------------------------------------------------- */
/* CREATE TABLE - Users */

CREATE TYPE user_type AS ENUM0 ('UserClient', 'UserAdmin', 'UserSuperAdmin');

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    profile_pic VARCHAR(250),
    user_name VARCHAR(100) NOT NULL,
    user_password VARCHAR(250) NOT NULL,
    status user_type DEFAULT 'UserClient',
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
/* CREATE TABLE - Users Payments */

CREATE TABLE users_payments (
    id SERIAL PRIMARY KEY,
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
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    description VARCHAR(250),
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (id) );

/* ----------------------------------------------------------------------------------------------------------------- */
/* CREATE TABLE - Events */

CREATE TYPE status_events AS ENUM1 ('Active', 'Scheduled', 'Completed', 'Cancelled');

CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    name VARCHAR(250),
    description VARCHAR(500),
    cover VARCHAR(250),
    start_date DATETIME,
    end_date DATETIME,
    capacity INT,
    address_line1 VARCHAR(250),
    address_line2 VARCHAR(250),
    postal_code VARCHAR(20),
    city VARCHAR(50),
    region VARCHAR(50),
    country VARCHAR(50),
    category_id INT,
    status status_events DEFAULT 'Scheduled',
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (id),
    CONSTRAINT category_fk1
        FOREIGN KEY (category_id) REFERENCES events_category (id) );

/* ----------------------------------------------------------------------------------------------------------------- */
/* CREATE TABLE - Tickets Type */

CREATE TYPE status_tickets_type AS ENUM2 ('Active', 'Disabled');

CREATE TABLE tickets_type (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    description VARCHAR(250),
    status status_tickets_type DEFAULT 'Active',
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (id) );

/* ----------------------------------------------------------------------------------------------------------------- */
/* CREATE TABLE - Tickets Info */

CREATE TYPE status_tickets_info AS ENUM3 ('Available', 'Sold Out', 'Coming Soon');

CREATE TABLE tickets_info (
    id SERIAL PRIMARY KEY,
    events_id INT,
    tickets_type_id INT,
    SKU VARCHAR(250),
    price DECIMAL(10, 2),
    quantity INT,
    status status_tickets_info DEFAULT 'Available',
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
    id SERIAL PRIMARY KEY,
    tickets_info_id INT,
    quantity INT,
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT tickets_info_fk1
		    FOREIGN KEY (tickets_info_id) REFERENCES tickets_info (id) );

/* ----------------------------------------------------------------------------------------------------------------- */
/* CREATE TABLE - Order Details */

CREATE TYPE status_on_cart AS ENUM4 ('Active', 'Scheduled', 'Cancelled');
CREATE TYPE status_order_details AS ENUM5 ('Pending', 'Completed', 'Cancelled');

CREATE TABLE order_details (
    id SERIAL PRIMARY KEY,
    users_id INT,
    ordered_tickets_id INT,
    order_total DECIMAL(10, 2),
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status status_on_cart DEFAULT 'Scheduled',
    status status_order_details DEFAULT 'Pending',
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT users_fk2
		    FOREIGN KEY (users_id) REFERENCES users (id),
    CONSTRAINT ordered_tickets_fk2
		    FOREIGN KEY (ordered_tickets_id) REFERENCES ordered_tickets (id) );

/* ----------------------------------------------------------------------------------------------------------------- */
/* CREATE TABLE - Payment Details */

     status_payment_details AS ENUM6 ('Paid', 'Failed', 'Refunded');

CREATE TABLE payment_details (
    id SERIAL PRIMARY KEY,
    order_id INT,
    users_payments_id INT,
    payment_amount DECIMAL(10, 2),
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status status_payment_details DEFAULT  'Paid',
    PRIMARY KEY (id),
    CONSTRAINT order_fk1
		    FOREIGN KEY (order_id) REFERENCES order_details (id),
    CONSTRAINT users_payments_fk2
		    FOREIGN KEY (users_payments_id) REFERENCES users_payments (id) );

/* ----------------------------------------------------------------------------------------------------------------- */
/* CREATE TABLE - Shared Events */

CREATE TABLE shared_events (
    id SERIAL PRIMARY KEY,
    sender_id INT,
    receiver_id INT,
    event_id INT,
    message VARCHAR(250),
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (id),
    CONSTRAINT sender_fk1
		    FOREIGN KEY (sender_id) REFERENCES users (id),
    CONSTRAINT receiver_fk2
		    FOREIGN KEY (receiver_id) REFERENCES users (id),
    CONSTRAINT event_fk3
		    FOREIGN KEY (event_id) REFERENCES events (id) );

/* ----------------------------------------------------------------------------------------------------------------- */