$(function () {
    $('#blue').click(function () {
        $('#T-Shirt-blue').removeClass('none');
    });
});
$(function () {
    $('#blue').click(function () {
        $('#T-Shirt-yellow').addClass('none');
    });
});
$(function () {
    $('#yellow').click(function () {
        $('#T-Shirt-yellow').removeClass('none');
    });
});
$(function () {
    $('#black').click(function () {
        $('#T-Shirt-yellow').addClass('none');
    });
});
$(function () {
    $('#black').click(function () {
        $('#T-Shirt-blue').addClass('none');
    });
});
$(function () {
    $('#cart').click(function () {
        $('#modal').removeClass('none');
    });
});
$(function () {
    $('#closed').click(function () {
        $('#modal').addClass('none');
    });
});
$(document).ready(function () {
    $('#addcart').click(function () {
        alert("Product add to cart")
    });
});
$('#arrow-down').click(function () {
    $('html, body').animate({
        scrollTop: $('#selected').position().top
    }, 500);
});
$('#products').click(function () {
    $('html, body').animate({
        scrollTop: $('#selected').position().top
    }, 500);
});
$(function () {
    $('#men').click(function () {
        $('#men-product').toggleClass('none');
        $('html, body').animate({
            scrollTop: $('#men-product').position().top
        }, 500);
    });
});
$(function () {
    $('#women').click(function () {
        $('#women-product').toggleClass('none');
        $('html, body').animate({
            scrollTop: $('#women-product').position().top
        }, 500);
    });
});
$(function () {
    $('#children').click(function () {
        $('#children-product').toggleClass('none');
        $('html, body').animate({
            scrollTop: $('#children-product').position().top
        }, 500);
    });
});
$(function () {
    $('#seeall').click(function () {
        $('#women-product').removeClass('none');
        $("#women").prop('checked', 'true');
        $('#men-product').removeClass('none');
        $("#men").prop('checked', 'true');
        $('#children-product').removeClass('none');
        $("#children").prop('checked', 'true');
    });
});
$(function () {
    $('.right').click(function () {
        $('.product1').addClass('none');
        $('.product2').removeClass('none');
        $('.numb').html('2');
    });
});
$(function () {
    $('.left').click(function () {
        $('.product1').removeClass('none');
        $('.product2').addClass('none');
        $('.numb').html('1');
    });
});