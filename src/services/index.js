import { UsersDao, ProductsDao, CartsDao, TicketsDao } from './../daos/factory.js';
import { ProductsRepository } from './../repositories/products.repository.js';
import { UsersRepository } from './../repositories/users.repository.js';
import { CartsRepository } from './../repositories/carts.repository.js';
import { TicketsRepository } from './../repositories/tickets.repository.js';

const userService = new UsersRepository(new UsersDao());
const productService = new ProductsRepository(new ProductsDao());
const cartService = new CartsRepository(new CartsDao());
const ticketService = new TicketsRepository(new TicketsDao());

export { userService, productService, cartService, ticketService };