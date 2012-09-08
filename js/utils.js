extend( MonkeyPanic, {
	getDistance: function ( x1, y1, x2, y2 ) {
		var
			dx = x2 - x1,
			dy = y2 - y1,
			dist = Math.sqrt( ( dx * dx ) + ( dy * dy ) )
		;

		return dist;
	},

	getRandomIntermediatePoint: function ( min, max ) {
		return min + ( Math.random() * ( max - min ) );
	},

	loadAssets: function ( callback ) {
		var
			base = 'assets/',
			assets = [
				{
					name: 'monkey',
					path: 'actors/monkey.svg'
				}
			],
			remaining = assets.length,
			self = this,
			assetLoaded = function () {
				remaining -= 1;

				if ( !remaining ) {
					callback();
				}
			},
			loadAsset = function ( name, path ) {
				var
					req = new XMLHttpRequest()
				;

				req.open(
					'GET',
					path,
					true
				);

				req.onerror = function ( event ) {
					throw ( 'Error accessing asset ' + path + ': ' + event.target.status );
				};

				req.onreadystatechange = function () {
					if ( ( req.readyState === 2 ) && ( req.status !== 200 ) ) {
						throw ( 'Error accessing asset ' + path );
					}

					if ( ( req.readyState === 4 ) ) {
						self.assets[ name ] = req.responseText;
						assetLoaded()
					}
				};

				req.send();
			},
			i
		;

		self.assets = {};

		for ( i=0; i<assets.length; i+=1 ) {
			loadAsset( assets[i].name, base + assets[i].path );
		}
	}
});