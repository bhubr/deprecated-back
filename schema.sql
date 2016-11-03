-- Clean-up
-- ALTER TABLE user_activity DROP FOREIGN KEY user_id;
-- ALTER TABLE user_activity DROP FOREIGN KEY activity_id;
DROP TABLE IF EXISTS user;

-- Creation
CREATE TABLE user (
	id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
	email VARCHAR(48),
	user_name VARCHAR(48),
	first_name VARCHAR(48),
	last_name VARCHAR(48),
	birth_date DATE,
	password VARCHAR(128),
	status ENUM('new', 'confirmed', 'inactive', 'banned', 'scheduled_for_deletion') DEFAULT 'new',
	created_at DATETIME,
	updated_at DATETIME
);
CREATE TABLE token(
	id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
	value VARCHAR(32),
	usage_for VARCHAR(24),
	validity SMALLINT NOT NULL,
	used BOOLEAN NOT NULL DEFAULT FALSE,
	user_id INTEGER NOT NULL,
	created_at DATETIME,
	updated_at DATETIME,

	FOREIGN KEY(user_id) REFERENCES user(id)
);

INSERT INTO user(first_name,last_name,birth_date) VALUES('Benoit','Hubert','1978-05-30'),('Che','Guevara','1943-07-02'),('Emma','Watson','1990-04-15');
