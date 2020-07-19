#!/usr/bin/env node

"use strict";

const yargs   = require('yargs');
const getlog  = require('./lib/getlog');
const convlog = require('./lib/convlog');

const argv = yargs
    .usage('Usage: $0 [--xml] <logid>')
    .option('xml', { alias: 'x', boolean: true, description: 'No conversion' })
    .demandCommand(1)
    .argv;

let id = argv._[0];

getlog(id)
    .then(xml=>process.stdout.write(
        argv.xml ? xml : JSON.stringify(convlog(xml, id))))
    .catch(()=>{ console.error(`${id}: not found.`); process.exit(-1) });
