
function checkNetworkConnectivity() {
	var error = false;
	if(Ti.Network.networkType == Ti.Network.NETWORK_NONE) {
		var helper = require('/helper');
		helper.displayError('Please check your network connectivity.');
		error = true;
	}
	return error;
}
/*
function saveJobsData(data)
{
	for (var i = 0; i < data.JOBS.length; i++) {
		Alloy.createModel('Job', {
			title : data.JOBS[i].TITLE,
			posted : data.JOBS[i].POSTED,
			due : data.JOBS[i].DUE,
			grade : data.JOBS[i].GRADE,
			salFrom : data.JOBS[i].SALFROM,
			salTo : data.JOBS[i].SALTO,
			employmentType : data.JOBS[i].EMPLOYMENTTYPE,
			ptPercent : data.JOBS[i].PTPERCENT,
			appointmentType : data.JOBS[i].APPOINTMENTTYPE,
			publicDisplay : data.JOBS[i].PUBLICDISPLAY,
			travelPercent : data.JOBS[i].TRAVELPERCENT,
			workWeek : data.JOBS[i].WORKWEEK,
			hours : data.JOBS[i].HOURS,
			street : data.JOBS[i].STREET,
			city : data.JOBS[i].CITY,
			state : data.JOBS[i].STATE,
			zip : data.JOBS[i].ZIP,
			category : data.JOBS[i].CATEGORY,
			bu : data.JOBS[i].BU,
			agency : data.JOBS[i].AGENCY,
			jobUrl : data.JOBS[i].JOBURL
		}).save();
	}
	return true;
}

function deleteJobCollection()
{
	var jobCollection = Alloy.createCollection('Job');
	jobCollection.fetch();
	
	var i = jobCollection.length-1;

	// Removing models must be done in reverse order otherwise
	// only half of the collection is deleted because of re-indexing
	for(i; i>0; i--) {
		var model = jobCollection.models[i].toJSON();
		var modelToDelete = jobCollection.get(model.alloy_id);
		modelToDelete.destroy();
	}
}
*/

exports.getNews = function(webServiceUrl, _cb) {
	
	if(!checkNetworkConnectivity()) {
		
		var xhr = Titanium.Network.createHTTPClient();
		xhr.open("GET", webServiceUrl);
		xhr.onload = function() {
			if(_cb.success) 
			{
				//deleteJobCollection();

				//if(saveJobsData(JSON.parse(this.responseText)) == true) 
				//{
					
					//Ti.API.info(this.responseText);
					_cb.success(this.responseText);
				//}
			}
		};
		xhr.onerror = function(e) {
			
			alert(e.error);
			
			var helper = require('/helper');
			helper.displayError('The request has taken longer than expected.');

			_cb.error();
		};
		
		if (_cb.start)
		{ 
			_cb.start(); 
		}
	
		xhr.setTimeout = 60000;
		xhr.send();
	}
	else {
		_cb.error();
	}
};
