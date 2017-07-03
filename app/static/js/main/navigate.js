$(function(){

    var $homeLink = $('#home-link');
    var $postLink = $('#post-link');
    var $postModal = $('#post-modal');
    var $loginModal = $('#login-modal');
    var $navbarCollapse = $('.navbar-collapse');
    var $insertPoint = $('#insert-point');
    var $loadIcon = $('#load-icon');
    var $loadButton = $('#load-button');
    var $searchForm = $('#search-form');
    var $searchBar = $('#search-bar');
    var _throttleTimer = null;
    var page = 2;


    //scroll load
    $(window).off('scroll', scrollHandler).on('scroll', scrollHandler);
    $loadButton.on('click', loadRecs);

    //navbar
    $(document).click(function(e){
        var clickOver = $(e.target);
        if($navbarCollapse.hasClass('in') && !clickOver.hasClass('navbar-toggle') && !clickOver.hasClass('search-bar'))
            $navbarCollapse.collapse('hide');
    });

    $homeLink.on('click', function(e){
        e.preventDefault();
        $('.rec-container').remove();
        $insertPoint.show();
        loadRecs({'page': 1, 'user': user})
    });

    //modals
    $postLink.on('click', function(){
        $postModal.modal('show');
    });


    if(id == -1)
        $loginModal.modal({'backdrop': 'static'}).modal('show');
    else
        setTimeout(function(){
            retrieveRecs(id);
        }, 1000);


    $searchForm.on('submit', function(e){
        e.preventDefault();
        $('.rec-container').remove();
        $insertPoint.show();
        loadRecs({'page': 1, 'term': $searchBar.val()});
    });


    function scrollHandler(){
        clearTimeout(_throttleTimer);
        _throttleTimer = setTimeout(function(){
            if($(window).scrollTop() + $(window).height() > getDocHeight() - 100 &&
                !$loadIcon.parent().prop('disabled') && $insertPoint.is(':visible')) {
                if($searchBar.val().length > 0){
                    loadRecs({'page': 1, 'term': $searchBar.val()});
                }else {
                    loadRecs({'page': page, 'user': user});
                }
            }
        }, 500);
    }

});

function getDocHeight() {
    var D = document;
    return Math.max(
        D.body.scrollHeight, D.documentElement.scrollHeight,
        D.body.offsetHeight, D.documentElement.offsetHeight,
        D.body.clientHeight, D.documentElement.clientHeight
    );
}


