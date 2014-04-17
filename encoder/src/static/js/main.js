'use strict';

$(function () {
  $('#wizard').steps({
    labels: {
      next: window.strings.next,
      previous: window.strings.previous,
      loading: window.strings.loading,
      finifsh: window.strings.finish,
    },

    autoFocus: false,

    // onFinishing: function (event, currentIndex){
    //   console.log("almost done")
    //   re
    // },

    onFinished: function(event, currentIndex){

      var user = {
        username : $('#username').val(),
        email : $('#email').val()
      }

      $.post('/userDone', user, function(data){
        console.log("data",data)
      })

    }
  });
});
