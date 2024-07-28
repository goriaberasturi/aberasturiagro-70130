import express from 'express';
import productsRouter from './routes/productsRouter.js';
import cartsRouter from './routes/cartsRouter.js';
import logger from 'morgan';
import { rootDir } from './utils/rootDir.js';
import path from 'path';


const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/static', express.static(path.join(rootDir, 'public')));
app.use(logger('dev'));

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.use((error, req, res, next) => {
    console.log(error.stack);
    res.status(500).send('Error de server');
});

app.listen(PORT, () => {
    console.log(`Servidor en puerto ${PORT}`);
});