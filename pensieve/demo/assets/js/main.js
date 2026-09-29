$(function () {



isScrollingDown = false
$(window).on('wheel', function (event) {
	isScrollingDown = event.originalEvent.deltaY > 0;
})

const cursor = $('.cursor')

$(document).on('mousemove', function (e) {
	const mouseX = e.clientX;
	const mouseY = e.clientY;

	gsap.to(cursor, {
		duration: 1.5,
		left: mouseX + 'px',
		top: mouseY + 'px',
	});
})

$('.main-section-envi').on('mouseover', function () {
	$('.cursor').addClass('on')
})
$('.main-section-premium2').on('mouseover', function () {
	$('.cursor').addClass('on premium')
})

$('.main-section-envi').on('mouseout', function () {
	$('.cursor').removeClass('on')
})
$('.main-section-premium2').on('mouseout', function () {
	$('.cursor').removeClass('on premium')
})

tvSlide = new Swiper('.tv-slide',{
	speed : 1000,
	navigation: {
		prevEl: '.tv-prev',
		nextEl: '.tv-next'
	},
})


enviSlide = new Swiper('.envi-slide', {
	speed: 1500,
	effect : 'fade',
	mousewheel: true,
	on: {
		slideChange: function () {
			let thisIndex = this.realIndex + 1
			let totalIndex = this.slides.length

			if(thisIndex === 1){
				$('.envi-slide').removeClass('type2 type3 type4 type5')
			} else if(thisIndex === 2){
				$('.envi-slide').removeClass('type3 type4 type5')
			} else if(thisIndex === 3){
				$('.envi-slide').removeClass('type4 type5')
			} else if(thisIndex === 4){
				$('.envi-slide').removeClass('type4 type5')
			} else if(thisIndex === 5){
				$('.envi-slide').removeClass('type5')
			}
			$('.envi-slide').addClass('type' + thisIndex)

			$('.envi-index').text('0' + thisIndex)

			setTimeout(function(){
				$('.envi-first-slide').toggleClass('on', thisIndex === 1);
				$('.envi-last-slide').toggleClass('on', thisIndex === totalIndex);
			}, 1000)
		}
	},
	navigation: {
		prevEl: '.envi-prev',
		nextEl: '.envi-next'
	},
})

complexSlide = new Swiper('.complex-slide', {
	speed: 1500,
	effect : 'fade',
	mousewheel: true,
	on: {
		slideChange: function () {
			let thisIndex = this.realIndex + 1
			let totalIndex = this.slides.length
			let progressWidth = $('.complex-progress').width();

			$('.complex-bg > img').removeClass('on')
			$('.complex-bg > img:nth-child(' + thisIndex + ')').addClass('on')

			$('.complex-index').text(thisIndex)

			$('.complex-progress > span').css({
				'width' : progressWidth / totalIndex * thisIndex
			})

			setTimeout(function(){
				$('.complex-first-slide').toggleClass('on', thisIndex === 1);
				$('.complex-last-slide').toggleClass('on', thisIndex === totalIndex);
			}, 1000)
		}
	},
	navigation: {
		prevEl: '.complex-prev',
		nextEl: '.complex-next'
	},
})

designSlide = new Swiper('.design-slide', {
	speed: 1000,
	effect: 'fade',
	loop: false,
	mousewheel: true,
	//allowTouchMove: false,
	navigation: {
		prevEl: '.design-prev',
		nextEl: '.design-next'
	},
	pagination: {
		el: ".design-con .pager",
		bulletActiveClass: 'on',
		clickable: true
	},
	on: {
		slideChange: function () {
			let thisIndex = this.realIndex + 1;
			let totalIndex = this.slides.length;

			setTimeout(function(){
				$('.design-first-slide').toggleClass('on', thisIndex === 1);
				$('.design-last-slide').toggleClass('on', thisIndex === totalIndex);
			}, 800)
		}
	}
})

let premiumSlide = new Swiper('.premium-slide2',{
	effect : 'fade',
	mousewheel : true,
	speed : 1000,
	
	pagination : {
		el : '.premium-progress',
		type : 'progressbar',
	},
	navigation : {
		prevEl : '.premium-prev',
		nextEl : '.premium-next',
	},
	on : {
		slideChange : function(){
			let thisIndex = this.realIndex + 1;
			let totalIndex = this.slides.length;

			setTimeout(function(){
				$('.premium-first-slide').toggleClass('on', thisIndex === 1);
				$('.premium-last-slide').toggleClass('on', thisIndex === totalIndex);
			}, 800)

			$('.premium-pagination > span:nth-child(1)').text(thisIndex)
		},		
	},
})

mediaSlide = new Swiper('.media-slide',{
	speed : 1000,
	effect : 'fade',
	mousewheel : true,
	on : {
		slideChange : function(){
			let thisIndex = this.realIndex + 1;
			let totalIndex = this.slides.length;

			setTimeout(function(){
				$('.media-first-slide').toggleClass('on', thisIndex === 1);
				$('.media-last-slide').toggleClass('on', thisIndex === totalIndex);
			}, 800)

			$('.media-slide').removeClass('type1 type2 type3')
			$('.media-slide').addClass('type' + thisIndex)
		}
	}
})

$(window).on('wheel',function(){
	if($('.media-last-slide').hasClass('on') && isScrollingDown){
		$.fn.fullpage.moveTo(4)
	} 
	if($('.media-first-slide').hasClass('on') && !isScrollingDown){
		$.fn.fullpage.moveTo(2)
	}

	if($('.complex-last-slide').hasClass('on') && isScrollingDown){
		$.fn.fullpage.moveTo(5)
	} 
	if($('.complex-first-slide').hasClass('on') && !isScrollingDown){
		$.fn.fullpage.moveTo(3)
	}

	if($('.premium-last-slide').hasClass('on') && isScrollingDown){
		$.fn.fullpage.moveTo(6)
	} 
	if($('.premium-first-slide').hasClass('on') && !isScrollingDown){
		$.fn.fullpage.moveTo(4)
	}

	if($('.design-last-slide').hasClass('on') && isScrollingDown){
		$.fn.fullpage.moveTo(7)
	} 
	if($('.design-first-slide').hasClass('on') && !isScrollingDown){
		$.fn.fullpage.moveTo(5)
	}
})

tvTitle = new SplitType('.tv-intro-title',{type : 'chars'})

complexTit = new SplitType('.complex-title',{type : 'chars'})

complexTl = gsap.timeline()

const locationTit1 = new SplitType('.location-title > p:nth-child(1)', { type: 'chars' })
const locationTit2 = new SplitType('.location-title > p:nth-child(2)', { type: 'chars' })

fullpage = $('#fullpage').fullpage({
	scrollingSpeed: 1200,
	afterLoad: function (anchor, index) {
		if (index === 1) {
			$.fn.fullpage.setAllowScrolling(true)
		}
		if (index === 2) {
			$.fn.fullpage.setAllowScrolling(true)
			$('.media-first-slide, .media-last-slide').removeClass('on')
		}

		if (index === 3) {
			$.fn.fullpage.setAllowScrolling(false)
			$('.complex-first-slide, .complex-last-slide').removeClass('on')
		}
		
		if (index === 4) {
			$.fn.fullpage.setAllowScrolling(false)
			$('.media-first-slide, .media-last-slide').removeClass('on')
			$('.premium-first-slide, .premium-last-slide').removeClass('on')
		}
		if (index === 5) {
			$.fn.fullpage.setAllowScrolling(false)
			$('.design-first-slide, .design-last-slide').removeClass('on')
			$('.complex-first-slide, .complex-last-slide').removeClass('on')
		}
		if (index === 7) {
			$.fn.fullpage.setAllowScrolling(true)
			$('.premium-first-slide, .premium-last-slide').removeClass('on')
		}
		if (index === 8) {
			$.fn.fullpage.setAllowScrolling(true)
			$('.design-first-slide, .design-last-slide').removeClass('on')
		}

		$('.media-first-slide').toggleClass('on', index === 3 && mediaSlide.realIndex === 0)
		$('.media-last-slide').toggleClass('on', index === 3 && mediaSlide.realIndex === 2)

		$('.complex-first-slide').toggleClass('on', index === 4 && complexSlide.realIndex === 0)
		$('.complex-last-slide').toggleClass('on', index === 4 && complexSlide.realIndex === 2)

		$('.premium-first-slide').toggleClass('on', index === 5 && premiumSlide.realIndex === 0)
		$('.premium-last-slide').toggleClass('on', index === 5 && premiumSlide.realIndex === 5)

		$('.design-first-slide').toggleClass('on', index === 6 && designSlide.realIndex === 0)
		$('.design-last-slide').toggleClass('on', index === 6 && designSlide.realIndex === 2)
	},
	onLeave: function (anchor, index) {
		$('.header').removeClass('dark hide')
		$('.main-section-location').removeClass('fp-active')
		$('.envi-slide').removeClass('type1')
		$('.complex-slide').removeClass('on')
		$('.open-rotate').removeClass('hide')

		gsap.to(tvTitle.chars,{
			opacity : 0,
			filter : 'blur(5px)',
			transform : 'scale(1.5)',
		})
		gsap.to(complexTit.chars,{
			opacity : 0,
		})
		gsap.to('.complex-title-box',{
			left : 'auto',
			top : 'auto',
		})
		gsap.to('.complex-sub-title',{
			left : '50%',
			transform : 'translateX(-50%)',
		})
		gsap.to('.complex-title-01',{
			left : '50%',
			transform : 'translateX(-50%)',
		})

		if (index === 1) {
		}
		if (index === 2) {
			$('.header').addClass('dark')
			setTimeout(function(){
				gsap.to(tvTitle.chars,{
					opacity : 1,
					filter : 'blur(0px)',
					transform : 'scale(1)',
					stagger : {
						each : 0.02,
						from : 'random',
					},
					duration : 1,
				})
			},500)
			
		}
		if (index === 4) {
			//$('.header').addClass('dark')
		}
		if (index === 4) {
			//$('.envi-slide').addClass('type1')
			//$('.open-rotate').addClass('hide')
			setTimeout(function(){
				gsap.to(complexTit.chars,{
					opacity : 1,
					stagger : {
						from : 'random',
						each : 0.02,
					},
					duration : 1,
				})
			},500)
			

			setTimeout(function(){
				$('.complex-slide').addClass('on')

				gsap.to('.complex-title-box',{
					left : 0,
					top : 200,
					duration : 2,
				})
				gsap.to('.complex-sub-title',{
					left : 0,
					transform : 'translateX(0)',
					duration : 2,
				})
				gsap.to('.complex-title-01',{
					left : 0,
					transform : 'translateX(0)',
					duration : 2,
				})
			},2000)
		}
		if (index === 6) {
			$('.header').addClass('dark')
			setTimeout(function () {
				gsap.to(locationTit1.chars, {
					opacity: 0,
					stagger: {
						each: 0.1,
						from: 'random',
					},
					duration: 1,
				})
				gsap.to(locationTit2.chars, {
					opacity: 0,
					stagger: {
						each: 0.1,
						from: 'random',
					},
					duration: 1,
				})
			}, 400)
		}
		if (index === 7) {
			$('.header').addClass('dark')
			$('.main-section-location').addClass('fp-active')
			setTimeout(function () {
				gsap.to(locationTit1.chars, {
					opacity: 1,
					stagger: {
						each: 0.1,
						from: 'random',
					},
					duration: 1,
				})
				gsap.to(locationTit2.chars, {
					opacity: 1,
					stagger: {
						each: 0.1,
						from: 'random',
					},
					duration: 1,
				})
			}, 1000)
		}
		if (index === 8) {
			$('.main-section-location').addClass('fp-active')
		}
	}
})



})