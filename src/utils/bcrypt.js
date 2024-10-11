import brcypt from 'bcrypt';

const createHash = password => brcypt.hashSync(password, brcypt.genSaltSync(10));

const isValidPassword = (pass, passDb) => brcypt.compareSync(pass, passDb);

export {createHash, isValidPassword};