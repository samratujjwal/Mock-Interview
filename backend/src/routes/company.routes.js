import { Router } from 'express';
import { listSupportedCompanies, getCompanyMode } from '../controllers/company.controller.js';

const router = Router();

router.get('/', listSupportedCompanies);
router.get('/:company', getCompanyMode);

export default router;
