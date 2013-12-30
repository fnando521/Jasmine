function ActivityIndicator() {
    var ActInd = Ti.UI.createActivityIndicator({
        message: " Loading...",
        color: "white",
        style: Ti.UI.iPhone.ActivityIndicatorStyle.BIG
    });
    return ActInd;
}

module.exports = ActivityIndicator;