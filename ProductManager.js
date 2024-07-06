class ProductManager {
    #id = 0;

    constructor() {
        this.products = [];
    }

    getProducts() {
        return this.products;
    }

    getProductById(id) {
        let product = this.products.find(prod => prod.id == id);

        if(product) {
            return product;
        }else {
            return console.error('Not found');
        }
    }

    getProductByCode(code) {
        let productFound = this.products.find(product => product.code == code);

        if (productFound == undefined) {
            return console.error('Not found');
        } else {
            return productFound;
        }
    }

    fieldValidated(product) {
        let isValid = true;
        let fields = Object.values(product);

        fields.forEach(field => { // Chequear con .values
            if(field == null || field == '' || field == undefined) {
                isValid = false;
            }
        });

        return isValid;
    }

    addProducts(title, description, price, thumbnail, code, stock) {
        let product = {
            title: title,
            description: description,
            price: price,
            thumbnail: thumbnail,
            code: code,
            stock: stock,
            id: this.#id+1,
        }

        this.#id++;

        if(!this.fieldValidated(product)) {
            return 'There is an empty field';

        } else if(this.getProductByCode(product.code)) {
            return 'Theres is already a product with this code';

        } else {
            this.products.push(product);
            return this.products;
        }

    }
}

const productManager = new ProductManager;

let prodPrueba = {
    title: 'producto prueba',
    description: 'Este es un producto de prueba',
    price: 200,
    thumbnail: 'Sin imagen',
    code: 'abc123',
    stock: 25
}

console.log(`Lista vacia : ${productManager.getProducts()}`);

console.log(productManager.addProducts('producto prueba', 'Este es un producto de prueba', 200, 'Sin imagen', 'abc123', 25));
console.log(productManager.addProducts('camiseta', 'camiseta argentina talle M', 4000, 'Sin imagen', 'abc124', 10));
productManager.getProductById(3);
console.log(...productManager.getProducts());