function networkv1() {}

module.exports = networkv1;

networkv1.prototype.getData = function(webServiceUrl, _cb) {
    var xhr = Ti.Network.createHTTPClient();
    xhr.open("GET", webServiceUrl);
    xhr.onload = function() {
        _cb.success;
    };
    xhr.onerror = function() {
        _cb.error();
    };
    _cb.start() && _cb.start();
    xhr.setTimeout = 6e4;
    xhr.send();
};

networkv1.prototype.postData = function() {};

networkv1.prototype.isWebserviceAvailable = function() {};