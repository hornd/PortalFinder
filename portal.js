function resonator(owner, level) {
    this.owner = owner;
    this.level = level;
};

function mod(type) {
    this.type = type;
};

mod.prototype = (function() {
    var MOD_TYPES = { SHIELD: "SHIELD" }
})();
      
function portal() {
    this.MAX_RESONATORS = 8;
    this.MAX_MODS = 4;
    
    this.owner = "";
    //this.controllingTeam;
    
    this.resonators = [];
    this.mods = [];
};

portal.prototype = (function() {
    var TEAMS = { GREEN: "ENLIGHTENED", BLUE: "RESISTANCE", NEUTRAL: "NEUTRAL" };

    getPortalLevel:function() { return -1; }    
    
    addResonator:function(res) { 
        if (this.resonators.length >= this.MAX_RESONATORS) {
            throw "Could not add resonator -- maximum reached";
        }
        
        this.resonators.push(res);
    }    
})();