class UsersRepository {
    constructor(dao) {
        this.dao = dao;
    }

    getUsers = async () => await this.dao.get();
    getUser = async opts => await this.dao.getBy(opts);
    createUser = async newUser => await this.dao.create(newUser);
    updateUser = async (opts, updatedUser) => await this.dao.update(opts, updatedUser);
    deleteUser = async opts => await this.dao.delete(opts);
}

export { UsersRepository };