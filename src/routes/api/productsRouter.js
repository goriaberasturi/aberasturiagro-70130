import { Router } from 'express';
import ProductsManagerMongo from '../../daos/MongoDb/products.manager.mongo.js'

const router = Router();

// Configuracion

const productService = new ProductsManagerMongo();

router.get('/', async (req, res) => {
    try {
        const limit = req.query.limit;
        const productsDb = await productService.getProducts();

        if(!limit) return res.status(200).send({status:'success', payload: productsDb});
        if(isNaN(limit)) return res.status(400).send({status:'error', message: 'El limite debe ser un numero'});

        const productsFlt = await productService.getLimitedProducts(limit);
        return res.status(200).send({status:'success', payload: productsFlt});

    } catch (error) {
        console.log(error);
    }
});

router.get('/:pid', async (req, res) => {
    try {
        const {pid} = req.params;
        if(!await productService.isValidId(pid)) return res.status(400).send({status: 'error', message: 'Id invalido'});
        
        const product = await productService.getProduct({_id: pid});
        if(!product) return res.status(404).send({status: 'error', message: 'No se hallo un producto con este id'});
        
        return res.status(200).send({status: 'success', payload: product});
        
    } catch (error) {
        console.log(error);
    }
    
});

router.post('/', async (req, res) => {
    try {
        const {body} = req;
        if(!await productService.isFieldValid(body)) return res.status(400).send({status: 'error', message: 'Hay campos sin completar'});
        if(await productService.getProduct({code: body.code})) return res.status(409).send({status: 'error', message: 'Este codigo ya se encuentra registrado'});

        const response = await productService.createProduct(body);
        
        return res.status(200).send({status: 'success', payload: response});
        
    } catch (error) {
        console.log(error);
    }
});

router.put('/:pid', async (req, res) => {
    try {
        const {body} = req;
        const {pid} = req.params;
        if(!await productService.isValidId(pid)) return res.status(400).send({status: 'error', message: 'Id invalido'});
        if(!await productService.isFieldValid(body)) return res.status(400).send({status: 'error', message: 'Hay campos sin completar'});
        const foundCode = await productService.getProduct({code: body.code});
        if(foundCode) {
            if(foundCode._id.toString() != pid) return res.status(409).send({status: 'error', message: 'Este codigo ya se encuentra registrado'});
        }
        
        const response = await productService.updateProduct(pid, body);
        
        return res.status(200).send({status: 'success', payload: response});
        
    } catch (error) {
        console.log(error);
    }
});

router.delete('/:pid', async (req, res) => {
    try {
        const {pid} = req.params;
        if(!await productService.isValidId(pid)) return res.status(400).send({status: 'error', message: 'Id invalido'});
        
        const response = await productService.deleteProduct(pid);
        if(!response) return res.status(404).send({status: 'error', message: 'No se hallo un producto con este id'});

        return res.status(200).send({status: 'success', payload: response});

    } catch (error) {
        console.log(error);
    }
});

export default router;