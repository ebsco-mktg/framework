$(function(){
  
  /*
    ========================================
        Form behavior with error removal
    ========================================
  */
    
    var label = $('.form-behavior label'),
        input = $('.form-behavior input[type="text"], .form-behavior input[type="tel"]'),
        email = $('.form-behavior input[type="email"]'),
        radio = $('.form-behavior input[type="radio"]'),
        file = $('.form-behavior input[type="file"]'),
        select = $('.form-behavior select'),
        textarea = $('.form-behavior textarea'),
        submit = $('.form-behavior input[type="submit"], .form-behavior button[type="submit"]'),
        errors = 0;
    
    //validate
    function fnValidate() {
        
        //check to see if any required fields
        //are unchecked, blank, or have well
        //formatted email addresses
        var required = $('.required:visible'),
            elementNames = [];
        
        required.each(function(){
            
            var elementVal = $(this).val(),
                elementType = $(this).attr('type');
            
            if ($(this).hasClass('invalid')) {
                $(this).addClass('error');
                submit.addClass('disabled');
                errors = 1;
                return errors;
            }
            
            //email validation
            if (elementType === 'email') {
            
                var re = /\S+@\S+\.\S+/;
                
                if (re.test(this.value)) {
                    $(this).removeClass('error');
                    submit.removeClass('disabled');
                } else {
                    $(this).addClass('error');
                    submit.addClass('disabled');
                    errors = 1;
                    return errors;
                }
            }
            
            //radio button validation
            if (elementType === 'radio') {
                
                var checkName = $(this).attr('name');
                
                elementNames.push(checkName);
    
                for (i = 0; i < elementNames.length; i++) {
                    var thisId = $(this).attr('id'),
                        isChecked = $('input[name="' + elementNames[i] + '"]').is(':checked');
                    
                    if (!isChecked) {
                        $('label[for=' + thisId + ']').addClass('error');
                        errors = 1;
                        return errors;
                    } else {
                        $('label[for=' + thisId + ']').removeClass('error');
                    }
                    
                }
            }
            
            //input and textarea validation
            if (elementVal === '') {
                $(this).addClass('error');
                submit.addClass('disabled');
                errors = 1;
                return errors;
            }
        });
    }
    
    function fnValidateEmail(element) {
        //regex source http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
        var element = $(element),
            re = /\S+@\S+\.\S+/;
        
        if (re.test(element.val())) {
            element.removeClass('invalid');
        } else {
            element.addClass('invalid');
        }
    }
    
	// check if any field is in error state, and update submit btn state appropriately
	function checkSubmitState() {
	 	if ( $('.error').length ) {
			submit.addClass('disabled');
 		} else {
			if ( submit.hasClass('disabled') ) {
				submit.removeClass('disabled');
			}
 		}
	}
    
   
    
    //check each text based input field for a value
    //if the field is not empty hide each respective label
    input.add(email).add(textarea).each(function() {
        if ( this.value !== '' ) {
            var thisId = $(this).attr('id');
            $('label[for=' + thisId + ']').hide();
            checkSubmitState();
        }
    });
    
    //text based field focus
    input.add(email).add(textarea).focus(function() {
        var thisId = $(this).attr('id');
        $(this).change(function() {
            $('label[for=' + thisId + ']').stop(true,true).fadeTo(250, 0, 'easeOutQuad', function() {
                $(this).css({'display':'none'});
                checkSubmitState();
            });
        });
        if ( this.value === '' ) {
            $('label[for=' + thisId + ']').stop(true,true).fadeTo(250, .5, 'easeOutQuad');
        }
    });
    
    //radio / file based focus
    radio.add(file).focus(function(){      
        if ($(this).hasClass('required')) {
            //remove the file error
            $(this).removeClass('error');
            
            //remove the radio button error
            var thisId = $(this).attr('id'); 
            $('label[for="' + thisId + '"]').removeClass('error');
        }
    });
    
    //key down
    input.add(email).add(textarea).keydown(function() {
        var thisId = $(this).attr('id');
        
        $(this).removeClass('error');
        
        $('label[for="' + thisId + '"]').stop(true,true).fadeTo(250, 0, 'easeOutQuad', function() {
            $(this).css({'display':'none'});
        });
    
        //is email properly formatted?
        if ($(this).is(email)) {
            fnValidateEmail(this);
        }
    });
    
    //key up
    input.add(email).add(textarea).keyup(function(e) {
        var thisId = $(this).attr('id');
        
        var code = (e.keyCode ? e.keyCode : e.which);
        
        if ( this.value === '' ) $('label[for="' + thisId + '"]').css({'display':'block'}).stop(true,true).fadeTo(250, .5, 'easeOutQuad');
        
        //accomodate for users tabbing through form
        if ( code !== 9 && this.value === '' && $(this).hasClass('required') ) $(this).addClass('error');
    });
    
    //blur
    input.add(email).add(textarea).blur(function() {
        var thisId = $(this).attr('id');
        
        if ( this.value === '' ) {
            $('label[for="' + thisId + '"]').stop(true,true).fadeTo(250, 1, 'easeOutQuad');
            if ($(this).hasClass('required')) $(this).addClass('error');
        } else {
            $(this).removeClass('error');   
        }
        
        //is email properly formatted?
        if ($(this).is(email)) {
            fnValidateEmail(this);
        }
        
    });
    
    
    submit.click(function(e) {
        
        e.preventDefault();
        
        errors = 0;
        
        fnValidate();
        
        if (!errors) $(this).closest('form').submit();
        
    });  
  
});
