import express from 'express';
const router = express.Router();

import * as authController from '../../controllers/auth/authController';
import { validateRegister, validateVerifyOtp, validateSendLoginOtp } from '../../requestValidatations/auth/authValidations';
import { validate } from '../../middlewares/validationHandler';
import authMiddleware from '../../middlewares/authMiddleware';
import { USER_ROLE_TYPES } from '../../constants/enums';

// ############## Authentication Routes #############

router.post('/register',validateRegister(),validate,authController.register);
router.post('/provider-register',validateRegister(),validate,authController.providerRegister);

router.post('/customer-register',validateRegister(),validate,authController.customerRegister);
router.post('/send-login-otp',validateSendLoginOtp(),validate,authController.sendLoginOtp);
router.post('/verify-otp',validateVerifyOtp(),validate,authController.verifyOtp);

// // ############## Provider Profile Update #############
router.post('/provider-profile-update',authMiddleware(USER_ROLE_TYPES.PROVIDER),validate,authController.providerProfileUpdate);




//  ##############  MAIN SERVICE ROUTES #############



// module.exports = router;
export default router;