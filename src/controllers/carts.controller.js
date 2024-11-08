import { productService, cartService, ticketService } from './../services/index.js';

class CartsController {
    constructor() {
        this.pService = productService;
        this.cService = cartService;
        this.tService = ticketService;
    }

    getCarts = async (req, res) => {
        try {
            const carts = await this.cService.getCarts();

            return res.status(200).send({ status: 'success', payload: carts });

        } catch (error) {
            console.log(error);
        }
    };

    addProduct = async (req, res) => {
        try {
            const { body, user } = req;
            const cid = user.cart;
            if (!await this.cService.isValidId(cid)) return res.status(400).send({ status: 'error', message: 'El Id del carrito no tiene un formato valido' });

            const cart = await this.cService.getCart({ _id: cid });

            if (!cart) return res.status(404).send({ status: 'error', message: 'No se encontro un carrito con este id' });
            if (!await this.pService.isValidId(body.product)) return res.status(400).send({ status: 'error', message: 'El Id del producto no tiene un formato valido' });
            if (body.quantity <= 0) return res.status(400).send({ status: 'error', message: 'La cantidad agregada debe ser mayor que 0' });

            if (await this.cService.isProductOnCart(cid, body.product)) {
                const addedProduct = await this.cService.updateProduct(cid, body.product, { quantity: body.quantity });
                return res.status(200).send({ status: 'success', payload: addedProduct })
            }

            const addedProduct = await this.cService.addProduct(cid, body);

            res.status(200).send({ status: 'success', payload: addedProduct });

        } catch (error) {
            console.log(error);
        }
    };

    updateOnCart = async (req, res) => {
        try {
            let { body } = req;
            if (isNaN(body.quantity)) return res.status(422).send({ status: 'error', message: 'El incremento debe ser un numero' });

            body = { quantity: Number(body.quantity) };
            const { pid } = req.params;
            const cid = req.user.cart;
            if (!await this.cService.isValidId(cid)) return res.status(400).send({ status: 'error', message: 'El Id del carrito no tiene un formato valido' });
            if (!await this.cService.isValidId(pid)) return res.status(400).send({ status: 'error', message: 'El Id del producto no tiene un formato valido' });

            const cart = await this.cService.getCart({ _id: cid });

            if (!cart) return res.status(404).send({ status: 'error', message: 'No se encontro un carrito con este id' });
            if (!await this.cService.isProductOnCart(cid, pid)) return res.status(404).send({ status: 'error', message: 'No se encontro un producto con este id en el carrito' });

            const addedProduct = await this.cService.updateProduct(cid, pid, body);

            return res.status(200).send({ status: 'success', payload: addedProduct });

        } catch (error) {
            console.log(error);
        }
    };

    emptyCart = async (req, res) => {
        try {
            const { cid } = req.params;
            if (!await this.cService.isValidId(cid)) return res.status(400).send({ status: 'error', message: 'El Id del carrito no tiene un formato valido' });

            const cart = await this.cService.getCart({ _id: cid });

            if (!cart) return res.status(404).send({ status: 'error', message: 'No se encontro un carrito con este id' });

            const deletedCart = await this.cService.deleteAllProducts(cid);

            return res.status(200).send({ status: 'success', payload: deletedCart });

        } catch (error) {
            console.log(error);
        }
    };

    deleteFromCart = async (req, res) => {
        try {
            const { pid } = req.params;
            const cid = req.user.cart;
            if (!await this.cService.isValidId(cid)) return res.status(400).send({ status: 'error', message: 'El Id del carrito no tiene un formato valido' });
            const cart = await this.cService.getCart({ _id: cid });

            if (!await this.cService.isValidId(pid)) return res.status(400).send({ status: 'error', message: 'El Id del producto no tiene un formato valido' });
            if (!cart) return res.status(404).send({ status: 'error', message: 'No se encontro un carrito con este id' });
            if (!await this.cService.isProductOnCart(cid, pid)) return res.status(404).send({ status: 'error', message: 'No se encontro un producto con este Id en el carrito indicado' });

            const deletedProduct = await this.cService.deleteProduct(cid, pid);

            return res.status(200).send({ status: 'success', payload: deletedProduct });

        } catch (error) {
            console.log(error);
        }
    };

    purchaseCart = async (req, res) => {
        try {
            const cid = req.user.cart;
            const cart = await this.cService.getCart({ _id: cid });
            const { products } = cart;

            let processed = [];
            const unprocessed = [];
            if (products.some(prod => prod.quantity > prod.product.stock)) {
                products.forEach(p => p.quantity > p.product.stock ? unprocessed.push(p.product._id) : processed.push(p));
            } else {
                processed = products;
            };

            if(processed.length != 0) {
                let amount = 0;
                processed.forEach(async p => {
                    amount += p.quantity * p.product.price;
                    p.product['stock'] -= p.quantity;
                    if(p.product['stock'] == 0) p.product['status'] = false;
                    await this.pService.updateProduct({_id: p.product._id}, p.product);
                    await this.cService.deleteProduct(cid, p.product._id);
                });
    
                const result = await this.tService.createTicket({amount, purchaser: req.user.email});

                return res.send({ status: 'success', payload: result, unprocessed });
            } else {
                console.log(unprocessed)
                return res.status(409).send({ status: 'error', message: 'No se pudieron procesar algunos productos', unprocessed });
            }

        } catch (error) {
            console.log(error);
        }
    }
}

export { CartsController };