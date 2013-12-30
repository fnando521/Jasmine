function checkNetworkConnectivity() {
    var error = false;
    if (Ti.Network.networkType == Ti.Network.NETWORK_NONE) {
        var helper = require("/helper");
        helper.displayError("Please check your network connectivity.");
        error = true;
    }
    return error;
}

exports.getNews = function(webServiceUrl, _cb) {
    if (checkNetworkConnectivity()) _cb.error(); else {
        var xhr = Titanium.Network.createHTTPClient();
        xhr.open("GET", webServiceUrl);
        xhr.onload = function() {
            _cb.success && _cb.success(this.responseText);
        };
        xhr.onerror = function(e) {
            alert(e.error);
            var helper = require("/helper");
            helper.displayError("The request has taken longer than expected.");
            _cb.error();
        };
        _cb.start && _cb.start();
        xhr.setTimeout = 6e4;
        xhr.send();
    }
};