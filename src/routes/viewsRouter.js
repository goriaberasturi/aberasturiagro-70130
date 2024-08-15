import { Router } from "express";

import ProductManager from "../daos/FileSystem/ProductManagerFs.js";

const router = Router();
const pM = new ProductManager();

router.get('/', async (req, res) => {
    res.render('home', {
        isMenu: true,
        prodLink: ' active',
        products: await pM.getProducts()
    });
});

router.get('/products', async (req, res) => {
    res.render('home', {
        isMenu: true,
        prodLink: ' active',
        products: await pM.getProducts()
    });
});

router.get('/realTimeProducts', async (req, res) => {
    res.render('realTimeProducts', {
        isMenu: true,
        rtpLink: ' active',
        products: await pM.getProducts()
    });
});

export default router;