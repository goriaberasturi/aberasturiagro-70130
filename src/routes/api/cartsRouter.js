import { Router } from "express";
import CartsManagerMongo from "../../daos/MongoDb/carts.manager.mongo.js";
import ProductsManagerMongo from "../../daos/MongoDb/products.manager.mongo.js";

const router = Router();

const cartService = new CartsManagerMongo();
const productService = new ProductsManagerMongo();

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
        if(!await cartService.isValidId(cid)) return res.status(400).send({status: 'error', message: 'El Id del carrito no tiene un formato valido'});

        const cart = await cartService.getCart({_id: cid});

        if(!cart) return res.status(404).send({status: 'error', message: 'No se encontro un carrito con este id'});
        if(!await productService.isValidId(body.product)) return res.status(400).send({status: 'error', message: 'El Id del producto no tiene un formato valido'});
        if(body.quantity <= 0) return res.status(400).send({status: 'error', message: 'La cantidad agregada debe ser mayor que 0'});

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
        if(!await cartService.isValidId(cid)) return res.status(400).send({status: 'error', message: 'El Id del carrito no tiene un formato valido'});
        if(!await cartService.isValidId(pid)) return res.status(400).send({status: 'error', message: 'El Id del producto no tiene un formato valido'});

        const cart = await cartService.getCart({_id: cid});

        if(!cart) return res.status(404).send({status: 'error', message: 'No se encontro un carrito con este id'});
        if(!await cartService.isProductOnCart(cid, pid)) return res.status(404).send({status: 'error', message: 'No se encontro un producto con este id en el carrito'});
        
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
        if(!await cartService.isValidId(cid)) return res.status(400).send({status: 'error', message: 'El Id del carrito no tiene un formato valido'});

        const cart = await cartService.getCart({_id: cid});
        
        if(!cart) return res.status(404).send({status: 'error', message: 'No se encontro un carrito con este id'});
        
        const deletedCart = await cartService.deleteAllProducts(cid);
        
        return res.status(200).send({status: 'success', payload: deletedCart});
        
    } catch (error) {
        console.log(error);
    }
});

// Eliminar un producto de un carrito(con sus respectivos id pasados por params)
router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const {cid, pid} = req.params;
        if(!await cartService.isValidId(cid)) return res.status(400).send({status: 'error', message: 'El Id del carrito no tiene un formato valido'});
        const cart = await cartService.getCart({_id: cid});
        
        if(!await cartService.isValidId(pid)) return res.status(400).send({status: 'error', message: 'El Id del producto no tiene un formato valido'});
        if(!cart) return res.status(404).send({status: 'error', message: 'No se encontro un carrito con este id'});
        if(!await cartService.isProductOnCart(cid, pid)) return res.status(404).send({status: 'error', message: 'No se encontro un producto con este Id en el carrito indicado'});
        
        const addedProduct = await cartService.deleteProductOnCart(cid, pid);

        return res.status(200).send({status: 'success', payload: addedProduct});

    } catch (error) {
        console.log(error);
    }
});

export default router;