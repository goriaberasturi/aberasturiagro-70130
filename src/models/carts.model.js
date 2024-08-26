import { Schema, model } from "mongoose";

const collection = 'carts';

const CartsSchema = new Schema({
    // userID:
    products: {
        type: [{
            product: {
                type: Schema.Types.ObjectId,
                ref: 'products'
            },
            quantity: {
                type: Number
            }
        }]
    }
});

// CartsSchema.pre('findOne', function() {
//     this.populate('products.product');
// });


const cartModel = model(collection, CartsSchema);

export default cartModel;