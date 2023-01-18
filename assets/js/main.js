
  // Handle youtube video player 
  
  function onYouTubeIframeAPIReady () {
    // iframeId parameter should match your Iframe's id attribute
    window.unikbaseVideo = new YT.Player('video-player', {
      width: 140,
      height: 105,
      videoId: 'Polqwhz1StI',
      playerVars: {
        rel: 0, 
        showinfo: 0, 
        ecver: 2, 
        modestbranding:  1, 
        loop: 1
      },
      events: {
        'onReady': function (event) {
          event.target.setVolume(0);
        }
      }
    });
  }
(($) => {
  'use strict';

  $(document).ready(() => {
    $('.play-button').on('click', () => {
      $('.video__content').fadeIn(() => {
        window.unikbaseVideo.playVideo();
        window.unikbaseVideo.setVolume(30);
      }, 300)
    });
    // Add smooth scrolling to all links
    $("a").on('click', function(event) {

      // Make sure this.hash has a value before overriding default behavior
      if (this.hash !== "") {
        // Prevent default anchor click behavior
        event.preventDefault();

        // Store hash
        var hash = this.hash;

        // Using jQuery's animate() method to add smooth page scroll
        // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
        $('html, body').animate({
          scrollTop: $(hash).offset().top -($('.site__navigation').hasClass('navigation--sticky')?$('.site__navigation').outerHeight() : 0)
        }, 800, function(){

          // Add hash (#) to URL when done scrolling (default click behavior)
          // window.location.hash = hash;
          history.pushState({}, '', hash);
        });
      } // End if
    });

    // Menentukan elemen yang dijadikan normal yaitu .normal
    var normalNavTop = $('.navigation--scroll').offset().top; 
    var normalNav = function(){
      var scrollTop = $(window).scrollTop();  
      // Kondisi jika discroll maka .nav ditambahkan class normal dan sebaliknya      
      if (scrollTop > normalNavTop) { 
          $('.site__navigation').addClass('navigation--sticky')
      } else {
        $('.site__navigation').removeClass('navigation--sticky')
      }
    };

    // Jalankan fungsi
    // normalNav();
    // $(window).scroll(function() {
    //   normalNav();
    // });

    // Detect change on element
    let detect = () => {
      var scrollTop = $(document).scrollTop();
      var anchors = $('#about-us, #what-we-do, #how-it-works');

      for (var i = 0; i < anchors.length; i++){
          if (scrollTop > $(anchors[i]).offset().top - 50 && scrollTop < $(anchors[i]).offset().top + $(anchors[i]).height() - 50) {
              $('.main-navigation .menu li a[href="#' + $(anchors[i]).attr('id') + '"]').parent().addClass('active');
          } else {
              $('.main-navigation .menu li a[href="#' + $(anchors[i]).attr('id') + '"]').parent().removeClass('active');
          }
      }
    }
    detect();
    $(window).scroll(detect);

    const body = document.querySelector('body');
    $(document).on('click', '.site__navigation .hamburger', (e) => {
      e.preventDefault();
      let parent = $('body');
      
      if ( !parent.hasClass('shown-navigation') ) {
        parent.addClass('shown-navigation');
      } else {
        parent.removeClass('shown-navigation');
      }
      return;
    })
    $('.main-navigation li a').on('click', (e) => {
      let parent = $('body');
      parent.removeClass('shown-navigation');
    })
  })
})(jQuery);