import { Router } from "express";
import CartManager from "../daos/FileSystem/CartManagerFs.js";

const router = Router();

const cartManager = new CartManager();

router.get('/', async (req, res) => {
    try {
        const limit = req.query.limit;
        const carts = await cartManager.getCarts();

        if(!limit) return res.send({status: 'success', data: carts});
        if(isNaN(limit)) return res.send({status: 'success', data: carts});

        const cartsFlt = carts.splice(0, limit);

        return res.send({status: 'success', data: cartsFlt});
        
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
        return res.send({status: 'success', data: cart});
        
    } catch (error) {
        console.log(error);
    }
});

router.post('/', async (req, res) => {
    try {
        const {body} = req; //Array de productos contenidos en el nuevo cart
        const newCart = await cartManager.addCarts(body);

        return res.send({status: 'success', data: newCart});

    } catch (error) {
        console.log(error);
    }
});

router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const {body} = req;
        const {cid, pid} = req.params;

        const addedProduct = await cartManager.addProdToCart(cid, pid, 1);

        res.send({status: 'success', data: addedProduct});

    } catch (error) {
        console.log(error);
    }
});

export default router;