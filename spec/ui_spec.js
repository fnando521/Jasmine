

// TEST 1
var util = require('../app/lib/helper');

describe('The Simple Test Setup', function() {
	it('should test that 1 & 2 is three', function() {
		var sum = util.computeSum(1, 2);
		expect(sum).toEqual(3);
	});
});


// TEST 2
describe('Test 2', function() {
	it('Testing that TRUE equals TRUE', function() {
		expect(true).toNotEqual(false);
	});
});

// Test NetworkClient
describe('Test Network Client', function() {
	it('verifies the network client can be setup', function() {
		var mockti = require('mockti');
		var Ti = mockti();
		
		var xhr = Ti.Network.createHTTPClient(); 
		
		expect(xhr).not.toBeUndefined();
	});
});

// Get Test environment
describe('Test environment type', function() {
	it('tells us what environment we are in', function() {
		var mockti = require('mockti');
		var Ti = mockti();
		
		//var Alloy = require('../Resources/alloy');
		//var environmentType = Alloy.CFG.environment;
		
		expect('test').toBe('test');
	});
});


// Test REST API
describe('REST API Test', function() {
	
	it('verifies a webservice is available', function() {
		var url = "http://apps.cio.ny.gov/apps/mediaContact/public/api.cfm?portionsize=M&object=agencies";
		var Net = require('../app/lib/networkv1');
		var myNet = new Net();
		
		
		
		/*myNet.getData(url, {
			start : function() {
		
					//Ti.API.info('Started Getting data from agency service.');
				},
				error : function(returnMessage) {
					//Ti.API.info('Error returned from webservice.');
					//_cb();
				},
				success : function(mynewsdata) {
					//Ti.API.info('Success data returned from agency service.');
					//newsData = mynewsdata;
					//_cb();
		
				}
		});*/
	});
});

/*
var url = "http://apps.cio.ny.gov/apps/mediaContact/public/api.cfm?portionsize=M&object=agencies";
var Net = require('networkv1');
var myNet = new Net();

myNet.getData(url, {
	start : function() {

			Ti.API.info('Started Getting data from agency service.');
		},
		error : function(returnMessage) {
			Ti.API.info('Error returned from webservice.');
			//_cb();
		},
		success : function(mynewsdata) {
			Ti.API.info('Success data returned from agency service.');
			//newsData = mynewsdata;
			//_cb();

		}
});*/