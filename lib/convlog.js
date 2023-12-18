/*
 *  convlog
 */
"use strict";

let type;

function parse_type(str) {
    type = {};
    type.demo     = ! (0x01 & str);
    type.hongpai  = ! (0x02 & str);
    type.ariari   = ! (0x04 & str);
    type.dongfeng = ! (0x08 & str);
    type.sanma    =   (0x10 & str);
    type.soku     =   (0x40 & str);
    type.level    =   (0x20 & str) >> 4 | (0x80 & str) >> 7;
    type.kou      =   (0x1000 & str);

    return (type.sanma    ? '三' : '四')
         + ['般','上','特','鳳'][type.level]
         + (type.dongfeng ? '東' : '南')
         + (type.ariari   ? '喰' : '')
         + (type.hongpai  ? '赤' : '')
         + (type.kou      ? '光'
          : type.soku     ? '速' : '')
         + (type.demo     ? '－' : '');
}

const dan_name = [
    '新人','9級','8級','7級','6級','5級','4級','3級','2級','1級',
    '初段','二段','三段','四段','五段','六段','七段','八段','九段','十段',
    '天鳳位'
];

function parse_player(attr) {
    let name = ['n0','n1','n2','n3'].map(n=>decodeURIComponent(attr[n]));
    let dan  = attr.dan.split(',').map(n=>dan_name[n]);
    let rate = attr.rate.split(',').map(n=>Math.floor(n));
    return [0,1,2,3].map(n=>`${name[n]}\n(${dan[n]} R${rate[n]})`);
}

function pai(pai) {
    let paistr = ''
    let suit;
    if (! Array.isArray(pai)) pai = [ pai ];
    for (let pn of pai.sort((a,b)=> a - b)) {
        let s = ['m','p','s','z'][pn / 36 | 0];
        if (s != suit) paistr += s;
        suit = s;
        let n = (pn % 36 / 4 | 0) + 1;
        if (type.hongpai && s != 'z' && n == 5 && pn % 4 == 0) n = 0;
        paistr += n;
    }
    return paistr;
}

function mianzi(mc) {
    let d = ['','+','=','-'][mc & 0x0003];
    if (mc & 0x0004) {
        let pt = (mc & 0xFC00)>>10;
        let r  = pt % 3;
        let pn = pt / 3 | 0;
        let s  = ['m','p','s'][pn/7|0];
        let n  = pn % 7 + 1;
        let nn = [ n, n+1, n+2 ];
        let pp = [ mc & 0x0018, mc & 0x0060, mc & 0x0180 ];
        for (let i = 0; i < 3; i++) {
            if (type.hongpai && nn[i] == 5 && pp[i] == 0) nn[i] = 0;
            if (i == r) nn[i] += d;
        }
        return s + nn.join('');
    }
    else if (mc & 0x0018) {
        let pt = (mc & 0xFE00)>>9;
        let r  = pt % 3;
        let pn = pt / 3 | 0;
        let s  = ['m','p','s','z'][pn/9|0];
        let n  = pn % 9 + 1;
        let nn = [ n, n, n, n ];
        if (type.hongpai && s != 'z' && n == 5) {
            if ((mc & 0x0060) == 0) nn[3] = 0;
            else if (r == 0)        nn[2] = 0;
            else                    nn[1] = 0;
        }
        return (mc & 0x0010) ? s + nn.slice(0,3).join('') + d + nn[3]
                             : s + nn.slice(0,3).join('') + d;
    }
    else {
        let pt = (mc & 0xFF00)>>8;
        let r  = pt % 4;
        let pn = pt / 4 | 0;
        let s  = ['m','p','s','z'][pn/9|0];
        let n  = pn % 9 + 1;
        let nn = [ n, n, n, n ];
        if (type.hongpai && s != 'z' && n == 5) {
            if      (d == '') nn[3] = 0;
            else if (r == 0)  nn[3] = 0;
            else              nn[2] = 0;
        }
        return s + nn.join('') + d;
    }
}

