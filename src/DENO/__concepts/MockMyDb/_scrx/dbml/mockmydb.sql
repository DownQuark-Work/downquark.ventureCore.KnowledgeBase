-- SQL dump generated using DBML (dbml-lang.org)
-- Database: MySQL
-- Generated at: 2023-03-12T06:57:41.531Z

CREATE SCHEMA `MockDbWrite`;

CREATE SCHEMA `MockDbAggregate`;

CREATE SCHEMA `[@ARANGO]Graph`;

CREATE SCHEMA `[@]`;

CREATE SCHEMA `[@Name]`;

CREATE TABLE `MockDbWrite`.`Users` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `created` datetime DEFAULT (now()),
  `username` varchar(18) UNIQUE NOT NULL,
  `email` varchar(30) UNIQUE NOT NULL,
  `infoForMockDbUseOnly` blob COMMENT '@INITIAL - anything else can be added'
);

CREATE TABLE `MockDbWrite`.`Comment` (
  `apply_to` int COMMENT 'this is the `id` of the item the comment was is directed towards',
  `apply_to_type` ENUM ('user', 'pet') DEFAULT null COMMENT '> `null` is when a comment is replying to another comment',
  `reply_to` int PRIMARY KEY AUTO_INCREMENT COMMENT 'this is the `id` of the current comment',
  `commenter` int,
  `comment` varchar(255) NOT NULL,
  `created` datetime DEFAULT (now()),
  `edited` datetime DEFAULT null COMMENT 'will aggregate as a special character if `true`',
  `applyingGirlPower` set in the note COMMENT 'if this table had any fields that matched what is defined with the at rule: [@APPLY Girl-Power]'
);

CREATE TABLE `MockDbWrite`.`Comment»Revisions` (
  `comment_id` int UNIQUE NOT NULL COMMENT 'many-to-one allows grabbing all revisions with single key',
  `revised_at` datetime COMMENT 'will be WC.edited OR WC.created depending on revision amount',
  `comment_before_revision` varchar(255) NOT NULL
);

CREATE TABLE `MockDbWrite`.`Pets` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `type` ENUM ('dog', 'cat', 'goldfish', 'rock') DEFAULT null COMMENT '> `null` is when user has no pet',
  `name` varchar(12),
  `age` tinyint(2)
);

CREATE TABLE `MockDbWrite`.`User>Friend>Type` (
  `user` int,
  `friend` int,
  `type` ENUM ('friend', 'family', 'frenemy') COMMENT '> `frenemy` is member who was blocked or removed from friends/family list'
);

CREATE TABLE `MockDbWrite`.`User>Pet` (
  `user` int,
  `pet` int
);

CREATE TABLE `MockDbAggregate`.`Users` (
  `id` uuid PRIMARY KEY,
  `username` varchar(18) UNIQUE NOT NULL,
  `email` varchar(30) UNIQUE NOT NULL
);

CREATE TABLE `MockDbAggregate`.`Comment` (
  `apply_to` uuid COMMENT 'apply_to_type is no longer needed since uuid is unique',
  `reply_to` uuid PRIMARY KEY COMMENT 'this is the `id` of the current comment',
  `commenter` varchar(18) COMMENT 'match commenter name based on row number of write db
[@AGGREGATE
  agg = MockDbWrite.Users.filter(com => MockDbWrite.Users.id === com.commenter) // go from here
  _OR_ (not sure which will be the easiest)
  SELECT "username"
    FROM "MockDbWrite"."Users"
    WHERE "MockDbWrite".ROWNUM() = COUNT("MockDbAggregate"."Comment"."reply_to")
    ]',
  `comment` varchar(255) NOT NULL,
  `created` datetime DEFAULT (now()),
  `edited_count` tinyint(2) DEFAULT 0 COMMENT 'aggregate will display amount of times the comment was edited. No other info leakable
[@AGGREGATE
  SELECT COUNT(comment_id) as `edited_count`
  FROM "[+Content] Comment»Revisions"
  WHERE comment_id = reply_to
]'
);

CREATE TABLE `MockDbAggregate`.`Acquaintances` (
  `uuid` uuid PRIMARY KEY COMMENT 'User or Pet UUID',
  `humanimals` varchar(255) COMMENT 'array of human names, OR name and type of pet -- Array<USER_NAME|Array<PET_TYPE,PET_NAME>>',
  `frens` varchar(255) COMMENT 'UUID[]'
);

