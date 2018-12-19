//mapData=[title={},image=[], description=[], state={}, latitude={}, longitude={},keyWords={}],
//stateData=[state={}imageHeader={},subTitle={},subParagraphs={}, latitude={}, longitude{}}],
//blogData=[title={}, description={}, imageHeader=[], subTitle={}, subParagraph={} subImage={}],
//productsData=[title={},affiliateLink=[], image={}, price={}, category={}]

//productJson is the only one used for this page
var productsJson= {
		productsData:[]
};
//receives json that holds data for all of the pages
function getDataJson(){
    var storedDataJson=sessionStorage.getItem("dataJson");
	if(storedDataJson===null){
        $.get("https://www.permanentroadtrip.com/webcontent/server.php", function(data){
            dataJson=JSON.parse(data);
   
            sessionStorage.setItem("dataJson",data);
		    productsJson.productsData=dataJson.productsData;
		    setSponsors(dataJson.sponsorData);
		    createInstaFeed();
			displayProducts(0,20,productsJson);
			displayPagination(productsJson);
        });
	}else{
		var tempJson=JSON.parse(sessionStorage.getItem("dataJson"));
		productsJson.productsData=tempJson.productsData;
		setSponsors(tempJson.sponsorData);
		createInstaFeed();
		displayProducts(0,20,productsJson);
		displayPagination(productsJson);
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



//displays the products-------------------------------------------------------
//productsJson=productsData:[title={},affiliateLink=[], image={}, price={}, category={}]

//subset of the productsJson-filtered
var jsonInUse;
function displayProducts(startNumber,endNumber,json){

	jsonInUse=json;
	if(json.productsData.length<endNumber){
		endNumber=json.productsData.length;
	}
	
	for(var x=startNumber;x<endNumber;x++){
		$("#productsHolder").append(
			'<div class="col-lg-3 col-sm-4 col-sm-4 col-xs-6 products">'+
				'<a href="'+json.productsData[x].affiliateLink+'">'+
				
					'<div class="products-img" role="presentation" style="background-image: url('+json.productsData[x].image+');">'+
					'</div>'+
			          	
					'<div class="products-desc">'+
						'<h3 class="products-title">'+json.productsData[x].title+'</h3>'+
						'<p class="products-price">Around $'+json.productsData[x].price+' on Amazon</p>'+
				'</div>'+
						
				'</a>'+		
			'</div>'
		);
	}
}





//filters the products---------------------------------------------------------
//productsJson=productsData:[title={},affiliateLink=[], image={}, price={}, category={}]
var prevSelected=$("#all");
function filterProducts(selectedElement){
	if($(selectedElement).attr("class").indexOf("active")!==-1){
		return; //if class is active then the info associated with the category is already displayed
	};
	
	var filteredString=selectedElement.innerHTML.toLowerCase();
	$("#productPagination").html("");
	$("#productsHolder").html("");
	//in paginationDisplayer
	currentPage=1;
	$(prevSelected).removeClass("active");
	$(selectedElement).addClass("active");
	prevSelected=selectedElement;
	if(filteredString=="all"){
		displayProducts(0,19,productsJson);
		displayPagination(productsJson);
	}else{
		var filteredJson = {
				productsData: []
		};
		for(var x=0;x<productsJson.productsData.length;x++){
			if(productsJson.productsData[x].category==filteredString){
				filteredJson.productsData.push(productsJson.productsData[x]);
			}
		}
		displayProducts(0,19,filteredJson);
		displayPagination(filteredJson);
	}
}








//displays the pagination-----------------------------------------------------
//productsJson=productsData:[title={},affiliateLink=[], image={}, price={}, category={}]
//subset of the productsJson-filtered
//var jsonInUse;
function paginationClick(newCurrentPage){
	currentPage=newCurrentPage;

	$("#productPagination").html("");
	$("#productsHolder").html("");
	
	$("html, body").animate({scrollTop: "450px"});
	displayProducts(newCurrentPage*20-20,newCurrentPage*20,jsonInUse);
	displayPagination(jsonInUse);
}
//displays currentIndex, 2 indexes before/after, and prev/next
var currentPage=1;
function displayPagination(json){
	var numberOfPages=Math.ceil(json.productsData.length/20);
	if(numberOfPages==0){numberOfPages=1;}

	//following if statements prevent things from going wrong in the pagination like displaying the same number twice
	
	
	if(currentPage==1){//displays prev button but disables it if currentPage==numberOfPages
		$("#productPagination").append(
			'<li id="pagination-next" class="disabled">'+
				'<a aria-label="Next">'+
					'<span aria-hidden="true">&laquo;</span>'+
				'</a>'+
			'</li>'
		);
	}else{
		$("#productPagination").append(
			'<li id="pagination-next" onclick="paginationClick('+(currentPage-1)+')">'+
				'<a href="#!" aria-label="Next">'+
					'<span aria-hidden="true">&laquo;</span>'+
				'</a>'+
			'</li>'
		);
	}
	
	if(currentPage!==1){//displays 1
		$("#productPagination").append(
			'<li onclick="paginationClick(1)"><a href="#!">'+1+'</a></li>'
		);
	}
	if(currentPage-2>=3){//adds ... because there is a number gap between 1 and the next number
		$("#productPagination").append(
			'<li><a>...</a></li>'
		);
	}
	
	
	
	if(currentPage>3){//display 2 before current
		$("#productPagination").append(
			'<li onclick="paginationClick('+(currentPage-2)+')"><a href="#!">'+(currentPage-2)+'</a></li>'
		);
	}
	if(currentPage>2){//display 1 before current
		$("#productPagination").append(
			'<li onclick="paginationClick('+(currentPage-1)+')"><a href="#!">'+(currentPage-1)+'</a></li>'
		);
	}

	$("#productPagination").append(//display current
		'<li class="active"><a>'+currentPage+'</a></li>'
	);

	if(currentPage<numberOfPages-1){//display 1 after current
		$("#productPagination").append(
			'<li onclick="paginationClick('+(currentPage+1)+')"><a href="#!">'+(currentPage+1)+'</a></li>'
		);
	}
	if(currentPage<numberOfPages-2){//display 2 after current
		$("#productPagination").append(
			'<li onclick="paginationClick('+(currentPage+2)+')"><a href="#!">'+(currentPage+2)+'</a></li>'
		);
	}
	
	
	if(currentPage+4<=numberOfPages){//adds ... because there is a number gap between the last index and the previous number
		$("#productPagination").append(
			'<li><a>...</a></li>'
		);
	}	
	
	if(numberOfPages!==currentPage &&currentPage!==numberOfPages){//displays last page number
		$("#productPagination").append(
			'<li onclick="paginationClick('+numberOfPages+')"><a href="#!">'+numberOfPages+'</a></li>'
		);
	}
	
	if(currentPage==numberOfPages){//displays prev button but disables it if currentPage==numberOfPages
		$("#productPagination").append(
			'<li id="pagination-prev" class="disabled">'+
				'<a aria-label="Next">'+
					'<span aria-hidden="true">&raquo;</span>'+
				'</a>'+
			'</li>'
		);
	}else{
		$("#productPagination").append(
			'<li id="pagination-prev" onclick="paginationClick('+(currentPage+1)+')">'+
				'<a href="#!" aria-label="Next">'+
					'<span aria-hidden="true">&raquo;</span>'+
				'</a>'+
			'</li>'
		);
	}

}