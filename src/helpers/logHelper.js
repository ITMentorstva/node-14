
const fs = require('fs');
const path = require('path');


function logFile(file, message) {

    const now = new Date().toISOString();
    const formattedMessage = `[${now}] ${message} \n`;
    const logPath = path.join(__dirname, `../../storage/logs/${file}.log`);

    fs.appendFile(logPath, formattedMessage, (err) => console.log(err));
}

module.exports = logFile;
