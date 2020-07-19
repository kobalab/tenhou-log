#!/usr/bin/env node

"use strict";

const yargs   = require('yargs');
const express = require('express');
const getlog  = require('./lib/getlog');
const convlog = require('./lib/convlog');

const argv = yargs
    .option('port',    { alias: 'p', default: 8001           })
    .option('baseurl', { alias: 'b', default: '/tenhou-log/' })
    .option('docroot', { alias: 'd'                          })
    .argv;

const port = argv.port;
const base = (''+argv.baseurl)
                .replace(/^(?!\/.*)/, '/$&')
                .replace(/\/$/, '') + '/';
const docs = argv.docroot;

const app = express();

app.get(`${base}:id.json`, (req, res, next)=>{
    let id = req.params.id;
    getlog(id)
        .then(xml=>res.json(convlog(xml, id)))
        .catch(e=>next());
});
app.get(`${base}:id.xml`, (req, res, next)=>{
    let id = req.params.id;
    getlog(id)
        .then(xml=>res.type('application/xml').end(xml))
        .catch(e=>next());
});
if (docs) app.use(express.static(docs));
app.use((req, res)=>res.status(404).send('<h1>Not Found</h1>'));

app.listen(port,
    ()=>console.log(
        `Server start on http://127.0.0.1:${port}${base}`,
        docs ? `(docroot=${docs})` : ''));
