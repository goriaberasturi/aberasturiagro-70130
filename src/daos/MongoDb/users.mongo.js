import usersModel from './../../models/users.model.js'

class UserManagerMongo {
    constructor() {
        this.model = usersModel;
    }
    
    getUsers = async () => await this.model.find();
    getUser = async filter => await this.model.findOne(filter);
    createUser = async newUser => await this.model.create(newUser);
}

export default UserManagerMongo;