<?php 
	$data = array(
        'json' => 'antykorsud',
    );
    $url = 'https://ti-ukraine.org/news';
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HEADER, false);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
	$answer  =  curl_exec($ch);
    curl_close($ch);
	header('Content-Type: application/json');
	echo $answer;