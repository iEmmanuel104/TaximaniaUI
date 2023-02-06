(function ($) {
  "use strict"; //data background

  $('[data-background]').each(function () {
    var $data_bg = $(this).attr('data-background');
    $(this).css({
      "background-image": 'url(' + $data_bg + ')'
    });
  }); //offcanvas function

  function offCanvus() {
    $(".ofcanvus-toggle").on("click", function () {
      $(".at_offcanvus_menu").addClass("active");
    });
    $(".at-offcanvus-close").on("click", function () {
      $(".at_offcanvus_menu").removeClass("active");
    });
    $(document).on("mouseup", function (e) {
      var offCanvusMenu = $(".at_offcanvus_menu");

      if (!offCanvusMenu.is(e.target) && offCanvusMenu.has(e.target).length === 0) {
        $(".at_offcanvus_menu").removeClass("active");
      }
    });
  }

  offCanvus(); //mobile menu 

  $(".mobile-menu-toggle").on("click", function () {
    $(".mobile-menu").addClass("active");
  });
  $(".mobile-menu .close-menu").on("click", function () {
    $(".mobile-menu").removeClass("active");
  });
  $(".mobile-menu ul li.has-submenu a").each(function () {
    $(this).on("click", function () {
      $(this).siblings('ul').slideToggle();
      $(this).toggleClass("icon-rotate");
    });
  });
  $(document).on("mouseup", function (e) {
    var offCanvusMenu = $(".mobile-menu");

    if (!offCanvusMenu.is(e.target) && offCanvusMenu.has(e.target).length === 0) {
      $(".mobile-menu").removeClass("active");
    }
  }); //section scrolldown 

  $(".btn-scroll-down").on("click", function () {
    $("html,body").animate({
      scrollTop: 600
    });
    return false;
  }); //scroll top animation

  $(".theme-scrolltop-btn").on("click", function () {
    $("body,html").animate({
      scrollTop: 0
    }, 1500, 'easeOutCubic');
  }); //counterup 

  $('.counter').counterUp({
    delay: 10,
    time: 1000
  }); //video popup 

  $('.video-popup-btn').magnificPopup({
    type: 'iframe'
  }); //theme slider 

  const at_hero_slider = new Swiper('.at-hero-slider-wrapper', {
    slidesPerView: 1,
    loop: true,
    spaceBetween: 0,
    autoplay: {
      delay: 5000
    },
    speed: 900,
    effect: 'fade',
    fadeEffect: {
      crossFade: true
    },
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    }
  }); //add banner slider

  const ad_banner_slider = new Swiper(".banner-slider", {
    slidesPerView: 2,
    loop: true,
    spaceBetween: 24,
    autoplay: {
      delay: 4000
    },
    speed: 900,
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    },
    breakpoints: {
      0: {
        slidesPerView: 1
      },
      768: {
        slidesPerView: 2
      }
    }
  });
  const feedback_slider = new Swiper(".at_feedback_slider", {
    slidesPerView: 1,
    loop: true,
    spaceBetween: 24,
    autoplay: {
      delay: 5000
    },
    speed: 1500,
    navigation: {
      nextEl: '.slide-btn-next',
      prevEl: '.slide-btn-prev'
    }
  });
  const h2FeedbackSlider = new Swiper(".h2-feedback-slider", {
    slidesPerView: 2,
    loop: true,
    spaceBetween: 24,
    autoplay: {
      delay: 5000
    },
    speed: 1500,
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    },
    breakpoints: {
      0: {
        slidesPerView: 1
      },
      992: {
        slidesPerView: 2
      }
    }
  });
  const carThumbSlider = new Swiper(".car-thumb-slider", {
    loop: true,
    spaceBetween: 24,
    slidesPerView: 3,
    freeMode: true,
    watchSlidesProgress: true,
    navigation: {
      nextEl: ".slider-button-next",
      prevEl: ".slider-button-prev"
    },
    breakpoints: {
      0: {
        slidesPerView: 2
      },
      576: {
        slidesPerView: 3
      },
      1200: {
        slidesPerView: 2
      },
      1400: {
        slidesPerView: 3
      }
    }
  });
  const carSlider = new Swiper(".car-slider", {
    loop: true,
    spaceBetween: 10,
    thumbs: {
      swiper: carThumbSlider
    }
  });
  $(".hero3-slider").slick({
    slidesToShow: 1,
    arrows: false,
    dots: true,
    autoplay: true,
    fade: true,
    autoplaySpeed: 5000,
    speed: 1000
  });
  const h3FeedbackControl = new Swiper(".h3-feedback-client-slider", {
    spaceBetween: 24,
    slidesPerView: 4,
    freeMode: true,
    watchSlidesProgress: true,
    breakpoints: {
      0: {
        slidesPerView: 1
      },
      768: {
        slidesPerView: 2
      },
      992: {
        slidesPerView: 3
      },
      1200: {
        slidesPerView: 4
      }
    }
  });
  const h3FeedbackSlider = new Swiper(".h3-feedback-slider", {
    loop: true,
    spaceBetween: 24,
    thumbs: {
      swiper: h3FeedbackControl
    }
  }); //Category Menu 

  $(".category-toggle").on("click", function () {
    $(".product_category_nav").slideToggle();
  }); //custom scrollbar

  $(".at_scrollbar").mCustomScrollbar({
    axis: "y"
  });
  const h4_hero_slider = new Swiper(".h4-hero-slider", {
    slidesPerView: 1,
    loop: true,
    spaceBetween: 10,
    autoplay: true,
    speed: 1500,
    effect: 'fade',
    fadeEffect: {
      crossFade: true
    },
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    }
  }); //Countdown

  $(".countdown-timer").each(function () {
    var $data_date = $(this).data('date');
    $(this).countdown({
      date: $data_date
    });
  });
  const flashSalesSlider = new Swiper(".flash-sales-slider", {
    slidesPerView: 4,
    spaceBetween: 24,
    loop: true,
    autoplay: true,
    speed: 1500,
    navigation: {
      nextEl: '.flash-button-next',
      prevEl: '.flash-button-prev'
    },
    breakpoints: {
      0: {
        slidesPerView: 1
      },
      576: {
        slidesPerView: 2
      },
      992: {
        slidesPerView: 3
      },
      1200: {
        slidesPerView: 4
      }
    }
  });
  const h4_ct_slider_1 = new Swiper(".h4_ct_slider_1", {
    slidesPerView: 3,
    spaceBetween: 10,
    loop: true,
    autoplay: true,
    speed: 1500,
    navigation: {
      nextEl: '.flash-button-next',
      prevEl: '.flash-button-prev'
    },
    breakpoints: {
      0: {
        slidesPerView: 1
      },
      400: {
        slidesPerView: 2
      },
      768: {
        slidesPerView: 3
      },
      992: {
        slidesPerView: 4
      },
      1200: {
        slidesPerView: 3
      }
    }
  });
  const h4_ct_slider_2 = new Swiper(".h4_ct_slider_2", {
    slidesPerView: 4,
    spaceBetween: 24,
    loop: true,
    autoplay: true,
    speed: 1500,
    navigation: {
      nextEl: '.flash-button-next',
      prevEl: '.flash-button-prev'
    },
    breakpoints: {
      0: {
        slidesPerView: 1
      },
      550: {
        slidesPerView: 2
      },
      992: {
        slidesPerView: 3
      },
      1200: {
        slidesPerView: 4
      }
    }
  });
  const megaMenuSlider = new Swiper(".megamenu-slider", {
    slidesPerView: 1,
    spaceBetween: 16,
    autoplay: true,
    speed: 1500
  });
  const productThumbSlider = new Swiper(".product_thumb_slider", {
    loop: true,
    spaceBetween: 16,
    slidesPerView: 3,
    freeMode: true,
    watchSlidesProgress: true,
    navigation: {
      nextEl: ".slider-button-next",
      prevEl: ".slider-button-prev"
    },
    breakpoints: {
      0: {
        slidesPerView: 3
      },
      576: {
        slidesPerView: 3
      },
      1200: {
        slidesPerView: 2
      },
      1400: {
        slidesPerView: 4
      }
    }
  });
  const productViewSlider = new Swiper(".product_feature_img_slider", {
    loop: true,
    spaceBetween: 10,
    thumbs: {
      swiper: productThumbSlider
    }
  });
  const blogGridSlider = new Swiper(".blog-grid-slider", {
    slidesPerView: 1,
    autoplay: true,
    loop: true,
    spaceBetween: 10,
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    }
  });
  const inventorySlider = new Swiper(".inventroy-slider", {
    slidesPerView: 4,
    autoplay: true,
    loop: true,
    spaceBetween: 24,
    navigation: {
      nextEl: ".slider-btn-next",
      prevEl: ".slider-btn-prev"
    },
    breakpoints: {
      0: {
        slidesPerView: 1
      },
      768: {
        slidesPerView: 2
      },
      992: {
        slidesPerView: 3
      },
      1400: {
        slidesPerView: 4
      }
    }
  });
  const ivThumbControlSlider = new Swiper(".iv_thumb_control_slider", {
    slidesPerView: 4,
    loop: true,
    spaceBetween: 24,
    breakpoints: {
      0: {
        slidesPerView: 3,
        spaceBetween: 16
      },
      992: {
        slidesPerView: 4,
        spaceBetween: 24
      }
    }
  });
  const ivThumbSlider = new Swiper(".iv_thumb_slider", {
    slidesPerView: 1,
    autoplay: true,
    loop: true,
    spaceBetween: 16,
    thumbs: {
      swiper: ivThumbControlSlider
    }
  });
  const shopProductslider = new Swiper(".shop-products-slider", {
    slidesPerView: 1,
    autoplay: true,
    loop: true,
    spaceBetween: 16,
    breakpoints: {
      0: {
        slidesPerView: 1
      },
      576: {
        slidesPerView: 2
      },
      992: {
        slidesPerView: 3
      },
      1200: {
        slidesPerView: 1
      }
    }
  });
  const productThumbSlider2 = new Swiper(".product_thumb_slider_2", {
    loop: true,
    spaceBetween: 16,
    slidesPerView: 3,
    freeMode: true,
    watchSlidesProgress: true,
    navigation: {
      nextEl: ".slider-button-next",
      prevEl: ".slider-button-prev"
    },
    breakpoints: {
      0: {
        slidesPerView: 3
      },
      576: {
        slidesPerView: 3
      },
      1200: {
        slidesPerView: 2
      },
      1400: {
        slidesPerView: 4
      }
    }
  });
  const productViewSlider2 = new Swiper(".product_feature_img_slider_2", {
    loop: true,
    spaceBetween: 10,
    thumbs: {
      swiper: productThumbSlider2
    }
  }); //dealer sidebar slider

  $(".dl_slider_wrapper").slick({
    slidesToShow: 1,
    arrows: false,
    dots: true,
    responsive: [{
      breakpoint: 1200,
      settings: {
        slidesToShow: 3
      }
    }, {
      breakpoint: 992,
      settings: {
        slidesToShow: 2
      }
    }, {
      breakpoint: 576,
      settings: {
        slidesToShow: 1
      }
    }]
  }); //Related Products Slider

  const rlProductSlider = new Swiper(".rl-products-slider", {
    slidesPerView: 4,
    spaceBetween: 24,
    loop: true,
    autoplay: true,
    navigation: {
      nextEl: '.slider-button-next',
      prevEl: '.slider-button-prev'
    },
    breakpoints: {
      0: {
        slidesPerView: 1
      },
      576: {
        slidesPerView: 2,
        spaceBetween: 16
      },
      992: {
        slidesPerView: 3,
        spaceBetween: 24
      },
      1400: {
        slidesPerView: 4
      }
    }
  });
  const dealerSlider = new Swiper(".dealership-slider", {
    loop: true,
    spaceBetween: 24,
    autoplay: true,
    slidesPerView: 3,
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    },
    breakpoints: {
      0: {
        slidesPerView: 1,
        spaceBetween: 16
      },
      768: {
        slidesPerView: 2
      },
      992: {
        slidesPerView: 3
      },
      1400: {
        slidesPerView: 4
      }
    }
  }); //sr feedback slider

  const srFeedbackSlider = new Swiper(".sr-feedback-slider", {
    loop: true,
    spaceBetween: 24,
    autoplay: true,
    slidesPerView: 3,
    breakpoints: {
      0: {
        slidesPerView: 1,
        spaceBetween: 16
      },
      768: {
        slidesPerView: 2
      },
      1200: {
        slidesPerView: 3
      }
    }
  }); //dealership 2 brand slider 

  const bannerSlider2 = new Swiper(".dl2-banner-slider", {
    loop: true,
    spaceBetween: 24,
    slidesPerView: 1,
    autoplay: true,
    speed: 1000,
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    }
  });
  const dl2FeedbackSlider = new Swiper(".dl2-feedback-slider", {
    loop: true,
    spaceBetween: 24,
    autoplay: true,
    speed: 1000,
    breakpoints: {
      992: {
        slidesPerView: 2
      },
      1200: {
        slidesPerView: 1
      }
    }
  }); //content expand 

  $(".iv-expand-btn").on("click", function (e) {
    e.preventDefault();
    $(".expanded-content").slideDown();
  });
  $('.theme-date-input').datetimepicker({
    icons: {
      time: 'fa-solid fa-clock'
    }
  }); //theme file upload

  var file_upload = $(".file_upload");
  file_upload.children(".btn").on("click", function () {
    $(this).siblings('input').click();
  });
  file_upload.children('input').on("change", function () {
    var file_list = $('<ul></ul>');
    for (var i = 0; i < this.files.length; i++) {
      file_list.append('<li>' + this.files[i].name + '</li>');
    }
    $(this).siblings(".file_name").html(file_list);
  }); //Progressbar

  $(".progress-bar-line").ProgressBar(); //listing scroll nav

  $(".car_listing_nav ul li a").each(function () {
    $(this).on("click", function (e) {
      e.preventDefault();
      var hashOffset = $(this.hash).offset().top - 100;
      $("body,html").animate({
        scrollTop: hashOffset
      }, 1000, 'easeOutCubic');
    });
  }); //shipping form slideToggle 

  $(".alternate-shipping label").on("click", function () {
    if ($(this).children("input").is(":checked")) {
      $(".alternate-shipping-form").slideDown();
    } else {
      $(".alternate-shipping-form").slideUp();
    }
  });
  $(window).on('scroll', function () {
    //header sticky 
    var scrollBar = $(this).scrollTop();

    if (scrollBar > 100) {
      $(".header-sticky").addClass("sticky-on");
    } else {
      $(".header-sticky").removeClass("sticky-on");
    } //theme scrolltop button 


    if (scrollBar > 300) {
      $(".theme-scrolltop-btn").fadeIn();
    } else {
      $(".theme-scrolltop-btn").fadeOut();
    } //vertical listing menu


    var scrollBarPosition = $(window).scrollTop();
    $(".car_listing_nav ul li a").each(function () {
      var navOffset = $(this.hash).offset().top - 120;

      if (scrollBarPosition > navOffset) {
        $(this).parents("ul").find("a.active").removeClass("active");
        $(this).addClass("active");
      }
    });
  });
  $(window).on('load', function () {
    //preloader
    $(".ring-preloader").fadeOut();
    var $grid = $('.filter-grid').isotope({});
    $('.collection-filter-controls').on('click', 'button', function () {
      var filterValue = $(this).attr('data-filter');
      $grid.isotope({
        filter: filterValue
      });
    }); //active btn switch 

    $(".collection-filter-controls button").each(function () {
      $(this).on("click", function () {
        $(this).parent().find("button.active").removeClass("active");
        $(this).addClass("active");
      });
    }); // filter grid 2

    var $filter_grid_2 = $('.filter_grid_2').isotope({});
    $('.h4-filter-btn-group').on('click', 'button', function () {
      var filterValue = $(this).attr('data-filter');
      $filter_grid_2.isotope({
        filter: filterValue
      });
      $(this).parent(".h4-filter-btn-group").find("button.active").removeClass("active");
      $(this).addClass("active");
    }); // filter grid 3

    var $filter_grid_3 = $('.filter_grid_3').isotope({});
    $('.bs-filter-btn-group').on('click', 'button', function () {
      var filterValue = $(this).attr('data-filter');
      $filter_grid_3.isotope({
        filter: filterValue
      });
      $(this).parent(".bs-filter-btn-group").find("button.active").removeClass("active");
      $(this).addClass("active");
    }); //masonry grid 

    $('.masonry_grid').isotope({
      itemSelector: '.grid_item',
      percentPosition: true,
      masonry: {
        columnWidth: 1
      }
    });
    var filter_grid_4 = $(".featured_masonry");
    $('.listing-ft-controls').on('click', 'button', function () {
      var filterValue = $(this).attr('data-filter');
      filter_grid_4.isotope({
        filter: filterValue
      });
      $(this).parent(".listing-ft-controls").find("button.active").removeClass("active");
      $(this).addClass("active");
    });
  });


  
    $.fn.sliderResponsive = function (settings) {

      var set = $.extend(
        {
          slidePause: 5000,
          fadeSpeed: 1000,
          autoPlay: "on",
          showArrows: "off",
          hideDots: "off",
          hoverZoom: "on",
          titleBarTop: "off"
        },
        settings
      );

      var $slider = $(this);
      var size = $slider.find("> div").length; //number of slides
      var position = 0; // current position of carousal
      var sliderIntervalID; // used to clear autoplay

      // Add a Dot for each slide
      $slider.append("<ul></ul>");
      $slider.find("> div").each(function () {
        $slider.find("> ul").append('<li></li>');
      });

      // Put .show on the first Slide
      $slider.find("div:first-of-type").addClass("show");

      // Put .showLi on the first dot
      $slider.find("li:first-of-type").addClass("showli")

      //fadeout all items except .show
      $slider.find("> div").not(".show").fadeOut();

      // If Autoplay is set to 'on' than start it
      if (set.autoPlay === "on") {
        startSlider();
      }

      // If showarrows is set to 'on' then don't hide them
      if (set.showArrows === "on") {
        $slider.addClass('showArrows');
      }

      // If hideDots is set to 'on' then hide them
      if (set.hideDots === "on") {
        $slider.addClass('hideDots');
      }

      // If hoverZoom is set to 'off' then stop it
      if (set.hoverZoom === "off") {
        $slider.addClass('hoverZoomOff');
      }

      // If titleBarTop is set to 'on' then move it up
      if (set.titleBarTop === "on") {
        $slider.addClass('titleBarTop');
      }

      // function to start auto play
      function startSlider() {
        sliderIntervalID = setInterval(function () {
          nextSlide();
        }, set.slidePause);
      }

      // on mouseover stop the autoplay
      $slider.mouseover(function () {
        if (set.autoPlay === "on") {
          clearInterval(sliderIntervalID);
        }
      });

      // on mouseout starts the autoplay
      $slider.mouseout(function () {
        if (set.autoPlay === "on") {
          startSlider();
        }
      });

      //on right arrow click
      $slider.find("> .right").click(nextSlide)

      //on left arrow click
      $slider.find("> .left").click(prevSlide);

      // Go to next slide
      function nextSlide() {
        position = $slider.find(".show").index() + 1;
        if (position > size - 1) position = 0;
        changeCarousel(position);
      }

      // Go to previous slide
      function prevSlide() {
        position = $slider.find(".show").index() - 1;
        if (position < 0) position = size - 1;
        changeCarousel(position);
      }

      //when user clicks slider button
      $slider.find(" > ul > li").click(function () {
        position = $(this).index();
        changeCarousel($(this).index());
      });

      //this changes the image and button selection
      function changeCarousel() {
        $slider.find(".show").removeClass("show").fadeOut();
        $slider
          .find("> div")
          .eq(position)
          .fadeIn(set.fadeSpeed)
          .addClass("show");
        // The Dots
        $slider.find("> ul").find(".showli").removeClass("showli");
        $slider.find("> ul > li").eq(position).addClass("showli");
      }

      return $slider;
    };


    // for dashboard pages nav

  $(document).ready(function () {
    function displaySection(id) {
      $('.listing_info_box').hide();
      $('#' + id).show();
      $('.side_menu_nav a').removeClass('active');
      $('.side_menu_nav a[href="#' + id + '"]').addClass('active');
      localStorage.setItem("lastDisplayedSection", id);
    }

    // Get the ID from the URL
    var idFromURL = window.location.href.split("#")[1];
    // If the ID is present in the URL
    if (idFromURL) {
      // Show the element with that ID and update active state
      displaySection(idFromURL);
    } else {
      // Check if the profile page is loaded
      if (window.location.href.includes('/profile.html')) {
        // On page load, check for last displayed section in local storage
        var lastDisplayedSection = localStorage.getItem("lastDisplayedSection");
        var firstSectionId = $('.side_menu_nav li:first-child a').attr('href').slice(1);
        if (lastDisplayedSection) {
          displaySection(lastDisplayedSection);
        } else {
          displaySection(firstSectionId);
        }
      }
    }

    $('.side_menu_nav a').click(function (event) {
      event.preventDefault();
      var sectionId = $(this).attr('href').slice(1);
      // remove from local storage
      localStorage.removeItem("lastDisplayedSection");
      // change url id
      window.location.href = window.location.href.split("#")[0] + "#" + sectionId;
      displaySection(sectionId);
    });   
  });

  $(document).ready(function () {
    // Add green dot indicator to unviewed messages
    $('.message-notification:not(.viewed) .sender-name').append('<span class="unviewed-indicator"></span>');

    // Show full message when message preview is clicked or view-message button is clicked
    $('.message-preview, .view-message').click(function () {
      var message = $(this).closest('.message-notification');
      var messageId = message.attr('id');
      // Get current viewed messages from local storage
      var viewedMessages = JSON.parse(localStorage.getItem("viewedMessages")) || [];
      // Add the current message's ID to the viewed messages array
      viewedMessages.push(messageId);
      localStorage.setItem("viewedMessages", JSON.stringify(viewedMessages));
      var message = $(this).closest('.message-notification');
      message.siblings().removeClass('active');
      message.addClass('active');
      message.addClass('viewed');
      message.find('.unviewed-indicator').remove();
 

    // Remove scrollbar on the side menu
    $('.side_menu_nav').css('overflow', 'hidden');
    });

    var viewedMessages = JSON.parse(localStorage.getItem("viewedMessages")) || [];
    viewedMessages.forEach(function (viewedMessageId) {
      $('#' + viewedMessageId + ' .unviewed-indicator').hide();
    });
  });

  $(document).ready(function () {
    $(".side_menu_nav").show();
    $(".toggle_btn").html('<i class="fas fa-times"></i>');
    $(".close_btn").html('<i class="fas fa-bars"></i>');
    $(".toggle_btn").click(function () {
      $(".side_menu_nav").slideToggle(500);
      $(".toggle_btn").html($(".toggle_btn").html() == '<i class="fas fa-times"></i>' ? '<i class="fas fa-bars"></i>' : '<i class="fas fa-times"></i>');    
    });
    $(".close_btn").click(function () {
      $(".side_menu_nav").slideUp(500);
      $(".toggle_btn").html('<i class="fas fa-bars"></i>');
    });
  });
  // $(document).on('click', '#updatenow', function (e) {
  //   console.log('clicked');
  //   e.preventDefault();
  //   let id = $(this).attr('href');
  //   $(id).modal('toggle');
  // });

  // $(document).on('click', '.close-update', function () {
  //   $('.updatevehicle').modal('hide');
  // });

  $(document).ready(function () {
    $("#modal-close").click(function () {
      $("#modal-overlay").remove();
      $("#cashPayModal").remove();
      $("#vehicleDetailsModal")
      $('.modal-backdrop').remove();
    });
  });

