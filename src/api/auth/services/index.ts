import { Auth, OTP } from '../models';
import { OTPService } from '../utils/otp.util';
import { ForgotPassword } from './forgot-password';
import { GetAuthUser } from './get-auth-user';
import { Login } from './login';
import { Logout } from './logout';
import { ResetPassword } from './reset-password';

const otpService = new OTPService(OTP);

export const logoutHandler = new Logout();
export const loginHandler = new Login(Auth);
export const getAuthUserHandler = new GetAuthUser(Auth);
export const forgotPasswordHandler = new ForgotPassword(Auth, otpService);
export const resetPasswordHandler = new ResetPassword(Auth, otpService);
