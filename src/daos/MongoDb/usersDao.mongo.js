import usersModel from './models/users.model.js'

class UserDaoMongo {
    constructor() {
        this.model = usersModel;
    }
    
    get = async () => await this.model.find();
    getBy = async filter => await this.model.findOne(filter);
    create = async newUser => await this.model.create(newUser);
    update = async (filter, userData) => await this.model.findOneAndUpdate(filter, userData);
    delete = async (filter) => await this.model.findOneAndDelete(filter);
}

export default UserDaoMongo;