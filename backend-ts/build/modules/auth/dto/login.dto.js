export class LoginDTO {
    constructor(body) {
        this.email = body.email;
        this.password = body.password;
    }
}
