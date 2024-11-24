import * as userService from '../user/services/user.service';
import { InvalidCredentialsException, UserAlreadyExistsException } from '../../shared/exceptions/user.exception';
import { PasswordMismatchException } from '../../shared/exceptions/auth.exception';
import jwt from 'jsonwebtoken';
import { CryptoUtil } from '../../shared/utils/crypto.utils';
import nodemailer from 'nodemailer';
import { getEmailTemplate } from './utils/email.template';
import { LoginDTO } from './dto/login.dto';
import { CreateUserDto } from '../user/dto/user.dto';


export const login = async (loginDTO: LoginDTO) => {
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

export const generateTokens = async (user: any) => {
    try {
        const payload = {
            sub: CryptoUtil.encrypt(user.id, process.env.PAYLOAD_ENCRYPTION_KEY || ''),
        }
        const aToken = jwt.sign(payload, process.env.ATOKEN_SECRET || '', { expiresIn: process.env.ATOKEN_VALIDITY_DURATION });
        const rToken = jwt.sign(payload, process.env.RTOKEN_SECRET || '', { expiresIn: process.env.RTOKEN_VALIDITY_DURATION });
        return {
            aToken,
            rToken,
        }
    } catch (err) {
        console.log(err);
        throw err;
    }
}


export const register = async (registerDTO: CreateUserDto) => {
    try {
        const user = await userService.findByEmail(registerDTO.email);
        if (user) throw new UserAlreadyExistsException();

        const createdUser = await userService.save(registerDTO);
        return createdUser;
    } catch (err) {
        throw err;
    }
}

export const resetPasswordRequest = async (email: string) => {
    try {
        const user = await userService.findByEmail(email);
        if (!user) throw new InvalidCredentialsException();
        const resetLink = generateResetLink(user);
        await sendPasswordResetEmail(user.email, resetLink);
    } catch (err) {
        throw err;
    }
}

async function sendPasswordResetEmail(to: string, resetLink: string) {
    try {
        const mailOptions = getMailOptions(to, resetLink)
        await transporter.sendMail(mailOptions);
        console.log('Password reset email sent successfully');
    } catch (error) {
        console.error('Error sending password reset email:', error);
    }
}

export const resetPasswordVerification = async (password: string, userId: string) => {
    try {
        const result = await userService.update( {password: password}, {id: userId})
        return result ? "Password reseted successfully" : "Please User different Password"
    } catch (err) {
        console.log(err)
        throw err;
    }
}

function generateResetLink(user: any) {
    const payload = {
        sub: CryptoUtil.encrypt(user.id, process.env.PAYLOAD_ENCRYPTION_KEY || ''),
    }
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

function getMailOptions(to: string, resetLink: string) {
    const mailOptions = {
        from: 'no-reply@t.t',
        to: to,
        subject: 'Password Reset Request',
        html: getEmailTemplate(resetLink),
    };
    return mailOptions;
}