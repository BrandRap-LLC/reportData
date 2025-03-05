import React from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';

interface ComparisonData {
  label: string;
  value: number;
  type: 'primary' | 'secondary' | 'tertiary';
  prefix?: string;
  suffix?: string;
}

interface KPICardProps {
  title: string;
  value: string;
  change?: number;
  prefix?: string;
  suffix?: string;
  icon?: React.ReactNode;
  comparisonData?: ComparisonData[];
}

const KPICard: React.FC<KPICardProps> = ({ 
  title, 
  value, 
  change, 
  prefix = '', 
  suffix = '', 
  icon,
  comparisonData
}) => {
  const isPositive = change ? change >= 0 : true;
  const changeColor = isPositive ? 'text-positive' : 'text-negative';
  const changeIcon = isPositive ? <ArrowUp className="w-4 h-4" aria-hidden="true" /> : <ArrowDown className="w-4 h-4" aria-hidden="true" />;
  
  return (
    <div className="card flex flex-col h-full">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-primary-600 text-base font-medium">{title}</h3>
        {icon && <div className="text-primary-600">{icon}</div>}
      </div>
      <p className="text-2xl font-bold mb-2 text-primary-800" aria-label={`${title}: ${value}`}>{value}</p>
      
      {comparisonData ? (
        <div className="mt-auto space-y-1">
          {comparisonData.map((comparison, index) => (
            <div 
              key={index} 
              className={`flex items-center ${comparison.value >= 0 ? 'text-positive' : 'text-negative'} comparison-${comparison.type}`}
              aria-live="polite"
            >
              {comparison.value >= 0 ? 
                <ArrowUp className="w-4 h-4" aria-hidden="true" /> : 
                <ArrowDown className="w-4 h-4" aria-hidden="true" />
              }
              <span className="ml-1 font-medium">
                {comparison.label}: {comparison.prefix || ''}{Math.abs(comparison.value).toFixed(1)}{comparison.suffix || ''}
              </span>
              <span className="sr-only">{comparison.value >= 0 ? 'increase' : 'decrease'}</span>
            </div>
          ))}
        </div>
      ) : change !== undefined ? (
        <div className={`flex items-center ${changeColor} mt-auto`} aria-live="polite">
          {changeIcon}
          <span className="ml-1 font-medium">
            {prefix}{Math.abs(change).toFixed(1)}{suffix}
          </span>
          <span className="sr-only">{isPositive ? 'increase' : 'decrease'}</span>
        </div>
      ) : null}
    </div>
  );
};

export default KPICard;