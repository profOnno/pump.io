#!/usr/bin/env node

// -*- mode: javascript -*-

// test list.js
//
// testlist ah damn... this is client only
//
// Copyright 2011-2013, E14N https://e14n.com/
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

var fs = require("fs"),
    path = require("path"),
    _ = require("underscore"),
    Step = require("step"),
    url = require("url"),
    common = require("../lib/pumpclient"),
    userCred = common.userCred,
    getJSON = common.getJSON,
    argv = require("optimist")
        .usage("Usage: $0 -u <username>")
        .demand(["u"])
        .alias("u", "username")
        .alias("s", "server")
        .alias("P", "port")
        .describe("u", "User nickname")
        .describe("s", "Server name (default 'localhost')")
        .describe("P", "Port (default 80)")
        .default("P", 31337)
        .default("s", "localhost")
        .argv,
    username = argv.u,
    server = argv.s,
    description = argv.d,
    port = argv.P,
    data,
    cred;

Step(
    function() {
        userCred(username, server, this);
    },
    function(err, results) {
        var endpoint;
        if (err) throw err;
        cred = results;
        endpoint = url.format({
            protocol: ((port == 443) ? "https" : "http"),
            host: ((port == 80 || port == 443) ? server : server + ":" + port),
            //pathname: "/api/user/"+username+"/lists/person"
            pathname: "/api/image/V9vLDdCDTJ-PyvZ9QZDZfA"
        });
        getJSON(endpoint, cred, this);
    },
    function(err, body, resp) {
        if (err) {
            console.error(err);
        } else {
            console.log(JSON.stringify(body, null, 4));
        }
    }
);
