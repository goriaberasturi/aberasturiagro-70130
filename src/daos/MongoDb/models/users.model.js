import {Schema, SchemaType, model} from 'mongoose';

const usersCollection = 'users';

// Definir el schema de nuestros documentos

const userSchema = new Schema({
    first_name: String,
    last_name: String,
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    birthday: {
        type: Date,
        required: true
    },
    cart: {
        type: Schema.Types.ObjectId,
        ref: 'carts'
    },
    role: {
        type: String,
        enum: ['user', 'user-premium', 'admin'],
        default: 'user'
    }
});

const usersModel = model(usersCollection, userSchema);

export default usersModel;