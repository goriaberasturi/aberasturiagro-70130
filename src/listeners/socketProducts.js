import ProductsManagerMongo from "../daos/MongoDb/products.manager.mongo.js";
import CartsManagerMongo from "../daos/MongoDb/carts.manager.mongo.js";
// const pm = new ProductManager();
const pS = new ProductsManagerMongo;
const cS = new CartsManagerMongo;

const socketProducts = (socketServer) => {
    socketServer.on('connection', async socket => {
        console.log(`Nuevo cliente conectado: ${socket.id}`);

        // Product events
        const docs = await pS.getProducts();
        socketServer.emit('productLoad', docs);

        socket.on('addProduct', async (prod) => {
            await pS.createProduct(prod);
            const docs = await pS.getProducts();

            socketServer.emit('productLoad', docs);
        });

        socket.on('deleteProduct', async (prodId) => {
            await pS.deleteProduct(prodId);
            const docs = await pS.getProducts();

            socketServer.emit('productLoad', docs);
        });


        // Cart events
        socket.on('addToCart', async prod => {
            const cid = '66cbed2a3e4fe3ea4f17631a';
            const product = await pS.getProduct({_id: prod.product});

            let response;
            if(await cS.isProductOnCart(cid, prod.product)) {
                response = await cS.updateProductOnCart(cid, prod.product, {quantity: prod.quantity});
            } else {
                response = await cS.addProductToCart(cid, prod);
            };

            if(response) socketServer.emit('addedProductToCart', `Producto agregado al carrito:\n- Producto: ${product.title}\n- Cantidad: ${prod.quantity}`);
        });

        socket.on('deleteFromCart', async pid => {
            const cid = '66cbed2a3e4fe3ea4f17631a';
            const product = await pS.getProduct({_id: pid});
            const response = await cS.deleteProductOnCart(cid, pid);
            
            if(response) socketServer.emit('deletedFromCart', {message: `Producto eliminado carrito:\n${product.title}`, pid});
        });
        
        socket.on('incCartQuanity', async pid => {
            const cid = '66cbed2a3e4fe3ea4f17631a';
            await cS.updateProductOnCart(cid, pid, {quantity: 1});
        })
        
        socket.on('decCartQuanity', async pid => {
            const cid = '66cbed2a3e4fe3ea4f17631a';
            await cS.updateProductOnCart(cid, pid, {quantity: -1});
        })
    });
};

export default socketProducts;