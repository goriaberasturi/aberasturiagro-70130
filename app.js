import express from 'express';
import ProductManager from './Products/ProductManager.js';

const PORT = 8080;
const productManager = new ProductManager('./Products/products.json');

const app = express();

app.use(express.urlencoded({extended: true}));

app.get('/products', async (req, res) => {
    const products = await productManager.getProducts();
    res.send(products);
});

app.get('/products/:pid', async (req, res) => {
    const productId = req.params.pid;
    const products = await productManager.getProducts();
    if(isNaN(productId)) return res.send(products);

    const [product] = await productManager.getProductById(productId);
    res.send(product);
});

app.listen(PORT, () => {
    console.log(`Servidor en puerto ${PORT}`);
});