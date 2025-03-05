import React from 'react';
import { ReportData } from '../data/reportData';

interface RevenueSourceTrendProps {
  data: ReportData[];
}

const RevenueSourceTrend: React.FC<RevenueSourceTrendProps> = ({ data }) => {
  // Chart dimensions
  const height = 300;
  const width = 800;
  const padding = { top: 20, right: 30, bottom: 50, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  
  // Generate the path for the line
  const generatePath = (metric: 'newCustomerRevenuePercentage' | 'returningCustomerRevenuePercentage') => {
    const pointDistance = chartWidth / (data.length - 1);
    
    return data.map((item, index) => {
      const x = index * pointDistance + padding.left;
      const y = chartHeight - (item[metric] / 100) * chartHeight + padding.top;
      return index === 0 ? `M${x},${y}` : `L${x},${y}`;
    }).join(' ');
  };
  
  // Calculate 3-month moving average
  const calculateMovingAverage = (metric: 'newCustomerRevenuePercentage' | 'returningCustomerRevenuePercentage') => {
    return data.map((item, index) => {
      if (index < 2) return item[metric];
      
      const sum = data[index][metric] + data[index - 1][metric] + data[index - 2][metric];
      return sum / 3;
    });
  };
  
  // Generate moving average path
  const generateMovingAveragePath = (metric: 'newCustomerRevenuePercentage' | 'returningCustomerRevenuePercentage') => {
    const pointDistance = chartWidth / (data.length - 1);
    const movingAverage = calculateMovingAverage(metric);
    
    return movingAverage.map((value, index) => {
      const x = index * pointDistance + padding.left;
      const y = chartHeight - (value / 100) * chartHeight + padding.top;
      return index === 0 ? `M${x},${y}` : `L${x},${y}`;
    }).join(' ');
  };
  
  // Generate month labels
  const monthLabels = data.map(item => {
    const [month, year] = item.month.split(' ');
    return `${month.substring(0, 3)} ${year.substring(2)}`;
  });
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6">
      <h3 className="text-primary-600 font-medium mb-4">Revenue Source Trend</h3>
      
      <div className="overflow-x-auto">
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
          {/* Y-axis grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const y = chartHeight * ratio + padding.top;
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
                  {Math.round((1 - ratio) * 100)}%
                </text>
              </g>
            );
          })}
          
          {/* Reference lines */}
          <line
            x1={padding.left}
            y1={chartHeight * 0.85 + padding.top}
            x2={width - padding.right}
            y2={chartHeight * 0.85 + padding.top}
            stroke="#9ca3af"
            strokeWidth="1"
            strokeDasharray="4 2"
          />
          <text
            x={width - padding.right + 5}
            y={chartHeight * 0.85 + padding.top}
            dominantBaseline="middle"
            fontSize="12"
            fill="#9ca3af"
          >
            15%
          </text>
          
          <line
            x1={padding.left}
            y1={chartHeight * 0.15 + padding.top}
            x2={width - padding.right}
            y2={chartHeight * 0.15 + padding.top}
            stroke="#9ca3af"
            strokeWidth="1"
            strokeDasharray="4 2"
          />
          <text
            x={width - padding.right + 5}
            y={chartHeight * 0.15 + padding.top}
            dominantBaseline="middle"
            fontSize="12"
            fill="#9ca3af"
          >
            85%
          </text>
          
          {/* X-axis labels */}
          {data.map((_, i) => {
            const pointDistance = chartWidth / (data.length - 1);
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
                    {monthLabels[i]}
                  </text>
                )}
              </g>
            );
          })}
          
          {/* Lines */}
          <path
            d={generatePath('returningCustomerRevenuePercentage')}
            fill="none"
            stroke="#C49C81"
            strokeWidth="2"
          />
          <path
            d={generatePath('newCustomerRevenuePercentage')}
            fill="none"
            stroke="#976751"
            strokeWidth="2"
          />
          
          {/* Moving Average Lines */}
          <path
            d={generateMovingAveragePath('returningCustomerRevenuePercentage')}
            fill="none"
            stroke="#C49C81"
            strokeWidth="1.5"
            strokeDasharray="4 2"
          />
          <path
            d={generateMovingAveragePath('newCustomerRevenuePercentage')}
            fill="none"
            stroke="#976751"
            strokeWidth="1.5"
            strokeDasharray="4 2"
          />
          
          {/* Data points */}
          {data.map((item, i) => {
            const pointDistance = chartWidth / (data.length - 1);
            const x = i * pointDistance + padding.left;
            
            return (
              <g key={i}>
                <circle
                  cx={x}
                  cy={chartHeight - (item.returningCustomerRevenuePercentage / 100) * chartHeight + padding.top}
                  r="3"
                  fill="#C49C81"
                />
                <circle
                  cx={x}
                  cy={chartHeight - (item.newCustomerRevenuePercentage / 100) * chartHeight + padding.top}
                  r="3"
                  fill="#976751"
                />
              </g>
            );
          })}
        </svg>
      </div>
      
      <div className="flex justify-center mt-4 space-x-6">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-primary-600 rounded-sm mr-2"></div>
          <span className="text-sm text-primary-800">New Customer Revenue %</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-secondary-DEFAULT rounded-sm mr-2"></div>
          <span className="text-sm text-primary-800">Returning Customer Revenue %</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 border border-dashed border-gray-400 mr-2"></div>
          <span className="text-sm text-primary-800">3-Month Moving Average</span>
        </div>
      </div>
    </div>
  );
};

export default RevenueSourceTrend;