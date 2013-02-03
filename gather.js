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

/****************************************
*     func
*****************************************/
function func(f) {
    function switchOnType() {
        if (Object.prototype.toString.call(f) === '[object Array]') return f;
        else if (Object.prototype.toString.call(f) === '[object String]') return f.match(/^.*([\n\r]+|$)/gm);
        else throw "Invalid type supplied to func(...)";
    };

    this.function_ = switchOnType();
};

func.prototype = (function() {
    return {
        constructor:func,
        
        getFunction:function() { return this.function_.join(""); },
        
        getFunctionAsArray:function() { return this.function_; },
        
        getBody:function() { return this.function_.slice(1, this.function_.length-1).join("");  },
        
        injectAtEndOfFunction:function(str) {
            if (!str.match(/\r\n/)) {
                str += "\r\n";
            }
            
            this.function_.splice(this.function_.length - 1, 0, str);            
        },
        
        getName:function() {
            var funcString = this.getFunction();
            var i = funcString.indexOf(' ') + 1;
            var functionName = "";
            
            while (funcString.charAt(i) != '(' && funcString.charAt(i) != ' ') {
                functionName += funcString.charAt(i);
                i++;
            }
            
            return functionName;
        },
        
        getArguments:function() {
            var funcString = this.getFunction();
            var openParen = funcString.indexOf('(');
            var closeParen = funcString.indexOf(')');
            var arguments = [];
            var currentArgument = '';
            for(var i=openParen+1; i<closeParen; i++) {
                if (funcString.charAt(i) != ',') {
                    currentArgument += funcString.charAt(i);
                } else {
                    arguments.push(currentArgument);
                    currentArgument = '';
                }
            }
            
            arguments.push(currentArgument);
            return arguments.join();
        }
    };
})();

/****************************************
*     functionFactory
*****************************************/

function functionFactoryByKey(str, key) {
    this.split = str.match(/^.*([\n\r]+|$)/gm);
    this.key = key;
};

functionFactoryByKey.prototype = (function() {

    function findWordInstance() {
        for(var i=0; i<this.split.length; i++) {
            if (this.split[i].indexOf(this.key) != -1) {
                return i;
            }
        }
        
        throw "Error locating function containing keyword: " + this.key;
    };
  
    function findStartOfFunction(startAt) {
        for(var i = startAt; i>0; i--) {
            if (this.split[i].indexOf("function") != -1) {
                return i;
            }
        }
        
        throw "Error locating start of function!";
    };
    
    function findEndOfFunction(startAt) {
        var i = startAt;
        var openBracket = 0;
        var closeBracket = 0;
        while(i < this.split.length) {
            var curLine = this.split[i];
            for(var j=0; j<curLine.length; j++) {
                if (curLine.charAt(j) == '{') {
                    openBracket++;
                }
                if (curLine.charAt(j) == '}') {
                    closeBracket++;
                }
            }
                    
            if (openBracket == closeBracket) {
                return i;
            }
        
            i++;
        }
        
        throw "Error locating end of function!";
    };
    


    return {
        constructor:functionFactoryByKey,
                
        create:function() {
            var midFunctionIndex = findWordInstance.call(this);
            var beginFunctionIndex = findStartOfFunction.call(this, midFunctionIndex);
            var endFunctionIndex = findEndOfFunction.call(this, beginFunctionIndex);
        
            if (beginFunctionIndex >= midFunctionIndex || midFunctionIndex >= endFunctionIndex) {
                throw "Error locating function!";
            }

            return new func(this.split.slice(beginFunctionIndex, endFunctionIndex+1));
        }
    };
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
    console.log(s);
}




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