TEAM = { GREEN : "GREEN", BLUE: "BLUE", NEUTRAL: "NEUTRAL" };

function portal(portalNative) {   
    this.level = -1;
    
    this.team = TEAM.NEUTRAL;
    
    this.lat = -1;
    this.lon = -1;
    this.title = "";
    this.guid = "";
    
    this.resonators = [];
    this.mods = [];
    
    this.raw = portalNative;
};

portal.prototype = (function() {
    return {
        constructor:portal,
        
        addResonator:function(res) { 
            this.resonators.push(res);
        },
        
        addMod:function(mod) { 
            this.mods.push(mod);
        }
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
            } else if (Object.prototype.toString.call(curVal) == '[object Array]') {
                //Handle possible resonators/mods
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