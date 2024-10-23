import { OTP } from '../models';

type SaveOTPInDB = {
    authId: string;
    receivingMedium: 'EMAIL' | 'SMS';
};

export class OTPService {
    constructor(private readonly dbOtp: typeof OTP) {}

    createOtp(): number {
        const digits = '123456789';
        const otpLength = 4;

        const otpArray = Array.from({ length: otpLength }, () => +digits[Math.floor(Math.random() * digits.length)]);

        const otp = parseInt(otpArray.join(''), 10);

        return otp;
    }

    createOTPExp(): Date {
        const expirationMinutes = 15;

        const expDate = new Date();

        expDate.setMinutes(expDate.getMinutes() + expirationMinutes);

        return expDate;
    }

    isOTPExpired(expDate: Date) {
        return new Date() > expDate;
    }

    async isOtpValid(authId: string, otp: number): Promise<boolean> {
        const otpData = await this.dbOtp.findOne({ where: { authId } });

        if (!otpData || otp != otpData.otp) return false;

        if (this.isOTPExpired(otpData.otpExp)) return false;

        return true;
    }

    async storeOTPInDb(authId: string): Promise<number> {

        const otp = this.createOtp();

        const otpExp = this.createOTPExp();

        const otpData = await this.dbOtp.findOne({ where: { authId } });

        if (otpData) {
            await this.dbOtp.update({ otp, otpExp }, { where: { authId } });
        } else {
            await this.dbOtp.create({ otp, otpExp, authId });
        }

        return otp;
    }
}
