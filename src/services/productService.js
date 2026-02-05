
const { pool } = require('./mysql');

async function getAllProducts() {
    const [rows] = await pool.query("SELECT * FROM products");
    return rows;
}

async function fetchSingleProduct(slug) {
    const [ rows ] = await pool.query("SELECT * FROM products WHERE slug = ? LIMIT 1", [slug]);
    return rows[0] || null;
}

async function getProductsById(productIds) {

    const placeholders = productIds.map(() => '?').join(','); // [0,1,2] =>  "?, ?, ?"

    const [ rows ] = await pool.query(`SELECT * FROM products WHERE id IN (${placeholders})`, productIds);
    return rows;
}

module.exports = { getAllProducts, fetchSingleProduct, getProductsById };
