$(document).ready(function () {

    var swiper = new Swiper('.swiper-container', {
        spaceBetween: 0,
        slidesPerView: 6,
        centeredSlides: true,
        slideToClickedSlide: true,
        grabCursor: false,
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev',
        scrollbar: '.swiper-scrollbar',
        pagination: '.swiper-pagination',
        autoplay: true,
        loop: true,
        autoplayDisableOnInteraction: false,
        paginationClickable: true,
        breakpoints: {

            1024: {
                slidesPerView: 4,

            },
            740: {
                slidesPerView: 2,

            },
            440: {
                slidesPerView: 1,

            },

        }
    });



    $('.items_container div').click(function () {

        var tab_id = $(this).attr('data-tab');


        $('.items_content').removeClass('current');

        $(this).addClass('current');
        $("#" + tab_id).addClass('current');
    })


    $('.tabs_control span').click(function () {

        var tab_id = $(this).attr('data-tab');


        $('.tabs_content').removeClass('block');

        $(this).addClass('block');
        $("#" + tab_id).addClass('block');
    })


    $(".items_container div").click(function (e) {
        e.preventDefault();
        $(".items_container div").removeClass('shedule_tab_active');
        $(this).addClass('shedule_tab_active');
    })


    $('.tabs_control span').click(function () {

        var tab_id = $(this).attr('data-tab');


        $('.tabs_content').removeClass('block');

        $(this).addClass('block');
        $("#" + tab_id).addClass('block');
    })


    $('.watch_video').click(function () {
        $(".modal").fadeIn(300);


    });
    $('.btn-close').click(function () {
        $(".modal").fadeOut(100);
    });


    $(".items_container div").click(function (e) {
        e.preventDefault();
        $(".items_container div").removeClass('shedule_tab_active');
        $(this).addClass('shedule_tab_active');
    })


})
