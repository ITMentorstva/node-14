
const path = require('path');
const emitter = require('../events/emitter');
const ejs = require('ejs');
const { getSession } = require("../services/sessionService");

function handlePage(page, data, req, res) {

    const pagePath = path.join(__dirname, '../..', 'views/pages/'+page+'.ejs');
    const layoutPath = path.join(__dirname, '../..', 'views/layout.ejs');
    const userSession = getSession(req);

    ejs.renderFile(pagePath, {...data, user: userSession}, (err, html) => {

        if(err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            emitter.emit("page:fail");
            return res.end("Error loading file");
        }

        ejs.renderFile(layoutPath, {body: html, user: userSession}, (err, finalHtml) => {

            if(err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                emitter.emit("page:fail");
                return res.end("Error loading file");
            }

            emitter.emit("page:success");

            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(finalHtml);

        });
    });
}


module.exports = { handlePage };