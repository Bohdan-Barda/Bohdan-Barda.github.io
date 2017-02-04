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
        $('.form').css('margin-top', "145px");
        if ($('.ind').hasClass('plus')) {
            $('.menu').addClass("margin");
            $('.form').css('margin-top', "0px");
            $('.news-video,.mma-video,.boxing-video,.kickboxing-video,.live-video').addClass("padding");
        }
        if ($(window).width() < 710) {
            $('.menu').css("margin-top", "180px");
            $('.news-video,.mma-video,.boxing-video,.kickboxing-video,.live-video').css("padding-top", "180px");
        }
    });
    $(".card-1").click(function () {
        $(".list-1").toggleClass("height");
        if ($('.ind').hasClass('minus')) {
            $('.form').css('margin-top', "200px");
        }
    });
    $(".card-2").click(function () {
        $(".list-2").toggleClass("height");
        $(".shedule-list").removeClass("hidden");
        $(".ind").removeClass("plus");
        $(".ind").addClass("minus");
        $('.form').removeClass("margin");
        $('.news-video,.mma-video,.boxing-video,.kickboxing-video,.live-video').removeClass("padding");
        $('.menu').removeClass("margin");
        $('.form').css('margin-top', "200px");
    });
    $(".card-3").click(function () {
        $(".list-3").toggleClass("height");
        $('.form').css('margin-top', "200px");
    });
    $(".card-4").click(function () {
        $(".list-4").toggleClass("height");
        $('.form').css('margin-top', "200px");
    });
    $(".card-5").click(function () {
        $(".list-5").toggleClass("height");
        $('.form').css('margin-top', "200px");
    });
    $(".card-6").click(function () {
        $(".list-6").toggleClass("height");
        $('.form').css('margin-top', "200px");
    });
    $(".news").click(function () {
        $(".list-6").toggleClass("height");
    });
    $(".News").click(function () {
        $(".MMA").removeClass("active");
        $(".News").addClass("active");
        $(".Boxing").removeClass("active");
        $(".news-video").removeClass("none");
        $(".mma-video").addClass("none");
        $(".boxing-video").addClass("none");
        $(".Kickboxing").removeClass("active");
        $(".kickboxing-video").addClass("none");
        $(".live-video").addClass("none");
        $(".Live-button").removeClass("active");
    });
    $(".MMA").click(function () {
        $(".MMA").addClass("active");
        $(".News").removeClass("active");
        $(".Boxing").removeClass("active");
        $(".mma-video").removeClass("none");
        $(".news-video").addClass("none");
        $(".boxing-video").addClass("none");
        $(".kickboxing-video").addClass("none");
        $(".live-video").addClass("none");
        $(".Live-button").removeClass("active");
        $(".Kickboxing").removeClass("active");
    });
    $(".Boxing").click(function () {
        $(".Boxing").addClass("active");
        $(".MMA").removeClass("active");
        $(".News").removeClass("active");
        $(".boxing-video").removeClass("none");
        $(".news-video").addClass("none");
        $(".mma-video").addClass("none");
        $(".Kickboxing").removeClass("active");
        $(".kickboxing-video").addClass("none");
        $(".live-video").addClass("none");
        $(".Live-button").removeClass("active");
    });
    $(".Kickboxing").click(function () {
        $(".Kickboxing").addClass("active");
        $(".MMA").removeClass("active");
        $(".News").removeClass("active");
        $(".kickboxing-video").removeClass("none");
        $(".news-video").addClass("none");
        $(".mma-video").addClass("none");
        $(".boxing-video").addClass("none");
        $(".Boxing").removeClass("active");
        $(".live-video").addClass("none");
        $(".Live-button").removeClass("active");
    });
    $(".Live-button").click(function () {
        $(".Kickboxing").removeClass("active");
        $(".Live-button").addClass("active");
        $(".live-video").removeClass("none");
        $(".MMA").removeClass("active");
        $(".News").removeClass("active");
        $(".kickboxing-video").addClass("none");
        $(".news-video").addClass("none");
        $(".mma-video").addClass("none");
        $(".boxing-video").addClass("none");
        $(".Boxing").removeClass("active");
    });
    $(".live").click(function () {
        $(".Kickboxing").removeClass("active");
        $(".Live-button").addClass("active");
        $(".live-video").removeClass("none");
        $(".MMA").removeClass("active");
        $(".News").removeClass("active");
        $(".kickboxing-video").addClass("none");
        $(".news-video").addClass("none");
        $(".mma-video").addClass("none");
        $(".boxing-video").addClass("none");
        $(".Boxing").removeClass("active");
    });
});