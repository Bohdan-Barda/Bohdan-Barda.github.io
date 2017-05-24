  /*===burger-menu===*/

  $('.burger').click(function () {
      $(".responsive-menu").slideToggle();
  });

  $('.products-responsive > a').click(function () {
      $(".menu-product").slideToggle();
  });

  $('.button-menu-1 > a').click(function () {
      $(".menu-1").slideToggle();
  });
  $('.button-menu-2 > a').click(function () {
      $(".menu-2").slideToggle();
  });
  $('.button-menu-3 > a').click(function () {
      $(".menu-3").slideToggle();
  });
  $('.button-menu-4 > a').click(function () {
      $(".menu-4").slideToggle();
  });


  $(".responsive-menu a").click(function (e) {
      e.preventDefault();
      $(".responsive-menu a").removeClass('active');
      $(this).addClass('active');
  })



  /*===slider===*/
  $('.slider3').mobilyslider({
      transition: 'fade',
      animationSpeed: 600,
      bullets: true,
      arrowsHide: false
  });


  /*===scroll-anchor===*/

  $('.home').on('click', function (e) {
      $('html,body').stop().animate({
          scrollTop: $('.header').offset().top
      }, 1000);
      e.preventDefault();
  });


  $('.about').on('click', function (e) {
      $('html,body').stop().animate({
          scrollTop: $('.about__us').offset().top
      }, 1000);
      e.preventDefault();
  });
  $('.contact').on('click', function (e) {
      $('html,body').stop().animate({
          scrollTop: $('.form-container').offset().top
      }, 1000);
      e.preventDefault();
  });
  $(window).scroll(function () {
      var bo = $(document).scrollTop();
      if (bo > 1300) {
          $(".home").removeClass("active");

      }
      if (bo < 1300) {
          $(".home").addClass("active");

      }
      if (bo > 1300) {
          $(".about").addClass("active");

      }
      if (bo > 2000) {
          $(".about").removeClass("active");

      }
      if (bo < 1300) {
          $(".about").removeClass("active");

      }
      if (bo > 2200) {
          $(".contact").addClass("active");

      }
      if (bo < 2200) {
          $(".contact").removeClass("active");

      }
  })

  $(window).scroll(function () {
      var bo = $(document).scrollTop();
      if (bo > 100) {
          $(".header__menu__wrapper").addClass("animation-header");

      } else {
          $(".header__menu__wrapper").removeClass("animation-header");

      }
  })
  $(window).scroll(function () {
      var bo = $(document).scrollTop();
      if (bo > 900) {
          $(" .procent ,  .html-skills , .javascript-skills , .wordpress-skills , .photoshop-skills   ").addClass("animation");
      }
  })
