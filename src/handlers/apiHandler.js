
const { createUser, userExists, getUserByEmail } = require('../services/userService');
const bcrypt = require("bcrypt");

const querystring = require("node:querystring");

async function handleApiCall(req, res) {

    const urlMatch = req.url.match(/^\/api\/([\w-]+)$/);

    // api/register
    if(urlMatch[1] === 'register' && req.method === "POST") {

        let body = "";

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', async () => {

            const formData = querystring.parse(body);

            const errors = [];

            if(!formData.name || formData.name.length < 3) {
                errors.push("Name must be set and at least be 3 characters");
            }

            if(!formData.password || formData.password.length < 3) {
                errors.push("Password must be set and at least be 3 characters");
            }

            if(!formData.email || !formData.email.includes('@')) {
                errors.push("Email must be set and valid");
            }

            if(!formData.password_confirm || formData.password_confirm.length < 3) {
                errors.push("Password must be confirmed ");
            }

            if(!formData.rules) {
                errors.push("You must agree with site rules");
            }

            if(formData.password && formData.password_confirm) {
                if(formData.password !== formData.password_confirm) {
                    errors.push("Password must be same");
                }
            }

            if(errors.length === 0 && await userExists(formData.email)) {
                errors.push("This email is already taken");
            }

            if(errors.length > 0) {
                res.writeHead(400, { 'Content-Type': 'application/json'});
                return res.end(JSON.stringify(errors));
            }

            const password = await bcrypt.hash(formData.password, 10);

            createUser(formData.name, formData.email, password);

            res.writeHead(200, { 'Content-Type': 'application/json'});
            return res.end(JSON.stringify({success: true, message: "Created new user"}));
        });

        return;

    }
    else if(urlMatch[1] === 'login' && req.method === "POST") {

        let body = "";

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', async () => {

            const formData = querystring.parse(body);

            const errors = [];

            if(!formData.password || formData.password.length < 3) {
                errors.push("Password must be set and at least be 3 characters");
            }

            if(!formData.email || !formData.email.includes('@')) {
                errors.push("Email must be set and valid");
            }

            if(errors.length > 0) {
                res.writeHead(400, { 'Content-Type': 'application/json'});
                return res.end(JSON.stringify(errors));
            }

            const user = await getUserByEmail(formData.email);

            if(!user) {
                res.writeHead(400, { 'Content-Type': 'application/json'});
                return res.end(JSON.stringify({message: "This user doesn't exist"}));
            }

            const passwordMatch = await bcrypt.compare(formData.password, user.password);

            if(!passwordMatch) {
                res.writeHead(400, { 'Content-Type': 'application/json'});
                return res.end(JSON.stringify({message: "Wrong password"}));
            }

            res.writeHead(200, { 'Content-Type': 'application/json'});
            return res.end(JSON.stringify({success: true, message: "Logged in succesfully"}));
        });

        return;

    }

    const response = {success: true};
    const data = JSON.stringify(response);

    res.writeHead(200, { 'Content-Type' : 'application/json' });
    res.end(data);
}

module.exports = { handleApiCall };