<?php

	function getFuel($typeofrequest){
		$uri  = 'https://api.nike.com/v1.0'.$typeofrequest.'deviceId=ae251c3b-bbdb-4ab4-b71c-a15cbd2415f6&access_token=927b9c59e5b787437e7c0f6ba689fad8';
		$ch   = curl_init($uri);
		$headers = array(
			'Host: api.nike.com',
			'Accept: application/json', 
    		'Content-Type: application/json', 
    		'appid: fuelband', 
    	);
		curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
		$out = curl_exec($ch);
		curl_close($ch);
		// echo response output
		json_encode($out);
	}

	getFuel('/me/activities/summary/220912?&endDate=240912&fidelity=96&');

?>