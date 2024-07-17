const fs = require('fs');

class ProductManager {
    #id = 0;

    constructor(path) {
        this.path = path;
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
                return console.error('Not found');
            }

        } catch (error) {
            return {};
        }
    }

    async getProductByCode(code) {
        try {
            const products = await this.getProducts();
            const product = products.find(product => product.code == code);

            if (product) {
                return product;
            } else {
                return console.error('Not found');
            }
        } catch (error) {
            return {};
        }
    }

    fieldValidated(product) {
        let isValid = true;
        let fields = Object.values(product);

        fields.forEach(field => {
            if (field == null || field == '' || field == undefined) {
                isValid = false;
            }
        });

        return isValid;
    }

    async addProducts(prod) {
        const product = {
            title: prod.title,
            description: prod.description,
            price: prod.price,
            thumbnail: prod.thumbnail,
            code: prod.code,
            stock: prod.stock,
            id: this.#id + 1,
        }

        if (!this.fieldValidated(product)) return 'There is an empty field';
        
        if (await this.getProductByCode(product.code)) return 'Theres is already a product with this code';
        
        const products = await this.getProducts();
        products.push(product);
        this.#id++;
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2), 'utf-8');
    }
    
    async updateProduct(id, ...fields) {
        const product = await this.getProductById(id);

        if (!this.fieldValidated(fields)) return 'There is an empty field';

        if(fields.entries.includes('code')) {
            if(await this.getProductByCode(fields.code)) return 'This code is already registered';
        }

        for(fld of fields) {
            product.fld = fields.fld;
        }
    }
}

const productManager = new ProductManager('./products.json');

let prodPrueba = {
    title: 'producto prueba',
    description: 'Este es un producto de prueba',
    price: 200,
    thumbnail: 'Sin imagen',
    code: 'abc123',
    stock: 25
}

let prodPrueba2 = {
    title: 'camiseta',
    description: 'camiseta argentina talle M',
    price: 4000,
    thumbnail: 'Sin imagen',
    code: 'abc124',
    stock: 10
}

const test = async () => {
    let listado = await productManager.getProducts();
    console.log(`Lista vacia : ${listado}`);
    
    await productManager.addProducts(prodPrueba);
    listado = await productManager.getProducts();
    console.log(`Agregado producto 1 : ${listado}`);
    
    await productManager.addProducts(prodPrueba2);
    listado = await productManager.getProducts();
    console.log(`Agregado producto 2 : ${listado}`);

    let prod = await productManager.getProductById(2);
    console.log(prod);

    // console.log(productManager.getProducts());
}

test();