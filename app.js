import express from 'express';
import ProductManager from './Products/ProductManager.js';

const PORT = 8080;
const productManager = new ProductManager('./Products/products.json');

const app = express();

app.use(express.urlencoded({extended: true}));

app.get('/products', async (req, res) => {
    const limit = req.query.limit;
    const products = await productManager.getProducts();

    if(!limit) return res.send(products);
    if(isNaN(limit)) return res.send(products);

    const productsFlt = products.splice(0, limit);

    res.send(productsFlt);
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