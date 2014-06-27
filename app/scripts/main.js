//***********************************************
// GLOBAL VARIABLES
//***********************************************
var linkList = [];
var CurrentLoadCount = 0;


//***********************************************
// NEW LINK - Definition of "newLink" object
//***********************************************
function newLink (text, link, picurl, comment) {
    this.id = linkList.length;
    this.text = text;
    this.link = link;
	this.picurl = picurl;
    this.ups = 0;
    this.downs = 0;
    this.comment = comment;
}


//***********************************************
// ISOTOPE LAYOUT - Initialize the Isotope layout
//***********************************************
$(document).ready(function () {
    var $container = $('#container')
		// init
        $container.isotope({
            // options
            itemSelector: '.item',
            masonry: {
                columnWidth: 0
            }
        });
    });


//***********************************************
// POST COMMENT - Add a new comment
//***********************************************
var postComment = function postComment(e){

	//Get the input value of the right container
	var postID = $(e.currentTarget).closest('.item').attr('id');
	var newComment = $('#'+postID + ' input').val();

	//Save input value to newLink object
	linkList[postID].comment.push(newComment);
	console.log(linkList[postID].comment);

	//Call the showComments function to show the new comment, then adapt layout
	showComments(postID);
	reloadLayout();
};


//**************************************************************************************************************
// SHOW COMMENTS WITHOUT ID - Get the post ID - get & show the commments - then toggle the comments box
//**************************************************************************************************************
var showCommentsWithoutID = function showCommentsWithoutID(e){

	//Select right newLink object
	var postID = $(e.currentTarget).closest('.item').attr('id');
	showComments(postID);
	toggleComments(postID);
};


//***********************************************
// SHOW COMMENTS - Get & show the comments
//***********************************************
var showComments = function (postID){
	var currentComments = linkList[postID].comment;

	//Clear the current commments-HTML
	$('#'+postID+' .comments-text').html('');

	//Iterate over comments of linkList object to prepend comments
	for (var i = currentComments.length-1; i >= 0; i--) {
		$('#'+ postID).find('div.comments-text').prepend('<hr/><p class="comment-title">'+currentComments[i]+'</p>');
	}
};


//***********************************************
// TOGGLE COMMENTS - Show/hide the comments-div
//***********************************************

//Step down the DOM to the next children div & toggle the selected div (comments-container)
var toggleComments = function toggleComments (postID){
    $('#'+postID).children('div').toggle(200);
    reloadLayout();
};


//****************************************************
// RELOAD LAYOUT - Reorder #container-div elements
//****************************************************
	var reloadLayout = function(){ setTimeout(function(){
        $('#container').isotope( 'reloadItems' ).isotope({sortBy: 'original-order'});
        },201);
	};


//****************************************************************
// GENERATE NEW LINK - Generate a new post with text and link
//****************************************************************
var generateNewLink = function generateNewLink() {

	//Check if all fields are filled out
	var failed = false;

	$('#big-nav input[type="text"]').each(function () {
		if ($(this).val() == "") {
			failed = true;
		}
	});

	if (failed == true) {
		alert("Please fill out all fields");

	} else {
		var link = new newLink($('#text-input').val(), $('#link-input').val());
		linkList.push(link);
		loadLinkData(linkList);
	}
};


//*************************************************************************
// LOAD LINK DATA - Load the data from linkList object and initialize posts
//*************************************************************************
var loadLinkData = function (linkList) {

    //We need this counter to set background colors of the post
	var background_counter = 0;
	var background_list = ['first-bg', 'second-bg', 'third-bg', 'fourth-bg', 'fifth-bg', 'sixth-bg', 'seventh-bg', 'eighth-bg', 'ninth-bg', 'tenth-bg']

    //
	for (var i = CurrentLoadCount; i < linkList.length; i++) {

		if (background_counter >= 5) {
			background_counter = 0
		}


		var $clone = $('#template-post').clone();
		$clone.attr('id', i);
		$clone.addClass(background_list[background_counter]);
		$clone.find('.post-title').text(linkList[i].text);
		$clone.find('a:first').attr('href', linkList[i].link);
		$clone.find('.post-pic img').attr('src', linkList[i].picurl);
		$clone.find('a[data-function]').addClass(i);
		$('#container').prepend($clone).isotope('reloadItems').isotope({sortBy: 'original-order'});
        background_counter++;
	}

	CurrentLoadCount = linkList.length;
};


