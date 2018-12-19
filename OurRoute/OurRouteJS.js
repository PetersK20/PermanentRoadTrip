//mapJson: mapData=[title={},image=[], description=[], state={}, latitude={}, longitude={},keyWords={}], stateData=[state={}imageHeader={},subTitle={},subParagraphs={}, latitude={}, longitude{}}]

//gets json and stores it in sessionStorage unless the json has already been stored
var mapJson={
		mapData:[],
		stateData:[],
		sponsorData:[]
};
function getDataJson(){
    var storedDataJson=sessionStorage.getItem("dataJson");
	if(storedDataJson===null){
        $.get("https://www.permanentroadtrip.com/webcontent/server.php", function(data){
            dataJson=JSON.parse(data);
            sessionStorage.setItem("dataJson",data);
		    mapJson.mapData=dataJson.mapData;
		    mapJson.stateData=dataJson.stateData;
		    mapJson.sponsorData=dataJson.sponsorData;
		    //checks if the user used the search feature in the navbar to redirect to this page and creates the markers
		    setSponsors(mapJson.sponsorData);
		    checkForSearchRedirect(mapJson);
		    addStates(mapJson);
		    createInstaFeed();
		    displayPagination(mapJson);
		    addLocations(mapJson,0,19);
        });
	}else{
		var tempJson=JSON.parse(sessionStorage.getItem("dataJson"));
	   	mapJson.mapData=tempJson.mapData;
	   	mapJson.stateData=tempJson.stateData;
	   	mapJson.sponsorData=tempJson.sponsorData;
		//checks if the user used the search feature in the navbar to redirect to this page and creates the markers
		setSponsors(mapJson.sponsorData);
    	checkForSearchRedirect(mapJson);
    	addStates(mapJson);
    	createInstaFeed();		    	
    	displayPagination(mapJson);
    	addLocations(mapJson,0,19);
	}
}



//creates the instagram feed and allows other pages to retrieve the instaFeed----------------------------
var userFeed;
function createInstaFeed(){
	var storedInstafeed=sessionStorage.getItem("instafeedHtml");

	if(storedInstafeed==null){
		userFeed = new Instafeed({
				get:'user',
				userId:'296628123',		
				accessToken:'296628123.3cd9b08.236b80152f154019b9d1c30bb61c5f59',
				resolution:'standard_resolution',
				limit:6,
				template:
						'<div class="col-lg-2 col-md-2 col-sm-4 col-xs-6 instagramImage">'+
						   	'<a href="{{link}}">'+
								'<span class="img-responsive" style=\' background-image:url("{{image}}") \'></span>'+
							'</a>'+
						'</div>',
				after: function() {
					sessionStorage.setItem("instafeedHtml",$("#instafeed").html());
				}
			});

		userFeed.run();	
	}else{
		$("#instafeed").html(storedInstafeed)
	}

}

$(document).ready(function(){
	/*action listening for the instagram title*/
	$("#footer-instagramHeader").click(function(){
		window.location="https://www.instagram.com/permanentroadtrip/";
	});
	$("#footer-instagramHeader").hover(function(){
		$("#footer-instagram-headerUnderline").toggleClass("footer-instagram-headerUnderline-active");
	});	
	
		
	
	
});












//creates the map and adds the marker-------------------------------------------
//mapJson: mapData=[title={},image=[], state={}, latitude={}, longitude={},keyWords={}], stateData=[state={},imageHeader={},description={},subTitle={},subParagraph={},subImage={}, latitude={}, longitude{}]]

var map;
var allMarkers=[];
function createMap() {
	var mapHolder = document.getElementById("mapHolder");
	var mapOptions = {
		center: new google.maps.LatLng(39, -98),
		zoom: 4,
		streetViewControl: false
	};
	map = new google.maps.Map(mapHolder, mapOptions);
    google.maps.event.addDomListener(window, "resize", function() {
        var center = map.getCenter();
        google.maps.event.trigger(map, "resize");
        map.setCenter(center); 
        if($(document).width()<=500){
            map.setZoom(3);
        }else{
            map.setZoom(4);
        }
    });
            
	getDataJson();
}


