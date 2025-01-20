import { OTPService } from '@/api/auth/utils';
import { GenerateUserOTPPayload } from '@/api/user/core/interfaces';
import { User } from '@/api/user/core/models';
import { BadRequestError, ControllerArgs, HttpStatus, logger } from '@/core';

export class GenerateUserOtp {
    constructor(private readonly dbUser: typeof User, private readonly otpService: OTPService) {}

    handle = async ({ params }: ControllerArgs<GenerateUserOTPPayload>) => {
        if (!params) throw new BadRequestError('Invalid input data');

        const { id } = params;

        const user = await this.dbUser.findOne({
            where: {
                id,
            },
        });

        if (!user) throw new BadRequestError('Invalid User!');

        const otp = this.otpService.createOtp();

        const otpExp = this.otpService.createOTPExp();

        user.otp = otp;
        user.otpExp = otpExp;

        await user.save();

        logger.info('User OTP Generated Successfully Successfully');

        return {
            data: user,
            code: HttpStatus.OK,
            message: 'User OTP Generated Successfully Successfully',
        };
    };
}
