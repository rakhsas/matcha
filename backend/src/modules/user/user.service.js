import repository from "../../../repository/index.js";
import bcrypt from 'bcryptjs';

const save = async (UserData) => {
    try {
        const userData = await hashPassword(UserData);
        const newUser = await repository.save('users', userData);
        return newUser;
    } catch (error) {
        throw error;
    }
};

const findByEmail = async (email) => {
    try {
        const user = await repository.findOneByCondition('users', { email });
        return user;
    } catch (error) {
        throw error;
    }
}

const findById = async (id) => {
    try {
        const user = await repository.findOneByCondition('users', { id });
        return user;
    } catch (error) {
        throw error;
    }
}

const hashPassword = async (UserData) => {
    try {

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(UserData.password, salt);
        UserData.password = hashedPassword;
        return UserData;
    } catch (error) {
    }
}

const comparePassword = async (password, hashedPassword) => {
    try {
        return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
        throw error
    }
}

export { save, findByEmail, comparePassword, findById };