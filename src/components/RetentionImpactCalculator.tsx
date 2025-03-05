import React, { useState } from 'react';
import { ReportData, formatCurrency, getRetentionRate } from '../data/reportData';

interface RetentionImpactCalculatorProps {
  data: ReportData[];
}

const RetentionImpactCalculator: React.FC<RetentionImpactCalculatorProps> = ({ data }) => {
  const [improvementPercentage, setImprovementPercentage] = useState(5);
  
  // Get latest month data
  const latestMonth = data[data.length - 1];
  
  // Calculate current retention rate
  const currentRetentionRate = getRetentionRate(data, data.length - 1);
  
  // Calculate improved retention rate
  const improvedRetentionRate = currentRetentionRate + improvementPercentage;
  
  // Calculate additional revenue
  const retentionRevenuePortion = latestMonth.totalRevenue * (latestMonth.returningCustomers / latestMonth.totalCustomers);
  const additionalRevenue = retentionRevenuePortion * (improvementPercentage / 100);
  
  return (
    <div className="card mt-6">
      <h3 className="text-gray-700 font-medium mb-4">Retention Impact Calculator</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="mb-4">
            <label htmlFor="improvement" className="block text-sm font-medium text-gray-700 mb-1">
              Retention Rate Improvement
            </label>
            <div className="flex items-center">
              <input
                type="range"
                id="improvement"
                min="1"
                max="10"
                step="0.5"
                value={improvementPercentage}
                onChange={(e) => setImprovementPercentage(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                aria-valuemin={1}
                aria-valuemax={10}
                aria-valuenow={improvementPercentage}
                aria-valuetext={`${improvementPercentage}%`}
              />
              <span className="ml-2 text-sm font-medium text-gray-700 w-12">
                {improvementPercentage}%
              </span>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">
              This calculator shows the potential revenue impact of improving your customer retention rate.
            </p>
            <p className="text-sm text-gray-600">
              Formula: Current Revenue × (Returning Customers / Total Customers) × Improvement Percentage
            </p>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="mb-4">
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-600">Current Retention Rate:</span>
              <span className="text-sm font-medium">{currentRetentionRate.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-600">Improved Retention Rate:</span>
              <span className="text-sm font-medium">{improvedRetentionRate.toFixed(1)}%</span>
            </div>
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-600">Current Monthly Revenue:</span>
              <span className="text-sm font-medium">{formatCurrency(latestMonth.totalRevenue)}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-600">Revenue from Returning Customers:</span>
              <span className="text-sm font-medium">{formatCurrency(latestMonth.returningCustomerRevenue)}</span>
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-gray-700 font-medium">Potential Additional Revenue:</span>
              <span className="text-xl font-bold text-green-600" aria-live="polite">{formatCurrency(additionalRevenue)}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
        <h4 className="text-indigo-700 font-medium mb-2">Why This Matters</h4>
        <p className="text-sm text-indigo-900">
          Improving customer retention is typically more cost-effective than acquiring new customers. 
          A small improvement in retention rate can have a significant impact on revenue and profitability.
        </p>
      </div>
    </div>
  );
};

export default RetentionImpactCalculator;