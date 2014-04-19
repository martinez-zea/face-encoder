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
      // if (currentIndex === 1){
      //   if ($('#username').val()) {
      //     return true
      //   }
      // } else if (currentIndex === 2){
      //   var re = /\S+@\S+\.\S+/

      //   return re.test($('#email').val())
      // } else {
      // // } else if (currentIndex === 3){
      // //   return window.picture
      // // } else {
      //   return true
      // }

      return true
    },

    onFinished: function(event, currentIndex){

      var user = {
        username : $('#username').val(),
        email : $('#email').val(),
        face: window.face,
        svg: window.svg
      }

      $.post('/userDone', user, function(data){
        console.log('data',data)

        window.location = 'http://localhost:3000'
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
            $('#picture_instruction').text(window.strings.error_picture+data.error+window.strings.picture_again)
            window.picture = false
          } else {
            $('#picture_instruction').text(window.strings.result)
            $('#picture').html('<img src="/img/'+data.face+'">')
            window.picture = true
            window.face = data.face
            window.svg = data.svg
          }
        })

        $(overlay).animate({ backgroundColor: '#fff' }, 'fast');
        $(overlay).fadeOut()

        $('#picture_instruction').text(window.strings.processing)
        $('#picture').spin('large', '#000000')

        timer.stop()
      }
    }, 1000, true)
  })
})
