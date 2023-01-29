
  // Handle youtube video player 
  
  // function onYouTubeIframeAPIReady () {
  //   // iframeId parameter should match your Iframe's id attribute
  //   window.unikbaseVideo = new YT.Player('video-player', {
  //     width: 140,
  //     height: 105,
  //     videoId: 'Polqwhz1StI',
  //     playerVars: {
  //       rel: 0, 
  //       showinfo: 0, 
  //       ecver: 2, 
  //       modestbranding:  1, 
  //       loop: 1
  //     },
  //     events: {
  //       'onReady': function (event) {
  //         event.target.setVolume(0);
  //       }
  //     }
  //   });
  // }
(($) => {
  'use strict';
  let video = document.getElementById('video-player');
  $(document).ready(() => {
    $('.play-button').on('click', () => {
      $('.video__content').fadeIn(() => {
        video.play();
      })
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
        update < 0 && (update = 0);
        update > 1 && (update = 1);
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
      const response = await fetch(src.replace('main.js', 'instagram.json'));
      const { data } = await response.json()
      window.localStorage.setItem('instagram_unikbase', data);

      return data;
    } catch (e) {
      return [];
    }
  }

  const generateInstgramPost = (item) => {
    let el = document.createElement('div')
    el.classList.add('instagram__post');
    let anchor = document.createElement('a');
    anchor.href = item.permalink;
    anchor.target = '_blank';
    anchor.setAttribute('rel', 'noopener');
    anchor.setAttribute('title', item.caption || 'Instgram post');
    let image = document.createElement('img');
    image.setAttribute('src', item.media_url);
    image.setAttribute('alt', item.caption || 'Instgram post');
    el.setAttribute('data-id', item.id);

    anchor.insertAdjacentElement('afterbegin', image);
    el.insertAdjacentElement('beforeend', anchor);

    return el;
  }

  const generateSlider = (items, wrapper) => {
    if ( !wrapper ) return;
    
    // let container = document.createElement('div');
    // container.classList.add('instagram__slider');
    items.forEach(el => {
      let item = generateInstgramPost(el);
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