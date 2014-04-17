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

    onFinished: function(event, currentIndex){

      var user = {
        username : $('#username').val(),
        email : $('#email').val()
      }

      $.post('/userDone', user, function(data){
        console.log("data",data)
      })
    },

    onStepChanged: function(event, currentIndex ){
      if (currentIndex === 3) {
        console.info('step 3 : picture')

        // inform that its time to init camera
        $.get('/picture', function (data){
          console.info('get query done: ', data);
        })
      }
    }

  })
})
