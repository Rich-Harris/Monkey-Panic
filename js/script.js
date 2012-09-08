var game;


var touchReport = function ( event ) {
	var
		touches = event.touches,
		touch = touches[ 0 ],

		x = touch.screenX,
		y = touch.screenY,

		tigerPos = game.tigers[ 0 ].position,

		dx = tigerPos.x - x,
		dy = tigerPos.y - y,
		d = Math.sqrt( ( dx * dx ) + ( dy * dy ) )
	;

	event.preventDefault();

	game.status.innerHTML = ( d <= config.targetRadius ) ? 'Spotted it!' : 'Distance from tiger: ' + Math.floor( d );

	if ( d <= config.targetRadius ) {
		newGame();
	}
};

var ready = function () {
		
	game = new MonkeyPanic();

	game.loadAssets( function () {
		game.init();
		game.start();
	} );
}
