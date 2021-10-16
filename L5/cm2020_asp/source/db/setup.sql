DROP DATABASE IF EXISTS grades_leaderboard;

CREATE DATABASE IF NOT EXISTS grades_leaderboard CHARACTER SET utf8 COLLATE utf8_general_ci;

USE grades_leaderboard;

DROP TABLE IF EXISTS grades;

DROP TABLE IF EXISTS study_sessions;

DROP TABLE IF EXISTS users;

DROP TABLE IF EXISTS courses;

DROP TABLE IF EXISTS sessions;

DROP TABLE IF EXISTS grade_bins;

DROP VIEW IF EXISTS modules_with_grades;

DROP VIEW IF EXISTS ranked_grades;

DROP VIEW IF EXISTS user_grade_stats;

DROP VIEW IF EXISTS overall_grade_stats;

DROP VIEW IF EXISTS average_grade_stats;

DROP VIEW IF EXISTS top_grade_stats;

DROP VIEW IF EXISTS user_rank;

DROP VIEW IF EXISTS program_kpis;

DROP VIEW IF EXISTS module_stats;

DROP VIEW IF EXISTS user_module_stats;

DROP VIEW IF EXISTS module_grade_bins;

CREATE TABLE `courses` (
	`id` VARCHAR(6),
	`title` VARCHAR(100),
	`level` SMALLINT,
	`credits` SMALLINT,
	`weight` SMALLINT,
	PRIMARY KEY (`id`)
);

INSERT INTO
	courses(id, title, level, credits, weight)
VALUES
	('CM1005', 'Introduction to Programming I', 4, 15, 1),
	('CM1010', 'Introduction to Programming II', 4, 15, 1),
	('CM1015', 'Numerical Mathematics', 4, 15, 1),
	('CM1020', 'Discrete Mathematics', 4, 15, 1),
	('CM1025', 'Fundamentals of Computer Science', 4, 15, 1),
	('CM1030', 'How Computers Work', 4, 15, 1),
	('CM1035', 'Algorithms and Data Structures I', 4, 15, 1),
	('CM1040', 'Web Development', 4, 15, 1),
	('CM2005', 'Object Oriented Programming', 5, 15, 3),
	('CM2010', 'Software Design and Development', 5, 15, 3),
	('CM2015', 'Programming with Data', 5, 15, 3),
	('CM2020', 'Agile Software Projects', 5, 15, 3),
	('CM2025', 'Computer Security', 5, 15, 3),
	('CM2030', 'Graphics Programming', 5, 15, 3),
	('CM2035', 'Algorithms and Data Structures II', 5, 15, 3),
	('CM2040', 'Databases, Networks and the Web', 5, 15, 3),
	('CM3005', 'Data Science', 6, 15, 5),
	('CM3010', 'Databases and Advanced Data Techniques', 6, 15, 5),
	('CM3015', 'Machine Learning and Neural Networks', 6, 15, 5),
	('CM3020', 'Artificial Intelligence', 6, 15, 5),
	('CM3025', 'Virtual Reality', 6, 15, 5),
	('CM3030', 'Games Development', 6, 15, 5),
	('CM3035', 'Advanced Web Development', 6, 15, 5),
	('CM3040', 'Physical Computing and Internet of Things', 6, 15, 5),
	('CM3045', '3D Graphics and Animation', 6, 15, 5),
	('CM3050', 'Mobile Development', 6, 30, 5),
	('CM3055', 'Interaction Design', 6, 15, 5),
	('CM3060', 'Natural Language Processing', 6, 15, 5),
	('CM3070', 'Final Project', 6, 30, 5);


CREATE TABLE `users` (
	`id` VARCHAR(9),
	`name` VARCHAR(50),
	`email` VARCHAR(100),
	`avatar_url` VARCHAR(250),
	PRIMARY KEY (`id`)
);

CREATE TABLE `study_sessions` (
	`id` VARCHAR(5) NOT NULL,
	`title` VARCHAR(50) NOT NULL,
	PRIMARY KEY (`id`)
);

INSERT INTO
	study_sessions(id, title)
VALUES
	('19|04', 'April 2019'),
	('19|10', 'October 2019'),
	('20|04', 'April 2020'),
	('20|10', 'October 2020'),
	('21|04', 'April 2021'),
	('21|10', 'October 2021');