//***********************************************
// DELETE POST
//***********************************************
var deletePost = function (e) {

	//Step up to the respective post-container, first hide and then delete it
    $(e.currentTarget).parent().parent().parent().hide(200, function(){$('#container').isotope('remove', e.currentTarget);});
    setTimeout (function(){$('#container').isotope( 'layout' );},201);
};


//***********************************************
// ADD COMMENT BY KEY - Keyhandler for "enter"-key to add comment
//***********************************************
var addCommentbyKey = function(){
    if (event.which == 13) {
        postComment(e.currentTarget);
    }
};

//***********************************************
// VOTE UP
//***********************************************
var voteUp = function (e) {
    var postID = $(e.currentTarget).parent().parent().parent().attr('id');
    linkList[postID].ups++;
    var ups = linkList[postID].ups;
    $(e.currentTarget).before().html('<span class="vote-number">'+ups+'</span>');
};


//***********************************************
// VOTE DOWN
//***********************************************
var voteDown = function (e) {
    var postID = $(e.currentTarget).parent().parent().parent().attr('id');
    console.log(linkList[postID]);
    linkList[postID].downs++;
    var downs = linkList[postID].downs;
    $(e.currentTarget).prepend().html('<span class="vote-number">'+downs+'</span>');
};


//***********************************************
// SHOW NAVIGATION
//***********************************************
var showNavigation = function() {
    $('#big-nav').toggle(300);
};








//***********************************************
//EVENT HANDLERS
//***********************************************
$(document).ready(function(){
    loadTestData();

//1. GENERATE NEW LINK WITH TITLE AND ADD IT ON THE TOP OF THE FEED
    $('#new-link').on('click',generateNewLink);

//2. SHOW/HIDE COMMENTS OF A POSTS
    $('a[data-function="show-comments"]').on('click', showCommentsWithoutID);

//3. ADD NEW COMMENT UNDER LAST COMMENT OF POST
    $('.comment-button').on('click', postComment);

//4. DELETE POST
    $('a[data-function="delete"]').on('click', deletePost);

//5. KEY HANDLER FOR ADDING A COMMENT
    $('input').on('keydown', addCommentbyKey);

//6. UPVOTING
    $('a[data-function="upvote"]').on('click', voteUp);

//7. DOWNVOTING
    $('a[data-function="downvote"]').on('click', voteDown);

//8. SHOW NAVIGATION
    $('#show-nav').on('click', showNavigation);
	$('#profile-pic').on('click', showNavigation);
});









