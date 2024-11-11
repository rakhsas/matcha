// throwable exception for authentication errors with 409 status code

import status from "http-status";

export class UsernameExistsException extends Error {
    constructor(message = "Username already exists. Please try another username.") {
        super(message);
        this.name = this.constructor.name;
        this.status = 409;
    }
}

export class PasswordMismatchException extends Error {
    constructor(message = "The password you entered is incorrect. Please try again.") {
        super(message);
        this.name = this.constructor.name;
        this.status = 409;
    }
}

export class AccessTokenExpiredException extends Error {
    constructor(message = "Access token has expired. Please login again.") {
        super(message);
        this.name = this.constructor.name;
        this.status = 401;
    }
}

export class RefreshTokenExpiredException extends Error {
    constructor(message = "Refresh token has expired. Please login again.") {
        super(message);
        this.name = this.constructor.name;
        this.status = 401;
    }
}

export class InvalidAcessTokenException extends Error {
    constructor(message = "Invalid access token signature. Please login again.") {
        super(message);
        this.name = this.constructor.name;
        this.status = 401;
    }
}

export class InvalidRefreshTokenException extends Error {
    constructor(message = "Invalid refresh token signature. Please login again.") {
        super(message);
        this.name = this.constructor.name;
        this.status = 401;
    }
}

export class AccessTokenNotFoundException extends Error {
    constructor() {
        super(
            'Access token not found. Please login again.',
        );
        this.name = this.constructor.name;
        this.status = status.UNAUTHORIZED
    }
}
export class RefreshTokenNotFoundException extends Error {
    constructor() {
        super(
            'Refresh token not found. Please login again.',
        );
        this.status = status.UNAUTHORIZED
    }
}