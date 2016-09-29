(function( $ ){

  "use strict";

  $.fn.fitVids = function( options ) {
    var settings = {
      customSelector: null
    };

    if(!document.getElementById('fit-vids-style')) {
      // appendStyles: https://github.com/toddmotto/fluidvids/blob/master/dist/fluidvids.js
      var head = document.head || document.getElementsByTagName('head')[0];
      var css = '.fluid-width-video-wrapper{width:100%;position:relative;padding:0;}.fluid-width-video-wrapper iframe,.fluid-width-video-wrapper object,.fluid-width-video-wrapper embed {position:absolute;top:0;left:0;width:100%;height:100%;}';
      var div = document.createElement('div');
      div.innerHTML = '<p>x</p><style id="fit-vids-style">' + css + '</style>';
      head.appendChild(div.childNodes[1]);
    }

    if ( options ) {
      $.extend( settings, options );
    }

    return this.each(function(){
      var selectors = [
        "iframe[src*='player.vimeo.com']",
        "iframe[src*='youtube.com']",
        "iframe[src*='youtube-nocookie.com']",
        "iframe[src*='kickstarter.com'][src*='video.html']",
        "object",
        "embed"
      ];

      if (settings.customSelector) {
        selectors.push(settings.customSelector);
      }

      var $allVideos = $(this).find(selectors.join(','));
      $allVideos = $allVideos.not("object object"); // SwfObj conflict patch

      $allVideos.each(function(){
        var $this = $(this);
        if (this.tagName.toLowerCase() === 'embed' && $this.parent('object').length || $this.parent('.fluid-width-video-wrapper').length) { return; }
        var height = ( this.tagName.toLowerCase() === 'object' || ($this.attr('height') && !isNaN(parseInt($this.attr('height'), 10))) ) ? parseInt($this.attr('height'), 10) : $this.height(),
            width = !isNaN(parseInt($this.attr('width'), 10)) ? parseInt($this.attr('width'), 10) : $this.width(),
            aspectRatio = height / width;
        if(!$this.attr('id')){
          var videoID = 'fitvid' + Math.floor(Math.random()*999999);
          $this.attr('id', videoID);
        }
        $this.wrap('<div class="fluid-width-video-wrapper"></div>').parent('.fluid-width-video-wrapper').css('padding-top', (aspectRatio * 100)+"%");
        $this.removeAttr('height').removeAttr('width');
      });
    });
  };
// Works with either jQuery or Zepto
})( window.jQuery || window.Zepto );

/* globals jQuery, document */
(function ($, undefined) {
    "use strict";

    var $document = $(document);

    $document.ready(function () {

        var $postContent = $(".post-content");
        $postContent.fitVids();

        $(".scroll-down").arctic_scroll();
        $(".scroll-up").arctic_scroll();

        var animateBlock={
            isVisiable:function(el,wh,st,delta){
                delta = delta || $(el).height() * 0.3;
                //console.log($(el).offset().top,wh,st,delta)
                return $(el).offset().top < wh + st - delta;
            },
            animations:[
                function scrollUpAnimate (wh, st) {
                    var element = $('.scroll-up'),
                        tag = $('.main-header');
                    // console.log(tag.offset().top, st - tag.height());
                    if (animateBlock.isVisiable(tag, 0, st, tag.height())) {
                        element.animate({
                            right: '16px'
                        }, 400, 'swing', function () {
                            animateBlock.animations[0] = scrollUpAnimate;
                        });
                    } else {
                        element.animate({
                            right: '-44px'
                        }, 400, 'swing', function () {
                            animateBlock.animations[0] = scrollUpAnimate;
                        });
                    }
                    animateBlock.animations[0] = undefined;
                }
            ]
        }

        var winHeight=$(window).height(),
            scrollTop=$(window).scrollTop();

        $(".loop-post").each(function (index) {
            var element = $(this);
            if (!animateBlock.isVisiable(element, winHeight, scrollTop)) {
                animateBlock.animations[index + 1] = function (wh, st) {
                    if (animateBlock.isVisiable(element, wh, st)) {
                        element.find('header').delay(100).animate({
                            left: 0,
                            opacity: 1
                        }, 400);
                        element.find('section').delay(150).animate({
                            left: 0,
                            opacity: 1
                        }, 400);
                        element.find('footer').delay(200).animate({
                            left: 0,
                            opacity: 1
                        }, 400);
                        animateBlock.animations[index + 1] = undefined;
                    }
                };
            } else {
                element.children().css({
                    left: 0,
                    opacity: 1
                });
            }
        });

        var animationHandler = function () {
            var animations,
                name,
                winHeight=$(window).height(),
                scrollTop=$(window).scrollTop();

            animations=animateBlock.animations;
            // console.log(animations);
            for(name in animations){
                if (animations[name]) {
                    animations[name](winHeight,scrollTop);
                }
            }
        };

        $(window).on("scroll", animationHandler);
        $(window).bind('scrollstop', animationHandler);

    });

    // Arctic Scroll by Paul Adam Davis
    // https://github.com/PaulAdamDavis/Arctic-Scroll
    $.fn.arctic_scroll = function (options) {

        var defaults = {
            elem: $(this),
            speed: 500
        },

        allOptions = $.extend(defaults, options);

        allOptions.elem.click(function (event) {
            event.preventDefault();
            var $this = $(this),
                $htmlBody = $('html, body'),
                offset = ($this.attr('data-offset')) ? $this.attr('data-offset') : false,
                position = ($this.attr('data-position')) ? $this.attr('data-position') : false,
                toMove;

            if (offset) {
                toMove = parseInt(offset);
                $htmlBody.stop(true, false).animate({scrollTop: ($(this.hash).offset().top + toMove) }, allOptions.speed);
            } else if (position) {
                toMove = parseInt(position);
                $htmlBody.stop(true, false).animate({scrollTop: toMove }, allOptions.speed);
            } else {
                $htmlBody.stop(true, false).animate({scrollTop: ($(this.hash).offset().top) }, allOptions.speed);
            }
        });

    };
})(jQuery);

$(function() {
    $('time').each(function (index) {
        var time = $(this).text();
        $(this).text(moment(time).toNow());
    });
});
