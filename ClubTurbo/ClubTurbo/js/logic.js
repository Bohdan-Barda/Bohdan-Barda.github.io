$ = jQuery;
$(document).ready(function () {
    var width = document.body.clientWidth;




    if (document.documentElement.clientWidth < 1024) {
        $(".menu-catalog").click(function () {
            $(".section-a .catalog").addClass("opened");
            $(".bg-color").show();

        });
        $(".close-menu").click(function () {
            $(".section-a .catalog").removeClass("opened");
            $(".bg-color").hide();


        });


        $(".section-a .catalog > li a , span").click(function () {
            $(".section-a .catalog .sub-menu").removeClass("active");
            $(this).toggleClass("rotate");
            $(this).next().toggleClass("active");
        });

    }









    $(document).mouseup(function (e) {
        var container = $(".section-a .catalog");
        if (container.has(e.target).length === 0) {
            container.removeClass("opened");
            $(".bg-color").hide();
        }
    });

    <!-- Initialize Swiper -->
    var mySwiper = new Swiper('.top-slider', {
        speed: 400,
        spaceBetween: 0,
        autoplay: {

            delay: 6000

        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
    });

    if (document.documentElement.clientWidth < 1024) {
        var mySwiper = new Swiper('.hit-slider', {
            speed: 400,
            spaceBetween: 20,
            loop: true,
            autoplay: {

                delay: 6000

            },
            slidesPerView: 'auto',
            navigation: {
                nextEl: '.swiper-button-next-h',
                prevEl: '.swiper-button-prev-h',
            },

            breakpoints: {
                1024: {
                    pagination: {
                        el: '.swiper-pagination-h',
                        clickable: true,
                    }
                }
            },
        })

    }


    var mySwiper = new Swiper('.shares-slider', {
        speed: 400,
        spaceBetween: 20,
        loop: true,
        autoplay: {

            delay: 6000

        },
        navigation: {
            nextEl: '.swiper-button-next-s',
            prevEl: '.swiper-button-prev-s',
        },
        slidesPerView: 4,
        breakpoints: {

            1270: {
                slidesPerView: 4,

            },

            1024: {
                pagination: {
                    el: '.swiper-pagination-s',
                    clickable: true,
                },
                slidesPerView: 'auto',
            },

        }
    });

    var mySwiper = new Swiper('.new-slider', {
        speed: 400,
        spaceBetween: 20,
        loop: true,

        autoplay: {

            delay: 6000

        },
        navigation: {
            nextEl: '.swiper-button-next-n',
            prevEl: '.swiper-button-prev-n',
        },
        slidesPerView: 4,

        breakpoints: {

            1270: {
                slidesPerView: 4,

            },

            1024: {
                slidesPerView: 'auto',
                pagination: {
                    el: '.swiper-pagination-n',
                    clickable: true,
                },
            },

        }
    });


    $("").fancybox({

        toolbar: false,
        keyboard: false,
        arrows: false,
        infobar: false,


    });


    $(".scroll-menu").mCustomScrollbar({
        axis: "y",
        theme: "my-theme",
        scrollbarPosition: "inside"

    });


});
