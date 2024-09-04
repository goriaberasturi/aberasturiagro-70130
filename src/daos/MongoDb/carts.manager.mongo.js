import cartModel from "../../models/carts.model.js";
import ProductMangerMongo from './products.manager.mongo.js';

class CartsManagerMongo {
    constructor() {
        this.model = cartModel;
        this.ps = new ProductMangerMongo();
    }

    getCarts = async () => this.model.find();
    getCart = async opts => this.model.findOne(opts).lean();
    createCart = async newCart => this.model.create(newCart);
    
    isProductOnCart = async (cid, pid) => {
        const cart = await this.getCart({_id: cid});
        return cart.products.some(prod => prod.product._id.toString() == pid);
    };
    
    addProductToCart = async (cid, product) => {
        const cart = await this.getCart({_id: cid});
        const pid = product.product;
        const foundProduct = this.ps.getProduct({_id: pid});
        
        if(foundProduct) {
            if(await this.isProductOnCart(cid, pid)) {
                return this.updateProductOnCart(cid, pid, {quantity: product.quantity});
                
            } else {
                cart.products.push({product: pid, quantity: product.quantity});
                
                return await this.model.findByIdAndUpdate({_id: cid}, cart);
            };
        } else {
            throw Error('No se encontro un producto con el id indicado');
        };
    };
    
    updateProductOnCart = async (cid, pid, quantity) => {
        const cart = await this.getCart({_id: cid});
        const product = cart.products.find(prod => prod.product._id.toString() == pid);
        
        if(product) {
            product.quantity += quantity.quantity;
            if(product.quantity <= 0) throw Error('La cantidad de producto en el carrito es menor o igua la 0');

            return await this.model.findByIdAndUpdate({_id: cid}, cart);
        } else {
            throw Error('No se encontro un producto con el id indicado');
        }
    };

    deleteAllProducts = async cid => await this.model.findByIdAndUpdate({_id: cid}, {products: []});
    
    deleteProductOnCart = async (cid, pid) => {
        const cart = await this.getCart({_id: cid});
        const productIndex = cart.products.findIndex(prod => prod.product._id.toString() == pid);
        
        if(productIndex !== -1) {
            cart.products.splice(productIndex, 1);
            return await this.model.findByIdAndUpdate({_id: cid}, cart);
        } else {
            throw Error('No se encontro un producto con el id indicado');
        }
    };
};

export default CartsManagerMongo;