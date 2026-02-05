
const http = require('http');
const { handleStaticFiles } = require('./src/handlers/staticHandler');
const { handleApiCall } = require('./src/handlers/apiHandler');
const { handlePage } = require('./src/handlers/pageHandler');
const { fetchSingleProduct, getAllProducts, getProductsById} = require('./src/services/productService');
const {getSession} = require("./src/services/sessionService");

require('./src/listeners/pageListener');


const server = http.createServer( async (req, res) => {

    if(req.url.startsWith('/public/')) {
        handleStaticFiles(req, res);
        return;
    } else if(req.url.startsWith('/api/')) {
        handleApiCall(req, res);
        return;
    }

    if(req.url === '/') {
        const products = await getAllProducts();
        handlePage("home", {products: products}, req, res);
        return;
    } else if(req.url === '/about') {
        handlePage("about", {}, req, res);
        return;
    } else if(req.url === '/register') {
        handlePage("register", {}, req, res);
        return;
    } else if(req.url === '/login') {
        handlePage("login", {}, req, res);
        return
    } else if(req.url === '/cart') {

        const user = getSession(req);
        const products = await getProductsById(user.shoppingCart);

        console.log(products);

        handlePage("cart", {products: products}, req, res);
        return;
    }

    /**
     * /register
     *  -> form: email, sifra, potvrdjena (repeated password) sifra, checkbox "I agree with site rules"
     *
     *  /login
     *  -> form: email, sifra
     */

    const productMatch = req.url.match(/^\/product\/([\w-]+)$/);
    if(productMatch) {

        const slug = productMatch[1];
        const product = await fetchSingleProduct(slug);

        if(product) {
            handlePage("permalink", {product: product}, req, res);
            return;
        }
    }

    res.writeHead(404, { "Content-Type": 'text/plain' });
    return res.end("404 page not found");
});

server.listen(3000, () => console.log("Server is working on http://localhost:3000"));