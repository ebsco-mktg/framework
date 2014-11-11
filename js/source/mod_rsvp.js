/*
 * RSVP - grabs form values and adds to the rsvp_notes fiels in EE RSVP module 
 * 
 * so the plan is...
 * 
 * look for an element with the id of 'fnRSVP' because inside that is the rsvp form element
 * 
 * now bind some event handlers to the rsvp form submit
 * 
 * on submit, 
 * 		stop normal submit
 * 		loop through all form fields (ideally exclude the 'rsvp_' prefixed fields - and hidden ones too?)
 * 			add/chain all the form values into a string (json?)
 * 		when done looping through, take the string and shove it into the rsvp_notes field value
 * 
 * 		now submit to rsvp as usual (form.submit) 
 * 
 * 
 */

/*
	the notes field...


*/
var RSVP = (function( pub ) {

	// private functions
	
	// 
	function updateNoteField( $rsvpForm ) {
			
		var $theFields = $rsvpForm.find( 'input' ).add('textarea').add('select').not( ':hidden' ).not( ':submit' ),
			fieldLength = $theFields.length,
			$rsvpNoteField = $rsvpForm.find('[name="rsvp_notes"]'),
			rsvpNoteValue = '', // DISABLING $rsvpNoteField.val(), 
			rsvpNoteString = 'Notes: ' + rsvpNoteValue,
			// line-break string 
			lbStr = '<br />\n', 
			i = 0;
		
		for ( ; i < fieldLength; i++ ) {
			
			var $thisField = $theFields.eq(i),
				thisName = $thisField.attr('name'),
				thisValue = $thisField.val();
			
			rsvpNoteString = rsvpNoteString + lbStr + thisName + ': ' + thisValue;
			
		}
		
		$rsvpNoteField.val( rsvpNoteString );
		// window.console && console.log( $rsvpNoteField.val() );
		
	}
	
	function updateUserFields( fieldItem ) {
		
		// get the field item value
		var fieldValue = $(fieldItem).val();
			// based on naming convention get the corresponding User form field item
			fieldName = ( $(fieldItem).attr('name') ).slice(8);
		
		// window.console && console.log('fieldValue: ', fieldValue);
		// window.console && console.log('fieldName: ', fieldName);
		
		// set the User form field value to the field item value
		$('#' + fieldName).val( fieldValue );
		
	}
	
	// checks if 'update profile' is checked and if so will update member profile using User form
	function updateProfile( callback ) {
		var shouldUpdate = $('#update').is(':checked');
		
		if ( shouldUpdate ) {
			// window.console && console.log('update profile is ticked');
			// profile fields named in convention 'profile_fieldName'
			
			// get array of profile fields in rsvp form
			var $profileFields = $('#fnRSVP [name^="profile_"]'),
				i = 0,
				profileFieldsLength = $profileFields.length;
			
			// for each item in the array, update the corresponding User form field
			for ( ; i < profileFieldsLength; i++ ) {
				var thisFieldItem = $profileFields.eq(i);
				
				// window.console && console.log('updating: ', thisFieldItem);
				
				updateUserFields( thisFieldItem );
				
			}
			
			// now submit the User form
			var $userForm = $('#memberForm');
			
			var thisRequest = $.ajax({
					url     : $userForm.attr('action'),
					type    : $userForm.attr('method'),
					// dataType: 'html',
					data    : $userForm.serialize()
				});
				
			thisRequest.fail(function( jqXHR, textStatus ) {
				window.console && console.error( "Request failed: " + textStatus );
			});
			thisRequest.done(function( jqXHR, textStatus ) {
				// window.console && console.log( jqXHR );
				// if needing callbacks...
				// waiting until the ajax is successful before firing...
				if (callback && typeof(callback) === 'function') {
					// window.console && console.log('cb: ', callback);
					callback.apply( this, arguments );
				}
			});
		} else {
			// if needing callbacks...
			if (callback && typeof(callback) === 'function') {
				// window.console && console.log('cb: ', callback);
				callback.apply( this, arguments );
			}
		}
	}
	
	
	// our init method will bind an update function (appending custom input values to the notes field) whenever someone clicks submit on the rsvp form
	pub.init = function( ) {
		
		EIS.loadOnce( 'jQuery', function() {
			
			// jquery object of the form; the rsvp form is assumed to be a child of the #fnRSVP element 
			var $rsvpForm = $( '#fnRSVP form' ),
				thisError = 0,
				// regMsg is the text that displays if the user has already registered for this event
				regMsg = document.getElementById('regMsg');
			
			// set up form validation
			EIS.loadScript( '//www.ebsco.com/apps/global/ada/js/source/mod_validate.js', function() {
				VALIDATE.init( false, { "countryField" : "#profile_country", "stateField" : "#profile_state", "postalField" : "#profile_postalcode" } );
			});
			if ( $rsvpForm.length > 0 ) {
				
				// window.console && console.log(' updating field values ');
				
				// pre-pop fields if there's an existing registration
				// also strip out the '\n' line-break; we'll use '<br />' to split into the field groups and then ': ' to split into name value pairs
				var notesText = ( $rsvpForm.find('#rsvp_notes').val() ).replace( /\n/g, '' ),
				    notesEmailText = ( $rsvpForm.find('#rsvp_notes').val() ).replace( /<br \/>/g, '' ),
					notesArr = notesText.split('<br />'),
					notesArrLength = notesArr.length,
					i = 0;
				
				// window.console && console.log(notesText, notesArr, notesArrLength);
				
				if ( notesArrLength > 1 ) {
					$(regMsg).removeClass('hidden');
				}
				
				for ( ; i < notesArrLength; i++ ) {
					
					var thisFieldArr = notesArr[i].split(': '),
						thisFieldName = thisFieldArr[0],
						thisFieldValue = thisFieldArr[1];
					
					// window.console && console.log( 'thisFieldName: ', thisFieldName, thisFieldValue );
					
					if ( $('#events.thank-you-page .basic-list').length > 0 ) {
						var msgIntro = 'You are now registered for the following event: \n\n';
						var helpMsg = '\n\n\nYou may update your registration by returning to ' + $('#regReturnUrl').text();
						var theMsg = msgIntro + $('#eventDetailRaw').text() + notesEmailText + helpMsg;
						
						// special route for 'message' (sent to confirmation email)
						// actually, should kick out to a 'format for email' fn
						$('#message').val( theMsg );
						
						// thank you page doesn't use input fields, but has matching element id's
						// this prints out to the screen (not to the hidden confirmation email)
						$('#' + thisFieldName).text( thisFieldValue );
						
					} else {
						// now update matching for fields
						if ( thisFieldName !== 'email' ) {
							
							if ( $('#' + thisFieldName).parent('.field').hasClass('select') ) {
								// window.console && console.log( 'this field be a select: ', thisFieldName);
								$('#' + thisFieldName).find( 'option[value="'+thisFieldValue+'"]' ).attr('selected','selected');
								
							} else {
								// window.console && console.log('just a normal input field');
								$('#' + thisFieldName).val( thisFieldValue );
							}
						}
					}
					
				}
				// now we can submit the thank-you email
				if ( $('#events.thank-you-page').length > 0 ) {

					var $contactForm = $('#contact_form');
					
					var thisRequest = $.ajax({
							url     : $contactForm.attr('action'),
							type    : $contactForm.attr('method'),
							// dataType: 'html',
							data    : $contactForm.serialize()
						});
						
					thisRequest.fail(function( jqXHR, textStatus ) {
						window.console && console.error( "Request failed: " + textStatus );
					});
					thisRequest.done(function( jqXHR, textStatus ) {
						// window.console && console.log( 'contact email sent' );
					});
					
				}
				
				// event binding; when clicking the submit btn parse and update all the 'custom' fields, then submit to RSVP
				$('input[name="rsvp_submit"]').on( 'click', function(evt) {
					// window.console && console.log('submit requested');
					// stop the form from submitting
					evt.preventDefault();

					thisError = VALIDATE.testfields();
					//console.log('thisError = ', thisError);
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

						// parse the custom fields and add them to the rsvp_notes field
						updateNoteField( $rsvpForm );
						
						// check if member profile should be updated
						updateProfile( function() {
							// pass in the submit to fire after updating
							$rsvpForm.submit();
						});
					}
					
				});

				// event binding; when clicking the cancel reg btn parse, ask for confirmation
				$('input[name="rsvp_cancel"]').on( 'click', function(evt) {
					// window.console && console.log('submit requested');
					// stop the form from submitting
					//evt.preventDefault();
					
					var thisResponse = window.confirm('Click \'OK\' to delete your registration.');
					
					if (thisResponse) {
						return true;
					} else {
						return false;
					}
				});
			}

		});
	};

	return pub;
	
}(RSVP || {}));

