import Daos from './../daos/factory.js';

const userService = new Daos.UsersDao();
const productService = new Daos.ProductsDao();
const cartService = new Daos.CartsDao();

export { userService, productService, cartService };