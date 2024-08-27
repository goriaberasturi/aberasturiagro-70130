import { Router } from "express";
import CartsManagerMongo from "../../daos/MongoDb/carts.manager.mongo.js";

const router = Router();

const cartService = new CartsManagerMongo();

router.get('/', async (req, res) => {
    try {
        const carts = await cartService.getCarts();

        return res.status(200).send({status: 'success', payload: carts});
        
    } catch (error) {
        console.log(error);
    }
});

// Agregar un producto a un carrito, cuyo id es pasado por params
router.put('/:cid', async (req, res) => {
    try {
        const {body} = req;
        const {cid} = req.params;
        const cart = await cartService.getCart({_id: cid});

        if(!cart) return res.status(404).send({status: 'error', message: 'No se encontro un carrito con este id'});
        
        const addedProduct = await cartService.addProductToCart(cid, body);
        
        return res.status(200).send({status: 'success', payload: addedProduct});
        
    } catch (error) {
        console.log(error);
    }
});

// Incrementar la cantidad (pasada por body de la request) de un producto en un carrito (con sus respectivos id pasados por params).
router.put('/:cid/products/:pid', async (req, res) => {
    try {
        let {body} = req;
        if(isNaN(body.quantity)) return res.status(422).send({status: 'error', message: 'El incremento debe ser un numero'});

        body = {quantity: Number(body.quantity)};
        const {cid, pid} = req.params;
        const cart = await cartService.getCart({_id: cid});

        if(!cart) return res.status(404).send({status: 'error', message: 'No se encontro un carrito con este id'});
        
        const addedProduct = await cartService.updateProductOnCart(cid, pid, body);
        
        return res.status(200).send({status: 'success', payload: addedProduct});
        
    } catch (error) {
        console.log(error);
    }
});

// Eliminar todos los productos de un carrito, cuyo id es pasado por params
router.delete('/:cid', async (req, res) => {
    try {
        const {cid} = req.params;
        const cart = await cartService.getCart({_id: cid});
        
        if(!cart) return res.status(404).send({status: 'error', message: 'No se encontro un carrito con este id'});
        
        const deltedCart = await cartService.deleteAllProducts(cid);
        
        return res.status(200).send({status: 'success', payload: deltedCart});
        
    } catch (error) {
        console.log(error);
    }
});

// Eliminar un producto de un carrito(con sus respectivos id pasados por params)
router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const {cid, pid} = req.params;
        const cart = await cartService.getCart({_id: cid});
        
        if(!cart) return res.status(404).send({status: 'error', message: 'No se encontro un carrito con este id'});
        
        const addedProduct = await cartService.deleteProductOnCart(cid, pid);

        return res.status(200).send({status: 'success', payload: addedProduct});

    } catch (error) {
        console.log(error);
    }
});

export default router;