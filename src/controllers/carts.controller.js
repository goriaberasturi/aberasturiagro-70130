import { productService, cartService } from './../services/index.js';

class CartsController {
    constructor() {
        this.pService = productService;
        this.cService = cartService;
    }

    getCarts = async (req, res) => {
        try {
            const carts = await this.cService.getCarts();
    
            return res.status(200).send({status: 'success', payload: carts});
            
        } catch (error) {
            console.log(error);
        }
    };

    addProduct = async (req, res) => {
        try {
            const {body} = req;
            const {cid} = req.params;
            if(!await this.cService.isValidId(cid)) return res.status(400).send({status: 'error', message: 'El Id del carrito no tiene un formato valido'});
    
            const cart = await this.cService.getCart({_id: cid});
    
            if(!cart) return res.status(404).send({status: 'error', message: 'No se encontro un carrito con este id'});
            if(!await this.pService.isValidId(body.product)) return res.status(400).send({status: 'error', message: 'El Id del producto no tiene un formato valido'});
            if(body.quantity <= 0) return res.status(400).send({status: 'error', message: 'La cantidad agregada debe ser mayor que 0'});
    
            const addedProduct = await this.cService.addProduct(cid, body);
            
            return res.status(200).send({status: 'success', payload: addedProduct});
            
        } catch (error) {
            console.log(error);
        }
    };

    updateOnCart = async (req, res) => {
        try {
            let {body} = req;
            if(isNaN(body.quantity)) return res.status(422).send({status: 'error', message: 'El incremento debe ser un numero'});
    
            body = {quantity: Number(body.quantity)};
            const {cid, pid} = req.params;
            if(!await this.cService.isValidId(cid)) return res.status(400).send({status: 'error', message: 'El Id del carrito no tiene un formato valido'});
            if(!await this.cService.isValidId(pid)) return res.status(400).send({status: 'error', message: 'El Id del producto no tiene un formato valido'});
    
            const cart = await this.cService.getCart({_id: cid});
    
            if(!cart) return res.status(404).send({status: 'error', message: 'No se encontro un carrito con este id'});
            if(!await this.cService.isProductOnCart(cid, pid)) return res.status(404).send({status: 'error', message: 'No se encontro un producto con este id en el carrito'});
            
            const addedProduct = await this.cService.updateProduct(cid, pid, body);
            
            return res.status(200).send({status: 'success', payload: addedProduct});
            
        } catch (error) {
            console.log(error);
        }
    };

    emptyCart = async (req, res) => {
        try {
            const {cid} = req.params;
            if(!await this.cService.isValidId(cid)) return res.status(400).send({status: 'error', message: 'El Id del carrito no tiene un formato valido'});
    
            const cart = await this.cService.getCart({_id: cid});
            
            if(!cart) return res.status(404).send({status: 'error', message: 'No se encontro un carrito con este id'});
            
            const deletedCart = await this.cService.deleteAllProducts(cid);
            
            return res.status(200).send({status: 'success', payload: deletedCart});
            
        } catch (error) {
            console.log(error);
        }
    };

    deleteFromCart = async (req, res) => {
        try {
            const {cid, pid} = req.params;
            if(!await this.cService.isValidId(cid)) return res.status(400).send({status: 'error', message: 'El Id del carrito no tiene un formato valido'});
            const cart = await this.cService.getCart({_id: cid});
            
            if(!await this.cService.isValidId(pid)) return res.status(400).send({status: 'error', message: 'El Id del producto no tiene un formato valido'});
            if(!cart) return res.status(404).send({status: 'error', message: 'No se encontro un carrito con este id'});
            if(!await this.cService.isProductOnCart(cid, pid)) return res.status(404).send({status: 'error', message: 'No se encontro un producto con este Id en el carrito indicado'});
            
            const addedProduct = await this.cService.deleteProduct(cid, pid);
    
            return res.status(200).send({status: 'success', payload: addedProduct});
    
        } catch (error) {
            console.log(error);
        }
    };
}

export { CartsController };