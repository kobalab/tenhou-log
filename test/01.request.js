const assert  = require('assert');

const request = require('../lib/request');

suite('request()', ()=>{
    test('モジュールが存在すること', ()=>assert.ok(request));
    test('不正なProtocol → 400', (done)=>{
        request('file:///', '', null, code=>{
            assert.equal(code, 400);
            done();
        });
    });
    test('不正なサーバ → 500', (done)=>{
        request('http://badhost/', '', null, code=>{
            assert.equal(code, 500);
            done();
        });
    });
    test('GET', (done)=>{
        request('https://github.com/', '', (body)=>{
            assert.ok(body.length);
            done();
        });
    });
    test('GET (gzip)', (done)=>{
        request('https://github.com/', 'gzip', (body)=>{
            assert.ok(body.length);
            done();
        });
    });
    test('GET (deflate)', (done)=>{
        request('https://github.com/', 'deflate', (body)=>{
            assert.ok(body.length);
            done();
        });
    });
    test('GET (not found)', (done)=>{
        request('http://kobalab.net/x', '', null, (code)=>{
            assert.equal(code, 404);
            done();
        });
    });
});
