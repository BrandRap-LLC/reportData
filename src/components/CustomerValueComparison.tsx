import React from 'react';
import { ReportData, formatCurrency } from '../data/reportData';

interface CustomerValueComparisonProps {
  currentMonth: ReportData;
  previousMonth: ReportData;
}

const CustomerValueComparison: React.FC<CustomerValueComparisonProps> = ({ 
  currentMonth, 
  previousMonth 
}) => {
  // Calculate customer values
  const currentNewCustomerValue = currentMonth.newCustomerRevenue / currentMonth.newCustomers;
  const currentRetCustomerValue = currentMonth.returningCustomerRevenue / currentMonth.returningCustomers;
  
  const previousNewCustomerValue = previousMonth.newCustomerRevenue / previousMonth.newCustomers;
  const previousRetCustomerValue = previousMonth.returningCustomerRevenue / previousMonth.returningCustomers;
  
  // Calculate waterfall values
  const baseRevenue = currentMonth.newCustomers * currentNewCustomerValue;
  const additionalValue = (currentRetCustomerValue - currentNewCustomerValue) * currentMonth.returningCustomers;
  const totalRevenue = baseRevenue + additionalValue;
  
  // Find the maximum value for scaling
  const maxValue = Math.max(
    currentNewCustomerValue,
    currentRetCustomerValue,
    previousNewCustomerValue,
    previousRetCustomerValue
  );
  
  // Bar chart dimensions
  const barHeight = 40;
  const barGap = 20;
  const barWidth = 300;
  const labelWidth = 150;
  const valueWidth = 100;
  const chartWidth = labelWidth + barWidth + valueWidth;
  const chartHeight = (barHeight + barGap) * 4;
  
  // Waterfall chart dimensions
  const waterfallWidth = chartWidth;
  const waterfallHeight = 200;
  const waterfallBarWidth = 80;
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6">
      <h3 className="text-primary-600 font-medium mb-4">Customer Value Comparison</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h4 className="text-primary-700 text-sm font-medium mb-3">Average Value by Customer Type</h4>
          
          <svg width={chartWidth} height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
            {/* Current Month - New Customers */}
            <g>
              <text
                x="0"
                y={barHeight / 2}
                dominantBaseline="middle"
                fontSize="14"
                fill="#6b7280"
              >
                Current - New
              </text>
              <rect
                x={labelWidth}
                y="0"
                width={barWidth * (currentNewCustomerValue / maxValue)}
                height={barHeight}
                fill="#976751"
                rx="4"
              />
              <text
                x={labelWidth + barWidth * (currentNewCustomerValue / maxValue) + 10}
                y={barHeight / 2}
                dominantBaseline="middle"
                fontSize="14"
                fill="#6b7280"
              >
                {formatCurrency(currentNewCustomerValue)}
              </text>
            </g>
            
            {/* Current Month - Returning Customers */}
            <g transform={`translate(0, ${barHeight + barGap})`}>
              <text
                x="0"
                y={barHeight / 2}
                dominantBaseline="middle"
                fontSize="14"
                fill="#6b7280"
              >
                Current - Returning
              </text>
              <rect
                x={labelWidth}
                y="0"
                width={barWidth * (currentRetCustomerValue / maxValue)}
                height={barHeight}
                fill="#C49C81"
                rx="4"
              />
              <text
                x={labelWidth + barWidth * (currentRetCustomerValue / maxValue) + 10}
                y={barHeight / 2}
                dominantBaseline="middle"
                fontSize="14"
                fill="#6b7280"
              >
                {formatCurrency(currentRetCustomerValue)}
              </text>
            </g>
            
            {/* Previous Month - New Customers */}
            <g transform={`translate(0, ${(barHeight + barGap) * 2})`}>
              <text
                x="0"
                y={barHeight / 2}
                dominantBaseline="middle"
                fontSize="14"
                fill="#6b7280"
              >
                Previous - New
              </text>
              <rect
                x={labelWidth}
                y="0"
                width={barWidth * (previousNewCustomerValue / maxValue)}
                height={barHeight}
                fill="#976751"
                fillOpacity="0.5"
                rx="4"
              />
              <text
                x={labelWidth + barWidth * (previousNewCustomerValue / maxValue) + 10}
                y={barHeight / 2}
                dominantBaseline="middle"
                fontSize="14"
                fill="#6b7280"
              >
                {formatCurrency(previousNewCustomerValue)}
              </text>
            </g>
            
            {/* Previous Month - Returning Customers */}
            <g transform={`translate(0, ${(barHeight + barGap) * 3})`}>
              <text
                x="0"
                y={barHeight / 2}
                dominantBaseline="middle"
                fontSize="14"
                fill="#6b7280"
              >
                Previous - Returning
              </text>
              <rect
                x={labelWidth}
                y="0"
                width={barWidth * (previousRetCustomerValue / maxValue)}
                height={barHeight}
                fill="#C49C81"
                fillOpacity="0.5"
                rx="4"
              />
              <text
                x={labelWidth + barWidth * (previousRetCustomerValue / maxValue) + 10}
                y={barHeight / 2}
                dominantBaseline="middle"
                fontSize="14"
                fill="#6b7280"
              >
                {formatCurrency(previousRetCustomerValue)}
              </text>
            </g>
          </svg>
        </div>
        
        <div>
          <h4 className="text-primary-700 text-sm font-medium mb-3">Revenue Composition</h4>
          
          <svg width={waterfallWidth} height={waterfallHeight} viewBox={`0 0 ${waterfallWidth} ${waterfallHeight}`}>
            {/* Base Revenue */}
            <g>
              <rect
                x={waterfallWidth / 4 - waterfallBarWidth / 2}
                y={waterfallHeight - (baseRevenue / totalRevenue) * (waterfallHeight - 40)}
                width={waterfallBarWidth}
                height={(baseRevenue / totalRevenue) * (waterfallHeight - 40)}
                fill="#976751"
                rx="4"
              />
              <text
                x={waterfallWidth / 4}
                y={waterfallHeight - (baseRevenue / totalRevenue) * (waterfallHeight - 40) - 10}
                textAnchor="middle"
                fontSize="14"
                fill="#6b7280"
              >
                {formatCurrency(baseRevenue)}
              </text>
              <text
                x={waterfallWidth / 4}
                y={waterfallHeight + 20}
                textAnchor="middle"
                fontSize="14"
                fill="#6b7280"
              >
                Base Revenue
              </text>
            </g>
            
            {/* Additional Value */}
            <g>
              <rect
                x={waterfallWidth / 2 - waterfallBarWidth / 2}
                y={waterfallHeight - (totalRevenue / totalRevenue) * (waterfallHeight - 40) + (totalRevenue - additionalValue - baseRevenue) / totalRevenue * (waterfallHeight - 40)}
                width={waterfallBarWidth}
                height={(additionalValue / totalRevenue) * (waterfallHeight - 40)}
                fill="#C49C81"
                rx="4"
              />
              <text
                x={waterfallWidth / 2}
                y={waterfallHeight - (totalRevenue / totalRevenue) * (waterfallHeight - 40) - 10}
                textAnchor="middle"
                fontSize="14"
                fill="#6b7280"
              >
                +{formatCurrency(additionalValue)}
              </text>
              <text
                x={waterfallWidth / 2}
                y={waterfallHeight + 20}
                textAnchor="middle"
                fontSize="14"
                fill="#6b7280"
              >
                Returning Customer Value
              </text>
            </g>
            
            {/* Total Revenue */}
            <g>
              <rect
                x={3 * waterfallWidth / 4 - waterfallBarWidth / 2}
                y={waterfallHeight - (totalRevenue / totalRevenue) * (waterfallHeight - 40)}
                width={waterfallBarWidth}
                height={(totalRevenue / totalRevenue) * (waterfallHeight - 40)}
                fill="#7D5544"
                rx="4"
              />
              <text
                x={3 * waterfallWidth / 4}
                y={waterfallHeight - (totalRevenue / totalRevenue) * (waterfallHeight - 40) - 10}
                textAnchor="middle"
                fontSize="14"
                fill="#6b7280"
              >
                {formatCurrency(totalRevenue)}
              </text>
              <text
                x={3 * waterfallWidth / 4}
                y={waterfallHeight + 20}
                textAnchor="middle"
                fontSize="14"
                fill="#6b7280"
              >
                Total Revenue
              </text>
            </g>
            
            {/* Connecting lines */}
            <line
              x1={waterfallWidth / 4 + waterfallBarWidth / 2}
              y1={waterfallHeight - (baseRevenue / totalRevenue) * (waterfallHeight - 40)}
              x2={waterfallWidth / 2 - waterfallBarWidth / 2}
              y2={waterfallHeight - (baseRevenue / totalRevenue) * (waterfallHeight - 40)}
              stroke="#9ca3af"
              strokeWidth="1"
              strokeDasharray="4 2"
            />
            <line
              x1={waterfallWidth / 2 + waterfallBarWidth / 2}
              y1={waterfallHeight - (totalRevenue / totalRevenue) * (waterfallHeight - 40)}
              x2={3 * waterfallWidth / 4 - waterfallBarWidth / 2}
              y2={waterfallHeight - (totalRevenue / totalRevenue) * (waterfallHeight - 40)}
              stroke="#9ca3af"
              strokeWidth="1"
              strokeDasharray="4 2"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default CustomerValueComparison;