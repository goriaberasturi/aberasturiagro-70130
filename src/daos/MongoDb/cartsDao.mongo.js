import cartModel from "./models/carts.model.js";
import ProductDaoMongo from './productsDao.mongo.js';
import { isValidObjectId } from "mongoose";

class CartsDaoMongo {
    constructor() {
        this.model = cartModel;
        this.productService = new ProductDaoMongo();
    }

    get = async () => await this.model.find();
    getBy = async opts => await this.model.findOne(opts).lean();
    create = async () => await this.model.create({ products: [] });
    addItem = async (cid, product) => await this.model.findByIdAndUpdate(cid, { $push: { products: product } }, { new: true });
    updateItem = async (cid, pid, quantity) => await this.model.findOneAndUpdate({ _id: cid, 'products.product': pid }, { $inc: { 'products.$.quantity': quantity.quantity } }, { new: true });
    deleteItem = async (cid, pid) => await this.model.findByIdAndUpdate(cid, { $pull: { products: { product: pid } } }, { new: true });
    deleteAllItems = async cid => await this.model.findByIdAndUpdate({ _id: cid }, { products: [] });
    isValidId = async id => isValidObjectId(id);
    isProductOnCart = async (cid, pid) => {
        const cart = await this.getBy({ _id: cid });
        return cart.products.some(prod => prod.product._id.toString() == pid);
    };
};

export default CartsDaoMongo;