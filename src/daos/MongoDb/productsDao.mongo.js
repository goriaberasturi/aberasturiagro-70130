import productModel from "./models/products.model.js";
import { isValidObjectId } from "mongoose";

class ProductsDaoMongo {
    constructor() {
        this.model = productModel;
    }

    search = async (opts, {limit, page=1, sort=1}) => await this.model.paginate(opts, {limit, page, sort: {price: sort}, lean: true});
    get = async () => await this.model.find().lean();
    getBy = async opts => await this.model.findOne(opts);
    create = async newProduct => await this.model.create(newProduct);
    update = async  (filter, prodData) => await this.model.findByIdAndUpdate(filter, prodData);
    delete = async id => await this.model.findOneAndDelete({_id: id});
    getLimited = async limit => await this.model.find().limit(limit);
    isValidId = async id => isValidObjectId(id);
    isFieldValid = async (product) => Object.values(product).every(field => field !== null && field !== '' && field !== undefined);
}

export default ProductsDaoMongo;