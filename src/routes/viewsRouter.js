import { Router } from "express";

// import ProductManager from "../daos/FileSystem/ProductManagerFs.js";
import ProductManagerMongo from '../daos/MongoDb/products.manager.mongo.js';


const router = Router();
const {getProducts} = new ProductManagerMongo();

// Rutas home
router.get('/', async (req, res) => {
    res.render('home', {
        isMenu: true,
        prodLink: ' active',
        products: await getProducts()
    });
});

// Rutas products
router.get('/products', async (req, res) => {
    res.render('home', {
        isMenu: true,
        prodLink: ' active',
        products: await getProducts()
    });
});

// Rutas real time products
router.get('/realTimeProducts', async (req, res) => {

    res.render('realTimeProducts', {
        isMenu: true,
        rtpLink: ' active',
        products: await getProducts()
    });
});

export default router;