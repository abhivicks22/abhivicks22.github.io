/*
	Dimension by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var	$window = $(window),
		$body = $('body'),
		$wrapper = $('#wrapper'),
		$header = $('#header'),
		$footer = $('#footer'),
		$main = $('#main'),
		$main_articles = $main.children('article');

	// Add cache busting for content refresh
	window.forceRefresh = function() {
		// Add timestamp to force content reload
		const timestamp = new Date().getTime();
		$('body').append('<div style="display:none;" id="cache-buster-' + timestamp + '"></div>');
		
		// Force reflow of DOM
		document.body.offsetHeight;
	};
	
	// Call force refresh on load
	window.forceRefresh();

	// Fix for transition smoothness
	function preventShaking() {
		// Add transition-smoothest class to key elements
		$header.addClass('transition-smoothest');
		$footer.addClass('transition-smoothest');
		$main.addClass('transition-smoothest');
		$main_articles.addClass('transition-smoothest');
		
		// Force reflow to ensure transitions are applied cleanly
		$body[0].offsetHeight;
	}
	
	// Ensure animations don't conflict with each other
	function syncAnimations() {
		// Wait for any pending animations to complete before starting new ones
		if ($body.hasClass('is-switching')) {
			return new Promise(resolve => {
				setTimeout(resolve, 400);
			});
		}
		return Promise.resolve();
	}

	// Apply prevention on load and before any transitions
	preventShaking();
	
	// Use consistent easing for all transitions
	function applyConsistentEasing() {
		const elements = [$header, $footer, $main, $main_articles, $wrapper];
		elements.forEach(el => {
			el.css({
				'transition-timing-function': 'cubic-bezier(0.1, 0.1, 0.25, 0.9)',
				'animation-timing-function': 'cubic-bezier(0.1, 0.1, 0.25, 0.9)'
			});
		});
	}
	
	// Apply consistent easing
	applyConsistentEasing();

	// Enhanced image processing for better quality
	function enhanceProfileImage() {
		const profileImage = document.querySelector('.image-container img');
		if (profileImage) {
			// Make sure image is fully loaded
			if (profileImage.complete) {
				applyImageEnhancements(profileImage);
			} else {
				profileImage.onload = function() {
					applyImageEnhancements(profileImage);
				};
			}

			// Preload image with high quality settings
			const preloadImg = new Image();
			preloadImg.src = profileImage.src;
			preloadImg.onload = function() {
				// Replace with higher quality version when loaded
				setTimeout(() => {
					profileImage.src = preloadImg.src;
					profileImage.style.opacity = 1;
				}, 100);
			};
		}
	}
	
	function applyImageEnhancements(img) {
		// Add a subtle fade-in effect
		img.style.opacity = 0;
		
		// Apply CSS for better rendering
		img.style.willChange = 'transform, opacity';
		img.style.imageRendering = '-webkit-optimize-contrast';
		
		// Force browser to render at higher quality
		img.setAttribute('importance', 'high');
		
		setTimeout(function() {
			img.style.transition = 'opacity 0.6s ease-in-out, transform 0.4s ease-out';
			img.style.opacity = 1;
			// Add subtle entrance animation
			img.style.transform = 'scale(1.01)';
			setTimeout(() => {
				img.style.transform = 'scale(1)';
			}, 300);
		}, 100);
		
		// Add class for enhanced styling
		img.classList.add('enhanced-image');
	}
	
	// Call image enhancement on page load
	enhanceProfileImage();

	// Reapply enhancements when article becomes visible
	$main_articles.each(function() {
		var $this = $(this);
		
		if ($this.attr('id') === 'intro') {
			$this.on('DOMNodeInserted', function(e) {
				enhanceProfileImage();
			});
		}
	});

	// Breakpoints.
		breakpoints({
			xlarge:   [ '1281px',  '1680px' ],
			large:    [ '981px',   '1280px' ],
			medium:   [ '737px',   '980px'  ],
			small:    [ '481px',   '736px'  ],
			xsmall:   [ '361px',   '480px'  ],
			xxsmall:  [ null,      '360px'  ]
		});

	// Play initial animations on page load more smoothly.
		$window.on('load', function() {
			// Use requestAnimationFrame for smoother initial load animation
			requestAnimationFrame(function() {
				preventShaking();
				$body.removeClass('is-preload');
			});
		});

	// Fix: Flexbox min-height bug on IE.
		if (browser.name == 'ie') {

			var flexboxFixTimeoutId;

			$window.on('resize.flexbox-fix', function() {

				clearTimeout(flexboxFixTimeoutId);

				flexboxFixTimeoutId = setTimeout(function() {

					if ($wrapper.prop('scrollHeight') > $window.height())
						$wrapper.css('height', 'auto');
					else
						$wrapper.css('height', '100vh');

				}, 250);

			}).triggerHandler('resize.flexbox-fix');

		}

	// Nav.
		var $nav = $header.children('nav'),
			$nav_li = $nav.find('li');

		// Add "middle" alignment classes if we're dealing with an even number of items.
			if ($nav_li.length % 2 == 0) {
				$nav.addClass('use-middle');
				$nav_li.eq( ($nav_li.length / 2) ).addClass('is-middle');
			}

	// Enable hardware acceleration for smoother animations
	function enableHardwareAcceleration(element) {
		$(element).css({
			'backface-visibility': 'hidden',
			'transform': 'translateZ(0)',
			'will-change': 'transform, opacity'
		});
	}

	// Apply hardware acceleration to key elements
	enableHardwareAcceleration($header);
	enableHardwareAcceleration($footer);
	enableHardwareAcceleration($main);
	enableHardwareAcceleration($main_articles);

	// Main.
		var	delay = 300, // Reduced delay for smoother transitions
			locked = false;

		// Methods.
			$main._show = function(id, initial) {

				var $article = $main_articles.filter('#' + id);

				// No such article? Bail.
					if ($article.length == 0)
						return;

				// Before showing, ensure smooth transitions
				preventShaking();
				
				// Handle lock.
					// Already locked? Speed through "show" steps w/o delays.
						if (locked || (typeof initial != 'undefined' && initial === true)) {

							// Mark as switching.
								$body.addClass('is-switching');

							// Mark as visible.
								$body.addClass('is-article-visible');

							// Deactivate all articles (just in case one's already active).
								$main_articles.removeClass('active');

							// Hide header, footer.
								$header.hide();
								$footer.hide();

							// Show main, article.
								$main.show();
								$article.show();

							// Activate article.
								$article.addClass('active');

							// Unlock.
								locked = false;

							// Unmark as switching.
								requestAnimationFrame(function() {
									setTimeout(function() {
										$body.removeClass('is-switching');
									}, (initial ? 800 : 0));
								});

							return;

						}

					// Lock.
						locked = true;

				// Article already visible? Just swap articles.
					if ($body.hasClass('is-article-visible')) {

						// Deactivate current article.
							var $currentArticle = $main_articles.filter('.active');

							$currentArticle.removeClass('active');

						// Show article with requestAnimationFrame for smoother transitions.
							requestAnimationFrame(function() {
								// Apply smooth transitions
								applyConsistentEasing();
								
								setTimeout(function() {

									// Hide current article.
										$currentArticle.hide();

									// Show article.
										$article.show();

									// Activate article with requestAnimationFrame.
										requestAnimationFrame(function() {
											setTimeout(function() {

												$article.addClass('active');

												// Window stuff.
													$window
														.scrollTop(0)
														.triggerHandler('resize.flexbox-fix');

												// Unlock.
													setTimeout(function() {
														locked = false;
													}, delay);

											}, 15);
										});

								}, delay);
							});

					}

				// Otherwise, handle as normal.
					else {

						// Mark as visible.
							$body.addClass('is-article-visible');

						// Use requestAnimationFrame for smoother transitions.
							requestAnimationFrame(function() {
								setTimeout(function() {

									// Hide header, footer.
										$header.hide();
										$footer.hide();

									// Show main, article.
										$main.show();
										$article.show();

									// Activate article with requestAnimationFrame.
										requestAnimationFrame(function() {
											setTimeout(function() {

												$article.addClass('active');

												// Window stuff.
													$window
														.scrollTop(0)
														.triggerHandler('resize.flexbox-fix');

												// Unlock.
													setTimeout(function() {
														locked = false;
													}, delay);

											}, 15);
										});

								}, delay);
							});

					}

			};

			$main._hide = function(addState) {

				var $article = $main_articles.filter('.active');

				// Article not visible? Bail.
					if (!$body.hasClass('is-article-visible'))
						return;

				// Before hiding, ensure smooth transitions
				preventShaking();
				applyConsistentEasing();

				// Add state?
					if (typeof addState != 'undefined'
					&&	addState === true)
						history.pushState(null, null, '#');

				// Handle lock.

					// Already locked? Speed through "hide" steps w/o delays.
						if (locked) {

							// Mark as switching.
								$body.addClass('is-switching');

							// Deactivate article.
								$article.removeClass('active');

							// Hide article, main.
								$article.hide();
								$main.hide();

							// Show footer, header.
								$footer.show();
								$header.show();

							// Unmark as visible.
								$body.removeClass('is-article-visible');

							// Unlock.
								locked = false;

							// Unmark as switching.
								$body.removeClass('is-switching');

							// Window stuff.
								$window
									.scrollTop(0)
									.triggerHandler('resize.flexbox-fix');

							return;

						}

					// Lock.
						locked = true;

					// Deactivate article.
						$article.removeClass('active');

					// Hide article with requestAnimationFrame.
						requestAnimationFrame(function() {
							// Force stability during transition
							applyConsistentEasing();
							
							setTimeout(function() {

								// Hide article, main.
									$article.hide();
									$main.hide();

								// Show footer, header.
									$footer.show();
									$header.show();

								// Unmark as visible.
									$body.removeClass('is-article-visible');

								// Unlock.
									setTimeout(function() {
										locked = false;
									}, delay);

							}, delay);
						});

			};

		// Articles.
			$main_articles.each(function() {

				var $this = $(this);

				// Close.
					$('<div class="close">Close</div>')
						.appendTo($this)
						.on('click', function(e) {
							e.preventDefault();
							e.stopPropagation();
							location.hash = '';
						});

				// Prevent clicks from inside article from bubbling.
					$this.on('click', function(event) {
						event.stopPropagation();
					});

			});

		// Events.
			// Debounce function to improve performance
			function debounce(func, wait) {
				var timeout;
				return function() {
					var context = this, args = arguments;
					clearTimeout(timeout);
					timeout = setTimeout(function() {
						func.apply(context, args);
					}, wait);
				};
			}

			// Optimize click handler
			$body.on('click', function(event) {
				// Article visible? Hide.
				if ($body.hasClass('is-article-visible'))
					$main._hide(true);
			});

			// Optimize keyup handler with debouncing
			$window.on('keyup', debounce(function(event) {
				switch (event.keyCode) {
					case 27:
						// Article visible? Hide.
						if ($body.hasClass('is-article-visible'))
							$main._hide(true);
						break;
					default:
						break;
				}
			}, 50));

			// Optimize hashchange with requestAnimationFrame
			$window.on('hashchange', function(event) {
				// Empty hash?
				if (location.hash == '' || location.hash == '#') {
					// Prevent default.
					event.preventDefault();
					event.stopPropagation();

					// Hide.
					$main._hide();
				}
				// Otherwise, check for a matching article.
				else if ($main_articles.filter(location.hash).length > 0) {
					// Prevent default.
					event.preventDefault();
					event.stopPropagation();

					// Show article with requestAnimationFrame for smooth transition
					requestAnimationFrame(function() {
						$main._show(location.hash.substr(1));
					});
				}
			});

		// Scroll restoration.
		// This prevents the page from scrolling back to the top on a hashchange.
			if ('scrollRestoration' in history)
				history.scrollRestoration = 'manual';
			else {
				var	oldScrollPos = 0,
					scrollPos = 0,
					$htmlbody = $('html,body');

				// Use throttled scroll event for better performance
				var scrollThrottle;
				$window.on('scroll', function() {
					if (!scrollThrottle) {
						scrollThrottle = setTimeout(function() {
							oldScrollPos = scrollPos;
							scrollPos = $htmlbody.scrollTop();
							scrollThrottle = null;
						}, 50);
					}
				})
				.on('hashchange', function() {
					$window.scrollTop(oldScrollPos);
				});
			}

		// Initialize smooth scrolling for all anchor links
		$(document).on('click', 'a[href^="#"]', function(e) {
			var id = $(this).attr('href');
			
			// Only apply to links to sections, not direct actions
			if (id !== '#' && $(id).length > 0 && !$(this).hasClass('close')) {
				// Already handled by the main show/hide functionality
				return;
			}
		});

		// Initialize.

			// Hide main, articles.
				$main.hide();
				$main_articles.hide();

			// Initial article.
				if (location.hash != ''
				&&	location.hash != '#')
					$window.on('load', function() {
						$main._show(location.hash.substr(1), true);
					});

})(jQuery);