function qipai(attr) {

    let seed = attr.seed.split(',');
    let ten  = attr.ten.split(',').map(x=>x * 100);
    let hai  = [0,1,2,3].map(l=>pai(attr[`hai${l}`].split(',')));

    ten = ten.concat(ten.splice(0, attr.oya));
    hai = hai.concat(hai.splice(0, attr.oya));

    let qipai = {
        zhuangfeng: seed[0] / 4 | 0,
        jushu:      seed[0] % 4,
        changbang:  + seed[1],
        lizhibang:  + seed[2],
        defen:      ten,
        baopai:     pai(seed[5]),
        shoupai:    hai
    };
    return {qipai:qipai};
}

const hupai_name = [
    '門前清自摸和', '立直', '一発', '槍槓', '嶺上開花',
    '海底摸月', '河底撈魚', '平和', '断幺九', '一盃口',
    '自風 東', '自風 南', '自風 西', '自風 北', '場風 東',
    '場風 南', '場風 西', '場風 北', '役牌 白', '役牌 發',
    '役牌 中', '両立直', '七対子', '混全帯幺九', '一気通貫',
    '三色同順', '三色同刻', '三槓子', '対々和', '三暗刻',
    '小三元', '混老頭', '二盃口', '純全帯幺九', '混一色',
    '清一色', '', '天和', '地和', '大三元',
    '四暗刻', '四暗刻単騎', '字一色', '緑一色', '清老頭',
    '九蓮宝燈', '純正九蓮宝燈', '国士無双', '国士無双１３面', '大四喜',
    '小四喜', '四槓子', 'ドラ', '裏ドラ', '赤ドラ',
];

function hule(attr, oya) {

    let ten     = attr.ten.split(',');
    let sc      = attr.sc.split(',').map(x=> x * 100);
    let yaku    = attr.yaku    ? attr.yaku.split(',')    : [];
    let yakuman = attr.yakuman ? attr.yakuman.split(',') : [];

    sc = [ sc[1], sc[3], sc[5], sc[7] ];
    sc = sc.concat(sc.splice(0, oya));

    let hupai = [], fanshu = 0;
    for (let hn of yakuman) {
        hupai.push({ name: hupai_name[hn], fanshu: '*' });
    }
    for (let i = 0; i < yaku.length; i += 2) {
        hupai.push({ name: hupai_name[yaku[i]], fanshu: + yaku[i+1] });
        fanshu += + yaku[i+1];
    }

    let hule = {
        l:      (+ attr.who + 4 - oya) % 4,
        shoupai:  [ pai(attr.hai.split(',').filter(pn=> pn != attr.machi))
                                + pai(attr.machi)
                  ].concat(
                      (attr.m ? attr.m.split(',') : [])
                            .reverse()
                            .map(mc=>mianzi(mc))
                  ).join(','),
        baojia:   attr.who != attr.fromWho
                        ? (+ attr.fromWho + 4 - oya) % 4 : null,
        fubaopai: attr.doraHaiUra
                        ? attr.doraHaiUra.split(',').map(pn=> pai(pn))
                        : null,
        defen:    + ten[1],
        hupai:    hupai,
        fenpei:   sc,
    };
    if (yakuman.length) {
        hule.damanguan = yakuman.length;
    }
    else {
        hule.fu     = + ten[0];
        hule.fanshu = fanshu;
    }

    return {hule:hule};
}

const pingju_name = {
    nm:     '流し満貫',
    yao9:   '九種九牌',
    kaze4:  '四風連打',
    reach4: '四家立直',
    ron3:   '三家和了',
    kan4:   '四槓散了',
};

function pingju(attr, oya, fulou) {

    let sc  = attr.sc.split(',').map(x=> x * 100);
    let hai = [0,1,2,3].map(i=>
                    attr[`hai${i}`]
                        ? [ pai(attr[`hai${i}`].split(',')) ]
                                .concat(fulou[i]).join(',')
                        : ''
                );

    sc  = [ sc[1], sc[3], sc[5], sc[7] ];
    sc  = sc.concat(sc.splice(0, oya));
    hai = hai.concat(hai.splice(0, oya));

    let pingju = {
        name:    pingju_name[attr.type] || '流局',
        shoupai: hai,
        fenpei:  sc
    };

    return {pingju:pingju};
}

