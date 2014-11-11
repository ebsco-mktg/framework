/*
 * EIS global module
 * 
 * Methods:
 * 		loadScript 	: loads any one-off script
 *      loadOnce 	: passes through a window obj; if obj does not yet exist will load appropriate script
 * 
 * 
 * Changelog:
 * 
 * 2014-09-29 : added 'JSON' type for browsers that do not have built-in JSON support (using json2.js from D.Crockford)
 * 2014-08-nn : added 'VALIDATE' type (custom form validation module)
 *              added 'LEAD' type for calling LEAD module (leadtracking setting cookie to 'ebsco.com' domain)
 * 2014-07-nn : initial creation with jQuery, $f, GOOGLE types
 * 
 */


var EIS = (function (pub) {
	
	var libraryList = {
			token : [ 
				'jQuery', 
				'$f',
				'GOOGLE', 
				'LEAD',
				'VALIDATE',
				'JSON',
				'FL' ],
			source : [ 
				'//www.ebsco.com/apps/global/vendor/jquery-1.9.1.min.js', 
				'//www.ebsco.com/apps/global/vendor/froogaloop.js',
				'//www.ebsco.com/apps/global/ada/js/source/mod_google.js?20140822',
				'//www.ebsco.com/apps/global/leadtracking.ugly.js?20140929',
				'//www.ebsco.com/apps/global/ada/js/source/mod_validate.js?20140822',
				'//www.ebsco.com/apps/global/vendor/json2.ugly.js',
				'//www.ebsco.com/apps/global/ada/js/source/mod_frameloop.js?20141016' ]
		},
		libraryLength = libraryList.token.length;
		
	pub.loadScript = function ( srcFile, callback ) {
		var doc = document,
			script = doc.createElement('script'),
		
			/*
			 * if srcFile string has '//' check the first part to our list of ebsco domains
			 * otherwise, string is something like '/somepath' so assume ok (relative to server)
			 * 
			 * basically being paranoid on the very off chance someone finds a way to inejct and call this fn
			 */
			hasDomain = (srcFile.split('//')).length > 1,
			srcDomain = '';
		
		if ( hasDomain ) {
			scrDomain = (srcFile.split('//')[1]).split('/')[0];
		}
		
		
		
		
		
		script.type = 'text/javascript';
		script.src = srcFile;
		
	    if (callback && typeof(callback) === 'function') {
		    // HT: http://www.nczonline.net/blog/2009/06/23/loading-javascript-without-blocking
		    if ( script.readyState ) {  //IE
		        script.onreadystatechange = function() {
		            if ( script.readyState == "loaded" || script.readyState == "complete" ) {
		                script.onreadystatechange = null;
		                callback();
		            }
		        };
		    } else {  //Others
		        script.onload = function() {
		            callback();
		        };
		    }
	    }

		doc.getElementsByTagName('head')[0].appendChild(script);
		
	};
	
	pub.loadOnce = function ( jsLibrary, callback ) { 
		
		var i = 0;
		
		if ( libraryList.token.length !== libraryList.source.length ) {
			window.console && console.error('libraryList token and source lengths do not match');
			return false;
		}

		for ( ; i < libraryLength; i++ ) {
			if ( libraryList.token[i] === jsLibrary ) {
				if ( !(eval('window.' + libraryList.token[i])) ) {
					pub.loadScript( libraryList.source[i], callback );
				} else {
					if (callback && typeof(callback) === 'function') {
						callback.apply( this, arguments );
					}
				}
			}
		}
	};
	
	// this really has no point ...
	pub.init = (function( callback ) {
			// if needing callbacks...
			if (callback && typeof(callback) === 'function') {
				callback.apply( this, arguments );
			}
	});

	return pub;
}(EIS || {}));

