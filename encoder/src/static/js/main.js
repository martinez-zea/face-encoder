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
        console.log('data',data)
      })
    }
    
  })

  $('#shutter').click(function(){
    $(this).fadeOut()
    var overlay = $('#overlay')

    $(overlay).fadeIn()

    var max = 3
    var timer = $.timer(function(){
      $(overlay).html('<span>'+max+'</span>')
      
      if (max >= 0 ) {
        max--
      }
      if (max <= 0){
        // inform that its time to init camera
        $.get('/picture', function (data){
          console.info('get query done: ', data);
        })

        $(overlay).animate({ backgroundColor: "white" }, "fast");
        $(overlay).fadeOut()
        timer.stop()
      }
    }, 1000, true)


  })
})
