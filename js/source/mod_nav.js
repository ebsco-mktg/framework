/*
 * 
 */

var NAV = (function( pub ) {

	// private functions
	
	/**
	 * pass in jQuery obj of list items
	 * if any list item is wrapped, add class 'wrap-block'
	 * elements after 'wrap-block' have added class 'after-wrap'
	 * returns # of elements on other row
	 */
	function checkRow($menuRow) {
		var wrapCt = 0,
			itemLength = 0;
	
		// if no menu item obj passed in, default to the main nav list
		if ( $menuRow === undefined ) {
			$menuRow = $('.top-nav > li');
		}
		
		itemLength = $menuRow.length;
	
		if ( itemLength > 0 ) {
			
			// findPos returns the element's left (0) and top (1) offsets
			// here we're setting firstTop to the top offset of the first item in the list
			// if we find that a sibling item's top offset does not match this original value, we've got wrapping
			var firstTop = findPos( $menuRow[0] )[1],
				i=0;
			
			for ( ; i < itemLength; i++) {
				var thisElem = $menuRow[i],
					thisTop = findPos(thisElem)[1];
				
				// if thisTop doesn't equal firstTop we've got wrapping
				if ( thisTop !== firstTop ) {
					
					// the first wrapped item gets the class 'wrap-block'
					if ( wrapCt === 0 ) {
						$(thisElem).addClass('wrap-block');
					
					// items after the first wrapped item get the class 'after-wrap'
					} else {
						$(thisElem).addClass('after-wrap');
					}
					
					wrapCt ++;
				}
				
			}
		}
		
		// returns 0 for no wrapped items, or the number of wrapped items
		return wrapCt;
	}
	
	function resetRow($menuRow) {
		if ( $menuRow === undefined ) {
			$menuRow = $('.top-nav > li');
		}
	
		$menuRow.filter('.wrap-block').removeClass('wrap-block');
		$menuRow.filter('.after-wrap').removeClass('after-wrap');
	}
	
	// returns false if not in mobile state (i.e. not showing mobile menu icon)
	// returns true if in mobile state
	function getMobileState() {
		var mobileState = false;
		//window.console && console.log('mobile menu visible: ', $('#mobile-menu').css('display') );
		if ( $('#mobile-menu').css('display') === 'block' || $('.lt-ie8').length > 0 ) { mobileState = true; };
		//window.console && console.log('returning', mobileState);
		return mobileState;
	}
	
	
	
	/*
	 * for browsers not supporting css transitions (.no-csstransitions modernizr class on html)
	 * this creates the replacement elements
	 * 
	 * set up the nav triangle pointer (since in css we use :before and that's not reachable via the DOM)
	 * set up the nav spacer (same reasons, except :after)
	 * could re-write by adding a markup elem in the default, 
	 * 			but these are really just presentational (except maybe the spacer...) 
	 * 			so we add new elements to replace the :after and :before
	 * 			css has rules to display: none these pseudo elements
	 * 
	 */
	function setupFallbacks() {
		
		//window.console && console.log('setupFallbacks');
		
		var cssPointerElem = document.createElement('div'),
			navSpacerElem = document.createElement('div'),
			$elemsWithPointer = $('#siteNav').find('.drop > a');
	
		// we need to re-create the cssPointer element
		cssPointerElem.className = 'cssPointer';
		//$elemsWithPointer.append(cssPointerElem);
		
		// we need to re-create the spacer element
		navSpacerElem.className = 'navSpacer';
		$elemsWithPointer.append(navSpacerElem);
	
	}
	
	/*
	 * for browsers not supporting css transitions (.no-csstransitions modernizr class on html)
	 * these are the animations called on the hover events
	 * 
	 * note that if the css changes to different sizes, these will need to be updated to match
	 */
	function hoverFallbacks($hoverElem, hoverState) {
		
		//window.console && console.log('hoverFallbacks');
		
		if ( hoverState === 'mouseover' ) {
			
			var spacerHeight = '61px';
			
			if ( $hoverElem.find('.double-space').length > 0 ) {
				spacerHeight = '114px';
			}
			
			$hoverElem.find('.cssPointer').stop(true, true).animate( {
				opacity : 1,
				top : '38px'
			}, state.slideDown);
			
			$hoverElem.find('.navSpacer').stop(true, true).animate( {
				height : spacerHeight
			}, state.slideDown);
		
		} else if ( hoverState === 'mouseoff' ) {
		
			$hoverElem.find('.cssPointer').stop(true, true).animate( {
				opacity : 0,
				top : '43px'
			}, state.slideUp);
			
			$hoverElem.find('.navSpacer').stop(true, true).animate( {
				height : '0'
			}, state.slideUp, function() {
				
				var thisTicker = setTimeout( function() {
						$(this).css('display','inline');
						clearTimeout(thisTicker);
						thisTicker = null;
					}, 500);
				
			});
			
		} else {
			// error - no state passed through
			window.console && console.log('ERROR: cannot run fallbacks - no hoverState passed');
		}
	}
	
	/* function to handle the menu opening animation 
	 * calls an optional callback fn after animation
	 */
	function openMenu($aNavitem, callbackFn) {
		
		//window.console && console.log('openMenu');
		
		var $theSubmenu = $aNavitem.find('.sub-menu li'),
			$theSpacer,
			$theNavIdx = $dropElems.index($aNavitem),
			isSubWrapped;
		
		$aNavitem.find('.sub-menu').finish().slideDown(state.slideDown, function() {
			$aNavitem.addClass('current');
		});
		
		// isSubWrapped contains the count of items with wrapped classes added
		isSubWrapped = checkRow($theSubmenu);
	
		if ( isSubWrapped > 0 ) {
			$theSpacer = $aNavitem.find('a');
			$theSpacer.addClass('double-space');
			$aNavitem.addClass('double');
		}
		
		// no-csstransition fallbacks
		if ( noCssTransitions ) {
			hoverFallbacks( $aNavitem, 'mouseover' );
		}
		
		state.openedIdx = $theNavIdx;
	
		if (callbackFn && typeof(callbackFn) === "function") {
			callbackFn();
		}
		
	}
	
	/* function to handle the menu closing animation 
	 * calls an optional callback fn after animation
	 */
	function closeMenu($aNavitem, callbackFn) {
		var $theSubmenu = $aNavitem.find('.sub-menu li'),
			$theSpacer = $aNavitem.find('a'),
			$theNavIdx = $dropElems.index($aNavitem);
		
		$dropElems.find('.sub-menu').finish().slideUp(state.slideUp, function() {
			$aNavitem.removeClass('current');
		});
	
		// no-csstransition fallbacks
		if ( noCssTransitions ) {
			hoverFallbacks( $aNavitem, 'mouseoff' );
		}
	
		resetRow($theSubmenu);
		$theSpacer.removeClass('double-space');
		$aNavitem.removeClass('double');
		
		$('.navSpacer').css('display','inline');
		
		state.openedIdx = -1;
		
		if (callbackFn && typeof(callbackFn) === "function") {
			callbackFn();
		}
		
	}
	

	
	function resizing() {
		// window.console && console.log('resize...');
		mobileState = getMobileState();
		if ( !mobileState ) {
			resetRow();
			isWrapped = checkRow();
			if (hasActive) {
				// window.console && console.log('hasActive: ', hasActive);
				$dropElems.eq($dropElems.index(activeIdx)).addClass('active');
			}
		} else {
			if (hasActive) {
				// window.console && console.log('hasActive: ', hasActive);
				$('.top-nav .drop.active').removeClass('active').find('.sub-menu').removeAttr('style');
			}
		}
	}
	

	
	// our init method will bind an update function (appending custom input values to the notes field) whenever someone clicks submit on the rsvp form
	pub.init = function( ) {
		
		EIS.loadOnce( 'jQuery', function() {

			$('.lt-ie9 #mobile-menu').css('display','none');
			
			// determine if browser supports css-transitions (using modernizr)
			var noCssTransitions = $('.no-csstransitions').length > 0,
				ieFallback = $('.lt-ie9').length === 1,
				ie9Fallback = $('.lt-ie10').length === 1,
				
				// trigger wrapping styles only if mobile menu is not open
				mobileState = getMobileState(),
				
				// check the main nav for adding any wrapping classes
				isWrapped,
				hasActive = $('.top-nav .drop').hasClass('active'),
				
				// timeout object used on hover states
				ticker,
			
				/*
				 * state object - contains properties of navigation current state
				 * 
				 * 		hoverIdx 		: 	the index of the current item sending a mouseenter event (hover); -1 indicates none
				 * 		mouseoutIdx 	:	the index of the current item sending a mouseout event; -1 indicates none
				 * 		openedIdx 		:	the index of the sub menu currently in an open state; -1 indicates none
				 * 		activeIdx 		: 	the index of a sub menu that should remain open for the current page; -1 indicates none
				 * 		slideDown 		:	the speed (ms) in which sub menus slide down (show)
				 * 		slideUp 		:	the speed (ms) in which sub menus slide up (hide)
				 * 		hoverDelay 		: 	the amount of time (ms) before the hover animation fires, if no cancelling events occur befor it expires
				 * 		mouseoutDelay 	: 	the amount of time (ms) before the mouseout animation fires, if no cancelling events occur before it expires
				 */
				state = {
					hoverIdx : -1,
					mouseoutIdx : -1,
					openedIdx : -1,
					activeIdx : -1,
					slideDown : 500,
					slideUp : 500,
					hoverDelay : 400,
					mouseoutDelay : 400
				},
				$dropElems = $('.top-nav > li');
		
			//window.console && console.log('ieFallback: ', ieFallback );	
			//window.console && console.log('hasActive: ', hasActive );
			//window.console && console.log('!mobileState: ', !mobileState );
				
			if (!mobileState) {
				isWrapped = checkRow();
				//window.console && console.log('isWrapped: ', isWrapped );
			}
			
			/*
			 * IE fallbacks - html.no-csstransitions
			 */
			if ( ieFallback  &&  !mobileState ) {
				//window.console && console.log('noCssTransitions  &&  !mobileState: ', noCssTransitions  &&  !mobileState );
				setupFallbacks();
			} else if ( ie9Fallback  &&  !mobileState ) {
				//window.console && console.log('setupFallbacks');
				
				var navSpacerElem = document.createElement('div'),
					$elemsWithPointer = $('#siteNav').find('.drop > a');
				
				// we need to re-create the spacer element
				navSpacerElem.className = 'navSpacer';
				$elemsWithPointer.append(navSpacerElem);
			}
			
			//setupFallbacks();
			
			
			if (hasActive && !mobileState) {
				var $activeItem = $('.top-nav .drop.active'),
					isSubWrapped = checkRow( $activeItem.find('.sub-menu li') ),
					activeIdx = $dropElems.index($activeItem);
				
				state.openedIdx = activeIdx;
				state.activeIdx = activeIdx;
				
				// isSubWrapped contains the count of items with wrapped classes added
				if ( isSubWrapped > 0 ) {
					var thisSpacer = $activeItem.find('a');
					thisSpacer.addClass('double-space');
				}
				
				// no-csstransition fallbacks
				if ( ie9Fallback ) {
					//window.console && console.log ('IE Fallback...');
					hoverFallbacks( $activeItem, 'mouseover' );
				}
					
			}
			
			// on resize reset wrapping classes and then check the main nav for adding wrapping classes
			/*
			var winWidth = $(window).width(),
			    winHeight = $(window).height();
			
		
			$(window).resize(function(){
		
		
			    var onResize = function() {
			        //The method which alter some css properties triggers 
			        //window.resize again and it ends in an infinite loop
					//window.console && console.log('resize...');
					
					mobileState = getMobileState();
					if ( !mobileState ) {
						resetRow();
						isWrapped = checkRow();
						if (hasActive) {
							$dropElems.eq($dropElems.index(activeIdx)).addClass('active');
						}
					} else {
						if (hasActive) {
							$('.top-nav .drop.active').removeClass('active').find('.sub-menu').removeAttr('style');
						}
					}
			    };
			
			    //New height and width
			    var winNewWidth = $(window).width(),
			        winNewHeight = $(window).height();
			
			    // compare the new height and width with old one
			    if(winWidth!=winNewWidth || winHeight!=winNewHeight)
			    {
			        window.clearTimeout(resizeTimeout);
			        var resizeTimeout = window.setTimeout(onResize, 10);
			    }
			    //Update the width and height
			    winWidth = winNewWidth;
			    winHeight = winNewHeight;
		
		
			});
			*/

			window.onresize = function() {
				resizing();
			};
			
			$('#siteNav').on('click','#mobile-menu', function() {
				$(this).toggleClass('isOpen');
			});
		
		
			$dropElems.hover( function() {
				
				var $thisSubMenu = $(this).find('.sub-menu li'),
					isSubWrapped = 0,
					$this = $(this);
					
				state.hoverIdx = $dropElems.index($this);
				
				if (!mobileState) {
					
					// if we trigger hover with an active mouseout, cancel that mouseout
					clearTimeout(ticker);
					ticker = null;
					state.mouseoutIdx = -1;
					
					if ( state.openedIdx === -1 ) {
						openMenu($this);
					} else {
					
						ticker = setTimeout( function() {
							
							var thisIdx = $dropElems.index($this);
							
							if ( state.hoverIdx === thisIdx ) {
								
								// if something is open other than what we are about to open, close it first
								// this is usually triggered when someone whips across the nav after a sub is open
								if ( thisIdx !== state.openedIdx ) {
									closeMenu( $dropElems.eq(state.openedIdx), function() {
		
										// send callback fn to handle suppressing active sub's triangle pointer
										if ( hasActive ) {
											$dropElems.eq( $dropElems.index($activeItem) ).addClass('active');
										}
									});
								}
								
								if ( state.openedIdx !== thisIdx ) {
		
									// open the sub menu (and perform fallbacks, state setting, etc.)
									openMenu($this, function() {
		
										// send callback fn to handle suppressing active sub's triangle pointer
										if ( hasActive && ( state.activeIdx !== thisIdx ) ) {
											$dropElems.eq( $dropElems.index($activeItem) ).removeClass('active');
										}
									});
									
								}
								
								ticker = null;
								clearTimeout(ticker);
								
							}
							
						}, state.hoverDelay);
					
					}
		
				}
				
			// remove classes on mouse out
			}, function() {
				var $thisSubMenu = $(this).find('.sub-menu li'),
					$thisSpacer = $(this).find('a'),
					$this = $(this),
					thisIdx = $dropElems.index($this);
				
				state.mouseoutIdx = thisIdx;
		
				if ( !mobileState ) {
					
					ticker = setTimeout( function() {
					
						if ( ( state.mouseoutIdx === state.openedIdx ) ) {
							
							if ( thisIdx !== state.activeIdx ) {
								closeMenu($this);
								
								// if there is an active sub menu set, display that one...
								if (hasActive) {
									var $thisActive = $dropElems.eq( $dropElems.index($activeItem) );
									
									openMenu($thisActive, function() {
										$dropElems.eq( $dropElems.index($activeItem) ).addClass('active');
									});
			
									ticker = null;
									clearTimeout(ticker);
								}
								
							}
							
						}
					
					}, state.mouseoutDelay);
					
				}
			});
			
			$dropElems.find('*').on('focus', function() {
				$(this).closest('.drop').trigger('mouseenter');
			});
			
			$dropElems.find('*').on('blur', function() {
				$(this).trigger('mouseoff');
			});

			
		});
	};

	return pub;
	
}(NAV || {}));

NAV.init();

