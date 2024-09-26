import { connect } from 'mongoose';

const connectDB = async () => {
    console.log('Connected to Database');
    await connect('mongodb+srv://goricarhue2015:baseecommerce123@cluster0.ft6cz.mongodb.net/aberasturi-agro');
}

export default connectDB;