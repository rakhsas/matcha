import { HttpStatus } from 'http-status-ts';
import * as authService from './auth.service';
import { LoginDTO } from './dto/login.dto';
import { CreateUserDto } from '../user/dto/user.dto';
import cookie from 'cookie';
import { Request, Response } from 'express';


export const login = async (req: Request, res: Response) => {

    try {
        const loginDTO = new LoginDTO(req.body);
        const {aToken, rToken} = await authService.login(loginDTO);
        const access_token = cookie.serialize(
            'aToken',
            aToken,
            {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                path: '/',
                sameSite: 'strict',
                maxAge: parseInt(process.env.ATOKEN_VALIDITY_DURATION_IN_SECONDS || '10') * 1000,
            }
        )
        const refresh_token = cookie.serialize(
            'rToken',
            rToken,
            {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                path: '/',
                sameSite: 'strict',
                maxAge: parseInt(process.env.RTOKEN_VALIDITY_DURATION_IN_SECONDS || '10') * 1000,
            }
        )
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader(
            'Access-Control-Allow-Methods',
            'GET, POST, OPTIONS, PUT, PATCH, DELETE',
        );
        res.setHeader(
            'Access-Control-Allow-Headers',
            'X-Requested-With,content-type',
        );
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res
            .setHeader('Set-Cookie', [access_token, refresh_token])
        res.status(HttpStatus.OK).json({ message: 'Login successful', });
    } catch (err: any) {
        console.log(err)
        res.status(err.statusCode).json({ error: err });
    }
}

export const register = async (req: Request, res: Response) => {
    try {
        const createUserDto = new CreateUserDto(req.body);
        const newUser = await authService.register(createUserDto);
        res.status(HttpStatus.CREATED).json({ message: "User created successfully", user: newUser });
    } catch (err: any) {
        res.status(err.statusCode).json({ error: err.message});
    }
}


export const resetPasswordRequest = async (req: Request, res: Response) => {
    try {
        await authService.resetPasswordRequest(req.body.email);
        res.status(HttpStatus.OK).json({ message: 'Password reset link sent to email' });
    } catch (err: any) {
        console.log(err)
        res.status(HttpStatus.BAD_REQUEST).json({ error: err.message });
    }
}

export const resetPasswordVerification = async (req: any, res: Response) => {
    try {
        const { password } = req.body;
        const userId = req.userId;
        const result = await authService.resetPasswordVerification(password, userId);
        res.status(HttpStatus.OK).json({ message: result })
    } catch (err: any) {
        console.log(err)
        res.status(HttpStatus.UNAUTHORIZED).json({ error: err.message });
    }
}