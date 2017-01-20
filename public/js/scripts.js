$(function(){
  $('#loginButtom').on('click', function(event) {
    event.preventDefault();
    //document.getElementById("login").innerHTML = "logout";
    var imgId = $('#userid').data('id');

    $.post('/timer' + imgId).done(function(data) {
       
    });
});
  
});
