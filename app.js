// test app using nforce SF REST API Wrapper

// nforce module reference
var nforce = require('nforce');

// nforce metadata plugin reference
require('nforce-metadata')(nforce);

// load credentials from external module
// references credentials.js which contains SF credentials for org
// source code package contains template of this file (credentials_copy.js)
var credentials = require('./credentials.js');

// underscore module reference
var _ = require('underscore');

// api version we are interested in
const API_VERSION= '37.0'

// create SF connection
console.log('***Creating Salesforce Connection...');
var org = nforce.createConnection({
	clientId: credentials.sf_credentials.clientId,
	clientSecret: credentials.sf_credentials.clientSecret,
	redirectUri: 'https://localhost:3000/oauth/_callback',
	apiVersion: API_VERSION,
	environment: 'production',
	mode: 'multi',
	metaOpts: { // options for nforce-metadata
		interval: 2000
	},
	plugins: ['meta'] // loads the plugin in this connection
});

// multi user mode login
console.log('***Authenticating User...');
var oauth;
org.authenticate({
	username: credentials.sf_credentials.username,
	password: credentials.sf_credentials.password
}, function(err, resp) {
	// store oauth object for user
	if (!err) {
		oauth = resp;
		console.log('***Authentication Successful...');
		console.log('***Access Token = ' + oauth.access_token);
		printMetadata();
	} else {
		console.error('***Login Error Occurred: ' + err);
	}
});


// print a list of metadata
function printMetadata() {
	console.log('***Retrieving List of Metadata...');
	org.meta.listMetadata({
		oauth: oauth,
		queries: [
			{ type: 'CustomObject' },
			{ type: 'CustomField' },
			{ type: 'ApexClass' }
		]
	}).then(function(meta) {
		console.log('***Displaying Metadata List...');
		_.each(meta, function(r) {
			console.log(r.type + ': ' + r.fullName + ' (' + r.fileName + ')');
		});
	}).error(function(err) {
		console.error('***Error Retrieving Metadata - ' + err);
	});
	

	org.meta.describeMetadata({
		oauth: oauth,
		apiVersion: API_VERSION
	}).then(function(meta) {
		_.each(meta, function(r) {
			console.log('***Displaying Metadata Descriptions...');
			//console.log(r.type + ': ' + r.fullName + ' (' + r.fileName + ')');
			console.log(r);
		});
	}).error(function(err) {
		console.error('***Error Describing Metadata - ' + err);
	});
}
