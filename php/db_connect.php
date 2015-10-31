<?php
	define('development_mode', false);
	$host = "";
	$username = "";
	$password = "";
	$database = "Romana-e-okay";
	$DB = new MySQLI ($host, $username, $password, $database)
	//@mysql_select_db($db);
	error_reporting(development_mode ? E_ALL : 0);
?>
