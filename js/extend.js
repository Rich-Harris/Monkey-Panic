var extend = function ( constr, methods ) {
	var method;

	for ( method in methods ) {
		constr.prototype[method] = methods[method];
	}	
};