 (function ($) {
     $('.accordion > li:eq(100) a').addClass('active').next().slideDown();

     $('.accordion a').click(function (j) {
         var dropDown = $(this).closest('li').find('p');

         $(this).closest('.accordion').find('p').not(dropDown).slideUp();

         if ($(this).hasClass('active')) {
             $(this).removeClass('active');
         } else {
             $(this).closest('.accordion').find('a.active').removeClass('active');
             $(this).addClass('active');
         }

         dropDown.stop(false, true).slideToggle();

         j.preventDefault();
     });
 })(jQuery);




 $(window).scroll(function () {
     var bo = $(document).scrollTop();
     if (bo > 550) {
         $(".menu_scroll").slideDown("fast");


     } else {

         $(".menu_scroll").slideUp("fast");
     }
 })

 $('.menu_resp_button').click(function () {
     $("menu").toggleClass('fast');


 });



 var burgers = document.querySelectorAll('.burger');

 for (var i = 0; i < burgers.length; i++) {

     burgers[i].addEventListener('click', function () {
         if (this.classList.contains('active')) {
             this.classList.remove('active');
         } else {
             this.classList.add('active');
         }
     });
 }

 $('.burger').click(function () {
     $("menu").toggleClass('dis_block');

 });
