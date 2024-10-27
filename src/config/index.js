import { MongoSingleton } from "../utils/mongoSingleton.js";
import dotenv from 'dotenv';
import { Command } from "commander";

// Configuracion de commander
const program = new Command();

program.option('--mode <mode>', 'Modo de ejecucion', 'development');
program.parse();

const { mode } = program.opts();

dotenv.config({
    path: mode === 'development' ? './.env.development' : './.env.production'
});

// Objeto de configuracion
const config = {
    port: process.env.PORT || 8080,
    private_key: process.env.PRIVATE_KEY,
    persistence: process.env.PERSISTENCE
};


const connectDb = async () => {
    console.log(`Connecting to Database in ${mode} mode`);
    await MongoSingleton.getInstance();
};

export { config, connectDb };