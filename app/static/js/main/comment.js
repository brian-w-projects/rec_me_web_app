$(function(){

    var $commentText = $('#comment_text').data('max', 250);
    var $commentLogin = $('#comment-login');
    var $commentAlert = $('#comment-alert');
    var $commentForm = $('#comment-form');
    var $originalRec = $('#original-rec');
    var $commentInsertPoint = $('#comment-insert-point');

    $commentText.on('input', function(){
       lengthUpdate($(this));
       if( $(this).val().length > 0){
           $commentLogin.removeAttr('disabled');
       }else{
           $commentLogin.attr('disabled', true);
       }
    });

    $commentLogin.on('click', function(e){
       e.preventDefault();
       $commentLogin.button('loading');
       $.ajax({
           type: 'POST',
           data: $commentForm.serialize(),
           url: postCommentUrl,
           timeout: 10000
       }).done(function(data){
           if(data['status'] === 'SUCCESS'){
               $commentInsertPoint.next().children().prepend(data['inject']);
               flask_moment_render_all();
               $commentLogin.addClass('btn-success').removeClass('btn-default').text('Success');
               setTimeout(function(){
                   updateCommentForm(data['id']);
               }, 1000);

           }else{
               $commentLogin.removeClass('btn-default').addClass('btn-danger').text('Error');
               $commentAlert.css('visibility', 'visible').text('Please check comment entry');
           }
       }).error(function(){
          $commentLogin.removeClass('btn-default').addClass('btn-danger').text('Error');
          $commentAlert.css('visibility', 'visible').text(
              'There has been a problem on our end. Please try again later.');
       });
    });


    function lengthUpdate($ele){
        $commentLogin.removeClass('btn-danger').addClass('btn-default').button('reset');
        $commentAlert.css('visibility', 'hidden');
        var max = $ele.data('max');
        if($ele.val().length > max){
            $ele.val($ele.val().toString().substr(0, max));
        }
        $ele.prev().text(max-$ele.val().length);
    }

    function updateCommentForm(id){
        $commentText.val('').prev().text($commentText.data('max'));
        $commentLogin.addClass('btn-default').removeClass('btn-success').button('reset');
        var $modify = $originalRec.find('.badge-value');
        $modify.text(parseInt($modify.text()) + 1);
        $('#'+id).find('.badge-value').text($modify.text());
    }
});