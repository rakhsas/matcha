import * as userService from '../user/user.service.js';
import { InvalidCredentialsException, UserAlreadyExistsException } from '../../shared/exceptions/user.exception.js';
import { PasswordMismatchException } from '../../shared/exceptions/auth.exception.js';
import jwt from 'jsonwebtoken';
import { CryptoUtil } from '../../shared/utils/crypto.utils.js';


export const login = async (loginDTO) => {
    try {
        const user = await userService.findByEmail(loginDTO.email);

        if (!user) throw new InvalidCredentialsException();

        const isMatch = await userService.comparePassword(loginDTO.password, user.password);
        if (!isMatch) throw new PasswordMismatchException();

        const { aToken, rToken } = await generateTokens(user);
        return { aToken, rToken };
    } catch (err) {
        throw err;
    }
}

export const generateTokens = async (user) => {
    try {
        const payload = {
            sub: CryptoUtil.encrypt(user.id, process.env.PAYLOAD_ENCRYPTION_KEY),
        }
        const aToken = jwt.sign(payload, process.env.ATOKEN_SECRET, { expiresIn: process.env.ATOKEN_VALIDITY_DURATION });
        const rToken = jwt.sign(payload, process.env.RTOKEN_SECRET, { expiresIn: process.env.RTOKEN_VALIDITY_DURATION });
        return {
            aToken,
            rToken,
        }
    } catch (err) {
        console.log(err);
        throw err;
    }
}


export const register = async (registerDTO) => {
    try {
        const user = await userService.findByEmail(registerDTO.email);
        if (user) throw new UserAlreadyExistsException();

        const createdUser = await userService.save(registerDTO);
        return createdUser;
    } catch (err) {
        throw err;
    }

}