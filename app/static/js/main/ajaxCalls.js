var $insertPoint = $('#insert-point');
var $loadIcon = $('#load-icon');
var $commentModal = $('#comment-modal');
var $originalRec = $('#original-rec');
var $commentInsertPoint = $('#comment-insert-point');
var $commentId = $('#comment_id');

function loadRecs(toSend){
    $loadIcon.show().next().hide().parent().attr('disabled', true);
    $.ajax({
        type: 'GET',
        contentType: 'application/json;charset=UTF-8',
        url: searchUrl,
        datatype: 'json',
        data: toSend,
        timeout: 5000
    }).always(function(data){
        page = toSend['page'] + 1;
        retrieveRecs(data);
    })
}

function retrieveRecs(id){
    $.ajax({
        type: 'GET',
        contentType: 'application/json;charset=UTF-8',
        url: recUrl,
        datatype: 'json',
        data: {'id': id},
        timeout: 5000
    }).done(function(data){
        if(data['status'] === 'PROGRESS')
            setTimeout(function(){
                retrieveRecs(id);
            }, 2000);
        else{
            $loadIcon.hide().next().show().parent().removeAttr('disabled');
            if (data['status'] === 'SUCCESS') {
                $insertPoint.before(data['inject']);
                flask_moment_render_all();
                $('.rec-container').on('click', '.single-rec', function () {
                    loadCommentModal($(this));
                });
            }else if (data['status'] === 'EMPTY')
                $insertPoint.hide();
            else
                $insertPoint.innerHTML('Error');
        }
    })
}

function loadCommentModal($rec){
    $commentModal.modal('show');
    $originalRec.html($rec.wrap('<p/>').parent().html()).children().addClass('col-xs-12 col-md-12 col-lg-12')
        .removeClass('col-xs-10 col-md-6 col-lg-4').removeAttr('id');
    $rec.unwrap('<p/>');
    $('.comment-container').remove();
    $commentId.val($rec.attr('id'));
    if($rec.find('.badge').text().trim() !== '0'){
        $.ajax({
            type: 'GET',
            contentType: 'applicatin/json;charset=UTF-8',
            url: commentUrl,
            datatype: 'json',
            data: {'id': $rec.attr('id')},
            timeout: 5000
        }).done(function(data){
            if(data['status'] === 'SUCCESS'){
                $commentInsertPoint.after(data['inject']);
                flask_moment_render_all();
            }
        });
    }
}
