class UsersDto {
    constructor(user) {
        this.email = user.email;
        this.birthday = user.birthday;
        this.cart = user.cart;
        this.role = user.role;
    }
}

export { UsersDto };