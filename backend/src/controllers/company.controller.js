import {
  getCompanyModeProfile,
  getInterviewStyleContext,
  listCompanyModes,
  listInterviewerPersonalities,
} from '../services/interview/companyMode.service.js';

function success(res, data = {}, message = 'Success') {
  return res.json({ success: true, message, data });
}

function error(res, status, message, errors = []) {
  return res.status(status).json({ success: false, message, data: {}, errors });
}

export async function listSupportedCompanies(req, res) {
  try {
    const companies = listCompanyModes();
    const personalities = listInterviewerPersonalities();

    return success(res, { companies, personalities }, 'Supported company and interviewer modes retrieved');
  } catch (err) {
    console.error('List supported company modes error', err);
    return error(res, 500, 'Failed to retrieve supported company modes');
  }
}

export async function getCompanyMode(req, res) {
  try {
    const { company } = req.params;
    const companyProfile = getCompanyModeProfile(company);
    const styleContext = getInterviewStyleContext({
      companyMode: companyProfile.slug,
      personality: req.query.personality || 'professional',
    });

    return success(res, { company: companyProfile, styleContext }, 'Company mode profile retrieved');
  } catch (err) {
    console.error('Get company mode error', err);
    return error(res, 500, 'Failed to retrieve company mode profile');
  }
}
