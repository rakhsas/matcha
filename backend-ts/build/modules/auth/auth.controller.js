var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { HttpStatus } from 'http-status-ts';
import * as authService from './auth.service';
import { LoginDTO } from './dto/login.dto';
import { CreateUserDto } from '../user/dto/user.dto';
import cookie from 'cookie';
export const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const loginDTO = new LoginDTO(req.body);
        const { aToken, rToken } = yield authService.login(loginDTO);
        const access_token = cookie.serialize('aToken', aToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            sameSite: 'strict',
            maxAge: parseInt(process.env.ATOKEN_VALIDITY_DURATION_IN_SECONDS || '10') * 1000,
        });
        const refresh_token = cookie.serialize('rToken', rToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            sameSite: 'strict',
            maxAge: parseInt(process.env.RTOKEN_VALIDITY_DURATION_IN_SECONDS || '10') * 1000,
        });
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res
            .setHeader('Set-Cookie', [access_token, refresh_token]);
        res.status(HttpStatus.OK).json({ message: 'Login successful', });
    }
    catch (err) {
        console.log(err);
        res.status(err.statusCode).json({ error: err });
    }
});
export const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const createUserDto = new CreateUserDto(req.body);
        const newUser = yield authService.register(createUserDto);
        res.status(HttpStatus.CREATED).json({ message: "User created successfully", user: newUser });
    }
    catch (err) {
        res.status(err.statusCode).json({ error: err.message });
    }
});
export const resetPasswordRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield authService.resetPasswordRequest(req.body.email);
        res.status(HttpStatus.OK).json({ message: 'Password reset link sent to email' });
    }
    catch (err) {
        console.log(err);
        res.status(HttpStatus.BAD_REQUEST).json({ error: err.message });
    }
});
export const resetPasswordVerification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { password } = req.body;
        const userId = req.userId;
        const result = yield authService.resetPasswordVerification(password, userId);
        res.status(HttpStatus.OK).json({ message: result });
    }
    catch (err) {
        console.log(err);
        res.status(HttpStatus.UNAUTHORIZED).json({ error: err.message });
    }
});