function addMarkers(json){
	for(var x=0;x<json.mapData.length;x++){
		   var marker = new google.maps.Marker({
			   position:new google.maps.LatLng(json.mapData[x].latitude,json.mapData[x].longitude),
			   index:x,
			   state:json.mapData[x].state,
			   lat:json.mapData[x].latitude,
			   lng:json.mapData[x].longitude
		   });
		   allMarkers.push(marker);

		   marker.setMap(map);
		  
		   google.maps.event.addListener(marker,'click',function(){

			   //in EventHandler
			   createPopupMenu(this.index);
		    });
		   
	}
}








//filters the json for the map and locations----------------------------------
$(document).ready(function(){
	$("#mapSearchButton").click(function(){
		//allMarkers is in MapCreator that holds all of the map markers
		for(var x=0;x<allMarkers.length;x++){			
			allMarkers[x].setMap(null);
		}
		var json=filterJson($('#statesSelect option:selected'), $("#mapSearchTextbar").val().toLowerCase());
		addMarkers(json);
	});
	$("#mapSearchTextbar").keyup(function (e) {
	    if (e.keyCode == 13) {
			//allMarkers is in MapCreator that holds all of the map markers
			for(var x=0;x<allMarkers.length;x++){			
				allMarkers[x].setMap(null);
			}
			var json=filterJson($('#statesSelect option:selected'), $("#mapSearchTextbar").val().toLowerCase());
			addMarkers(json);
	    }
	});
	
	$("#byLocation-searchButton").click(function(){
		$("#locationHolder").html("");
		$("#mapPagination").html("");
		
		var json=filterJson($('#byLocation-statesSelect option:selected'), $("#byLocation-searchTextbar").val().toLowerCase());
		addLocations(json,0,19);
		displayPagination(json);
	});
	$("#byLocation-searchTextbar").keyup(function (e) {
	    if (e.keyCode == 13) {
			$("#locationHolder").html("");
			$("#mapPagination").html("");
			
			var json=filterJson($('#byLocation-statesSelect option:selected'), $("#byLocation-searchTextbar").val().toLowerCase());
			addLocations(json,0,19);
			displayPagination(json);
	    }
	});
});
	function filterJson(statesSelected,textQuery){
		
		//mapJson: mapData=[title={},image=[], description=[], state={}, latitude={}, longitude={},keyWords={}], stateData=[state={}imageHeader={},subTitle={},subParagraphs={}, latitude={}, longitude{}}]
		var filteredJson = {
				mapData: []
		};
		
		//checks if the selected states are included on the markers then adds the markers to the filteredJson if so
		//then checks if they are related to the search bar then sends the json so the map can be updated
		if(statesSelected.length!==0 &&statesSelected.length!==50){
			for(var x=0;x<mapJson.mapData.length;x++){
				
				for(var y=0; y<statesSelected.length;y++){
					
					if(mapJson.mapData[x].state.toLowerCase() === $(statesSelected[y]).text().toLowerCase()){
						filteredJson.mapData.push(mapJson.mapData[x]);		
						
					}
					
				}
			}
		}else{
			
			filteredJson=mapJson;
			
		}
		
		
		
		//goes through the first filteredJson's keywords and the searchQueryString.  
		//As long as one of the searchQueryString words is in the keywords, the marker shows up
		var filteredJson2 = {
				mapData: []
		};
		var searchQueryArray=textQuery.split(" ");
		if(textQuery!==""){
			for(var x=0;x<filteredJson.mapData.length;x++){
				
				var keyWords=(filteredJson.mapData[x].keyWords).toLowerCase();
				
				for(var y=0;y<searchQueryArray.length;y++){
					
					if(keyWords.indexOf(searchQueryArray[y])!==-1){
						filteredJson2.mapData.push(filteredJson.mapData[x]);	
						break;
					}
					
				}
			}
		}else{
			return filteredJson;
		}
		
		
		return filteredJson2;
		
	}
	












//checks if the user used the search feature in the navbar to redirect to this page
function checkForSearchRedirect(mapJson){

	var searchQuery=sessionStorage.getItem("searchQuery");
	if(searchQuery!=="" && searchQuery!==null ){
		searchQuery=searchQuery.toLowerCase();
		sessionStorage.setItem("searchQuery","");
		for(var x=0;x<allMarkers.length;x++){			
			allMarkers[x].setMap(null);
		}
							//by default, state filters no markers out, searchQuery will be the only one affecting the result
		var json=filterJson($('#statesSelect option:selected'), searchQuery);
		addMarkers(json);
		$("#mapSearchTextbar").val(searchQuery);
		$(window).scrollTop(600);
	}else{
    	addMarkers(mapJson);
	}
}






