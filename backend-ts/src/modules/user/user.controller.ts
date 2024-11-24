import { CreateUserDto } from './dto/user.dto';
import { HttpStatus } from 'http-status-ts';
import * as userService from './services/user.service';
import { Request, Response } from 'express';

export const createUser = async (req: Request, res: Response) => {
    try {
        const newUser = await userService.save(req.body as CreateUserDto);
        res.status(HttpStatus.CREATED).json({ message: "User created successfully", user: newUser });
    } catch (err: any) {
        res.status(HttpStatus.BAD_REQUEST).json({ error: err.message});
    }
};

