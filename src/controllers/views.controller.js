import { productService, cartService } from "./../services/index.js";
import { config } from './../config/index.js';

class ViewsControllers {
    constructor() {
        this.pService = productService;
        this.cService = cartService;
    }

    home = async (req, res) => {
        try {
            res.render('home', {
                isMenu: true,
                prodLink: 'active',
                products: await this.pService.getProducts(),
                cart: req.user.cart
            });
        } catch (error) {
            console.log(error);
        }
    };

    products = async (req, res) => {
        try {
            const { limit = 10, pageNum, query = '' } = req.query;
            let filter = {status: true};
            if (query) filter.category = query;
            let { sort } = req.query;
            sort == 'desc' ? sort = -1 : sort = 1;

            const search = { limit, page: pageNum, sort };

            const {
                docs,
                prevPage,
                nextPage,
                page,
                hasPrevPage,
                hasNextPage
            } = await this.pService.searchProducts(filter, search);

            // Base de prevLink y nextLink
            let prevLink = `http://localhost:${config.port}/products?pageNum=${page - 1}`;
            let nextLink = `http://localhost:${config.port}/products?pageNum=${page + 1}`;

            // Generacion de prevLink y nextLink
            for (let key in req.query) {
                if (key == 'pageNum') {
                    continue;
                } else {
                    prevLink += `&${key}=${req.query[key]}`;
                    nextLink += `&${key}=${req.query[key]}`;
                }
            };

            hasPrevPage ? 'holis :3' : prevLink = null;
            hasNextPage ? 'holis :3' : nextLink = null;

            const isCart = req.user ? true : false;
            const cart = isCart ? req.user.cart : null;
            const isUser = isCart ? req.user.role == 'user' : null;
            const isLoggedIn = req.user ? true : false;
            const userCart = await this.cService.getCart({_id: cart});
            const cartQty = isLoggedIn ? userCart.products.length : null;

            res.render('home', {
                docTitle: 'Home | Productos',
                isMenu: true,
                isCart,
                cartQty,
                isLoggedIn,
                isUser,
                prodLink: 'active',
                showUserBtn: true,
                products: docs,
                cart,
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
    };

    realTimeProducts = async (req, res) => {
        try {
            const { docs } = await this.pService.searchProducts({}, {});
            const isLoggedIn = req.user ? true : false;

            res.render('realTimeProducts', {
                docTitle: 'Productos | ABM',
                isMenu: true,
                rtpLink: 'active',
                isCart: true,
                showUserBtn: true,
                isLoggedIn,
                products: docs,
                cart: req.user.cart
            });
        } catch (error) {
            console.log(error);
        }
    };

    editProducts = async (req, res) => {
        try {
            const { pid } = req.params;
            const { docs } = await this.pService.searchProducts({_id: pid}, {});
            const product = docs[0];
            let isActive = product.status;
            isActive ? isActive = 'checked' : isActive = null;

            const isLoggedIn = req.user ? true : false;

            res.render('editProducts', {
                docTitle: 'Productos | Modificacion',
                isMenu: true,
                rtpLink: 'active',
                showUserBtn: true,
                isLoggedIn,
                product,
                isActive
            });
        } catch (error) {
            console.log(error)
        }
    }

    cart = async (req, res) => {
        try {
            const { cid } = req.params
            const cart = await this.cService.getCart({ _id: cid });
            const isConfirm = cart.products.length != 0;

            const isLoggedIn = req.user ? true : false;
            
            res.render('cart', {
                docTitle: 'Carrito',
                isMenu: true,
                isCart: false,
                isLoggedIn,
                isConfirm,
                showUserBtn: true,
                products: cart.products
            });
        } catch (error) {
            console.log(error);
        }
    };

    login = async (req, res) => {
        try {
            res.render('login', {
                docTitle: 'Login',
                isMenu: true,
                isCart: false,
                showUserBtn: false
            });
        } catch (error) {
            console.log(error);
        }
    };

    register = async (req, res) => {
        try {
            res.render('register', {
                docTitle: 'Registrarse',
                isMenu: true,
                isCart: false,
                showUserBtn: false
            });
        } catch (error) {
            console.log(error);
        }
    };
}

export { ViewsControllers };