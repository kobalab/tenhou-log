#!/usr/bin/env node

"use strict";

const getlog  = require('./lib/getlog');
const convlog = require('./lib/convlog');

let id = process.argv[2];
if (! id) {
    console.error('Usage: tenhou-log logid');
    return;
}

getlog(id)
    .then(xml=>process.stdout.write(JSON.stringify(convlog(xml, id))))
    .catch(()=>console.error(`${id}: not found.`));
