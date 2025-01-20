const assert  = require('assert');

const getlog = require('../lib/getlog')();

suite('getlog()', ()=>{
    test('モジュールが存在すること', ()=>assert.ok(getlog));
    test('牌譜が取得できること', (done)=>{
        getlog('2016031822gm-0009-10011-896da481').then(xml=>{
            assert.ok(xml);
            done();
        });
    });
    test('ログID不正', (done)=>{
        getlog('badid').catch(code=>{
            assert.equal(code, 404);
            done();
        });
    });
    test('サーバ不正', (done)=>{
        const getlog = require('../lib/getlog')('http://badserver/');
        getlog('test').catch(code=>{
            assert.equal(code, 500);
            done();
        });
    });
});
