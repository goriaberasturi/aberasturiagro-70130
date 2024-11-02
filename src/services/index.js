import { UsersDao, ProductsDao, CartsDao } from './../daos/factory.js';
import { ProductsRepository } from './../repositories/products.repository.js';
import { UsersRepository } from './../repositories/users.repository.js';
import { CartsRepository } from './../repositories/carts.repository.js';

const userService = new UsersRepository(new UsersDao());
const productService = new ProductsRepository(new ProductsDao());
const cartService = new CartsRepository(new CartsDao());

export { userService, productService, cartService };