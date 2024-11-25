var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { repository } from '../../../repository';
import * as bcrypt from 'bcrypt-ts';
const save = (UserData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userData = yield hashPassword(UserData);
        const newUser = yield repository.save('users', userData);
        return newUser;
    }
    catch (error) {
        throw error;
    }
});
const findByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield repository.findOneByCondition('users', { email });
        return user;
    }
    catch (error) {
        throw error;
    }
});
const findById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield repository.findOneByCondition('users', { id });
        return user;
    }
    catch (error) {
        throw error;
    }
});
const hashPassword = (UserData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const salt = yield bcrypt.genSalt(10);
        const hashedPassword = yield bcrypt.hash(UserData.password, salt);
        UserData.password = hashedPassword;
        return UserData;
    }
    catch (error) {
    }
});
const comparePassword = (password, hashedPassword) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield bcrypt.compare(password, hashedPassword);
    }
    catch (error) {
        throw error;
    }
});
const update = (data, condition) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield repository.update('users', data, condition);
    }
    catch (error) {
        throw error;
    }
});
export { save, findByEmail, comparePassword, findById, update };
