(function ($) {

	"use strict";

	// Preload
	$(window).on('load', function () { // makes sure the whole site is loaded
		$('[data-loader="circle-side"]').fadeOut(); // will first fade out the loading animation
		$('#preloader').delay(350).fadeOut('slow'); // will fade out the white DIV that covers the website.
		$('body').delay(350);
	})
	
	// Background Image
	$('.background-image').each(function(){
		$(this).css('background-image', $(this).attr('data-background'));
	});

	// Opacity mask
	$('.opacity-mask').each(function(){
		$(this).css('background-color', $(this).attr('data-opacity-mask'));
	});

	// Video modal
	$('.btn_play').magnificPopup({
		type: 'iframe',
		closeMarkup: '<button title="%title%" type="button" class="mfp-close" style="font-size:26px; margin-right:-10px;">&#215;</button>'
	});

	// Modal
	$('.modal_dialog').magnificPopup({
		type: 'inline',
		fixedContentPos: true,
		fixedBgPos: true,
		overflowY: 'auto',
		closeBtnInside: true,
		preloader: false,
		midClick: true,
		removalDelay: 300,
		closeMarkup: '<button title="%title%" type="button" class="mfp-close"></button>',
		mainClass: 'my-mfp-zoom-in'
	});

	// Show hide password
	$('#password, #password1, #password2').hidePassword('focus', {
		toggle: {
			className: 'my-toggle'
		}
	});

	// Forgot Password
	$("#forgot").on('click', function () {
		$("#forgot_pw").fadeToggle("fast");
	});

	// Float labels
	var floatlabels = new FloatLabels( 'form.input_style_1', {
		    style: 1
	});
	var floatlabels2 = new FloatLabels( 'form.input_style_2', {
		    style: 0
	});

	/* Tooltip */
	var tooltipTriggerList = [].slice.call(document.querySelectorAll('.tooltip-1'))
	var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
	  return new bootstrap.Tooltip(tooltipTriggerEl)
	})

})(window.jQuery); 