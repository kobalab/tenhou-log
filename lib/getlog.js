/*
 *  ./lib/getlog.js
 */
"use strict";

const { version } = require('../package.json');
const agent = 'tenhou-log/' + version.replace(/^(\d+\.\d+).*$/,'$1');

module.exports = function(base_url = 'http://tenhou.net/0/log/?') {
    return function getlog(log_id) {
        return new Promise((callback, error)=>{
            fetch(base_url + log_id, {
                headers: { 'User-Agent': agent },
            }).then(res=>{
                if (res.ok) callback(res.text());
                else        error(res.status);
            }).catch(err=>error(500));
        });
    }
}
