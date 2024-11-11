export class InvalidCredentialsException extends Error {
    constructor(message = "Invalid credentials. Check your email and try again.") {
        super(message);
        this.name = this.constructor.name;
        this.status = 401;
    }
}

export class UserAlreadyExistsException extends Error {
    constructor(message = "User already exists.") {
        super(message);
        this.name = this.constructor.name;
        this.status = 409;
    }
}

export class UserNotFoundException extends Error {
    constructor(message= "Please Log in again.") {
        super(message);
        this.name = this.constructor.name;
        this.status = 404;
    }
}