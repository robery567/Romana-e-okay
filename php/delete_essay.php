<?php
/*	
	Deleting user's essay.
	Used in myComments.js.
*/
	include 'db_connect.php';
	$id_essay = isset($_POST['id']) ? $DB->real_escape_string($_POST['id']) : NULL;

	$id = $_SESSION["id"];

	$find_essay_query = "
		SELECT *
		FROM essays
		WHERE id = '{$id_essay}'";
	$find_essay = $DB->query($find_essay_query);
	$essay = $DB->fetch_array(MYSQLI_ASSOC);

	if ($find_essay->num_rows == 1) {
		if ($essay['id_user'] == $id) {
			$delete_query = "DELETE FROM essays WHERE id = '{$id_essay}'";
			$deleted = $DB->query($delete_query);
		}
	}
?>
