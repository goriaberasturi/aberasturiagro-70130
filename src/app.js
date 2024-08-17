import express from 'express';
import Handlebars from 'express-handlebars';
import logger from 'morgan';
import { rootDir } from './utils/rootDir.js';
import path from 'path';

import productsRouter from './routes/productsRouter.js';
import cartsRouter from './routes/cartsRouter.js';
import viewsRouter from './routes/viewsRouter.js';
import socketProducts from './listeners/socketProducts.js';

import {Server} from 'socket.io';


// Config. de server
const app = express();
const PORT = process.env.PORT || 8080;


// Config. de websocket
const httpServer = app.listen(PORT, () => {
    console.log(`Servidor en puerto ${PORT}`);
    console.log(`http://localhost:${PORT}/realTimeProducts`);
});

const io = new Server(httpServer);

// Middleware para uso del socket en toda la app
const ioMiddleware = (io) => (req, res, next) => {
    req.io = io;
    next();
}
app.use(ioMiddleware(io));


// Parsear JSON y data URL-encoded
app.use(express.json());
app.use(express.urlencoded({extended: true}));


// Middleware para configurar la carpeta static
app.use('/static', express.static(path.join(rootDir, 'public')));
app.use(logger('dev'));


// Configuracion del motor de plantillas
app.engine('handlebars', Handlebars.engine());
// Configuracion de carpeta donde debe tomar las plantillas
app.set('views', path.join(rootDir, 'src','views'));
// Configurar la extension de las plantillas
app.set('view engine', 'handlebars');


// Routing
app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);


// Middleware para manejo de errores
app.use((error, req, res, next) => {
    console.log(error.stack);
    res.status(500).send('Error de server');
});

socketProducts(io);