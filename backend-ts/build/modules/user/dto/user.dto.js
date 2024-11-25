// src/dtos/userDto.js
export class CreateUserDto {
    constructor(body) {
        this.firstName = body.firstName;
        this.lastName = body.lastName;
        this.email = body.email;
        this.username = body.username;
        this.password = body.password;
    }
}
export class UpdateUserDto {
    constructor(body) {
        this.firstName = body.firstName;
        this.lastName = body.lastName;
        this.email = body.email;
        this.username = body.username;
    }
}
