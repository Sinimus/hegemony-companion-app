import { PolicyBoard } from '@/components/domain/PolicyBoard';
import { useGameStore } from '@/stores/useGameStore';
import {
  calculateTaxMultiplier,
  getAllowedWageLevels,
  getIncomeTaxRate,
  IMMIGRATION_EXTRA_WORKERS,
  PUBLIC_SERVICE_PRICE,
} from '@/logic/economics';
import { isIncomeTaxRateVerified } from '@/logic/taxData';
import { TARIFF_RATES } from '@/logic/trade';
import { Zap, Users, Coins, Heart, Truck, UserPlus } from 'lucide-react';
import { LoanCostCalc } from '@/components/calculators/LoanCostCalc';

// --- Dashboard Component ---

export function DashboardView() {
  const { policies } = useGameStore();

  const taxMultiplier = calculateTaxMultiplier(policies.tax, policies.health, policies.education);
  const incomeTaxRate = getIncomeTaxRate(policies.labor, policies.tax);
  const allowedWageLevels = getAllowedWageLevels(policies.labor).join(', ');

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="text-center">
        <h2 className="text-3xl font-black text-white mb-2">Policy Overview & Impact</h2>
        <p className="text-neutral-400">What the current Policies mean for taxes, prices and Workers.</p>
      </header>

      {/* Policy effects at a glance */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-3">
        {/* Tax Multiplier */}
        <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            <h3 className="text-sm uppercase text-neutral-400 font-bold">Tax Multiplier</h3>
          </div>
          <div className="space-y-1">
            <span className="text-3xl font-extrabold text-yellow-300">{taxMultiplier}</span>
            <p className="text-xs text-neutral-500">
              (TM: P3, P4, P5 effects)
            </p>
          </div>
        </div>

        {/* Minimum Wage */}
        <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-green-400" />
            <h3 className="text-sm uppercase text-neutral-400 font-bold">Minimum Wage (P2)</h3>
          </div>
          <div className="space-y-1">
            <span className="text-3xl font-extrabold text-green-400">{allowedWageLevels}</span>
            <p className="text-xs text-neutral-500">
              Wage levels allowed on Company cards (p. 30)
            </p>
          </div>
        </div>

        {/* Income Tax per Population */}
        <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Coins className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm uppercase text-neutral-400 font-bold">Income Tax per Population (P2/P3)</h3>
          </div>
          <div className="space-y-1">
            <span className="text-3xl font-extrabold text-amber-400">{incomeTaxRate} ¥</span>
            {!isIncomeTaxRateVerified(policies.labor, policies.tax) && (
              <p className="text-xs text-amber-400/80">Tax rate from the player aid table; not verified against the rules text.</p>
            )}
          </div>
        </div>

        {/* Public Health / Education */}
        <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Heart className="w-5 h-5 text-red-400" />
            <h3 className="text-sm uppercase text-neutral-400 font-bold">Public Health / Education (P4/P5)</h3>
          </div>
          <div className="space-y-1">
            <span className="text-2xl font-extrabold text-red-400">
              Health {PUBLIC_SERVICE_PRICE[policies.health]} / Education {PUBLIC_SERVICE_PRICE[policies.education]}
            </span>
            <p className="text-xs text-neutral-500">
              Price per benefit (p. 31)
            </p>
          </div>
        </div>

        {/* Import tariffs */}
        <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Truck className="w-5 h-5 text-blue-400" />
            <h3 className="text-sm uppercase text-neutral-400 font-bold">Import tariffs (P6)</h3>
          </div>
          <div className="space-y-1">
            <span className="text-2xl font-extrabold text-blue-400">
              Food {TARIFF_RATES[policies.trade].food} / Luxury {TARIFF_RATES[policies.trade].luxury}
            </span>
            <p className="text-xs text-neutral-500">
              Tariff per imported good (p. 32)
            </p>
          </div>
        </div>

        {/* New Workers per round */}
        <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <UserPlus className="w-5 h-5 text-green-400" />
            <h3 className="text-sm uppercase text-neutral-400 font-bold">New Workers per round (P7)</h3>
          </div>
          <div className="space-y-1">
            <span className="text-2xl font-extrabold text-green-400">
              2 + {IMMIGRATION_EXTRA_WORKERS[policies.immigration]}
            </span>
            <p className="text-xs text-neutral-500">
              each for Working and Middle Class (p. 32)
            </p>
          </div>
        </div>
      </div>

      {/* Loan Planner integrated below the quick stats, spanning all columns */}
      <div className="pt-2">
          <LoanCostCalc />
      </div>

      {/* Main interactive part - Policy Board */}
      <section className="pt-6">
        <PolicyBoard />
      </section>
    </div>
  );
}