//***********************************************
//LOAD TEST POSTS
//***********************************************
var loadTestData = function() {
    var newLink1 = new newLink('Do dogs of one breed prefer to be with their own breed?','https://www.google.ch', 'images/panther.png', ['Was auch immer, ich kann einfach nicht deiner Meinung sein', 'blabla1', 'haligali1']);
    linkList.push(newLink1);

    var newLink2 = new newLink('Mooooodle','http://http://moodle.hsr.ch/', 'images/husky.png', ['comment2', 'Sodeli Sodela immer schöns Bergli uf', 'haligali2']);
    linkList.push(newLink2);

	var newLink3 = new newLink('We are candidates for the Pirate Party in Denmark. Do dogs of one breed prefer to be with their own breed? Do dogs of one breed prefer to be with their own breed?', 'https://www.google.ch',  'images/bunny.png', ['comment1', 'blabla1', 'haligali1']);
    linkList.push(newLink3);

    var newLink4 = new newLink('Do dogs of one breed prefer to be with their own breed?','http://http://moodle.hsr.ch/', 'images/panther.png', ['comment owou uqpwe nicht ohne meine Mutter', 'blabla2', 'haligali2']);
    linkList.push(newLink4);

	var newLink5 = new newLink('Gooooooogle','https://www.google.ch', 'images/husky.png',['comment upqwepur upqiwuerp ou', 'blabla1', 'haligali1']);
    linkList.push(newLink5);

    var newLink6 = new newLink('We are candidates for the Pirate Party in Denmark. Do dogs of one breed prefer to be with their own breed? Do dogs of one breed prefer to be with their own breed?', 'http://http://moodle.hsr.ch/', 'images/bunny.png', ['comment2', 'blabla2', 'haligali2']);
    linkList.push(newLink6);

	var newLink7 = new newLink('Gooooooogle', 'https://www.google.ch', 'images/panther.png', ['comment ajskdfj jasdjkiuweq u pqu qpuwer uq upqewur upqewrup', 'blabla1', 'haligali1']);
    linkList.push(newLink7);

    var newLink8 = new newLink('We are candidates for the Pirate Party in Denmark. Do dogs of one breed prefer to be with their own breed?', 'http://http://moodle.hsr.ch/', 'images/husky.png', ['comment2', 'blabla2', 'haligali2']);
    linkList.push(newLink8);

	var newLink9 = new newLink('Gooooooogle', 'https://www.google.ch', 'images/bunny.png', ['comment1', 'blabla1', 'haligali1']);
    linkList.push(newLink9);

    var newLink10 = new newLink('Do dogs of one breed prefer to be with their own breed?', 'http://http://moodle.hsr.ch/', 'images/panther.png', ['comment2', 'blabla2', 'haligali2']);
    linkList.push(newLink10);

	var newLink11 = new newLink('Do dogs of one breed prefer to be with their own breed?', 'https://www.google.ch', 'images/husky.png', ['comment1', 'blabla1', 'haligali1']);
    linkList.push(newLink11);

    var newLink12 = new newLink('Mooooodle', 'http://http://moodle.hsr.ch/', 'images/bunny.png', ['comment2', 'blabla2', 'haligali2']);
    linkList.push(newLink12);

	var newLink13 = new newLink('We are candidates for the Pirate Party in Denmark. Do dogs of one breed prefer to be with their own breed? Do dogs of one breed prefer to be with their own breed?', 'https://www.google.ch', 'images/panther.png', ['comment1', 'blabla1', 'haligali1']);
    linkList.push(newLink13);

    var newLink14 = new newLink('Do dogs of one breed prefer to be with their own breed?','http://http://moodle.hsr.ch/', 'images/husky.png',['comment2', 'blabla2', 'haligali2']);
    linkList.push(newLink14);

	var newLink15 = new newLink('Gooooooogle','https://www.google.ch', 'images/bunny.png', ['comment1', 'blabla1', 'haligali1']);
    linkList.push(newLink15);

    var newLink16 = new newLink('We are candidates for the Pirate Party in Denmark. Do dogs of one breed prefer to be with their own breed? Do dogs of one breed prefer to be with their own breed?', 'http://http://moodle.hsr.ch/', 'images/panther.png', ['comment2', 'blabla2', 'haligali2']);
    linkList.push(newLink16);

	var newLink17 = new newLink('Gooooooogle','https://www.google.ch', 'images/husky.png', ['comment1', 'blabla1', 'haligali1']);
    linkList.push(newLink17);

    var newLink18 = new newLink('We are candidates for the Pirate Party in Denmark. Do dogs of one breed prefer to be with their own breed? ', 'http://http://moodle.hsr.ch/', 'images/bunny.png', ['comment2', 'blabla2', 'haligali2']);
    linkList.push(newLink18);

	var newLink19 = new newLink('Gooooooogle', 'https://www.google.ch', 'images/panther.png', ['comment1', 'blabla1', 'haligali1']);
    linkList.push(newLink19);

    var newLink20 = new newLink('Do dogs of one breed prefer to be with their own breed?','http://http://moodle.hsr.ch/', 'images/husky.png', ['Soddom & Gomorroha', 'Heitere Fahne', 'Immer diese Kommentare, das kann einem ja echt auf den Sack gehen', 'Jetzt aber mal halblang']);
    linkList.push(newLink20);

    loadLinkData(linkList);

};

//***********************************************
// SET BACKGROUND COLOR
//***********************************************
var setBackgroundColor = function() {

	for (var i=0; i <= linkList.length; i++){
		var postID = $('#'+i).addClass('primary-color')
	}
}