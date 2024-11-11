import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import { CryptoUtil } from '../utils/crypto.utils.js';
import * as userService from './../../modules/user/user.service.js';
import { UserNotFoundException } from '../exceptions/user.exception.js';
import { AccessTokenNotFoundException, InvalidRefreshTokenException } from '../exceptions/auth.exception.js';
import status from 'http-status';

export default async function authMiddleware(req, res, next) {
    const routeHandler = req.route?.stack?.[req.route.stack.length - 1]?.handle;
    const isPublic = routeHandler && Reflect.getMetadata('isPublic', routeHandler);

    console.log('Route Handler:', routeHandler);
    console.log('Is Public:', isPublic);

    if (isPublic) {
        return next(); // Skip auth if route is public
    }
    const cookies = cookie.parse(req.headers.cookie || '');
    const { rToken, aToken } = cookies;

    
    try {
        if (!aToken) {
            throw new AccessTokenNotFoundException();
        }
        // Verify access token and decrypt user ID
        const decoded = jwt.verify(aToken, process.env.ATOKEN_SECRET);
        const decryptedSub = CryptoUtil.decrypt(decoded.sub, process.env.PAYLOAD_ENCRYPTION_KEY);
        req.userId = decryptedSub;
        next();
    } catch (err) {
        // Handle access token expiration or not found scenarios
        if (err.name === 'TokenExpiredError' || (err.name === 'AccessTokenNotFoundException' && rToken)) {
            try {
                console.log('i am on catch')
                // Verify refresh token and reissue access token if valid
                const decoded = jwt.verify(rToken, process.env.RTOKEN_SECRET);
                const decryptedSub = CryptoUtil.decrypt(decoded.sub, process.env.PAYLOAD_ENCRYPTION_KEY);
                console.log(decryptedSub)
                const user = await userService.findById(decryptedSub);
                if (!user) throw new UserNotFoundException();

                // Create a new access token
                const newAccessToken = jwt.sign({ sub: decryptedSub }, process.env.ATOKEN_SECRET, {
                    expiresIn: process.env.ATOKEN_VALIDITY_DURATION
                });

                // Set new access token in cookies
                res.setHeader('Set-Cookie', cookie.serialize('aToken', newAccessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    maxAge: parseInt(process.env.ATOKEN_VALIDITY_DURATION_IN_SECONDS)
                }));

                req.userId = decryptedSub;
                next();
            } catch (refreshError) {
                clearCookies(res);
                res.status(400).json({ error: "Session duration expired. Please login again." });
            }
        } // Handle specific refresh token errors
        else if (err.name === 'TokenExpiredError' || err.name === 'JsonWebTokenError') {
            throw new InvalidRefreshTokenException();
        } else {
            res.status(status.UNAUTHORIZED).json({ error: err.message });
        }
    }
}

export const clearCookies = (res) => {
    const access_token = cookie.serialize(
        'aToken','',
        {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 0,
        }
    )

    const refresh_token = cookie.serialize(
        'rToken', '',
        {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 0,
        }
    )

    res.setHeader('Set-Cookie', [access_token, refresh_token]);
}