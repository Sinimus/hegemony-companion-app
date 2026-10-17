import type { PolicyLevel } from '@/types/game';

/**
 * Calculates the maximum safe loan limit for The State based on Fiscal Policy (P1).
 * IMF Intervention is triggered if the State has more loans than this limit (AND cannot pay 55¥/loan).
 * P1 A/B: Max 5 Loans
 * P1 C: Max 3 Loans
 * @param fiscalPolicy Current Fiscal Policy (P1).
 * @returns Maximum safe loan count.
 */
export const getIMFLoanLimit = (fiscalPolicy: PolicyLevel): number => {
    if (fiscalPolicy === 'C') {
        return 3;
    }
    // A and B allow more liberal borrowing, typically up to 5 loans.
    return 5;
};
