

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
