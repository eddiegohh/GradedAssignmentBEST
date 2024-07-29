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
CREATE DATABASE IF NOT EXISTS `GA_login` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `GA_login`;

-- --------------------------------------------------------

--
-- Table structure for table `students`
--

CREATE TABLE `users` (
  `username` VARCHAR(88) NOT NULL,
  `email` VARCHAR(88) NOT NULL,
  `password` VARCHAR(88) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `vendors` (
  `username` VARCHAR(88) NOT NULL,
  `email` VARCHAR(88) NOT NULL,
  `password` VARCHAR(88) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`username`, `email`, `password`) VALUES
('Peter', '23008695@myrp.edu.sg', '12345'),
('Ah tock', '23006321@myrp.edu.sg', '12345');

INSERT INTO `vendors` (`username`, `email`, `password`) VALUES
('Limpeh', 'vendor1@myrp.edu.sg', '12345'),
('eric', 'vendor2@myrp.edu.sg', '12345');
--
-- Indexes for dumped tables
--

--
-- Indexes for table `students`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`username`);
  
ALTER TABLE `vendors`
  ADD PRIMARY KEY (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `students`
--


/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

