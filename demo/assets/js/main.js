// Handle youtube video player 
(($) => {
  'use strict';
  
  // Lazy load video
  document.addEventListener("DOMContentLoaded", function() {
    var lazyVideos = [].slice.call(document.querySelectorAll("video.lazy"));

    if ("IntersectionObserver" in window) {
      var lazyVideoObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(function(video) {
          if (video.isIntersecting) {
            for (var source in video.target.children) {
              var videoSource = video.target.children[source];
              if (typeof videoSource.tagName === "string" && videoSource.tagName === "SOURCE") {
                if ( !isIos() && videoSource.classList.contains('mobile') ) {
                  continue;
                } 
                videoSource.src = videoSource.dataset.src;
              }
            }

            video.target.load();
            video.target.classList.remove("lazy");
            lazyVideoObserver.unobserve(video.target);
          }
        });
      });

      lazyVideos.forEach(function(lazyVideo) {
        lazyVideoObserver.observe(lazyVideo);
      });
    }
  });
  // Main process when document ready
  let backgroundVideo = document.getElementById('header-background-video');
  let sideVideo = document.getElementById('video-player');

  $(document).ready(() => {

    $('.play-button').on('click', () => {
      $('.video__content').fadeIn(() => {
        sideVideo.play();
      })
    });

    if ( typeof Vimeo !== 'undefined' ) {
      let vimeoPlayer = new Vimeo.Player(backgroundVideo)
      vimeoPlayer.on('play', () => {
        $('.video-background .video-placeholder').fadeOut();
      })
      
      // vimeoPlayer.setVolume(0.5);
      $(document).on('click', '.video__handles .handle.sound', (e) => {
        e.preventDefault();
        let currentTarget = $(e.currentTarget)
        let button = currentTarget.closest('.handle');
        if ( !button ) return;
        button.toggleClass('unmuted');
        button.find('svg').toggleClass('default');
        vimeoPlayer.setMuted(!button.hasClass('unmuted'))
      });


      let modalVideo = document.getElementById('unikbase-video');
      let modalPlayer;
      !!modalVideo && (modalPlayer = new Vimeo.Player(modalVideo));
      $(document).on('click', '.video-modal .wrapper', (event) => {
        event.preventDefault();
        $('.video-modal').removeClass('show');
        modalPlayer && modalPlayer.pause();
        vimeoPlayer && vimeoPlayer.play();
      });
      $(document).on('click', '.video__handles .handle.play', (e) => {
        event.preventDefault();
        $('.video-modal').addClass('show');
        vimeoPlayer && vimeoPlayer.pause();
      })
    }

    // Add smooth scrolling to all links
    $("a").on('click', function(event) {

      // Make sure this.hash has a value before overriding default behavior
      if (this.hash !== "" && this.pathname === window.location.pathname) {
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

    // 4 steps 
    $('#why-us .block .block__title').on('click', e => {
      let target = $(e.currentTarget).closest('.block__content');
      target.toggleClass('open');
    })

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

    let scale = 0.3;


		const minScale = 0.9;
		const maxScale = 1.2;
    function scrollingHandle(up = true) {
      let startAnimation = window.innerHeight || document.documentElement.clientHeight;
      let endAnimation = (window.innerHeight || document.documentElement.clientHeight)/2 - 50;
      $('.animation').each((i, el) => {
        let bounding = el.getBoundingClientRect();
        if ( bounding.top > startAnimation ) return;
        let distance = startAnimation - endAnimation;

        let start = startAnimation;
        let end = startAnimation - distance;
        let moving = Math.abs(bounding.top - start);

        let update = moving/distance * (1-scale) + scale;
        update < minScale && (update = minScale);
        update > maxScale && (update = maxScale);
        $(el).find('img').css({
          transform: `scale(${update})`
        })

        // bounding.height
      })
    }

    let lastScrollTop = 0;

    let scrollingListener = (e) => {
      let st = window.pageYOffset || document.documentElement.scrollTop; // Credits: "https://github.com/qeremy/so/blob/master/so.dom.js#L426"
      scrollingHandle(st > lastScrollTop);
      lastScrollTop = st <= 0 ? 0 : st; // For Mobile or negative scrolling
    }
    document.addEventListener('scroll', scrollingListener, {
        passive: true
    });
    scrollingListener();
  })


// for (i = 0; i < coll.length; i++) {
//   coll[i].addEventListener("click", function() {
//     this.classList.toggle("active");
//     var content = this.nextElementSibling;
//     if (content.style.maxHeight){
//       content.style.maxHeight = null;
//     } else {
//       content.style.maxHeight = content.scrollHeight + "px";
//     } 
//   });
// }
  $('.collapse__toggle').on('click', (e) => {
    e.preventDefault();
    let parent = $(e.currentTarget).closest('.collapse');
    let content = parent.find('.collapse__content')[0];
    if ( parent.hasClass('collapse--in') ) {
      parent.removeClass('collapse--in');
      content.style.maxHeight = null;
    } else {
      parent.addClass('collapse--in');
        content.style.maxHeight = content.scrollHeight + "px";
    }
      
  })

  $('.dropdown-menu .handle').on('click', (e) => {
    e.preventDefault();
    let target = $(e.currentTarget).parent();
    target.toggleClass('dropdown-menu--open');
  });
  $(document).on('click', e => {
    let target = e.target;
    let openMenu = $('.dropdown-menu--open');
    openMenu.each((i, el) => {
      ($(el).has(target).length <= 0) && $(el).removeClass('dropdown-menu--open');
    })
  })
  // Language menu handle
  $('.dropdown-menu .menu--languages [data-lang]').on('click', e => {
    let active = $(e.currentTarget);
    active.parent().find('li').removeClass('active');
    active.addClass('active');
    let handle = active.closest('.dropdown-menu').find('.handle');
    handle.text(active.text());
    handle.data('active-lang', active.data('lang'));

  })


  // Instgram feed
  const fetchInstgramPosts = async () => {
    const accessToken = ''
    // const response = await fetch(
    //   `https://graph.instagram.com/me/media?fields=id,caption,media_url,permalink&access_token=${accessToken}`,
    //   { cache: "reload" }
    // )
    try {
      var scripts = document.getElementsByTagName("script"),
      src = scripts[scripts.length-1].src;
      const response = await fetch(src.replace('main.js', 'instagram.json?version=1.0.1'));
      const { data } = await response.json()
      window.localStorage.setItem('instagram_unikbase', data);

      return data;
    } catch (e) {
      return [];
    }
  }

  const generateInstgramPost = (item, siteUrl) => {
    let el = document.createElement('div')
    el.classList.add('instagram__post');
    let anchor = document.createElement('a');
    anchor.href = item.permalink;
    anchor.target = '_blank';
    anchor.setAttribute('rel', 'noopener');
    anchor.setAttribute('title', item.caption || 'Instgram post');
    let image = document.createElement('img');

		let sourcePath = window.location.pathname.indexOf('index.html') < 0 ?'..':'';
		if ( !!window._current_lang ) {
			sourcePath += '/..'	
		}
		
    image.setAttribute('src', `${siteUrl}/${sourcePath}/${item.media_url}` );
    image.setAttribute('alt', item.caption || 'Instgram post');
    el.setAttribute('data-id', item.id);

    anchor.insertAdjacentElement('afterbegin', image);
    el.insertAdjacentElement('beforeend', anchor);

    return el;
  }

	const getSiteUrl = () => {

		const url = new URL(window.location.href);
		let path = url.pathname.split("/");
		path.pop();
		url.pathname = path.join("/")
		return url.href;
	}
  const generateSlider = (items, wrapper) => {
    if ( !wrapper ) return;
		const siteUrl = getSiteUrl();
    // let container = document.createElement('div');
    // container.classList.add('instagram__slider');
    items.forEach(el => {
      let item = generateInstgramPost(el, siteUrl);
      wrapper.insertAdjacentElement('beforeend', item);
    })
    // wrapper.insertAdjacentElement('beforeend', container);

  }

  $(document).ready(async () => {
    let wrapper = document.querySelector('#instagram .instagram__feed');
    if ( !wrapper  ) return;

    let data = await fetchInstgramPosts();
    if ( !data || data.length <= 0 ) {
      document.getElementById('instagram').classList.add('hide');
    }

    let placeholder = wrapper.querySelector('.instagram__slider--placeholder');
    !!placeholder && (placeholder.parentElement.removeChild(placeholder));

    let group = [];
    for( let i = 0; i < data.length; i++ ) {
      group.push(data[i]); 
      if ( group.length === 12 ) {
        generateSlider(group, wrapper); 
        group = [];
      }
    }
  })
})(jQuery);