// src/dtos/userDto.js
export class CreateUserDto {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    password: string;

    constructor(body: any) {
        this.firstName = body.firstName;
        this.lastName = body.lastName;
        this.email = body.email;
        this.username = body.username;
        this.password = body.password;
    }
}

export class UpdateUserDto {
    firstName: string;
    lastName: string;
    email: string;
    username: string;

    constructor(body: any) {
        this.firstName = body.firstName;
        this.lastName = body.lastName;
        this.email = body.email;
        this.username = body.username;
    }
}
