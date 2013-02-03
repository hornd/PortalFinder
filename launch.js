function createScript() {
    var s = document.createElement('script');
    s.src = chrome.extension.getURL('gather.js');
    return s;
};

document.addEventListener('DOMContentLoaded', function () {
    var scripts = document.getElementsByTagName('script');
    for (var i = 0, script; script = scripts[i]; i++) {
        if (/maps.google.com/.test(script.src) || /maps.googleapis.com/.test(script.src)) {
            script.nextSibling && script.parentNode.insertBefore(createScript(), script.nextSibling);
            break;
        }	
    }
});
