import React from 'react';
import { ReportData, getRetentionRate } from '../data/reportData';

interface RetentionRateTrackingProps {
  data: ReportData[];
}

const RetentionRateTracking: React.FC<RetentionRateTrackingProps> = ({ data }) => {
  // Calculate retention rates
  const retentionRates = data.map((_, index) => {
    if (index === 0) return 0;
    return getRetentionRate(data, index);
  });
  
  // Calculate 3-month moving average
  const movingAverages = retentionRates.map((rate, index) => {
    if (index < 2) return rate;
    return (retentionRates[index] + retentionRates[index - 1] + retentionRates[index - 2]) / 3;
  });
  
  // Calculate average retention rate (excluding first month)
  const averageRetentionRate = retentionRates.slice(1).reduce((sum, rate) => sum + rate, 0) / (retentionRates.length - 1);
  
  // Chart dimensions
  const height = 300;
  const width = 800;
  const padding = { top: 20, right: 30, bottom: 50, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  
  // Set Y-axis minimum to 60%
  const minY = 60;
  const maxY = 100;
  const scaleY = (value: number) => chartHeight - ((value - minY) / (maxY - minY)) * chartHeight + padding.top;
  
  // Generate the path for the line
  const generatePath = (rates: number[]) => {
    const pointDistance = chartWidth / (rates.length - 2);
    
    return rates.slice(1).map((rate, index) => {
      const x = index * pointDistance + padding.left;
      const y = scaleY(rate);
      return index === 0 ? `M${x},${y}` : `L${x},${y}`;
    }).join(' ');
  };
  
  // Generate month labels
  const monthLabels = data.slice(1).map(item => {
    const [month, year] = item.month.split(' ');
    return `${month.substring(0, 3)} ${year.substring(2)}`;
  });
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6">
      <h3 className="text-gray-700 font-medium mb-4">Retention Rate Tracking</h3>
      
      <div className="overflow-x-auto">
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
          {/* Y-axis grid lines */}
          {[60, 70, 80, 90, 100].map((value, i) => {
            const y = scaleY(value);
            return (
              <g key={i}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="#e5e7eb"
                  strokeWidth="1"
                />
                <text
                  x={padding.left - 10}
                  y={y}
                  textAnchor="end"
                  dominantBaseline="middle"
                  fontSize="12"
                  fill="#6b7280"
                >
                  {value}%
                </text>
              </g>
            );
          })}
          
          {/* Average retention rate line */}
          <line
            x1={padding.left}
            y1={scaleY(averageRetentionRate)}
            x2={width - padding.right}
            y2={scaleY(averageRetentionRate)}
            stroke="#9ca3af"
            strokeWidth="1"
            strokeDasharray="4 2"
          />
          <text
            x={width - padding.right + 5}
            y={scaleY(averageRetentionRate)}
            dominantBaseline="middle"
            fontSize="12"
            fill="#9ca3af"
          >
            Avg: {averageRetentionRate.toFixed(1)}%
          </text>
          
          {/* X-axis labels */}
          {monthLabels.map((label, i) => {
            const pointDistance = chartWidth / (monthLabels.length - 1);
            const x = i * pointDistance + padding.left;
            
            return (
              <g key={i}>
                <line
                  x1={x}
                  y1={padding.top}
                  x2={x}
                  y2={height - padding.bottom}
                  stroke={i % 3 === 0 ? "#e5e7eb" : "transparent"}
                  strokeWidth="1"
                />
                {i % 2 === 0 && (
                  <text
                    x={x}
                    y={height - padding.bottom + 20}
                    textAnchor="middle"
                    fontSize="12"
                    fill="#6b7280"
                  >
                    {label}
                  </text>
                )}
              </g>
            );
          })}
          
          {/* Lines */}
          <path
            d={generatePath(retentionRates)}
            fill="none"
            stroke="#4267B2"
            strokeWidth="2"
          />
          <path
            d={generatePath(movingAverages)}
            fill="none"
            stroke="#5C6BC0"
            strokeWidth="2"
            strokeDasharray="4 2"
          />
          
          {/* Data points */}
          {retentionRates.slice(1).map((rate, i) => {
            const pointDistance = chartWidth / (retentionRates.length - 2);
            const x = i * pointDistance + padding.left;
            
            // Highlight the most recent month
            const isLatestMonth = i === retentionRates.length - 2;
            
            return (
              <circle
                key={i}
                cx={x}
                cy={scaleY(rate)}
                r={isLatestMonth ? "5" : "3"}
                fill={isLatestMonth ? "#FF5252" : "#4267B2"}
              />
            );
          })}
        </svg>
      </div>
      
      <div className="flex justify-center mt-4 space-x-6">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-[#4267B2] rounded-sm mr-2"></div>
          <span className="text-sm">Monthly Retention Rate</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-[#5C6BC0] rounded-sm mr-2"></div>
          <span className="text-sm">3-Month Moving Average</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-[#FF5252] rounded-sm mr-2"></div>
          <span className="text-sm">Latest Month</span>
        </div>
      </div>
    </div>
  );
};

export default RetentionRateTracking;