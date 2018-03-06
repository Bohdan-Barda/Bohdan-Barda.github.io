$(document).ready(function () {

    if ($('#datepicker').length > 0) {
        $(function () {
            $("#datepicker").datepicker();
            $.datepicker.regional['ua'] = {
                closeText: 'Закрити',
                prevText: '&#x3c;Поп',
                nextText: 'Наст&#x3e;',
                currentText: 'Сьогодні',
                monthNames: ['Лютий', 'Січень', 'Березень', 'Квітень', 'Травень', 'Червень',
                    'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'],
                monthNamesShort: ['Лют', 'Січ', 'Бер', 'Квіт', 'Трав', 'Черв',
                    'Лип', 'Серп', 'Вер', 'Жовт', 'Лист', 'Груд'],
                dayNames: ['неділя', 'понеділок', 'вівторок', 'среда', 'четвер', 'п\'ятница', 'субота'],
                dayNamesShort: ['нд', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'],
                dayNamesMin: ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
                weekHeader: 'Ти',
                dateFormat: 'dd.mm.yy',
                firstDay: 1,
                isRTL: false,
                showMonthAfterYear: false,
                yearSuffix: ''
            };
            $.datepicker.setDefaults($.datepicker.regional['ua']);
        });
    }

    if ($('#datepicker1').length > 0) {
        $(function () {
            $("#datepicker1").datepicker();
            $.datepicker.regional['ua'] = {
                closeText: 'Закрити',
                prevText: '&#x3c;Поп',
                nextText: 'Наст&#x3e;',
                currentText: 'Сьогодні',
                monthNames: ['Лютий', 'Січень', 'Березень', 'Квітень', 'Травень', 'Червень',
                    'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'],
                monthNamesShort: ['Лют', 'Січ', 'Бер', 'Квіт', 'Трав', 'Черв',
                    'Лип', 'Серп', 'Вер', 'Жовт', 'Лист', 'Груд'],
                dayNames: ['неділя', 'понеділок', 'вівторок', 'среда', 'четвер', 'п\'ятница', 'субота'],
                dayNamesShort: ['нд', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'],
                dayNamesMin: ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
                weekHeader: 'Ти',
                dateFormat: 'dd.mm.yy',
                firstDay: 1,
                isRTL: false,
                showMonthAfterYear: false,
                yearSuffix: ''
            };
            $.datepicker.setDefaults($.datepicker.regional['ua']);
        });
    }

    wow = new WOW(
        {
            mobile: false
        }
    );

    var gallery = new Swiper('.gallery-slider', {
        slidesPerView: 3,
        spaceBetween: 0,
        loop: true,
        speed: 800,
        // Navigation arrows
        navigation: {
            nextEl: '.swiper-button-next-g',
            prevEl: '.swiper-button-prev-g',
        },
        pagination: {
            el: '.swiper-pagination-g',
            clickable: true
        },
        breakpoints: {
            1024: {
                slidesPerView: 2,
            },
            767: {
                slidesPerView: 1,
            }
        }
    });

    var gallery = new Swiper('.gallery-slider-2', {
        slidesPerView: 2,
        spaceBetween: 0,
        loop: true,
        speed: 800,
        centeredSlides: true,
        // Navigation arrows
        navigation: {
            nextEl: '.swiper-button-next-g-2',
            prevEl: '.swiper-button-prev-g-2',
        },
        breakpoints: {
            767: {
                slidesPerView: 1,
            }
        }
    });

    $(function () {
        $('select').selectric();
    });


    $(".wrap-overflow").mCustomScrollbar({
        axis: "y",
        theme: "my-theme",
        scrollbarPosition: "inside"

    });
    $(".form .wrap form").mCustomScrollbar({
        axis: "y",
        theme: "my-theme",
        scrollbarPosition: "inside"

    });


    if ($(window).width() > 1024 && $(window).height() > 900) {

        $('#fullpage').fullpage({
            scrollBar: true,
            responsiveWidth: 1024,
            responsiveHeight: 900,
            paddingBottom: '0'
        });
        $(".autoservice .block-2 .wrap .info .box , .button-form , .diesel-center .block-2 .wrap .info .box .wrap").click(function () {
            $.fn.fullpage.setAutoScrolling(false);
            $('body').addClass('overflow');
        });
        $(".autoservice .burger-off , .diesel-center .burger-off").click(function () {
            $.fn.fullpage.setAutoScrolling(true);
            $('body').removeClass('overflow');
        });
    }


    window.addEventListener("orientationchange", function () {
        location.reload();
    }, false);
    $(function () {
        var width = $(window).width();
        var screen = "";
        if (width < 1024 && width > 630) {
            screen = "small";
        } else if (width > 1024) {
            screen = "big";
        }
        $(window).resize(function () {
            var cur_width = $(window).width();
            if (cur_width < 1024 && cur_width > 630 && screen == "big") {
                location.reload();
            } else if (cur_width > 1024 && screen == "small") {
                location.reload();
            }
        });
    });


    var doFullpag = document.documentElement.clientHeight;


    if (doFullpag < 1024) {
        $("#burger").click(function () {
            $("body , html").addClass('overflow');
        });
        $(".burger-off").click(function () {
            $("body , html").removeClass('overflow');
        });
    }



    $(".autoservice .block-2 .wrap .info .box , .button-form , .diesel-center .block-2 .wrap .info .box .wrap").click(function () {
        $('.section').addClass('bg-full');
        $('body').addClass('overflow');
    });

    $(".burger-off").click(function () {
        $('.section').removeClass('bg-full');
        $('body').removeClass('overflow');
    });


    $(function () {
        $(window).resize(function () {
            if ($(this).width() < 420) {
                $(".top-bg").attr('src', 'images/figureresp.png');
            } else {
                $(".top-bg").attr('src', 'images/figure.png');
            }

        });
    });


    var widthE = document.body.clientWidth;
    if (widthE <= 620) {
        $(".top-bg").attr('src', 'images/figureresp.png');

    }

    $("#burger").click(function () {
        $(".burger-menu").addClass('menu-toggle');
    });

    $(".burger-off").click(function () {
        $(".burger-menu").removeClass('menu-toggle');
    });


    $('.lines-framework').addClass("lines-anim");


    var widthEk = document.body.clientWidth;
    if (widthEk > 1024) {

        if ($('.content-wrap').length > 0) {

            var target = $('.content-wrap');
            var targetPos = target.offset().top;
            var winHeight = $(window).height();
            var scrollToElem = targetPos - winHeight;
            $(window).scroll(function () {
                var winScrollTop = $(this).scrollTop();
                if (winScrollTop > scrollToElem) {
                    $('.content-wrap').addClass("fadeInUpBig animated");
                }
            });
        }
        if ($('.block-3').length > 0) {
            var target1 = $('.block-3');
            var targetPos1 = target1.offset().top;
            var winHeight1 = $(window).height();
            var scrollToElem1 = targetPos1 - winHeight1;
            $(window).scroll(function () {
                var winScrollTop1 = $(this).scrollTop();
                if (winScrollTop1 > scrollToElem1) {
                    $('.block-3 .slider').addClass("fadeInLeftBig animated");
                    $('.block-3 .right-info').addClass("fadeInRightBig  animated");

                }
            });
        }
        if ($('.block-4').length > 0) {
            var target2 = $('.block-4');
            var targetPos2 = target2.offset().top;
            var winHeight2 = $(window).height();
            var scrollToElem2 = targetPos2 - winHeight2;
            $(window).scroll(function () {
                var winScrollTop2 = $(this).scrollTop();
                if (winScrollTop2 > scrollToElem2) {
                    $('.block-4 .info').addClass("fadeInLeftBig animated");
                    $('.block-4 .map').addClass("fadeIn animated");
                    $('.bottom-bg').addClass("fadeInLeft animated");
                }
            });
        }
    }

    wow.init();


    var swiper = new Swiper('.price-slider', {
        direction: 'vertical',
        onlyExternal: true,
        navigation: {
            nextEl: '.swiper-button-next-p',
            prevEl: '.swiper-button-prev-p',
        },

        pagination: {
            el: '.swiper-pagination-p',
            clickable: true,
            renderBullet: function (index, className) {
                return '<span class="' + className + (index + 1) + ' swiper-pagination-bullet "></span>';
            },
        },
    });


    var galleryThumbs = new Swiper('.info-top-slider', {
        speed: 1200,
        loop: true,
        // Navigation arrows
        navigation: {
            nextEl: '.swiper-button-next-t',
            prevEl: '.swiper-button-prev-t',
        },
    });


    var myTopSwiper = new Swiper('.top-slider', {
        // Optional parameters
        loop: true,
        speed: 1200,
        parallax: true,
    });

    var mySwiper = new Swiper('.info-slider', {
        // Optional parameters
        speed: 800,
        loop: true,
        parallax: true,

        // Navigation arrows
        navigation: {
            nextEl: '.swiper-button-next-i',
            prevEl: '.swiper-button-prev-i',
        },
    });

    if ($('.top-slider').length > 0) {
        myTopSwiper.controller.control = galleryThumbs;
        galleryThumbs.controller.control = myTopSwiper;
    }

    /**********************************************************************GOOGLE MAP*/
    var markerIndex = 0;
    var sUrl = "https://maps.googleapis.com/maps/api/js?key=AIzaSyBHMLQzslOh7wCQrRbmZtovEXG2c54JULs";


    function getScript(source, callback) {
        var el = document.createElement('script');
        el.onload = callback;
        el.src = source;
        document.body.appendChild(el);
    }

    var map;
    var infoBubble;
    var logo = $('#map').attr('data-logo');
    var content = $('#map').attr('data-content');
    var width = document.body.clientWidth;


    /*if ($("#map").length) {
        var mapContent = document.querySelector('#map'),
            data = mapContent.dataset;
        var contentString = '<div id="map-content">' + '<figure><img src=' + logo + ' alt="logo"></figure>' + content + '<a href="#" class="button"><span>Заказать звонок</span></a></div>';
    }*/


    function map($location) {
        var map,
            marker,
            latlng = new google.maps.LatLng(44.224810, 42.044176),
            geocoder = new google.maps.Geocoder(),
            infoWindow = new google.maps.InfoWindow(),
            zoomMap = 15,
            dragMap = true,
            markers = [],
            markerBounds = new google.maps.LatLngBounds(),
            markerSvg = {
                url: 'images/pointer.png',
                size: new google.maps.Size(100, 150),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(50, 150)
            };

        function initialize($location) {
            var mapOptions = {
                center: latlng,
                zoom: zoomMap,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                scrollwheel: false,
                navigationControl: false,
                mapTypeControl: false,
                scaleControl: false,
                draggable: dragMap,
                streetViewControl: false,
                streetViewControlOptions: {
                    position: google.maps.ControlPosition.LEFT_TOP
                },
                zoomControl: false,
                zoomControlOptions: {
                    position: google.maps.ControlPosition.LEFT_TOP
                },
                styles: [
                    {
                        "featureType": "landscape",
                        "elementType": "labels",
                        "stylers": [
                            {
                                "visibility": "off"
                            }
                        ]
                    },
                    {
                        "featureType": "transit",
                        "elementType": "labels",
                        "stylers": [
                            {
                                "visibility": "off"
                            }
                        ]
                    },
                    {
                        "featureType": "poi",
                        "elementType": "labels",
                        "stylers": [
                            {
                                "visibility": "off"
                            }
                        ]
                    },
                    {
                        "featureType": "water",
                        "elementType": "labels",
                        "stylers": [
                            {
                                "visibility": "off"
                            }
                        ]
                    },
                    {
                        "featureType": "road",
                        "elementType": "labels.icon",
                        "stylers": [
                            {
                                "visibility": "off"
                            }
                        ]
                    },
                    {
                        "stylers": [
                            {
                                "hue": "#00aaff"
                            },
                            {
                                "saturation": -100
                            },
                            {
                                "gamma": 2.15
                            },
                            {
                                "lightness": 12
                            }
                        ]
                    },
                    {
                        "featureType": "road",
                        "elementType": "labels.text.fill",
                        "stylers": [
                            {
                                "visibility": "on"
                            },
                            {
                                "lightness": 24
                            }
                        ]
                    },
                    {
                        "featureType": "road",
                        "elementType": "geometry",
                        "stylers": [
                            {
                                "lightness": 57
                            }
                        ]
                    }
                ]
            };

            // Create the map
            map = new google.maps.Map(document.getElementById('mapLviv'), mapOptions);

            // Get the data and set the marker bounds
            var markersLocations = $location;

            // Loop through the data getting the address
            $.each(markersLocations, function (index, data, infowindow) {

                geocoder.geocode({'address': data.address}, function (results, status) {

                    if (status == google.maps.GeocoderStatus.OK) {

                        map.setCenter(results[0].geometry.location);

                        // Add the markers
                        marker = new google.maps.Marker({
                            map: map,
                            position: results[0].geometry.location,
                            icon: markerSvg
                        });

                        markers.push(marker);


                        // Use the results to set the bounds
                        markerBounds.extend(results[0].geometry.location);
                        map.setCenter(markers[markerIndex].position);

                        //if main page
                        if ($(window).width() < 1200 && $(window).width() > 1024) {
                            offsetCenter(map.getCenter(), 0, 180);
                        } else if ($(window).width() < 1025) {
                            offsetCenter(map.getCenter(), 20, -350);
                        } else {
                            offsetCenter(map.getCenter(), 300, -200);
                        }
                    } else {
                        console.log('Geocode was not successful for the following reason: ' + status);
                    }
                });

            });

        }


        initialize($location);

        function offsetCenter(latlng, offsetx, offsety) {

            // latlng is the apparent centre-point
            // offsetx is the distance you want that point to move to the right, in pixels
            // offsety is the distance you want that point to move upwards, in pixels
            // offset can be negative

            var scale = Math.pow(2, map.getZoom());
            var nw = new google.maps.LatLng(
                map.getBounds().getNorthEast().lat(),
                map.getBounds().getSouthWest().lng()
            );

            var worldCoordinateCenter = map.getProjection().fromLatLngToPoint(latlng);
            var pixelOffset = new google.maps.Point((offsetx / scale) || 0, (offsety / scale) || 0)
            var worldCoordinateNewCenter = new google.maps.Point(
                worldCoordinateCenter.x - pixelOffset.x,
                worldCoordinateCenter.y + pixelOffset.y
            );

            var newCenter = map.getProjection().fromPointToLatLng(worldCoordinateNewCenter);
            map.setCenter(newCenter);
        }
    }


    if ($('#mapLviv').length > 0) {
        getScript(sUrl, function () {
            var $location = $('#mapLviv').data('locations');
            map($location);
        });
    }


    $(".check .ck ").click(function () {
        var $location = $('#mapLviv').data('locations');
        if (markerIndex === 0) {
            markerIndex = 1;
            map($location);
        } else {
            markerIndex = 0;
            map($location);
        }

        $(".ck").toggleClass('tog');
        $(".bartativ-info").slideToggle();
        $(".lviv-info").slideToggle();
        $(".check span").toggleClass('active');

    });


    $(".bosch-equipment .button-form, .autoservice .button-form , .diesel-center .button-form ,.price-info-slider .info .button ,.block-4 .info .button").click(function () {
        $(".bosch-equipment .form , .autoservice .form , .diesel-center .form , .form , .no-vin").addClass('form-toggle');
    });

    $(".price-info-slider .info .button ,.block-4 .info .button").click(function () {
        $(".price-info-slider").removeClass("slider-toggle");
    });

    $(".bosch-equipment  .form .burger-off , .autoservice .burger-off , .diesel-center .burger-off ,.burger-off ").click(function () {
        $(".bosch-equipment .form , .autoservice .form , .diesel-center .form , .form , .no-vin").removeClass('form-toggle');
    });


    $(".diesel-center .block-2 .wrap .info .box ,.autoservice .block-2 .wrap .info .box  ").click(function () {
        $(".diesel-center .price-info-slider , .autoservice .price-info-slider").addClass('slider-toggle');
    });

    $(".diesel-center .price-info-slider .burger-off , .autoservice .price-info-slider .burger-off ").click(function () {
        $(".diesel-center .price-info-slider , .autoservice .price-info-slider").removeClass('slider-toggle');
    });

    $(".autoservice .block-2 .wrap .info .box a").on("click", function (event) {
        event.preventDefault();
        var id = $(this).attr('href'),
            top = $(id).offset().top;
        $('body,html').animate({scrollTop: top}, 500);
    });


    $("a.button-form").on("click", function (event) {
        event.preventDefault();
        var id = $(this).attr('href'),
            top = $(id).offset().top;
        $('body,html').animate({scrollTop: top}, 500);
    });

});