//creates popup when map marker is clicked--------------------------------------
function createPopupMenu(index){
	$("body").css("overflow","hidden");
	$("#map-modal").css("display","block");
	
	//resets carousel then recreates it
	$("#carouselSlideList").html("");
	$("#carouselSlides").html("");
	addCarouselData(index);
	
    $("#map-modal-caption").html(nl2br(mapJson.mapData[index].description)+"<br><br><br><br><br><br><br>");
    $("#map-modal-title").text(mapJson.mapData[index].title);
     
	 $("#map-modal-close").click(function() { 
		 $("#map-modal").css("display","none");
		 $("body").css("overflow","scroll");
	});
	
	

}
//creates line breaks for html from DB line breaks
function nl2br (str, is_xhtml) {
    var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';
    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
}
//adds the slides to the carousel
function addCarouselData(index){
    
    var imageArray = mapJson.mapData[index].image.split("~");//splits images up that are divided by ~ in the db
    
	//tells bootstraps the number of slides in the carousel
	for(var y=0;y<imageArray.length;y++){

		//if y==0 then set it as the active slide
		if(y==0){
			$("#carouselSlideList").append("<li data-target='#theCarousel' data-slide-to='"+y+"' class='active'> </li >");
		}else{
			$("#carouselSlideList").append("<li data-target='#theCarousel' data-slide-to='"+y+"'> </li >");
		}
	}
		
	//enters the data for the slides
	for(var y=0;y<imageArray.length;y++){
    
		//if y==0 then set it as the active slide
		if(y==0){
			$("#carouselSlides").append(
				"<div class='item active' style='background-image:url("+imageArray[y]+");'>"+
				"</div>"
			);
		}else{
			$("#carouselSlides").append(
				"<div class='item' style='background-image:url("+imageArray[y]+");'>"+
				"</div>"
			);
		}		
	}
}

//switches betwen byLocation and byState search-------------------------------
$(document).ready(function(){
	
	
	//changes between the byState and byLocation div
	$("#switchCheckbox").change(function(){
		
		//display byLocation
		if($(this).is(':checked')){

			
			//stops scroll bar from being shown because one of the divs will be off the screen and come onto the screen
			$("body").css("overflow-x","hidden");
			
	
			//animates byState off of the screen as byLocation is animated on
			$("#byState").animate({left:$("body").width()},300);
			
			//animates byLocation just to the left of the screen then makes byLocation visible
			$("#byLocation").animate({left:"0px",},0);
			$("#byLocation").animate({left:-$("body").width()},0, function(){
				$("#byLocation").css({"display":"inline-block", "opacity":"1", "position":"absolute"});
			});
			
			//animates byLocation onto the screen
			$("#byLocation").animate({left:"0px"},300, function(){						
				$("body").css("overflow-x","scroll");
				$("#byLocation").css({"position":"relative"});
				$("#byState").css({"display":"none", "opacity":"0"});
			});
			
			//display byState
		}else{
			//stops scroll bar from being shown because one of the divs will be off the screen and come onto the screen
			$("body").css("overflow-x","hidden");

			
			//animates byLocation off of the screen as byLocation is animated on
			$("#byLocation").animate({left:-$("body").width()},300);
			
			//animates byState just to the left of the screen then makes byState visible
			$("#byState").animate({left:"0px",},0);
			$("#byState").animate({left:$("body").width()},0, function(){	
				$("#byState").css({"display":"inline-block", "opacity":"1", "position":"absolute"});
			});
		
			//animates byState onto the screen
			$("#byState").animate({left:"0px"},300, function(){						
				$("body").css("overflow-x","scroll");
				$("#byState").css({"position":"relative"});
				$("#byLocation").css({"display":"none", "opacity":"0"});
			});
		}
		
	});
});





//mapJson: mapData=[title={},image=[], description=[], state={}, latitude={}, longitude={},keyWords={}], stateData=[state={}imageHeader={},subTitle={},subParagraphs={}, latitude={}, longitude{}}]

