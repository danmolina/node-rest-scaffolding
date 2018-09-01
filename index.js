/*
 * Primary file for the Restful API
 */

// Dependencies
var http            = require('http');
var url             = require('url');
var config          = require('./config');

// Instatiate the HTTP server
var httpServer = http.createServer(function(req, res) {
    // Get hte URL and parse it
    var parsedUrl = url.parse(req.url, true);

    // Get the path
    var path = parsedUrl.pathname;
    var trimedPath = path.replace(/^\/+|\/+$/g, '');

    // Choose the handler this request should go to.
    // If one is not found, use the notFound handler
    var chosenHandler = typeof(router[trimedPath]) !== 'undefined'
        ? router[trimedPath] : handlers.notFound;

    // Construct the data object to send to the handlers
    var data = {};

    // Route the request to the handler specified in the router
    chosenHandler(data, function(statusCode, payload) {
        // Use the status code called back by the handler, or default to 200
        statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

        // Use the payload called back by the handler, or default to an empty object
        payload = typeof(payload) == 'object' ? payload : {};

        // Convert the payload to a string
        var payloadString = JSON.stringify(payload);

        // Return the response
        res.setHeader('Content-Type', 'application/json');
        res.writeHead(statusCode);
        res.end(payloadString);

        // Log the request path
        console.log('Returning this response: ', statusCode, payloadString);
    });
});

// Start the HTTP server
httpServer.listen(config.httpPort, function() {
    console.log('The server is listening on port ' + config.httpPort);
});

// Define the handlers
var handlers = {};

// Hello handler
handlers.hello = function(data, callback) {
    callback(200, { 'message': 'Hello World! This is a nodejs REST API scaffholding'});
};

// Ping handler
handlers.ping = function(data, callback) {
    callback(200);
};

// Not found handler
handlers.notFound = function(data, callback) {
    callback(404);
};

// Define a request router
var router = {
    'ping':     handlers.ping,
    'hello':    handlers.hello
};
