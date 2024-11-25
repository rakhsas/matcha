var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import jwt from 'jsonwebtoken';
import { ResetPasswordTokenNotFoundException } from '../exceptions/auth.exception';
import { CryptoUtil } from '../utils/crypto.utils';
import { HttpStatus } from 'http-status-ts';
export default function resetMiddleware(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const csfParam = req.query.csf;
        try {
            if (!csfParam) {
                throw new ResetPasswordTokenNotFoundException();
            }
            if (!process.env.ATOKEN_SECRET) {
                throw new Error('ATOKEN_SECRET is not defined');
            }
            const decoded = jwt.verify(csfParam, process.env.ATOKEN_SECRET || '');
            console.log(decoded.sub, ": sub");
            const decryptedSub = CryptoUtil.decrypt(decoded.sub, process.env.PAYLOAD_ENCRYPTION_KEY || '');
            req.userId = decryptedSub;
            next();
        }
        catch (err) {
            if (err.name === 'TokenExpiredError') {
                res.status(HttpStatus.UNAUTHORIZED).json({ error: "Reset password token expired. Please request a new one." });
            }
            else if (err.name === 'ResetPasswordTokenNotFoundException') {
                // res.status(HttpStatus.UNAUTHORIZED).json({ error: "Reset password token not found." });
                throw err;
            }
            else {
                res.status(HttpStatus.UNAUTHORIZED).json({ error: "Invalid reset password token." });
            }
        }
    });
}
