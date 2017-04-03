
var http = require("http");
var fs = require('fs');

class Client {

    /**
     * Set the url of the server to connect to.
     *
     * @param  String url to use to connect to the server.
     *
     */
    setServer(url) {
        this.server = url;
    }



    /**
     * Make a HTTP GET request, wrapped in a Promise.
     *
     * @param  String url to connect to.
     *
     * @return Promise
     *
     */
    httpGet(url) {
        return new Promise((resolve, reject) => {
            http.get(this.server + url, (res) => {
                var data = "";

                res.on('data', (chunk) => {
                    data += chunk;
                }).on('end', () => {
                    if (res.statusCode === 200) {
                        resolve(data);
                    } else {
                        reject(data);
                    }
                }).on('error', (e) => {
                    reject("Got error: " + e.message);
                });
            });
        });
    }

    list(query_max) {
        var url_get = "/room/list" + query_max;

        var dev = (fs.readFileSync('dev', 'utf8') == "true");

        if (dev === true) {
            console.log(this.server + url_get);
        }

        return this.httpGet(url_get);
    }

    view_id(id) {
        var url_get = "/room/view/id/" + id;

        var dev = (fs.readFileSync('dev', 'utf8') == "true");

        if (dev === true) {
            console.log(this.server + url_get);
        }

        return this.httpGet(url_get);
    }

    view_house(house, query_max) {
        var url_get = "/room/view/house/" + house + query_max;

        var dev = (fs.readFileSync('dev', 'utf8') == "true");

        if (dev === true) {
            console.log(this.server + url_get);
        }

        return this.httpGet(url_get);
    }

    search(string, query_max) {
        var url_get = "/room/search/" + string + query_max;

        var dev = (fs.readFileSync('dev', 'utf8') == "true");

        if (dev === true) {
            console.log(this.server + url_get);
        }

        return this.httpGet(url_get);
    }

    searchp(string, query_max) {
        var url_get = "/room/searchp/" + string + query_max;

        var dev = (fs.readFileSync('dev', 'utf8') == "true");

        if (dev === true) {
            console.log(this.server + url_get);
        }

        return this.httpGet(url_get);
    }

}

export default Client;
