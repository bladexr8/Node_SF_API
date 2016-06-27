// test app using nforce SF REST API Wrapper

var nforce = require('nforce');

// load credentials from external module
// references credentials.js which contains SF credentials for org
// source code package contains template of this file (credentials_copy.js)
var credentials = require('./credentials.js');

// create SF connection
console.log('***Creating Salesforce Connection...');
var org = nforce.createConnection({
	clientId: credentials.sf_credentials.clientId,
	clientSecret: credentials.sf_credentials.clientSecret,
	redirectUri: 'https://localhost:3000/oauth/_callback',
	apiVersion: '37.0',
	environment: 'production',
	mode: 'multi'
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
	} else {
		console.error('***Login Error Occurred: ' + err);
	}
});
