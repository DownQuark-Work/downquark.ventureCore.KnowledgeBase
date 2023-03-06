CREATE SCHEMA `+mockmydb`;

CREATE SCHEMA `-mockmydb`;

CREATE SCHEMA `@`;

CREATE TABLE `+mockmydb`.`[Account] Users` (
  `id` int PRIMARY KEY AUTO_INCREMENT COMMENT '@initial',
  `created` datetime DEFAULT (now()),
  `username` varchar(18) UNIQUE NOT NULL,
  `email` varchar(30) UNIQUE NOT NULL
);

CREATE TABLE `+mockmydb`.`[Content] Avatars` (
  `id` int PRIMARY KEY COMMENT 'A one to one mapping on the id makes these keys identical',
  `color_bg` varchar(15) COMMENT 'any valid css value will work `#900`, `rgba(50,33,62,.8)`, etc',
  `color_content` varchar(15) COMMENT 'any valid css value will work `#900`, `rgba(50,33,62,.8)`, etc',
  `content` tinytext COMMENT 'defaults to a random emoji'
);

CREATE TABLE `+mockmydb`.`[Content] Comment` (
  `apply_to` int COMMENT 'this is the `id` of the item the comment was is directed towards',
  `apply_to_type` ENUM ('user', 'pet') DEFAULT null COMMENT '> `null` is when a comment is replying to another comment',
  `reply_to` int PRIMARY KEY AUTO_INCREMENT COMMENT 'this is the `id` of the current comment',
  `commenter` int,
  `comment` varchar(255) NOT NULL,
  `created` datetime DEFAULT (now()),
  `edited` datetime DEFAULT null COMMENT 'will aggregate as a special character if `true`',
  PRIMARY KEY (`apply_to`, `apply_to_type`)
);

CREATE TABLE `+mockmydb`.`[Content] Comment::Revisions` (
  `comment_id` int UNIQUE NOT NULL COMMENT 'many-to-one allows grabbing all revisions with single key',
  `revised_at` datetime COMMENT 'will be CC.edited OR CC.created depending on revision amount',
  `comment_before_revision` varchar(255) NOT NULL
);

CREATE TABLE `+mockmydb`.`[Content] Pets` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `type` ENUM ('dog', 'cat', 'goldfish', 'rock') DEFAULT null COMMENT '> `null` is when user has no pet',
  `name` varchar(12),
  `age` tinyint(2)
);

CREATE TABLE `+mockmydb`.`[join] User:Friend:Type` (
  `user` int,
  `friend` int,
  `type` ENUM ('friend', 'family', 'frenemy') COMMENT '> `frenemy` is member who was blocked or removed from friends/family list'
);

CREATE TABLE `+mockmydb`.`[join] User:Pet` (
  `user` int,
  `pet` int
);

CREATE TABLE `-mockmydb`.`[Account] Users` (
  `id` uuid PRIMARY KEY,
  `username` varchar(18) UNIQUE NOT NULL,
  `email` varchar(30) UNIQUE NOT NULL
);

CREATE TABLE `-mockmydb`.`[Content] Avatars` (
  `id` uuid PRIMARY KEY COMMENT 'A one to one mapping on the id makes these keys identical
\'No reason to have the avatar a separate commentable entity. Comment on the avatar and it shows up as a comment to the user.\'',
  `color_bg` varchar(15) COMMENT 'any valid css value will work `#900`, `rgba(50,33,62,.8)`, etc',
  `color_content` varchar(15) COMMENT 'any valid css value will work `#900`, `rgba(50,33,62,.8)`, etc',
  `content` tinytext COMMENT 'defaults to a random emoji'
);

