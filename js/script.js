$('.navicon').click(function() {
  $positionY = $(window).scrollTop();
  if ($positionY === 0) {
    $(this).toggleClass('close');
    $('nav#primary ul').toggleClass('visible');
  } else {
    $('html, body').animate({
      scrollTop: 0
    }, 400); 
    return false;
  }
});
$(window).scroll(function() {
  if ($(this).scrollTop() > 0) {
    $('nav#primary ul').removeClass('visible');
    $('.navicon').removeClass('close');
    $('.navicon').addClass('arrow_up');
  } else {
    $('.navicon').removeClass('arrow_up');   
  }
}); 
alert('rerere');