<?php
/*
	Updates user score
	Used in game.js
*/
	include 'db_connect.php';

	$id = isset($_POST['id']) ? mysql_real_escape_string($_POST['id']) : NULL;
	$score = isset($_POST['score']) ? mysql_real_escape_string($_POST['score']) : NULL;
	$find_user_query = "
		SELECT *
		FROM users
		WHERE id = {$id}";

	$user_result = @mysql_query($find_user_query);
	$user_found = @mysql_num_rows($user_result);

	if ($user_found != 0) {
		//$score = floor($score / 10) + mysql_result($user_result, 0, "score");
		$update_score_query = "
			UPDATE users
			SET score = score + $score
			WHERE id = {$id}";

		$score_result = @mysql_query($update_score_query);
	}

	echo $score;
?>