$(document).ready(function () {
    $("#edit-img").click(function () {
        $("#image-input").click();
    });

    $("#image-input").change(function () {
        let input = this;
        let reader = new FileReader();
        reader.onload = function (e) {
            $("#user-img").attr("src", e.target.result);
        }
        reader.readAsDataURL(input.files[0]);
    });
});

  $(document).ready(function () {
    $('.ratingstar i').mouseover(function () {
      let index = $(this).data('index');
      for (let i = 0; i <= index; i++) {
        $('.ratingstar i').eq(i).addClass('rated');
      }
    });

    $('.ratingstar i').mouseout(function () {
      $('.ratingstar i').not('.selected').removeClass('rated');
    });

    $('.ratingstar i').click(function () {
      let index = $(this).data('index');
      $('#ratingInput').val(index + 1);
      $('.ratingstar i').removeClass('selected');
      for (let i = 0; i <= index; i++) {
        $('.ratingstar i').eq(i).addClass('selected');
      }
      console.log(index + 1)
    });

    $('#submitRating').click(function () {
      let rating = $('#ratingInput').val();
      let review = $('#reviewInput').val();

      console.log('Rating: ', rating);

      // Submit the rating and review to the server

      // Clear the form fields
      $('#ratingInput').val('');
      $('#reviewInput').val('');
    });
  });



  })(jQuery);



  //////////////////////////////////////////////
  // Activate each slider - change options
  //////////////////////////////////////////////

    $("#slider1").sliderResponsive({
      // Using default everything
      // slidePause: 5000,
      // fadeSpeed: 800,
      // autoPlay: "on",
      // showArrows: "off", 
      // hideDots: "off", 
      // hoverZoom: "on", 
      // titleBarTop: "off"
    });

    $("#slider2").sliderResponsive({
      fadeSpeed: 300,
      autoPlay: "off",
      showArrows: "on",
      hideDots: "on"
    });

    $("#slider3").sliderResponsive({
      hoverZoom: "off",
      hideDots: "on"
    });



