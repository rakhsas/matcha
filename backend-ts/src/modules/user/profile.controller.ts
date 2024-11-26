import { HttpStatus } from "http-status-ts";
import * as profileService from "./services/profile.service";
import { ProfileDto } from "./dto/profile.dto";
import { Response } from "express";

export const saveProfile = async (req: any, res: Response) => {
    try {
        req.body.id = req.userId;
        const newUser = await profileService.save(req.body as ProfileDto);
        res.status(HttpStatus.CREATED).json({ message: "User created successfully", user: newUser });
    } catch (err: any) {
        res.status(HttpStatus.BAD_REQUEST).json({ error: err.message});
    }
};

export const getProfile = async (req: any, res: Response) => {
    try {
        const profile = await profileService.get(req.userId);
        res.status(HttpStatus.OK).json(profile);
    } catch (err: any) {
        res.status(HttpStatus.BAD_REQUEST).json({ error: err.message });
    }
}