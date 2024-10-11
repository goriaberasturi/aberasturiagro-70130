import cartModel from "../../models/carts.model.js";
import ProductMangerMongo from './products.manager.mongo.js';
import { isValidObjectId } from "mongoose";

class CartsManagerMongo {
    constructor() {
        this.model = cartModel;
        this.ps = new ProductMangerMongo();
    }

    getCarts = async () => this.model.find();
    getCart = async opts => this.model.findOne(opts).lean();
    createCart = async () => this.model.create({products: []});
    
    isProductOnCart = async (cid, pid) => {
        const cart = await this.getCart({_id: cid});
        return cart.products.some(prod => prod.product._id.toString() == pid);
    };
    
    addProductToCart = async (cid, product) => {
        const cart = await this.getCart({_id: cid});
        const pid = product.product;
        if(!await this.isValidId(pid)) throw Error('El Id del producto tiene un formato invalido');;
        const foundProduct = this.ps.getProduct({_id: pid});
        
        if(foundProduct) {
            if(isNaN(Number(product.quantity))) throw Error('La cantidad debe ser un numero');
            if(await this.isProductOnCart(cid, pid)) {
                return this.updateProductOnCart(cid, pid, {quantity: Number(product.quantity)});
                
            } else {
                if(Number(product.quantity) <= 0 ) throw Error('La cantidad de productos debe ser mayor que 0');
                cart.products.push({product: pid, quantity: Number(product.quantity)});
                
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
            if(isNaN(Number(quantity.quantity))) throw Error('La cantidad debe ser un numero');
            product.quantity += Number(quantity.quantity);

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

    isValidId = async id => isValidObjectId(id);
};

export default CartsManagerMongo;