$('#responsiv-on').click(function () {
    if ($('#responsiv-menu').is(':hidden')) {
        $('#responsiv-menu').slideDown(300);
    }
    else {
        $('#responsiv-menu').slideUp(300);
    }
});
/////////////
$(document).ready(function () {
    $(".qq-1").on("click", function () {
        if ($(".text-1").hasClass('plus')) {
            $(this).removeClass("plus");
            $(this).siblings('.content').slideUp(200);
            $(".text-1").removeClass("plus").addClass("minus");
        }
        else {
            $(".text-1").removeClass("minus").addClass("plus");
        }
    });
});
////////////
/////////////
$(document).ready(function () {
    $(".qq-2").on("click", function () {
        if ($(".text-2").hasClass('plus')) {
            $(this).removeClass("plus");
            $(this).siblings('.content').slideUp(200);
            $(".text-2").removeClass("plus").addClass("minus");
        }
        else {
            $(".text-2").removeClass("minus").addClass("plus");
        }
    });
});
////////////
/////////////
$(document).ready(function () {
    $(".qq-3").on("click", function () {
        if ($(".text-3").hasClass('plus')) {
            $(this).removeClass("plus");
            $(this).siblings('.content').slideUp(200);
            $(".text-3").removeClass("plus").addClass("minus");
        }
        else {
            $(".text-3").removeClass("minus").addClass("plus");
        }
    });
});
////////////
/////////////
$(document).ready(function () {
    $(".qq-4").on("click", function () {
        if ($(".text-4").hasClass('plus')) {
            $(this).removeClass("plus");
            $(this).siblings('.content').slideUp(200);
            $(".text-4").removeClass("plus").addClass("minus");
        }
        else {
            $(".text-4").removeClass("minus").addClass("plus");
        }
    });
});
////////////
/////////////
$(document).ready(function () {
    $(".qq-5").on("click", function () {
        if ($(".text-5").hasClass('plus')) {
            $(this).removeClass("plus");
            $(this).siblings('.content').slideUp(200);
            $(".text-5").removeClass("plus").addClass("minus");
        }
        else {
            $(".text-5").removeClass("minus").addClass("plus");
        }
    });
});
////////////
//
$(".qq-1").click(function () {
    if ($('.drop-1').is(':hidden')) {
        $('.drop-1').slideDown(300);
    }
    else {
        $('.drop-1').slideUp(300);
    }
});
$(".qq-1").click(function () {
    $(".q-qube-1").toggleClass("hover-activ");
});
$(".qq-1").click(function () {
    $(".qq-1").toggleClass("hover-activ-1");
});
$(".qq-1").click(function () {
    $(".text-1").toggleClass("hover-activ-1");
});
//
//
$(".qq-2").click(function () {
    if ($('.drop-2').is(':hidden')) {
        $('.drop-2').slideDown(300);
    }
    else {
        $('.drop-2').slideUp(300);
    }
});
$(".qq-2").click(function () {
    $(".q-qube-2").toggleClass("hover-activ");
});
$(".qq-2").click(function () {
    $(".qq-2").toggleClass("hover-activ-1");
});
$(".qq-2").click(function () {
    $(".text-2").toggleClass("hover-activ-1");
});
//
$(".qq-3").click(function () {
    if ($('.drop-3').is(':hidden')) {
        $('.drop-3').slideDown(300);
    }
    else {
        $('.drop-3').slideUp(300);
    }
});
$(".qq-3").click(function () {
    $(".q-qube-3").toggleClass("hover-activ");
});
$(".qq-3").click(function () {
    $(".qq-3").toggleClass("hover-activ-1");
});
$(".qq-3").click(function () {
    $(".text-3").toggleClass("hover-activ-1");
});
//
$(".qq-4").click(function () {
    if ($('.drop-4').is(':hidden')) {
        $('.drop-4').slideDown(300);
    }
    else {
        $('.drop-4').slideUp(300);
    }
});
$(".qq-4").click(function () {
    $(".q-qube-4").toggleClass("hover-activ");
});
$(".qq-4").click(function () {
    $(".qq-4").toggleClass("hover-activ-1");
});
$(".qq-4").click(function () {
    $(".text-4").toggleClass("hover-activ-1");
});
//
$(".qq-5").click(function () {
    if ($('.drop-5').is(':hidden')) {
        $('.drop-5').slideDown(300);
    }
    else {
        $('.drop-5').slideUp(300);
    }
});
$(".qq-5").click(function () {
    $(".q-qube-5").toggleClass("hover-activ");
});
$(".qq-5").click(function () {
    $(".qq-5").toggleClass("hover-activ-1");
});
$(".qq-5").click(function () {
    $(".text-5").toggleClass("hover-activ-1");
});
//////////////////////
$(document).ready(function () {
    $(".img-1").hover(function () {
        $(".hover-1").css("display", "block");
    }, function () {
        $(".hover-1").css("display", "none");
    });
});
$(document).ready(function () {
    $(".hover-1").hover(function () {
        $(".hover-1").css("display", "block");
    }, function () {
        $(".hover-1").css("display", "none");
    });
});
//////////////////////
$(document).ready(function () {
    $(".img-2").hover(function () {
        $(".hover-2").css("display", "block");
    }, function () {
        $(".hover-2").css("display", "none");
    });
});
$(document).ready(function () {
    $(".hover-2").hover(function () {
        $(".hover-2").css("display", "block");
    }, function () {
        $(".hover-2").css("display", "none");
    });
});
//////////////////////
$(document).ready(function () {
    $(".img-3").hover(function () {
        $(".hover-3").css("display", "block");
    }, function () {
        $(".hover-3").css("display", "none");
    });
});
$(document).ready(function () {
    $(".hover-3").hover(function () {
        $(".hover-3").css("display", "block");
    }, function () {
        $(".hover-3").css("display", "none");
    });
});
//////////////////////
$(document).ready(function () {
    $(".img-4").hover(function () {
        $(".hover-4").css("display", "block");
    }, function () {
        $(".hover-4").css("display", "none");
    });
});
$(document).ready(function () {
    $(".hover-4").hover(function () {
        $(".hover-4").css("display", "block");
    }, function () {
        $(".hover-4").css("display", "none");
    });
});
//////////
$(document).ready(function () {
    $(".slider").each(function () {
        var repeats = 5, // кількість повторювань автоматичного прокручування
            interval = 3, // інтервал в секундах
            repeat = true, // чи треба автоматично прокручувати (true/false)
            slider = $(this)
            , repeatCount = 0
            , elements = $(slider).find("li").length;
        $(slider).append("<div class='nav'></div>").find("li").each(function () {
            $(slider).find(".nav").append("<span data-slide='" + $(this).index() + "'></span>");
            $(this).attr("data-slide", $(this).index());
        }).end().find("span").first().addClass("on");
        // add timeout
        if (repeat) {
            repeat = setInterval(function () {
                if (repeatCount >= repeats - 1) {
                    window.clearInterval(repeat);
                }
                var index = $(slider).find('.on').data("slide")
                    , nextIndex = index + 1 < elements ? index + 1 : 0;
                sliderJS(nextIndex, slider);
                repeatCount += 1;
            }, interval * 1000);
        }
    });
});

