(function ctor() {
    window.mapAccessor = [];
    window.neutralNodes = [];
    window.latitudes = [];
    window.longitudes = [];
    
    window.oldMapConstructor = google.maps.Map;

    google.maps.Map = function (arg, opts) {
        console.log("Grabbing map instance.");
        map = new window.oldMapConstructor(arg, opts);
        window.mapAccessor = map;
        return map;
    }    
})();

(function findInjectee(elem) {
    var scripts = document.getElementsByTagName('script');
    for(var i=0, script; script = scripts[i]; i++) {
        if (/gen_dashboard/.test(script.src)) {
            getJsFile(script);
        }
    }
})();
  
    
function getJsFile(elem) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', elem.src);

    xhr.onreadystatechange=function() {
        if (xhr.readyState == 4) {
            locateFunction(this.responseText);
        }
    }

    xhr.send(null);
}


function locateFunction(xhr) {
    var f;
    try {
        f = new functionFactoryByKey(xhr, "zIndex:2").create();
    } catch (e) {
        console.log("ERROR: " + e);
        throw e;
    }
    
    var strToInject = "handlePortal(" + f.getArguments() + ");\r\n";
   
    f.injectAtEndOfFunction(strToInject);
            
    window[f.getName()] = new Function(f.getArguments(), f.getBody());
};

function handlePortal(s) {
    var portalDefinition;
    var stck = [];
    for (var prop in s) {
        if (s[prop].hasOwnProperty('isCaptured')) {
            portalDefinition = s[prop];
            break;
        }       
    }
    
    var p = portalFactory.create(portalDefinition);
    console.log(p);
}


/*
  obj.d contains the following fields:
      Hb/Ib      : location  (lat/lon)
      Q          : Array of mods
      Y          :
        Y.L      : owner
      e          : Portal level?
      isCaptured : Is this portal captured?
      v          : Array of resonators

*/
