import React from 'react';
import { ReportData, formatCurrency, formatPercentage, getMonthOverMonthChange, getYearOverYearChange, getRetentionRate } from '../data/reportData';

interface KeyMetricsSummaryProps {
  data: ReportData[];
}

const KeyMetricsSummary: React.FC<KeyMetricsSummaryProps> = ({ data }) => {
  // Define metrics to display
  const metrics = [
    { key: 'totalCustomers', label: '# Total Customers', format: (value: number) => value.toString() },
    { key: 'totalRevenue', label: 'Total Revenue', format: formatCurrency },
    { key: 'newCustomers', label: '# New Customers', format: (value: number) => value.toString() },
    { key: 'averageRevenuePerCustomer', label: 'Avg Rev. / Customer', format: formatCurrency },
    { key: 'retention', label: 'Retention Rate', format: formatPercentage }
  ];
  
  // Get current and previous month indices
  const currentMonthIndex = data.length - 1;
  const currentMonth = data[currentMonthIndex];
  
  // Calculate sparkline data (last 12 months or all available)
  const sparklineMonths = Math.min(12, data.length);
  const sparklineData = data.slice(-sparklineMonths);
  
  // Generate sparklines
  const generateSparkline = (metric: string) => {
    const values = sparklineData.map(item => {
      if (metric === 'retention') {
        const index = data.indexOf(item);
        return index > 0 ? getRetentionRate(data, index) : 0;
      }
      return item[metric as keyof ReportData] as number;
    });
    
    // Find min and max for scaling
    const min = Math.min(...values.filter(v => v > 0));
    const max = Math.max(...values);
    const range = max - min;
    
    // Scale to 0-30 height
    const scaled = values.map(v => ((v - min) / range) * 30);
    
    // Generate SVG path
    const points = scaled.map((v, i) => `${i * 10},${30 - v}`).join(' ');
    
    return (
      <svg width="120" height="30" viewBox="0 0 120 30" className="ml-2">
        <polyline
          points={points}
          fill="none"
          stroke="#976751"
          strokeWidth="1.5"
        />
        {/* Highlight current month */}
        <circle
          cx={(scaled.length - 1) * 10}
          cy={30 - scaled[scaled.length - 1]}
          r="2"
          fill="#976751"
        />
        {/* Min/max indicators */}
        <circle
          cx={scaled.indexOf(0) * 10}
          cy="30"
          r="1.5"
          fill="#D35F5F"
        />
        <circle
          cx={scaled.indexOf(30) * 10}
          cy="0"
          r="1.5"
          fill="#7D5544"
        />
      </svg>
    );
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6">
      <h3 className="text-primary-600 font-medium mb-4">Key Metrics Summary</h3>
      
      <table className="min-w-full divide-y divide-secondary-DEFAULT">
        <thead className="bg-background">
          <tr>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-primary-700 uppercase tracking-wider">
              Metric
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-primary-700 uppercase tracking-wider">
              Current Value
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-primary-700 uppercase tracking-wider">
              MoM Change
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-primary-700 uppercase tracking-wider">
              YoY Change
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-primary-700 uppercase tracking-wider">
              12-Month Trend
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-secondary-light">
          {metrics.map((metric, index) => {
            let currentValue;
            let momChange;
            let yoyChange;
            
            if (metric.key === 'retention') {
              currentValue = getRetentionRate(data, currentMonthIndex);
              momChange = currentMonthIndex > 1 
                ? currentValue - getRetentionRate(data, currentMonthIndex - 1) 
                : 0;
              yoyChange = currentMonthIndex >= 12 
                ? currentValue - getRetentionRate(data, currentMonthIndex - 12) 
                : 0;
            } else {
              currentValue = currentMonth[metric.key as keyof ReportData] as number;
              momChange = currentMonthIndex > 0 
                ? getMonthOverMonthChange(currentValue, data[currentMonthIndex - 1][metric.key as keyof ReportData] as number) 
                : 0;
              yoyChange = getYearOverYearChange(data, currentMonthIndex, metric.key as keyof ReportData);
            }
            
            return (
              <tr key={metric.key}>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-primary-800">
                  {metric.label}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-primary-700">
                  {metric.format(currentValue)}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm">
                  <div className="flex items-center">
                    {momChange > 0 ? (
                      <span className="text-positive flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
                        </svg>
                        {metric.key === 'retention' ? formatPercentage(momChange) : `${momChange.toFixed(1)}%`}
                      </span>
                    ) : momChange < 0 ? (
                      <span className="text-negative flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                        </svg>
                        {metric.key === 'retention' ? formatPercentage(Math.abs(momChange)) : `${Math.abs(momChange).toFixed(1)}%`}
                      </span>
                    ) : (
                      <span className="text-primary-700">0.0%</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm">
                  <div className="flex items-center">
                    {yoyChange > 0 ? (
                      <span className="text-positive flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
                        </svg>
                        {metric.key === 'retention' ? formatPercentage(yoyChange) : `${yoyChange.toFixed(1)}%`}
                      </span>
                    ) : yoyChange < 0 ? (
                      <span className="text-negative flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                        </svg>
                        {metric.key === 'retention' ? formatPercentage(Math.abs(yoyChange)) : `${Math.abs(yoyChange).toFixed(1)}%`}
                      </span>
                    ) : (
                      <span className="text-primary-700">0.0%</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  {generateSparkline(metric.key)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default KeyMetricsSummary;