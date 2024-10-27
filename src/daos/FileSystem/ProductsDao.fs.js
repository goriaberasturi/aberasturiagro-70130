import fs from 'fs';
const ruta = './data/products.json';
const rutaTest = './Proyecto Final/data/products.json';

class ProductManager {
    constructor() {
        this.path = './data/products.json';
    }

    // Devuelve todos los productos
    async get() {
        try {
            const result = await fs.promises.readFile(this.path, 'utf-8');
            return JSON.parse(result);

        } catch (error) {
            return [];
        }
    }

    // Devuelve el un array que en el index 0 contiene el producto con el id pasado por parametro, y en el index 1 la lista de productos
    async getBy(id) {
        try {
            const products = await this.get();
            const product = products.find(prod => prod.id == id);

            if (product) {
                return [product, products];
            } else {
                throw new Error('Product ID was not found');
            }

        } catch (error) {
            return console.log(`ID ${error}`);
        }
    }

    // Arroja un error si uno de los productos pasados por parametro tiene el codigo pasado por parametro. Sino, arroja false
    async isCodeRegistered(code, products) {
        const product = products.find(product => product.code == code);

        if (product) {
            throw new Error('This code is already registered');
        } else {
            return false;
        }
    }

    // Valida si se completaron todos los campo. Devuelve true si estan completos y arroja un error si alguno de los campos no lo esta
    async isfieldValid(product) {
        let isValid = true;
        let fields = Object.values(product);

        fields.forEach(field => {
            if (field === null || field === '' || field == undefined) {
                isValid = false;
            }
        });

        if (isValid) {
            return true;
        } else {
            throw new Error('There is an empty field');
        }
    }

    // Agrega el producto pasado por parametro en formato de objeto
    async create(product) {
        try {
            const products = await this.get();

            if(products.length === 0) {
                product.id = 1;
            } else {
                product.id = Math.max(...products.map(prod => prod.id)) + 1;
            }

            await this.isfieldValid(product);
            await this.isCodeRegistered(product.code, products);

            products.push(product);

            await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2), 'utf-8');
            return product;

        } catch (error) {
            console.log(error);
        }
    }

    // Actualiza los campos pasados por parametro del producto cuyo id se paso por parametro
    async update(id, fields) {
        try {
            const [product, products] = await this.getBy(id);
            const numId = Number(id);
            
            if (product) {
                await this.isfieldValid(fields);
                
                if ('code' in fields) {
                    if(product.code === fields.code) {
                        console.log('This product code is already up to date');
                    } else {
                        await this.isCodeRegistered(fields.code, products);
                    }
                }
                
                const updatedProduct = { ...product, ...fields, id:numId };
                console.log('aca', updatedProduct, product);

                const index = products.findIndex(prod => prod.id == updatedProduct.id);
                products[index] = updatedProduct;

                await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2), 'utf-8');
                return updatedProduct;

            } else {
                throw new Error('Product not found');
            }

        } catch (error) {
            console.log(error);
        }
    }

    // Elimina el producto cuyo id se paso por parametro
    async delete(id) {
        try {
            const products = await this.get();
            const index = products.findIndex(prod => prod.id == id);
            
            if (index == -1) {
                throw new Error('Product ID was not found');
            } else {
                const deletedProduct = products[index];

                products.splice(index, 1);

                await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2), 'utf-8');
                return deletedProduct;
            };

        } catch (error) {
            console.log(error);
        }
    }
}

// const prod = {
//     "title": "asdas",
//     "description": "asdasd",
//     "price": 19,
//     "thumbnail": "Sin imagen",
//     "code": "aasd2",
//     "stock": 25
// }

// const pM = new ProductManager;

// async function test() {
//     console.log(await pM.getBy(4));
// }

// await test();

export default ProductManager;