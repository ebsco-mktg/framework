/* frame-loop */
var FL = (function ( pub ) {

	var frameCount = 0,
		fps = 0,
		lastTime = +(new Date()),
		fpsContainer = null,
		winpos = 0,
		showFPS = true;
	
	// calc current number of frames per second
	var measureFPS = function(){
		var newTime = +(new Date()),
			diffTime = newTime - lastTime; //calculate the difference between last & current frame

		if (diffTime >= 1000) {
			fps = frameCount;
			frameCount = 0;
			lastTime = newTime;
		}

		fpsContainer.innerHTML = 'FPS: ' + fps; //and display it in an element we append to the document in start() function
		frameCount++;
	};
	
	//main function, called each frame
	var mainLoop = function(){
		
		// writes framerate to the browser window
		if ( showFPS ) {
			measureFPS();
		}

		//var parallaxElem = LAZY.getElementsByClassName( document.documentElement, 'fnParallax' ),
			//parallaxElemLength = parallaxElem.length;

		// enable parallax
		//if ( parallaxElemLength > 0 ) {
			//setupParallax(parallaxElem);
		//}
		
		loop(mainLoop);
	};

	// use requestAnimationFrame or use setTimeout as a fallback
	var loop = (function(){
		return window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function(callback, element){
			window.setTimeout(callback, 1000 / 60);
		};
		
		
	})();

	/*
	 * if the password field has a value 
	 * 			but NOT triggered by user clicking field (label gets class hasValue when clicking in), 
	 * 			then push the label out
	 * handles case of when browser autopops password based on username value
	 */
	pub.checkPasswordEntry = function() {
		if ( ($('#loginform').length === 1) ) {
			if ( $('#password').val() !== '' ) {
				if ( $('#password').prev('label')[0].className !== 'hasValue' ) {
					VALIDATE.moveLabel( $('#password') );
					// window.console && console.log ('should cancel fl');
				}
			}
		}
	};


	
	// will pass through a cb fn that runs every frame loop
	pub.eachFrame = function( callback ) {
		if (callback && typeof(callback) === "function") {
			//window.console && console.log( 'eachFrame callback: ', callback );
			// take the cb fn and now add it to a new fn exp (thisCB)
			var thisCB = (function() {
				//window.console && console.log('inner');
				callback.apply(this, arguments);
				loop(thisCB);
			});
			// window.console && console.log( 'thisCB: ', thisCB );
			//window.console && console.log('outer');
			// we need to now call the updated thisCB fn, which in turn will loop each frame
			loop(thisCB);
		}
	};
	
	pub.start = function(){
		if ( showFPS ) {
			window.console && console.log( 'creating fps' );
			fpsContainer = document.createElement('div');
			fpsContainer.className += "fps-container";
			document.body.appendChild(fpsContainer);
		}
		
		loop( mainLoop );
	};

	return pub;
}(FL || {}));


