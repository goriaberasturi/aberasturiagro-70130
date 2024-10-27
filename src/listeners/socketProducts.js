import ProductsDaoMongo from "../daos/MongoDb/productsDao.mongo.js";
import CartsManagerMongo from "../daos/MongoDb/cartsDao.mongo.js";
// const pm = new ProductManager();
const productService = new ProductsDaoMongo();
const cartService = new CartsManagerMongo;

const socketProducts = (socketServer) => {
    socketServer.on('connection', async socket => {
        console.log(`Nuevo cliente conectado: ${socket.id}`);

        // Product events
        const docs = await productService.get();
        socketServer.emit('productLoad', docs);

        socket.on('addProduct', async (prod) => {
            await productService.create(prod);
            const docs = await productService.get();

            socketServer.emit('productLoad', docs);
        });

        socket.on('deleteProduct', async (prodId) => {
            await productService.delete(prodId);
            const docs = await productService.get();

            socketServer.emit('productLoad', docs);
        });


        // Cart events
        socket.on('addToCart', async prod => {
            const cid = '66ceacd2146f2c5d2730defd';
            const product = await productService.getBy({_id: prod.product});

            let response;
            if(await cartService.isProductOnCart(cid, prod.product)) {
                response = await cartService.updateItem(cid, prod.product, {quantity: prod.quantity});
            } else {
                response = await cartService.addItem(cid, prod);
            };

            if(response) socketServer.emit('addedProductToCart', `Producto agregado al carrito:\n- Producto: ${product.title}\n- Cantidad: ${prod.quantity}`);
        });

        socket.on('deleteFromCart', async pid => {
            const cid = '66ceacd2146f2c5d2730defd';
            const product = await productService.getBy({_id: pid});
            const response = await cartService.deleteItem(cid, pid);
            
            if(response) socketServer.emit('deletedFromCart', {message: `Eliminaste "${product.title}" del carrito`, pid});
        });
        
        socket.on('incCartQuanity', async pid => {
            const cid = '66ceacd2146f2c5d2730defd';
            await cartService.updateItem(cid, pid, {quantity: 1});
        })
        
        socket.on('decCartQuanity', async pid => {
            const cid = '66ceacd2146f2c5d2730defd';
            await cartService.updateItem(cid, pid, {quantity: -1});
        })
    });
};

export default socketProducts;