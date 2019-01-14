"use strict";

/* jshint node: true */

/*
 * This builds on the webServer of previous projects in that it exports the current
 * directory via webserver listing on a hard code (see portno below) port. It also
 * establishes a connection to the MongoDB named 'cs142project6'.
 *
 * To start the webserver run the command:
 *    node webServer.js
 *
 * Note that anyone able to connect to localhost:portNo will be able to fetch any file accessible
 * to the current user in the current directory or any of its children.
 *
 * This webServer exports the following URLs:
 * /              -  Returns a text status message.  Good for testing web server running.
 * /test          - (Same as /test/info)
 * /test/info     -  Returns the SchemaInfo object from the database (JSON format).  Good
 *                   for testing database connectivity.
 * /test/counts   -  Returns the population counts of the cs142 collections in the database.
 *                   Format is a JSON object with properties being the collection name and
 *                   the values being the counts.
 *
 * The following URLs need to be changed to fetch there reply values from the database.
 * /user/list     -  Returns an array containing all the User objects from the database.
 *                   (JSON format)
 * /user/:id      -  Returns the User object with the _id of id. (JSON format).
 * /photosOfUser/:id' - Returns an array with all the photos of the User (id). Each photo
 *                      should have all the Comments on the Photo (JSON format)
 *
 */

var mongoose = require('mongoose');
var async = require('async');


// Load the Mongoose schema for User, Photo, and SchemaInfo
var User = require('./schema/user.js');
var Photo = require('./schema/photo.js');
var SchemaInfo = require('./schema/schemaInfo.js');

var express = require('express');
var app = express();

// XXX - Your submission should work without this line
var cs142models = require('./modelData/photoApp.js').cs142models;

mongoose.connect('mongodb://localhost/cs142project6');

// We have the express static module (http://expressjs.com/en/starter/static-files.html) do all
// the work for us.
app.use(express.static(__dirname));


app.get('/', function (request, response) {
    response.send('Simple web server of files from ' + __dirname);
});

/*
 * Use express to handle argument passing in the URL.  This .get will cause express
 * To accept URLs with /test/<something> and return the something in request.params.p1
 * If implement the get as follows:
 * /test or /test/info - Return the SchemaInfo object of the database in JSON format. This
 *                       is good for testing connectivity with  MongoDB.
 * /test/counts - Return an object with the counts of the different collections in JSON format
 */
app.get('/test/:p1', function (request, response) {
    // Express parses the ":p1" from the URL and returns it in the request.params objects.
    console.log('/test called with param1 = ', request.params.p1);

    var param = request.params.p1 || 'info';

    if (param === 'info') {
        // Fetch the SchemaInfo. There should only one of them. The query of {} will match it.
        SchemaInfo.find({}, function (err, info) {
            if (err) {
                // Query returned an error.  We pass it back to the browser with an Internal Service
                // Error (500) error code.
                console.error('Doing /user/info error:', err);
                response.status(500).send(JSON.stringify(err));
                return;
            }
            if (info.length === 0) {
                // Query didn't return an error but didn't find the SchemaInfo object - This
                // is also an internal error return.
                response.status(500).send('Missing SchemaInfo');
                return;
            }

            // We got the object - return it in JSON format.
            console.log('SchemaInfo', info[0]);
            response.end(JSON.stringify(info[0]));
        });
    } else if (param === 'counts') {
        // In order to return the counts of all the collections we need to do an async
        // call to each collections. That is tricky to do so we use the async package
        // do the work.  We put the collections into array and use async.each to
        // do each .count() query.
        var collections = [
            {name: 'user', collection: User},
            {name: 'photo', collection: Photo},
            {name: 'schemaInfo', collection: SchemaInfo}
        ];
        async.each(collections, function (col, done_callback) {
            col.collection.count({}, function (err, count) {
                col.count = count;
                done_callback(err);
            });
        }, function (err) {
            if (err) {
                response.status(500).send(JSON.stringify(err));
            } else {
                var obj = {};
                for (var i = 0; i < collections.length; i++) {
                    obj[collections[i].name] = collections[i].count;
                }
                response.end(JSON.stringify(obj));

            }
        });
    } else {
        // If we know understand the parameter we return a (Bad Parameter) (400) status.
        response.status(400).send('Bad param ' + param);
    }
});

/*
 * URL /user/list - Return all the User object.
 */
app.get('/user/list', function (request, response) {
    User.find({}, '_id first_name last_name', function (err, userList) {
        if (err) {
            response.status(500).send(JSON.stringify(err));
        } else {
            response.end(JSON.stringify(userList));
        }
    });
});

/*
 * URL /user/:id - Return the information for User (id)
 */ 
app.get('/user/:id', function (request, response) {
    var id = request.params.id;
    User.findById(id, function (err, userInfo) {
        if (err) {
            response.status(400).send(JSON.stringify(err) + "\nUser id: ${id} is illegal!");
        } else {
            if (userInfo) {
                var user = JSON.parse(JSON.stringify(userInfo));
                delete user.__v;
                response.status(200).send(user);
            } else {
                response.status(400).send("User id: ${id} is illegal!");
            }
        }
    });
});

/*
 * URL /photosOfUser/:id - Return the Photos for User (id)
 */
app.get('/photosOfUser/:id', function (request, response) {
    var id = request.params.id;
    var queryUserInfoFunc = [];
    Photo.find({'user_id': id}, function (err, photos) {
        if (err) {
            response.status(400).send(JSON.stringify(err));
        } else {
            // To change the data structure, we must make copies here.
            var photoList = JSON.parse(JSON.stringify(photos));
            photoList.forEach(function (photo) {
                delete photo.__v;
                var comments = photo.comments;
                comments.forEach(function (comment) {
                    // For each comment, fetch the info of the user writing 
                    // the comment.
                    queryUserInfoFunc.push(function (callback) {
                        // To make sure response is sent after all these queries, we need to group 
                        // all of these querys and run async call at the same time.
                        User.findById(comment.user_id, function (err, user) {
                            if (err) {
                                console.log("Cannot find record for id: ${comment.user_id}");
                            } else {
                                var userInfo = JSON.parse(JSON.stringify(user));
                                var userInfoSubset = {
                                    _id: comment.user_id,
                                    first_name: userInfo.first_name,
                                    last_name: userInfo.last_name
                                };
                                comment.user = userInfoSubset;
                                delete comment.user_id;
                            }
                            // Put current photo into the result set, which
                            // will be populated to the response.
                            callback(null, photo);
                        });
                    }); 
                });
            });
            async.parallel(queryUserInfoFunc, function (err, res) { 
                response.send(JSON.stringify(photoList));
            });
        } 
    }); 
});


var server = app.listen(3000, function () {
    var port = server.address().port;
    console.log('Listening at http://localhost:' + port + ' exporting the directory ' + __dirname);
});


