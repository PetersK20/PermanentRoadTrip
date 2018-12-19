//receives json that holds data for all of the pages if it is not in sessionStorage

//blogJson is the only one used for this page
//blogJson: blogData=[title={}, description={}, imageHeader={}}, subTitle={}, subParagraph={}, subImage={}]
var blogJson={
    blogData:[],
    sponsorData:[]
};

var dataJson;
function getDataJson(){
    var storedDataJson=sessionStorage.getItem("dataJson");
	if(storedDataJson===null){
        $.get("https://www.permanentroadtrip.com/webcontent/server.php", function(data){
            dataJson=JSON.parse(data);
   
            sessionStorage.setItem("dataJson",data);
            //uses json to add to the home page
		    blogJson.blogData=dataJson.blogData;
		    blogJson.sponsorData=dataJson.sponsorData;
		    setSponsors(dataJson.sponsorData);
		    createInstaFeed();
		    addBlogPost(0,10,blogJson);
		    displayPagination();
        });
	}else{
		var tempJson=JSON.parse(sessionStorage.getItem("dataJson"));
    	blogJson.blogData=tempJson.blogData;
    	blogJson.sponsorData=tempJson.sponsorData;
    	setSponsors(tempJson.sponsorData);
		createInstaFeed();
    	addBlogPost(0,10,blogJson);
    	displayPagination();
	}
}
//creates the instagram feed and allows other pages to retrieve the instaFeed-----------------------------
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







//adds all of the blogPosts to the screen---------------------------------------
//blogJson: blogData=[title={}, description={}, imageHeader=[], subTitle={}, subParagraph={} subImage={}]
function addBlogPost(startNumber,endNumber,json){

	if(json.blogData.length<endNumber){
		endNumber=json.blogData.length;
	}
	for(var x=startNumber;x<endNumber;x++){
    

		$("#blogPostHolder>.row").append(
			'<div class="col-lg-4 col-md-6 col-sm-6 col-xs-12" onclick="goToBlogPage('+x+');">'+
				'<div class="blogPost">'+
				
					'<div class="blogPost-imgHolder" style="background-image:url('+json.blogData[x].imageHeader+');"></div>'+
							
					'<div class="blogPost-textHolder">'+
					    '<h4><b>'+json.blogData[x].title+'</b></h4>'+
					    '<p>'+json.blogData[x].description+'</p>'+
					'</div>'+
				'</div>'+
			'</div>'
		);

	}
}





//Redirects to the blogPost Page-----------------------------------------------
function goToBlogPage(index){
	//StatePage will use the sessionStorage to access the data needed to create the page
	sessionStorage.removeItem("blogData");
	var blogData={blogData:{}, sponsorData:{}}; 
	blogData.blogData=blogJson.blogData[index];
	blogData.sponsorData=blogJson.sponsorData;
	sessionStorage.setItem("blogData",JSON.stringify(blogData));
	window.location.href = "https://www.permanentroadtrip.com/webcontent/Blog/BlogPost.html";
}





//displays the pagination-----------------------------------------------------
//blogJson: blogData=[title={}, description={}, imageHeader=[], subTitle={}, subParagraph={} subImage={}]

