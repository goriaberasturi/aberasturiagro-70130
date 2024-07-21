import fs from 'fs';

class ProductManager {
    #id = 0;

    constructor(path) {
        this.initializeId();
        this.path = path;
    }

    async initializeId() {
        const products = await this.getProducts();
        if (products.length > 0) {
            this.#id = Math.max(...products.map(prod => prod.id));
        }
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

    async addProducts(prod) {
        try {

            await this.initializeId();

            const products = await this.getProducts();

            const product = {
                title: prod.title,
                description: prod.description,
                price: prod.price,
                thumbnail: prod.thumbnail,
                code: prod.code,
                stock: prod.stock,
                id: this.#id + 1,
            }

            await this.isfieldValid(product);
            await this.isCodeRegistered(product.code, products);

            products.push(product);

            this.#id++;

            await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2), 'utf-8');
        } catch (error) {
            console.log(error);
        }
    }

    async updateProduct(id, fields) {
        try {
            const [product, products] = await this.getProductById(id);

            if (product) {
                await this.isfieldValid(fields);

                if ('code' in fields) {
                    if(product.code === fields.code) {
                        console.log('This product code is already up to date');
                    } else {
                        await this.isCodeRegistered(fields.code, products);
                    }
                }

                const updatedProduct = { ...product, ...fields, id };

                const index = products.findIndex(prod => prod.id === updatedProduct.id);
                products[index] = updatedProduct;

                await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2), 'utf-8');
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
            const index = products.findIndex(prod => prod.id === id);

            if (index == -1) {
                throw new Error('Product ID was not found')
            } else {
                products.splice(index, 1);

                await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2), 'utf-8');
            };

        } catch (error) {
            console.log(error);
        }
    }
}

const productManager = new ProductManager('./products.json');

const prodPrueba = {
    title: 'producto prueba',
    description: 'Este es un producto prueba',
    price: 200,
    thumbnail: 'Sin imagen',
    code: 'abc123',
    stock: 25
}

const campos = {
    stock: 25
}

const test = async () => {
    await productManager.updateProduct(11, campos);
}

await test();

// export default ProductManager;