//blogJson: blogData={title={}, description={}, imageHeader=[], subTitle={}, subParagraph={} subImage={}}
var blogJson;
function customizeBlogPage(){
	
	blogJson=JSON.parse(sessionStorage.getItem("blogData"));
	var blogName=blogJson.blogData.title;
	document.title=blogName;
	$("#headerImg-placeHolder>h1").text(blogName);
	$("body").css("background-image","url('"+blogJson.blogData.imageHeader+"')");
	$("#blogTitle").text(blogName);
	$("#blogDescription").text(blogJson.blogData.description);
	setSponsors(blogJson.sponsorData);
	createInstaFeed();
	addInfo();
}

function addInfo(){
	

	var subTitleArray=blogJson.blogData.subTitle.split("~");
	var subParagraphArray=blogJson.blogData.subParagraph.split("~");
	var subImageArray=blogJson.blogData.subImage.split("~");

	for(var x=0;x<subTitleArray.length;x++){
		$("#blogTextHolder").append("<div align='center'><h1>"+subTitleArray[x]+"</h1></div> <br>");
		$("#blogTextHolder").append("<div align='center'><p>"+subParagraphArray[x]+"</p></div>");
		if(subImageArray[x]!=="none"){		
			$("#blogTextHolder").append("<br><div align='center'> <img class='blogSubImage' src='"+subImageArray[x]+"'></div>");
		}
		$("#blogTextHolder").append("<hr>");
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