function convlog(xml, log_id) {

    const paipu = {};

    let log, oya, zimo, gang, baopai, lizhi, fulou;

    for (let tag of xml.match(/<.*?>/g)) {
        let [ , elem, attrlist ] = tag.match(/^<(\/?\w+)(.*?)\/?>$/);
        let attr = {};
        for (let attrstr of attrlist.match(/\w+=".*?"/g) || []) {
            let [ , key, value ] = attrstr.match(/^(\w+)="(.*?)"$/);
            attr[key] = value;
        }

        if (elem == 'mjloggm') {
            if (attr.ver != 2.3) console.error('*** Unknown version', attr.ver);
        }
        else if (elem == 'GO') {
            paipu.title = parse_type(attr.type);
            if (log_id) {
                if (log_id[0] == ':')
                        paipu.title  = log_id.substr(1);
                else    paipu.title += `\n${log_id}`;
            }
            if (type.sanma) throw new Error('Not Majiang log');
        }
        else if (elem == 'UN' && ! paipu.player) {
            paipu.player = parse_player(attr);
        }
        else if (elem == 'TAIKYOKU') {
            paipu.qijia = + attr.oya;
            paipu.log   = [];
        }
        else if (elem == 'INIT') {
            oya    = + attr.oya;
            zimo   = null;
            gang   = false;
            baopai = null;
            lizhi  = false;
            fulou  = [ [], [], [], [] ];
            log    = [ qipai(attr) ];
            paipu.log.push(log);
        }
        else if (elem.match(/^[TUVW]\d+$/)) {
            let l = (elem[0].charCodeAt(0) - 'T'.charCodeAt(0) + 4 - oya) % 4;
            let p = pai(elem.substr(1));
            if (gang) {
                log.push({gangzimo:{l:l,p:p}});
                gang = false;
            }
            else {
                log.push({zimo:{l:l,p:p}});
            }
            zimo = elem.substr(1);
            if (baopai) {
                log.push({kaigang:{baopai:baopai}});
                baopai = null;
            }
        }
        else if (elem.match(/^[DEFG]\d+$/)) {
            let l = (elem[0].charCodeAt(0) - 'D'.charCodeAt(0) + 4 - oya) % 4;
            let p = pai(elem.substr(1));
            if (elem.substr(1) == zimo) p += '_';
            if (lizhi)                  p += '*';
            log.push({dapai:{l:l,p:p}});
            lizhi = false;
            if (baopai) {
                log.push({kaigang:{baopai:baopai}});
                baopai = null;
            }
        }
        else if (elem == 'N') {
            let l = (+attr.who + 4 - oya) % 4;
            let m = mianzi(attr.m);
            if (m.match(/^[mpsz]\d{3}[\+\=\-]?\d$/)) {
                log.push({gang:{l:l,m:m}});
                gang = true;
            }
            else {
                log.push({fulou:{l:l,m:m}});
                if (m.match(/^[mpsz]\d{4}/)) gang = true;
                else                         zimo = null;
            }
            if (m.match(/^[mpsz]\d{3}[\+\=\-]\d$/)) {
                let o = m.replace(/\d$/,'');
                fulou[+attr.who] = fulou[+attr.who].map(n=> n == o ? m : n);
            }
            else {
                fulou[+attr.who].push(m);
            }
        }
        else if (elem == 'DORA') {
            if (baopai) {
                log.push({kaigang:{baopai:baopai}});
                baopai = null;
            }
            baopai = pai(attr.hai);
        }
        else if (elem == 'REACH') {
            lizhi = attr.step == 1;
        }
        else if (elem == 'AGARI') {
            log.push(hule(attr, oya));
        }
        else if (elem == 'RYUUKYOKU') {
            log.push(pingju(attr, oya, fulou));
        }
        if (attr.owari) {
            let owari = attr.owari.split(',');
            let defen = [ owari[0], owari[2], owari[4], owari[6] ]
                            .map(x=> x * 100);
            let point = [ owari[1], owari[3], owari[5], owari[7] ];

            let rank = [1,1,1,1];
            let q = paipu.qijia;
            for (let i = 0; i < 4; i++) {
                for (let j = i + 1; j < 4; j++) {
                    if (defen[(i+q)%4] < defen[(j+q)%4]) rank[(i+q)%4]++;
                    else                                 rank[(j+q)%4]++;
                }
            }

            paipu.defen = defen;
            paipu.point = point;
            paipu.rank  = rank;
        }
    }

    return paipu;
}

module.exports = convlog;
