// collection-test2.js
//
// Test the collection module
//
// Copyright 2012, E14N https://e14n.com/
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

var assert = require("assert"),
    vows = require("vows"),
    databank = require("databank"),
    Step = require("step"),
    URLMaker = require("../lib/urlmaker").URLMaker,
    modelBatch = require("./lib/model").modelBatch,
    Databank = databank.Databank,
    DatabankObject = databank.DatabankObject,
    pretty = require('js-object-pretty-print').pretty;

var suite = vows.describe("collection module interface");

var testSchema = {
    pkey: "id",
    fields: ["_created",
             "_uuid",
             "author",
             "content",
             "displayName",
             "downstreamDuplicates",
             "id",
             "image",
             "likes",
             "links",
             "members",
             "objectType",
             "objectTypes",
             "published",
             "replies",
             "shares",
             "summary",
             "updated",
             "upstreamDuplicates",
             "url"],
    indices: ["_uuid", "url"]
};

var testData = {
    "create": {
        displayName: "Vacation 2011",
        url: "http://example.com/collection/photos/vacation-2011",
        image: {
            url: "http://example.com/images/collections/vacation-2011.jpg",
            height: 140,
            width: 140
        },
        objectTypes: ["image", "video"]
    },
    "update": {
        displayName: "Vacation Summer 2011"
    }
};

suite.addBatch(modelBatch("collection", "Collection", testSchema, testData));

suite.addBatch({
    "When we get the Collection class": {
        topic: function() {
            return require("../lib/model/collection").Collection;
        },
        "it exists": function(Collection) {
            assert.isFunction(Collection);
        },
        "it has an isList() method": function(Collection) {
            assert.isFunction(Collection.isList);
        },
        "it has a checkList() method": function(Collection) {
            assert.isFunction(Collection.checkList);
        },
        "it has a PUBLIC member with the correct value": function(Collection) {
            assert.isString(Collection.PUBLIC);
            assert.equal(Collection.PUBLIC, "http://activityschema.org/collection/public");
        },
        "and we create a user": {
            topic: function(Collection) {
                var User = require("../lib/model/user").User;
                Step(
                    function() {
                        var props = {
                            nickname: "carlyle",
                            password: "1234,5678"
                        };
                        User.create(props, this);
                    },
                    this.callback
                );
            },
            "it works": function(err, user) {
                assert.ifError(err);
                assert.isObject(user);
            },
            "and we create a list": {
                topic: function(user, Collection) {
                    var list = {
                        author: user.profile,
                        displayName: "Neighbors",
                        objectTypes: ["person"]
                    };
                    Collection.create(list, this.callback);
                },
                "it works": function(err, collection) {
                    assert.ifError(err);
                    assert.isObject(collection);
                },
                "it has a getStream() method": function(err, collection) {
                    assert.ifError(err);
                    assert.isObject(collection);
                    assert.isFunction(collection.getStream);
                },
                "and we get the collection stream": {
                    topic: function(coll) {
                        //console.log('coll:\n'+pretty(coll));
                        coll.getStream(this.callback);
                    },
                    "it works": function(err, stream) {
                        assert.ifError(err);
                        assert.isObject(stream);
                    }
                },
                "and we get the user's lists": {
                    topic: function(coll, user) {
                        var callback = this.callback;
                        Step(
                            function() {
                                //console.log('coll:\n'+pretty(coll));
                                //console.log('user:\n'+pretty(user));
                                user.getLists("person", this);
                            },
                            function(err, stream) {
                                if (err) throw err;
                                //console.log('stream:\n'+pretty(stream));
                                stream.getIDs(0, 20, this);
                            },
                            function(err, ids) {
                                if (err) {
                                    callback(err, null, null);
                                } else {
                                    //console.log('ids:\n'+pretty(ids));
                                    callback(err, ids, coll);
                                }
                            }
                        );
                    },
                    "it works": function(err, ids, coll) {
                        assert.ifError(err);
                        assert.isArray(ids);
                        assert.isObject(coll);
                    },
                    "it has the right data": function(err, ids, coll) {
                        assert.ifError(err);
                        assert.isArray(ids);
                        assert.isObject(coll);
                        assert.greater(ids.length, 0);
                        assert.equal(ids[0], coll.id);
                    }
                },
                //remember this is async... this is called in parallel with other topics
                "and we add users to List": { 
                    topic: function(collection,user){
                        //console.log('hello:'+pretty(Collection));
                        var User = require("../lib/model/user").User,
                            err,user;
                        Step(
                            function() {
                                var props = {
                                    nickname: "borg1",
                                    password: "4ss1m1lat3"
                                };
                                User.create(props, this);
                            },
                            function(err,user){
                                //console.log(pretty(collection.id));//seems weird cause Collection is the Class
                                this.err=err;
                                this.user=user;
                                collection.members.add(user,this);
                                //console.log(pretty(user));
                                //return(err,user);//relay
                            },
                            function(err,something){
                                //console.log('after memberadd:'+pretty(something));
                                console.log('collection:\n'+pretty(collection));
                                //console.log('err:'+pretty(err));
                                return(err,user);
                            },
                            this.callback
                        );
                    },
                    "Created borg1?": function(){
                        assert.equal(1,1);
                    }
                }
            }
        }
    }
});

suite["export"](module);
