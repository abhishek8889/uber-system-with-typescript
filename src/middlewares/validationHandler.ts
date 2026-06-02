import { validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const validate = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const translatedErrors = errors.array().map(err => ({
            ...err,
            msg: req.t(err.msg),
        }));

        return res.status(422).json({ errors: translatedErrors });
    }
    next();
};
