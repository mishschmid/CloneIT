'use strict';
//jQuery.noConflict();

//(function( $ ) {


//TODO: Change global scope of variables
//***********************************************
// GLOBAL VARIABLES
//***********************************************
var linkList = [];
var currentLoadCount = 0;


//***********************************************
// NEW LINK - Definition of "newLink" object
//***********************************************
var newLink = function (text, link, picurl, comments) {
    this.id = linkList.length;
    this.text = text;
    this.link = link;
    this.picurl = picurl;
    this.ups = 0;
    this.downs = 0;
    this.comments = comments;
};


//****************************************************
// RELOAD LAYOUT - Reorder #container-div elements
//****************************************************
var reloadLayout = function () {
    setTimeout(function () {
        $('#container').isotope('reloadItems').isotope({sortBy: 'original-order'});
    }, 201);
};


//***********************************************
// SHOW COMMENTS - Get & show the comments
//***********************************************
var showComments = function (postID) {
    var currentComments = linkList[postID].comments;

    // Clear the current comments-HTML
    $('#' + postID + ' .comments-text').html('');

    // Iterate over comments of linkList object to prepend comments
    for (var i = currentComments.length - 1; i >= 0; i--) {
        $('#' + postID).find('div.comments-text').prepend('<hr/><p class="comment-title">' + currentComments[i] + '</p>');
    }
};


//***********************************************
// TOGGLE COMMENTS - Show/hide the comments-div
//***********************************************
// TODO: Check if comments container can be targeted with a class instead of an element
// Step down the DOM to the next children div & toggle the selected div (comments-container)
var toggleComments = function (postID) {
    $('#' + postID).children('div').toggle(200);
    reloadLayout();
};


//**************************************************************************************************************
// SHOW COMMENTS WITHOUT ID - Get the post ID - get & show the comments - then toggle the comments box
//**************************************************************************************************************
var showCommentsWithoutID = function (e) {

    // Select right newLink object
    var postID = $(e.currentTarget).closest('.post').attr('id');
    showComments(postID);
    toggleComments(postID);
};


//***********************************************
// POST COMMENT - Add a new comment
//***********************************************
var postComment = function (e) {

    // Get the input value of the right container
    var postID = $(e.currentTarget).closest('.post').attr('id');
    var newComment = $('#' + postID + ' input').val();

    // Save input value to newLink object
    linkList[postID].comments.push(newComment);

    // Call the showComments function to show the new comment, then adapt layout
    showComments(postID);
    reloadLayout();
};


//*************************************************************************
// LOAD LINK DATA - Load the data from linkList object and initialize posts
//*************************************************************************
var loadLinkData = function (linkList) {

    // We need this counter to set the background color of each post
    var backgroundCounter = 0;
    var backgroundList = ['first-bg', 'second-bg', 'third-bg', 'fourth-bg', 'fifth-bg', 'sixth-bg', 'seventh-bg', 'eighth-bg', 'ninth-bg', 'tenth-bg'];

    // Here we load the posts that have not yet been loaded -> that's why we start iterating with the currentLoadCount
    for (var i = currentLoadCount; i < linkList.length; i++) {

        if (backgroundCounter >= 5) {
            backgroundCounter = 0;
        }

        var $clone = $('#template-post').clone(true);
        $clone.attr('id', i);
        $clone.addClass(backgroundList[backgroundCounter]);
        $clone.find('.post-title').text(linkList[i].text);
        $clone.find('a:first').attr('href', linkList[i].link);
        $clone.find('.post-pic img').attr('src', linkList[i].picurl);
        $clone.find('a[data-function]').addClass(i);
        $('#container').prepend($clone);
        backgroundCounter++;
    }

    currentLoadCount = linkList.length;
    reloadLayout();
};


//****************************************************************
// GENERATE NEW LINK - Generate a new post with text and link
//****************************************************************
var generateNewLink = function () {

    // Check if all fields are filled out
    var failed = false;

    // TODO: Check if there is a simpler selection for it
    $('#big-nav input').each(function () {
        if ($(this).val() === '') {
            failed = true;
        }
    });

    if (failed === true) {
        alert('Please fill out all fields');

    } else {
        var link = new newLink($('#text-input').val(), $('#link-input').val(), 'images/panther.png', new Array());
        linkList.push(link);
        loadLinkData(linkList);
    }
};


//***********************************************
// DELETE POST
//***********************************************
var deletePost = function (e) {
    $(e.currentTarget).closest('.post').hide(200, function () {
        $('#container').isotope('remove', e.currentTarget);
    });
    reloadLayout();
};


//***********************************************
// ADD COMMENT BY KEY - Keyhandler for "enter"-key to add comment
//***********************************************
        var addByKey = function (e) {
            if (event.which == 13) {
                if (e.currentTarget.id == 'link-input' || e.currentTarget.id == 'text-input') {
                    generateNewLink();
                }
                else {
                    postComment(e);
                }

            }
};


//***********************************************
// VOTE UP
//***********************************************
var voteUp = function (e) {
    var postID = $(e.currentTarget).closest('.post').attr('id');
    linkList[postID].ups++;
    var ups = linkList[postID].ups;
    $(e.currentTarget).before().html('<span class="vote-number">' + ups + '</span>');
};


//***********************************************
// VOTE DOWN
//***********************************************
var voteDown = function (e) {
    var postID = $(e.currentTarget).closest('.post').attr('id');
    linkList[postID].downs++;
    var downs = linkList[postID].downs;
    $(e.currentTarget).prepend().html('<span class="vote-number">' + downs + '</span>');
};


//***********************************************
// SHOW NAVIGATION
//***********************************************
var showNavigation = function () {
    $('#big-nav').toggle(300);
};


//***********************************************
// EVENT HANDLERS
//***********************************************
$(document).ready(function () {

// 1. GENERATE NEW LINK WITH TITLE AND ADD IT ON THE TOP OF THE FEED
    $('#new-link').on('click',generateNewLink);

// 2. SHOW/HIDE COMMENTS OF A POSTS
    $('a[data-function="show-comments"]').on('click', showCommentsWithoutID);

// 3. ADD NEW COMMENT UNDER LAST COMMENT OF POST
    $('.comment-button').on('click', postComment);

// 4. DELETE POST
    $('a[data-function="delete"]').on('click', deletePost);

// 5. KEY HANDLER FOR ADDING A COMMENT
    $('input').on('keydown', addByKey);

// 6. UPVOTING
    $('a[data-function="upvote"]').on('click', voteUp);

// 7. DOWNVOTING
    $('a[data-function="downvote"]').on('click', voteDown);

// 8. SHOW NAVIGATION
    $('#show-nav').on('click', showNavigation);
    $('#profile-pic').on('click', showNavigation);

// 9. CHANGE THEME
    $('#salmon').on('click', function(e){
        e.preventDefault();
        setActiveStyleSheet('default');
    });
    $('#usa').on('click', function(e){
        e.preventDefault();
        setActiveStyleSheet('usa');
    });
    $('#marine').on('click', function(e){
        e.preventDefault();
        setActiveStyleSheet('marine');
    });
});


//***********************************************
// ISOTOPE LAYOUT - Initialization
//***********************************************
$(document).ready(function () {
    var $container = $('#container');
    // init
    $container.isotope({
        // options
        itemSelector: '.item',
        masonry: {
            columnWidth: 0
        }
    });
});


loadTestData();
$(document).foundation();
//})(jQuery);
