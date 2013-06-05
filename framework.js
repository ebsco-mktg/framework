/**
 * @fileoverview Contains all of the global functionality used in conjunction with the framework
 * @license Copyright EBSCO Industries, Inc.
 * @author Mike Pifalo
 * @author Jeff Ayer
 */


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



jQuery(function($) {
	/**
	 * creates a jQuery object of all elements containing 
	 * classes that begin with "fn"; these classes are what
	 * are used to trigger event attachments
	 */
	var aFunctionalElem = $('[class*="fn"]');

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
						} else {						// otherwise presume a list expander and we'll need to generate controls
							setupExpanderList(this);
						}
						break;
				}
			}
		}
	});
});