CREATE TABLE `[@ARANGO]Graph`.`BadBlood` (
  `type` ENUM ('undirected', 'directed', 'directed_acyclic_graph') DEFAULT "undirected" COMMENT 'ArangoDB type databases MUST implement _only_ the `type`, `vertex`, and `edge` keys.
Create Composite keys to allow Bridge to work successfully',
  `human` uuid,
  `pet` uuid,
  `frenemy` uuid
);

CREATE TABLE `[@]`.`Project` (
  `PROJECT_DEFAULT_OVERRIDES` [@] DEFAULT "applies to all tables and fields" COMMENT 'db to db changes can ONLY affect a lower priority db (as defined on the `database-flow` key)',
  `RANGE_ALLOWS_NULL` [@] DEFAULT "[5..12]" COMMENT 'range values should follow rust syntax',
  `[+]-[-]` any_MockDbWrite_to_readdb_changes COMMENT 'would be defined here',
  `[-]-[graph]` any_read_db_to_graphdb_changes COMMENT 'would be defined here',
  `[+]-[graph]` any_write_db_to_graphdb_changes COMMENT 'would be defined here'
);

CREATE TABLE `[@Name]`.`Girl-Power` (
  `name` fakerjs_definitions_person DEFAULT "female_prefix",
  `first_name` fakerjs_definitions_person DEFAULT "female_first_name",
  `last_name` fakerjs_definitions_person DEFAULT "female_first_name"
);

CREATE INDEX `fk_comment_creator` ON `MockDbWrite`.`Comment` (`commenter`);

CREATE INDEX `fk_comment_creator` ON `MockDbAggregate`.`Comment` (`commenter`);

CREATE INDEX `@vertex` ON `[@ARANGO]Graph`.`BadBlood` (`human`, `pet`);

CREATE INDEX `@edge` ON `[@ARANGO]Graph`.`BadBlood` (`human`, `frenemy`);

ALTER TABLE `MockDbWrite`.`Comment` ADD FOREIGN KEY (`apply_to`) REFERENCES `MockDbWrite`.`Comment` (`reply_to`);

ALTER TABLE `MockDbWrite`.`Comment` ADD FOREIGN KEY (`commenter`) REFERENCES `MockDbWrite`.`Users` (`id`);

ALTER TABLE `MockDbWrite`.`Comment»Revisions` ADD FOREIGN KEY (`comment_id`) REFERENCES `MockDbWrite`.`Comment` (`reply_to`);

ALTER TABLE `MockDbWrite`.`User>Friend>Type` ADD FOREIGN KEY (`user`) REFERENCES `MockDbWrite`.`Users` (`id`);

ALTER TABLE `MockDbWrite`.`User>Friend>Type` ADD FOREIGN KEY (`friend`) REFERENCES `MockDbWrite`.`Users` (`id`);

ALTER TABLE `MockDbWrite`.`User>Pet` ADD FOREIGN KEY (`user`) REFERENCES `MockDbWrite`.`Users` (`id`);

ALTER TABLE `MockDbWrite`.`User>Pet` ADD FOREIGN KEY (`pet`) REFERENCES `MockDbWrite`.`Pets` (`id`);

ALTER TABLE `MockDbAggregate`.`Users` ADD CONSTRAINT `[@bridge id_to_uuid]` FOREIGN KEY (`id`) REFERENCES `MockDbWrite`.`Users` (`id`);

ALTER TABLE `MockDbAggregate`.`Users` ADD FOREIGN KEY (`id`) REFERENCES `MockDbAggregate`.`Acquaintances` (`uuid`);

ALTER TABLE `MockDbAggregate`.`Comment` ADD FOREIGN KEY (`apply_to`) REFERENCES `MockDbAggregate`.`Comment` (`reply_to`);

ALTER TABLE `MockDbAggregate`.`Comment` ADD FOREIGN KEY (`commenter`) REFERENCES `MockDbAggregate`.`Users` (`username`);

ALTER TABLE `[@ARANGO]Graph`.`BadBlood` ADD CONSTRAINT `[@bridge graph_edge]` FOREIGN KEY (`human`, `frenemy`) REFERENCES `MockDbAggregate`.`Acquaintances` (`uuid`, `frens`);

ALTER TABLE `[@ARANGO]Graph`.`BadBlood` ADD CONSTRAINT `[@bridge graph_vertex]` FOREIGN KEY (`human`, `pet`) REFERENCES `MockDbAggregate`.`Acquaintances` (`uuid`, `humanimals`);
