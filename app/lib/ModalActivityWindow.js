function ModalActivityWindow() {
	var ActivityIndicator = require('/ActivityIndicator');
	var actInd = new ActivityIndicator();

	var win = Ti.UI.createWindow({
		opacity: 0.7,
		backgroundColor: 'black',
		navBarHidden: true,
	});
	
	win.add(actInd);
	win.addEventListener('open', function(e) {
		actInd.show();
	});
	
	win.addEventListener('close', function(e) {
		actInd.hide();
	});
	
	return win;
};

module.exports = ModalActivityWindow;
