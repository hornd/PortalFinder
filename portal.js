TEAM = { GREEN : "GREEN", BLUE: "BLUE", NEUTRAL: "NEUTRAL" };

function portal(portalNative) {   
    this.level = -1;
    
    this.team = TEAM.NEUTRAL;
    
    this.lat = -1;
    this.lon = -1;
    this.title = "";
    this.guid = "";
    
    this.resonators = [];
    this.numShields = -1;
    
    this.raw = portalNative;
};

portal.prototype = (function() {
    return {
        constructor:portal,
    };
})();


function portalFactory() {
    this.portal_ = {};
    this.raw = {};
    
    function setPortal(r) { this.raw = r; this.portal_ = new portal(r); }
    function getPortal() { return this.portal_; }
    
    function doLatLon(possibleValues) {
        if (possibleValues.length != 2) {
            throw "Error gathering portal lat/lon";
        };
        
        var curLoc = window.mapAccessor.getCenter();
        
        if (curLoc.lat() - possibleValues[0] < curLoc.lat() - possibleValues[1]) {
            this.portal_.lat = possibleValues[0];
            this.portal_.lon = possibleValues[1];
        } else {
            this.portal_.lat = possibleValues[1];
            this.portal_.lon = possibleValues[0];
        }
   
    };
    
    function findTeam(curVal) {
		for(var p in curVal) {
			if (curVal[p] === "Resistance") {
				this.portal_.team = TEAM.BLUE;
			} else if (curVal[p] == "Enlightened") {
				this.portal_.team = TEAM.GREEN;
			}
		}
    }
            
    function isResonatorArray(curVal) {
        var isMod = false;

        for(var n in curVal[0]) {
            if (n === "name") {
                isMod = true;
            }
        }
        
        return !isMod;
    }
                
    function pull() {
        possibleLatLonValues = [];
                
        Object.keys(this.raw).forEach(function(key) {  
            var curVal = this.raw[key];
            if (typeof curVal === "number" && curVal % 1 != 0) {
                possibleLatLonValues.push(curVal);
            } else if (typeof curVal === "string" && curVal.indexOf(' ') == -1 && curVal.length == 35) {
                this.portal_.guid = curVal;
            } else if (typeof curVal === "number" && curVal <= 8) {
                this.portal_.level = curVal;
            } else if (curVal != null && typeof curVal === 'object') {
				findTeam(curVal);
			} else if (Object.prototype.toString.call(curVal) == '[object Array]' && curVal.length > 0) {
                if (isResonatorArray(curVal)) {
                    this.portal_.resonators = resonatorArrayFactory.create(curVal);
                } else {
                    this.portal_.numShields = curVal.length;
                }
            }
        });
       
        this.portal_.title = this.raw.title;

        doLatLon(possibleLatLonValues);
        
    };

    this.go = function(portalNative) {
        setPortal(portalNative);
        pull();
        return getPortal();
    };
};

portalFactory.create = function(portalNative) {
    return new portalFactory().go(portalNative);
};