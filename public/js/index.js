/*globals $:false, console:false, io:false*/
$(function(){
    "use strict";
    var $form = $('#J_Form'),
        $Check = $('#J_IsSignin'),
        $submit = $('#J_Submit'),
        $name = $('#J_Name'),
        $pw = $('#J_Password');

    $Check.click(function(){
        if($(this).is(':checked')){
            $submit.text('Sign Up & Log In');
        }else{
            $submit.text('Log In');
        }
    });
    $submit.click(function(event){
        event.preventDefault();
        var name = $name.val(),
            pw = $pw.val();
        if(name === '' || pw === '') {
            alert('');
            return;
        }
        //login
        if(!$Check.is(':checked')) {
            $.ajax({
                type: 'POST',
                url: '/login',
                data: {
                    username: name,
                    password: pw
                },
                success: function(data) {
                    $form.submit();
                }
            }).fail(function(data){
                switch (data.status) {
                    case 400:
                        alert('Username Not Registered');
                        break;
                    case 401:
                        alert('Wrong Password');
                        break;
                }
            });;
        }
        //signin
        else{
            $.ajax({
                type: 'POST',
                url: '/signin',
                data: {
                    username: name,
                    password: pw
                },
                success: function(data) {
                    $form.submit();
                }
            }).fail(function(data){
                switch (data.status) {
                    case 400:
                        alert('Username Already Used');
                        break;
                }
            });
        }

    });
});