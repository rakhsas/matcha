import { createUserSchema } from './user.validation.js';
import { CreateUserDto } from './dto/user.dto.js';
import status from 'http-status';
import * as userService from './user.service.js';

export const createUser = async (req, res) => {
    try {
        const { error, value } = createUserSchema.validate(req.body);
        if (error) return res.status(status.BAD_REQUEST).json({ error: error.details[0].message });

        const createUserDto = new CreateUserDto(value);
        const newUser = await userService.save(createUserDto);
        res.status(status.CREATED).json({ message: "User created successfully", user: newUser });
    } catch (err) {
        res.status(err.status).json({ error: err.message});
    }
};

