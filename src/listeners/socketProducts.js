import ProductManager from "../daos/FileSystem/ProductManagerFs.js";
const pm = new ProductManager();

const socketProducts = (socketServer) => {
    socketServer.on('connection', async socket => {
        console.log(`Nuevo cliente conectado: ${socket.id}`);
        const productos = await pm.getProducts();

        socketServer.emit('productLoad', productos);

        socket.on('addProduct', async (prod) => {
            await pm.addProducts(prod);
            const productos = await pm.getProducts();

            socketServer.emit('productLoad', productos);
        });

        socket.on('deleteProduct', async (prodId) => {
            await pm.deleteProduct(prodId);
            const productos = await pm.getProducts();

            socketServer.emit('productLoad', productos);
        });
    });
};

export default socketProducts;