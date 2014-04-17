function countDown (from){
  var interval = setTimeout(function (){
    console.log(from);

    if(from > 0){
      from--
    } else {
      clearTimeout(interval);
    }


  }, 500);
}

countDown(10)