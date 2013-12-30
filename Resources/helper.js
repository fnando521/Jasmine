exports.displayError = function(message) {
    var alertDialog = Ti.UI.createAlertDialog({
        title: "Oops!",
        message: message,
        buttonNames: [ "OK" ],
        cancel: 0
    });
    alertDialog.show();
};

exports.computeSum = function(a, b) {
    return a + b;
};