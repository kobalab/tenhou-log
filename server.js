#!/usr/bin/env node

"use strict";

const express = require('express');
const getlog  = require('./lib/getlog');
const convlog = require('./lib/convlog');

const port = process.env.PORT || 8001;
const docs = process.env.DOCROOT;

const app = express();

app.get('/tenhou-log/:id.json', (req, res, next)=>{
    let id = req.params.id;
    getlog(id)
        .then(xml=>res.json(convlog(xml, id)))
        .catch(e=>next());
});
if (docs) app.use(express.static(docs));
app.use((req, res)=>res.status(404).send('<h1>Not Found</h1>'));

app.listen(port, ()=>console.log(`Server start on http://127.0.0.1:${port}`));