CREATE TABLE `grades` (
	`id` int NOT NULL AUTO_INCREMENT,
	`course_id` VARCHAR(6) NOT NULL,
	`study_session_id` VARCHAR(5) NOT NULL,
	`user_id` VARCHAR(9) NOT NULL,
	`grade` SMALLINT NOT NULL,
	`anonymous` BOOLEAN NOT NULL,
	`created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	PRIMARY KEY (`id`),
	FOREIGN KEY (course_id) REFERENCES courses(id),
	-- only known courses
	FOREIGN KEY (study_session_id) REFERENCES study_sessions(id),
	-- only known study sessions
	UNIQUE KEY `course_user` (`course_id`, `user_id`) -- one grade is allowed per course for any user
);

CREATE TABLE `sessions` (
	`session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
	`expires` int unsigned NOT NULL,
	`data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


INSERT INTO
	grades(
		course_id,
		study_session_id,
		user_id,
		grade,
		anonymous
	)
VALUES
	('CM1005', '19|04', 'UGYTW920K', 100, 0),
	('CM1015', '19|04', 'UGYTW920K', 97, 0),
	('CM1030', '19|04', 'UGYTW920K', 84, 0),
	('CM1040', '19|04', 'UGYTW920K', 61, 1),
	('CM1010', '19|10', 'UGYTW920K', 76, 0),
	('CM1020', '19|10', 'UGYTW920K', 95, 0),
	('CM1025', '19|10', 'UGYTW920K', 95, 0),
	('CM1035', '19|10', 'UGYTW920K', 100, 0),
	('CM2005', '20|04', 'UGYTW920K', 92, 0),
	('CM2035', '20|04', 'UGYTW920K', 96, 0),
	('CM2040', '20|04', 'UGYTW920K', 95, 0),
	('CM1005', '19|04', 'UGYHF87V3', 100, 0),
	('CM1015', '19|04', 'UGYHF87V3', 81, 0),
	('CM1040', '19|04', 'UGYHF87V3', 61, 1),
	('CM1010', '19|04', 'UGYHF87V3', 94, 0),
	('CM1020', '19|04', 'UGYHF87V3', 88, 0),
	('CM1025', '20|04', 'UGYHF87V3', 93, 0),
	('CM1035', '20|04', 'UGYHF87V3', 95, 0),
	('CM1005', '19|04', 'UH047P2KA', 93, 0),
	('CM1015', '19|04', 'UH047P2KA', 88, 0),
	('CM1030', '19|04', 'UH047P2KA', 68, 0),
	('CM1040', '19|04', 'UH047P2KA', 73, 0),
	('CM1010', '19|10', 'UH047P2KA', 77, 0),
	('CM1020', '19|10', 'UH047P2KA', 82, 0),
	('CM1025', '19|10', 'UH047P2KA', 78, 0),
	('CM1035', '19|10', 'UH047P2KA', 86, 0),
	('CM2005', '20|04', 'UH047P2KA', 84, 0),
	('CM2030', '20|04', 'UH047P2KA', 88, 0),
	('CM2035', '20|04', 'UH047P2KA', 78, 0),
	('CM2040', '20|04', 'UH047P2KA', 90, 0),
	('CM1005', '19|04', 'UHQTXAXDW', 100, 0),
	('CM1010', '19|10', 'UHQTXAXDW', 87, 0),
	('CM1015', '19|04', 'UHQTXAXDW', 88, 0),
	('CM1020', '19|10', 'UHQTXAXDW', 97, 0),
	('CM1025', '20|04', 'UHQTXAXDW', 96, 0),
	('CM1035', '19|10', 'UHQTXAXDW', 96, 0),
	('CM1040', '19|10', 'UHQTXAXDW', 74, 0),
	('CM2005', '20|04', 'UHQTXAXDW', 97, 0),
	('CM2035', '20|04', 'UHQTXAXDW', 91, 0),
	('CM2040', '20|04', 'UHQTXAXDW', 92, 0),
	('CM1005', '19|04', 'UGZRDUR1C', 96, 0),
	('CM1015', '19|04', 'UGZRDUR1C', 88, 0),
	('CM1010', '19|10', 'UGZRDUR1C', 81, 0),
	('CM1020', '19|10', 'UGZRDUR1C', 92, 0),
	('CM1025', '19|10', 'UGZRDUR1C', 82, 0),
	('CM1035', '19|10', 'UGZRDUR1C', 86, 0),
	('CM1040', '20|04', 'UGZRDUR1C', 68, 0),
	('CM2005', '20|04', 'UGZRDUR1C', 98, 0),
	('CM2040', '20|04', 'UGZRDUR1C', 93, 0),
	('CM1005', '20|04', 'U00000007', 55, 1),
	('CM1010', '20|04', 'U00000007', 60, 1),
	('CM1015', '20|04', 'U00000007', 90, 0),
	('CM1020', '20|04', 'U00000007', 84, 0);

-- for test to check tie order is correct
INSERT INTO
	grades(
		course_id,
		study_session_id,
		user_id,
		grade,
		anonymous,
		created_at
	)
VALUES
	(
		'CM3070',
		'21|04',
		'U00000005',
		95,
		0,
		'2021-08-05 15:15:23'
	),
	(
		'CM3070',
		'20|04',
		'U00000006',
		95,
		0,
		'2020-08-01 12:10:23'
	);

INSERT INTO
	users(id, name, email, avatar_url)
VALUES
	(
		'UGYTW920K',
		'Alex',
		'alex@something.com',
		'https://ca.slack-edge.com/TDT1N1BUG-UGYTW920K-g219487da2db-512'
	),
	(
		'UGZRDUR1C',
		'Arjun',
		'arjun@muralidharan.org ',
		'https://ca.slack-edge.com/TDT1N1BUG-UGZRDUR1C-6318825681ef-512'
	),
	(
		'UHQTXAXDW',
		'Blair Currey',
		'curreyb88@gmail.com',
		'https://avatars.slack-edge.com/2019-05-21/644070021751_4814ee9d9da3d9d49653_192.jpg'
	),
	(
		'UGYHF87V3',
		'Brad',
		'brad@lazaruk.com',
		'https://secure.gravatar.com/avatar/1f9963bd124c27493e14749e56db5d9f.jpg?s=192&d=https%3A%2F%2Fa.slack-edge.com%2Fdf10d%2Fimg%2Favatars%2Fava_0026-192.png'
	),
	(
		'UH047P2KA',
		'Hayato',
		'mhci1@student.london.ac.uk',
		'https://ca.slack-edge.com/TDT1N1BUG-UH047P2KA-59cb020788e1-512'
	),
	(
		'U00000007',
		'Jane Doe',
		'janeDoe@gmail.com',
		'/assets/media/avatars/150-8.jpg'
	);

/* VIEWS */

CREATE VIEW modules_with_grades AS
SELECT
    grades_leaderboard.grades.course_id AS id,
    grades_leaderboard.courses.title AS title,
    grades_leaderboard.courses.level AS level,
    ROUND(AVG(grades_leaderboard.grades.grade), 0) AS grade
FROM
    grades_leaderboard.grades JOIN 
    grades_leaderboard.courses 
     ON grades_leaderboard.grades.course_id = grades_leaderboard.courses.id
GROUP BY
    grades_leaderboard.grades.course_id;

CREATE VIEW ranked_grades AS
SELECT
	grades_leaderboard.grades.course_id AS course_id,
    grades_leaderboard.users.name AS name,
    grades_leaderboard.grades.grade AS grade,
        rank() OVER (
        PARTITION BY grades_leaderboard.grades.course_id
        ORDER BY
            grades_leaderboard.grades.course_id,
            grades_leaderboard.grades.grade desc
    ) AS ranking,
    grades_leaderboard.grades.anonymous AS anonymous,
    grades_leaderboard.users.avatar_url AS avatar_url
FROM
    grades_leaderboard.grades JOIN 
    grades_leaderboard.users 
    ON grades_leaderboard.grades.user_id = grades_leaderboard.users.id
ORDER BY
    grades_leaderboard.grades.course_id,
    ranking,
    grades_leaderboard.grades.created_at;

CREATE VIEW user_grade_stats AS
SELECT
    g.user_id AS user_id,
    SUM(c.credits) AS total_credits,
    ROUND((SUM(c.credits) / 3.6), 1) AS progress,
    COUNT(g.grade) AS total_grades,
    ROUND(
        (
            SUM((g.grade * c.weight)) / SUM(c.weight)
        ),
        1
    ) AS weighted_grade,
    ROUND(AVG(g.grade), 1) AS average_grade
FROM
    grades_leaderboard.grades g JOIN 
    grades_leaderboard.courses c 
    ON g.course_id = c.id
GROUP BY
    g.user_id
ORDER BY
    weighted_grade desc;

CREATE VIEW average_grade_stats AS
SELECT
    'average' AS average,
    ROUND(AVG(user_grade_stats.total_credits), 1) AS avg_total_credits,
    ROUND(AVG(user_grade_stats.progress), 1) AS avg_progress,
    ROUND(AVG(user_grade_stats.total_grades), 1) AS avg_total_grades,
    ROUND(AVG(user_grade_stats.weighted_grade), 1) AS avg_weighted_grade,
    ROUND(AVG(user_grade_stats.average_grade), 1) AS avg_grade
FROM
    grades_leaderboard.user_grade_stats
WHERE
    grades_leaderboard.user_grade_stats.user_id NOT LIKE 'U0000000%';

CREATE VIEW top_grade_stats AS
SELECT
    'top' AS top,
    ROUND(MAX(user_grade_stats.total_credits), 1) AS top_total_credits,
    ROUND(MAX(user_grade_stats.progress), 1) AS top_progress,
    ROUND(MAX(user_grade_stats.total_grades), 1) AS top_total_grades,
    ROUND(MAX(user_grade_stats.weighted_grade), 1) AS top_weighted_grade,
    ROUND(MAX(user_grade_stats.average_grade), 1) AS top_average_grade
FROM
    grades_leaderboard.user_grade_stats
WHERE
    grades_leaderboard.user_grade_stats.user_id NOT LIKE 'U0000000%';

CREATE VIEW user_rank AS
SELECT
    user_grade_stats.user_id AS user_id,
    ROUND(
        (
            percent_rank() OVER (
                ORDER BY
                    user_grade_stats.weighted_grade
            ) * 100
        ),
        2
    ) AS percentile_rank,
    dense_rank() OVER (
        ORDER BY
            user_grade_stats.weighted_grade desc
    ) AS order_rank
FROM
    grades_leaderboard.user_grade_stats;

CREATE VIEW program_kpis AS
SELECT
    'grades' AS kpi,
    COUNT(0) AS val
FROM
    grades_leaderboard.grades
WHERE
    grades_leaderboard.grades.user_id NOT LIKE 'U0000000%'
UNION ALL
SELECT
    'users' AS kpi,
    COUNT(0) AS val
FROM
    grades_leaderboard.users
WHERE
    grades_leaderboard.users.id NOT LIKE 'U0000000%';
    
CREATE VIEW module_stats AS 
SELECT
	course_id,
    COUNT(grade) AS grades_submitted,
    ROUND(AVG(grade), 0) AS avg_grade
FROM grades
GROUP BY course_id;

CREATE VIEW user_module_stats AS
SELECT
	grades_leaderboard.grades.course_id AS course_id,
	grades_leaderboard.users.id AS user_id,
    grades_leaderboard.grades.grade AS grade,
        RANK() OVER (
        PARTITION BY grades_leaderboard.grades.course_id
        ORDER BY
            grades_leaderboard.grades.course_id,
            grades_leaderboard.grades.grade desc
    ) AS ranking,
    ROUND(
        (
            PERCENT_RANK() OVER (
				PARTITION BY grades_leaderboard.grades.course_id
                ORDER BY
                    grades_leaderboard.grades.grade
            ) * 100
        ),
        2
    ) AS percentile
FROM
    grades_leaderboard.grades JOIN 
    grades_leaderboard.users 
    ON grades_leaderboard.grades.user_id = grades_leaderboard.users.id
ORDER BY
    grades_leaderboard.grades.course_id;

CREATE VIEW module_grade_bins AS
SELECT c.id AS course_id, gb.grade_bin, COUNT(rg.course_id) AS count
FROM (SELECT 40 AS grade_bin UNION ALL
      SELECT 45 AS grade_bin UNION ALL
      SELECT 50 AS grade_bin UNION ALL
      SELECT 55 AS grade_bin UNION ALL
      SELECT 60 AS grade_bin UNION ALL
      SELECT 65 AS grade_bin UNION ALL
      SELECT 70 AS grade_bin UNION ALL
      SELECT 75 AS grade_bin UNION ALL
      SELECT 80 AS grade_bin UNION ALL
      SELECT 85 AS grade_bin UNION ALL
      SELECT 90 AS grade_bin UNION ALL
      SELECT 95 AS grade_bin UNION ALL
      SELECT 100 AS grade_bin
     ) gb CROSS JOIN
     courses c LEFT JOIN
     ranked_grades rg
     ON rg.course_id = c.id AND
        rg.grade >= gb.grade_bin AND
        rg.grade < gb.grade_bin + 5
GROUP BY c.id, gb.grade_bin;