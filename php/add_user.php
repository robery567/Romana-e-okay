<?php
/*	
	Adds user to database if not added.
	Used in facebookLogin.js
*/
	include 'db_connect.php';
	$id = $_POST['id'];
	$name = $_POST['name'];
	$user_score = 0;
	
	session_start();

	$_SESSION["id"] = $id;

	$find_id_query = "
		SELECT *
		FROM users
		WHERE id = ". $id ." ;";

	$id_result = mysql_query($find_id_query);
	$id_found = mysql_numrows($id_result);
	if ($id_found == 0) {
		$insert_user = "INSERT INTO users (id, name, score) VALUES ('$id', '$name', 0)";
		$inserted = mysql_query($insert_user);
	}
	else {
		$user_score = mysql_result($id_result, 0, "score");
	}
	echo $user_score;
?>