

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

// Test REST API
describe('REST API Test', function() {
	it('verifies a webservice is available', function() {
		
	});
});
