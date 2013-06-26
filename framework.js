/**
 * @fileoverview Contains all of the global functionality used in conjunction with the framework
 * @license Copyright EBSCO Industries, Inc.
 * @author EBSCO Marketing Web Development
 * 
 * 
 * Conventions:
 * GLOBAL_VARIABLE 	:: 	any variable or method that is global should be written in all caps, underscore
 * localVariable 	:: 	any variable or method that is local scope should be written in camelcase
 * _privateMethod 	:: 	any variable or method that is private should be underscore prefixed
 * 
 * TODO: some task 	:: 	any future work should be noted with "TODO:" 
 * 
 * 
 */



/*
 * GLOBAL module VALIDATE
 * 
 * Uses loose augentention; any other js file can add to this global object:
 * var VALIDATE = (function () {
 * 		var my = {};
 * 		// your code here
 * 		my.yourPublicMethod = function () { }
 * 		my.yourPublicProperty =  some value
 * 
 * 		return my;
 * }(VALIDATE || {}));
 * 
 * Public methods:
 * 		VALIDATE.email(element) - validate element's value using email rules (#@#.)
 * 			returns 1 if error
 * 		VALIDATE.radio(element) - validate element's value using radio rules
 * 			returns 1 if error
 * 		VALIDATE.text(elements) - validate element's value using length (any value of length 1 or greater)
 * 			returns 1 if error
 * 		VALIDATE.testfields(elements) - validates either specific passed in element(s) or elements with class 'required'
 * 			returns 1 if error
 * 
 * 		VALIDATE.checkSubmitState() - checks form for inputs with class 'error' and sets submit btn to disabled if found
 * 			returns undefined
 * 
 * 		VALIDATE.moveLabel(element) - assumes element is input;
 * 										sets class of label for element to 'hasValue';
 * 										sets class of multiline label for element to 'active';
 * 										sets class of prefix label for element to 'active'
 * 		VALIDATE.removeLabel(element) - removes classes set by VALIDATE.moveLabel(element)
 * 		VALIDATE.checkValue(element) - assumes element is input;
 * 										if element value is not empty, calls VALIDATE.moveLabel(element), otherwise calls VALIDATE.removeLabel(element)
 * 
 * 		VALIDATE.init() - binds VALIDATE.testfields() to click event of any submit element;
 * 							binds VALIDATE.testfields(element) to blur event of every input with class 'required'
 * 							binds VALIDATE.moveLabel(element) to click, focus event of every input with class 'required';
 * 							binds VALIDATE.checkValue(element) to blur event of every input with class 'required'
 * 
 * (technically public but really just used privately) TODO: either make private or move to new global module
 * 		VALIDATE.setClass(element, class string) - adds a given class name to an element
 * 		VALIDATE.removeClass(element, class string) - removes a given class name from an element
 */
