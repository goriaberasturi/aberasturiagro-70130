import { Router } from "express";
import ProductManagerMongo from '../daos/MongoDb/products.manager.mongo.js';
import CartsManagerMongo from "../daos/MongoDb/carts.manager.mongo.js";

const router = Router();
const productService = new ProductManagerMongo;
const cartService = new CartsManagerMongo;

// Rutas home
router.get('/', async (req, res) => {
    res.render('home', {
        isMenu: true,
        prodLink: ' active',
        products: await productService.getProducts()
    });
});

// Rutas products
router.get('/products', async (req, res) => {
    res.render('home', {
        isMenu: true,
        prodLink: ' active',
        products: await productService.getProducts()
    });
});

// Rutas real time products
router.get('/realTimeProducts', async (req, res) => {
    res.render('realTimeProducts', {
        isMenu: true,
        rtpLink: ' active',
        products: await productService.getProducts()
    });
});

// Rutas cart
router.get('/carts/:cid', async (req, res) => {
    const {cid} = req.params;
    const cart = await cartService.getCart({_id: cid});

    res.render('cart', {
        isMenu: true,
        cartLink: ' active',
        products: cart.products
    });
});

export default router;