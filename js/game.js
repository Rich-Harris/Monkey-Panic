var MonkeyPanic = function () {};

MonkeyPanic.prototype = {
	init: function () {
		var self = this;
		// any random shit goes in here for now...

		this.el = document.getElementById( 'game' );
		this.defaultState = this.el.innerHTML;

		this.score = 0;

		this.reset();

		this.width = this.canvas.clientWidth,
		this.height = this.canvas.clientHeight,

		this.canvasOffset = {
			left: game.canvas.getClientRects()[0].left,
			top: game.canvas.getClientRects()[0].top
		}
		
		// shim layer with setTimeout fallback
	    window.requestAnimFrame = (function(){
			return window.oRequestAnimationFrame	|| 
			window.webkitRequestAnimationFrame		|| 
			window.mozRequestAnimationFrame			|| 
			window.oRequestAnimationFrame			|| 
			window.msRequestAnimationFrame			|| 
			function( callback ){
				window.setTimeout(callback, 1000 / 60);
			};
	    })();


	    // loadSounds
	    soundManager.onready(function() {
			var bgSound = soundManager.createSound({
				id: 'background',
				url: 'assets/sounds/mp3/savannah.mp3',
				autoLoad: true,
				autoPlay: false,
				onload: function() {
					bgSound.play({
						loops: 999
					});
				},			
				volume: 100
			});

			self.assets.monkeyScreech = soundManager.createSound({
				id: 'screech',
				url: 'assets/sounds/mp3/screech.mp3',
				autoLoad: true,
				volume: 100
			})
		});


		window.addEventListener( 'click', function ( event ) {
			self.click.call( self, event );
		}, false );
	},

	reset: function () {
		this.score = 0;
		this.newRound();
	},

	newRound: function () {
		this.el.innerHTML = this.defaultState;

		this.status = document.getElementById( 'status' );
		this.timerText = document.getElementById( 'timerText' );
		this.timerBar = document.getElementById( 'timerBar' );
		this.youLose = document.getElementById( 'youLose' );
		this.scoreCounter = document.getElementById( 'score' );
		this.endScore = document.getElementById( 'endScore' );

		this.scoreCounter.innerHTML = this.score;
		
		this.canvas = document.getElementById( 'foreground' );
		this.canvas.width = game.width;
		this.canvas.height = game.height;
		this.ctx = this.canvas.getContext( '2d' );

		this.tigers = [];
		this.monkeys = [];
		this.numPenalties = 0;

		this.timerRunning = true;
	},

	start: function () {
		var
			i
		;

		this.numTigers = 1;
		this.numMonkeys = Math.floor( Math.random() * ( config.maxMonkeys - config.minMonkeys ) + config.minMonkeys );

		// Create an x by x grid, where x is the number of monkeys
		// This allows us to position actors randomly without them brushing up against each other
		this.createGrid();

		this.placeTigers();
		this.placeMonkeys();

		this.startTime = new Date().getTime();
		this.duration = config.duration;
		this.loop();
	},

	createGrid: function () {
		var
			i, x, y
		;

		this.availableSpaces = [];
		for ( i=0; i<( this.numMonkeys * this.numMonkeys ); i+=1 ) {
			this.availableSpaces[i] = i;
		}

		this.squareWidth = this.width / this.numMonkeys;
		this.squareHeight = this.height / this.numMonkeys;

		this.ctx.strokeStyle = 'rgba(0,0,0,0.1)';

		// temp
		for ( x=1; x<=this.numMonkeys; x+=1 ) {
			this.ctx.beginPath();
			this.ctx.moveTo( x * ( this.canvas.width / this.numMonkeys ), 0 );
			this.ctx.lineTo( x * ( this.canvas.width / this.numMonkeys ), this.canvas.height );
			this.ctx.closePath();
			this.ctx.stroke();
		}

		for ( y=1; y<=this.numMonkeys; y+=1 ) {
			this.ctx.beginPath();
			this.ctx.moveTo( 0, y * ( this.canvas.height / this.numMonkeys ) );
			this.ctx.lineTo( this.canvas.width, y * ( this.canvas.height / this.numMonkeys ) );
			this.ctx.closePath();
			this.ctx.stroke();
		}
	},

	placeTigers: function () {
		for ( i=0; i<this.numTigers; i+=1 ) {
			// Pick a random square from the available squares
			square = this.getRandomSquare();
			coords = this.getRandomCoords( square );	

			this.tigers[this.tigers.length] = new Tiger( {
				game: this,
				coords: coords
			} );
		}
	},

	placeMonkeys: function () {
		for ( i=0; i<this.numMonkeys; i+=1 ) {
			// Pick a random square from the available squares
			square = this.getRandomSquare();
			coords = this.getRandomCoords( square );	

			this.monkeys[this.monkeys.length] = new Monkey( {
				game: this,
				coords: coords
			} );
		}
	},

	getRandomSquare: function () {
		var
			random,
			square = {}
		;

		random = Math.floor( Math.random() * this.availableSpaces.length );

		square.i = this.availableSpaces.splice( random, 1 );
		square.x = square.i % this.numMonkeys;
		square.y = Math.floor( square.i / this.numMonkeys );

		return square;
	},

	getRandomCoords: function ( square ) {
		var
			minX = ( square.x + config.gridPadding.x ) * this.squareWidth,
			minY = ( square.y + config.gridPadding.y ) * this.squareHeight
		;

		return {
			x: Math.floor( Math.random() * ( this.squareWidth * ( 1 - ( 2 * config.gridPadding.x ) ) ) ) + minX,
			y: Math.floor( Math.random() * ( this.squareHeight * ( 1 - ( 2 * config.gridPadding.y ) ) ) ) + minY
		}
	},

	loop: function () {
		var
			self = this
		;

		this.elapsed = new Date().getTime() - this.startTime;
		this.timeRemaining = this.duration - ( this.elapsed + ( this.numPenalties * config.missPenalty ) );

		if ( this.timerRunning ) {
			if ( this.timeRemaining < 0 ) {
				this.lose();
			} else {
				requestAnimFrame( function () {
					self.loop();
				} );
				
				this.updateTimer();

				this.updateMonkeys();
			}
		}
	},

	updateMonkeys: function () {
		var
			i,
			monkey
		;

		for ( i=0; i<this.monkeys.length; i+=1 ) {
			monkey = this.monkeys[i];
			monkey.update();
		}
	},

	updateTimer: function () {
		this.timerText.innerHTML = ( this.timeRemaining / 1000 ).toFixed( 1 );
		this.timerBar.style.width = ( ( this.timeRemaining / this.duration ) * 100 ) + '%';
	},

	lose: function () {
		this.endScore.innerHTML = this.score;
		this.youLose.style.display = 'block';

		if ( this.assets.monkeyScreech ) {
			this.assets.monkeyScreech.play();
		}
	},

	win: function () {
		var
			self = this
		;

		this.levelScore = Math.round( config.survivalScore + ( this.timeRemaining * config.timeBonus ) );

		this.score += this.levelScore;

		this.timerRunning = false;

		setTimeout( function () {
			self.newRound();
			self.start();
		}, 500);
	}
};