//creates the byLocationDiv----------------------------------------------------
function addLocations(json,startNumber,endNumber){

	if(json.mapData.length<endNumber){
		endNumber=json.mapData.length;
	}
	for(var x=startNumber;x<endNumber;x++){
     var image = mapJson.mapData[x].image.split("~")[0];

		$("#locationHolder").append(
			'<div class="mapLocationHolder col-lg-3 col-md-4 col-sm-6 col-xs-12">'+
				'<div class="location mapLocation" onmouseenter="byLocationEnter('+x+');" onmouseleave="byLocationLeave('+x+');">'+
				
					'<div id="location'+x+'">'+
					
						'<div class="mapLocation-img" style="background-image:url('+image+');"></div>'+
						'<div class="mapLocation-centeredImgText">'+
							'<div class="mapLocation-centeredImgTextBg"></div>'+
							'<h1>'+json.mapData[x].title+'</h1>'+
						'</div>'+
						
						'<div class="mapLocation-buttonHolder">'+
							'<Button class="btn btn-lg" onclick="createPopupMenu('+x+');">Find out More</Button>'+
							'<Button class="btn btn-lg" onclick="findOnMap('+x+');">Find on Map</Button>'+
						'</div>'+
						
					'</div>'+
					
				'</div>'+
			'</div>'
		);

	}
}
//when user hovers over a locationLink
function byLocationEnter(index){
	

	$("#location"+index+">div>.mapLocation-centeredImgTextBg").css("opacity","0");

	$("#location"+index+">.mapLocation-centeredImgText").stop().animate({"top":$("#location"+index).height()/2-50+"px"},300);
	
	$("#location"+index+">.mapLocation-buttonHolder").css("display","block");
	$("#location"+index+">.mapLocation-buttonHolder").stop().animate({"top":"60%","opacity":"1"},300);
	


}
//when user exits after hovering over a locationLink
function byLocationLeave(index){

	$("#location"+index+">div>.mapLocation-centeredImgTextBg").css("opacity",".5");
	
	$("#location"+index+">.mapLocation-centeredImgText").stop().animate({"top":"50%"},300);
	
	$("#location"+index+">.mapLocation-buttonHolder").stop().animate({"top":"100%","opacity":"0"},300);

}
//top function in this file is called if user presses findOutMore button
//when user clicks findOnMap button
function findOnMap(index){

	//allMarkers contain all map markers and is created in MapCreator.js
	var marker=allMarkers[index];
	addMarkers(mapJson);
	map.setCenter(new google.maps.LatLng(marker.lat, marker.lng));
	map.setZoom(10); 
	window.scrollTo(0,600)

}





//adds pagination to location --------------------------------------------------
//mapJson: mapData=[title={},image=[], description=[], state={}, latitude={}, longitude={},keyWords={}], stateData=[state={}imageHeader={},subTitle={},subParagraphs={}, latitude={}, longitude{}}]

function paginationClick(newCurrentPage){
	currentPage=newCurrentPage;

	$("#mapPagination").html("");
	$("#byLocation").html("");
	
	$("html, body").animate({scrollTop: "450px"});
	addLocations(newCurrentPage*20-20,newCurrentPage*20,mapJson);
	displayPagination(mapJson);
}
//displays currentIndex, 2 indexes before/after, and prev/next
var currentPage=1;
function displayPagination(json){
	var numberOfPages=Math.ceil(json.mapData.length/20);
	if(numberOfPages==0){numberOfPages=1;}

	//following if statements prevent things from going wrong in the pagination like displaying the same number twice
	
	
	if(currentPage==1){//displays prev button but disables it if currentPage==numberOfPages
		$("#mapPagination").append(
			'<li id="pagination-next" class="disabled">'+
				'<a aria-label="Next">'+
					'<span aria-hidden="true">&laquo;</span>'+
				'</a>'+
			'</li>'
		);
	}else{
		$("#mapPagination").append(
			'<li id="pagination-next" onclick="paginationClick('+(currentPage-1)+')">'+
				'<a href="#!" aria-label="Next">'+
					'<span aria-hidden="true">&laquo;</span>'+
				'</a>'+
			'</li>'
		);
	}
	
	if(currentPage!==1){//displays 1
		$("#mapPagination").append(
			'<li onclick="paginationClick(1)"><a href="#!">'+1+'</a></li>'
		);
	}
	if(currentPage-2>=3){//adds ... because there is a number gap between 1 and the next number
		$("#mapPagination").append(
			'<li><a>...</a></li>'
		);
	}
	
	
	
	if(currentPage>3){//display 2 before current
		$("#mapPagination").append(
			'<li onclick="paginationClick('+(currentPage-2)+')"><a href="#!">'+(currentPage-2)+'</a></li>'
		);
	}
	if(currentPage>2){//display 1 before current
		$("#mapPagination").append(
			'<li onclick="paginationClick('+(currentPage-1)+')"><a href="#!">'+(currentPage-1)+'</a></li>'
		);
	}

	$("#mapPagination").append(//display current
		'<li class="active"><a>'+currentPage+'</a></li>'
	);

	if(currentPage<numberOfPages-1){//display 1 after current
		$("#mapPagination").append(
			'<li onclick="paginationClick('+(currentPage+1)+')"><a href="#!">'+(currentPage+1)+'</a></li>'
		);
	}
	if(currentPage<numberOfPages-2){//display 2 after current
		$("#mapPagination").append(
			'<li onclick="paginationClick('+(currentPage+2)+')"><a href="#!">'+(currentPage+2)+'</a></li>'
		);
	}
	
	
	if(currentPage+4<=numberOfPages){//adds ... because there is a number gap between the last index and the previous number
		$("#mapPagination").append(
			'<li><a>...</a></li>'
		);
	}	
	
	if(numberOfPages!==currentPage &&currentPage!==numberOfPages){//displays last page number
		$("#mapPagination").append(
			'<li onclick="paginationClick('+numberOfPages+')"><a href="#!">'+numberOfPages+'</a></li>'
		);
	}
	
	if(currentPage==numberOfPages){//displays prev button but disables it if currentPage==numberOfPages
		$("#mapPagination").append(
			'<li id="pagination-prev" class="disabled">'+
				'<a aria-label="Next">'+
					'<span aria-hidden="true">&raquo;</span>'+
				'</a>'+
			'</li>'
		);
	}else{
		$("#mapPagination").append(
			'<li id="pagination-prev" onclick="paginationClick('+(currentPage+1)+')">'+
				'<a href="#!" aria-label="Next">'+
					'<span aria-hidden="true">&raquo;</span>'+
				'</a>'+
			'</li>'
		);
	}

}








