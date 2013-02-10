(function ctor() {
    window.mapAccessor = [];
    window.markers = [];
    window.allPortals = [];

    window.oldMapConstructor = google.maps.Map;
    window.oldMapMarker = google.maps.Marker;

    google.maps.Map = function (arg, opts) {
        console.log("Grabbing map instance.");
        map = new window.oldMapConstructor(arg, opts);
        window.mapAccessor = map;
        return map;
    };

    google.maps.Marker = function (pos, title) {
		var marker = new window.oldMapMarker(pos, title);
		window.markers.push(marker);
		return marker;
    };

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

function portalAlreadyCaptured(portal) {
    for(var per in window.allPortals) {
	var p = window.allPortals[per];
		if (p.guid == portal.guid) {
			console.log("Already captured");
			return true;
		}
    }

    return false;
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

    if (!portalAlreadyCaptured(p)) {
		window.allPortals.push(p);
    }
};