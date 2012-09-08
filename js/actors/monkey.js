var Monkey = function ( o ) {
	this.game = o.game;
	this.position = o.coords;
	
	this.init();
};

Monkey.prototype = {
	init: function () {
		// start pointing or not?
		var
			pointing = Math.round( Math.random() )
		;

		// this.el = document.createElement( 'div' );
		this.el = document.createElement( 'canvas' );
		this.el.classList.add( 'monkey' );
		this.el.width = this.el.height = ( 2 * config.monkeyRadius );

		this.move();

		this.game.el.appendChild( this.el );

		this.ctx = this.el.getContext( '2d' );

		this.center = {
			x: config.monkeyRadius,
			y: config.monkeyRadius
		}

		this.nearestTiger = this.findNearestTiger();

		this.radius = config.monkeyRadius;

		this.queue = [];

		if ( pointing ) {
			this.startPointing();
		}

		else {
			this.stopPointing();
		}
	},

	startPointing: function () {
		this.pointing = true;
		this.queue[ this.queue.length ] = {
			time: ( new Date().getTime() + ( this.game.getRandomIntermediatePoint( config.pointTimeMin, config.pointTimeMax ) ) ),
			fn: this.stopPointing
		};
		this.render();
	},

	stopPointing: function () {
		this.pointing = false;
		this.queue[ this.queue.length ] = {
			time: ( new Date().getTime() + ( this.game.getRandomIntermediatePoint( config.nonPointTimeMin, config.nonPointTimeMax ) ) ),
			fn: this.startPointing
		};
		this.render();
	},

	render: function () {
		
		// clear
		this.ctx.clearRect(0, 0, ( 2 * config.monkeyRadius ), ( 2 * config.monkeyRadius ) );

		// draw circle
		this.ctx.fillStyle = 'rgba(0,200,0,0.7)';

		this.ctx.arc( this.center.x, this.center.y, 20, 0, Math.PI * 2 );
		this.ctx.fill();

		// point
		if ( this.pointing ) {
			this.point();
		}
		
	},

	point: function () {
		var
			dx = this.nearestTiger.position.x - this.position.x,
			dy = this.nearestTiger.position.y - this.position.y,

			angle = Math.atan2( dy, dx ),

			end = {
				x: config.armLength * Math.cos( angle ),
				y: config.armLength * Math.sin( angle )
			}
		;

		this.ctx.beginPath();
		this.ctx.moveTo( this.center.x, this.center.y );
		this.ctx.lineTo( this.center.x + end.x, this.center.y + end.y );
		this.ctx.closePath();
		this.ctx.stroke();
	},

	runAway: function () {

	},

	tap: function () {
		
	},

	move: function () {
		this.el.style.left = ( this.position.x - config.monkeyRadius ) + 'px' ;
		this.el.style.top = ( this.position.y - config.monkeyRadius ) + 'px' ;
	},

	findNearestTiger: function () {
		var
			i,
			tiger,
			distance,
			closest,
			nearestTiger
		;

		for ( i=0; i<this.game.tigers.length; i+=1 ) {
			tiger = this.game.tigers[i];
			distance = this.game.getDistance( this.position.x, this.position.y, tiger.position.x, tiger.position.y );

			if ( !closest || ( distance < closest ) ) {
				nearestTiger = tiger;
			}
		}

		return nearestTiger;
	},

	update: function () {
		if ( this.queue.length ) {
			if ( new Date().getTime() > this.queue[0].time ) {
				this.queue.shift().fn.call( this );
			}
		}
	}
};
