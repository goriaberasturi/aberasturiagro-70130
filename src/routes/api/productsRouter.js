import {Router} from 'express';
import ProductsManagerMongo from '../../daos/MongoDb/products.manager.mongo.js'

const router = Router();

// Configuracion

const productService = new ProductsManagerMongo();

router.get('/', async (req, res) => {
    try {
        const {limit=10, pageNum, query = ''} = req.query;
        let filter = {};
        if(query) filter = {category: query};
        let {sort} = req.query;
        sort == 'desc' ? sort = -1 : sort = 1;

        const search = {limit, page: pageNum, sort};
        
        const {
            docs,
            totalPages,
            prevPage,
            nextPage,
            page,
            hasPrevPage,
            hasNextPage
        } = await productService.searchProducts(filter, search);

        // Base de prevLink y nextLink
        let prevLink = `http://localhost:8080/api/products?pageNum=${page-1}`;
        let nextLink = `http://localhost:8080/api/products?pageNum=${page+1}`;

        // Generacion de prevLink y nextLink
        for(let key in req.query) {
            if(key == 'pageNum') {
                continue;
            } else {
                prevLink += `&${key}=${req.query[key]}`;
                nextLink += `&${key}=${req.query[key]}`;
            }
        }
        hasPrevPage ? 'holis :3' : prevLink = null;
        hasNextPage ? 'holis :3' : nextLink = null;
        
        return res.status(200).send({
            status:'success',
            payload: docs,
            totalPages,
            prevPage,
            nextPage,
            page,
            hasPrevPage,
            hasNextPage,
            prevLink,
            nextLink
        });

    } catch(error) {
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