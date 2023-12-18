/*
 *  ./lib/request.js
 */
"use strict";

const http  = require('http');
const https = require('https');
const zlib  = require('zlib');

module.exports = function request(url, encoding, callback, error) {

    if (! url.match(/^https?:/)) {
        error(400);
        return;
    }
    let options = { headers: { 'User-Agent': 'tenhou-log/1.2' } };
    if (encoding) {
        options.headers['Accept-Encoding'] = encoding;
    }

    let protocol = url.substr(0,5) == 'https' ? https : http;

    protocol.request(url, options, res=>{
        if (res.statusCode == 200) {
            const encoding = res.headers['content-encoding'];
            let buffer = [];
            res.on('data', (chunk)=>buffer.push(chunk));
            res.on('end', ()=>{
                let body = Buffer.concat(buffer);
                if (encoding == 'gzip') {
                    body = zlib.gunzipSync(body).toString()
                }
                else if (encoding == 'deflate') {
                    body = zlib.inflateSync(body).toString()
                }
                else {
                    body = body.toString();
                }
                callback(body);
            });
        }
        else if (res.headers.location) {
            request(res.headers.location, encoding, callback, error);
        }
        else {
            error(res.statusCode);
        }
    }).on('error', ()=>{
        error(500);
    }).end();
}
