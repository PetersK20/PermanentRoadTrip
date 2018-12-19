//stateMapJson: stateData={state={},imageHeader={},subTitle={},subParagraph={},subImage={}, latitude={}, longitude{}},stateMapData=[{]title={},image=[], description=[], state={}, latitude={}, longitude={},keyWords={}]
var stateMapJson;
var stateMap;
var allMarkers=[];
function customizeStatePage(){
	
	stateMapJson=JSON.parse(sessionStorage.getItem("stateMapJson"));
	var stateName=stateMapJson.stateData.state
	document.title=stateName;
	$("body").css("background-image","url('"+stateMapJson.stateData.imageHeader+"')");
	$("#headerImg-placeHolder>h1").text(stateName);
	$("#mapTitle").text("Locations in "+stateName);
	createMap();
	addMarkers();	
	addInfo();
	setSponsors(stateMapJson.sponsorData);
	createInstaFeed();
}

function addInfo(){
	var subTitleArray=stateMapJson.stateData.subTitle.split("~");

	var subParagraphArray=stateMapJson.stateData.subParagraph.split("~");
	
	var subImageArray=stateMapJson.stateData.subImage.split("~");
	
	for(var x=0;x<subTitleArray.length;x++){
		$("#stateTextHolder").append("<div align='center'><h1>"+subTitleArray[x]+"</h1></div> <br>");
		$("#stateTextHolder").append("<div align='center'><p>"+subParagraphArray[x]+"</p></div>");
		if(subImageArray[x]!=="none"){		
			$("#stateTextHolder").append("<br><div align='center'> <img class='stateSubImage' src='"+subImageArray[x]+"'> </div>");
		}
		$("#stateTextHolder").append("<hr>");
	}

}


function createMap() {

	var mapHolder = document.getElementById("mapHolder");
	var mapOptions = {
		center: new google.maps.LatLng(stateMapJson.stateData.latitude, stateMapJson.stateData.longitude),
		zoom: 7
	};
	stateMap = new google.maps.Map(mapHolder, mapOptions);

}
function addMarkers(){
	
	for(var x=0;x<stateMapJson.stateMapData.length;x++){
		  var marker = new google.maps.Marker({
			  position:new google.maps.LatLng(stateMapJson.stateMapData[x].latitude,stateMapJson.stateMapData[x].longitude),
			  index:x,
			  state:stateMapJson.stateMapData[x].state,
			  lat:stateMapJson.stateMapData[x].latitude,
			  lng:stateMapJson.stateMapData[x].longitude
		  });
		  allMarkers.push(marker);

		  marker.setMap(stateMap);
		  
		  google.maps.event.addListener(marker,'click',function(){
			  
			  createPopupMenu(this.index);
			  
		   });
	}
}
function createPopupMenu(index){
	
	$("body").css("overflow","hidden");
	$("#map-modal").css("display","block");
	
	//resets carousel then recreates it
	$("#carouselSlideList").html("");
	$("#carouselSlides").html("");
	addCarouselData(index);
	
	$("#map-modal-caption").html(nl2br(stateMapJson.stateMapData[index].description)+"<br><br><br><br><br><br><br>");
    $("#map-modal-title").text(stateMapJson.stateMapData[index].title);
     
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
    
    var imageArray = stateMapJson.stateMapData[index].image.split("~");//splits images up that are divided by ~ in the db
    
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