function paginationClick(newCurrentPage){
	currentPage=newCurrentPage;

	$("#blogPagination").html("");
	$("#blogPostHolder>.row").html("");
	
	$("html, body").animate({scrollTop: "450px"});
	addBlogPost(newCurrentPage*10-10,newCurrentPage*10,blogJson);
	displayPagination();
}
//displays currentIndex, 2 indexes before/after, and prev/next
var currentPage=1;
function displayPagination(){
	var numberOfPages=Math.ceil(blogJson.blogData.length/10);
	if(numberOfPages==0){numberOfPages=1;}

	//following if statements prevent things from going wrong in the pagination like displaying the same number twice
	
	
	if(currentPage==1){//displays prev button but disables it if currentPage==numberOfPages
		$("#blogPagination").append(
			'<li id="pagination-next" class="disabled">'+
				'<a aria-label="Next">'+
					'<span aria-hidden="true">&laquo;</span>'+
				'</a>'+
			'</li>'
		);
	}else{
		$("#blogPagination").append(
			'<li id="pagination-next" onclick="paginationClick('+(currentPage-1)+')">'+
				'<a href="#!" aria-label="Next">'+
					'<span aria-hidden="true">&laquo;</span>'+
				'</a>'+
			'</li>'
		);
	}
	
	if(currentPage!==1){//displays 1
		$("#blogPagination").append(
			'<li onclick="paginationClick(1)"><a href="#!">'+1+'</a></li>'
		);
	}
	if(currentPage-2>=3){//adds ... because there is a number gap between 1 and the next number
		$("#blogPagination").append(
			'<li><a>...</a></li>'
		);
	}
	
	
	
	if(currentPage>3){//display 2 before current
		$("#blogPagination").append(
			'<li onclick="paginationClick('+(currentPage-2)+')"><a href="#!">'+(currentPage-2)+'</a></li>'
		);
	}
	if(currentPage>2){//display 1 before current
		$("#blogPagination").append(
			'<li onclick="paginationClick('+(currentPage-1)+')"><a href="#!">'+(currentPage-1)+'</a></li>'
		);
	}

	$("#blogPagination").append(//display current
		'<li class="active"><a>'+currentPage+'</a></li>'
	);

	if(currentPage<numberOfPages-1){//display 1 after current
		$("#blogPagination").append(
			'<li onclick="paginationClick('+(currentPage+1)+')"><a href="#!">'+(currentPage+1)+'</a></li>'
		);
	}
	if(currentPage<numberOfPages-2){//display 2 after current
		$("#blogPagination").append(
			'<li onclick="paginationClick('+(currentPage+2)+')"><a href="#!">'+(currentPage+2)+'</a></li>'
		);
	}
	
	
	if(currentPage+4<=numberOfPages){//adds ... because there is a number gap between the last index and the previous number
		$("#blogPagination").append(
			'<li><a>...</a></li>'
		);
	}	
	
	if(numberOfPages!==currentPage &&currentPage!==numberOfPages){//displays last page number
		$("#blogPagination").append(
			'<li onclick="paginationClick('+numberOfPages+')"><a href="#!">'+numberOfPages+'</a></li>'
		);
	}
	
	if(currentPage==numberOfPages){//displays prev button but disables it if currentPage==numberOfPages
		$("#blogPagination").append(
			'<li id="pagination-prev" class="disabled">'+
				'<a aria-label="Next">'+
					'<span aria-hidden="true">&raquo;</span>'+
				'</a>'+
			'</li>'
		);
	}else{
		$("#blogPagination").append(
			'<li id="pagination-prev" onclick="paginationClick('+(currentPage+1)+')">'+
				'<a href="#!" aria-label="Next">'+
					'<span aria-hidden="true">&raquo;</span>'+
				'</a>'+
			'</li>'
		);
	}

}




//filters the blogPosts---------------------------------------------------------
//blogJson: blogData=[title={}, description={}, imageHeader=[], subTitle={}, subParagraph={} subImage={}]
var prevSelected=$(".all");
function filterBlog(filteredString){
    selectedElement="."+filteredString;
	if($(selectedElement).attr("class").indexOf("active")!==-1){
		return; //if class is active then the info associated with the category is already displayed
	}

	$("#blogPagination").html("");
	$("#blogPostHolder>.row").html("");
	
	currentPage=1;
	
	$(prevSelected).removeClass("active");
	$(selectedElement).addClass("active");
	
	prevSelected=selectedElement;
	if(filteredString=="all"){
		addBlogPost(0,10,blogJson);
	    displayPagination();
	}else{
		var filteredJson = {
				blogData: []
		};
		for(var x=0;x<blogJson.blogData.length;x++){
			if(blogJson.blogData[x].category==filteredString){
				filteredJson.blogData.push(blogJson.blogData[x]);
			}
		}
		addBlogPost(0,10,filteredJson);
	    displayPagination();
	}
}

