var Tiger = function ( o ) {
	this.game = o.game;
	this.position = o.coords;

	this.init();
};

Tiger.prototype = {
	init: function () {
		this.radius = config.tigerRadius;

		this.el = document.createElement( 'canvas' );
		this.el.classList.add( 'tiger' );
		this.el.width = this.el.height = ( 2 * this.radius );

		this.game.el.appendChild( this.el );

		this.move();

		this.ctx = this.el.getContext( '2d' );

		this.center = {
			x: config.tigerRadius,
			y: config.tigerRadius
		}
	},

	move: function () {
		this.el.style.left = ( this.position.x - config.tigerRadius ) + 'px' ;
		this.el.style.top = ( this.position.y - config.tigerRadius ) + 'px' ;
	},

	reveal: function () {
		this.ctx.fillStyle = 'rgba(200,0,0,0.7)';
		this.ctx.arc( this.center.x, this.center.y, 20, 0, Math.PI * 2 );
		this.ctx.fill();

		this.showScore();
	},

	showScore: function () {
		var
			score = document.createElement( 'p' )
		;

		score.innerHTML = this.game.levelScore;
		score.classList.add( 'levelScore' );

		score.style.left = ( this.position.x - config.tigerRadius ) + 'px' ;
		score.style.top = ( this.position.y - config.tigerRadius ) + 'px' ;

		this.game.el.appendChild( score );
	},

	tap: function () {
		game.win();
		this.reveal();
	}
}
