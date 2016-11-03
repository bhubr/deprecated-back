DROP TABLE IF EXISTS user_activity;
DROP TABLE IF EXISTS activity;

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


INSERT INTO activity(name,slug,color) VALUES('Yoga','yoga','60607f'),('Tricot','tricot','a0a040'),('Guérilla','guerilla','ff0000'),('Cinéma','cinema','40a0bf');
