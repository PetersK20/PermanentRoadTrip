<?php

    require_once('../mysqli_connect.php');

    $jsonObject= new stdClass();	    	
	$jsonObject=getMapData($dbc,$jsonObject);
	$jsonObject=getStateData($dbc,$jsonObject);
	$jsonObject=getBlogData($dbc,$jsonObject);
	$jsonObject=getProductsData($dbc,$jsonObject);
	$jsonObject=getSponsors($dbc,$jsonObject);
	
	$json= json_encode($jsonObject);

	// Close connection to the database
	mysqli_close($dbc);
	echo $json;
	
function getSponsors($dbc,$jsonObject){

	// Get a response from the database by sending the connection and the query
    $response=$dbc->query("SELECT * FROM sponsors");
    
	//creates jsonObject for each index of the db and inserts them into the mapArray
	//This array is then added to the jsonObject that will be returned
	$mapArrayPhp = array();

	// If the query executed properly proceed
	if($response){
		while($dbResults = mysqli_fetch_array($response)){
            $dbIndexObject= new stdClass();
			$dbIndexObject->name=$dbResults['name'];
			$dbIndexObject->website=$dbResults['website'];

			$mapArrayPhp[]=$dbIndexObject;
		}
	}else{

		echo "Couldn't issue database query<br />";

		echo mysqli_error($dbc);

	}
	$jsonObject->sponsorData = $mapArrayPhp;
	return $jsonObject;
}

function getMapData($dbc,$jsonObject){

	// Get a response from the database by sending the connection and the query
    $response=$dbc->query("SELECT * FROM map");
    
	//creates jsonObject for each index of the db and inserts them into the mapArray
	//This array is then added to the jsonObject that will be returned
	$mapArrayPhp = array();

	// If the query executed properly proceed
	if($response){
		while($dbResults = mysqli_fetch_array($response)){
            $dbIndexObject= new stdClass();
			$dbIndexObject->title=$dbResults['title'];
			$dbIndexObject->image=$dbResults['image'];
			$dbIndexObject->description=$dbResults['description'];
			$dbIndexObject->state=$dbResults['state'];
			$dbIndexObject->latitude=$dbResults['latitude'];
			$dbIndexObject->longitude=$dbResults['longitude'];
			$dbIndexObject->keyWords=$dbResults['keywords'];

			$mapArrayPhp[]=$dbIndexObject;
		}
	}else{

		echo "Couldn't issue database query<br />";

		echo mysqli_error($dbc);

	}
	$jsonObject->mapData = $mapArrayPhp;
	return $jsonObject;
}
function getStateData($dbc,$jsonObject){

	// Get a response from the database by sending the connection and the query
    $response=$dbc->query("SELECT * FROM state");
	
	//creates jsonObject for each index of the db and inserts them into the mapArray
	//This array is then added to the jsonObject that will be returned
	$mapArrayPhp = array();

	// If the query executed properly proceed
	if($response){
		while($dbResults = mysqli_fetch_array($response)){

            $dbIndexObject= new stdClass();
			$dbIndexObject->state=$dbResults['state'];
			$dbIndexObject->imageHeader=$dbResults['image_header'];
			$dbIndexObject->subTitle=$dbResults['sub_title'];
			$dbIndexObject->subParagraph=$dbResults['sub_paragraph'];
			$dbIndexObject->subImage=$dbResults['sub_image'];
			$dbIndexObject->latitude=$dbResults['latitude'];
			$dbIndexObject->longitude=$dbResults['longitude'];
	
			$mapArrayPhp[]=$dbIndexObject;
		}
	}else{

		echo "Couldn't issue database query<br />";

		echo mysqli_error($dbc);

	}
	$jsonObject->stateData = $mapArrayPhp;
	return $jsonObject;
}
function getBlogData($dbc,$jsonObject){

	// Get a response from the database by sending the connection and the query
    $response=$dbc->query("SELECT * FROM blog");
	
	//creates jsonObject for each index of the db and inserts them into the mapArray
	//This array is then added to the jsonObject that will be returned
	$mapArrayPhp = array();

	// If the query executed properly proceed
	if($response){
		while($dbResults = mysqli_fetch_array($response)){

            $dbIndexObject= new stdClass();
			$dbIndexObject->title=$dbResults['title'];
			$dbIndexObject->description=$dbResults['description'];
			$dbIndexObject->imageHeader=$dbResults['image_header'];
			$dbIndexObject->subTitle=$dbResults['sub_title'];
			$dbIndexObject->subParagraph=$dbResults['sub_paragraph'];
			$dbIndexObject->subImage=$dbResults['sub_image'];
			$dbIndexObject->category=$dbResults['category'];
				
			$mapArrayPhp[]=$dbIndexObject;
		}
	}else{

		echo "Couldn't issue database query<br />";

		echo mysqli_error($dbc);

	}
	$jsonObject->blogData = $mapArrayPhp;
	return $jsonObject;
}
function getProductsData($dbc,$jsonObject){

	// Get a response from the database by sending the connection and the query
    $response=$dbc->query("SELECT * FROM products");
	
	//creates jsonObject for each index of the db and inserts them into the mapArray
	//This array is then added to the jsonObject that will be returned
	$mapArrayPhp = array();

	// If the query executed properly proceed
	if($response){
		while($dbResults = mysqli_fetch_array($response)){
            $dbIndexObject= new stdClass();
			$dbIndexObject->title=$dbResults['title'];
			$dbIndexObject->affiliateLink=$dbResults['affiliate_link'];
			
			$dbIndexObject->image=$dbResults['image'];
			$dbIndexObject->price=$dbResults['price'];
			$dbIndexObject->category=$dbResults['category'];
	
			$mapArrayPhp[]=$dbIndexObject;
		}
	}else{

		echo "Couldn't issue database query<br />";

		echo mysqli_error($dbc);

	}
	$jsonObject->productsData = $mapArrayPhp;
    return $jsonObject;
}
?>