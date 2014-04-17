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

    onStepChanging: function (event, currentIndex, newIndex){
      if (currentIndex === 0) {
        return true
      } else if (currentIndex === 1){
        if ($('#username').val()) {
          return true
        }
      } else if (currentIndex === 2){
        var re = /\S+@\S+\.\S+/

        return re.test($('#email').val())
      }
    },

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
    $(this).fadeOut('fast')

    var overlay = $('#overlay')
    $(overlay).fadeIn('fast')

    var max = 3
    var timer = $.timer(function(){
      $(overlay).html('<span>'+max+'</span>')
      
      if (max >= 0 ) {
        max--
      }
      if (max <= 0){
        // inform that its time to init camera
        $.getJSON('/picture', function (data){
          if (data.error){
            // reset the step
            $('.spinner').remove()
            $('#shutter').fadeIn('fast')
            $('#picture_instruction').text('error')
          } else {
            $('#picture_instruction').text('resultado')
            $('#picture').html('<img src="/img/'+data.face+'">')
          }
        })

        $(overlay).animate({ backgroundColor: '#fff' }, 'fast');
        $(overlay).fadeOut()

        $('#picture_instruction').text('procesando')
        $('#picture').spin('large', '#000000')

        timer.stop()
      }
    }, 1000, true)
  })
})
