import express from "express";
const router = express.Router();

import * as mainController from "../../controllers/main/mainController";
import {validate} from "../../middlewares/validationHandler";
import authMiddleware from "../../middlewares/authMiddleware";

import { validateUploadImage, validateProposalReq } from '../../requestValidatations/main/mainValidations';

import {USER_ROLE_TYPES} from "../../constants/enums";

// //  ##############  MAIN SERVICE ROUTES #############
router.get('/search-provider', authMiddleware(USER_ROLE_TYPES.CUSTOMER), validate, mainController.searchProvider);
router.post('/upload-image', authMiddleware(), validateUploadImage() ,validate , mainController.uploadImage);
router.post('/post-service-request', authMiddleware(USER_ROLE_TYPES.CUSTOMER), validate, mainController.postServiceRequest);

// router.post('/cancel-service-request', authMiddleware(USER_ROLE_TYPES.CUSTOMER , USER_ROLE_TYPES.PROVIDER ), validate, mainController.cancelServiceRequest);
// router.post('/provider-request-response', authMiddleware(USER_ROLE_TYPES.PROVIDER) ,validate , mainController.providerRequestResponse);
// router.get('/service-request-list', authMiddleware(USER_ROLE_TYPES.PROVIDER) ,validate , mainController.serviceRequestList);
// router.post('/send-proposal', authMiddleware(USER_ROLE_TYPES.PROVIDER) ,validateProposalReq(), validate , mainController.sendProposal);


// module.exports = router;
export default router;