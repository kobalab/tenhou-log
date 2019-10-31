/*
 *  ./lib/getlog.js
 */
"use strict";

const request = require('./request');

module.exports = function getlog(log_id) {
    return new Promise((callback, error)=>{
        request(`http://tenhou.net/0/log/?${log_id}`, 'gzip, deflate',
                callback, error);
    });
}
