<?php
	include 'db_connect.php';
	session_start();
	$id = $_SESSION["id"];
	mysql_query("set names 'utf8'");

	$find_id_query = "
		SELECT *
		FROM users
		WHERE id = ". $id ." ;";

	$id_result = mysql_query($find_id_query);
	$id_found = mysql_numrows($id_result);

	if ($id_found == 1 && mysql_result($id_result, 0, "type") == "admin") {
		$page_id = $_POST['id'];
		$delete_page_query = "
			DELETE
			FROM lessons
			WHERE global_id = ". $page_id ." ;";
		$delete_result = mysql_query($delete_page_query);
	}
	else echo ":(";
?>