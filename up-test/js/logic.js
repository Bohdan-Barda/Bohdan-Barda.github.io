$(document).ready(function () {

    var mySwiper = new Swiper('.top-slider', {
        // Optional parameters
        loop: true,
        spaceBetween: 0,
        // If we need pagination
        pagination: {
            el: '.swiper-pagination',
            clickable: true
        },
        // Navigation arrows
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
        },
        autoplay: {
            delay: 2500,
            disableOnInteraction: false
        },
    });

    var swiper = new Swiper('.choose-slider', {
        slidesPerView: 3,
        slidesPerColumn: 2,
        spaceBetween: 30,
        pagination: {
            el: '.swiper-pagination',
            clickable: true
        },
        autoplay: {
            delay: 2000,
            disableOnInteraction: false
        },
        breakpoints: {
            1024: {
                slidesPerView: 2,
                slidesPerColumn: 2
            },
            767: {
                slidesPerView: 1,
                slidesPerColumn: 1
            }
        }
    });


    $('#select').selectric();

    /**********************************************************************GOOGLE MAP*/
    var sUrl = "https://maps.googleapis.com/maps/api/js?key=AIzaSyBHMLQzslOh7wCQrRbmZtovEXG2c54JULs";


    function getScript(source, callback) {
        var el = document.createElement('script');
        el.onload = callback;
        el.src = source;
        document.body.appendChild(el);
    }

    var map;
    var width = document.body.clientWidth;

    function map($location, tabIndex) {
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
                scaleControl: true,
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
                        "featureType": "water",
                        "elementType": "geometry",
                        "stylers": [
                            {
                                "color": "#e9e9e9"
                            },
                            {
                                "lightness": 17
                            }
                        ]
                    },
                    {
                        "featureType": "landscape",
                        "elementType": "geometry",
                        "stylers": [
                            {
                                "color": "#f5f5f5"
                            },
                            {
                                "lightness": 20
                            }
                        ]
                    },
                    {
                        "featureType": "road.highway",
                        "elementType": "geometry.fill",
                        "stylers": [
                            {
                                "color": "#ffffff"
                            },
                            {
                                "lightness": 17
                            }
                        ]
                    },
                    {
                        "featureType": "road.highway",
                        "elementType": "geometry.stroke",
                        "stylers": [
                            {
                                "color": "#ffffff"
                            },
                            {
                                "lightness": 29
                            },
                            {
                                "weight": 0.2
                            }
                        ]
                    },
                    {
                        "featureType": "road.arterial",
                        "elementType": "geometry",
                        "stylers": [
                            {
                                "color": "#ffffff"
                            },
                            {
                                "lightness": 18
                            }
                        ]
                    },
                    {
                        "featureType": "road.local",
                        "elementType": "geometry",
                        "stylers": [
                            {
                                "color": "#ffffff"
                            },
                            {
                                "lightness": 16
                            }
                        ]
                    },
                    {
                        "featureType": "poi",
                        "elementType": "geometry",
                        "stylers": [
                            {
                                "color": "#f5f5f5"
                            },
                            {
                                "lightness": 21
                            }
                        ]
                    },
                    {
                        "featureType": "poi.park",
                        "elementType": "geometry",
                        "stylers": [
                            {
                                "color": "#dedede"
                            },
                            {
                                "lightness": 21
                            }
                        ]
                    },
                    {
                        "elementType": "labels.text.stroke",
                        "stylers": [
                            {
                                "visibility": "on"
                            },
                            {
                                "color": "#ffffff"
                            },
                            {
                                "lightness": 16
                            }
                        ]
                    },
                    {
                        "elementType": "labels.text.fill",
                        "stylers": [
                            {
                                "saturation": 36
                            },
                            {
                                "color": "#333333"
                            },
                            {
                                "lightness": 40
                            }
                        ]
                    },
                    {
                        "elementType": "labels.icon",
                        "stylers": [
                            {
                                "visibility": "off"
                            }
                        ]
                    },
                    {
                        "featureType": "transit",
                        "elementType": "geometry",
                        "stylers": [
                            {
                                "color": "#f2f2f2"
                            },
                            {
                                "lightness": 19
                            }
                        ]
                    },
                    {
                        "featureType": "administrative",
                        "elementType": "geometry.fill",
                        "stylers": [
                            {
                                "color": "#fefefe"
                            },
                            {
                                "lightness": 20
                            }
                        ]
                    },
                    {
                        "featureType": "administrative",
                        "elementType": "geometry.stroke",
                        "stylers": [
                            {
                                "color": "#fefefe"
                            },
                            {
                                "lightness": 17
                            },
                            {
                                "weight": 1.2
                            }
                        ]
                    }
                ]
            };


            // Create the map
            map = new google.maps.Map(document.getElementById('map'), mapOptions);


            // Get the data and set the marker bounds
            var markersLocations = $location;

            // Loop through the data getting the address
            $.each(markersLocations, function (index, data, infowindow) {
                var markerIcon = markerSvg;
                marker = new google.maps.Marker({
                    setIcon: "",
                    map: map,
                    icon: markerIcon,
                    position: new google.maps.LatLng(markersLocations[index][0], markersLocations[index][1])
                });

                markers.push(marker);

                if (index === tabIndex) {
                    map.setCenter(markers[index].position);
                }
            });
        }

        initialize($location);
    }

    if ($('#map').length > 0) {
        getScript(sUrl, function () {
            var tabIndex = 0;
            var $location = $('#map').data('locations');
            map($location, tabIndex);
        });
    }

    $('#form').validate({
        lang: 'en',
        rules: {
            name: {
                required: true,

            },
            check: {
                required: true,
            }
        }
    });

    var windowHeight = $(window).height();
    $(document).on('scroll', function () {
        $('.slider').each(function () {
            var self = $(this),
                height = self.offset().top + self.height();
            if ($(document).scrollTop() + windowHeight >= height) {
                $('header .menu-wrap .menu li a').removeClass("active");
            }
        });
    });
    $(document).on('scroll', function () {
        $('.choose-us-block h2').each(function () {
            var self = $(this),
                height = self.offset().top + self.height();
            if ($(document).scrollTop() + windowHeight >= height) {
                $('header .menu-wrap .menu li a').removeClass("active");
                $('header .menu-wrap .menu li .tn1').addClass("active");
            }
        });
    });
    $(document).on('scroll', function () {
        $('.about-us .left-column h2').each(function () {
            var self = $(this),
                height = self.offset().top + self.height();
            if ($(document).scrollTop() + windowHeight >= height) {
                $('header .menu-wrap .menu li a').removeClass("active");
                $('header .menu-wrap .menu li .tn2').addClass("active");
            }
        });
    });
    $(document).on('scroll', function () {
        $('.contact-box .contact-wrap .right-column .wrap div').each(function () {
            var self = $(this),
                height = self.offset().top + self.height();
            if ($(document).scrollTop() + windowHeight >= height) {
                $('header .menu-wrap .menu li a').removeClass("active");
                $('header .menu-wrap .menu li .tn3').addClass("active");
            }
        });
    });

    $(function () {

        $('header .menu-wrap .menu li .tn1').on('click', function (e) {

            $('html,body').stop().animate({

                scrollTop: $('.choose-us-block').offset().top

            }, 1000);

            e.preventDefault();

        });

    });
    $(function () {

        $('header .menu-wrap .menu li .tn2').on('click', function (e) {

            $('html,body').stop().animate({

                scrollTop: $('.about-us .left-column h2').offset().top

            }, 1000);

            e.preventDefault();

        });

    });
    $(function () {

        $('header .menu-wrap .menu li .tn3').on('click', function (e) {

            $('html,body').stop().animate({

                scrollTop: $('.contact-box .contact-wrap .right-column .wrap div').offset().top

            }, 1000);

            e.preventDefault();

        });

    });


    function start() {
        $(".about-us .left-column .skills .line div").each(function () {
            var procent = $(this).attr('data-procent');
            var t = $(this).closest('.skills-line').find('.flex .procent');
            var w = $(this);
            var counter = 0;
            var c = 1;
            var i = setInterval(function () {
                t.html(c + "%");
                w.css("width", c + "%");
                counter++;
                c++;
                if (counter == procent) {
                    clearInterval(i);
                }
            }, 30);
        });
    }

    var target = $('.skills');
    var targetPos = target.offset().top;
    var winHeight = $(window).height();
    var scrollToElem = targetPos - winHeight;
    $(window).scroll(function () {
        var winScrollTop = $(this).scrollTop();
        if (winScrollTop > scrollToElem) {
            start();
            $(window).off('scroll')
        }
    });


    $("header .burger").on("click", function () {
        $("body").toggleClass('overflow-off');
        $(this).toggleClass('burger-toggle');
        $("header .menu-wrap").toggleClass('menu-toggle');
    });


    if (width <= 1024) {
        $("header .menu-wrap .menu  li .sub-menu").parent().append("<span></span>");
        $("header .menu-wrap .menu  li  span").click(function () {
            $(this).parent().find(" > .sub-menu").slideToggle(300);
            $(this).toggleClass("sub-active");
            return false;
        });

    }
});