var VALIDATE = (function () {
    var my = {};
    // private variables
    // var privatevarname = ...


	// private methods
	// function privateMethod() { ... }
	
	// below are not technically private...yet
	// set the passed in element to the provided class
	my.setClass = function(aElem, aClass) {
		try {
			var aElem = $(aElem)[0];	// getting the dom obj from the jQ obj
			// we only need to set the error class if it's not already on the field...
			if ( (aElem.className).indexOf(aClass) === -1 ) {
				var classList = (aElem.className).split(' ');
				classList.push(aClass);
				aElem.className = classList.join(' ');
			}
		} catch(e) {
			// console.log(e);
		}
	};
	
	// remove  the provided class from the passed in element 
	my.removeClass = function(aElem, aClass) {
		try {
			var aElem = aElem[0];	// getting the dom obj from the jQ obj
			aElem.className = (aElem.className).replace(aClass, '');
		} catch (e) {
			// console.log(e);
		}
	};
	
	
	// public properties
	// my.propertyname
	
	
	// public methods
	// my.methodname
	
	// checks element for valid email value and adds/removes error class (invalid) on element
	// returns 1 if error
	my.email = function (aElem) {
	    //regex source http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
	    //var element = $(email);
	    var re = /\S+@\S+\.\S+/,
	    	element = $(aElem),
	    	thisError = 0;
	    
	    if ( !(re.test(element.val())) ) {
	    	thisError = 1;
	    }
	    return thisError;
	};
	
	// returns 1 if error
	my.radio = function (aElem) {
        var checkName = $(aElem).attr('name'),
        	elementNames = [],
        	thisError = 0;
        
        elementNames.push(checkName);

        for (i = 0; i < elementNames.length; i++) {
            var thisId = $(this).attr('id'),
                isChecked = $('input[name="' + elementNames[i] + '"]').is(':checked');
            
            if (!isChecked) {
                $('label[for=' + thisId + ']').addClass('error');
                thisError = 1;
                //return errors;
            } else {
                $('label[for=' + thisId + ']').removeClass('error');
            }
        }
        return thisError;
	};
	
	my.text = function (aElem) {
		var elementVal = aElem.val(),
			thisError = 0;
        if (elementVal === '') {
            thisError = 1;
        }
        return thisError;
	};
	
	// returns 1 if error
	my.testfields = function (aField) {
	    //check to see if any required fields
	    //are unchecked, blank, or have well
	    //formatted email addresses
	    var required,
	    	submit = $('.form-behavior input[type="submit"], .form-behavior button[type="submit"]'),
	        elementNames = [],
	        error = 0;
	    
	    // if no element passed in, assume check all .required fields
	    // otherwise check just the one
		if (aField === undefined ) {
			required = $('.required:visible');
		} else {
			required = $(aField);
		}

	    required.each(function(){
	        
	        var $that = $(this),
	            elementType = $that.attr('type'),
	            thisError = 0;
	            
	       // check field for error based on input type
	        if (elementType === 'email') {
		        //email validation
	            if ( VALIDATE.email($that) !== 0 ) {
	            	thisError = 1;
	            }
	        } else if (elementType === 'radio') {   
	        	//radio button validation
	        	if ( VALIDATE.radio($that) !== 0 ) {
	            	thisError = 1;
	            };
	        } else {
	        	// text inputs...
	        	if ( VALIDATE.text($that) !== 0 ) {
	        		thisError = 1;
	        	}
	        }
	        
			// set or remove error classes
	        if ( thisError === 1 ) {
	        	VALIDATE.setClass($that,'error');
	        	error = thisError;
	        } else {
	        	VALIDATE.removeClass($that,'error');
	        }
	        
	    });
	    
	    VALIDATE.checkSubmitState();
	    
		return error;
	};
	
	// checks if form has errors and sets submit btn class
	my.checkSubmitState = function() {
		var submit = $('.form-behavior input[type="submit"], .form-behavior button[type="submit"]'),
			hasErrors = $('.error').length;

		if (hasErrors !== 0) {
			//console.log('form has errors');
			VALIDATE.setClass(submit,'disabled');
			submit.attr('disabled','disabled');
		} else {
			//console.log('form OK');
			VALIDATE.removeClass(submit,'disabled');
			submit.removeAttr('disabled');
		}
	};
	
	my.moveLabel = function(inputField) {
		var thisLabel = $('label[for="' + inputField.attr('id') + '"]');

		VALIDATE.setClass( thisLabel, 'hasValue' );

		// if input is child of multiline classed parent, add active to the input
		if ( $(inputField).parent().hasClass('multiline') ) {
			VALIDATE.setClass( $(inputField).parent('.multiline'), 'active' );
		}
		// if input field has a prefix (like 'http://') then add active class to the prefix element
		if ( inputField.hasClass('hasPrefix') ) {
			VALIDATE.setClass( inputField.prev('.field-prefix'), 'active' );
		}
	};

	my.removeLabel = function(inputField) {
		var thisLabel = $('label[for="' + inputField.attr('id') + '"]');
		
		VALIDATE.removeClass( thisLabel, 'hasValue' );
		
		if ( $(inputField).parent().hasClass('multiline') ) {
			VALIDATE.removeClass( $(inputField).parent('.multiline'), 'active' );
		}
		// if input field has a prefix (like 'http://') then add active class to the prefix element
		if ( inputField.hasClass('hasPrefix') ) {
			VALIDATE.removeClass( inputField.prev('.field-prefix'), 'active' );
		}
	};
	
	my.checkValue = function(inputField) {
		// check value of input field, and if not empty move label out
		// otherwise move label in
		var thisInputVal = inputField.val();
		if ( thisInputVal !== '' ) {
			VALIDATE.moveLabel(inputField);
		} else {
			VALIDATE.removeLabel(inputField);
		}
	};
	
	
	
	// binds validation to click event of submit buttons
	my.init = function () {
		var submit = $('.form-behavior input[type="submit"], .form-behavior button[type="submit"]'),
			required = $('.form-behavior').find('.required:visible'),
			thisError = 0;
		
		submit.on('click', function() {
			thisError = VALIDATE.testfields();
			if (thisError !== 0) {
				// form has errors
				return false;
			} else {
				// form OK
				return true;
			}
		});
		
		required.each(function(){
			$(this).on({
				click : function() {
					VALIDATE.moveLabel($(this));
					//moveLabel($(this));
				},
				focus : function() {
					VALIDATE.moveLabel($(this));
					//moveLabel($(this));
				},
				blur : function() {
					VALIDATE.checkValue($(this));
					VALIDATE.testfields($(this));
				}
			});
		});
	};
	
	// return public methods
	return my;
}(VALIDATE || {}));



