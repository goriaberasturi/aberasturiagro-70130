import { Router } from 'express';
import ProductManager from '../daos/FileSystem/ProductManagerFs.js';
import { rootDir } from '../utils/rootDir.js';

const router = Router();

// Configuracion

const productManager = new ProductManager();

router.get('/', async (req, res) => {
    try {
        const limit = req.query.limit;
        const productsDb = await productManager.getProducts();

        if(!limit) return res.send(productsDb);
        if(isNaN(limit)) return res.send(productsDb);
    
        const productsFlt = productsDb.splice(0, limit);

        return res.send({status: 'success' ,data: productsFlt});

    } catch (error) {
        console.log(error);
    }
});

router.get('/:pid', async (req, res) => {
    try {
        const productId = req.params.pid;
        const productsDb = await productManager.getProducts();
        
        if(isNaN(productId)) return res.send(productsDb);
        
        const [product] = await productManager.getProductById(productId);
        
        res.send({status: 'success' ,data: product});

    } catch (error) {
        console.log(error);
    }

});

router.post('/', async (req, res) => {
    try {
        const {body} = req;
        const newProduct = await productManager.addProducts(body);
        
        res.send({status: 'success', data: newProduct});

    } catch (error) {
        console.log(error);
    }
});

router.put('/:pid', async (req, res) => {
    try {
        const {body} = req;
        const productId = req.params.pid;
        const updatedProduct = await productManager.updateProduct(productId, body);

        res.send({status: 'success', data: updatedProduct});

    } catch (error) {
        console.log(error)
    }
});

router.delete('/:pid', async (req, res) => {
    try {
        const productId = req.params.pid;
        const deletedProduct = await productManager.deleteProduct(productId);

        res.send({status: 'success', data: deletedProduct});

    } catch (error) {
        console.log(error)
    }
});

export default router;