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
    var tmp = {};
    var stck = [];
    for (var prop in s) {
        tmp[prop] = s[prop]
        
    }
    
        console.log(tmp);
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


/*
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

function functionFactoryByKey(str) {
    this.str = str;
    this.split = str.match(/^.*([\n\r]+|$)/gm);
    this.functions = [];

    this.openBrackets = 0;
};

functionFactoryByKey.prototype = (function() {

    function parsingFunction() {
        return this.openBrackets > 0;
    };

    function updateBrackets(line) {
        for (var char in line) {
            if (char == '{') {
                this.openBrackets++;
            } else if (char == '}') {
                this.openBrackets--;
            }
        }
    };

    function parseFunctionsOut() {
        var currentFunctionString = "";
        for (var line in this.split) {
            currentFunctionString += line;
            updateBrackets(line);

            if (beginningOfFunction(line)) {
                console.log("Detected start of function");
            }
            else if (endOfFunction(line)) {
                console.log("Detected end of function");
                this.functions.push(currentFunctionString);
                currentFunctionString = "";
            }

	    console.log(line);
        }
    };

    function endOfFunction(line) {
        return !parsingFunction() && line.indexOf("}") != -1;
    };

    function beginningOfFunction(line) {
        return parsingFunction() && line.indexOf("function") != -1;
    };

    return {
        constructor:functionFactoryByKey,

        findInjectableFunction:function() {
            parseFunctionsOut.call(this);
        }
    };
})();


function injected(a) {

    google.maps.event.clearListeners(a.G, "click");
    if (!a.c.isCaptured && isNewNeutral(a)) {
	sawNewNeutral(a.c);
    }
    b = new U(a.d);
    google.maps.event.addListener(a.G, "click", t(b.show, b, a.h))
};


function getFunctionAsArrayAsArrayNameFromFullDeclaration(name) {
    var end = name.indexOf('(');
    var begin = end;

    if (end < 0) {
        alert("This is bad, abort (2)");
    }

    while(name[--begin] != ' ');
    return name.substring(begin, end).replace(/\s+/g, '');
}

function findNewFunctionName(xhr) {
    var ss = xhr;
    var indx = xhr.indexOf("zIndex:2");

    if (indx == -1) {
        alert("This is bad, abort");
        return;
    }

    var fn_str;
    for(var i = indx - 10; i>0; i-=10) {
        var fn = xhr.indexOf("function", i);
        if (fn < indx) {
            fn_str = xhr.substring(fn, fn+14);
            break;
        }
    } 

    var global_name = getFunctionAsArrayAsArrayNameFromFullDeclaration(fn_str);
    console.log("Overriding function: " + global_name);
    window[global_name] = injected;
}


function isNewNeutral(a) {
    if (a.c in window.neutralNodes) return false;
    if (a.c.Hb in window.latitudes && a.c.Ib in window.longitudes) return false;
    return true;
};

function sawNewNeutral(a) {
    console.log("Found a previously unseen neutral node");
    console.log(a);
    latitudes.push(a.Hb);
    longitudes.push(a.Ib);
};

document.addEventListener('DOMContentLoaded', function() {
    document.body.appendChild(createScript());
});

*/