/**
 *  Non-list expander (show/hide) <p>
 * Config settings (optional) passed in via data attribute:
 * 	<ul>
 * 		<li>data-target : the target's class or ID name</li>
 * 		<li>data-showControl : the element that when clicked triggers this expander behavior (only classes - IDs not supported)</li>
 * 		<li>data-hideControl : the element that when clicked triggers the contracting behavior (only classes - IDs not supported)</li>
 * </ul>
 * @param {Object} aElem The element containing the behavior
 * @return {void}
 */
function setupExpanderPod(aElem) {
	var aConfig = {
			target : "myTarget",
			showControl : "showControl",
			hideControl : "hideControl"};
	
	// set option vals to user-supplied values, otherwise use defaults
	if ($(aElem).data) {
		aConfig = {
			target : $(aElem).data('target') || aConfig.target,
			showControl : $(aElem).data('showControl') || aConfig.showControl,
			hideControl : $(aElem).data('hideControl') || aConfig.hideControl
		};
	}
	
	$(aElem).find('.' + aConfig.showControl).on('click', function(evt) {
		var theTarg = '';
		
		/**
		 * Look for the target; because the target could potentially be anywhere we need to search in the following order:
		 * <ol>
		 * 		<li>First look for a child match</li>
		 * 		<li>If not found then look for a sibling</li>
		 * 		<li>Otherwise check if an ID was passed in</li> 
		 * </ol>
		 */
		if (($(aElem).find('.' + aConfig.target)).length !== 0 ) {
			theTarg = $(aElem).find('.' + aConfig.target);
		} else if (($(aElem).next('.' + aConfig.target)).length !== 0 ) {
			theTarg = $(aElem).next('.' + aConfig.target);
		} else if ( $('#' + aConfig.target).length !== 0 ) {
			theTarg = $('#' + aConfig.target);
		} else {
			return false;
		}
		
		// @this $(aElem).find('.' + aConfig.showControl)
		if ($(this).hasClass('active')) {
			theTarg.slideDown();
			$(this).toggleClass('active inactive');
		} else if ($(this).hasClass('inactive')) {
			theTarg.slideUp();
			$(this).toggleClass('active inactive');
		// whoops - no one set the default state in the markup...so presume 'active'
		} else {
			theTarg.slideDown();
			$(this).addClass('inactive');
		}
		return false;
	});
	
	$(aElem).find('.' + aConfig.hideControl).click(function() {
		// @this $(aElem).find('.' + aConfig.hideControl)
		if ($(this).hasClass('inactive')) {
			$(aElem).parent().find('.' + aConfig.target).slideUp();
			$(this).toggleClass('active inactive');
			$('.' + aConfig.showControl).toggleClass('active inactive');
		} else {
			$(aElem).parent().find('.' + aConfig.target).slideDown();
			$(this).toggleClass('active inactive');
			$('.' + aConfig.hideControl).toggleClass('active inactive');
		}
		return false;
	});
} // setupExpanderPod


/**
 * add controller for expanders (if not set)
 * @param {Object} aElem The element containing the behavior
 * @param {Object.<number, string>} aConfig Contains aConfig.showCount, aConfig.expandText, aConfig.collapseText
 * @return {void}
 */
