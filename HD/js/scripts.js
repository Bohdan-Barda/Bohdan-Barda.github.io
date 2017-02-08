//more-button-function
$(document).ready(function () {
    $(".more-button").click(function () {
        $(".shedule-list").toggleClass("hidden");
        $(".list-1,.list-2,.list-3,.list-4,.list-5,.list-6").addClass("height");
        $('html, body').animate({
            scrollTop: $('.header-shedule').position().top
        }, 500);
        $('.ind').toggleClass('plus');
        $('.ind').toggleClass('minus');
        $('.news-video,.mma-video,.boxing-video,.kickboxing-video,.live-video').removeClass("padding");
        $('.menu').removeClass("margin");
        $('.form').css('margin-top', "80px");
        $('.form').css('height', "100vh");
        if ($('.ind').hasClass('plus')) {
            $('.menu').addClass("margin");
            $('.form').css('margin-top', "0px");
            $('.news-video,.mma-video,.boxing-video,.kickboxing-video,.live-video').addClass("padding");
        }
        if ($(window).width() < 710) {
            $('.menu').css("margin-top", "175px");
            $('.news-video,.mma-video,.boxing-video,.kickboxing-video,.live-video').css("padding-top", "180px");
        }
    });
    //fight-card-button-function
    $(".card-1").click(function () {
        $(".list-1").toggleClass("height");
    });
    $(".card-2").click(function () {
        $(".list-2").toggleClass("height");
        $(".shedule-list").removeClass("hidden");
        $(".ind").removeClass("plus");
        $(".ind").addClass("minus");
        $('.form').removeClass("margin");
        $('.news-video,.mma-video,.boxing-video,.kickboxing-video,.live-video').removeClass("padding");
        $('.menu').removeClass("margin");
    });
    $(".card-3").click(function () {
        $(".list-3").toggleClass("height");
    });
    $(".card-4").click(function () {
        $(".list-4").toggleClass("height");
    });
    $(".card-5").click(function () {
        $(".list-5").toggleClass("height");
    });
    $(".card-6").click(function () {
        $(".list-6").toggleClass("height");
    });
    $(".news").click(function () {
        $(".list-6").toggleClass("height");
    });
    //scroll-functions
    $(window).scroll(function () {
        var bo = $(window).scrollTop();
        if (bo > 228) {
            $(".menu ").css("position", "fixed");
            $(".menu ").css("top", "0");
            $(".menu ").css("z-index", "100");
        }
        else {
            $(".menu").css("position", "inherit");
            $(".menu").css("z-index", "2");
        }
        if ($(window).width() < 880) {
            $(".menu").css("position", "fixed");
            $(".menu").css("top", "-20px");
        }
    })
    $(window).scroll(function () {
        var bo = $(window).scrollTop();
        if ($('.ind').hasClass('minus')) {
            if (bo > 420) {
                if ($(window).width() < 880) {
                    $(".menu").css("position", "fixed");
                    $(".menu").css("top", "-206px");
                }
                else {
                    $(".menu").css("position", "inherit");
                    $(".menu").css("top", "0px");
                }
            }
        }
    })
    $(window).scroll(function () {
        var bo = $(window).scrollTop();
        if (bo > 228) {
            if ($(window).width() < 694) {
                $(".menu").css("position", "fixed");
                $(".menu").css("top", "85%");
            }
        }
        else {
            $(".menu").css("position", "inherit");
            $(".menu").css("z-index", "2");
            $(".menu").css("top", "0");
        }
    })
    $(window).scroll(function () {
        var bo = $(window).scrollTop();
        if ($('.ind').hasClass('minus')) {
            if (bo > 228) {
                if ($(window).width() < 694) {
                    $(".menu").css("position", "fixed");
                    $(".menu").css("top", "60%");
                }
            }
        }
    })
    $(window).scroll(function () {
        var bo = $(window).scrollTop();
        if ($('.ind').hasClass('minus')) {
            if (bo > 420) {
                if ($(window).width() > 880) {
                    $(".menu").css("position", "fixed");
                    $(".menu").css("top", "-190px");
                }
            }
            else {
                $(".menu").css("position", "inherit");
                $(".menu").css("top", "0px");
            }
        }
    })
    $(window).scroll(function () {
        var bo = $(window).scrollTop();
        if ($(window).width() < 694) {
            $(".menu").css("position", "inherit");
            $(".menu").css("top", "0");
        }
    })
    $(window).scroll(function () {
        var bo = $(window).scrollTop();
        if ($('.ind').hasClass('minus')) {
            if ($(window).width() < 694) {
                $(".menu").css("position", "inherit");
            }
        }
    })
});