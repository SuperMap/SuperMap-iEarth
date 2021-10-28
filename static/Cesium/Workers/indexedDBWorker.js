/**
 * Cesium - https://github.com/CesiumGS/cesium
 *
 * Copyright 2011-2020 Cesium Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Columbus View (Pat. Pend.)
 *
 * Portions licensed separately.
 * See https://github.com/CesiumGS/cesium/blob/master/LICENSE.md for full licensing details.
 */
define(['./when-8d13db60', './createTaskProcessorWorker'], function (when, createTaskProcessorWorker) { 'use strict';

    /**
         * @exports defined
         *
         * @param {*} value The object.
         * @returns {Boolean} Returns true if the object is defined, returns false otherwise.
         *
         * @example
         * if (Cesium.defined(positions)) {
         *      doSomething();
         * } else {
         *      doSomethingElse();
         * }
         */
        function defined(value) {
            return value !== undefined && value !== null;
        }

    /**
         * Constructs an exception object that is thrown due to a developer error, e.g., invalid argument,
         * argument out of range, etc.  This exception should only be thrown during development;
         * it usually indicates a bug in the calling code.  This exception should never be
         * caught; instead the calling code should strive not to generate it.
         * <br /><br />
         * On the other hand, a {@link RuntimeError} indicates an exception that may
         * be thrown at runtime, e.g., out of memory, that the calling code should be prepared
         * to catch.
         *
         * @alias DeveloperError
         * @constructor
         * @extends Error
         *
         * @param {String} [message] The error message for this exception.
         *
         * @see RuntimeError
         */
        function DeveloperError(message) {
            /**
             * 'DeveloperError' indicating that this exception was thrown due to a developer error.
             * @type {String}
             * @readonly
             */
            this.name = 'DeveloperError';

            /**
             * The explanation for why this exception was thrown.
             * @type {String}
             * @readonly
             */
            this.message = message;

            //Browsers such as IE don't have a stack property until you actually throw the error.
            var stack;
            try {
                throw new Error();
            } catch (e) {
                stack = e.stack;
            }

            /**
             * The stack trace of this exception, if available.
             * @type {String}
             * @readonly
             */
            this.stack = stack;
        }

        if (defined(Object.create)) {
            DeveloperError.prototype = Object.create(Error.prototype);
            DeveloperError.prototype.constructor = DeveloperError;
        }

        DeveloperError.prototype.toString = function() {
            var str = this.name + ': ' + this.message;

            if (defined(this.stack)) {
                str += '\n' + this.stack.toString();
            }

            return str;
        };

        /**
         * @private
         */
        DeveloperError.throwInstantiationError = function() {
            throw new DeveloperError('This function defines an interface and should not be called directly.');
        };

    var DataStatus = {
        NONE : 0,
        STORING : 1,
        STORED : 2,
        FAILED : 3
    };

    function IndexedDBScheduler(options) {
        if(!defined(options.name)){
            throw new DeveloperError('options.name is required.');
        }
        var defer = when.when.defer();
        this.dbname = options.name;
        var request = indexedDB.open(this.dbname);

        var that = this;
        request.onsuccess = function (event) {
            that.db = event.target.result;
            that.version = that.db.version;

            if (!defined(that.cachestatus)) {
                that.cachestatus = {

                };
            }
            defer.resolve(that);
        };

        request.onupgradeneeded = function (event) {
            that.db = event.target.result;
            that.version = that.db.version;
            defer.resolve(that);
        };

        request.onerror = function (event) {
            that.db = null;
            defer.reject('create database fail, error code : ' + event.target.errorcode);
        };

        this.layer = options.layer || null;
        this.storageType = options.storageType || "arrayBuffer";
        this.creatingTable = false;
        this.cachestatus = {};
        return defer.promise;
    }

    IndexedDBScheduler.prototype.checkObjectStoreExit = function(storeName) {
        if (!defined(this.db)) {
            return false;
        }

        return this.db.objectStoreNames.contains(storeName);
    };

    IndexedDBScheduler.prototype.createObjectStore = function(storeName) {
        var defer = when.when.defer();

        //防止多个请求同时创建同一张表
        if (!this.creatingTable) {
            if (this.db.objectStoreNames.contains(storeName)) {
                defer.reject(false);
                return defer.promise;
            }
            this.creatingTable = true;

            var that = this;

            //只能在onupgradeneeded方法中创建新表,所以需要用更高版本打开数据库触发更新
            var version = parseInt(that.db.version);
            that.db.close();
            var secondRequest = indexedDB.open(that.dbname, version + 1);
            secondRequest.onupgradeneeded  = function(e) {
                var database = e.target.result;
                that.db = database;
                var objectStore = database.createObjectStore(storeName, { keyPath : 'id'});
                if (defined(objectStore)) {
                    objectStore.createIndex('value', 'value', { unique : false});
                    that.creatingTable = false;
                    //初始化表的缓存状态
                    if (!defined(that.cachestatus)) {
                        that.cachestatus = {};
                    }

                    that.cachestatus[storeName] = {

                    };

                    //这边创建成功表后直接使用会出现各种奇怪的问题,索性关闭数据库后再打开
                    that.db.close();
                    var thirdRequest = indexedDB.open(that.dbname);

                    thirdRequest.onsuccess = function(e) {
                        var database = e.target.result;
                        that.db = database;
                        defer.resolve(true);
                    };
                } else {
                    that.creatingTable = false;
                    defer.reject(false);
                }
            };

            secondRequest.onsuccess = function(e) {
                e.target.result.close();
                defer.resolve(true);
            };

            secondRequest.onerror = function(e) {
                that.creatingTable = false;
                defer.reject(false);
            };
        } else {
            defer.reject(false);
        }

        return defer.promise;
    };

    IndexedDBScheduler.prototype.putElementInDB = function (table, key, data, objectArray) {
        var defer = when.when.defer();

        if (!defined(this.db)) {
            defer.reject(false);
            return defer.promise;
        }

        var objectStore;
        var that = this;

        //先检查缓存,如果已经写了就不去写了
        if (defined(that.cachestatus[table]) && !defined(objectArray)) {
            if (defined(that.cachestatus[table][key])) {
                if (that.cachestatus[table][key] === DataStatus.STORING || that.cachestatus[table][key] === DataStatus.STORED) {
                    defer.resolve(false);
                    return defer.promise;
                }
            }
        }

        //没有表,去创建指定名称的表
        if (!this.db.objectStoreNames.contains(table)) {
            this.createObjectStore(table).then(function(success) {
                var transaction = that.db.transaction([table], "readwrite");
                objectStore = transaction.objectStore(table);

                if (defined(objectArray)) {
                    for (var i = 0, len = objectArray.length; i < len; i++) {
                        objectStore.add({ id : objectArray[i].key, value : objectArray[i].value});
                    }

                    defer.resolve(true);
                } else {
                    var request = objectStore.add({ id : key, value : data});
                    request.onsuccess = function (event) {
                        defer.resolve(true);
                    };

                    request.onerror = function (event) {
                        defer.reject(false);
                    };
                }
            }, function(error) {
                defer.reject(false);
            });
        } else {
            if (!defined(that.cachestatus[table])) {
                that.cachestatus[table] = {

                };
            }

            //打开表并添加对应数据
            var transaction;
            try {
                transaction = this.db.transaction([table], "readwrite");
            } catch (e) {
                defer.reject(null);
                return defer.promise;
            }

            objectStore = transaction.objectStore(table);

            if (defined(objectArray)) {
                if (objectArray instanceof Array) {
                    for (var i = 0, len = objectArray.length; i < len; i++) {
                        if (that.cachestatus[table][objectArray[i].key] !== DataStatus.STORED) {
                            objectStore.add({ id : objectArray[i].key, value : objectArray[i].value});
                            that.cachestatus[table][objectArray[i].key] = DataStatus.STORED;
                        }
                    }
                    defer.resolve(true);
                } else {
                    for (var key in objectArray) {
                        if (isNaN(key * 1)) {
                            continue;
                        }
                        objectStore.add({ id : key, value : objectArray[key]});
                    }
                    defer.resolve(true);
                }
                
            } else if (!defined(key) || !defined(data)) {
                return;
            } else if (key instanceof Array && data instanceof Array) {
                for (var i = 0, len = key.length; i < len; i++) {
                    if (that.cachestatus[table][key[i]] !== DataStatus.STORED) {
                        objectStore.add({ id : key[i], value : data[i]});
                        that.cachestatus[table][key[i]] = DataStatus.STORED;
                    }
                }

                transaction.oncomplete = function(e) {
                    defer.resolve(true);
                };

                transaction.onerror = function(e) {
                    defer.reject(false);
                };
            } else {
                var request = objectStore.add({ id : key, value : data});
                that.cachestatus[table][key] = DataStatus.STORING;
                request.onsuccess = function (event) {
                    that.cachestatus[table][key] = DataStatus.STORED;
                    defer.resolve(true);
                };

                request.onerror = function (event) {
                    that.cachestatus[table][key] = DataStatus.FAILED;
                    defer.reject(false);
                };
            }
        }

        return defer.promise;
    };

    IndexedDBScheduler.prototype.getRangeFromDB = function(table, idRange) {
        var defer = when.when.defer();

        if (!defined(this.db)) {
            return null;
        }

        if (!this.db.objectStoreNames.contains(table)) {
            return null;
        }

        var transaction;
        try {
            transaction = this.db.transaction([table]);
        } catch (e) {
            defer.reject(null);
            return defer.promise;
        }

        var objectStore;
        try {
            objectStore = transaction.objectStore(table);
        } catch (e) {
            defer.reject(null);
        }

        var request = objectStore.openCursor(IDBKeyRange.bound(idRange[0], idRange[1]));

        var rs = [];
        request.onsuccess = function(event) {
            var cursor = event.target.result;
            if (!defined(cursor)) {
                defer.resolve(rs);
            } else {
                rs.push(cursor.value);
                cursor.continue();
            }
        };

        request.onerror = function(event) {
            defer.reject(null);
        };

        return defer.promise;
    };

    IndexedDBScheduler.prototype.getElementFromDB = function (table, key) {
        var defer = when.when.defer();

        if (!defined(this.db)) {
            return null;
        }

        if (!this.db.objectStoreNames.contains(table)) {
            return null;
        }

        var transaction;
        try {
            transaction = this.db.transaction([table]);
        } catch (e) {
            defer.reject(null);
            return defer.promise;
        }

        var objectStore;
        try {
            objectStore = transaction.objectStore(table);
        } catch (e) {
            defer.reject(null);
        }

        var request = objectStore.get(key);

        request.onsuccess = function(event) {
            if (!defined(event.target.result)) {
                defer.reject(null);
                return;
            }

            defer.resolve(event.target.result.value);
        };

        request.onerror = function(event) {
            defer.reject(null);
        };

        return defer.promise;
    };

    IndexedDBScheduler.prototype.getAllElementFromDB = function (table) {
        var defer = when.when.defer();

        if (!defined(this.db)) {
            return null;
        }

        if (!this.db.objectStoreNames.contains(table)) {
            return null;
        }

        var transaction;
        if (this.transaction != null) {
            transaction = this.transaction;
        } else {
            try {
                transaction = this.db.transaction([table]);
            } catch (e) {
                defer.reject(null);
                return defer.promise;
            }
        }
        

        var objectStore;
        try {
            objectStore = transaction.objectStore(table);
        } catch (e) {
            defer.reject(null);
        }

        var request = objectStore.getAll();

        request.onsuccess = function(event) {
            if (!defined(event.target.result)) {
                defer.reject(null);
                return;
            }

            defer.resolve(event.target.result);
        };

        request.onerror = function(event) {
            defer.reject(null);
        };

        return defer.promise;
    };

    IndexedDBScheduler.prototype.updateElementInDB = function (table, key, value, append) {
        var defer = when.when.defer();

        if (!defined(this.db)) {
            defer.resolve(false);
            return defer.promise;
        }

        if (!this.db.objectStoreNames.contains(table)) {
            defer.resolve(false);
            return defer.promise;
        }

        var transaction = this.db.transaction([table], "readwrite");
        var objectStore;
        try {
            objectStore = transaction.objectStore(table);
        } catch (e) {
            defer.resolve(false);
        }

        var request = objectStore.get(key);

        request.onsuccess = function(event) {
            var data = event.target.result;
            if (!defined(data)) {
                data = {
                    id : key
                };
            }

            if (append === true) {
                data.value = Object.assign(data.value, value);
            } else {
                data.value = value;
            }
            

            var requestUpdate = objectStore.put(data);
            requestUpdate.onsuccess = function(event) {
                defer.resolve(true);
            };

            requestUpdate.onerror = function(event) {
                defer.resolve(false);
            };
        };

        request.onerror = function(event) {
            defer.resolve(false);
        };

        return defer.promise;
    };

    IndexedDBScheduler.prototype.removeElementFromDB = function (table, key) {
        var defer = when.when.defer();

        if (!defined(this.db)) {
            defer.resolve(false);
            return defer.promise;
        }

        if (!this.db.objectStoreNames.contains(table)) {
            defer.resolve(false);
            return defer.promise;
        }

        var transaction = this.db.transaction([table], "readwrite");
        var objectStore;
        try {
            objectStore = transaction.objectStore(table);
        } catch (e) {
            defer.resolve(false);
        }

        var request = objectStore.delete(key);

        request.onerror = function(event) {
            defer.resolve(false);
        };

        request.onsuccess = function(event) {
            defer.resolve(true);
        };

        return defer.promise;
    };

    IndexedDBScheduler.prototype.clear = function(table) {
        var defer = when.when.defer();

        if (!defined(this.db)) {
            defer.resolve(false);
            return defer.promise;
        }

        if (!this.db.objectStoreNames.contains(table)) {
            defer.resolve(false);
            return defer.promise;
        }

        var transaction = this.db.transaction([table], "readwrite");
        var objectStore;
        try {
            objectStore = transaction.objectStore(table);
        } catch (e) {
            defer.resolve(false);
        }

        var request = objectStore.clear();

        request.onerror = function(event) {
            defer.resolve(false);
        };

        request.onsuccess = function(event) {
            defer.resolve(true);
        };

        return defer.promise;
    };

    var cache = {};
    var reserveCount = 500;
    function indexedDBWorker(parameters, transferableObjects) {

        var tablename = parameters.tablename;
        var dbname = parameters.dbname;
        var cahceKey = dbname + tablename;

        var blob = parameters.blob;
        var key = parameters.key;


        if(typeof blob !== "undefined" && typeof key !== "undefined"){
            //每次先记录，先存在内存
            if (typeof cache[cahceKey] === "undefined") {
                cache[cahceKey] = {
                    cache: [],
                    creatingDB: false,
                    scheduler: null,
                    creatingTable: false
                };
            } else {
                if(cache[cahceKey].cache.length < reserveCount) {
                    cache[cahceKey].cache.push({
                        key: key,
                        value: blob
                    });
                }
            }

        }
        else {
            //CPU空闲时写一下
            if(typeof cache[cahceKey] !== "undefined" && Object.keys(cache[cahceKey].cache).length !== 0){
                putElementInDB(dbname, tablename, cache[cahceKey]);
            }
        }

    }

    function putElementInDB(dbname, tablename, cache) {
        if (cache.scheduler === null) {
            if (!cache.creatingDB) {
                cache.creatingDB = true;
                new IndexedDBScheduler({ name: dbname }).then(function (result) {
                    cache.creatingDB = false;
                    cache.scheduler = result;
                    if (!result.checkObjectStoreExit(tablename)) {
                        if (!cache.creatingTable) {
                            cache.creatingTable = true;
                            result.createObjectStore(tablename).then(function () {
                                cache.creatingTable = false;
                                result.putElementInDB(tablename, null, null, cache.cache);
                                cache.cache = [];
                            });
                        }
                    } else {
                        result.putElementInDB(tablename, null, null, cache.cache);
                        cache.cache = [];
                    }
                });
            }

        } else {
            if (!cache.scheduler.checkObjectStoreExit(tablename)) {
                if (!cache.creatingTable) {
                    cache.creatingTable = true;
                    cache.scheduler.createObjectStore(tablename).then(function () {
                        cache.creatingTable = false;
                        cache.scheduler.putElementInDB(tablename, null, null, cache.cache);
                        cache.cache = [];
                    });
                }
            } else {
                cache.scheduler.putElementInDB(tablename, null, null, cache.cache);
                cache.cache = [];
            }
        }

    }

    var indexedDBWorker$1 = createTaskProcessorWorker(indexedDBWorker);

    return indexedDBWorker$1;

});
