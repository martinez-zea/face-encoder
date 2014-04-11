$(function () {
  $('#wizard').steps({
    autoFocus: true,

    // onFinishing: function (event, currentIndex){
    //   console.log("almost done")
    //   re
    // },

    onFinished: function(event, currentIndex){

      var user = {
        name : $('#name').val(),
        email : $('#email').val()
      }

      $.post('/userDone', user, function(data){
        console.log("data",data)
      })

    }
  });
});
