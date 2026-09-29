$(function(){
function checkDevice() {
	var pathName = location.pathname
	if (navigator.userAgent.match(/iPhone|iPad|Mobile|UP.Browser|Android|BlackBerry|Windows CE|Nokia|webOS|Opera Mini|SonyEricsson|opera mobi|Windows Phone|IEMobile|POLARIS/) != null) {
		location.href = "/m" + pathName;
	}
}
if (/MSIE \d|Trident.*rv:/.test(navigator.userAgent)) {
	window.location = 'microsoft-edge:' + window.location;
	setTimeout(function () {
		window.location = 'https://go.microsoft.com/fwlink/?linkid=2135547';
	}, 1);
}
checkDevice()

$('map').imageMapResize();

if($(window).width() > 750){
	$('.header-nav > ul').on('mouseover',function(){
		$('.header').addClass('on');
	})
	$('.header').on('mouseleave',function(){
		$('.header').removeClass('on');
	})
}
$('.hamburger').on('click',function(){
    $('.header').toggleClass('active')
	$('body').toggleClass('fixed')
})
$('.hamburger-nav > ul > li').on('click',function(event){
    if($(this).find('ul').length > 0){
        event.preventDefault();
        $('.hamburger-nav > ul > li > ul').stop().slideUp(300);
        $(this).find('ul').stop().slideToggle(300);
		
		if($(this).hasClass('current')){
			$(this).toggleClass('current')
		} else{
			$('.hamburger-nav > ul > li').removeClass('current')
			$(this).toggleClass('current')
		}
		
    } 
})
$('.hamburger-nav > ul > li > ul > li > a').on('click', function(event) {
    event.stopPropagation(); // 이벤트 전파 막기
});

AOS.init({
	duration : 1000,
	once : true,
})
/**
 * 마우스 오버 JS
 */
let hoverAni = $('.hover_ani')
hoverAni.prepend('<span class="line"></span><span class="line"></span><span class="line"></span><span class="line"></span>')
$('.hover_ani').each(function() {
    let color = $(this).attr('data-color');
    let line = $(this).attr('data-line');
    $(this).find('span.line').css('background', color);
    $(this).find('span.line:nth-child(1), span.line:nth-child(3)').css('height', line);
    $(this).find('span.line:nth-child(2), span.line:nth-child(4)').css('width', line);
});

$('.bap-bar-box').on('click',function(){
	var visualVideo = document.querySelector('.visual-bg > video');
	//var player = new Vimeo.Player(iframe);

	if ($('.bap-bar-box').hasClass('on')) {
		visualVideo.muted = true;  // 음소거
	  } else {
		visualVideo.muted = false; // 음소거 해제
		visualVideo.volume = 1;    // 볼륨 최대로 (0~1)
	  }
	$('.bap-bar-box').toggleClass('on')
})

		//TAB
$('ul.tabs li').click(function () {
    var tab_area_id = $(this).attr('data-tab');
    $('ul.tabs li').removeClass('current');
    $('.tab-area').removeClass('current');
    $(this).addClass('current');
    $("#" + tab_area_id).addClass('current');
    AOS.refresh();
});

$('ul.tabs2 li').click(function () {
    var tab_id = $(this).attr('data-tab');
    $('ul.tabs2 li').removeClass('current');
    $('.tab-content').removeClass('current');
    $(this).addClass('current');
    $("#" + tab_id).addClass('current');
    AOS.refresh();
});

function parseTime(str) {
    str = str.toString().padStart(10, '0');
    const year = 2000 + parseInt(str.slice(0, 2));
    const month = parseInt(str.slice(2, 4)) - 1;
    const day = parseInt(str.slice(4, 6));
    const hour = parseInt(str.slice(6, 8));
    const minute = parseInt(str.slice(8, 10));
    return new Date(year, month, day, hour, minute);
  }

  $(document).ready(function () {
    $('[data-open]').each(function () {
      const $el = $(this);
      const openStr = $el.data('open');
      const hideStr = $el.data('hide');

      const openTime = parseTime(openStr);
      const hideTime = hideStr ? parseTime(hideStr) : null;
      const now = new Date();

      $el.hide(); // 기본 상태는 숨김

      // 바로 보여야 하는 경우
      if (now >= openTime && (!hideTime || now < hideTime)) {
        $el.show();
      }

      // 예약된 표시 시간
      const timeUntilOpen = openTime - now;
      if (timeUntilOpen > 0) {
        setTimeout(() => {
          $el.show();
        }, timeUntilOpen);
      }

      // 예약된 숨김 시간
      if (hideTime) {
        const timeUntilHide = hideTime - now;
        if (timeUntilHide > 0) {
          setTimeout(() => {
            $el.hide();
          }, timeUntilHide);
        }
      }
    });
  });

})