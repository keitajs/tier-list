SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

CREATE DATABASE IF NOT EXISTS `tier-list` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `tier-list`;

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(128) NOT NULL,
  `email` varchar(128) NOT NULL,
  `password` varchar(128) NOT NULL,
  `avatar` varchar(256) NOT NULL DEFAULT 'dummy.png',
  `status` int(11) DEFAULT 0,
  `accessToken` varchar(256) DEFAULT NULL,
  `verifyToken` varchar(64) DEFAULT NULL,
  `registerDate` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

CREATE TABLE `lists` (
  `id` int(11) NOT NULL,
  `name` varchar(128) NOT NULL,
  `description` varchar(256) NOT NULL DEFAULT '',
  `status` int(1) NOT NULL DEFAULT 1,
  `private` tinyint(1) NOT NULL DEFAULT 1,
  `userId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(32) DEFAULT NULL,
  `position` int(11) DEFAULT NULL,
  `color` varchar(32) DEFAULT '#ffffff',
  `listId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

CREATE TABLE `characters` (
  `id` int(11) NOT NULL,
  `name` varchar(256) NOT NULL,
  `position` int(11) NOT NULL,
  `url` varchar(512) DEFAULT NULL,
  `image` varchar(512) NOT NULL,
  `categoryId` int(11) NOT NULL,
  `animeId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

CREATE TABLE `animes` (
  `id` int(11) NOT NULL,
  `title` varchar(256) NOT NULL,
  `url` varchar(512) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

CREATE TABLE `permissions` (
  `value` int(1) NOT NULL DEFAULT 1,
  `userId` int(11) NOT NULL,
  `listId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

CREATE TABLE `updates` (
  `id` int(11) NOT NULL,
  `count` int(11) NOT NULL DEFAULT 1,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `userId` int(11) NOT NULL,
  `listId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

ALTER TABLE `animes`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `listId` (`listId`);

ALTER TABLE `characters`
  ADD PRIMARY KEY (`id`),
  ADD KEY `categoryId` (`categoryId`),
  ADD KEY `animeId` (`animeId`);

ALTER TABLE `lists`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`);

ALTER TABLE `permissions`
  ADD PRIMARY KEY (`userId`,`listId`),
  ADD KEY `listId` (`listId`);

ALTER TABLE `updates`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`),
  ADD KEY `listId` (`listId`);

ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `animes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `characters`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `lists`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `updates`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `categories`
  ADD CONSTRAINT `categories_ibfk_1` FOREIGN KEY (`listId`) REFERENCES `lists` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `characters`
  ADD CONSTRAINT `characters_ibfk_1` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `characters_ibfk_2` FOREIGN KEY (`animeId`) REFERENCES `animes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `lists`
  ADD CONSTRAINT `lists_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `permissions`
  ADD CONSTRAINT `permissions_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `permissions_ibfk_2` FOREIGN KEY (`listId`) REFERENCES `lists` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `updates`
  ADD CONSTRAINT `updates_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `updates_ibfk_2` FOREIGN KEY (`listId`) REFERENCES `lists` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;