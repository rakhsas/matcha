// src/dtos/userDto.js
export class CreateUserDto {
    constructor({ firstName, lastName, email, username, password }) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.username = username;
        this.password = password;
    }
}

export class UpdateUserDto {
    constructor({ firstName, lastName, email, username }) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.username = username;
    }
}
