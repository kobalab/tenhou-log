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

let id = argv._[0];

getlog(id)
    .then(xml=>{
            if (argv.xml) process.stdout.write(xml);
            else {
                let json = convlog(xml, id);
                if (argv.title) json.title = argv.title;
                process.stdout.write(JSON.stringify(json));
            }
        })
    .catch(()=>{ console.error(`${id}: not found.`); process.exit(-1) });
