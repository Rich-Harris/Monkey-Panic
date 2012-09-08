extend( MonkeyPanic, {
	click: function ( event ) {
		var
			x = event.clientX - this.canvasOffset.left,
			y = event.clientY - this.canvasOffset.top
		;

		this.tap( x, y );
	},

	tap: function ( x, y ) {
		var
			dx,
			dy,
			dist,

			hitTarget = false,

			actor,

			i
		;

		// detect tap on tigers
		for ( i=0; i<this.tigers.length; i+=1 ) {
			actor = this.tigers[i];
			dist = this.getDistance( x, y, actor.position.x, actor.position.y );

			if ( dist < actor.radius ) {
				actor.tap( x, y );
				hitTarget = true;
			}
		}

		// detect tap on monkeys
		for ( i=0; i<this.monkeys.length; i+=1 ) {
			actor = this.monkeys[i];
			dist = this.getDistance( x, y, actor.position.x, actor.position.y );

			if ( dist < actor.radius ) {
				actor.tap( x, y );
				hitTarget = true;
			}
		}

		// if no target hit, penalise player
		if ( !hitTarget ) {
			this.numPenalties += 1;
		}
	}
} );
