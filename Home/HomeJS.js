//mapData=[title={},image=[], description=[], state={}, latitude={}, longitude={},keyWords={}],
//stateData=[state={}imageHeader={},subTitle={},subParagraphs={}, latitude={}, longitude{}}],
//blogData=[title={}, description={}, imageHeader=[], subTitle={}, subParagraph={} subImage={}],
//productsData=[title={},affiliateLink=[], image={}, price={}, category={}]
var dataJson;

//receives json that holds data for all of the pages
function getDataJson(){
    var storedDataJson=sessionStorage.getItem("dataJson");
	if(storedDataJson===null){
        $.get("https://www.permanentroadtrip.com/webcontent/server.php", function(data){
            dataJson=JSON.parse(data);
            sessionStorage.setItem("dataJson",data);
            //uses json to add to the home page
            setSponsors(dataJson.sponsorData);
		    addGoogleMap();
        	addMarkers(dataJson);
        	addBlogPost(dataJson);
        	displayProducts();
        	createInstaFeed();
        });
	}else{
		dataJson=JSON.parse(sessionStorage.getItem("dataJson"));
    	//uses json to add to the home page
    	setSponsors(dataJson.sponsorData);
    	addGoogleMap();
    	addMarkers(dataJson);
    	addBlogPost(dataJson);
    	displayProducts();
    	createInstaFeed();
	}
}


/*creates the instagram feed and allows other pages to retrieve the instaFeed*/
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






//adds van data-------------------------------------------------------------
$(document).ready(function(){
	$("#ourVanHeader").click(function(){
		window.location="https://www.permanentroadtrip.com/webcontent/OurVan/Van.html";
	});
	$("#ourVanHeader").hover(function(){
		$("#ourVan-headerUnderline").toggleClass("ourVan-headerUnderline-active");
	});
});







//adds map data --------------------------------------------------------------
//mapData=[title={},image=[], description=[], state={}, latitude={}, longitude={},keyWords={}]
var map;
function addGoogleMap(){
	var mapHolder = document.getElementById("map");
	var mapOptions = {
		center: new google.maps.LatLng(39, -98),
		zoom: 4
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
}
function addMarkers(json){
	//add the ten most recent location
	var endIndex=10;
	if(json.mapData.length<10){
	    endIndex=json.mapData.length;
	}
	for(var x=0;x<endIndex;x++){
		var marker = new google.maps.Marker({
			position:new google.maps.LatLng(json.mapData[x].latitude,json.mapData[x].longitude),
			index:x,
			state:json.mapData[x].state,
			lat:json.mapData[x].latitude,
			lng:json.mapData[x].longitude
		});

		marker.setMap(map);
		  
		google.maps.event.addListener(marker,'click',function(){
			createPopupMenu(this.index,json);
		});
		   
	}
}

function createPopupMenu(index,mapJson){
	
	$("body").css("overflow","hidden");
	$("#map-modal").css("display","block");
	
	//resets carousel then recreates it
	$("#carouselSlideList").html("");
	$("#carouselSlides").html("");
	addCarouselData(index,mapJson);
	
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
function addCarouselData(index,mapJson){
    
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

$(document).ready(function(){
	$("#ourRouteHeader").click(function(){
		window.location="https://www.permanentroadtrip.com/webcontent/OurRoute/Map.html";
	});
	$("#ourRouteHeader").hover(function(){
		$("#ourRoute-headerUnderline").toggleClass("ourRoute-headerUnderline-active");
	});
});








//adds product data ----------------------------------------------------------
//productsData:[title={},affiliateLink=[], image={}, price={}, category={}]

function displayProducts(){
	for(var x=0;x<1;x++){
		$("#productsHolder").append(
			'<div class="col-lg-3 col-sm-4 col-sm-4 col-xs-6 products">'+
				'<a href="'+dataJson.productsData[x].affiliateLink+'">'+
				
					'<div class="products-img" role="presentation" style="background-image: url('+dataJson.productsData[x].image+');">'+
					'</div>'+
			          	
					'<div class="products-desc">'+
						'<h3 class="products-title">'+dataJson.productsData[x].title+'</h3>'+
						'<p class="products-price">Around $'+dataJson.productsData[x].price+' on Amazon</p>'+
				'</div>'+
						
				'</a>'+		
			'</div>'
		);
	}
}
$(document).ready(function(){
	$("#productsHeader").click(function(){
		window.location="https://www.permanentroadtrip.com/webcontent/Products/ProductsPage.html";
	});
	$("#productsHeader").hover(function(){
		$("#products-headerUnderline").toggleClass("products-headerUnderline-active");
	});
});










//adds blog data
function addBlogPost(json){
	
	var divToAppend = document.createElement("div");
	divToAppend.className="row";
	document.getElementById("blogPostHolder").appendChild(divToAppend);


	for(var x=0;x<1;x++){
		$(divToAppend).append(
			'<div class="col-lg-3 col-md-6 col-sm-6 col-xs-12" onclick="goToBlogPage('+x+');">'+		
				'<div class="blogPost">'+
				
					'<div class="blogPost-imgHolder" style="background-image:url('+json.blogData[x].imageHeader+');"></div>'+
					'<div class="blogPost-textHolder">'+
				    	'<h4><b>'+json.blogData[x].title+'</b></h4>'+
				    	'<p>'+json.blogData[x].description+'</p> '+
				    '</div>'+
				'</div>'+
			'</div>'
		);
	}
}



function goToBlogPage(index){
	//BlogPost will use the sessionStorage to access the data needed to create the page
	sessionStorage.removeItem("blogData");
	var jsonParameter={blogData:{}};
	jsonParameter.blogData=dataJson.blogData[index];
	sessionStorage.setItem("blogData",JSON.stringify(jsonParameter));
	window.location.href = "https://www.permanentroadtrip.com/webcontent/Blog/BlogPost.html";
}

$(document).ready(function(){
	$("#blogHeader").click(function(){
		window.location="https://www.permanentroadtrip.com/webcontent/Blog/BlogPage.html";
	});
	$("#blogHeader").hover(function(){
		$("#blog-headerUnderline").toggleClass("blog-headerUnderline-active");
	});
});