function sliderJS(index, slider) { // slide
    var ul = $(slider).find("ul")
        , bl = $(slider).find("li[data-slide=" + index + "]")
        , step = $(bl).width();
    $(slider).find("span").removeClass("on").end().find("span[data-slide=" + index + "]").addClass("on");
    $(ul).animate({
        marginLeft: "-" + step * index
    }, 500);
}
$(document).on("click", ".slider .nav span", function (e) { // slider click navigate
    e.preventDefault();
    var slider = $(this).closest(".slider")
        , index = $(this).data("slide");
    sliderJS(index, slider);
});
/////
var hwSlideSpeed = 700;
var hwTimeOut = 3000;
var hwNeedLinks = true;
$(document).ready(function (e) {
    $('.slide').css({
        "position": "absolute"
        , "top": '0'
        , "left": '0'
    }).hide().eq(0).show();
    var slideNum = 0;
    var slideTime;
    slideCount = $("#slider .slide").size();
    var animSlide = function (arrow) {
        clearTimeout(slideTime);
        $('.slide').eq(slideNum).fadeOut(hwSlideSpeed);
        if (arrow == "next") {
            if (slideNum == (slideCount - 1)) {
                slideNum = 0;
            }
            else {
                slideNum++
            }
        }
        else if (arrow == "prew") {
            if (slideNum == 0) {
                slideNum = slideCount - 1;
            }
            else {
                slideNum -= 1
            }
        }
        else {
            slideNum = arrow;
        }
        $('.slide').eq(slideNum).fadeIn(hwSlideSpeed, rotator);
        $(".control-slide.active").removeClass("active");
        $('.control-slide').eq(slideNum).addClass('active');
    }
    if (hwNeedLinks) {
        var $linkArrow = $('<span id="prewbutton" >&#8250;</span><span id="nextbutton" >&#8249;</span>').prependTo('#slider');
        $('#nextbutton').click(function () {
            animSlide("next");
        })
        $('#prewbutton').click(function () {
            animSlide("prew");
        })
    }
    var $adderSpan = '';
    $('.slide').each(function (index) {
        $adderSpan += '<span class = "control-slide">' + index + '</span>';
    });
    $('<div class ="sli-links">' + $adderSpan + '</div>').appendTo('#slider-wrap');
    $(".control-slide:first").addClass("active");
    $('.control-slide').click(function () {
        var goToNum = parseFloat($(this).text());
        animSlide(goToNum);
    });
    var pause = false;
    var rotator = function () {
        if (!pause) {
            slideTime = setTimeout(function () {
                animSlide('next')
            }, hwTimeOut);
        }
    }
    $('#slider-wrap').hover(function () {
        clearTimeout(slideTime);
        pause = true;
    }, function () {
        pause = false;
        rotator();
    });
    rotator();
});