import { connect } from 'mongoose';

const connectDB = async () => {
    console.log('Connected to Database');
    await connect('mongodb+srv://goricarhue2015:Capitalismo34_@cluster0.ft6cz.mongodb.net/');
}

export default connectDB;