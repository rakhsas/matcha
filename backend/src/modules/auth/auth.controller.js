import status from 'http-status';
import * as authService from './auth.service.js';
import { loginSchema } from './auth.validation.js';
import { LoginDTO } from './dto/login.dto.js';
import { createUserSchema } from '../user/user.validation.js';
import { CreateUserDto } from '../user/dto/user.dto.js';
import cookie from 'cookie';

export const login = async (req, res) => {
    try {
        const { error, value } = loginSchema.validate({email: req.body.email});
        if (error) return res.status(status.BAD_REQUEST).json({ error: error.details[0].message });
        
        const loginDTO = new LoginDTO(req.body);
        const {aToken, rToken} = await authService.login(loginDTO);
        const access_token = cookie.serialize(
            'aToken',
            aToken,
            {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: parseInt(process.env.ATOKEN_VALIDITY_DURATION_IN_SECONDS) * 1000,
            }
        )
        const refresh_token = cookie.serialize(
            'rToken',
            rToken,
            {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: parseInt(process.env.RTOKEN_VALIDITY_DURATION_IN_SECONDS) * 1000,
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
        res.status(status.OK).json({ message: 'Login successful', });
    } catch (err) {
        res.status(err.status).json({ error: err });
    }
}

export const register = async (req, res) => {
    try {
        const { error, value } = createUserSchema.validate(req.body);
        if (error) return res.status(status.BAD_REQUEST).json({ error: error.details[0].message });

        const createUserDto = new CreateUserDto(value);
        const newUser = await authService.register(createUserDto);
        res.status(status.CREATED).json({ message: "User created successfully", user: newUser });
    } catch (err) {
        res.status(err.status).json({ error: err.message});
    }
}
