import { connect } from 'mongoose';

class MongoSingleton {
    static #instance;

    constructor() {
        connect(process.env.MONGO_URL);
    }

    static getInstance() {
        if (this.#instance) {
            console.log('Already connected to Database');
            return this.#instance;
        }

        this.#instance = new MongoSingleton();
        console.log('Successfully connected to Database');
        return this.#instance;
    }
}

export { MongoSingleton }