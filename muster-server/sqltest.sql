/* This is an SQL file similar to the Jest testing enviornment
   for the application.  This can be used to experiment with
   the sqlite3 command line tool and develop queries in a more
   common SQL sytax.  It is useful for determining if a
   problem is with Sequelize or SQL.
*/

--Table setup
CREATE TABLE IF NOT EXISTS `Players` (`Name` VARCHAR(255) PRIMARY KEY, `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL);
CREATE TABLE IF NOT EXISTS `Tables` (`Identifier` INTEGER PRIMARY KEY AUTOINCREMENT, `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL);
CREATE TABLE IF NOT EXISTS `Seats` (`PlayerName` VARCHAR(255) PRIMARY KEY REFERENCES `Players` (`Name`) ON DELETE CASCADE ON UPDATE CASCADE, `TableIdentifier` INTEGER NOT NULL DEFAULT 0 REFERENCES `Tables` (`Identifier`) ON DELETE CASCADE ON UPDATE CASCADE, `Position` INTEGER NOT NULL, `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL);
--Table reset
DELETE FROM `Seats`;
DELETE FROM `Tables`;
DELETE FROM `Players`;
--Test data
INSERT INTO `Players`(`Name`, `createdAt`, `updatedAt`) VALUES("Alice", CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO `Players`(`Name`, `createdAt`, `updatedAt`) VALUES("Bob", CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO `Players`(`Name`, `createdAt`, `updatedAt`) VALUES("Charlie", CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO `Tables`(`Identifier`, `createdAt`, `updatedAt`) VALUES(0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO `Seats`(`PlayerName`, `TableIdentifier`, `Position`, `createdAt`, `updatedAt`) VALUES("Alice", 0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO `Seats`(`PlayerName`, `TableIdentifier`, `Position`, `createdAt`, `updatedAt`) VALUES("Bob", 0, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO `Seats`(`PlayerName`, `TableIdentifier`, `Position`, `createdAt`, `updatedAt`) VALUES("Charlie", 0, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
-- Move Bob from the middle seat of at Table 0 to the end.
/* This will move Bob to position 3 and leave position 1 empty. */
SELECT * FROM `Seats`;
UPDATE `Seats`
SET `Position`=(SELECT MAX(`Position`) + 1 FROM `Seats` WHERE `TableIdentifier`=0)
WHERE `PlayerName`="Bob";
SELECT * FROM `Seats`;
-- Renumber the seats to reflect Bob's new position
/* Tables should not have missing positions */
-- First make sure we can select all seats after the one that was cleared
SELECT * FROM `Seats` 
WHERE `Position` >= 1;
--Now decrement their position numbers
UPDATE `Seats`
SET `Position`= `Position`-1
WHERE `Position` > 1;
SELECT * FROM `Seats`
ORDER BY `TableIdentifier` ASC, `Position` ASC;
