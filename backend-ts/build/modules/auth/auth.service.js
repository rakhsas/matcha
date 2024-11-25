var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as userService from '../user/services/user.service';
import { InvalidCredentialsException, UserAlreadyExistsException } from '../../shared/exceptions/user.exception';
import { PasswordMismatchException } from '../../shared/exceptions/auth.exception';
import jwt from 'jsonwebtoken';
import { CryptoUtil } from '../../shared/utils/crypto.utils';
import nodemailer from 'nodemailer';
import { getEmailTemplate } from './utils/email.template';
export const login = (loginDTO) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userService.findByEmail(loginDTO.email);
        if (!user)
            throw new InvalidCredentialsException();
        const isMatch = yield userService.comparePassword(loginDTO.password, user.password);
        if (!isMatch)
            throw new PasswordMismatchException();
        const { aToken, rToken } = yield generateTokens(user);
        return { aToken, rToken };
    }
    catch (err) {
        throw err;
    }
});
export const generateTokens = (user) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payload = {
            sub: CryptoUtil.encrypt(user.id, process.env.PAYLOAD_ENCRYPTION_KEY || ''),
        };
        const aToken = jwt.sign(payload, process.env.ATOKEN_SECRET || '', { expiresIn: process.env.ATOKEN_VALIDITY_DURATION });
        const rToken = jwt.sign(payload, process.env.RTOKEN_SECRET || '', { expiresIn: process.env.RTOKEN_VALIDITY_DURATION });
        return {
            aToken,
            rToken,
        };
    }
    catch (err) {
        console.log(err);
        throw err;
    }
});
export const register = (registerDTO) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userService.findByEmail(registerDTO.email);
        if (user)
            throw new UserAlreadyExistsException();
        const createdUser = yield userService.save(registerDTO);
        return createdUser;
    }
    catch (err) {
        throw err;
    }
});
export const resetPasswordRequest = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userService.findByEmail(email);
        if (!user)
            throw new InvalidCredentialsException();
        const resetLink = generateResetLink(user);
        yield sendPasswordResetEmail(user.email, resetLink);
    }
    catch (err) {
        throw err;
    }
});
function sendPasswordResetEmail(to, resetLink) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const mailOptions = getMailOptions(to, resetLink);
            yield transporter.sendMail(mailOptions);
            console.log('Password reset email sent successfully');
        }
        catch (error) {
            console.error('Error sending password reset email:', error);
        }
    });
}
export const resetPasswordVerification = (password, userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield userService.update({ password: password }, { id: userId });
        return result ? "Password reseted successfully" : "Please User different Password";
    }
    catch (err) {
        console.log(err);
        throw err;
    }
});
function generateResetLink(user) {
    const payload = {
        sub: CryptoUtil.encrypt(user.id, process.env.PAYLOAD_ENCRYPTION_KEY || ''),
    };
    const resetToken = jwt.sign(payload, process.env.ATOKEN_SECRET || '', { expiresIn: process.env.RESET_TOKEN_DURATION });
    return `http://${process.env.CLIENT_URL}/api/authenticate/reset-password-ver?csf=${resetToken}`;
}
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL, // Your Gmail address
        pass: process.env.GMAIL_APP_PASSWORD, // App-specific password or Gmail password
    }
});
function getMailOptions(to, resetLink) {
    const mailOptions = {
        from: 'no-reply@t.t',
        to: to,
        subject: 'Password Reset Request',
        html: getEmailTemplate(resetLink),
    };
    return mailOptions;
}
