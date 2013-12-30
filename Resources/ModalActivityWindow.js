function ModalActivityWindow() {
    var ActivityIndicator = require("/ActivityIndicator");
    var actInd = new ActivityIndicator();
    var win = Ti.UI.createWindow({
        opacity: .7,
        backgroundColor: "black",
        navBarHidden: true
    });
    win.add(actInd);
    win.addEventListener("open", function() {
        actInd.show();
    });
    win.addEventListener("close", function() {
        actInd.hide();
    });
    return win;
}

module.exports = ModalActivityWindow;