-- Clean-up
-- ALTER TABLE user_activity DROP FOREIGN KEY user_id;
-- ALTER TABLE user_activity DROP FOREIGN KEY activity_id;
DROP TABLE IF EXISTS user_activity;
DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS activity;

-- Creation
CREATE TABLE user (
	id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
	email VARCHAR(48),
	user_name VARCHAR(48),
	first_name VARCHAR(48),
	last_name VARCHAR(48),
	birth_date DATE,
	password VARCHAR(128),
	created_at DATETIME,
	updated_at DATETIME
);

CREATE TABLE activity (
	id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(96),
	slug VARCHAR(96),
	color VARCHAR(6)
);

CREATE TABLE user_activity (
	id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
	slug VARCHAR(96),
	expertise VARCHAR(10),
	user_id INTEGER NOT NULL,
	activity_id INTEGER NOT NULL,

	FOREIGN KEY(user_id) REFERENCES user(id),
	FOREIGN KEY(activity_id) REFERENCES activity(id)
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
INSERT INTO activity(name,slug,color) VALUES('Yoga','yoga','60607f'),('Tricot','tricot','a0a040'),('Guérilla','guerilla','ff0000'),('Cinéma','cinema','40a0bf');
