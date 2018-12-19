//receives json that holds data for all of the pages

var storedDataJson=sessionStorage.getItem("dataJson");
if(storedDataJson===null){
    $.get("https://www.permanentroadtrip.com/webcontent/server.php", function(data){
        dataJson=JSON.parse(data);
        sessionStorage.setItem("dataJson",data);
        //uses json to add to the home pge
        setSponsors(dataJson.sponsorData);
    });
}else{
	dataJson=JSON.parse(sessionStorage.getItem("dataJson"));
    //uses json to add to the home page
    setSponsors(dataJson.sponsorData);
}

var About="e by train or a four-day trek. Rediscovered by Hiram Bingham in 1911, it was an important cultural center for the Inca civilization but was abandoned when the Spanish invaded the region. (It is famously referred to as the â€œLost City of the Incas,â€ though that is actually Vilcabamba). The location was made a UNESCO World Heritage site in 1983, and it was named one of the New Seven Wonders of the World in 2007. Concerns over growing numbers of tourists have led to limitations on how many people can enter th";
var Goals="Goals";
var background="background";
var legal="legal";
var workWithUs="workWithUs";


var info = [About, Goals, background, legal, workWithUs];

/*add the correct info on page load*/
element="about"
var url = window.location.href;
var elementMaybe = url.split('page=')[1];
/*check if an &page= is one of the pages if so set it to that page if not use the default about page*/
if(elementMaybe == "About" | elementMaybe == "goals" | elementMaybe == "background" | elementMaybe == "legal" | elementMaybe == "workWithUs"){
    element=elementMaybe;
}
var activeElement=document.getElementById(element);
document.getElementById("infoHolder").innerHTML=info[activeElement.getAttribute("name")];
$(activeElement).addClass("active");
createInstaFeed();


function changeAboutInfo(htmlElement){
    $("#infoHolder").text(info[htmlElement.getAttribute("name")]);
    $(htmlElement).addClass("active");
    $(activeElement).removeClass("active");
    activeElement=htmlElement;
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