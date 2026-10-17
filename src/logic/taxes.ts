import type { PolicyLevel } from '@/types/game';

// Loans at which the IMF intervenes in Check IMF if the State cannot pay them off (Fiscal Policy, p. 30).
export const IMF_LOAN_THRESHOLD: Record<PolicyLevel, number> = { A: 2, B: 2, C: 1 };

/**
 * Whether the State reaches the IMF intervention threshold for the current Fiscal Policy
 * (Check IMF step of the Production Phase, p. 12). The IMF intervenes when the State holds
 * at least the threshold number of Loans and cannot pay them off at 55 each at that moment.
 * Interest has nothing to do with it.
 * @param stateLoans Number of Loans the State currently holds.
 * @param fiscalPolicy Current Fiscal Policy (P1).
 */
export function isImfInterventionDue(stateLoans: number, fiscalPolicy: PolicyLevel): boolean {
    return stateLoans >= IMF_LOAN_THRESHOLD[fiscalPolicy];
}
