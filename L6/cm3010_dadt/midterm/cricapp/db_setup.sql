CREATE TABLE `player` (
	`name` VARCHAR(100),
	PRIMARY KEY (`name`)
);

CREATE TABLE `team` (
	`country_name` VARCHAR(50),
	PRIMARY KEY (`country_name`)
);

CREATE TABLE `match` (
  `match_id` INT NOT NULL AUTO_INCREMENT,
  `team_A` VARCHAR(50) NOT NULL,
  `team_B` VARCHAR(50) NOT NULL,
  `date` DATE NOT NULL,
  `winner` VARCHAR(50),
  `outcome` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`match_id`),
  FOREIGN KEY (`team_A`) REFERENCES `team`(`country_name`) ON DELETE CASCADE,
  FOREIGN KEY (`team_B`) REFERENCES `team`(`country_name`) ON DELETE CASCADE,
  FOREIGN KEY (`winner`) REFERENCES `team`(`country_name`) ON DELETE CASCADE,
  CONSTRAINT unique_match UNIQUE (`team_A`, `team_B`, `date`)
);

CREATE TABLE `delivery` (
  `match_id` INT NOT NULL,
  `innings` INT NOT NULL,
  `over` INT NOT NULL,
  `ball` INT NOT NULL,
  `runs` INT NOT NULL,
  `extras` INT NOT NULL,
  `batter` VARCHAR(50) NOT NULL,
  `bowler` VARCHAR(50) NOT NULL,
  `nonstriker` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`match_id`,`innings`,`over`,`ball`),
  FOREIGN KEY (`match_id`) REFERENCES `match`(`match_id`),
  FOREIGN KEY (`batter`) REFERENCES `player`(`name`),
  FOREIGN KEY (`bowler`) REFERENCES `player`(`name`),
  FOREIGN KEY (`nonstriker`) REFERENCES `player`(`name`)
);

CREATE TABLE `wicket`(
  `playerout` VARCHAR(50) NOT NULL,
  `fielder`VARCHAR(50),
  `kind` VARCHAR(50),
  `match_id` INT NOT NULL,
  `innings` INT,
  `over` INT,
  `ball` INT,
  PRIMARY KEY (`match_id`,`innings`,`over`,`ball`),
  FOREIGN KEY (`match_id`,`innings`,`over`,`ball`) REFERENCES `delivery`(`match_id`,`innings`,`over`,`ball`),
  FOREIGN KEY (`playerout`) REFERENCES `player`(`name`)
);