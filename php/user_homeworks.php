<?php
/*
	Gets user's saved essays.
	Used in commentsFactory.js.
*/

	include 'db_connect.php';
	
	session_start();
	$id = $_SESSION["id"];
	$essays_arr = array();
	$aux = array();

	if ($id != 0) {
		$get_essays = "
			SELECT *
			FROM essays
			WHERE id_user = " . $id. "
			ORDER BY id DESC";

		$essays = mysql_query($get_essays);
		$essays_count = mysql_numrows($essays);

		if ($essays_count != 0) {
			for ($i = 0; $i < $essays_count; $i++) {
				$get_ratings = "
					SELECT *
					FROM ratings
					WHERE id_essay = " . mysql_result($essays, $i, "id") . ";";
				$ratings = mysql_query($get_ratings);
				$count = mysql_numrows($ratings);

				$total_rating = 0;
				$average = 0;

				for ($j = 0; $j < $count; $j++) {
					$total_rating = $total_rating + mysql_result($ratings, $j, "rating");
				}


				if ($count == 0) $average = 0;
				else $average = $total_rating / $count;

				$aux = array (
					"index" => $i,
					"id" => mysql_result($essays, $i, "id"),
					"content" => mysql_result($essays, $i, "homework"), 
					"tags" => mysql_result($essays, $i, "tags"),
					"public" => mysql_result($essays, $i, "public"),
					"average" => $average,
					"ratedBy" => $count
				);
				array_push($essays_arr, $aux);
				//echo "<tr> <td> " . $i . ". </td> <td style = 'text-align: justify;'> " . mysql_result($essays, $i - 1, "homework") . " </td> </tr>";
			}

			/*echo "</tbody>";
			echo "</table>";*/
		}

		echo json_encode($essays_arr);
	}
?>