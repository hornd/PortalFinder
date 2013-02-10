function resonator(raw) {
    this.raw = raw;
    this.level = -1;
}

resonator.prototype = (function() {
    return {
        constructor:resonator,
        
        setLevel:function(lev) { this.level = lev; },
        getLevel:function() { return this.level; },
    };
})();

function resonatorArrayFactory() {

    this.go = function(resonatorNative) {
        var allResonators = [];

		for(var i=0; i<resonatorNative.length; i++) {
			var possibleLevels = [];
			var p = resonatorNative[i];
			var curRes = new resonator(p);

			Object.keys(p).forEach(function(key) {
				var curVal = p[key]
				if (typeof curVal === "number" && curVal <= 8) {
					possibleLevels.push(curVal);
				}
			});

			curRes.setLevel((possibleLevels.length == 1 ? possibleLevels[0] : -1));
	    
			allResonators.push(curRes);
		}

		return allResonators;
	};
};

resonatorArrayFactory.create = function(resonatorNative) {
    return new resonatorArrayFactory().go(resonatorNative);
};