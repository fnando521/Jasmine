
exports.displayError = function(message) {
	var alertDialog = Ti.UI.createAlertDialog({
		title: 'Oops!',
		message: message,
		buttonNames: ['OK'],
		cancel: 0
	});
	alertDialog.show();
};

/*
exports.getCategoryFavorites = function() {
	var selectedCategories = '';
	var categoryCollection = Alloy.createCollection('Categories');
	categoryCollection.on('fetch', function() {
		selectedCategories = categoryCollection.where ({
			isFavorite: 1
		});
	});
	categoryCollection.fetch();
	
	return selectedCategories;
}
*/

exports.computeSum = function(a, b) {
  return a + b;
};