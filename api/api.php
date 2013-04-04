<?php 
	
	date_default_timezone_set('Europe/Stockholm');
	//include stuff
	require_once "nikeplusphp.4.5.php";
	
	function echoJSON($type){
		//setup stuff
		$n          = new NikePlusPHP('username', 'password');
		$activities = $n->activities();         // ALL RUNS
		$alltime    = $n->allTime();            //    ALL NIKE+ INFO
		$mostRecent = $n->mostRecentActivity(); // MOST RECENT

		switch($type){
			case 'runs':
				echo json_encode($activities);
			break;

			case 'all':
				echo json_encode($alltime);
			break;

			case 'mostrecent':
				echo json_encode($mostRecent);
			break;
		};
	};
	

	$type = $_GET['type'];

	echoJSON($type);
?>