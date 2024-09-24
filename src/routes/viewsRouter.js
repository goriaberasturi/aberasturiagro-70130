import { Router } from "express";
import ProductManagerMongo from '../daos/MongoDb/products.manager.mongo.js';
import CartsManagerMongo from "../daos/MongoDb/carts.manager.mongo.js";

const router = Router();
const productService = new ProductManagerMongo;
const cartService = new CartsManagerMongo;

// Rutas home
router.get('/', async (req, res) => {
    try {
        res.render('home', {
            isMenu: true,
            prodLink: 'active',
            products: await productService.getProducts()
        });
    } catch (error) {
        console.log(error);
    }
});

// Rutas products
router.get('/products', async (req, res) => {
    try {
        const {limit=10, pageNum, query = ''} = req.query;
        let filter = {};
        if(query) filter = {category: query};
        let {sort} = req.query;
        sort == 'desc' ? sort = -1 : sort = 1;

        const search = {limit, page: pageNum, sort};
        
        const {
            docs,
            prevPage,
            nextPage,
            page,
            hasPrevPage,
            hasNextPage
        } = await productService.searchProducts(filter, search);

        // Base de prevLink y nextLink
        let prevLink = `http://localhost:8080/products?pageNum=${page-1}`;
        let nextLink = `http://localhost:8080/products?pageNum=${page+1}`;

        // Generacion de prevLink y nextLink
        for(let key in req.query) {
            if(key == 'pageNum') {
                continue;
            } else {
                prevLink += `&${key}=${req.query[key]}`;
                nextLink += `&${key}=${req.query[key]}`;
            }
        };

        hasPrevPage ? 'holis :3' : prevLink = null;
        hasNextPage ? 'holis :3' : nextLink = null;

        res.render('home', {
            isMenu: true,
            isCart: true,
            prodLink: 'active',
            products: docs,
            prevPage,
            nextPage,
            page,
            hasPrevPage,
            hasNextPage,
            prevLink,
            nextLink
        });
    } catch (error) {
        console.log(error);
    }
});

// Rutas real time products
router.get('/realTimeProducts', async (req, res) => {
    try {
        const {docs} = await productService.searchProducts({}, {});
        res.render('realTimeProducts', {
            isMenu: true,
            isCart: true,
            rtpLink: 'active',
            products: docs
        });
    } catch (error) {
        console.log(error);
    }
});

// Rutas cart
router.get('/carts/:cid', async (req, res) => {
    try {
        const {cid} = req.params;
        const cart = await cartService.getCart({_id: cid});
    
        res.render('cart', {
            isMenu: true,
            isCart: false,
            cartLink: ' active',
            products: cart.products
        });
    } catch (error) {
        console.log(error);
    }
});

// Ruta login
router.get('/login', async (req, res) => {
    try {
        res.render('login', {
            isMenu: true,
            isCart: false
        });
    } catch (error) {
        console.log(error);
    }
});

router.post('/login', async (req, res) => {
    console.log(req.body);
    res.redirect('/products');
})

export default router;