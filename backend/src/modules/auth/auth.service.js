import * as userService from '../user/user.service.js';
import { InvalidCredentialsException, UserAlreadyExistsException } from '../../shared/exceptions/user.exception.js';
import { PasswordMismatchException } from '../../shared/exceptions/auth.exception.js';
import jwt from 'jsonwebtoken';
import { CryptoUtil } from '../../shared/utils/crypto.utils.js';
import nodemailer from 'nodemailer';
import { getEmailTemplate } from './utils/email.template.js';


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

export const resetPasswordRequest = async (email) => {
    try {
        const user = await userService.findByEmail(email);
        if (!user) throw new InvalidCredentialsException();

        const resetLink = generateResetLink(user);
        await sendPasswordResetEmail(user.email, resetLink);
    } catch (err) {
        throw err;
    }
}

async function sendPasswordResetEmail(to, resetLink) {
    try {
        const mailOptions = getMailOptions(to, resetLink)
        await transporter.sendMail(mailOptions);
        console.log('Password reset email sent successfully');
    } catch (error) {
        console.error('Error sending password reset email:', error);
    }
}

export const resetPasswordVerification = async (password) => {
    try {
        // const decoded = jwt.verify(password, process.env.ATOKEN_SECRET);
        // const userId = CryptoUtil.decrypt(decoded.sub, process.env.PAYLOAD_ENCRYPTION_KEY);
        // return userId;
        console.log(password)
        return password || 'Password reset successful';
    } catch (err) {
        console.log(err)
        throw err;
    }
}

function generateResetLink(user) {
    const payload = {
        sub: CryptoUtil.encrypt(user.userId, process.env.PAYLOAD_ENCRYPTION_KEY),
    }
    const resetToken = jwt.sign(payload, process.env.ATOKEN_SECRET, { expiresIn: '5m' });
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