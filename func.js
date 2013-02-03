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