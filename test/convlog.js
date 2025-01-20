const assert  = require('assert');

const convlog = require('../');

let error_log;
console.error = ()=>{ error_log = 1 };

function last_log(paipu, num) {
    let i = paipu.log.length - 1;
    if (num) {
        let logs = [];
        for (let j = paipu.log[i].length - num; j < paipu.log[i].length; j++) {
            logs.push(paipu.log[i][j]);
        }
        return logs;
    }
    else {
        let j = paipu.log[i].length - 1;
        return paipu.log[i][j];
    }
}

suite('convlog()', ()=>{
    test('モジュールが存在すること', ()=>assert.ok(convlog));

    suite('mjloggm', ()=>{
        test('ver="2.3"', ()=>assert.ok(convlog('<mjloggm ver="2.3">')));
        test('ver="2.4"', ()=>{
            error_log = 0;
            assert.ok(convlog('<mjloggm ver="2.4">'));
            assert.ok(error_log);
        });
    });

    suite('GO', ()=>{
        test('一般卓', ()=>{
            assert.equal(convlog('<GO type="9"/>').title,   '四般南喰赤')});
        test('上級卓', ()=>{
            assert.equal(convlog('<GO type="137"/>').title, '四上南喰赤')});
        test('特上卓', ()=>{
            assert.equal(convlog('<GO type="41"/>').title,  '四特南喰赤')});
        test('鳳凰卓', ()=>{
            assert.equal(convlog('<GO type="169"/>').title, '四鳳南喰赤')});
        test('速卓', ()=>{
            assert.equal(convlog('<GO type="73"/>').title,  '四般南喰赤速')});
        test('光速卓', ()=>{
            assert.equal(convlog('<GO type="4161"/>').title,'四般東喰赤光')});
        test('東風戦', ()=>{
            assert.equal(convlog('<GO type="1"/>').title,   '四般東喰赤')});
        test('赤牌ナシ', ()=>{
            assert.equal(convlog('<GO type="3"/>').title,   '四般東喰')});
        test('喰断ナシ', ()=>{
            assert.equal(convlog('<GO type="5"/>').title,   '四般東赤')});
        test('三麻', ()=>{
            assert.throws(()=>{convlog('<GO type="17"/>')})});
        test('テストプレイ', ()=>{
            assert.equal(convlog('<GO type="0"/>').title,   '四般東喰赤－')});
        test('ログIDつき', ()=>{
            assert.equal(convlog('<GO type="9"/>', 'LOGID').title,
                         '四般南喰赤\nLOGID')});
        test('牌譜名を指定', ()=>{
            assert.equal(convlog('<GO type="9"/>', ':TITLE').title, 'TITLE')});
    });

    suite('UN', ()=>{
        let xml = '<UN n0="%E5%B0%B1%E6%B4%BB%E7%94%9F%40%E5%B7%9D%E6%9D%91%E8%BB%8D%E5%9B%A3" n1="%41%53%41%50%49%4E" n2="%E2%93%85%E5%A0%80%E5%86%85%E6%AD%A3%E4%BA%BA" n3="%E2%93%85%E7%9F%B3%E6%A9%8B%E4%BC%B8%E6%B4%8B" dan="20,20,0,0" rate="2325.68,2260.51,1500.00,1500.00" sx="M,F,M,F"/>';
        test('新人', ()=>{
            assert.equal(convlog(xml).player[3], 'Ⓟ石橋伸洋\n(新人 R1500)')});
        test('天鳳位', ()=>{
            assert.equal(convlog(xml).player[1], 'ASAPIN\n(天鳳位 R2260)')});
    });

    suite('TAIKYOKU', ()=>{
        test('起家', ()=>{
            assert.equal(convlog('<TAIKYOKU oya="1">').qijia, 1)});
    });

    suite('INIT', ()=>{
        let xml = '<GO type="9"/>'
                + '<TAIKYOKU oya="0"/>'
                + '<INIT seed="5,1,2,3,3,103" ten="280,290,340,290" oya="1" hai0="48,11,26,83,39,19,22,25,57,5,27,90,12" hai1="71,91,42,23,87,76,63,129,30,79,123,88,9" hai2="6,135,102,60,4,34,50,86,13,3,128,119,18" hai3="20,29,113,117,108,49,80,78,93,73,43,41,111"/>';
        test('場風', ()=>{
            assert.equal(last_log(convlog(xml)).qipai.zhuangfeng, 1)});
        test('局数', ()=>{
            assert.equal(last_log(convlog(xml)).qipai.jushu, 1)});
        test('本場', ()=>{
            assert.equal(last_log(convlog(xml)).qipai.changbang, 1)});
        test('供託', ()=>{
            assert.equal(last_log(convlog(xml)).qipai.lizhibang, 2)});
        test('持ち点', ()=>{
            assert.deepEqual(last_log(convlog(xml)).qipai.defen,
                             [ 29000, 34000, 29000, 28000 ])});
        test('ドラ表示牌', ()=>{
            assert.equal(last_log(convlog(xml)).qipai.baopai, 's8')});
        test('配牌', ()=>{
                assert.deepEqual(last_log(convlog(xml)).qipai.shoupai,
                                 [ 'm368p279s22405z46',
                                   'm122459p47s48z367',
                                   'm68p224s1236z1123',
                                   'm23456777p146s35' ])});
        test('配牌(赤牌ナシ)', ()=>{
            xml = '<GO type="3"/>'
                + '<TAIKYOKU oya="0"/>'
                + '<INIT seed="5,1,2,3,3,103" ten="280,290,340,290" oya="1" hai0="48,11,26,83,39,19,22,25,57,5,27,90,12" hai1="71,91,42,23,87,76,63,129,30,79,123,88,9" hai2="6,135,102,60,4,34,50,86,13,3,128,119,18" hai3="20,29,113,117,108,49,80,78,93,73,43,41,111"/>';
            assert.deepEqual(last_log(convlog(xml)).qipai.shoupai,
                             [ 'm368p279s22455z46',
                               'm122459p47s48z367',
                               'm68p224s1236z1123',
                               'm23456777p146s35' ])
        });
    });

    suite('T|U|V|W', ()=>{
        test('赤牌アリ', ()=>{
            let xml = '<GO type="9"/>'
                    + '<TAIKYOKU oya="0"/>'
                    + '<INIT seed="5,1,2,3,3,103" ten="280,290,340,290" oya="1" hai0="48,11,26,83,39,19,22,25,57,5,27,90,12" hai1="71,91,42,23,87,76,63,129,30,79,123,88,9" hai2="6,135,102,60,4,34,50,86,13,3,128,119,18" hai3="20,29,113,117,108,49,80,78,93,73,43,41,111"/>';
            assert.deepEqual(
                last_log(convlog(xml+'<T16/>')), {zimo:{l:3,p:'m0'}});
            assert.deepEqual(
                last_log(convlog(xml+'<U52/>')), {zimo:{l:0,p:'p0'}});
            assert.deepEqual(
                last_log(convlog(xml+'<V88/>')), {zimo:{l:1,p:'s0'}});
            assert.deepEqual(
                last_log(convlog(xml+'<W124/>')), {zimo:{l:2,p:'z5'}});
        });
        test('赤牌ナシ', ()=>{
            let xml = '<GO type="3"/>'
                    + '<TAIKYOKU oya="0"/>'
                    + '<INIT seed="5,1,2,3,3,103" ten="280,290,340,290" oya="1" hai0="48,11,26,83,39,19,22,25,57,5,27,90,12" hai1="71,91,42,23,87,76,63,129,30,79,123,88,9" hai2="6,135,102,60,4,34,50,86,13,3,128,119,18" hai3="20,29,113,117,108,49,80,78,93,73,43,41,111"/>';
            assert.deepEqual(
                last_log(convlog(xml+'<T16/>')), {zimo:{l:3,p:'m5'}});
            assert.deepEqual(
                last_log(convlog(xml+'<U52/>')), {zimo:{l:0,p:'p5'}});
            assert.deepEqual(
                last_log(convlog(xml+'<V88/>')), {zimo:{l:1,p:'s5'}});
            assert.deepEqual(
                last_log(convlog(xml+'<W124/>')), {zimo:{l:2,p:'z5'}});
        });
        test('カンヅモ', ()=>{
            let xml = '<GO type="9"/>'
                    + '<TAIKYOKU oya="0"/>'
                    + '<INIT seed="5,1,2,3,3,103" ten="280,290,340,290" oya="1" hai0="48,11,26,83,39,19,22,25,57,5,27,90,12" hai1="71,91,42,23,87,76,63,129,30,79,123,88,9" hai2="6,135,102,60,4,34,50,86,13,3,128,119,18" hai3="20,29,113,117,108,49,80,78,93,73,43,41,111"/>';
            assert.deepEqual(
                last_log(convlog(xml+'<N who="0" m="20018"/><T16/>')),
                {gangzimo:{l:3,p:'m0'}});
            assert.deepEqual(
                last_log(convlog(xml+'<N who="0" m="13314"/><T16/>')),
                {gangzimo:{l:3,p:'m0'}});
            assert.deepEqual(
                last_log(convlog(xml+'<N who="0" m="22528"/><T16/>')),
                {gangzimo:{l:3,p:'m0'}});
        });
    });

    suite('D|E|F|G', ()=>{
        test('赤牌アリ', ()=>{
            let xml = '<GO type="9"/>'
                    + '<TAIKYOKU oya="0"/>'
                    + '<INIT seed="5,1,2,3,3,103" ten="280,290,340,290" oya="1" hai0="48,11,26,83,39,19,22,25,57,5,27,90,12" hai1="71,91,42,23,87,76,63,129,30,79,123,88,9" hai2="6,135,102,60,4,34,50,86,13,3,128,119,18" hai3="20,29,113,117,108,49,80,78,93,73,43,41,111"/>';
            assert.deepEqual(
                last_log(convlog(xml+'<D16/>')), {dapai:{l:3,p:'m0'}});
            assert.deepEqual(
                last_log(convlog(xml+'<E52/>')), {dapai:{l:0,p:'p0'}});
            assert.deepEqual(
                last_log(convlog(xml+'<F88/>')), {dapai:{l:1,p:'s0'}});
            assert.deepEqual(
                last_log(convlog(xml+'<G124/>')), {dapai:{l:2,p:'z5'}});
        });
        test('赤牌ナシ', ()=>{
            let xml = '<GO type="3"/>'
                    + '<TAIKYOKU oya="0"/>'
                    + '<INIT seed="5,1,2,3,3,103" ten="280,290,340,290" oya="1" hai0="48,11,26,83,39,19,22,25,57,5,27,90,12" hai1="71,91,42,23,87,76,63,129,30,79,123,88,9" hai2="6,135,102,60,4,34,50,86,13,3,128,119,18" hai3="20,29,113,117,108,49,80,78,93,73,43,41,111"/>';
            assert.deepEqual(
                last_log(convlog(xml+'<D16/>')), {dapai:{l:3,p:'m5'}});
            assert.deepEqual(
                last_log(convlog(xml+'<E52/>')), {dapai:{l:0,p:'p5'}});
            assert.deepEqual(
                last_log(convlog(xml+'<F88/>')), {dapai:{l:1,p:'s5'}});
            assert.deepEqual(
                last_log(convlog(xml+'<G124/>')), {dapai:{l:2,p:'z5'}});
        });
        test('ツモ切り', ()=>{
            let xml = '<GO type="9"/>'
                    + '<TAIKYOKU oya="0"/>'
                    + '<INIT seed="5,1,2,3,3,103" ten="280,290,340,290" oya="1" hai0="48,11,26,83,39,19,22,25,57,5,27,90,12" hai1="71,91,42,23,87,76,63,129,30,79,123,88,9" hai2="6,135,102,60,4,34,50,86,13,3,128,119,18" hai3="20,29,113,117,108,49,80,78,93,73,43,41,111"/>';
            assert.deepEqual(
                last_log(convlog(xml+'<T16/><D16/>')), {dapai:{l:3,p:'m0_'}});
            assert.deepEqual(
                last_log(convlog(xml+'<U52/><E52/>')), {dapai:{l:0,p:'p0_'}});
            assert.deepEqual(
                last_log(convlog(xml+'<V88/><F88/>')), {dapai:{l:1,p:'s0_'}});
            assert.deepEqual(
                last_log(convlog(xml+'<W124/><G124/>')), {dapai:{l:2,p:'z5_'}});
        });
    });

    suite('N', ()=>{
        suite('赤牌アリ', ()=>{
            let xml = '<GO type="9"/>'
                    + '<TAIKYOKU oya="0"/>'
                    + '<INIT seed="5,1,2,3,3,103" ten="280,290,340,290" oya="1" hai0="48,11,26,83,39,19,22,25,57,5,27,90,12" hai1="71,91,42,23,87,76,63,129,30,79,123,88,9" hai2="6,135,102,60,4,34,50,86,13,3,128,119,18" hai3="20,29,113,117,108,49,80,78,93,73,43,41,111"/>';
            test('チー', ()=>{
                assert.deepEqual(
                    last_log(convlog(xml+'<N who="0" m="6207"/>')),
                    {fulou:{l:3,m:'m3-40'}});
                assert.deepEqual(
                    last_log(convlog(xml+'<N who="0" m="31767"/>')),
                    {fulou:{l:3,m:'p40-6'}});
                assert.deepEqual(
                    last_log(convlog(xml+'<N who="0" m="57735"/>')),
                    {fulou:{l:3,m:'s067-'}});
            });
            test('ポン', ()=>{
                assert.deepEqual(
                    last_log(convlog(xml+'<N who="1" m="6697"/>')),
                    {fulou:{l:0,m:'m505+'}});
                assert.deepEqual(
                    last_log(convlog(xml+'<N who="1" m="20010"/>')),
                    {fulou:{l:0,m:'p550='}});
                assert.deepEqual(
                    last_log(convlog(xml+'<N who="1" m="34315"/>')),
                    {fulou:{l:0,m:'s555-'}});
                assert.deepEqual(
                    last_log(convlog(xml+'<N who="1" m="48681"/>')),
                    {fulou:{l:0,m:'z555+'}});
            });
            test('加槓', ()=>{
                assert.deepEqual(
                    last_log(convlog(xml+'<N who="2" m="6705"/>')),
                    {gang:{l:1,m:'m505+5'}});
                assert.deepEqual(
                    last_log(convlog(xml+'<N who="2" m="20018"/>')),
                    {gang:{l:1,m:'p550=5'}});
                assert.deepEqual(
                    last_log(convlog(xml+'<N who="2" m="34323"/>')),
                    {gang:{l:1,m:'s555-0'}});
                assert.deepEqual(
                    last_log(convlog(xml+'<N who="2" m="48689"/>')),
                    {gang:{l:1,m:'z555+5'}});
            });
            test('大明槓', ()=>{
                assert.deepEqual(
                    last_log(convlog(xml+'<N who="3" m="4609"/>')),
                    {fulou:{l:2,m:'m5505+'}});
                assert.deepEqual(
                    last_log(convlog(xml+'<N who="3" m="13314"/>')),
                    {fulou:{l:2,m:'p5550='}});
                assert.deepEqual(
                    last_log(convlog(xml+'<N who="3" m="31746"/>')),
                    {fulou:{l:2,m:'z5555='}});
            });
            test('暗槓', ()=>{
                assert.deepEqual(
                    last_log(convlog(xml+'<N who="3" m="22528"/>')),
                    {gang:{l:2,m:'s5550'}});
                assert.deepEqual(
                    last_log(convlog(xml+'<N who="3" m="31744"/>')),
                    {gang:{l:2,m:'z5555'}});
            });
        });
        suite('赤牌ナシ', ()=>{
            let xml = '<GO type="3"/>'
                    + '<TAIKYOKU oya="0"/>'
                    + '<INIT seed="5,1,2,3,3,103" ten="280,290,340,290" oya="1" hai0="48,11,26,83,39,19,22,25,57,5,27,90,12" hai1="71,91,42,23,87,76,63,129,30,79,123,88,9" hai2="6,135,102,60,4,34,50,86,13,3,128,119,18" hai3="20,29,113,117,108,49,80,78,93,73,43,41,111"/>';
            test('チー', ()=>{
                assert.deepEqual(
                    last_log(convlog(xml+'<N who="0" m="6207"/>')),
                    {fulou:{l:3,m:'m3-45'}});
                assert.deepEqual(
                    last_log(convlog(xml+'<N who="0" m="31767"/>')),
                    {fulou:{l:3,m:'p45-6'}});
                assert.deepEqual(
                    last_log(convlog(xml+'<N who="0" m="57735"/>')),
                    {fulou:{l:3,m:'s567-'}});
            });
            test('ポン', ()=>{
                assert.deepEqual(
                    last_log(convlog(xml+'<N who="1" m="6697"/>')),
                    {fulou:{l:0,m:'m555+'}});
                assert.deepEqual(
                    last_log(convlog(xml+'<N who="1" m="20010"/>')),
                    {fulou:{l:0,m:'p555='}});
                assert.deepEqual(
                    last_log(convlog(xml+'<N who="1" m="34315"/>')),
                    {fulou:{l:0,m:'s555-'}});
                assert.deepEqual(
                    last_log(convlog(xml+'<N who="1" m="48681"/>')),
                    {fulou:{l:0,m:'z555+'}});
            });
            test('加槓', ()=>{
                assert.deepEqual(
                    last_log(convlog(xml+'<N who="2" m="6705"/>')),
                    {gang:{l:1,m:'m555+5'}});
                assert.deepEqual(
                    last_log(convlog(xml+'<N who="2" m="20018"/>')),
                    {gang:{l:1,m:'p555=5'}});
                assert.deepEqual(
                    last_log(convlog(xml+'<N who="2" m="34323"/>')),
                    {gang:{l:1,m:'s555-5'}});
                assert.deepEqual(
                    last_log(convlog(xml+'<N who="2" m="48689"/>')),
                    {gang:{l:1,m:'z555+5'}});
            });
            test('大明槓', ()=>{
                assert.deepEqual(
                    last_log(convlog(xml+'<N who="3" m="4609"/>')),
                    {fulou:{l:2,m:'m5555+'}});
                assert.deepEqual(
                    last_log(convlog(xml+'<N who="3" m="13314"/>')),
                    {fulou:{l:2,m:'p5555='}});
                assert.deepEqual(
                    last_log(convlog(xml+'<N who="3" m="31746"/>')),
                    {fulou:{l:2,m:'z5555='}});
            });
            test('暗槓', ()=>{
                assert.deepEqual(
                    last_log(convlog(xml+'<N who="3" m="22528"/>')),
                    {gang:{l:2,m:'s5555'}});
                assert.deepEqual(
                    last_log(convlog(xml+'<N who="3" m="31744"/>')),
                    {gang:{l:2,m:'z5555'}});
            });
        });
    });

    suite('DORA', ()=>{
        let xml = '<GO type="9"/>'
                + '<TAIKYOKU oya="0"/>'
                + '<INIT seed="5,1,2,3,3,103" ten="280,290,340,290" oya="1" hai0="48,11,26,83,39,19,22,25,57,5,27,90,12" hai1="71,91,42,23,87,76,63,129,30,79,123,88,9" hai2="6,135,102,60,4,34,50,86,13,3,128,119,18" hai3="20,29,113,117,108,49,80,78,93,73,43,41,111"/>';
        test('暗槓 → 即開槓', ()=>{
            assert.deepEqual(
                last_log(convlog(xml+'<N who="0" m="16384" />'
                                    +'<DORA hai="14" />'
                                    +'<T62/>'), 3),
                [ {gang:{l:3,m:'p8888'}},
                  {gangzimo:{l:3,p:'p7'}},
                  {kaigang:{baopai:'m4'}} ]);
        });
        test('加槓 → 打牌後開槓', ()=>{
            assert.deepEqual(
                last_log(convlog(xml+'<N who="2" m="6705" />'
                                    +'<V70/>'
                                    +'<DORA hai="62" />'
                                    +'<F70/>'), 4),
                [ {gang:{l:1,m:'m505+5'}},
                  {gangzimo:{l:1,p:'p9'}},
                  {dapai:{l:1,p:'p9_'}},
                  {kaigang:{baopai:'p7'}} ]);
        });
        test('加槓 → 連続した加槓で開槓', ()=>{
            assert.deepEqual(
                last_log(convlog(xml+'<N who="3" m="48210" />'
                                    +'<W115/>'
                                    +'<N who="3" m="45586" />'
                                    +'<DORA hai="78" />'
                                    +'<W13/>'), 5),
                [ {gang:{l:2,m:'z555=5'}},
                  {gangzimo:{l:2,p:'z2'}},
                  {gang:{l:2,m:'z333=3'}},
                  {gangzimo:{l:2,p:'m4'}},
                  {kaigang:{baopai:'s2'}} ]);
        });
        test('加槓 → 直後の暗槓で開槓', ()=>{
            assert.deepEqual(
                last_log(convlog(xml+'<N who="2" m="41074" />'
                                    +'<V117/>'
                                    +'<N who="2" m="29696" />'
                                    +'<DORA hai="38" />'
                                    +'<DORA hai="131" />'
                                    +'<V47>'), 6),
                 [ {gang:{l:1,m:'s999=9'}},
                   {gangzimo:{l:1,p:'z3'}},
                   {gang:{l:1,m:'z3333'}},
                   {gangzimo:{l:1,p:'p3'}},
                   {kaigang:{baopai:'p1'}},
                   {kaigang:{baopai:'z6'}} ]);
        });
        test('大明槓 → 打牌後開槓', ()=>{
            assert.deepEqual(
                last_log(convlog(xml+'<N who="2" m="26882" />'
                                    +'<V70/>'
                                    +'<DORA hai="62" />'
                                    +'<F70/>'), 4),
                [ {fulou:{l:1,m:'s9999='}},
                  {gangzimo:{l:1,p:'p9'}},
                  {dapai:{l:1,p:'p9_'}},
                  {kaigang:{baopai:'p7'}} ]);
        });
        test('大明槓 → 連続した加槓で開槓', ()=>{
            assert.deepEqual(
                last_log(convlog(xml+'<N who="0" m="9218" />'
                                    +'<T112/>'
                                    +'<N who="0" m="43539" />'
                                    +'<DORA hai="94" />'
                                    +'<T64/>'), 5),
                [ {fulou:{l:3,m:'p1111='}},
                  {gangzimo:{l:3,p:'z2'}},
                  {gang:{l:3,m:'z222-2'}},
                  {gangzimo:{l:3,p:'p8'}},
                  {kaigang:{baopai:'s6'}} ]);
        });
        test('大明槓 → 直後の暗槓で開槓', ()=>{
            assert.deepEqual(
                last_log(convlog(xml+'<N who="2" m="14594" />'
                                    +'<V84/>'
                                    +'<N who="2" m="21504" />'
                                    +'<DORA hai="83" />'
                                    +'<DORA hai="96" />'
                                    +'<V47>'), 6),
                [ {fulou:{l:1,m:'p6666='}},
                  {gangzimo:{l:1,p:'s4'}},
                  {gang:{l:1,m:'s4444'}},
                  {gangzimo:{l:1,p:'p3'}},
                  {kaigang:{baopai:'s3'}},
                  {kaigang:{baopai:'s7'}} ]);
        });
    });

    suite('REACH', ()=>{
        let xml = '<GO type="9"/>'
                + '<TAIKYOKU oya="0"/>'
                + '<INIT seed="5,1,2,3,3,103" ten="280,290,340,290" oya="1" hai0="48,11,26,83,39,19,22,25,57,5,27,90,12" hai1="71,91,42,23,87,76,63,129,30,79,123,88,9" hai2="6,135,102,60,4,34,50,86,13,3,128,119,18" hai3="20,29,113,117,108,49,80,78,93,73,43,41,111"/>';
        test('リーチ宣言', ()=>{
            assert.deepEqual(
                last_log(convlog(xml+'<REACH who="2" step="1"/>'
                                    +'<F85/>')),
                {dapai:{l:1,p:'s4*'}});
            assert.deepEqual(
                last_log(convlog(xml+'<V85>'
                                    +'<REACH who="2" step="1"/>'
                                    +'<F85/>')),
                {dapai:{l:1,p:'s4_*'}});
        });
        test('リーチ成立', ()=>{
            assert.deepEqual(
                last_log(convlog(xml+'<REACH who="2" step="1"/>'
                                    +'<F85/>'
                                    +'<REACH who="2" ten="220,236,232,282" step="2"/>'
                                    +'<W23/>'
                                    +'<G71/>')),
                {dapai:{l:2,p:'p9'}});
        });
    });

    suite('AGARI', ()=>{
        let xml = '<GO type="9"/>'
                + '<TAIKYOKU oya="0"/>'
                + '<INIT seed="5,1,2,3,3,103" ten="280,290,340,290" oya="1" hai0="48,11,26,83,39,19,22,25,57,5,27,90,12" hai1="71,91,42,23,87,76,63,129,30,79,123,88,9" hai2="6,135,102,60,4,34,50,86,13,3,128,119,18" hai3="20,29,113,117,108,49,80,78,93,73,43,41,111"/>';
        test('門前ツモ和了', ()=>{
            assert.deepEqual(
                last_log(convlog(xml+ '<AGARI ba="0,1" hai="9,14,16,18,20,24,52,55,77,81,86,90,94,98" machi="86" ten="20,18000,2" yaku="1,1,0,1,7,1,8,1,54,2,53,0" doraHai="61" doraHaiUra="121" who="3" fromWho="3" sc="47,-60,233,-60,397,-60,313,190" />')),
                {hule:{
                    l:        2,
                    shoupai:  'm340567p05s23567s4',
                    baojia:   null,
                    fubaopai: ['z4'],
                    fu:       20,
                    fanshu:   6,
                    defen:    18000,
                    hupai:    [
                        { name: '立直', fanshu: 1},
                        { name: '門前清自摸和', fanshu: 1},
                        { name: '平和', fanshu: 1},
                        { name: '断幺九', fanshu: 1},
                        { name: '赤ドラ', fanshu: 2},
                        { name: '裏ドラ', fanshu: 0},
                    ],
                    fenpei:   [ -6000, -6000, 19000, -6000 ]
                }}
            );
        });
        test('副露ロン和了', ()=>{
            assert.deepEqual(
                last_log(convlog(xml+ '<AGARI ba="0,0" hai="59,62,67,80,86,88,97,99" m="39465,1641" machi="86" ten="30,5800,0" yaku="8,1,52,1,54,1" doraHai="52" who="1" fromWho="2" sc="210,0,230,58,330,-58,230,0" />')),
                {hule:{
                    l:        0,
                    shoupai:  'p678s3077s4,m222+,s888+',
                    baojia:   1,
                    fubaopai: null,
                    fu:       30,
                    fanshu:   3,
                    defen:    5800,
                    hupai:    [
                        { name: '断幺九', fanshu: 1},
                        { name: 'ドラ', fanshu: 1},
                        { name: '赤ドラ', fanshu: 1},
                    ],
                    fenpei:   [ 5800, -5800, 0, 0 ]
                }}
            );
        });
        test('ダブロン', ()=>{
            assert.equal(convlog(xml
                                +'<AGARI ba="0,1" hai="0,7,10,24,27,47,49,52,63,64,68" m="43625" machi="52" ten="30,7700,0" yaku="15,1,52,2,54,1" doraHai="22" who="3" fromWho="2" sc="382,0,120,0,88,-77,400,87" />'
                                +'<AGARI ba="0,0" hai="6,8,12,48,51,52,58,61,85,91,93" m="15455" machi="52" ten="30,3900,0" yaku="8,1,52,1,54,1" doraHai="22" who="0" fromWho="2" sc="382,39,120,0,11,-39,487,0" />'
                            ).log[0].slice(-2).filter(x=>x.hule).length, 2);
        });
        test('役満', ()=>{
            assert.deepEqual(
                last_log(convlog(xml+ '<AGARI ba="1,0" hai="82,84,90,121,122,124,125,127" m="51818,49707" machi="121" ten="40,48000,5" yakuman="39" doraHai="59" who="1" fromWho="3" sc="114,0,364,483,224,0,298,-483" />')),
                {hule:{
                    l:         0,
                    shoupai:   's345z4555z4,z666-,z777=',
                    baojia:    2,
                    fubaopai:  null,
                    damanguan: 1,
                    defen:     48000,
                    hupai:     [ { name: '大三元', fanshu: '*'} ],
                    fenpei:    [ 48300, 0, -48300, 0 ]
                }}
            );
        });
        test('ダブル役満', ()=>{
            assert.deepEqual(
                last_log(convlog(xml+ '<AGARI ba="1,0" hai="112,113,114,116,119,120,121,122" m="48715,41993" machi="120" ten="40,96000,5" yakuman="50,42" doraHai="115" who="2" fromWho="3" sc="244,0,94,0,308,963,354,-963" />')),
                {hule:{
                    l:         1,
                    shoupai:   'z2223344z4,z111+,z555-',
                    baojia:    2,
                    fubaopai:  null,
                    damanguan: 2,
                    defen:     96000,
                    hupai:     [
                        { name: '小四喜', fanshu: '*'},
                        { name: '字一色', fanshu: '*'}
                    ],
                    fenpei:    [ 0, 96300, -96300, 0 ]
                }}
            );
        });
        test('役満パオ', ()=>{
            assert.deepEqual(
                last_log(convlog(xml+ '<AGARI ba="1,0" hai="8,11,42,46,48" m="51785,50250,48650" machi="11" ten="40,32000,5" yakuman="39" doraHai="22" who="0" fromWho="2" paoWho="1" sc="404,323,125,-163,155,-160,316,0" />')),
                {hule:{
                    l:         3,
                    shoupai:   'm3p234m3,z555=,z666=,z777+',
                    baojia:    1,
                    fubaopai:  null,
                    damanguan: 1,
                    defen:     32000,
                    hupai:     [ { name: '大三元', fanshu: '*'} ],
                    fenpei:    [ -16300, -16000, 0, 32300 ]
                }}
            );
        });
    });
    suite('RYUUKYOKU', ()=>{
        let xml = '<GO type="9"/>'
                + '<TAIKYOKU oya="0"/>'
                + '<INIT seed="5,1,2,3,3,103" ten="280,290,340,290" oya="1" hai0="48,11,26,83,39,19,22,25,57,5,27,90,12" hai1="71,91,42,23,87,76,63,129,30,79,123,88,9" hai2="6,135,102,60,4,34,50,86,13,3,128,119,18" hai3="20,29,113,117,108,49,80,78,93,73,43,41,111"/>';
        test('流局', ()=>{
            assert.deepEqual(
                last_log(convlog(xml
                    +'<N who="1" m="57695" />'
                    +'<N who="1" m="2048" />'
                    +'<RYUUKYOKU ba="1,3" sc="194,15,334,15,196,-15,246,-15" hai0="46,48,61,65,66,67,69,78,80,86,88,93,96" hai1="28,51,52,59,95,97,102" />')),
                {pingju:{
                    name:    '流局',
                    shoupai: ['m8p406s678,s567-,m3333','','','p3478889s234067'],
                    fenpei:  [ 1500, -1500, -1500, 1500 ] }}
            );
        });
        test('流局(加槓あり)', ()=>{
            assert.deepEqual(
                last_log(convlog(xml
                    +'<N who="1" m="48681" />'
                    +'<N who="1" m="36875" />'
                    +'<N who="1" m="48689" />'
                    +'<RYUUKYOKU ba="0,0" sc="170,-10,210,30,410,-10,210,-10" hai1="72,74,85,87,88,89,94" />')),
                {pingju:{
                    name:    '流局',
                    shoupai: ['s1144056,z555+5,s777-','','',''],
                    fenpei:  [ 3000, -1000, -1000, -1000 ] }}
            );
        });
        test('途中流局(九種九牌)', ()=>{
            assert.deepEqual(
                last_log(convlog(xml+'<RYUUKYOKU type="yao9" ba="2,0" sc="252,0,194,0,415,0,139,0" hai0="2,5,16,17,19,22,37,70,74,115,118,126,131,134" />')),
                {pingju:{
                    name:    '九種九牌',
                    shoupai: ['','','','m120556p19s1z23567'],
                    fenpei:  [ 0, 0, 0, 0 ] }}
            );
        });
        test('途中流局(四風連打)', ()=>{
            assert.deepEqual(
                last_log(convlog(xml+'<RYUUKYOKU type="kaze4" ba="0,0" sc="171,0,477,0,171,0,181,0" />')),
                {pingju:{
                    name:    '四風連打',
                    shoupai: ['','','',''],
                    fenpei:  [ 0, 0, 0, 0 ] }}
            );
        });
        test('途中流局(四家立直)', ()=>{
            assert.deepEqual(
                last_log(convlog(xml+'<RYUUKYOKU type="reach4" ba="2,4" sc="113,0,185,0,467,0,195,0" hai0="2,7,10,19,21,27,78,81,83,84,89,105,106" hai1="3,8,20,26,28,57,61,65,93,95,112,113,114" hai2="4,5,9,12,23,25,31,52,56,63,72,73,74" hai3="11,13,18,41,47,51,55,58,62,76,77,86,90" />')),
                {pingju:{
                    name:    '四家立直',
                    shoupai: [
                        'm13678p678s66z222',
                        'm2234678p067s111',
                        'm345p234567s2245',
                        'm123567s2334599'],
                    fenpei:  [ 0, 0, 0, 0 ] }}
            );
        });
        test('途中流局(三家和了)', ()=>{
            assert.deepEqual(
                last_log(convlog(xml
                    +'<N who="1" m="45610" />'
                    +'<N who="3" m="50281" />'
                    +'<N who="1" m="5162" />'
                    +'<N who="2" m="12343" />'
                    +'<N who="2" m="24727" />'
                    +'<RYUUKYOKU type="ron3" ba="1,0" sc="221,0,212,0,167,0,400,0" hai0="48,54,59,65,67,84,85,86,89,92,95,98,101" hai2="13,16,22,45,47,83,88" hai3="28,29,30,57,58,74,77,81,90,94" />')),
                {pingju:{
                    name:    '三家和了',
                    shoupai: [
                        '',
                        'm406p33s30,m5-67,p2-34',
                        'm888p66s12356,z666+',
                        'p45688s44456678'],
                    fenpei:  [ 0, 0, 0, 0 ] }}
            );
        });
        test('途中流局(四槓散了)', ()=>{
            assert.deepEqual(
                last_log(convlog(xml+'<RYUUKYOKU type="kan4" ba="0,0" sc="235,0,232,0,437,0,96,0" />')),
                {pingju:{
                    name:    '四槓散了',
                    shoupai: ['','','',''],
                    fenpei:  [ 0, 0, 0, 0 ] }}
            );
        });
        test('流し満貫', ()=>{
            assert.deepEqual(
                last_log(convlog(xml
                    +'<N who="1" m="46119" />'
                    +'<RYUUKYOKU type="nm" ba="0,1" sc="211,-20,230,-40,220,-20,329,80" hai0="25,26,27,41,45,50,53,54,57,61,65,89,91" hai1="30,31,42,46,48,51,52,83,85,88" hai2="10,15,19,47,49,62,67,70,78,82,86,118,119" />')),
                {pingju:{
                    name:    '流し満貫',
                    shoupai: [
                        'm88p23440s340,s2-34',
                        'm345p34789s234z33',
                        '',
                        'm777p23455678s55'],
                    fenpei:  [ -4000, -2000, 8000, -2000 ] }}
            );
        });
    });

    suite('owari', ()=>{
        let xml = '<GO type="9"/>'
                + '<TAIKYOKU oya="0"/>'
                + '<INIT seed="5,1,2,3,3,103" ten="280,290,340,290" oya="1" hai0="48,11,26,83,39,19,22,25,57,5,27,90,12" hai1="71,91,42,23,87,76,63,129,30,79,123,88,9" hai2="6,135,102,60,4,34,50,86,13,3,128,119,18" hai3="20,29,113,117,108,49,80,78,93,73,43,41,111"/>'
                +'<AGARI ba="0,0" hai="40,42,43,49,54,58,134,135" m="14345,28695" machi="49" ten="30,3900,0" yaku="34,2,54,1" doraHai="0" who="2" fromWho="1" sc="394,0,202,-39,176,39,228,0" owari="394,49.0,163,-34.0,215,-18.0,228,3.0" />';
        test('終局時の持ち点', ()=>
            assert.deepEqual(convlog(xml).defen,[ 39400, 16300, 21500, 22800 ]));
        test('ポイント', ()=>
            assert.deepEqual(convlog(xml).point,['49.0','-34.0','-18.0','3.0']));
        test('順位', ()=>
            assert.deepEqual(convlog(xml).rank,[ 1, 4, 3, 2 ]));
        test('順位(同点)', ()=>{
            let xml = '<GO type="9"/>'
                    + '<TAIKYOKU oya="2"/>'
                    + '<INIT seed="5,1,2,3,3,103" ten="280,290,340,290" oya="1" hai0="48,11,26,83,39,19,22,25,57,5,27,90,12" hai1="71,91,42,23,87,76,63,129,30,79,123,88,9" hai2="6,135,102,60,4,34,50,86,13,3,128,119,18" hai3="20,29,113,117,108,49,80,78,93,73,43,41,111"/>'
                    +'<AGARI ba="0,0" hai="40,42,43,49,54,58,134,135" m="14345,28695" machi="49" ten="30,3900,0" yaku="34,2,54,1" doraHai="0" who="2" fromWho="1" sc="394,0,202,-39,176,39,228,0" owari="200,0,300,0,300,0,200,0" />';
            assert.deepEqual(convlog(xml).rank,[ 4, 2, 1, 3 ]);
        });
    });

    suite('OTHER', ()=>{
        let xml = '<OTHER/>';
        test('パーズできること', ()=>assert.ok(convlog(xml)));
    });
});
