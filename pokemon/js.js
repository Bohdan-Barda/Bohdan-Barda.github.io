$(document).ready(function(){
	$("#menu").on("click","a", function (event) {
		
		event.preventDefault();

		
		var id  = $(this).attr('#freelance'),

		//узнаем высоту от начала страницы до блока на который ссылается якорь
			top = $(id).offset(50px).top;
		
		//анимируем переход на расстояние - top за 1500 мс
		$('body,html').animate({scrollTop: top}, 1500);
	});
});


$('.slider').glide({
autoplay: 3000,

});