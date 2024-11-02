class CartsRepository {
    constructor(dao) {
        this.dao = dao
    }

    getCarts = async () => await this.dao.get();
    getCart = async opts => await this.dao.getBy(opts);
    createCart = async () => await this.dao.create();
    addProduct = async (cid, prod) => await this.dao.addItem(cid, prod);
    updateProduct = async (cid, pid, quantity) => await this.dao.updateItem(cid, pid, quantity);
    deleteProduct = async (cid, pid) => await this.dao.deleteItem(cid, pid);
    deleteAllProducts = async cid => await this.dao.deleteAllItems(cid);
    isValidId = async id => await this.dao.isValidId(id);
    isProductOnCart = async (cid, pid) => await this.dao.isProductOnCart(cid, pid);
}

export { CartsRepository };