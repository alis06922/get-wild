(function($){
	$(document).ready(function() {	

    

		// Scroll to Top
		jQuery('.scrolltotop').click(function(){
			jQuery('html').animate({'scrollTop' : '0px'}, 400);
			return false;
		});
		
		jQuery(window).scroll(function(){
			var upto = jQuery(window).scrollTop();
			if(upto > 500) {
				jQuery('.scrolltotop').fadeIn();
			} else {
				jQuery('.scrolltotop').fadeOut();
			}
            if(upto > 20) {
                jQuery(".site-header").addClass("menufixed");
            }else {
                jQuery(".site-header").removeClass("menufixed");
            }
		});


        $('a.nav-link, .next-section-btn a, .action-button a , .earn-now-btn a , .SectionLinked').on('click', function() {
            var target = $(this.getAttribute('href'));
            if (target.length) {
                $('html, body').animate({
                    scrollTop: target.offset().top - 90
                }, 500);
            }
        });

        $('.nav-link').on('click', function() {
            const offcanvas = bootstrap.Offcanvas.getInstance($('#offcanvasNavbar')[0]);
            if (offcanvas) {
              offcanvas.hide();
            }
          });
		

	
		let counterTriggered = false;

            $(window).scroll(function() {
                const counterBox = $("#counter-box");
                const oTop = counterBox.offset().top - window.innerHeight;

                if (!counterTriggered && $(window).scrollTop() > oTop) {
                    $(".counter").each(function() {
                        const $this = $(this);
                        const countTo = Math.min(parseInt($this.attr("data-number"), 10), 100);

                        $({ countNum: 0 }).animate(
                            { countNum: countTo },
                            {
                                duration: 1000,
                                easing: "swing",
                                step: function(now) {
                                    $this.text(Math.ceil(now) + "%");
                                },
                                complete: function() {
                                    $this.text(countTo + "%");
                                }
                            }
                        );
                    });

                    counterTriggered = true;
                }
            });
		
		
			$(".faq-title").click(function() {
                const content = $(this).next(".faq-content");
                $(".faq-content").not(content).slideUp();
                content.slideToggle();
                $(this).toggleClass("active");
                $(".faq-title").not(this).removeClass("active");
            });
            
		
		
		
            new WOW().init();
		

            jQuery("#howToBuy").click(function(){
                jQuery(".for-how-to-buy").slideDown(500);
                jQuery(".main-hero , .main-about").slideUp(500);
            });


            $('.wild-slider-wp').owlCarousel({
                items: 6,
                nav: false,
                dots: false,
                mouseDrag: true,
                responsiveClass: true,
                loop: true,
                autoplay: true,
                autoplayTimeout: 1000, 
                autoplayHoverPause: true,
                smartSpeed: 1000, 
                autoplaySpeed: 2000,
                slideTransition: 'linear', 
                responsive: {
                    0: { items: 3 },
                    577: { items: 4 },
                    769: { items: 6 }
                }
            });
		
	});
})(jQuery);


// count down js 

$(document).ready(function () {
    function startCountdown(targetDate) {
        function updateCountdown() {
            let now = new Date().getTime();
            let timeLeft = targetDate - now;

            if (timeLeft <= 0) {
                $("#days, #hours, #minutes, #seconds").text("00");
                clearInterval(countdownInterval);
                return;
            }

            let days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
            let hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            let minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            let seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

            $("#days").text(days < 10 ? "0" + days : days);
            $("#hours").text(hours < 10 ? "0" + hours : hours);
            $("#minutes").text(minutes < 10 ? "0" + minutes : minutes);
            $("#seconds").text(seconds < 10 ? "0" + seconds : seconds);
        }

        updateCountdown();
        let countdownInterval = setInterval(updateCountdown, 1000);
    }

    // Set your target date (YYYY, MM - 1, DD, HH, MM, SS)
    let targetDate = new Date(2025, 2, 20, 0, 0, 0).getTime();
    startCountdown(targetDate);
});


// progressbar js 


$(document).ready(function () {
    // Function to start the progress animation
    function startProgressAnimation($element) {
        let percentage = $element.data("percentage");
        let progressBar = $element.find(".progress");
        let percentageText = $element.find(".percentage");

        // Set the initial width of the progress bar
        progressBar.css("width", percentage + "%");

        // Animate the progress bar width and text
        $({ countNum: 0 }).animate({ countNum: percentage }, {
            duration: 1500,
            easing: "swing",
            step: function () {
                percentageText.text(Math.floor(this.countNum) + "%");
            },
            complete: function () {
                percentageText.text(percentage + "%");
            }
        });
    }

    // Create an IntersectionObserver to detect when elements enter the viewport
    const observer = new IntersectionObserver((entries, observerInstance) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !$(entry.target).hasClass("animated")) {
                $(entry.target).addClass("animated");  
                startProgressAnimation($(entry.target));
                observerInstance.unobserve(entry.target); 
            }
        });
    }, { threshold: 0.5 }); 

    $(".progress-container").each(function () {
        observer.observe(this);
    });

    $(window).on('load', function () {
        $(".progress-container").each(function () {
            let $element = $(this);
            let elementTop = $element.offset().top;
            let windowBottom = $(window).scrollTop() + $(window).height();

            // If the element is already in view, animate it
            if (windowBottom > elementTop) {
                startProgressAnimation($element);
                $element.addClass("animated");
            }
        });
    });
});



// token exchange box js 

$(document).ready(function () {
    $('input[type="radio"][name="token"]').on('change', function () {
        var iconUrl = $(this).data('icon');
        var rate = $(this).data('rate'); 
        var leftInputValue = $('#input1').val();

        $('#tokenIcon').html('<img src="' + iconUrl + '" alt="Token Icon" style="width: 30px; height: 30px;">');
        var calculatedPrice = leftInputValue * rate / 100;
        $('#input2').val(calculatedPrice);

        $('#input1').prop('readonly', false);
        $('#input2').prop('readonly', false);
        $('.single-token').removeClass('active');
        $(this).closest('.single-token').addClass('active');
    });
    $('input[type="radio"][name="token"]:checked').trigger('change');

    $('#input1').on('input', function () {
        var leftInputValue = $(this).val();
        var rate = $('input[type="radio"][name="token"]:checked').data('rate');
        var calculatedPrice = leftInputValue * rate / 100;
        $('#input2').val(calculatedPrice);
    });
    $('#input2').on('input', function () {
        var rightInputValue = $(this).val();
        var rate = $('input[type="radio"][name="token"]:checked').data('rate');
        var calculatedLeftValue = (rightInputValue * 100) / rate; 
        $('#input1').val(calculatedLeftValue);
    });
});

