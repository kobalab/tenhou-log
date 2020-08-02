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

let [ , id, title ] = argv._[0].match(/^(.*?)(:.*)?$/);
if (! title) title = argv.title ? ':' + argv.title : id;

getlog(id)
    .then(xml=>process.stdout.write(
        argv.xml ? xml : JSON.stringify(convlog(xml, title))))
    .catch(()=>{ console.error(`${id}: not found.`); process.exit(-1) });
