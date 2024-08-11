import { Router } from "express";

import ProductManager from "../daos/FileSystem/ProductManagerFs.js";

import { rootDir } from "../utils/rootDir.js";
import path from 'path';

const router = Router();
const pM = new ProductManager();

router.get('/products', async (req, res) => {
    res.render('index', {
        isMenu: true,
        products: await pM.getProducts()
    });
});

router.get('/realTimeProducts', async (req, res) => {
    res.render('realTimeProducts', {
        isMenu: true,
        products: await pM.getProducts(),
        style: 'components/realTimeProducts.css'
    });
});

export default router;