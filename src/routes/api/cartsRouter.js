import { Router } from "express";
import CartManager from "../../daos/FileSystem/CartManagerFs.js";
import CartsManagerMongo from "../../daos/MongoDb/carts.manager.mongo.js";

const router = Router();

const cartManager = new CartManager();
const cartService = new CartsManagerMongo();

router.get('/', async (req, res) => {
    try {
        const carts = await cartService.getCarts();

        return res.send({status: 'success', payload: carts});
        
    } catch (error) {
        console.log(error);
    }
});

router.get('/:cid', async (req, res) => {
    try {
        const carts = await cartManager.getCarts();
        const {cid} = req.params;
        if(!cid) return res.send({status: 'success', data: carts});
        
        const [cart] = await cartManager.getCartById(cid);
        return res.send({status: 'success', payload: cart});
        
    } catch (error) {
        console.log(error);
    }
});

router.put('/:cid', async (req, res) => {
    try {
        const {body} = req;
        const {cid} = req.params;

        const addedProduct = await cartService.addProductToCart(cid, body);

        res.send({status: 'success', payload: addedProduct});

    } catch (error) {
        console.log(error);
    }
});

router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const {body} = req;
        const {cid, pid} = req.params;

        const addedProduct = await cartService.updateProductOnCart(cid, pid, body);

        res.send({status: 'success', payload: addedProduct});

    } catch (error) {
        console.log(error);
    }
});

router.delete('/:cid', async (req, res) => {
    try {
        const {cid} = req.params;

        const deltedCart = await cartService.deleteAllProducts(cid);

        res.send({status: 'success', payload: deltedCart});

    } catch (error) {
        console.log(error);
    }
});

router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const {cid, pid} = req.params;

        const addedProduct = await cartService.deleteProductOnCart(cid, pid);

        res.send({status: 'success', payload: addedProduct});

    } catch (error) {
        console.log(error);
    }
});

export default router;