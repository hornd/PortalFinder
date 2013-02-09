function resonator(raw) {
    this.raw = raw;
    this.level = -1;
    this.owner = "";
    this.guid = "";
}

resonator.prototype = (function() {
    return {
        constructor:resonator,
        
        setLevel:function(lev) { this.level = lev; },
        getLevel:function() { return this.level; },
        
        setOwner:function(own) { this.owner = own; },
        getOwner:function() { return this.owner; },
        
        setGuid:function(id) { this.guid = id; },
        getGuid:function() { return this.guid; }
    };
})();

function resonatorArrayFactory() {

    this.raw = [];

    function setArray(r) { this.raw = r; }

    this.go = function(resonatorNative) {
        setArray(resonatorNative);
    };
};

resonatorArrayFactory.create = function(resonatorNative) {
    return new resonatorArrayFactory().go(resonatorNative);
};