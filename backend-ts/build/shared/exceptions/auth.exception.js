// throwable exception for authentication errors with 409 status code
import { HttpStatus } from "http-status-ts";
export class UsernameExistsException extends Error {
    constructor(message = "Username already exists. Please try another username.") {
        super(message);
        this.statusCode = HttpStatus.CONFLICT;
        this.name = this.constructor.name;
    }
}
export class PasswordMismatchException extends Error {
    constructor(message = "The password you entered is incorrect. Please try again.") {
        super(message);
        this.statusCode = HttpStatus.CONFLICT;
        this.name = this.constructor.name;
    }
}
export class AccessTokenExpiredException extends Error {
    constructor(message = "Access token has expired. Please login again.") {
        super(message);
        this.statusCode = HttpStatus.UNAUTHORIZED;
        this.name = this.constructor.name;
    }
}
export class RefreshTokenExpiredException extends Error {
    constructor(message = "Refresh token has expired. Please login again.") {
        super(message);
        this.statusCode = HttpStatus.UNAUTHORIZED;
        this.name = this.constructor.name;
    }
}
export class InvalidAcessTokenException extends Error {
    constructor(message = "Invalid access token signature. Please login again.") {
        super(message);
        this.statusCode = HttpStatus.UNAUTHORIZED;
        this.name = this.constructor.name;
    }
}
export class InvalidRefreshTokenException extends Error {
    constructor(message = "Invalid refresh token signature. Please login again.") {
        super(message);
        this.statusCode = HttpStatus.UNAUTHORIZED;
        this.name = this.constructor.name;
    }
}
export class AccessTokenNotFoundException extends Error {
    constructor(message = "Access token not found. Please login again.") {
        super(message);
        this.statusCode = HttpStatus.UNAUTHORIZED;
        this.name = this.constructor.name;
    }
}
export class RefreshTokenNotFoundException extends Error {
    constructor(message = 'Refresh token not found. Please login again.') {
        super(message);
        this.statusCode = HttpStatus.UNAUTHORIZED;
        this.name = this.constructor.name;
    }
}
export class ResetPasswordTokenNotFoundException extends Error {
    constructor(message = 'Reset password token not found. Please request a new reset link.') {
        super(message);
        this.statusCode = HttpStatus.UNAUTHORIZED;
        this.name = this.constructor.name;
    }
}
