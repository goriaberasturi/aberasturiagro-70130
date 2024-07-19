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

    async fieldValidated(product) {
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
    
    async updateProduct(id, fields) {
        const products = await this.getProducts();
        let product = await this.getProductById(id);
        const fieldValid = await this.fieldValidated(fields);

        if (!fieldValid) return 'There is an empty field';

        if(Object.keys(fields).includes('code')) {
            if(await this.getProductByCode(fields.code)) return 'This code is already registered';
        }

        const updatedProduct = {...product, ...fields, id};

        const index = products.findIndex(prod => prod.id === updatedProduct.id);
        
        products[index] = updatedProduct;

        await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2), 'utf-8');
    }
}

const productManager = new ProductManager('./products.json');

const prodPrueba = {
    title: 'producto prueba',
    description: 'Este es un producto de prueba',
    price: 200,
    thumbnail: 'Sin imagen',
    code: 'abc123',
    stock: 25
}

const prodPrueba2 = {
    title: 'camiseta',
    description: 'camiseta argentina talle M',
    price: 4000,
    thumbnail: 'Sin imagen',
    code: 'abc124',
    stock: 10
}

const campos = {
    description: 'camiseta argentina talle S',
    price: 7000,
    stock: 15
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
    
    await productManager.updateProduct(2, campos);
    listado = await productManager.getProducts();
    console.log(`Actualizado producto 2 : ${listado}`);
}

test();