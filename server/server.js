"use strict";

var fs = require('fs'),
obj;

// A better router to create a handler for all routes
import Router from "./router";
var router = new Router();

// Import the http server as base
var http = require("http");
var url = require("url");

/**
 * Wrapper function for sending a JSON response
 *
 * @param  Object        res     The response
 * @param  Object/String content What should be written to the response
 * @param  Integer       code    HTTP status code
 */
function sendJSONResponse(res, content, code = 200) {
    var dev = (fs.readFileSync('dev', 'utf8') == "true");

    if (dev === true) {
        console.log(JSON.stringify(content, null, "    "));
    }

    res.writeHead(code, "Content-Type: application/json");
    res.write(JSON.stringify(content, null, "    "));
    res.end();
}

function devResponse(text) {
    var dev = (fs.readFileSync('dev', 'utf8') == "true");

    if (dev === true) {
        console.log(text);
    }
}

function checkPriority(room) {
    if (room.Priority !== undefined) {
        delete room.Priority;
    }
}

fs.readFile('../salar.json', 'utf-8', function (err, data) {
    if (err) {
        throw err;
    }
    obj = JSON.parse(data);
});

function search(data, string, field) {
    var match, priority;
    if (data !== null) {
        data = data.toLowerCase();
        string = string.toLowerCase();
        priority = 0;
        if (data.includes(string)) {
            if (field == "Typ" || field == "Ort" || field == "Salsnamn") {
                priority += 1;
            }
            if (data.match("^" + string + "$")) {
                priority += 1;
            }
            if (data.match("^" + string)) {
                priority += 1;
            }
            match = true;
        }
    }
    else {
        match = false;
    }
    return [match, priority];
}

/**
 * Display a helptext about the API.
 *
 * @param Object req The request
 * @param Object res The response
 */
router.get("/", (req, res) => {

    var text = "Welcome a RESTful server for the BTH app. This is the API of what can be done.\n\n" +
        " /                       Display this helptext.\n" +
        " /room/list              Show all the rooms\n" +
        " /room/view/id/:number   View room with given id\n" +
        " /room/view/house/:house Show all rooms in given building\n" +
        " /room/search/:search    View rooms matching search\n" +
        " /room/searchp/:search   View rooms matching search, with priority\n";

    devResponse(text);

    res.writeHead(200, "Content-Type: text/plain");
    res.write(text);
    res.end();
});



/**
 * Display all rooms
 *
 * @param Object req The request
 * @param Object res The response
 */
router.get("/room/list", (req, res) => {

    var list;

    for (var room of obj.salar) {
        checkPriority(room);
    }

    if (req.query.max) {
        list = obj.salar.slice(0, Number(req.query.max));
        sendJSONResponse(res, list);
    }
    else {
        sendJSONResponse(res, obj.salar);
    }

});



/**
 * View room with given id
 *
 * @param Object req The request
 * @param Object res The response
 */
router.get("/room/view/id/:number", (req, res) => {

    var match;

    for (var room of obj.salar) {
        checkPriority(room);
        if (room.Salsnr !== null) {
            if (room.Salsnr.toLowerCase() == req.params.number.toLowerCase()) {
                match = room;
                break;
            }
        }
    }
    if (match !== undefined) {
        sendJSONResponse(res, match);
    }
    else {
        var text = "No match found.";

        devResponse(text);

        res.writeHead(200, "Content-Type: text/plain");
        res.write(text);
        res.end();
    }

});



/**
 * View all rooms in given building
 *
 * @param Object req The request
 * @param Object res The response
 */
router.get("/room/view/house/:house", (req, res) => {

    var roomsInBuilding = [];

    for (var room of obj.salar) {
        checkPriority(room);
        if (room.Hus !== null) {
            if (room.Hus.toLowerCase() == req.params.house.toLowerCase()) {
                roomsInBuilding.push(room);
            }
        }
    }

    if (roomsInBuilding !== undefined && roomsInBuilding.length !== 0) {
        if (req.query.max) {
            roomsInBuilding = roomsInBuilding.slice(0, Number(req.query.max));
        }
        sendJSONResponse(res, roomsInBuilding);
    }
    else {
        var text = "No matches found.";

        devResponse(text);

        res.writeHead(200, "Content-Type: text/plain");
        res.write(text);
        res.end();
    }

});

/**
 * View the results of a search
 *
 * @param Object req The request
 * @param Object res The response
 */
router.get("/room/search/:search", (req, res) => {

    var roomsMatch = [];
    var fields = ['Salsnr', 'Salsnamn', 'Lat', 'Long', 'Ort', 'Hus', 'Våning', 'Typ', 'Storlek'];
    var match, results;

    for (var room of obj.salar) {
        checkPriority(room);
        for (var field of fields) {
            results = search(room[field], req.params.search, field);
            match = results[0];
            if (match) {
                roomsMatch.push(room);
            }
        }
    }

    if (roomsMatch !== undefined && roomsMatch.length !== 0) {
        if (req.query.max) {
            roomsMatch = roomsMatch.slice(0, Number(req.query.max));
        }
        sendJSONResponse(res, roomsMatch);
    }
    else {
        var text = "No matches found.";

        devResponse(text);

        res.writeHead(200, "Content-Type: text/plain");
        res.write(text);
        res.end();
    }

});

/**
 * View the results of a search
 *
 * @param Object req The request
 * @param Object res The response
 */
router.get("/room/searchp/:search", (req, res) => {

    var roomsMatch = [], priority_3 = [], priority_2 = [], priority_1 = [], priority_0 = [];
    var fields = ['Salsnr', 'Salsnamn', 'Lat', 'Long', 'Ort', 'Hus', 'Våning', 'Typ', 'Storlek'];
    var match, priority, results;

    for (var room of obj.salar) {
        for (var field of fields) {
            results = search(room[field], req.params.search, field);
            match = results[0];
            priority = results[1];
            if (match && (priority == 3)) {
                priority_3.push(room);
                break;
            }
            else if (match && (priority == 2)) {
                priority_2.push(room);
                break;
            }
            else if (match && (priority == 1)) {
                priority_1.push(room);
                break;
            }
            else if (match && (priority === 0)) {
                priority_0.push(room);
                break;
            }
        }
        room.Priority = priority;
    }

    for (var room3 of priority_3) {
        roomsMatch.push(room3);
    }

    for (var room2 of priority_2) {
        roomsMatch.push(room2);
    }

    for (var room1 of priority_1) {
        roomsMatch.push(room1);
    }

    for (var room0 of priority_0) {
        roomsMatch.push(room0);
    }

    if (roomsMatch !== undefined && roomsMatch.length !== 0) {
        if (req.query.max) {
            roomsMatch = roomsMatch.slice(0, Number(req.query.max));
        }
        sendJSONResponse(res, roomsMatch);
    }
    else {
        var text = "No matches found.";

        devResponse(text);

        res.writeHead(200, "Content-Type: text/plain");
        res.write(text);
        res.end();
    }

});

/**
 * Create and export the server
 */
var server = http.createServer((req, res) => {
    var ipAddress,
        route;

    // Log incoming requests
    ipAddress = req.connection.remoteAddress;

    // Check what route is requested
    route = url.parse(req.url).pathname;
    console.log("Incoming route " + route + " from ip " + ipAddress);

    // Let the router take care of all requests
    router.route(req, res);
});

export default server;
