<?php
	include 'db_connect.php';
	session_start();
	$id = $_SESSION["id"];

	$find_id_query = "
		SELECT *
		FROM users
		WHERE id = ". $id ." ;";

	$id_result = mysql_query($find_id_query);
	$id_found = mysql_numrows($id_result);

	if ($id_found == 1 && mysql_result($id_result, 0, "type") == "admin") {
		$file = "../" . $_SESSION["editable_page"] . (1 - $$_SESSION["version"]) . ".html";
		echo $file;
		$new_content = $_POST['new_content'];
		file_put_contents($file, $new_content);
		echo file_get_contents($file);
	}
?>