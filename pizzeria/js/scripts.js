/*===slider===*/
$(document).ready(function () {
        $(function () {
                var i = 1;
                for (var b = 1; b <= $(".fadeslider .slide").length; b++) {
                    $(".slidelist").append("<div></div>")
                }
                $(".slidelist div:nth-child(1)").addClass("active");

                function slider() {
                    var l = $(".fadeslider .slide").length;
                    if (i == l) {
                        i = 0;
                    }
                    $(".fadeslider .slide").fadeOut("slow");
                    $(".slidelist div").removeClass("active");
                    i++;
                    $(".fadeslider .slide:nth-child(" + i + ")").fadeIn("slow");
                    $(".slidelist div:nth-child(" + i + ")").addClass("active");
                    if (i >= l) {
                        i = 0;
                    }
                }

                function sliderback() {
                    var l = $(".fadeslider .slide").length;
                    if (i == 0) {
                        i = l + 1;
                    }
                    $(".fadeslider .slide").fadeOut(500);
                    $(".slidelist div").removeClass("active");
                    i--;
                    if (i <= 0) {
                        i = l;
                    }
                    $(".fadeslider .slide:nth-child(" + i + ")").fadeIn(500);
                    $(".slidelist div:nth-child(" + i + ")").addClass("active");
                }
                $(".slidenext").click(function () {
                    slider();
                });
                $(".slideback").click(function () {
                    sliderback();
                });
                var timer = setInterval(slider, 6000);
                $('.slideback,.slidenext').hover(function (ev) {
                    clearInterval(timer);
                }, function (ev) {
                    timer = setInterval(slider, 6000);
                });
            })
            /*===scroll-scripts===*/
        $(window).scroll(function () {
            var bo = $(document).scrollTop();
            if (bo > 500) {
                $(".ground").addClass("main__pizza_bg_scroll");
            }
        })
        $(window).scroll(function () {
            var bo = $(document).scrollTop();
            if (bo > 500) {
                $(".ground").addClass("main__pizza_bg_scroll");
            }
        })
        $(window).scroll(function () {
                var bo = $(document).scrollTop();
                if (bo > 50) {
                    $(".menu").addClass("menu__scroll");
                }
                else {
                    $(".menu").removeClass("menu__scroll");
                }
            })
            /*===responsive-menu-toggle===*/
        $('.burger').click(function () {
            $(".menu__responsive").toggleClass('responsive');
        });
        $('.burger').click(function () {
            $(this).toggleClass('burger__toggle');
        });
        /*===content-menu-controls===*/
        $(".click__pizza").click(function () {
            $(".pizza__menu").addClass('bg-pizza');
            $(".pizza__menu").removeClass('bg-beer , bg-ice-cream , bg-sushi');
            $(".pizza").show('slow');
            $(".drink , .ice__cream , .sushi").hide('slow');
            $(".check__pizza__img").addClass('active');
            $(" .check__drink__img , .check__ice__cream__img , .check__sushi__img").removeClass('active');
        });
        $('.click__drink').click(function () {
            $(".pizza__menu").addClass('bg-beer');
            $(".pizza__menu").removeClass('bg-pizza , bg-ice-cream , bg-sushi');
            $(".drink").show('slow');
            $(".pizza , .sushi , .ice__cream").hide('slow');
            $(".check__drink__img").addClass('active');
            $(".check__pizza__img , .check__ice__cream__img , .check__sushi__img").removeClass('active');
        });
        $('.click__ice__cream').click(function () {
            $(".pizza__menu").addClass('bg-ice-cream');
            $(".pizza__menu").removeClass('bg-pizza , bg-sushi , bg-beer');
            $(".ice__cream").show('slow');
            $(".pizza , .drink , .sushi").hide('slow');
            $(".check__ice__cream__img").addClass('active');
            $(".check__pizza__img , .check__drink__img , .check__sushi__img").removeClass('active');
        });
        $('.click__sushi').click(function () {
            $(".pizza__menu").addClass('bg-sushi');
            $(".pizza__menu").removeClass('bg-pizza , bg-beer , bg-ice-cream');
            $(".sushi").show('slow');
            $(".pizza , .drink , .ice__cream").hide('slow');
            $(".check__sushi__img").addClass('active');
            $(".check__pizza__img , .check__drink__img , .check__ice__cream__img").removeClass('active');
        });
    })
    /*===anchor-scripts===*/
$(function () {
    $('.click__pizza , .click__sushi , .click__ice__cream , .click__drink').on('click', function (e) {
        $('html,body').stop().animate({
            scrollTop: $('.check__menu').offset().top
        }, 1000);
        e.preventDefault();
    });
    $('.click__contact').on('click', function (e) {
        $('html,body').stop().animate({
            scrollTop: $('.contact').offset().top
        }, 1000);
        e.preventDefault();
    });
    $(window).scroll(function () {
        var bo = $(document).scrollTop();
        if (bo > 900) {
            $(".check__menu ").addClass("opacity");
        }
    })
});