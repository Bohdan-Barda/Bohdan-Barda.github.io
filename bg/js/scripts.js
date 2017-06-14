 /*===burger===*/
 $('.burger').click(function () {
     $(".menu-responsive").slideToggle();
 });
 /*===search===*/
 $('#seach-button').click(function () {
     $("#search-form").toggle();

 });
 /*===menu-responsive-click===*/
 $('.menu-responsive a').click(function () {
     $(".menu-responsive").slideToggle();
 });
 /*===anchor===*/
 $(window).scroll(function () {
     var bo = $(document).scrollTop();
     if (bo > 750) {
         $(".menu__container").addClass("menu__scroll");
         $(".logo").css("margin-left", "20px");
         $(".menu").css("padding-right", "20px");

     } else {
         $(".menu__container").removeClass("menu__scroll");
         $(".logo").css("padding-left", "0px");
         $(".menu").css("padding-right", "0px");


     }
 })

 $('.home , .home-responsive').on('click', function (e) {
     $('html,body').stop().animate({
         scrollTop: $('header').offset().top
     }, 1000);
     e.preventDefault();
 });
 $('.about , .about-responsive').on('click', function (e) {
     $('html,body').stop().animate({
         scrollTop: $('.about__us_content').offset().top
     }, 1000);
     e.preventDefault();
 });
 $('.our__service , .our__service-responsive').on('click', function (e) {
     $('html,body').stop().animate({
         scrollTop: $('.services').offset().top
     }, 1000);
     e.preventDefault();
 });
 /*===addactive-classmenu===*/
 $(".menu li").click(function (e) {
     e.preventDefault();
     $(".menu li").removeClass('active');
     $(this).addClass('active');
 })


 $(window).scroll(function () {
     var bo = $(document).scrollTop();
     if (bo > 10) {
         $(".home").removeClass("active");

     }
     if (bo < 700) {
         $(".home").addClass("active");

     }
     if (bo > 700) {
         $(".about").addClass("active");

     }
     if (bo > 1300) {
         $(".about").removeClass("active");

     }
     if (bo < 700) {
         $(".about").removeClass("active");

     }
     if (bo > 1300) {
         $(".our__service").addClass("active");

     }
     if (bo < 1300) {
         $(".our__service").removeClass("active");

     }
     if (bo > 2300) {
         $(".our__service").removeClass("active");

     }
 })



 //Video-player-scripts
 "use strict";
 $(function () {
     $(".video").each(function () {
         // Based on the YouTube ID, we can easily find the thumbnail image
         $(this).css('background-image', 'url(http://i.ytimg.com/vi/' + this.id + '/sddefault.jpg)');

         // Overlay the Play icon to make it look like a video player
         $(this).append($('<div/>', {
             'class': 'play'
         }));

         $(document).delegate('#' + this.id, 'click', function () {
             // Create an iFrame with autoplay set to true
             var iframe_url = "https://www.youtube.com/embed/" + this.id + "?autoplay=1&autohide=1";
             if ($(this).data('params')) iframe_url += '&' + $(this).data('params');

             // The height and width of the iFrame should be the same as parent
             var iframe = $('<iframe/>', {
                 'frameborder': '0',
                 'src': iframe_url,
                 'width': $(this).width(),
                 'height': $(this).height()
             })

             // Replace the YouTube thumbnail with YouTube HTML5 Player
             $(this).replaceWith(iframe);
         });
     });
 });
