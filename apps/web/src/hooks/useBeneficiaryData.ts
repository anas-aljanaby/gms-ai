
import { INITIAL_BENEFICIARY_DATA } from '../data/beneficiaryData';
import { useBeneficiaries } from './useBeneficiaries';

/** Mock projects until the Projects module is activated. */
export const BENEFICIARY_MOCK_PROJECTS = INITIAL_BENEFICIARY_DATA.projects;

/**
 * Backward-compatible hook used by App.tsx (ProjectManagement) and BeneficiariesModule.
 * Beneficiaries come from the Hono API; projects remain placeholder data.
 */
export const useBeneficiaryData = () => {
    const { data: beneficiaries = [], isLoading, isError, refetch } = useBeneficiaries();

    return {
        beneficiaryData: {
            projects: BENEFICIARY_MOCK_PROJECTS,
            beneficiaries,
        },
        isLoading,
        isError,
        refetch,
    };
};
