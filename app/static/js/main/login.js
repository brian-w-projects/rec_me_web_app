$(function(){

    var $loginModal = $('#login-modal');
    var $username = $('#username').data('min', 5);
    var $password = $('#password').data('min', 7);
    var $login = $('#login');
    var $form = $('form');
    var $alert = $('.alert');


    //tooltip
    $('[data-toggle="tooltip"]').tooltip();


    //login form
    $username.add($password).on('keyup', validatePositive).on('keyup', validateLogin)
        .on('blur', validateNegative).on('focus', function(){
            $login.removeClass('btn-danger').addClass('btn-default').button('reset');
            $alert.css('visibility', 'hidden');
        });

    $login.on('click', function(e){
        e.preventDefault();
        $login.button('loading');
        $.ajax({
            type: 'POST',
            data: $form.serialize(),
            url: loginUrl,
            timeout: 20000
        }).done(function(e) {
           if(e['status'] !== 'SUCCESS'){
               $login.removeClass('btn-default').addClass('btn-danger').text('Error');
               $alert.css('visibility', 'visible').text('Please check username and password');
               $username.parent().addClass('has-error').removeClass('has-success has-warning');
               $username.next().addClass('glyphicon-remove').removeClass('glyphicon-ok glyphicon-warning-sign');
               $password.parent().addClass('has-error').removeClass('has-success has-warning');
               $password.next().addClass('glyphicon-remove').removeClass('glyphicon-ok glyphicon-warning-sign');

           }else{
               $login.addClass('btn-success').removeClass('btn-default').text('Success');
               setTimeout(function(){
                   $loginModal.modal('hide');
                   retrieveRecs(e['id']);
               }, 1000);
           }
        }).error(function(){
            $login.removeClass('btn-default').addClass('btn-danger').text('Error');
            $alert.css('visibility', 'visible').text('There has been a problem on our end. Please ' +
                'try again later');
        });
    });

    function validateLogin() {
        if ($username.val().length >= $username.data('min') && $password.val().length >= $password.data('min'))
            $login.removeAttr('disabled');
        else
            $login.attr('disabled', true);
    }

});



function validatePositive(e){
    var $toModify = $(e.target);
    if($toModify.val().length >= $toModify.data('min')){
        $toModify.parent().addClass('has-success').removeClass('has-warning has-error').tooltip('hide');
        $toModify.next().addClass('glyphicon-ok').removeClass('glyphicon-warning-sign glyphicon-remove');
    }else{
        $toModify.parent().removeClass('has-success');
        $toModify.next().removeClass('glyphicon-ok');
    }
}

function validateNegative(e){
    var $toModify = $(e.target);
    if($toModify.val().length < $toModify.data('min')){
        $toModify.parent().addClass('has-warning').removeClass('has-success has-error').tooltip('show');
        $toModify.next().addClass('glyphicon-warning-sign').removeClass('glyphicon-ok glyphicon-remove');
    }
}