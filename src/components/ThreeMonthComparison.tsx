import React from 'react';
import { ReportData, calculateThreeMonthAverage, getThreeMonthChangePercentage, getThreeMonthYoYChangePercentage, formatCurrency } from '../data/reportData';
import { TrendingUp, TrendingDown, Calendar } from 'lucide-react';

interface ThreeMonthComparisonProps {
  data: ReportData[];
  title: string;
  metric: keyof ReportData;
  valuePrefix?: string;
  valueSuffix?: string;
  formatValue?: (value: number) => string;
}

const ThreeMonthComparison: React.FC<ThreeMonthComparisonProps> = ({ 
  data, 
  title, 
  metric, 
  valuePrefix = '', 
  valueSuffix = '',
  formatValue
}) => {
  // Calculate current 3-month average
  const current3MonthAvg = calculateThreeMonthAverage(data, metric);
  
  // Calculate previous 3-month average
  const previous3MonthAvg = calculateThreeMonthAverage(data, metric, data.length - 4);
  
  // Calculate same 3 months last year average (if available)
  const hasYoYData = data.length > 15;
  const lastYear3MonthAvg = hasYoYData ? 
    calculateThreeMonthAverage(data, metric, data.length - 13) : 0;
  
  // Calculate percentage changes
  const vs3MonthChange = getThreeMonthChangePercentage(data, metric);
  const vsYoYChange = hasYoYData ? getThreeMonthYoYChangePercentage(data, metric) : 0;
  
  // Format values
  const formatDisplayValue = (value: number) => {
    if (formatValue) return formatValue(value);
    if (typeof value === 'number') {
      if (metric === 'totalRevenue' || metric === 'newCustomerRevenue' || metric === 'returningCustomerRevenue' || metric === 'averageRevenuePerCustomer') {
        return formatCurrency(value);
      }
      return value.toFixed(0);
    }
    return String(value);
  };
  
  // Get month names for periods
  const getMonthName = (index: number) => {
    if (index < 0 || index >= data.length) return '';
    return data[index].month.split(' ')[0].substring(0, 3);
  };
  
  const current3MonthsLabel = `${getMonthName(data.length - 3)} - ${getMonthName(data.length - 1)}`;
  const previous3MonthsLabel = `${getMonthName(data.length - 6)} - ${getMonthName(data.length - 4)}`;
  const lastYear3MonthsLabel = hasYoYData ? 
    `${getMonthName(data.length - 15)} - ${getMonthName(data.length - 13)}` : '';
  
  // Chart dimensions
  const height = 300;
  const width = 600;
  const padding = { top: 40, right: 30, bottom: 70, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  
  // Find the maximum value for scaling
  const maxValue = Math.max(current3MonthAvg, previous3MonthAvg, lastYear3MonthAvg) * 1.2;
  
  // Bar width calculations
  const barWidth = 80;
  const barGap = 20;
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6 featured">
      <h3 className="text-primary-600 font-medium mb-4 flex items-center">
        <Calendar className="w-5 h-5 mr-2" />
        {title} - 3-Month Comparison
      </h3>
      
      <div className="overflow-x-auto">
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
          {/* Y-axis grid lines */}
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
                  {valuePrefix}{Math.round(maxValue * ratio).toLocaleString()}{valueSuffix}
                </text>
              </g>
            );
          })}
          
          {/* Bars */}
          {/* Current 3 Months */}
          <g>
            <rect
              x={padding.left + (chartWidth - 3 * barWidth - 2 * barGap) / 2}
              y={padding.top + chartHeight * (1 - current3MonthAvg / maxValue)}
              width={barWidth}
              height={chartHeight * (current3MonthAvg / maxValue)}
              fill="#976751"
              rx="4"
            />
            <text
              x={padding.left + (chartWidth - 3 * barWidth - 2 * barGap) / 2 + barWidth / 2}
              y={padding.top + chartHeight * (1 - current3MonthAvg / maxValue) - 10}
              textAnchor="middle"
              fontSize="12"
              fontWeight="bold"
              fill="#976751"
            >
              {formatDisplayValue(current3MonthAvg)}
            </text>
            <text
              x={padding.left + (chartWidth - 3 * barWidth - 2 * barGap) / 2 + barWidth / 2}
              y={height - padding.bottom + 20}
              textAnchor="middle"
              fontSize="12"
              fill="#6b7280"
            >
              Current
            </text>
            <text
              x={padding.left + (chartWidth - 3 * barWidth - 2 * barGap) / 2 + barWidth / 2}
              y={height - padding.bottom + 40}
              textAnchor="middle"
              fontSize="10"
              fill="#6b7280"
            >
              {current3MonthsLabel}
            </text>
          </g>
          
          {/* Previous 3 Months */}
          <g>
            <rect
              x={padding.left + (chartWidth - 3 * barWidth - 2 * barGap) / 2 + barWidth + barGap}
              y={padding.top + chartHeight * (1 - previous3MonthAvg / maxValue)}
              width={barWidth}
              height={chartHeight * (previous3MonthAvg / maxValue)}
              fill="#C49C81"
              rx="4"
            />
            <text
              x={padding.left + (chartWidth - 3 * barWidth - 2 * barGap) / 2 + barWidth + barGap + barWidth / 2}
              y={padding.top + chartHeight * (1 - previous3MonthAvg / maxValue) - 10}
              textAnchor="middle"
              fontSize="12"
              fontWeight="bold"
              fill="#C49C81"
            >
              {formatDisplayValue(previous3MonthAvg)}
            </text>
            <text
              x={padding.left + (chartWidth - 3 * barWidth - 2 * barGap) / 2 + barWidth + barGap + barWidth / 2}
              y={height - padding.bottom + 20}
              textAnchor="middle"
              fontSize="12"
              fill="#6b7280"
            >
              Previous
            </text>
            <text
              x={padding.left + (chartWidth - 3 * barWidth - 2 * barGap) / 2 + barWidth + barGap + barWidth / 2}
              y={height - padding.bottom + 40}
              textAnchor="middle"
              fontSize="10"
              fill="#6b7280"
            >
              {previous3MonthsLabel}
            </text>
          </g>
          
          {/* Last Year 3 Months */}
          {hasYoYData && (
            <g>
              <rect
                x={padding.left + (chartWidth - 3 * barWidth - 2 * barGap) / 2 + 2 * barWidth + 2 * barGap}
                y={padding.top + chartHeight * (1 - lastYear3MonthAvg / maxValue)}
                width={barWidth}
                height={chartHeight * (lastYear3MonthAvg / maxValue)}
                fill="#EDD7C8"
                rx="4"
              />
              <text
                x={padding.left + (chartWidth - 3 * barWidth - 2 * barGap) / 2 + 2 * barWidth + 2 * barGap + barWidth / 2}
                y={padding.top + chartHeight * (1 - lastYear3MonthAvg / maxValue) - 10}
                textAnchor="middle"
                fontSize="12"
                fontWeight="bold"
                fill="#A57B63"
              >
                {formatDisplayValue(lastYear3MonthAvg)}
              </text>
              <text
                x={padding.left + (chartWidth - 3 * barWidth - 2 * barGap) / 2 + 2 * barWidth + 2 * barGap + barWidth / 2}
                y={height - padding.bottom + 20}
                textAnchor="middle"
                fontSize="12"
                fill="#6b7280"
              >
                Last Year
              </text>
              <text
                x={padding.left + (chartWidth - 3 * barWidth - 2 * barGap) / 2 + 2 * barWidth + 2 * barGap + barWidth / 2}
                y={height - padding.bottom + 40}
                textAnchor="middle"
                fontSize="10"
                fill="#6b7280"
              >
                {lastYear3MonthsLabel}
              </text>
            </g>
          )}
        </svg>
      </div>
      
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={`p-4 rounded-lg ${vs3MonthChange >= 0 ? 'bg-green-50 border border-green-100' : 'bg-red-50 border border-red-100'}`}>
          <h4 className="text-primary-800 font-medium flex items-center mb-2">
            {vs3MonthChange >= 0 ? (
              <TrendingUp className="w-4 h-4 mr-2 text-positive" />
            ) : (
              <TrendingDown className="w-4 h-4 mr-2 text-negative" />
            )}
            vs Previous 3 Months
          </h4>
          <p className={`text-lg font-bold ${vs3MonthChange >= 0 ? 'text-positive' : 'text-negative'}`}>
            {vs3MonthChange >= 0 ? '+' : ''}{vs3MonthChange.toFixed(1)}%
          </p>
          <p className="text-sm text-gray-600 mt-1">
            {vs3MonthChange >= 0 ? 'Improvement' : 'Decline'} from {previous3MonthsLabel} average
          </p>
        </div>
        
        {hasYoYData && (
          <div className={`p-4 rounded-lg ${vsYoYChange >= 0 ? 'bg-green-50 border border-green-100' : 'bg-red-50 border border-red-100'}`}>
            <h4 className="text-primary-800 font-medium flex items-center mb-2">
              {vsYoYChange >= 0 ? (
                <TrendingUp className="w-4 h-4 mr-2 text-positive" />
              ) : (
                <TrendingDown className="w-4 h-4 mr-2 text-negative" />
              )}
              vs Same Period Last Year
            </h4>
            <p className={`text-lg font-bold ${vsYoYChange >= 0 ? 'text-positive' : 'text-negative'}`}>
              {vsYoYChange >= 0 ? '+' : ''}{vsYoYChange.toFixed(1)}%
            </p>
            <p className="text-sm text-gray-600 mt-1">
              {vsYoYChange >= 0 ? 'Growth' : 'Decline'} from same period last year
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThreeMonthComparison;