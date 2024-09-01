import productModel from "../../models/products.model.js";
import { isValidObjectId } from "mongoose";

class ProductsManagerMongo {
    constructor() {
        this.model = productModel;
    }

    searchProducts = async (opts, {limit, page=1, sort=1}) => await this.model.paginate(opts, {limit, page, sort: {price: sort}, lean: true});
    getProducts = async () => await this.model.find().lean();
    createProduct = async newProduct => await this.model.create(newProduct);
    updateProduct = async  (id, updtFields) => await this.model.findByIdAndUpdate({_id: id}, updtFields);
    deleteProduct = async id => await this.model.findOneAndDelete({_id: id});
    
    getProduct = async opts => await this.model.findOne(opts);

    getLimitedProducts = async limit => await this.model.find().limit(limit);

    isValidId = async id => isValidObjectId(id);

    isFieldValid = async (product) => Object.values(product).every(field => field !== null && field !== '' && field !== undefined);
}

export default ProductsManagerMongo;