CREATE TABLE `-mockmydb`.`[Content] Comment` (
  `apply_to` uuid COMMENT 'apply_to_type is no longer needed since uuid is unique',
  `reply_to` uuid COMMENT 'this is the `id` of the current comment',
  `commenter` uuid,
  `comment` varchar(255) NOT NULL,
  `created` datetime DEFAULT (now()),
  `edited_count` tinyint(2) DEFAULT null COMMENT 'aggregate will display amount of times the comment was edited. No other info leakable
[@ aggregate rule]sql::
  SELECT COUNT(comment_id) as `edited_count`
  FROM "[+Content] Comment::Revisions"
  WHERE comment_id = apply_to
[@]',
  PRIMARY KEY (`apply_to`)
);

CREATE TABLE `-mockmydb`.`[Content] Pets` (
  `id` uuid PRIMARY KEY,
  `type` ENUM ('dog', 'cat', 'goldfish', 'rock') DEFAULT null COMMENT '> `null` is when user has no pet',
  `name` varchar(12),
  `age` tinyint(2)
);

CREATE TABLE `-mockmydb`.`[join] User:Friend:Type` (
  `user` uuid,
  `friend` uuid,
  `type` ENUM ('friend', 'family', 'frenemy')
);

CREATE TABLE `-mockmydb`.`[aggregate] Individual:Family` (
  `individual` uuid PRIMARY KEY,
  `@aggregate` ruleset COMMENT '[
     [sql::
       SELECT user as ind,GROUP_CONCAT(pet) as fam
       FROM `[+join] User:Pet`
       GROUP_CONCAT(pet)] => humans
     [sql::
       SELECT pet as ind,GROUP_CONCAT(user) as fam
       FROM `[+join] User:Pet`
       GROUP_CONCAT(pet)] => pets
    [js::
      (humans,pets) => [..humans,...pets]]',
  `family` mediumtext COMMENT 'this will be a stringified json value of all other
owners and pets associated with the queried individual
(basically, the result of running and parsing teh join query from the write db)'
);

CREATE TABLE `@`.`[cnfg] Project` (
  `PROJECT_DEFAULT_OVERRIDES` @ DEFAULT "applies to all tables and fields",
  `RANGE_ALLOWS_NULL` @ DEFAULT "[5..12]" COMMENT 'range values should follow rust syntax',
  `MOCK_ORDER` @ DEFAULT "([+]-[-]-[graph])" COMMENT 'parenthesis allow for more dynamic 
`([+]-[-]-[graph])` is equivalent to `([+]-[-])([-]-[graph])`
but the primary could also be used to populate the db: `([+]-[-])([+]-[graph])`
or the primary  starts and the secondary creates more mutations after the primary:
  `([+]-[-])([+]-[graph])([-]-[graph])`',
  `[+]-[-]` any_writedb_to_readdb_changes COMMENT 'would be defined here',
  `[-]-[graph]` any_read_db_to_graphdb_changes COMMENT 'would be defined here',
  `[+]-[graph]` any_write_db_to_graphdb_changes COMMENT 'would be defined here',
  `@varchar` @ COMMENT 'this will match all fields with a varchar of ANY length',
  `@varchar(100)` @ COMMENT 'this will match all fields with a varchar ONLY if the length is 100'
);

CREATE TABLE `@`.`[cnfg] Database` (
  `mock-order` int DEFAULT "([+]-[-]-[graph])" COMMENT 'parenthesis allow for more dynamic 
`([+]-[-]-[graph])` is equivalent to `([+]-[-])([-]-[graph])`
but the primary could also be used to populate the db: `([+]-[-])([+]-[graph])`
or the primary  starts and the secondary creates more mutations after the primary:
  `([+]-[-])([+]-[graph])([-]-[graph])`',
  `[+]-[-]` any_writedb_to_readdb_changes COMMENT 'would be defined here',
  `[-]-[graph]` any_read_db_to_graphdb_changes COMMENT 'would be defined here',
  `[+]-[graph]` any_write_db_to_graphdb_changes COMMENT 'would be defined here'
);

CREATE TABLE `@`.`[Named-Overide] Girl-Power` (
  `name` fakerjs_definitions_person DEFAULT "female_prefix",
  `first_name` fakerjs_definitions_person DEFAULT "female_first_name",
  `last_name` fakerjs_definitions_person DEFAULT "female_first_name"
);

