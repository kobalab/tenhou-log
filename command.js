#!/usr/bin/env node

"use strict";

const yargs   = require('yargs');
const getlog  = require('./lib/getlog');
const convlog = require('./lib/convlog');

const argv = yargs
    .usage('Usage: $0 [--title=title] [--xml] <logid>')
    .option('title', { alias: 't', description: 'Title (optional)'})
    .option('xml', { alias: 'x', boolean: true, description: 'No conversion' })
    .demandCommand(1)
    .argv;

const multi = argv._.length > 1;
let paipu = [];

function convlogs() {

    if (! argv._.length) {
        process.stdout.write(
              argv.xml ? paipu.join('\n')
            : multi    ? JSON.stringify(paipu)
            :            JSON.stringify(paipu[0]));
        process.exit(0);
    }

    let arg = argv._.shift();
    let [ , id, title ] = (''+arg).match(/^(.*?)(:.*)?$/);

    title = title               ? title
          : argv.title && multi ? `:${argv.title}(${paipu.length + 1})`
          : argv.title          ? `:${argv.title}`
          :                       id;

    getlog(id)
        .then(xml=>{
            paipu.push(argv.xml ? xml : convlog(xml, title));
            convlogs();
        })
        .catch(()=>{
            console.error(`${id}: not found.`);
            process.exit(-1);
        });
}

convlogs();
