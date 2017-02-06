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
        var bo = $("body").scrollTop();
        if (bo > 228) {
            $(".menu").css("position", "fixed");
            $(".menu").css("top", "0px");
            $(".menu").css("z-index", "100");
        }
        else {
            $(".menu").css("position", "inherit");
            $(".menu").css("z-index", "2");
        }
    })
    $(window).scroll(function () {
            var bo = $("body").scrollTop();
            if ($('.ind').hasClass('minus')) {
                if (bo > 385) {
                    $(".menu").css("position", "fixed");
                    $(".menu").css("top", "-160px");
                }
                else {
                    $(".menu").css("position", "inherit");
                    $(".menu").css("top", "0px");
                }
                if (bo > 385) {
                    if ($(window).width() < 710) {
                        $(".menu").css("position", "fixed");
                        $(".menu").css("top", "-175px");
                    }
                }
            }
        })
        //chat-on/off-function
    $(".chat").click(function () {
        $("#wrapper").toggleClass("none");
        $("#wrapper").css("z-index", "2000");
    });
});