import { CheckCircle2, AlertCircle } from 'lucide-react';
import { BenefitResponse } from '../types';

interface BenefitCardProps {
  benefit: BenefitResponse | null;
  error: string | null;
}

export default function BenefitCard({ benefit, error }: BenefitCardProps) {
  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <h3 className="text-lg font-semibold text-slate-900">Error</h3>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  if (!benefit) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle2 className="w-5 h-5 text-green-500" />
          <h3 className="text-lg font-semibold text-slate-900">Verified Benefits</h3>
        </div>
        <div className="text-center py-12 text-slate-500">
          <p>Ask about your Visa card benefits to see them here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center gap-2 mb-6">
        <CheckCircle2 className="w-5 h-5 text-green-500" />
        <h3 className="text-lg font-semibold text-slate-900">Verified Benefits</h3>
      </div>

      <div className="space-y-6">
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-6 border border-slate-200">
          <div className="mb-4">
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Benefit
            </h4>
            <p className="text-xl font-bold text-slate-900">{benefit.benefit}</p>
          </div>

          <div className="mb-4">
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Details
            </h4>
            <p className="text-slate-700 leading-relaxed">{benefit.details}</p>
          </div>

          <div className="mb-4">
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Condition
            </h4>
            <p className="text-slate-700">{benefit.condition}</p>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Source
            </h4>
            <p className="text-sm text-slate-600 italic">{benefit.source}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
