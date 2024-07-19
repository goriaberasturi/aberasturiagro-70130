const fs = require('fs');

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
                return product;
            } else {
                return undefined;
            }

        } catch (error) {
            return [];
        }
    }

    async codeValidated(code) {
        try {
            const products = await this.getProducts();
            const product = products.find(product => product.code == code);

            if (product) {
                return false;
            } else {
                return true;
            }

        } catch (error) {
            return error;
        }
    }

    async fieldValidated(product) {
        let isValid = true;
        let fields = Object.values(product);

        fields.forEach(field => {
            if (field === null || field === '' || field == undefined) {
                isValid = false;
            }
        });

        return isValid;
    }

    async addProducts(prod) {
        await this.initializeId();
        
        const product = {
            title: prod.title,
            description: prod.description,
            price: prod.price,
            thumbnail: prod.thumbnail,
            code: prod.code,
            stock: prod.stock,
            id: this.#id + 1,
        }

        const fieldValid = await this.fieldValidated(product);
        const codeValid = await this.codeValidated(product.code);

        if (!fieldValid) return console.log('There is an empty field');

        if (!codeValid) return console.log('Theres is already a product with this code');

        const products = await this.getProducts();
        products.push(product);
        this.#id++;
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2), 'utf-8');
    }

    async updateProduct(id, fields) {
        const products = await this.getProducts();
        let product = await this.getProductById(id);

        if (product) {
            const fieldValid = await this.fieldValidated(fields);

            if (!fieldValid) return console.log('There is an empty field');

            if (Object.keys(fields).includes('code')) {
                if (await this.codeValidated(fields.code)) return 'This code is already registered';
            }

            const updatedProduct = { ...product, ...fields, id };

            const index = products.findIndex(prod => prod.id === updatedProduct.id);
            products[index] = updatedProduct;

            await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2), 'utf-8');
        } else {
            return console.log('Product not found');
        }
    }
}

const productManager = new ProductManager('./products.json');

const prodPrueba = {
    title: 'producto prueba',
    description: 'Este es un producto de prueba',
    price: 200,
    thumbnail: 'Sin imagen',
    code: 'ab234',
    stock: 25
}

const campos = {
    price: 3000,
    stock: 2,
}

const test = async () => {
    // await productManager.addProducts(prodPrueba);

    // let prod = await productManager.getProductById(1);
    // console.log(prod);

    await productManager.updateProduct(4, campos);
    listado = await productManager.getProducts();

}

test();