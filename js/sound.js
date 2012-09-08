var initSoundManager = function () {
	soundManager.url = 'vendor/soundmanager2/swf/';
	soundManager.flashVersion = 9; // optional: shiny features (default = 8)
	soundManager.preferFlash = false;
	soundManager.useHTML5Audio = true; // optionally, enable when you're ready to dive in
	/*
	 * read up on HTML5 audio support, if you're feeling adventurous.
	 * iPad/iPhone and devices without flash installed will always attempt to use it.
	*/

	soundManager.onerror = function(status) { game.status.innerHTML = 'SoundManager failed to load: ' + status.type; };
}