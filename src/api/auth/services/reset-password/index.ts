import { ResetPasswordPayload } from '@/api/auth/interfaces';
import { Auth } from '@/api/auth/models';
import { OTPService } from '@/api/auth/utils';
import { BadRequestError, ControllerArgs, hashData, HttpStatus, logger } from '@/core';
import { Op } from 'sequelize';

export class ResetPassword {
    constructor(private readonly dbAuth: typeof Auth, private readonly otpService: OTPService) {}

    handle = async ({ input }: ControllerArgs<ResetPasswordPayload>) => {
        if (!input) throw new BadRequestError(`Invalid Input`);

        const { emailAddress, otp, password, phoneNumber } = input;

        const authUser = await this.dbAuth.findOne({
            where: {
                [Op.or]: [{ emailAddress }],
            },
        });

        if (!authUser) throw new BadRequestError('Invalid User');

        const otpValid = this.otpService.isOtpValid(authUser.id, Number(otp));

        if (!otpValid) throw new BadRequestError('Invalid OTP');

        const hashPassword = await hashData(password);

        await this.dbAuth.update({ password: hashPassword }, { where: { [Op.or]: [{ emailAddress }] } });

        logger.info('Password Changed Successfully');

        return {
            code: HttpStatus.OK,
            message: 'Password Changed Successfully',
        };
    };
}
