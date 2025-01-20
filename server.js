#!/usr/bin/env node

"use strict";

const yargs   = require('yargs');
const express = require('express');
const getlog  = require('./lib/getlog')();
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

app.get(`${base}:id.json:title(:.{0,})?`, (req, res, next)=>{
    let id = req.params.id;
    let title = req.params.title || id;
    getlog(id)
        .then(xml=>res.json(convlog(xml, title)))
        .catch(e=>{
            if      (e == 404) next();
            else if (e == 500) res.status(502).send(`<h1>Bad Gateway</h1>`)
            else               res.status(415).send(`<h1>${e.message}</h1>`);
        });
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
        docs ? `(docroot=${docs})` : '')
).on('error', (e)=>{
    console.error(''+e);
    process.exit(-1);
});