function setupExpanderCtrl(aElem, aConfig) {
	// TODO: make this an obj, then attach as last step
	var expandCtrl = "<a href=\"Javascript:void(0);\" class=\"expandCtrl\"><span class='arrow'><span class='arrow-down'></span></span>" + aConfig.expandText + "</a>";
	
	// attaches the expandCtrl and attaches config data
	$(aElem).after(expandCtrl).data("config", aConfig);
	
	// bind click event to show more link
	// @this $(aElem).next('.expandCtrl')
	$(aElem).next('.expandCtrl').toggle(function() {
		$(aElem).children('.isOverflow').slideToggle();
		$(this).html("<span class='arrow'><span class='arrow-up'></span></span>" + aConfig.collapseText);
	}, function() {
		$(aElem).children('.isOverflow').slideToggle();
		$(this).html("<span class='arrow'><span class='arrow-down'></span></span>" + aConfig.expandText);
	});
} // setupExpanderCtrl


/**
 *  Typical list item expanders <p>
 * Config settings (optional) passed in via data attribute:
 * 	<ul>
 * 		<li>data-showCount : the number of items to show (remainder hidden until expanded)</li>
 * 		<li>data-expandText : text that shows prompting to expand</li>
 * 		<li>data-collapseText : text that shows prompting to contract</li>
 * </ul>
 * @param {Object} aElem The element containing the behavior
 * @return {void}
 */
function setupExpanderList(aElem) {
	var aConfig = {
			showCount : 5, 
			expandText : "click to show more", 
			collapseText : "click to show less"},
		hasOverflow = false;
	
	// set option vals to user-supplied values, otherwise use defaults
	if ($(aElem).data) {
		aConfig = {
			showCount : $(aElem).data('showCount') || aConfig.showCount,
			expandText : $(aElem).data('expandText') || aConfig.expandText,
			collapseText : $(aElem).data('collapseText') || aConfig.collapseText
		};
	}
	
	// loop through and for every item > threshhold add hide class
	$(aElem).children('li').each(function() {
		if ($(this).index() > (aConfig.showCount - 1)) {
			$(this).addClass('isOverflow');
			hasOverflow = true;
		}
	});
	// add show more text link
	if (hasOverflow) {
		setupExpanderCtrl(aElem, aConfig);
	}
}// setupExpander


/**
 * Load specific images based upon media query <p>
 * HTML element passes in data attr setting media queries and their associated img src <p> 
 * Sample markup: <p>
 *  
 * 	<img class="fnImageMQ" 
 * 		src="/images-nursing/pages/hpbanner_patient-care_320x250.jpg" 
 * 		data-config = '{
 * 			"mq" : ["(min-width: 1px)",
 * 					"(min-width: 321px)",
 * 					"(min-width: 481px)",
 * 					"(min-width: 721px)"],
 * 			"src" : ["/images-nursing/pages/hpbanner_patient-care_320x250.jpg",
 * 					"/images-nursing/pages/hpbanner_patient-care_480x250.jpg",
 * 					"/images-nursing/pages/hpbanner_patient-care_720x300.jpg",
 * 					"/images-nursing/pages/hpbanner_patient-care_960x300.jpg" ]
 * 			}' />
 * <pre><code>
 * &lt;img&nbsp;class=&quot;slider-image&nbsp;fnImageMQ&quot;&nbsp;<br/>	src=&quot;/images-nursing/pages/hpbanner_patient-care_320x250.jpg&quot;&nbsp;<br/>	data-config&nbsp;=&nbsp;'{<br/>		&quot;mq&quot;&nbsp;:&nbsp;[&quot;(min-width:&nbsp;1px)&quot;,<br/>				&quot;(min-width:&nbsp;321px)&quot;,<br/>				&quot;(min-width:&nbsp;481px)&quot;,<br/>				&quot;(min-width:&nbsp;721px)&quot;],<br/>		&quot;src&quot;&nbsp;:&nbsp;[&quot;/images-nursing/pages/hpbanner_patient-care_320x250.jpg&quot;,<br/>				&quot;/images-nursing/pages/hpbanner_patient-care_480x250.jpg&quot;,<br/>				&quot;/images-nursing/pages/hpbanner_patient-care_720x300.jpg&quot;,<br/>				&quot;/images-nursing/pages/hpbanner_patient-care_960x300.jpg&quot;&nbsp;]<br/>		}'&nbsp;/&gt;
 * </code></pre>
 * 
 * @param {Object} aElem The element containing the behavior
 * @return {void} (modifies DOM)
 */
