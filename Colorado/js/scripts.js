 $("nav li").click(function (e) {
     e.preventDefault();
     $("nav li").removeClass('menu_active');
     $(this).addClass('menu_active');
 })
 $('.burger').click(function () {
     $(this).toggleClass('open');
 });
 $('.burger').click(function () {
     $(".responsiv_menu").slideToggle();
 });
