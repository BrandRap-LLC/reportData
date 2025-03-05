import React from 'react';
import { ReportData, formatCurrency, getMonthOverMonthChange } from '../data/reportData';

interface NewCustomerRevenueProps {
  data: ReportData[];
}

const NewCustomerRevenue: React.FC<NewCustomerRevenueProps> = ({ data }) => {
  // Get the last 6 months of data
  const last6Months = data.slice(-6);
  
  // Calculate average revenue per new customer
  const avgRevenuePerNewCustomer = last6Months.map(month => ({
    month: month.month,
    avgRevenue: month.newCustomerRevenue / month.newCustomers,
    newCustomers: month.newCustomers
  }));
  
  // Calculate month-over-month changes
  const momChanges = avgRevenuePerNewCustomer.map((month, index) => {
    if (index === 0) return 0;
    return getMonthOverMonthChange(month.avgRevenue, avgRevenuePerNewCustomer[index - 1].avgRevenue);
  });
  
  // Chart dimensions
  const height = 300;
  const width = 800;
  const padding = { top: 40, right: 30, bottom: 70, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  
  // Find the maximum value to scale the chart
  const maxValue = Math.max(...avgRevenuePerNewCustomer.map(item => item.avgRevenue)) * 1.2;
  
  // Bar width calculations
  const barWidth = (chartWidth / avgRevenuePerNewCustomer.length) * 0.7;
  const barGap = (chartWidth / avgRevenuePerNewCustomer.length) * 0.3;
  
  // Generate month labels
  const monthLabels = avgRevenuePerNewCustomer.map(item => {
    const [month, year] = item.month.split(' ');
    return `${month.substring(0, 3)} ${year.substring(2)}`;
  });
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6">
      <h3 className="text-primary-600 font-medium mb-4">New Customer Revenue Efficiency</h3>
      
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
                  ${Math.round(maxValue * (1 - ratio)).toLocaleString()}
                </text>
              </g>
            );
          })}
          
          {/* Bars */}
          {avgRevenuePerNewCustomer.map((item, i) => {
            const x = i * (barWidth + barGap) + padding.left;
            const y = chartHeight - (item.avgRevenue / maxValue) * chartHeight + padding.top;
            const barHeight = (item.avgRevenue / maxValue) * chartHeight;
            
            return (
              <g key={i}>
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  fill="#976751"
                  rx="4"
                />
                
                {/* Value label */}
                <text
                  x={x + barWidth / 2}
                  y={y - 10}
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight="bold"
                  fill="#976751"
                >
                  {formatCurrency(item.avgRevenue)}
                </text>
                
                {/* Month-over-month change */}
                {i > 0 && (
                  <text
                    x={x + barWidth / 2}
                    y={y - 25}
                    textAnchor="middle"
                    fontSize="11"
                    fill={momChanges[i] >= 0 ? "#7D5544" : "#D35F5F"}
                  >
                    {momChanges[i] >= 0 ? "+" : ""}{momChanges[i].toFixed(1)}%
                  </text>
                )}
                
                {/* X-axis labels */}
                <text
                  x={x + barWidth / 2}
                  y={height - padding.bottom + 20}
                  textAnchor="middle"
                  fontSize="12"
                  fill="#6b7280"
                >
                  {monthLabels[i]}
                </text>
                
                {/* New customer count */}
                <text
                  x={x + barWidth / 2}
                  y={height - padding.bottom + 40}
                  textAnchor="middle"
                  fontSize="11"
                  fill="#6b7280"
                >
                  {item.newCustomers} customers
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      
      <div className="mt-4 text-sm text-primary-700 bg-background p-3 rounded-md">
        <p>This chart shows the average revenue generated per new customer over the last 6 months. The percentage above each bar indicates the month-over-month change in average revenue per new customer.</p>
      </div>
    </div>
  );
};

export default NewCustomerRevenue;