function setupImageMQ(aElem) {
	var mqIdx = -1; // intially set the media query counter to -1; this gets updated to match the current mq
	viewportObj.getViewport();
	var currentViewport = viewportObj.viewport;
	//console.log('test is ' + ( $(aElem).data('config').mq.length === $(aElem).data('config').src.length ) );
	// NOTE: for this early version we are assuming ALL media queries are ONLY 'min-width' AND in pixels
	if ( $(aElem).data('config').mq.length === $(aElem).data('config').src.length ) {
		//console.log('setting image src');
		var currentImgSrc = $(aElem).attr('src'),
			newImgSrc = currentImgSrc;

		for (i=0; i<$(aElem).data('config').src.length; i++) {
			// sets mqStr to the current mq value in the array
			// sets mqInt to the interger value of the media query
			var mqStr = $(aElem).data('config').mq[ i ],
				mqInt = +(mqStr.replace(/^\([a-zA-Z-:]+/,'')).replace(/[a-zA-Z]+\)$/,'');
			// compare this mq width to viewportObj.viewport
			//console.log('currentViewport: ' + currentViewport + '; mqInt: ' + mqInt);
			if (currentViewport > mqInt) {
				// this is [potentially] the index (i) we want to use for setting the image source
				//console.log('setting mqIdx: ' + mqIdx);
				mqIdx = i;
			}
		}

		if (mqIdx > -1) {
			// set the img src to the matching array value
			newImgSrc = $(aElem).data('config').src[ mqIdx ];
			$(aElem).css('display','block');
		} else {
			//console.log('no image to set');
			newImgSrc = '';
			$(aElem).css('display','none');
		}

		// check if img needs to be background image
		if ($(aElem).data('config').background === "true"){
			//console.log('setting up background');
			bgURL = 'url(' + newImgSrc + ')';
			$(aElem).attr('src','').addClass('visuallyhidden');
			$(aElem).parent().css('background-image',bgURL).css('background-position','0 50%');
		} else {
			// update the element only if the image sources are different
			if (newImgSrc !== currentImgSrc) {
				//console.log('loading new image');
				$(aElem).attr('src',newImgSrc);
			}
		}

	} else {
		console.log('error in data-config: mq and src lengths must match');
		return false;
	}

} // setupImageMQ


jQuery(function($) {
	/**
	 * creates a jQuery object of all elements containing 
	 * classes that begin with "fn"; these classes are what
	 * are used to trigger event attachments
	 */
	var aFunctionalElem = $('[class*="fn"]');

	// create an object to store the method to get the current viewport
	// call via viewportObj.getViewport(), viewportObj.getViewportHeight()
	var viewportObj = {
		viewport: 0,
		getViewport: function() {
			this.viewport = $(window).width();
		},
		getViewportHeight: function() {
			this.viewportHeight = $(window).height();
		}
	}

	/**
	 * Loops through the elements that contain classes 
	 * prefixed with "fn", and attaches functionality 
	 * based on class name 
	 */
	aFunctionalElem.each(function() {
		var aClassList = ($(this).attr("class")).split(' '), // list of classes attached to the element
			regex = new RegExp("^fn");	// the regex pattern to test against

		// loop through the class list looking for matches
		for ( i = 0; i < aClassList.length; i++) {
			if (aClassList[i].match(regex)) {
				// when found, perform the function-specific statements
				switch (aClassList[i]) {
					case "fnExpander":
						if ($(this).data("target")) {	// if we're specifying the target, presume the traditional show/hide
							setupExpanderPod(this);
						} else {	// otherwise presume a list expander and we'll need to generate controls
							setupExpanderList(this);
						}
						break;
					case "fnImageMQ":
						var that = this;
						setupImageMQ(that);
						$(window).resize(function() {
							setupImageMQ(that);
						});
						break;
					case "fnValidate":
						VALIDATE.init();
						break;
				}
			}
		}
	});
});
