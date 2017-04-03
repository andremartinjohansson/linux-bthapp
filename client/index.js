#!/usr/bin/env babel-node


"use strict";

const VERSION = "1.0.0";

// For CLI usage
var path = require("path");
var fs = require('fs');
var scriptName = path.basename(process.argv[1]);
var args = process.argv.slice(2);
var arg;
var host = "localhost";
var port = "1337";

var develop = false;

// Get the server with defaults
import Client from "./client.js";

var client = new Client();
var server = "http://" + host + ":" + port;
// var server = "http://localhost:1337"

// Make it using prompt
var readline = require("readline");

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});



/**
 * Display helptext about usage of this script.
 */
function usage() {
    console.log(`Usage: ${scriptName} [options]

Options:
 -h               Display help text.
 -v               Display the version.
 --server <url>   Set the server url to use
 --port <number>  Set the port to use
 --develop        Developer mode`);
}



/**
 * Display helptext about bad usage.
 *
 * @param String message to display.
 */
function badUsage(message) {
    console.log(`${message}
Use -h to get an overview of the command.`);
}



/**
 * Display version.
 */
function version() {
    console.log(VERSION);
}



// Walkthrough all arguments checking for options.
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

        case "--server":
            // console.log(args.shift());
            host = args.shift();
            server = "http://" + host + ":" + port;
            if (host === undefined) {
                badUsage("--server must be followed by a url.");
                process.exit(1);
            }
            break;

        case "--port":
            port = args.shift();
            server = "http://" + host + ":" + port;
            if (port === undefined) {
                badUsage("--port must be followed by a valid port number.");
                process.exit(1);
            }
            break;

        case "--develop":
            develop = true;
            fs.writeFile('dev', develop);
            break;

        default:
            badUsage("Unknown argument.");
            process.exit(1);
            break;
    }
}

/**
 * Display a menu.
 */
function menu() {
    console.log(`Commands available:
 exit             Leave this program.
 menu             Print this menu.
 url              Get url to view the server in browser.
 list             List all rooms.
 view <id>        View the room with the selected id.
 house <house>    View the names of all rooms in this building (house).
 search <string>  View the details of all matching rooms (one per row).
 searchp <string> Search with priority.`);
}



/**
 * Callbacks for game asking question.
 */
rl.on("line", function(line) {
    // Split incoming line with arguments into an array
    var args = line.trim().split(" ");
    args = args.filter(value => {
        return value !== "";
    });

    switch (args[0]) {
        case "exit":
            console.log("Bye!");
            process.exit(0);
            break;

        case "menu":
            menu();
            rl.prompt();
            break;

        case "url":
            console.log("Click this url to view the server in a browser.\n" + server);
            rl.prompt();
            break;

        case "list":
            var max = "";
            if (args[1] == "max") {
                max = "?max=" + args[2];
            }
            client.list(max)
            .then(value => {
                    console.log(value);
                    rl.prompt();
                })
                .catch(err => {
                    console.log("FAILED: Could not show rooms.\nDetails: " + err);
                    rl.prompt();
                });
            rl.prompt();
            break;

        case "view":
            client.view_id(args[1])
            .then(value => {
                    console.log(value);
                    rl.prompt();
                })
                .catch(err => {
                    console.log("FAILED: Could not show room.\nDetails: " + err);
                    rl.prompt();
                });
            rl.prompt();
            break;

        case "house":
            max = "";
            if (args[2] == "max") {
                max = "?max=" + args[3];
            }
            client.view_house(args[1], max)
            .then(value => {
                    console.log(value);
                    rl.prompt();
                })
                .catch(err => {
                    console.log("FAILED: Could not show rooms.\nDetails: " + err);
                    rl.prompt();
                });
            rl.prompt();
            break;

        case "search":
            max = "";
            if (args[2] == "max") {
                max = "?max=" + args[3];
            }
            client.search(args[1], max)
            .then(value => {
                    console.log(value);
                    rl.prompt();
                })
                .catch(err => {
                    console.log("FAILED: Could not show rooms.\nDetails: " + err);
                    rl.prompt();
                });
            rl.prompt();
            break;

        case "searchp":
            max = "";
            if (args[2] == "max") {
                max = "?max=" + args[3];
            }
            client.searchp(args[1], max)
            .then(value => {
                    console.log(value);
                    rl.prompt();
                })
                .catch(err => {
                    console.log("FAILED: Could not show rooms.\nDetails: " + err);
                    rl.prompt();
                });
            rl.prompt();
            break;

        default:
            console.log("Enter 'menu' to get an overview of what you can do here.");
            rl.prompt();
    }
});



rl.on("close", function() {
    console.log("Bye!");
    process.exit(0);
});

fs.writeFile('dev', develop);

// Main
client.setServer(server);
console.log("Use -h to get a list of options to start this program.");
console.log("Ready to talk to server url '" + server + "'.");
console.log("Use 'menu' to get a list of commands.");
rl.setPrompt("BTH-App$ ");
rl.prompt();
