import { productService, cartService } from "./../services/index.js";

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
                products: await this.pService.getProducts()
            });
        } catch (error) {
            console.log(error);
        }
    };

    products = async (req, res) => {
        try {
            const { limit = 10, pageNum, query = '' } = req.query;
            let filter = {};
            if (query) filter = { category: query };
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
            let prevLink = `http://localhost:8080/products?pageNum=${page - 1}`;
            let nextLink = `http://localhost:8080/products?pageNum=${page + 1}`;

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
    };

    realTimeProducts = async (req, res) => {
        try {
            const { docs } = await this.pService.searchProducts({}, {});
            res.render('realTimeProducts', {
                isMenu: true,
                isCart: true,
                rtpLink: 'active',
                products: docs
            });
        } catch (error) {
            console.log(error);
        }
    };

    cart = async (req, res) => {
        try {
            const { cid } = req.params
            const cart = await this.cService.getCart({ _id: cid });

            res.render('cart', {
                isMenu: true,
                isCart: false,
                cartLink: 'active',
                products: cart.products
            });
        } catch (error) {
            console.log(error);
        }
    };

    login = async (req, res) => {
        try {
            res.render('login', {
                isMenu: true,
                isCart: false
            });
        } catch (error) {
            console.log(error);
        }
    };

    register = async (req, res) => {
        try {
            res.render('register', {
                isMenu: true,
                isCart: false
            });
        } catch (error) {
            console.log(error);
        }
    };
}

export { ViewsControllers };