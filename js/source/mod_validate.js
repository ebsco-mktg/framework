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
var VALIDATE = (function ( pub ) {

    // private variables
    // var privatevarname = ...


	// private methods
	// function privateMethod() { ... }
	function debounce(fn, delay) {
		//console.log( 'debounce' );
		var timer = null;
		return function () {
	    	var context = this, 
	    		args = arguments;
			
			clearTimeout(timer);
			timer = setTimeout( function () {
				fn.apply(context, args);
				console.log( 'fn apply' );
			}, delay );
		};
	}
		
	// below are not technically private...yet
	// set the passed in element to the provided class
	pub.setClass = function(aElem, aClass) {
		//window.console && console.log('VALIDATE.setClass: ', aElem, aClass);
		try {
			var aElem = $(aElem)[0];	// getting the dom obj from the jQ obj
			// we only need to set the error class if it's not already on the field...
			if ( (aElem.className).indexOf(aClass) === -1 ) {
				if ( aElem.className === '' ) {
					aElem.className = aClass;
				} else {
					aElem.className = aElem.className + ' ' + aClass;
				}
			}
		} catch(e) {
			// console.log(e);
		}
	};
	
	// remove  the provided class from the passed in element 
	pub.removeClass = function(aElem, aClass) {
		try {
			var aElem = aElem[0];	// getting the dom obj from the jQ obj
			if ( aElem.className === aClass ) {
				aElem.removeAttribute('class');
			} else {
				aElem.className = (aElem.className).replace(' ' + aClass, '');
			}
		} catch (e) {
			console.log(e);
		}
	};
	
	
	// public properties
	// my.propertyname
	
	
	// public methods
	// my.methodname
	
	// checks element for valid email value and adds/removes error class (invalid) on element
	// returns 1 if error
	pub.email = function (aElem) {
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

	// checks element for valid email value and adds/removes error class (invalid) on element
	// returns 1 if error
	pub.ebscoEmail = function (aElem) {
	    window.console && console.log('VALIDATE.email', aElem);
	    /* 
	     * 	\S+ 	=== 	any single non-whitespace char, 1 or more times
	     * 	@ 		=== 	'@'
	     * 	\S+ 	=== 	any single non-whitespace char, 1 or more times
	     * 	\. 		=== 	explicite '.'
	     * 	\S+ 	=== 	any single non-whitespace char, 1 or more times
	     */
	    var re = /\S+@\S+\.\S+/,
	    	element = $(aElem),
	    	thisError = 0;
	    
	    // forcing to ebsco.com or ebschost.com
	    // adding optional name@cc.ebsco.com
	    /*
	     * 	\S+ 				=== 	any single non-whitespace char, 1 or more times
	     * 	@ 					=== 	'@'
	     *  (?:\S{2}\.){0,1} 	=== 	any non-whitespace char followed by '.', 0 or 1 times
	     * 	(?:ebsco){1} 	=== 	'ebsco' only 1 times
	     * 	(?:host){0,1} 	=== 	'host' 0 or 1 times
	     * 	(?:\.com)$ 		=== 	'.com' at the end of the string
	     * 
	     * see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions for regex awesomeness
	     * 
	     */
	    // re = /\S+(?:@ebsco){1}(?:host){0,1}(?:\.com)$/;
	    re = /\S+@(?:\S{2}\.){0,1}(?:ebsco){1}(?:host){0,1}(?:\.com)$/;
	    
	    if ( !(re.test(element.val())) ) {
	    	thisError = 1;
	    }
	    return thisError;
	};
	
	
	// returns 1 if error
	pub.radio = function (aElem) {
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
	
	pub.select = function(aElem) {
		
	};
	
	pub.text = function (aElem) {
		var elementVal = aElem.val(),
			thisError = 0;
        //console.log('this value is: ', elementVal);
        if (elementVal === '') {
            thisError = 1;
            VALIDATE.removeLabel(aElem);
        }
        return thisError;
	};
	
	// returns 1 if error
	pub.testfields = function (aField) {
		//console.log( 'testfields' );
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
	        
	        if ( ($that[0].tagName).toLowerCase() === 'select' ) {
	        	elementType = 'select';
	        }
	        
	        // window.console && console.log( 'elementType: ', elementType );
	            
	        // check field for error based on input type
	        if (elementType === 'email') {
	        	if ( $that.hasClass('ebsco-email') ) {
			        //email validation to only allow ebsco emails
		            if ( VALIDATE.ebscoEmail($that) !== 0 ) {
		            	thisError = 1;
		            }
	        	} else {
			        //email validation
		            if ( VALIDATE.email($that) !== 0 ) {
		            	thisError = 1;
		            }
	        	}
	        } else if (elementType === 'radio') {   
	        	//radio button validation
	        	if ( VALIDATE.radio($that) !== 0 ) {
	            	thisError = 1;
	            };
	        } else if (elementType === 'select') {
	        	if ( VALIDATE.text($that) !== 0 ) {
	        		thisError = 1;
	        	}
	        } else if (elementType === 'checkbox') {
	        	// console.log('this element (' + $that.attr("name") + ') is a checkbox');
	        	if ( ($that).is(':checked') ) {
	        		//thisError = 1;
	        		// console.log('checkbox passed');
	        	} else {
	        		// console.log('checkbox error');
	        		thisError = 1;
	        	}
	        } else {
	        	// text inputs...
	        	if ( VALIDATE.text($that) !== 0 ) {
	        		thisError = 1;
	        	}
	        }
	        
			// set or remove error classes
	        if ( thisError === 1 ) {
	        	if ( ($that[0].type === 'radio') || ($that[0].type === 'checkbox') ) {
	        		VALIDATE.setClass($that.parent(), 'error');
	        	} else {
	        		VALIDATE.setClass($that,'error');
	        	}
	        	error = thisError;
	        } else {
	        	if ( ($that[0].type === 'radio') || ($that[0].type === 'checkbox') ) {
	        		VALIDATE.removeClass($that.parent(), 'error');
	        	} else {
	        		VALIDATE.removeClass($that,'error');
	        	}
	        }
	        
	    });
	    
	    VALIDATE.checkSubmitState();
	    
		return error;
	};
	
	// checks if form has errors and sets submit btn class
	pub.checkSubmitState = function() {
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
	
	pub.moveLabel = function(inputField) {
		var thisLabel = $('label[for="' + inputField.attr('id') + '"]');
		
		//window.console && console.log('VALIDATE.moveLabel: ', inputField);
		
		if ( ($(inputField)[0].type !== 'radio') && ($(inputField)[0].type !== 'checkbox') ) {
			VALIDATE.setClass( thisLabel, 'hasValue' );
		}

		

		// if input is child of multiline classed parent, add active class to the input
		if ( $(inputField).parent().hasClass('multiline') ) {
			VALIDATE.setClass( $(inputField).parent('.multiline'), 'active' );
		}
		// if input field has a prefix (like 'http://') then add active class to the prefix element
		if ( inputField.hasClass('hasPrefix') ) {
			VALIDATE.setClass( inputField.prev('.field-prefix'), 'active' );
		}
	};

	pub.removeLabel = function(inputField) {
		var thisLabel = $('label[for="' + inputField.attr('id') + '"]');
		//window.console && console.log( 'inputField: ', inputField );
		thisLabel.removeClass('hasValue').removeClass('hasBlur');
		
		// if input is child of multiline classed parent, remove active class from the input
		if ( $(inputField).parent().hasClass('multiline') ) {
			VALIDATE.removeClass( $(inputField).parent('.multiline'), 'active' );
		}
		// if input field has a prefix (like 'http://') then remove active class from the prefix element
		if ( inputField.hasClass('hasPrefix') ) {
			VALIDATE.removeClass( inputField.prev('.field-prefix'), 'active' );
		}
	};
	
	pub.hideLabel = function(inputField) {
		var thisLabel = $('label[for="' + inputField.attr('id') + '"]');
		
		if ( !($(inputField).parent('.form-behavior').hasClass('push-label')) ) {
			//window.console && console.log( 'default form' );
			VALIDATE.setClass( thisLabel, 'hasBlur' );
		}
	};
	
	pub.checkValue = function(inputField) {
		// check value of input field, and if not empty move label out
		// otherwise move label in
		var thisInputVal = inputField.val();
		if ( thisInputVal !== '' ) {
			VALIDATE.moveLabel(inputField);
			// since there's a value in the field, check it for errors
			if ( inputField.is('.required:visible') ) {
				VALIDATE.testfields(inputField);
			}
			
		} else {
			VALIDATE.removeLabel(inputField);
		}
	};
	
	pub.errorsVisible = function() {
		var errors = $('.error:visible');
		//console.log('errors showing: ', errors.length);
		return errors.length;
	};
	
	
	
	// binds validation to click event of submit buttons
	// pass in optional var to suppress default submit
	/* pass in variable config json string of the string ids for the country, state, zip fields
	 * defaults to '#country', '#state', and '#postalcode' if not passed in
	 * 	{ 
	 * 		"countryField" : "string",
	 * 		"stateField" : "string",
	 * 		"postalField" : "string"
	 * 	}
	 */
	pub.init = function ( submitMode, varCfg ) {
		// using jQuery because the developer is lazy
		EIS.loadOnce( 'jQuery', function() {
	
			var submit = $('.form-behavior input[type="submit"], .form-behavior button[type="submit"], .submitForm'),
				//required = $('.form-behavior').find('.required:visible'),
				fields = $('.form-behavior').find('input, textarea, select').not(':submit'),
				thisError = 0,
				countryField = typeof varCfg === 'object' && typeof varCfg.countryField === 'string' ? varCfg.countryField : '#country',
				stateField = typeof varCfg === 'object' && typeof varCfg.stateField === 'string' ? varCfg.stateField : '#state',
				postalField = typeof varCfg === 'object' && typeof varCfg.postalField === 'string' ? varCfg.postalField : '#postalcode',
				countrySelect = $(countryField),
				stateSelect = $(stateField),
				postalCode = $(postalField),
				countriesWithStates = "United States, Canada";
			
			// window.console && console.log( 'countryField: ', countryField, '; countrySelect: ', countrySelect );
			
			// bind a click handler on submit unless submitMode is false
			if ( typeof submitMode === 'undefined'  || submitMode === true ) {
				submit.on('click', function(evt) {
					// evt.preventDefault();
					thisError = VALIDATE.testfields();
					console.log('thisError = ', thisError);
					if (thisError !== 0) {
						// form has errors
						VALIDATE.testfields();
						PROGRESS.setNavBtns();
						return false;
					} else {
						// form OK
						// replace btn with loading icon
						$(this).addClass('loading');
						$('body').css('cursor','progress');
						
						// now submit the form
						$(this).closest('form').submit();
						
						return true;
					}
				});
			}
			// if a dropdown (select) has a value stored in the data-selected attr, we need to set the matching option val to selected
			if ( $('.fnSetSelect').length > 0 ) {
				
				var $theSelects = $('.fnSetSelect');
				
				$theSelects.each( function() {
					var thisDataVal = $(this).data('selected');
					
					$(this).find('option[value="'+thisDataVal+'"]').attr('selected','selected');
					
				});
				
			}
			
			// var datefieldTimer1, datefieldTimer2;
			
			// we need to call move labels on all fields - not just required ones
			//required.each(function(){
			fields.each(function(){
				// console.log('field: ', $(this).attr('name'));
				$(this).on({
					click : function() {
						//console.log( 'click' );
						VALIDATE.moveLabel($(this));
					},
					focus : function() {
						//console.log( 'focus' );
						VALIDATE.moveLabel($(this));
					},
					blur : function() {
						//console.log( 'blur' );
						if ( ($(this)[0].type !== 'radio') && ($(this)[0].type !== 'checkbox') ) {
							if ( $(this).hasClass( 'datefield' ) ) {
								// delay checking the datefield since the datepickr script also runs
								//debounce( function() {
									//VALIDATE.checkValue( $(this) );
								//}, 1000 );
								
								/*window.clearTimeout( datefieldTimer1 );
								datefieldTimer1 = window.setTimeout( function() {
									VALIDATE.checkValue( $(this) );
								}, 1000 );
								*/
								

							} else {
								VALIDATE.checkValue($(this));
							}
						}
						if ( $(this).hasClass('required') ) {
							// console.log( 'required' );
							if ( $(this).hasClass( 'datefield' ) ) {
								// console.log( 'datefield' );
								// delay checking the datefield since the datepickr script also runs
								//debounce( function() {
									//console.log( 'fn 1' );
									//VALIDATE.testfields( $(this) );
								//}, 1000 );
								/*window.clearTimeout( datefieldTimer2 );
								datefieldTimer2 = window.setTimeout( function() {
									VALIDATE.testfields( $(this) );
								}, 1000 );
								*/
							} else {
								VALIDATE.testfields($(this));
							}
						}
						PROGRESS.setNavBtns();
					}, 
					change : function() {
						//console.log( 'change' );
						if ( $(this).hasClass('required') ) {
							VALIDATE.testfields($(this));
						}
						PROGRESS.setNavBtns();
					},
					keydown : function() {
						//console.log( 'keydown' );
						VALIDATE.hideLabel( $(this) );
					}
				});
				// in case of user refreshing form (without clearing data), make sure the labels aren't covering any entered values
				// console.log('validate checkvalue');
				VALIDATE.checkValue($(this));
			});
			
			// bind country-state selector logic
			// on change of the country select, if country is us or can enable the state select and mark it required
			countrySelect.change(function() {
				if ( countriesWithStates.indexOf(countrySelect.val()) !== -1 ) {
					stateSelect.removeAttr('disabled').addClass('required').removeClass('disabled');
					stateSelect.children('option').first().text('State / Province*');
					postalCode.addClass('required').prev('label').text('Zip Code/Postal*');
					//var stateClass = '.' + $('option:selected', countrySelect).data('state');
					//stateSelect.children('option').not(stateClass).css('display','none');
					//$(stateClass).css('display','block');
				} else {
					stateSelect.attr('disabled','disabled').val('').removeClass('required error').addClass('disabled');
					stateSelect.children('option').first().text('field not required');
					postalCode.removeClass('required error').prev('label').text('Postal Code (optional)');
					//stateSelect.children('option').css('display','none');
				}
			});
		});
		
	};
	
	// return public methods
	return pub;
	
}(VALIDATE || {}));


var PROGRESS = (function( pub ) {
	
	// private vars
	/*
	var allPanels = simple.getElementsByClassName(document.body, 'panel'),
		numPanels = allPanels.length;
	*/
	var allPanels = document.querySelectorAll('.panels'),
		numPanels = allPanels.length;
	
	// private fn to get the elem and idex of the panel classed as 'current'
	function getCurrentPanel() {
		var currPanel = {};
		
		currPanel.elem = $('.current');
		currPanel.idx = $('.panels').index(currPanel.elem);
		
		return currPanel;
	}

	function locHashChange() {
		debug.console('locHashChange');
		
		var thisHash = location.hash,
			thisIdx = +( thisHash.split('-')[1] ),
			currPanel = getCurrentPanel();

		if ( thisHash !== '' ) {
			thisError = VALIDATE.testfields();
			// console.log('thisError = ', thisError);
			if (thisError !== 0) {
				// form has errors
				if ( thisIdx >= currPanel.idx ) {
					// attempting to progress forward when curr panel has errors
					PROGRESS.setHash( 'item' + currPanel.idx );
					VALIDATE.testfields();
					PROGRESS.setNavBtns();
				} else {
					// attempting to go back; allow regardless of curr panel errors
					PROGRESS.move('item'+thisIdx);
				}
			} else {
				// form OK
				PROGRESS.move('item'+thisIdx);
			}
		} else {
			thisError = VALIDATE.testfields();
			// console.log('thisError = ', thisError);
			if (thisError !== 0) {
				// form has errors
				PROGRESS.setHash( 'item' + currPanel.idx );
				VALIDATE.testfields();
				PROGRESS.setNavBtns();
			} else {
				// form OK
				PROGRESS.move('item0');
			}
		}
	}
	
	pub.locHashChange = function () {
		locHashChange();
	};
	
	pub.setHash = function (numMoves) {
		var currPanel = getCurrentPanel(),
			targPanelIdx = 0,
			re = new RegExp('(^item)');
		
		//currPanel = $('.panel').index('current');
		// console.log('numMoves: ', numMoves);
		if ( re.test(numMoves) ) {
			// 'item#' passed in
			targPanelIdx = new Number( numMoves.replace(re,'') );
		} else {
			targPanelIdx = currPanel.idx + numMoves;
		}
		//window.console && console.log('targPanelIdx: ', +targPanelIdx);
		// need to know if there is a panel to move to (back or forth)
		if ( currPanel.idx !== -1 ) {
			if ( targPanelIdx < numPanels && targPanelIdx > -1 ) {
				// set hash value
				window.location.hash = '#panel-' + targPanelIdx;
				if ( $('.lt-ie8').length !== 0 ) {
					debug.log('manual move for IE7');
					locHashChange();
				}
			}
		}			
	};
	
	
	
	
	
	// move to different panel
	// can move 'back', 'forward', or by index #
	// expects a # (the amount to move forward or back), or a string in the format 'item#' (zero-based)
	pub.move = function (numMoves) {
		var currPanel = getCurrentPanel(),
			targPanelIdx = 0,
			re = new RegExp('(^item)');
		
		//currPanel = $('.panel').index('current');
		// console.log('numMoves: ', numMoves);
		if ( re.test(numMoves) ) {
			// 'item#' passed in
			targPanelIdx = new Number( numMoves.replace(re,'') );
		} else {
			targPanelIdx = currPanel.idx + numMoves;
		}
		//window.console && console.log('targPanelIdx: ', +targPanelIdx);
		// need to know if there is a panel to move to (back or forth)
		//alert('currPanel.idx: ' + currPanel.idx);
		if ( currPanel.idx !== -1 ) {
			if ( targPanelIdx < numPanels && targPanelIdx > -1 ) {
				// move
				$(currPanel.elem).fadeOut(500, function() {
					$(allPanels).eq(targPanelIdx).fadeIn(500, function() {
						$(currPanel.elem).removeClass('current');
						$(this).addClass('current');
						PROGRESS.setNavBtns();
						PROGRESS.setProgress();
						// only add to the history if moving forward
						/*if ( targPanelIdx > currPanel.idx ) {
							EIS.setHistory(+targPanelIdx);
						}*/
						
						// set the hash appropriately
						//EIS.setHash(targPanelIdx);
						
						//ga('send', 'pageview', 'request info form panel ' + targPanelIdx);
					});
				});
			}
		}
		
	};
	
	pub.setNavBtns = function() {
		// console.log('setNavBtns');
		var currPanel = getCurrentPanel();
		
		if ( VALIDATE.errorsVisible() > 0 ) {
			// console.log('fired');
			$('.button').not('.movePrev').add('.submitForm').addClass('disabled');
			$('.status-group .note').addClass('highlight');
		} else {
			$('.button').add('.submitForm').removeClass('disabled');
			$('.status-group .note').removeClass('highlight');
		}
		
		//alert('currPanel.idx: ' + currPanel.idx);
		if ( (currPanel.idx + 1) > (numPanels - 1) ) {
			// disable the next btn
			$('.moveNext').addClass('removed');
			//alert('disabled');
		} else {
			$('.moveNext').removeClass('removed');
			//alert('remove disabled');
		}
		
		if ( (currPanel.idx - 1) < 0 ) {
			// disable the next btn
			$('.movePrev').addClass('removed');
		} else {
			$('.movePrev').removeClass('removed');
		}
		
		// actually, the state of submit *should* be tied to the validation state...
		
		//window.console && console.log('currPanel.idx; numPanels-1: ', currPanel.idx, numPanels-1);
		
		if ( currPanel.idx === (numPanels - 1) ) {
			// enable submit btn
			$('.submitForm').removeClass('removed');
		} else {
			$('.submitForm').addClass('removed');
		}
		
	};
	
	pub.setProgress = function() {
		//console.log('setProgress');
		/* 
		 * figure out the # of panels (sets width % per each),
		 * take current panel idx and set width to it's calc value
		 */
		
		var widthEach = 100 / (numPanels),
			currWidth = 0;
		var currPanel = getCurrentPanel();
		
		if ( currPanel.idx !== -1 ) {
			//if ( currPanel.idx === (numPanels - 1) ) {
				//$('.indicator').css('width', '100%').text('last step');
			//} else {
				currWidth = (currPanel.idx + 1) * widthEach;
				$('.indicator').css('width', currWidth + '%').text('step ' + new Number(currPanel.idx + 1) + ' of ' + numPanels + ' ');
			//}
		}
				
	};
	
	pub.setIndicatorPoints = function() {
		/*
		 * grab the panel headers and place them along the progress bar (within the progress element)
		 */
		var thePoints = [];
		var theIndicator = simple.getElementsByClassName(document.body, 'progress');
		var widthEach = 100 / (numPanels);
		
		// loop through every panel and place the h1 value into an array
		// console.log('numPanels: ', numPanels);
		for ( var i=0; i<numPanels; i++) {
			// console.log('allPanels[i].children.length', allPanels[i].children.length);
			// find the h1 in the panel
			for ( var ii=0, len=allPanels[i].children.length; ii<len; ii++) {
				var thisNode = allPanels[i].children[ii],
					thisH1Val = allPanels[i].getElementsByTagName('h1')[0].textContent;
				// add the value of the h1 to the array
				thePoints.push(thisH1Val);
			}
		}
		
		// loop through and place the value into the indicator
		for ( var iii=0, thisLen=thePoints.length; iii<thisLen; iii++ ) {
			var span = document.createElement('span');
			var thisCt = iii;
			span.className = 'point';
			span.style.width = widthEach + '%';
			span.style.left = (widthEach * iii) + '%';
			span.appendChild(document.createTextNode(thePoints[iii]));
			theIndicator[0].appendChild(span);
		}
		
		// bind click handler so we can jump around if we want
		$('.point').each(function(idx) {
			$(this).on('click', function() {
				PROGRESS.move('item'+idx);
			});
		});
		
		
	};
	
	pub.init = function () {
		//window.console && console.log('PROGRESS.init');
		PROGRESS.setNavBtns();
		PROGRESS.setProgress();
		//PROGRESS.setIndicatorPoints();
		//EIS.setEvtBindings();
		
		if ( $('.lt-ie8').length < 1 ) {
			// bind event to the hash change evt
			window.onhashchange = locHashChange;
			// change the hash
			// window.location.hash = '#form';
		} else {
			// fallback for no 'onhashchange' support
			// showContactForm();
			// window.location.hash = '#form';
		}


		$('.moveNext').on('click', function(){
			var visibleFields = $('.required:visible');
			VALIDATE.testfields(visibleFields);
			if ( VALIDATE.errorsVisible() === 0 ) {
				
				//PROGRESS.move(1);
				PROGRESS.setHash(1);
				
			} else {
				$(this).addClass('disabled');
				$('.status-group .note').addClass('highlight');
			}
			return false;
		});
		
		$('.movePrev').on('click', function(){
			//PROGRESS.move(-1);
			PROGRESS.setHash(-1);
			return false;
		});
		
	};
	
	return pub;
	
}( PROGRESS || {} ));



