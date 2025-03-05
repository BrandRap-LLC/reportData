import React from 'react';
import { ReportData, getQuarterlyData } from '../data/reportData';

interface QuarterlyComparisonProps {
  data: ReportData[];
}

const QuarterlyComparison: React.FC<QuarterlyComparisonProps> = ({ data }) => {
  // Get quarterly data
  const quarterlyData = getQuarterlyData(data);
  
  // Chart dimensions
  const height = 300;
  const width = 800;
  const padding = { top: 20, right: 60, bottom: 50, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  
  // Find maximum values for scaling
  const maxRevenue = Math.max(...quarterlyData.map(q => q.avgMonthlyRevenue));
  const maxCustomers = Math.max(...quarterlyData.map(q => q.avgMonthlyNewCustomers));
  
  // Scale values to fit in the chart
  const scaleYRevenue = (value: number) => chartHeight - (value / maxRevenue) * chartHeight + padding.top;
  const scaleYCustomers = (value: number) => chartHeight - (value / maxCustomers) * chartHeight + padding.top;
  
  // Bar width calculations
  const groupWidth = chartWidth / quarterlyData.length;
  const barWidth = groupWidth * 0.4;
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6">
      <h3 className="text-primary-600 font-medium mb-4">Quarterly Comparison</h3>
      
      <div className="overflow-x-auto">
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
          {/* Y-axis grid lines - Revenue */}
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
                  ${Math.round(maxRevenue * (1 - ratio)).toLocaleString()}
                </text>
              </g>
            );
          })}
          
          {/* Y-axis grid lines - Customers */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const y = chartHeight * ratio + padding.top;
            return (
              <text
                key={`cust-${i}`}
                x={width - padding.right + 10}
                y={y}
                textAnchor="start"
                dominantBaseline="middle"
                fontSize="12"
                fill="#976751"
              >
                {Math.round(maxCustomers * (1 - ratio))}
              </text>
            );
          })}
          
          {/* Bars */}
          {quarterlyData.map((quarter, i) => {
            const x = i * groupWidth + padding.left;
            
            return (
              <g key={i}>
                {/* Revenue Bar */}
                <rect
                  x={x + (groupWidth - 2 * barWidth) / 2}
                  y={scaleYRevenue(quarter.avgMonthlyRevenue)}
                  width={barWidth}
                  height={chartHeight + padding.top - scaleYRevenue(quarter.avgMonthlyRevenue)}
                  fill="#976751"
                  rx="4"
                />
                
                {/* New Customers Bar */}
                <rect
                  x={x + (groupWidth - 2 * barWidth) / 2 + barWidth}
                  y={scaleYCustomers(quarter.avgMonthlyNewCustomers)}
                  width={barWidth}
                  height={chartHeight + padding.top - scaleYCustomers(quarter.avgMonthlyNewCustomers)}
                  fill="#C49C81"
                  rx="4"
                />
                
                {/* Quarter Label */}
                <text
                  x={x + groupWidth / 2}
                  y={height - padding.bottom + 20}
                  textAnchor="middle"
                  fontSize="12"
                  fill="#6b7280"
                >
                  {quarter.quarter}
                  {quarter.months < 3 ? '*' : ''}
                </text>
                
                {/* Data Labels */}
                <text
                  x={x + (groupWidth - 2 * barWidth) / 2 + barWidth / 2}
                  y={scaleYRevenue(quarter.avgMonthlyRevenue) - 5}
                  textAnchor="middle"
                  fontSize="10"
                  fill="#976751"
                >
                  ${Math.round(quarter.avgMonthlyRevenue / 1000)}k
                </text>
                
                <text
                  x={x + (groupWidth - 2 * barWidth) / 2 + barWidth * 1.5}
                  y={scaleYCustomers(quarter.avgMonthlyNewCustomers) - 5}
                  textAnchor="middle"
                  fontSize="10"
                  fill="#C49C81"
                >
                  {Math.round(quarter.avgMonthlyNewCustomers)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      
      <div className="flex justify-center mt-4 space-x-6">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-primary-600 rounded-sm mr-2"></div>
          <span className="text-sm text-primary-800">Avg Monthly Revenue</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-secondary-DEFAULT rounded-sm mr-2"></div>
          <span className="text-sm text-primary-800">Avg Monthly New Customers</span>
        </div>
      </div>
      
      {quarterlyData.some(q => q.months < 3) && (
        <p className="text-xs text-primary-700 mt-2 text-center">* Partial quarter based on available data</p>
      )}
    </div>
  );
};

export default QuarterlyComparison;