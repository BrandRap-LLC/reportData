import React, { useState } from 'react';
import { ReportData } from '../data/reportData';
import { Calendar } from 'lucide-react';

interface YearOverYearChartProps {
  data: ReportData[];
  metric: keyof ReportData;
  title: string;
  valuePrefix?: string;
  valueSuffix?: string;
}

const YearOverYearChart: React.FC<YearOverYearChartProps> = ({ 
  data, 
  metric, 
  title, 
  valuePrefix = '', 
  valueSuffix = '' 
}) => {
  const [showAllYears, setShowAllYears] = useState(false);
  
  // Group data by month (ignoring year)
  const groupedByMonth: Record<string, { month: string, values: Record<string, number> }> = {};
  const years = new Set<string>();
  
  data.forEach(item => {
    const [monthName, year] = item.month.split(' ');
    const shortMonth = monthName.substring(0, 3);
    
    if (!groupedByMonth[shortMonth]) {
      groupedByMonth[shortMonth] = { month: shortMonth, values: {} };
    }
    
    groupedByMonth[shortMonth].values[year] = item[metric] as number;
    years.add(year);
  });
  
  // Sort years
  const sortedYears = Array.from(years).sort();
  
  // Determine which years to display
  const displayYears = showAllYears ? sortedYears : sortedYears.slice(-2);
  
  // Sort months in chronological order
  const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const chartData = monthOrder
    .filter(month => groupedByMonth[month])
    .map(month => ({
      month,
      ...groupedByMonth[month].values
    }));
  
  // Chart dimensions
  const height = 300;
  const width = 800;
  const padding = { top: 20, right: 60, bottom: 50, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  
  // Find the maximum value to scale the chart
  const maxValue = Math.max(
    ...Object.values(groupedByMonth).flatMap(item => 
      Object.values(item.values)
    )
  ) * 1.1;
  
  // Generate the path for the line
  const generatePath = (year: string) => {
    const validMonths = chartData.filter(item => item[year] !== undefined);
    
    if (validMonths.length === 0) return '';
    
    const pointDistance = chartWidth / (monthOrder.length - 1);
    
    return validMonths.map((item, index) => {
      const monthIndex = monthOrder.indexOf(item.month);
      const x = monthIndex * pointDistance + padding.left;
      const y = padding.top + chartHeight * (1 - item[year] / maxValue);
      return index === 0 ? `M${x},${y}` : `L${x},${y}`;
    }).join(' ');
  };
  
  // Generate colors for years
  const getYearColor = (year: string, index: number) => {
    const isCurrentYear = year === sortedYears[sortedYears.length - 1];
    const isPreviousYear = year === sortedYears[sortedYears.length - 2];
    
    if (isCurrentYear) return '#976751';
    if (isPreviousYear) return '#C49C81';
    
    // For older years, use lighter browns
    const opacity = 0.7 - (sortedYears.length - 1 - index) * 0.15;
    return `rgba(151, 103, 81, ${Math.max(0.3, opacity)})`;
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-primary-600 font-medium flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-primary-600" />
          {title} - Year-over-Year
        </h3>
        
        {sortedYears.length > 2 && (
          <button
            onClick={() => setShowAllYears(!showAllYears)}
            className="px-3 py-1 text-sm bg-background hover:bg-secondary-color text-primary-800 rounded-md transition-colors"
          >
            {showAllYears ? 'Show Last 2 Years' : 'Show All Years'}
          </button>
        )}
      </div>
      
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
          
          {/* X-axis labels */}
          {monthOrder.map((month, i) => {
            const pointDistance = chartWidth / (monthOrder.length - 1);
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
                <text
                  x={x}
                  y={height - padding.bottom + 20}
                  textAnchor="middle"
                  fontSize="12"
                  fill="#6b7280"
                >
                  {month}
                </text>
              </g>
            );
          })}
          
          {/* Lines for each year */}
          {displayYears.map((year, index) => (
            <g key={year}>
              <path
                d={generatePath(year)}
                fill="none"
                stroke={getYearColor(year, index)}
                strokeWidth={year === sortedYears[sortedYears.length - 1] ? "3" : "2"}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              
              {/* Data points */}
              {chartData
                .filter(item => item[year] !== undefined)
                .map((item, i) => {
                  const monthIndex = monthOrder.indexOf(item.month);
                  const pointDistance = chartWidth / (monthOrder.length - 1);
                  const x = monthIndex * pointDistance + padding.left;
                  const y = padding.top + chartHeight * (1 - item[year] / maxValue);
                  
                  return (
                    <circle
                      key={i}
                      cx={x}
                      cy={y}
                      r={year === sortedYears[sortedYears.length - 1] ? "4" : "3"}
                      fill={getYearColor(year, index)}
                    />
                  );
                })}
            </g>
          ))}
        </svg>
      </div>
      
      <div className="flex flex-wrap justify-center mt-4 gap-4">
        {displayYears.map((year, index) => (
          <div key={year} className="flex items-center">
            <div 
              className="w-4 h-4 rounded-sm mr-2" 
              style={{ backgroundColor: getYearColor(year, index) }}
            ></div>
            <span className="text-sm">{year}</span>
          </div>
        ))}
      </div>
      
      <div className="mt-4 text-sm text-gray-600 bg-background p-3 rounded-md">
        <p>This chart compares {title.toLowerCase()} trends across different years to identify seasonal patterns and long-term growth or decline.</p>
      </div>
    </div>
  );
};

export default YearOverYearChart;