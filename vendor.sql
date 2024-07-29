-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 04, 2024 at 05:09 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `GA_login`
--
CREATE DATABASE IF NOT EXISTS `vendor` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `vendor`;

-- --------------------------------------------------------

--
-- Table structure for table `vendors`
--

-- Create Vendors table
CREATE TABLE `vendors` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `canteen` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `menu_items` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `vendor_id` INT(11) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`vendor_id`) REFERENCES `vendors`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `vendors`
--

INSERT INTO `vendors` (`name`, `canteen`) VALUES
('Mixed & Rice Store', 'north'),
('Fishball Noodle Store', 'north'),
('Western Store', 'north'),
('Yong Tau Foo Store', 'south'),
('Mala Store', 'south'),
('Chicken Rice Store', 'south'),
('Western Store', 'trcc'),
('Drinks Store', 'trcc'),
('Snack Store', 'trcc'),
('Healthy Bowl', 'lawn'),
('Choose Your Pasta Store', 'lawn'),
('Korean Fried Chicken Store', 'lawn');

INSERT INTO `menu_items` (`vendor_id`, `name`) VALUES
(1, '1 Meat + 1 Veg'),
(1, '2 Meat + 1 Veg'),
(1, '2 Meat + 2 Veg'),
(2, 'Fishball Noodle Soup'),
(2, 'Minced Meat Noodle Dry'),
(2, 'Laksa Noodle'),
(3, 'Chicken Chop'),
(3, 'Chicken Cutlet'),
(3, 'Fish n Chips'),
(4, 'Noodle plus 6 random item'),
(4, 'Rice plus 6 random item'),
(4, 'Dry Noodle plus 6 random item'),
(5, 'Noodle with 6 random item'),
(5, 'Spicy'),
(5, 'Not Spicy'),
(6, 'Chicken rice'),
(6, 'Chicken slices with Noodle'),
(6, 'Chicken rice plus egg'),
(7, 'Chicken Chop'),
(7, 'Chicken Cutlet'),
(7, 'Fish n Chips'),
(8, 'Coffee'),
(8, 'Milk tea'),
(8, 'Green Tea'),
(9, 'Chicken bites'),
(9, 'Cheese Fries'),
(9, 'Fish finger'),
(10, 'Salad Bowl'),
(10, 'Salad Bowl with Pasta'),
(10, 'creamy egg'),
(11, 'Tomato Pasta'),
(11, 'Carbonara Pasta'),
(11, 'Aglio Olio Pasta'),
(12, '3 Pieces Boneless Chicken'),
(12, '2 Pieces Boneless Chicken'),
(12, '3 Pieces of Fried Chicken');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `vendors`
--
-- No additional ALTER TABLE statements for primary keys needed

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `vendors`
--
ALTER TABLE `vendors`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
ALTER TABLE `menu_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;


