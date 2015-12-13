#!/usr/bin/env node

require("shelljs/make");
require("shelljs/global");

var shell = require("shelljs"),
//    colors = require("colors"),
    _ = require("underscore");

var symbol={
    info: 'ℹ',
    success: '✔',
    warning: '⚠',
    error: '✖'
};

target.all = function(){
    echo("hello world");
};

target.newNode = function(version){
    echo((" "+symbol.warning+" ").blue.bgWhite+" installing new node version: ".bold.green+version);
};

target.versions = function(){
    exec("node -v",{silent:true},function(code,res){
        echo("node version:\t\t"+res.split("\n")[0]);
    });
    
    exec("npm -v",{silent:true},function(code,res){
        echo("npn version:\t\t"+res.split("\n")[0]);
    });

    npmPackageVersions(function(code,res){
        var lookup = ["zombie", "connect", "express"];

        lookup.map(function(item){
            echo(item+": "+res[item].version);
        });
    });
};

target.setupPackageJSON = function(){
    exec("node -v",{silent:true},function(code,res){
        var v = res.split("\n")[0],
            version, filename;
        
        echo("node version: "+v);

        // parse version
        // There must be a simpler way
        v = String(v).replace(/[a-z]/g,"").split("."); //strip all characters...should be better to keep only numbers and points
       
        filename=testPkgJSON(v);
        echo("Using: "+filename);
 
        rm("-Rf","./node_modules/zombie"); //make a blacklist or whitelist
        cp("-f", filename, "./package.json");

    });
};

var testPkgJSON = function(version){
    var filename,
        t;
    //test it 
    //should use path.join... windows compatible?
    if(version.length === 0) return "./package.json.org"; //default

    v = version.length > 2 ? version[0]+"."+version[1]+"."+version[2] : (version.length > 1 ? version[0]+"."+version[1] : version [0]);
    if (test("-f","./package.json."+v)){
        filename = "./package.json."+v;
        return filename; 
    }else{
        version.pop();
        return testPkgJSON(version);
    }
};
    
var npmPackageVersions = function(fn){
    exec("npm -j list", {silent:true},function(code,res){
        res = res.replace(/^npm ERR!.*$/mgi,""); //removeing error lines
        fn(code,JSON.parse(res).dependencies);
    });
};

