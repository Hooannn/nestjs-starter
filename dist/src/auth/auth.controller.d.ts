import { AuthService } from './auth.service';
import { CheckUserDto } from './dto/check-user.dto';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
export declare class AuthController {
    private readonly authService;
    private readonly responseBuilder;
    constructor(authService: AuthService);
    checkUser(checkUserDto: CheckUserDto): Promise<import("src/utils/response").IResponse<any>>;
    signIn(signInDto: SignInDto): Promise<import("src/utils/response").IResponse<any>>;
    signUp(signUpDto: SignUpDto): Promise<import("src/utils/response").IResponse<any>>;
    createPassword(checkUserDto: CheckUserDto): Promise<import("src/utils/response").IResponse<any>>;
}
