import { config, connectDb } from './../config/index.js';

let ProductsDao;
let CartsDao;
let UsersDao;

switch (config.persistence) {
    case 'MEMORY':
        console.log('Falta persistencia en memoria');
        break;

    case 'FILESYSTEM':
        const ProductsDaoFs = (await import('./FileSystem/ProductsDao.fs.js')).default;
        ProductsDao = ProductsDaoFs;
        const CartsDaoFs = (await import('./FileSystem/CartsDao.fs.js')).default;
        CartsDao = CartsDaoFs;
        break;

    default:
        connectDb();
        const ProductsDaoMongo = (await import('./MongoDb/productsDao.mongo.js')).default;
        ProductsDao = ProductsDaoMongo;
        const CartsDaoMongo = (await import('./MongoDb/cartsDao.mongo.js')).default;
        CartsDao = CartsDaoMongo;
        const UsersDaoMongo = (await import('./MongoDb/usersDao.mongo.js')).default;
        UsersDao = UsersDaoMongo;
        break;
}

export { ProductsDao, CartsDao, UsersDao };