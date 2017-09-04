var express = require('express');
var app = express();
var fs = require('fs');
var morgan = require('morgan');
var httpProxy = require('http-proxy');
var apiProxy = httpProxy.createProxyServer();

var accessLogStream = fs.createWriteStream(__dirname + '/logs/access.log', {
	flags: 'a'
});
app.use(morgan('combined', { stream: accessLogStream }));

/*
  s1: company: 3001
  s2 : order : 3002
  s3 : lr: 3003
*/

var dev = [
	{ server: 'http://localhost:3001' },
	{ server: 'http://localhost:3002' },
	{ server: 'http://localhost:3003' }
];
var staging = [
	{ server: 'http://localhost:3001' },
	{ server: 'http://localhost:3002' },
	{ server: 'http://localhost:3003' }
];

app.all('/v1/company-ms/*', function(req, res) {
	console.log('redirecting to service1');
	apiProxy.web(req, res, { target: dev[0].server });
});

app.all('/v1/order-ms/*', function(req, res) {
	console.log('redirecting to service2', dev[1].server);
	apiProxy.web(req, res, { target: dev[1].server });
});

app.all('/v1/lr-ms/*', function(req, res) {
	console.log('redirecting to service3');
	apiProxy.web(req, res, { target: dev[2].server });
});

app.listen(3000);
