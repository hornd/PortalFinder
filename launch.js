function createScript(scriptName) {
    var s = document.createElement('script');
    s.src = chrome.extension.getURL(scriptName);
    return s;
};

function insertAllScripts(scriptNode) {
    scriptNode.parentNode.insertBefore(createScript('func.js'), scriptNode.nextSibling);
    scriptNode.parentNode.insertBefore(createScript('portal.js'), scriptNode.nextSibling);
    scriptNode.parentNode.insertBefore(createScript('factory.js'), scriptNode.nextSibling);
    scriptNode.parentNode.insertBefore(createScript('gather.js'), scriptNode.nextSibling);
}

document.addEventListener('DOMContentLoaded', function () {
    var scripts = document.getElementsByTagName('script');
    for (var i = 0, script; script = scripts[i]; i++) {
        if (/maps.google.com/.test(script.src) || /maps.googleapis.com/.test(script.src)) {
            if (script.nextSibling) {
                insertAllScripts(script);
                break;
            }
        }	
    }
});
