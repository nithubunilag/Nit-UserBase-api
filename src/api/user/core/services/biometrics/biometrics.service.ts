import { Role, User } from '@/api/user/core/models';
import { BadRequestError } from '@/core';
import { Request, Response } from 'express';

export class BiometricService {
    constructor(private readonly dbUser: typeof User, private readonly dbRole: typeof Role) {}

    registerEmployeeBiometrics = async (req: Request, res: Response) => {
        const employeeId = req.body.employeeId;
        const ownIdData = req.body.ownIdData;

        if (!employeeId) throw new BadRequestError('No Employee ID Provided!');
        if (!ownIdData) throw new BadRequestError('Invalid Own Id Provided!');

        const user = await this.dbUser.findOne({
            where: {
                id: employeeId,
            },
        });

        if (!user) throw new BadRequestError('Invalid Employee!');

        user.ownIdData = ownIdData;

        await user.save();

        return res.sendStatus(204);
    };

    authenticateEmployee = async (req: Request, res: Response) => {
        const employeeId = req.body.employeeId;

        if (!employeeId) throw new BadRequestError('No Employee ID Provided!');

        const user = await this.dbUser.findOne({
            where: {
                id: employeeId,
            },
        });

        if (!user) throw new BadRequestError('Invalid Employee!');

        // res.json({ ownIdData: user.ownIdData }); 

        // user.ownIdData = ownIdData;

        // await user.save();

        // return res.sendStatus(204);
    };
}
