import React from 'react';
import { ReportData } from '../data/reportData';

interface RevenueChartProps {
  data: ReportData[];
}

const RevenueChart: React.FC<RevenueChartProps> = ({ data }) => {
  // Find the maximum values to scale the chart
  const maxRevenue = Math.max(
    ...data.map(item => item.totalRevenue),
    ...data.map(item => item.newCustomerRevenue),
    ...data.map(item => item.returningCustomerRevenue)
  );
  
  const maxAvgRevenue = Math.max(...data.map(item => item.averageRevenuePerCustomer));
  
  // Chart dimensions
  const height = 300;
  const width = 800;
  const padding = { top: 20, right: 60, bottom: 50, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  
  // Scale values to fit in the chart - FIXED to make Y-axis start from 0 at the bottom
  const scaleY = (value: number) => padding.top + chartHeight - (value / maxRevenue) * chartHeight;
  const scaleYAvg = (value: number) => padding.top + chartHeight - (value / maxAvgRevenue) * chartHeight;
  
  // Generate the path for the line
  const generatePath = (metric: keyof ReportData, scale: (value: number) => number) => {
    const pointDistance = chartWidth / (data.length - 1);
    
    return data.map((item, index) => {
      const x = index * pointDistance + padding.left;
      const y = scale(item[metric] as number);
      return index === 0 ? `M${x},${y}` : `L${x},${y}`;
    }).join(' ');
  };
  
  // Generate month labels
  const monthLabels = data.map(item => {
    const [month, year] = item.month.split(' ');
    return `${month.substring(0, 3)} ${year.substring(2)}`;
  });
  
  // Calculate 3-month moving average for Avg Rev / Cust
  const movingAverage = data.map((item, index) => {
    if (index < 2) return item.averageRevenuePerCustomer;
    
    const sum = data[index].averageRevenuePerCustomer + 
                data[index - 1].averageRevenuePerCustomer + 
                data[index - 2].averageRevenuePerCustomer;
    return sum / 3;
  });
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6">
      <h3 className="text-primary-600 font-medium mb-4">Revenue Trends</h3>
      
      <div className="overflow-x-auto">
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
          {/* Y-axis grid lines - Revenue */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const y = padding.top + chartHeight * (1 - ratio);
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
                  ${Math.round(maxRevenue * ratio).toLocaleString()}
                </text>
              </g>
            );
          })}
          
          {/* Y-axis grid lines - Avg Revenue */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const y = padding.top + chartHeight * (1 - ratio);
            return (
              <text
                key={`avg-${i}`}
                x={width - padding.right + 10}
                y={y}
                textAnchor="start"
                dominantBaseline="middle"
                fontSize="12"
                fill="#976751"
              >
                ${Math.round(maxAvgRevenue * ratio)}
              </text>
            );
          })}
          
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
          
          {/* Revenue Lines */}
          <path
            d={generatePath('returningCustomerRevenue', scaleY)}
            fill="none"
            stroke="#C49C81"
            strokeWidth="2"
          />
          <path
            d={generatePath('newCustomerRevenue', scaleY)}
            fill="none"
            stroke="#976751"
            strokeWidth="2"
          />
          <path
            d={generatePath('totalRevenue', scaleY)}
            fill="none"
            stroke="#7D5544"
            strokeWidth="3"
          />
          
          {/* Avg Revenue per Customer - Bars */}
          {data.map((item, i) => {
            const pointDistance = chartWidth / (data.length - 1);
            const x = i * pointDistance + padding.left - 5;
            const y = scaleYAvg(item.averageRevenuePerCustomer);
            const height = chartHeight + padding.top - y;
            
            return (
              <rect
                key={i}
                x={x}
                y={y}
                width="10"
                height={height}
                fill="#EDD7C8"
                fillOpacity="0.7"
              />
            );
          })}
          
          {/* Moving Average Line */}
          <path
            d={data.map((item, index) => {
              const pointDistance = chartWidth / (data.length - 1);
              const x = index * pointDistance + padding.left;
              const y = scaleYAvg(movingAverage[index]);
              return index === 0 ? `M${x},${y}` : `L${x},${y}`;
            }).join(' ')}
            fill="none"
            stroke="#976751"
            strokeWidth="2"
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
                  cy={scaleY(item.returningCustomerRevenue)}
                  r="3"
                  fill="#C49C81"
                />
                <circle
                  cx={x}
                  cy={scaleY(item.newCustomerRevenue)}
                  r="3"
                  fill="#976751"
                />
                <circle
                  cx={x}
                  cy={scaleY(item.totalRevenue)}
                  r="4"
                  fill="#7D5544"
                />
              </g>
            );
          })}
        </svg>
      </div>
      
      <div className="flex justify-center mt-4 space-x-6">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-primary-700 rounded-sm mr-2"></div>
          <span className="text-sm text-primary-800">Total Revenue</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-primary-600 rounded-sm mr-2"></div>
          <span className="text-sm text-primary-800">New Customer Revenue</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-secondary-DEFAULT rounded-sm mr-2"></div>
          <span className="text-sm text-primary-800">Returning Customer Revenue</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-background rounded-sm mr-2"></div>
          <span className="text-sm text-primary-800">Avg Revenue/Customer</span>
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;