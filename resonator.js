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

    this.raw = [];

    function setArray(r) { this.raw = r; }

    
    this.go = function(resonatorNative) {
        this.allResonators = [];
        setArray(resonatorNative);
        for(var p in this.raw) {
            var curRes = new resonator(p);
            for(var q in curRes) {
                
            }
        }
    };
};

resonatorArrayFactory.create = function(resonatorNative) {
    return new resonatorArrayFactory().go(resonatorNative);
};