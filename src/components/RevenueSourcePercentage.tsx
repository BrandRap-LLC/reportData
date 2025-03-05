import React from 'react';
import { ReportData } from '../data/reportData';

interface RevenueSourcePercentageProps {
  data: ReportData[];
}

const RevenueSourcePercentage: React.FC<RevenueSourcePercentageProps> = ({ data }) => {
  // Chart dimensions
  const height = 300;
  const width = 800;
  const padding = { top: 20, right: 30, bottom: 50, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const barWidth = chartWidth / data.length - 10;
  
  // Generate month labels
  const monthLabels = data.map(item => {
    const [month, year] = item.month.split(' ');
    return `${month.substring(0, 3)} ${year.substring(2)}`;
  });
  
  return (
    <div className="card mt-6">
      <h3 className="text-primary-600 font-medium mb-4">Revenue Source Percentage</h3>
      
      <div className="overflow-x-auto">
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-label="Stacked bar chart showing percentage of revenue from new vs returning customers">
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
                  aria-hidden="true"
                />
                <text
                  x={padding.left - 10}
                  y={y}
                  textAnchor="end"
                  dominantBaseline="middle"
                  fontSize="12"
                  fill="#6b7280"
                  aria-hidden="true"
                >
                  {Math.round((1 - ratio) * 100)}%
                </text>
              </g>
            );
          })}
          
          {/* Reference line at 20% */}
          <line
            x1={padding.left}
            y1={chartHeight * 0.8 + padding.top}
            x2={width - padding.right}
            y2={chartHeight * 0.8 + padding.top}
            stroke="#9ca3af"
            strokeWidth="1"
            strokeDasharray="4 2"
            aria-hidden="true"
          />
          <text
            x={width - padding.right + 5}
            y={chartHeight * 0.8 + padding.top}
            dominantBaseline="middle"
            fontSize="12"
            fill="#9ca3af"
            aria-hidden="true"
          >
            20%
          </text>
          
          {/* Stacked bars */}
          {data.map((item, i) => {
            const x = i * (barWidth + 10) + padding.left;
            
            return (
              <g key={i}>
                {/* New Customer Revenue */}
                <rect
                  x={x}
                  y={chartHeight - chartHeight * (item.newCustomerRevenuePercentage / 100) + padding.top}
                  width={barWidth}
                  height={chartHeight * (item.newCustomerRevenuePercentage / 100)}
                  fill="#976751"
                  aria-label={`New customer revenue for ${item.month}: ${item.newCustomerRevenuePercentage.toFixed(1)}%`}
                />
                
                {/* Returning Customer Revenue */}
                <rect
                  x={x}
                  y={padding.top}
                  width={barWidth}
                  height={chartHeight * (item.returningCustomerRevenuePercentage / 100)}
                  fill="#C49C81"
                  aria-label={`Returning customer revenue for ${item.month}: ${item.returningCustomerRevenuePercentage.toFixed(1)}%`}
                />
                
                {/* X-axis labels */}
                <text
                  x={x + barWidth / 2}
                  y={height - padding.bottom + 20}
                  textAnchor="middle"
                  fontSize="12"
                  fill="#6b7280"
                  aria-hidden="true"
                >
                  {monthLabels[i]}
                </text>
                
                {/* Percentage labels for current month */}
                {i === data.length - 1 && (
                  <>
                    <text
                      x={x + barWidth / 2}
                      y={chartHeight - chartHeight * (item.newCustomerRevenuePercentage / 100) / 2 + padding.top}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize="12"
                      fill="white"
                      fontWeight="bold"
                      aria-hidden="true"
                    >
                      {item.newCustomerRevenuePercentage.toFixed(1)}%
                    </text>
                    <text
                      x={x + barWidth / 2}
                      y={padding.top + chartHeight * (item.returningCustomerRevenuePercentage / 100) / 2}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize="12"
                      fill="white"
                      fontWeight="bold"
                      aria-hidden="true"
                    >
                      {item.returningCustomerRevenuePercentage.toFixed(1)}%
                    </text>
                  </>
                )}
              </g>
            );
          })}
        </svg>
      </div>
      
      <div className="flex flex-wrap justify-center mt-4 gap-6">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-primary-600 rounded-sm mr-2" aria-hidden="true"></div>
          <span className="text-sm text-primary-800">New Customer Revenue %</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-secondary-DEFAULT rounded-sm mr-2" aria-hidden="true"></div>
          <span className="text-sm text-primary-800">Returning Customer Revenue %</span>
        </div>
      </div>
      
      <div className="mt-4 text-sm text-primary-700 bg-background p-3 rounded-md">
        <p>This chart shows the percentage breakdown of revenue between new and returning customers each month.</p>
      </div>
    </div>
  );
};

export default RevenueSourcePercentage;