#!/usr/bin/env babel-node

"use strict";

const VERSION = "1.0.0";

var path = require("path");
var scriptName = path.basename(process.argv[1]);
var args = process.argv.slice(2);
var arg;
var fs = require('fs');

import server from "./server.js";

var port = 1337;

var develop = false;

function usage() {
    console.log(`Usage: ${scriptName} [options]

Options:
 -h               Display help text.
 -v               Display the version.
 --port <number>  Run server on this port.
 --develop        Developer mode`);
}


function badUsage(message) {
    console.log(`${message}
Use -h to get an overview of the command.`);
}


function version() {
    console.log(VERSION);
}


while ((arg = args.shift()) !== undefined) {
    switch (arg) {
        case "-h":
            usage();
            process.exit(0);
            break;

        case "-v":
            version();
            process.exit(0);
            break;

        case "--port":
            port = Number.parseInt(args.shift());
            if (Number.isNaN(port)) {
                badUsage("--port must be followed by a port number.");
                process.exit(1);
            }
            break;

        case "--develop":
            develop = true;
            fs.writeFile('dev', develop);
            break;

        default:
            //remainingArgs.push(arg);
            badUsage("Unknown argument.");
            process.exit(1);
            break;
    }
}

fs.writeFile('dev', develop);

// Main
server.listen(port);
console.log("The server is now listening on: " + port);
