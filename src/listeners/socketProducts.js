import ProductsManagerMongo from "../daos/MongoDb/products.manager.mongo.js";
// const pm = new ProductManager();
const pS = new ProductsManagerMongo;

const socketProducts = (socketServer) => {
    socketServer.on('connection', async socket => {
        console.log(`Nuevo cliente conectado: ${socket.id}`);
        const productos = await pS.getProducts();

        socketServer.emit('productLoad', productos);

        socket.on('addProduct', async (prod) => {
            await pS.createProduct(prod);
            const productos = await pS.getProducts();

            socketServer.emit('productLoad', productos);
        });

        socket.on('deleteProduct', async (prodId) => {
            await pS.deleteProduct(prodId);
            const productos = await pS.getProducts();

            socketServer.emit('productLoad', productos);
        });
    });
};

export default socketProducts;