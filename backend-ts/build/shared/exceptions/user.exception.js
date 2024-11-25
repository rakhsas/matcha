import { HttpStatus } from "http-status-ts";
export class InvalidCredentialsException extends Error {
    constructor(message = "Invalid credentials. Check your email and try again.") {
        super(message);
        this.statusCode = HttpStatus.UNAUTHORIZED;
        this.name = this.constructor.name;
    }
}
export class UserAlreadyExistsException extends Error {
    constructor(message = "User already exists.") {
        super(message);
        this.statusCode = HttpStatus.CONFLICT;
        this.name = this.constructor.name;
    }
}
export class UserNotFoundException extends Error {
    constructor(message = "Please Log in again.") {
        super(message);
        this.statusCode = HttpStatus.NOT_FOUND;
        this.name = this.constructor.name;
    }
}
