import { PolicyBoard } from '@/components/domain/PolicyBoard';
import { useGameStore } from '@/stores/useGameStore';
import { calculateTaxMultiplier, getMinimumWage, calculateEmploymentTax } from '@/logic/economics';
import { calculateStateBalance } from '@/logic/taxes';
import { calculateWorkerIncomeTax } from '@/logic/scoring';
import { Users, Briefcase, Landmark, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PolicyLevel } from '@/types/game';

// Defaultní hodnoty pro simulaci na Dashboardu
const DEFAULT_WORKERS = 3;
const DEFAULT_COMPANIES = 2; // Počet firem pro State balance a CC

// --- Helper funkce pro WC/CC/State status ---

function getWcStatus(policies: any) {
  const wage = getMinimumWage(policies.labor as PolicyLevel);
  const tax = calculateWorkerIncomeTax(DEFAULT_WORKERS, policies.labor as PolicyLevel, policies.tax as PolicyLevel);
  const net = (wage * DEFAULT_WORKERS) - tax;

  return { wage, tax, net };
}

function getCcStatus(policies: any) {
  const tm = calculateTaxMultiplier(policies.tax as PolicyLevel, policies.health as PolicyLevel, policies.education as PolicyLevel);
  const employmentTax = calculateEmploymentTax(DEFAULT_COMPANIES, policies.tax as PolicyLevel, policies.health as PolicyLevel, policies.education as PolicyLevel);

  return { tm, employmentTax };
}

// --- Dashboard Component ---

export function DashboardView() {
  const { policies } = useGameStore();

  const wcStatus = getWcStatus(policies);
  const ccStatus = getCcStatus(policies);
  // Zjednodušená simulace State balance (používá defaults z logic/taxes.ts)
  const stateStatus = calculateStateBalance(DEFAULT_COMPANIES, DEFAULT_COMPANIES, policies.fiscal as PolicyLevel, policies.tax as PolicyLevel);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="text-center">
        <h2 className="text-3xl font-black text-white mb-2">Policy Overview & Impact</h2>
        <p className="text-neutral-400">Real-time economic synthesis based on current global policies.</p>
      </header>

      {/* Rychlý Přehled Dopadu */}
      <div className="grid gap-4 md:grid-cols-4">
        {/* Tax Multiplier */}
        <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-4 col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            <h3 className="text-sm uppercase text-neutral-400 font-bold">Tax Multiplier</h3>
          </div>
          <div className="space-y-1">
            <span className="text-3xl font-extrabold text-yellow-300">{ccStatus.tm}</span>
            <p className="text-xs text-neutral-500">
              (TM: P3, P4, P5 effects)
            </p>
          </div>
        </div>

        {/* State Fiscal Balance */}
        <div className={cn("bg-neutral-900 border rounded-lg p-4 col-span-2 md:col-span-1", stateStatus.balance < 0 ? 'border-red-500/50' : 'border-blue-500/50')}>
          <div className="flex items-center gap-2 mb-2">
            <Landmark className={cn("w-5 h-5", stateStatus.balance < 0 ? 'text-red-500' : 'text-blue-500')} />
            <h3 className="text-sm uppercase text-neutral-400 font-bold">Fiscal Balance (Est.)</h3>
          </div>
          <div className="space-y-1">
            <span className="text-2xl font-extrabold">{stateStatus.balance} ¥</span>
            <p className="text-xs text-neutral-500">
              Exp: {stateStatus.expenses}¥, Rev: {stateStatus.revenue}¥
            </p>
          </div>
        </div>

        {/* WC Status */}
        <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-green-400" />
            <h3 className="text-sm uppercase text-neutral-400 font-bold">WC Net Income (x{DEFAULT_WORKERS})</h3>
          </div>
          <div className="space-y-1">
            <span className="text-2xl font-extrabold text-green-400">{wcStatus.net} ¥</span>
            <p className="text-xs text-neutral-500">
              Wage: {wcStatus.wage}¥, Tax: {wcStatus.tax}¥
            </p>
          </div>
        </div>

        {/* CC Status */}
        <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Briefcase className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm uppercase text-neutral-400 font-bold">CC Tax Burden (x{DEFAULT_COMPANIES})</h3>
          </div>
          <div className="space-y-1">
            <span className="text-2xl font-extrabold text-amber-400">{ccStatus.employmentTax} ¥</span>
            <p className="text-xs text-neutral-500">
              Employment Tax (TM x {DEFAULT_COMPANIES})
            </p>
          </div>
        </div>
      </div>

      {/* Hlavní interaktivní část - Policy Board */}
      <section className="pt-6">
        <PolicyBoard />
      </section>
    </div>
  );
}