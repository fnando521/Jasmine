
function networkv1()
{
	// initialize

};
module.exports = networkv1;

networkv1.prototype.getData = function(webServiceUrl, _cb) {
	//Ti.API.info('Running getData: ');
	
	// GET data from webservice
	
	/*var xhr = Ti.Network.createHTTPClient();

	xhr.open("GET", webServiceUrl);
	xhr.onload = function() 
	{
		if(_cb.success) 
		{
			//Ti.API.info('SUCCESS');
			//_cb(this.responseText);
		}
	};
	xhr.onerror = function(e)
	{
		//Ti.API.info('ERROR');
		// return error
		_cb.error();
	};
	if(_cb.start())
	{
		_cb.start();
	}
	xhr.setTimeout = 60000;
	xhr.send();*/
	
};

networkv1.prototype.postData = function(webServiceUrl, _cb) {
	
};

networkv1.prototype.isWebserviceAvailable = function(webServiceUrl, _cb) {
	
};


