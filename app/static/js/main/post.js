$(function(){

    var $postLink = $('#post-link');
    var $postModal = $('#post-modal');
    var $postTitle = $('#post_title').data('max', 100);
    var $postText = $('#post_text').data('max', 500);
    var $postLogin = $('#post-login');
    var $postForm = $('#post-form');
    var $postAlert = $('#post-alert');
    var $option1 = $('#option1');
    var $option2 = $('#option2');


    $postTitle.add($postText).on('input', function(){
        lengthUpdate($(this));
        if($postTitle.val().length > 0 && $postText.val().length > 0){
            $postLogin.removeAttr('disabled');
        }else{
            $postLogin.attr('disabled', true);
        }
    });

    $postLogin.on('click', function(e){
        e.preventDefault();
        $postLogin.button('loading');
        var toSend = $postForm.serialize();
        if($option1.parent().hasClass('active'))
            toSend += '&post_public=y';
        $.ajax({
            type: 'POST',
            data: toSend,
            url: postUrl,
            timeout: 10000
        }).done(function(e){
            if(e['status'] === 'SUCCESS') {
                $postLogin.addClass('btn-success').removeClass('btn-default').text('Success');
                setTimeout(resetForm, 500);
            }else{
                $postLogin.toggle('btn-default btn-danger').text('Error');
                $postAlert.css('visibility', 'visible').text('Please check post entry');
            }
        }).error(function(){
            $postLogin.toggle('btn-default btn-danger').text('Error');
            $postAlert.css('visibility', 'visible').text(
                'There has been a problem on our end. Please try again later');
        });
    });

    function lengthUpdate($ele){
        $postLogin.removeClass('btn-danger').addClass('btn-default').button('reset');
        $postAlert.css('visibility', 'hidden');
        var max = $ele.data('max');
        if($ele.val().length > max)
            $ele.val($ele.val().toString().substr(0, max));
        $ele.prev().text(max-$ele.val().length);
    }

    function resetForm(){
        $postModal.modal('hide');
        $postTitle.val('').prev().text($postTitle.data('max'));
        $postText.val('').prev().text($postText.data('max'));
        $option1.parent().addClass('active');
        $option2.parent().removeClass('active');
        $postLogin.addClass('btn-default').removeClass('btn-success').button('reset');
    }
});