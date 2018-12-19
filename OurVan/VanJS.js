//mapData=[title={},image=[], description=[], state={}, latitude={}, longitude={},keyWords={}],
//stateData=[state={}imageHeader={},subTitle={},subParagraphs={}, latitude={}, longitude{}}],
//blogData=[title={}, description={}, imageHeader=[], subTitle={}, subParagraph={} subImage={}],
//productsData=[title={},affiliateLink=[], image={}, price={}, category={}]

//receives json that holds data for all of the pages
function getDataJson(){
    var storedDataJson=sessionStorage.getItem("dataJson");
	if(storedDataJson===null){
        $.get("https://www.permanentroadtrip.com/webcontent/server.php", function(data){
            dataJson=JSON.parse(data);
            sessionStorage.setItem("dataJson",data);
            setSponsors(dataJson.sponsorData);
            createInstaFeed();

        });
	}else{
		var tempJson=JSON.parse(sessionStorage.getItem("dataJson"));
		setSponsors(tempJson.sponsorData);
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
	
	

    /*sets navbar fixed on scroll*/
    var origOffsetY = 60;
    var origOffsetYSub = 540;
    
	$(window).resize(function(){
		//if screen size is lg or md - sm and xs have smaller header imgs then md, lg
		if($(window).width()>=992){
			origOffsetYSub = 540
		}else{
		    origOffsetYSub = 400;
		}
	});
    function scrollCheck() {

        if ($(window).scrollTop()>=origOffsetY) {
            $('#headerLg').addClass('stickyNavbar');
        } else {
            $('#headerLg').removeClass('stickyNavbar');
        }
        
        if ($(window).scrollTop()>=origOffsetYSub) {
            $("#vanSubNav").addClass('stickySubNavbar');
            $("#subNavHR").show();
        } else {
            $("#vanSubNav").removeClass('stickySubNavbar');
            $("#subNavHR").hide();
        }
        

    }

    document.onscroll = scrollCheck;


});