CREATE TABLE `@`.`[graph] structure` (
  `type` ENUM ('undirected', 'directed', 'directed_acyclic_graph') DEFAULT "undirected",
  `vertex` ENUM ('user', 'pet') DEFAULT ""[-Account] Users","[-join] User:Friend:Type"",
  `edge` ENUM ('enum_type_friend', 'enum_type_pet') DEFAULT ""[-Account] Pets""
);

CREATE INDEX `fk_comment_creator` ON `+mockmydb`.`[Content] Comment` (`commenter`);

CREATE INDEX `fk_comment_creator` ON `-mockmydb`.`[Content] Comment` (`commenter`);

ALTER TABLE `[Content] Avatars` COMMENT = 'DBML IS NOT applying the schema name to table notes - for now just harcode where needed. then fix it in ';

ALTER TABLE `[Content] Comment` COMMENT = '
    if this table had any fields that matched what is defined below
    [@][Named-Overide] Girl-Power[@]
    then they would have the new overrides attached to their account as well
  ';

ALTER TABLE `[Content] Avatars` COMMENT = 'This is a note of this tableTESTING';

ALTER TABLE `[cnfg] Database` COMMENT = 'db to db changes can ONLY affect a lower priority db (as defined on the `database-flow` key)';

ALTER TABLE `[graph] structure` COMMENT = '
    this is still somewhat TBD until the logic can be created
    should give some sort of intuitive structure to allow automated graphdb instantiation
  ';

ALTER TABLE `+mockmydb`.`[Content] Avatars` ADD FOREIGN KEY (`id`) REFERENCES `+mockmydb`.`[Account] Users` (`id`);

ALTER TABLE `+mockmydb`.`[Content] Comment` ADD FOREIGN KEY (`commenter`) REFERENCES `+mockmydb`.`[Account] Users` (`id`);

ALTER TABLE `+mockmydb`.`[Content] Comment::Revisions` ADD FOREIGN KEY (`comment_id`) REFERENCES `+mockmydb`.`[Content] Comment` (`reply_to`);

ALTER TABLE `+mockmydb`.`[join] User:Friend:Type` ADD FOREIGN KEY (`user`) REFERENCES `+mockmydb`.`[Account] Users` (`id`);

ALTER TABLE `+mockmydb`.`[join] User:Friend:Type` ADD FOREIGN KEY (`friend`) REFERENCES `+mockmydb`.`[Account] Users` (`id`);

ALTER TABLE `+mockmydb`.`[join] User:Pet` ADD FOREIGN KEY (`user`) REFERENCES `+mockmydb`.`[Account] Users` (`id`);

ALTER TABLE `+mockmydb`.`[join] User:Pet` ADD FOREIGN KEY (`pet`) REFERENCES `+mockmydb`.`[Content] Pets` (`id`);

ALTER TABLE `-mockmydb`.`[Content] Avatars` ADD FOREIGN KEY (`id`) REFERENCES `-mockmydb`.`[Account] Users` (`id`);

ALTER TABLE `-mockmydb`.`[Content] Comment` ADD FOREIGN KEY (`commenter`) REFERENCES `-mockmydb`.`[Account] Users` (`id`);

ALTER TABLE `-mockmydb`.`[join] User:Friend:Type` ADD FOREIGN KEY (`user`) REFERENCES `-mockmydb`.`[Account] Users` (`id`);

ALTER TABLE `-mockmydb`.`[join] User:Friend:Type` ADD FOREIGN KEY (`friend`) REFERENCES `-mockmydb`.`[Account] Users` (`id`);

ALTER TABLE `-mockmydb`.`[aggregate] Individual:Family` ADD FOREIGN KEY (`individual`) REFERENCES `-mockmydb`.`[Account] Users` (`id`);

ALTER TABLE `-mockmydb`.`[aggregate] Individual:Family` ADD FOREIGN KEY (`individual`) REFERENCES `-mockmydb`.`[Content] Pets` (`id`);
