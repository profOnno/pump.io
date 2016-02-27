#!/bin/env node

/* Generate pump config file based on openshift environment */

var fs = require('fs');
var path = require('path');
var crypto = require('crypto');

var configfile = path.join(process.env.OPENSHIFT_DATA_DIR, ".pump.io.json");

var main = function() {
    fs.exists(configfile, function (exists) {
	if (exists) {
	    console.log("Config exists, will not overwrite");
	} else {
	    console.log("No config found, creating " + configfile);
	    generate_config();
	}
    });
}

var generate_config = function() {

    // Databank params for mongodb
    var params = {};
    params.host = process.env.OPENSHIFT_MONGODB_DB_HOST;
    params.port = process.env.OPENSHIFT_MONGODB_DB_PORT;
    params.dbuser = process.env.OPENSHIFT_MONGODB_DB_USERNAME;
    params.dbpass = process.env.OPENSHIFT_MONGODB_DB_PASSWORD;
    params.dbname = process.env.OPENSHIFT_APP_NAME

    // Main object that will be JSONified and written to config file
    var config = {};

    // Static properties, these can be changed
    config.noweb = false;
    config.site = "Yet Another Openshift Pump";
    config.owner = "Yet Another Openshift Pump Inc";
    config.ownerURL = process.env.OPENSHIFT_APP_DNS; //default to this app
    config.nologger = false;
    config.debugClient = false;
    config.firehose = "ofirehose.com";

    // From here down should probably not be changed on a whim
    config.driver = "mongodb";
    config.params = params;
    config.port = process.env.OPENSHIFT_NODEJS_PORT;
    config.address = process.env.OPENSHIFT_NODEJS_IP;
    config.urlPort = 80;
    config.hostname = process.env.OPENSHIFT_APP_DNS;
    config.uploaddir = path.join(process.env.OPENSHIFT_DATA_DIR, "uploads");

    // Just generate random garbage for the secret
    crypto.randomBytes(48, function(ex, buf) {
	config.secret = buf.toString('hex');
    });

    fs.writeFile(configfile, JSON.stringify(config));
}

main();
