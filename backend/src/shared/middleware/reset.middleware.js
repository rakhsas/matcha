import jwt from 'jsonwebtoken';
import { ResetPasswordTokenNotFoundException } from '../exceptions/auth.exception.js';
import { CryptoUtil } from '../utils/crypto.utils.js';
import status from 'http-status';


export default async function resetMiddleware(req, res, next) {

    const csfParam = req.query.csf;
    try {
        if (!csfParam) {
            throw new ResetPasswordTokenNotFoundException();
        }
        const decoded = jwt.verify(csfParam, process.env.ATOKEN_SECRET);
        const decryptedSub = CryptoUtil.decrypt(decoded.sub, process.env.PAYLOAD_ENCRYPTION_KEY);
        req.userId = decryptedSub;
        console.log(req.userId)
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            res.status(status.UNAUTHORIZED).json({ error: "Reset password token expired. Please request a new one." });
        } else if (err.name === 'ResetPasswordTokenNotFoundException') {
            // res.status(status.UNAUTHORIZED).json({ error: "Reset password token not found." });
            throw err
        }
        else {
            res.status(status.UNAUTHORIZED).json({ error: "Invalid reset password token." });
        }
    }
}