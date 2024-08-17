import fs from 'fs';
import ProductManager from './ProductManagerFs.js';
const ruta = './data/carts.json';
const rutaTest = './Proyecto Final/data/carts.json';

class CartManager {
    constructor(){
        this.path = ruta;
    }

    // Devuelve un array que contiene todos los carts. Si no existe el archivo retorna un array vacio
    async getCarts() {
        try {
            const result = await fs.promises.readFile(this.path, 'utf-8');
            return JSON.parse(result);

        } catch (error) {
            return [];
        }
    }

    // Devuelve el cart cuyo id se paso por parametro y el array de carts. Si no lo encuentra devuelve un error
    async getCartById(id) {
        try {
            const carts = await this.getCarts();
            const cart = carts.find(cart => cart.id == id);
            
            if (cart) {
                return [cart, carts];
            } else {
                throw new Error('Cart ID was not found');
            }

        } catch (error) {
            return console.log(`ID ${error}`);
        }
    }

    // Agrega al array de carts el cart pasado por parametro y lo retorna
    async addCarts(cart) {
        try {
            const carts = await this.getCarts();
            const addedCart = {}
            
            if(carts.length === 0) {
                addedCart.id = 1;
            } else {
                addedCart.id = Math.max(...carts.map(prod => prod.id)) + 1;
            }

            addedCart.products = cart;

            carts.push(addedCart);

            await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2), 'utf-8');
            return cart;

        } catch (error) {
            console.log(error);
        }
    }

    // Valida si el id del productro pasado por parametro esta en el cart cuyo id se paso por parametro. Devuelve true si los esta, y false si no
    async isProductOnCart(cid, pid) {
        const [cart] = await this.getCartById(cid);
        const cartPids = [];
        cart.products.forEach(e => {
            cartPids.push(e.pid);
        });

        const productId = cartPids.find(id => id == pid);

        if(productId) {
            return true;

        } else {
            return false;
        }
    }

    // Agrega al carrito cuyo id se paso por parametro, el id y la cantidad del producto pasados por parametro. Retorna el producto agregado
    async addProdToCart(cid, pid, quantity) {
        try {
            const [cart, carts] = await this.getCartById(cid);
            const productManager = new ProductManager();
            const [product] = await productManager.getProductById(pid);
        
            if(quantity > product.stock) throw new Error('Insufficient stock for the requested quantity.');

            if(await this.isProductOnCart(cid, pid)) {
                const index = cart.products.findIndex(lot => lot.pid == pid);
                cart.products[index].quantity += quantity;

            } else {
                const addedProduct = {pid: Number(pid), quantity: quantity};
                cart.products.push(addedProduct);
            }

            const index = carts.findIndex(cart => cart.id == cid);
            carts[index] = cart;

            const addedProduct = {pid: pid, quantity: quantity};

            await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2), 'utf-8');
            return addedProduct;

        } catch (error) {
            console.log(error);
        }
    }
}

// const cartManager = new CartManager();

// async function test() {
//     console.log(await cartManager.getCarts());
// //     // console.log(await cartManager.addCarts([]));
// //     // const [cart] = await cartManager.getCartById(5);
// //     await cartManager.addProdToCart(3, 7, 1);
// }

// await test();

export default CartManager;