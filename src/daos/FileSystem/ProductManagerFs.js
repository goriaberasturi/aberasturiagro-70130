import fs from 'fs';

const ruta = './data/prueba.json'

class ProductManager {
    constructor() {
        this.path = './data/products.json';
    }

    async getProducts() {
        try {
            const result = await fs.promises.readFile(this.path, 'utf-8');
            return JSON.parse(result);

        } catch (error) {
            return [];
        }
    }

    async getProductById(id) {
        try {
            const products = await this.getProducts();
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

    async isCodeRegistered(code, products) {
        const product = products.find(product => product.code == code);

        if (product) {
            throw new Error('This code is already registered');
        } else {
            return false;
        }
    }

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

    async addProducts(product) {
        try {
            const products = await this.getProducts();

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

    async updateProduct(id, fields) {
        try {
            const [product, products] = await this.getProductById(id);
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

    async deleteProduct(id) {
        try {
            const products = await this.getProducts();
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
//     console.log(await pM.getProducts());
//     await pM.addProducts(prod);
//     console.log(await pM.getProducts());
// }

// await test();

export default ProductManager;