//redirects to state page-------------------------------------------------------
//mapJson: stateData=[state={}imageHeader={},subTitle={},subParagraphs={}, latitude={}, longitude{}}], stateData=[state={},imageHeader={},description={},subTitle={},subParagraph={},subImage={}, latitude={}, longitude{}]

//holds the div that the stateLinks will append to
var divToAppend;

function addStates(json){

	divToAppend = document.createElement("div");
	divToAppend.className="row";
	document.getElementById("byState").appendChild(divToAppend);
	for(var x=0;x<json.stateData.length;x++){

		$(divToAppend).append(
			'<div class="mapLocationHolder col-lg-3 col-md-4 col-sm-6 col-xs-12" onclick="goToStatePage('+x+');">'+
				'<div class="state mapLocation" onmouseenter="byStateEnter('+x+');" onmouseleave="byStateLeave('+x+');">'+
				
					'<div id="state'+x+'">'+
					
						'<div class="mapLocation-img" style="background-image:url('+json.stateData[x].imageHeader+');"></div>'+
						'<div class="mapLocation-centeredImgText">'+
							'<div class="mapLocation-centeredImgTextBg"></div>'+
							'<h1>'+json.stateData[x].state+'</h1>'+
						'</div>'+
	
					'</div>'+
					
				'</div>'+
			'</div>'
		);
	}
}
//when user hovers over a stateLink
function byStateEnter(index){

	//fades out the banner over the image with the state name
	$("#state"+index+">.mapLocation-centeredImgText").stop().fadeOut(350);

}
//when user exits after hovering over a stateLink
function byStateLeave(index){
	
	//fades in the banner over the image with the state name
	$("#state"+index+">.mapLocation-centeredImgText").stop().fadeIn(350);

}


function goToStatePage(index){
	//StatePage will use the sessionStorage to access the data needed to create the page
	sessionStorage.removeItem("stateMapJson");

	var stateMapJson={stateMapData:[], stateData:{}, sponsorData:{}}; 
	stateMapJson.stateData=mapJson.stateData[index];
	stateMapJson.sponsorData=mapJson.sponsorData;
	
	var selectedState=mapJson.stateData[index].state.toLowerCase();
	for(var x=0;x<mapJson.mapData.length;x++){

		if(mapJson.mapData[x].state.toLowerCase()===selectedState){
			stateMapJson.stateMapData.push(mapJson.mapData[x]);	
		}
	}

	sessionStorage.setItem("stateMapJson",JSON.stringify(stateMapJson));
	
	window.location.href = "StatePage.html";

}