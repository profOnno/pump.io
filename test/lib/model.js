// audio-test.js
//
// Test the audio module
//
// Copyright 2012, StatusNet Inc.
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

var assert = require('assert'),
    vows = require('vows'),
    databank = require('databank'),
    Step = require('step'),
    URLMaker = require('../lib/urlmaker').URLMaker,
    Databank = databank.Databank,
    DatabankObject = databank.DatabankObject;

var modelBatch = function(suite, typeName, className, testSchema, testData) {

    return {
        'When we require the module': {
            topic: function() { 
                return require('../lib/model/'+typeName);
            },
            'there is one': function(mod) {
                assert.isObject(mod);
            },
            'it has a class export': function(mod) {
                assert.includes(mod, className);
            },
            'and we get its class export': {
                topic: function(mod) {
                    return mod[className];
                },
                'it is a function': function(Cls) {
                    assert.isFunction(Cls);
                },
                'it has an init method': function(Cls) {
                    assert.isFunction(Cls.init);
                },
                'it has a bank method': function(Cls) {
                    assert.isFunction(Cls.bank);
                },
                'it has a get method': function(Cls) {
                    assert.isFunction(Cls.get);
                },
                'it has a search method': function(Cls) {
                    assert.isFunction(Cls.search);
                },
                'it has a pkey method': function(Cls) {
                    assert.isFunction(Cls.pkey);
                },
                'it has a create method': function(Cls) {
                    assert.isFunction(Cls.create);
                },
                'it has a readAll method': function(Cls) {
                    assert.isFunction(Cls.readAll);
                },
                'its type is "mod"': function(Cls) {
                    assert.isString(Cls.type);
                    assert.equal(Cls.type, typeName);
                },
                'and we get its schema': {
                    topic: function(Cls) {
                        return Cls.schema;
                    },
                    'it exists': function(schema) {
                        assert.isObject(schema);
                    },
                    'it has the right pkey': function(schema) {
                        assert.includes(schema, 'pkey');
                        assert.equal(schema.pkey, testSchema.pkey);
                    },
                    'it has the right fields': function(schema) {
                        var fields = testSchema.fields,
                            i, field;
                        assert.includes(schema, 'fields');
                        for (i = 0; i < fields.length; i++) {
                            assert.includes(schema.fields, fields[i]);
                        }
                        for (i = 0; i < schema.fields.length; i++) {
                            assert.includes(fields, schema.fields[i]);
                        }
                    },
                    'it has the right indices': function(schema) {
                        var fields = testSchema.fields,
                            i, field;
                        assert.includes(schema, 'fields');
                        for (i = 0; i < fields.length; i++) {
                            assert.includes(schema.fields, fields[i]);
                        }
                        for (i = 0; i < schema.fields.length; i++) {
                            assert.includes(fields, schema.fields[i]);
                        }
                    }
                },
                'and we create an instance': {
                    topic: function(Cls) {
                        Cls.create(testData.create, this.callback);
                    },
                    'it works correctly': function(err, created) {
                        assert.ifError(err);
                        assert.isObject(created);
                    },
                    'auto-generated fields are there': function(err, created) {
                        assert.isString(created.id);
                        assert.isString(created.published);
                        assert.isString(created.updated); // required for new object?
                    },
                    'passed-in fields are there': function(err, created) {
                        var prop;
                        for (prop in testData.create) {
                            assert.equal(created[prop], testData.create[prop]); 
                        }
                    },
                    'and we modify it': {
                        topic: function(created) {
                            created.update(testData.update, this.callback);
                        },
                        'it is modified': function(err, updated) {
                            assert.ifError(err);
                            assert.isString(updated.updated);
                        },
                        'modified fields are modified': function(err, updated) {
                            var prop;
                            for (prop in testData.create) {
                                assert.equal(updated[prop], testData.update[prop]); 
                            }
                        },
                        'and we delete it': {
                            topic: function(updated) {
                                updated.del(this.callback);
                            },
                            'it works': function(err, updated) {
                                assert.ifError(err);
                            }
                        }
                    }
                }
            }
        }
    };
};

exports.modelBatch = modelBatch;
