import React from 'react';

interface RetentionMetricProps {
  currentRate: number;
  threeMonthAverage: number;
}

const RetentionMetric: React.FC<RetentionMetricProps> = ({ currentRate, threeMonthAverage }) => {
  return (
    <div className="card h-full">
      <h3 className="text-gray-700 font-medium mb-4">Retention Rate</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-2">Current Month</p>
          <div className="flex items-center justify-center">
            <div className="relative w-28 h-28">
              <svg className="w-full h-full" viewBox="0 0 100 100" aria-label={`Current month retention rate: ${currentRate.toFixed(1)}%`}>
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="transparent"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                  aria-hidden="true"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="transparent"
                  stroke="#4267B2"
                  strokeWidth="8"
                  strokeDasharray={`${(currentRate / 100) * 2 * Math.PI * 45} ${2 * Math.PI * 45}`}
                  transform="rotate(-90 50 50)"
                  aria-hidden="true"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-xl font-bold">{currentRate.toFixed(1)}%</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-2">3-Month Average</p>
          <div className="flex items-center justify-center">
            <div className="relative w-28 h-28">
              <svg className="w-full h-full" viewBox="0 0 100 100" aria-label={`3-month average retention rate: ${threeMonthAverage.toFixed(1)}%`}>
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="transparent"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                  aria-hidden="true"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="transparent"
                  stroke="#5C6BC0"
                  strokeWidth="8"
                  strokeDasharray={`${(threeMonthAverage / 100) * 2 * Math.PI * 45} ${2 * Math.PI * 45}`}
                  transform="rotate(-90 50 50)"
                  aria-hidden="true"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-xl font-bold">{threeMonthAverage.toFixed(1)}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
        <p>Retention rate measures the percentage of last month's customers who returned this month. Higher rates indicate stronger customer loyalty.</p>
      </div>
    </div>
  );
};

export default RetentionMetric;