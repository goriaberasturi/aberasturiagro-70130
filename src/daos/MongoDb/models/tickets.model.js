import { Schema, model } from 'mongoose';

const ticketCollection = 'purchase_tickets';

const generateCode = length => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';

    for(let i=0; i<length; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        code += chars[randomIndex];
    }
    return code;
}

const ticketSchema = new Schema({
    code: {
        type: String,
        unique: true,
        default: generateCode(13)
    },
    purchase_datetime: {
        type: Date,
        default: Date.now()
    },
    amount: {
        type: Number,
        required: true
    },
    purchaser: {
        type: String,
        required: true
    }
});

const ticketModel = model(ticketCollection, ticketSchema);

export default ticketModel;

