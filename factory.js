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