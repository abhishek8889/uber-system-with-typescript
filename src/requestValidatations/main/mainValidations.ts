import { body } from 'express-validator';
import { VERIFICATION_TOKEN_TYPE } from '../../constants/enums';
import * as serviceRequestRepository from '../../dbRepositories/serviceRequestRepository';
import mongoose from 'mongoose';

export const validateUploadImage = () => {
    return [
        body('image').custom((value, { req }) => {
            if (!req.files || !req.files.image) {
                throw new Error('validation.image_required');
            }
            return true;
        })
    ];
};

export const validateProposalReq = () => {
    return [
        body('request_id')
            .notEmpty()
            .withMessage('validation.user_id_required')
            .custom((value: string) => {
                if (!mongoose.Types.ObjectId.isValid(value)) {
                    throw new Error('validation.invalid_id_format');
                }
                return true;
            })
            .custom(async (value: string) => {
                const exists = await serviceRequestRepository.findOne({ _id: value });
                if (!exists) {
                    throw new Error('validation.request_not_found');
                }
                return true;
            }),

        body('proposal')
            .isLength({ max: 1000 })
            .withMessage('validation.proposal_too_long'),

        body('provider_quotation')
            .isNumeric()
            .withMessage('validation.quotation_should_be_number'),

        body('available_at')
            .optional({ checkFalsy: true })
            .isISO8601()
            .withMessage('validation.available_at_should_be_date'),

        body('expected_duration')
            .optional({ checkFalsy: true })
            .isLength({ max: 500 })
            .withMessage('validation.duration_character_lessthan_500')
    ];
};
