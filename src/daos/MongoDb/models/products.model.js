import { Schema, model } from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

const collection = 'products';

const ProductSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    thumbnails: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        required: true
    },
    creationDate: {
        type: Date,
        default: Date.now()
    }
});

ProductSchema.plugin(mongoosePaginate);
const productsModel = model(collection, ProductSchema);

export default productsModel;