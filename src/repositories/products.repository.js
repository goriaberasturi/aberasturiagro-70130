class ProductsRepository {
    constructor(dao) {
        this.dao = dao;
    }

    searchProducts = async (filter, searchOpts) => await this.dao.search(filter, searchOpts);
    getProducts = async () => await this.dao.get();
    getProduct = async opts => await this.dao.getBy(opts);
    createProduct = async newProduct => await this.dao.create(newProduct);
    updateProduct = async (opts, updatedProduct) => await this.dao.update(opts, updatedProduct);
    deleteProduct = async opts => await this.dao.delete(opts);
    getLimitedProducts = async limit => await this.dao.getLimited(limit);
    isValidId = async id => await this.dao.isValidId(id);
    isFieldValid = async prod => await this.dao.isFieldValid(prod);
}

export { ProductsRepository }