import React from 'react';
import { ReportData } from '../data/reportData';

interface NewCustomerContributionProps {
  data: ReportData[];
}

const NewCustomerContribution: React.FC<NewCustomerContributionProps> = ({ data }) => {
  // Chart dimensions
  const height = 300;
  const width = 800;
  const padding = { top: 20, right: 60, bottom: 50, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  
  // Find the maximum values to scale the chart
  const maxNewCustomers = Math.max(...data.map(item => item.newCustomers));
  const maxPercentage = 25; // Cap at 25% for better visualization
  
  // Define target percentage
  const targetPercentage = 15; // Example target
  
  // Scale values to fit in the chart
  const scaleYCustomers = (value: number) => chartHeight - (value / maxNewCustomers) * chartHeight + padding.top;
  const scaleYPercentage = (value: number) => chartHeight - (value / maxPercentage) * chartHeight + padding.top;
  
  // Generate the path for the line
  const generatePath = (metric: 'newCustomerRevenuePercentage') => {
    const pointDistance = chartWidth / (data.length - 1);
    
    return data.map((item, index) => {
      const x = index * pointDistance + padding.left;
      const y = scaleYPercentage(item[metric]);
      return index === 0 ? `M${x},${y}` : `L${x},${y}`;
    }).join(' ');
  };
  
  // Generate month labels
  const monthLabels = data.map(item => {
    const [month, year] = item.month.split(' ');
    return `${month.substring(0, 3)} ${year.substring(2)}`;
  });
  
  // Bar width calculations
  const barWidth = (chartWidth / data.length) * 0.6;
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6">
      <h3 className="text-primary-600 font-medium mb-4">New Customer Contribution</h3>
      
      <div className="overflow-x-auto">
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
          {/* Y-axis grid lines - New Customers */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const y = scaleYCustomers(maxNewCustomers * ratio);
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
                  {Math.round(maxNewCustomers * (1 - ratio))}
                </text>
              </g>
            );
          })}
          
          {/* Y-axis grid lines - Percentage */}
          {[0, 5, 10, 15, 20, 25].map((value, i) => {
            const y = scaleYPercentage(value);
            return (
              <text
                key={`pct-${i}`}
                x={width - padding.right + 10}
                y={y}
                textAnchor="start"
                dominantBaseline="middle"
                fontSize="12"
                fill="#976751"
              >
                {value}%
              </text>
            );
          })}
          
          {/* Target reference line */}
          <line
            x1={padding.left}
            y1={scaleYPercentage(targetPercentage)}
            x2={width - padding.right}
            y2={scaleYPercentage(targetPercentage)}
            stroke="#C49C81"
            strokeWidth="1"
            strokeDasharray="4 2"
          />
          <text
            x={width - padding.right + 40}
            y={scaleYPercentage(targetPercentage)}
            dominantBaseline="middle"
            fontSize="12"
            fill="#C49C81"
          >
            Target: {targetPercentage}%
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
          
          {/* Bars for new customers */}
          {data.map((item, i) => {
            const pointDistance = chartWidth / (data.length - 1);
            const x = i * pointDistance + padding.left - barWidth / 2;
            const y = scaleYCustomers(item.newCustomers);
            const barHeight = chartHeight + padding.top - y;
            
            return (
              <rect
                key={i}
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill="#976751"
                fillOpacity="0.7"
                rx="2"
              />
            );
          })}
          
          {/* Line for new customer revenue percentage */}
          <path
            d={generatePath('newCustomerRevenuePercentage')}
            fill="none"
            stroke="#976751"
            strokeWidth="3"
          />
          
          {/* Data points for percentage */}
          {data.map((item, i) => {
            const pointDistance = chartWidth / (data.length - 1);
            const x = i * pointDistance + padding.left;
            const y = scaleYPercentage(item.newCustomerRevenuePercentage);
            const aboveTarget = item.newCustomerRevenuePercentage > targetPercentage;
            
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="5"
                fill={aboveTarget ? "#7D5544" : "#976751"}
                stroke="white"
                strokeWidth="1"
              />
            );
          })}
          
          {/* Value labels for the most recent month */}
          {(() => {
            const lastIndex = data.length - 1;
            const pointDistance = chartWidth / (data.length - 1);
            const x = lastIndex * pointDistance + padding.left;
            const yCustomers = scaleYCustomers(data[lastIndex].newCustomers);
            const yPercentage = scaleYPercentage(data[lastIndex].newCustomerRevenuePercentage);
            
            return (
              <g>
                <text
                  x={x + 15}
                  y={yCustomers}
                  textAnchor="start"
                  dominantBaseline="middle"
                  fontSize="12"
                  fontWeight="bold"
                  fill="#976751"
                >
                  {data[lastIndex].newCustomers}
                </text>
                <text
                  x={x + 15}
                  y={yPercentage}
                  textAnchor="start"
                  dominantBaseline="middle"
                  fontSize="12"
                  fontWeight="bold"
                  fill="#976751"
                >
                  {data[lastIndex].newCustomerRevenuePercentage.toFixed(1)}%
                </text>
              </g>
            );
          })()}
        </svg>
      </div>
      
      <div className="flex justify-center mt-4 space-x-6">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-primary-600 opacity-70 rounded-sm mr-2"></div>
          <span className="text-sm text-primary-800"># New Customers</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-primary-600 rounded-sm mr-2"></div>
          <span className="text-sm text-primary-800">New Customer Revenue %</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-secondary-DEFAULT rounded-sm mr-2"></div>
          <span className="text-sm text-primary-800">Target Percentage</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-primary-700 rounded-sm mr-2"></div>
          <span className="text-sm text-primary-800">Above Target</span>
        </div>
      </div>
      
      <div className="mt-4 text-sm text-primary-700 bg-background p-3 rounded-md">
        <p>This chart shows both the number of new customers (bars) and the percentage of total revenue they contribute (line) each month. Points highlighted in darker brown indicate months where the new customer revenue percentage exceeded the target.</p>
      </div>
    </div>
  );
};

export default NewCustomerContribution;