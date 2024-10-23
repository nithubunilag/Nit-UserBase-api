import { ForgotPasswordPayload } from '@/api/auth/interfaces';
import { Auth } from '@/api/auth/models';
import { OTPService } from '@/api/auth/utils';
import { dispatch } from '@/app';
import { BadRequestError, ControllerArgs, HttpStatus, logger } from '@/core';
import { accountVerificationMail } from '@/core/services/mails';

export class ForgotPassword {
    constructor(private readonly dbAuth: typeof Auth, private readonly otpService: OTPService) {}

    handle = async ({ input }: ControllerArgs<ForgotPasswordPayload>) => {
        if (!input) throw new BadRequestError(`Invalid Input`);

        const { emailAddress } = input;

        const authUser = await this.dbAuth.findOne({
            where: {
                emailAddress,
            },
        });

        if (!authUser) {
            return {
                code: HttpStatus.OK,
                message: `If you have an account with us, You will receive a mail to ${emailAddress}`,
            };
        }

        const otp = await this.otpService.storeOTPInDb(authUser.id);

        await dispatch('event:sendMail', {
            to: emailAddress,
            subject: 'Forgot Password',
            body: accountVerificationMail({
                otp: otp?.toString(),
                fullName: authUser?.emailAddress ?? 'John Doe',
            }),
        });

        logger.info('Successfully Sent Forgot Password Mail to ' + emailAddress);

        return {
            code: HttpStatus.OK,
            message: `If you have an account with us, You will receive a mail to ${emailAddress}`,
        };
    };
}
