import React from 'react';
import { ReportData } from '../data/reportData';

interface NewCustomerTrendProps {
  data: ReportData[];
}

const NewCustomerTrend: React.FC<NewCustomerTrendProps> = ({ data }) => {
  // Calculate 3-month moving average
  const movingAverage = data.map((item, index) => {
    if (index < 2) return item.newCustomers;
    
    const sum = data[index].newCustomers + 
                data[index - 1].newCustomers + 
                data[index - 2].newCustomers;
    return sum / 3;
  });
  
  // Find year-over-year data if available
  const hasYoYData = data.length > 12;
  const yoyData = hasYoYData ? 
    data.slice(0, data.length - 12).map(item => item.newCustomers) : 
    [];
  
  // Define target threshold for highlighting
  const targetThreshold = 120; // Example target
  
  // Chart dimensions
  const height = 300;
  const width = 800;
  const padding = { top: 20, right: 30, bottom: 50, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  
  // Find the maximum value to scale the chart
  const maxValue = Math.max(
    ...data.map(item => item.newCustomers),
    ...movingAverage,
    ...yoyData,
    targetThreshold
  );
  
  // Scale values to fit in the chart
  const scaleY = (value: number) => chartHeight - (value / maxValue) * chartHeight + padding.top;
  
  // Generate the path for the line
  const generatePath = (values: number[]) => {
    const pointDistance = chartWidth / (values.length - 1);
    
    return values.map((value, index) => {
      const x = index * pointDistance + padding.left;
      const y = scaleY(value);
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
      <h3 className="text-primary-600 font-medium mb-4">New Customer Trend</h3>
      
      <div className="overflow-x-auto">
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-label="Line chart showing new customer acquisition trends over time">
          {/* Y-axis grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const y = scaleY(maxValue * ratio);
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
                  {Math.round(maxValue * (1 - ratio))}
                </text>
              </g>
            );
          })}
          
          {/* Target reference line */}
          <line
            x1={padding.left}
            y1={scaleY(targetThreshold)}
            x2={width - padding.right}
            y2={scaleY(targetThreshold)}
            stroke="#9ca3af"
            strokeWidth="1"
            strokeDasharray="4 2"
            aria-hidden="true"
          />
          <text
            x={width - padding.right + 5}
            y={scaleY(targetThreshold)}
            dominantBaseline="middle"
            fontSize="12"
            fill="#9ca3af"
            aria-hidden="true"
          >
            Target: {targetThreshold}
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
                  aria-hidden="true"
                />
                {i % 2 === 0 && (
                  <text
                    x={x}
                    y={height - padding.bottom + 20}
                    textAnchor="middle"
                    fontSize="12"
                    fill="#6b7280"
                    aria-hidden="true"
                  >
                    {monthLabels[i]}
                  </text>
                )}
              </g>
            );
          })}
          
          {/* Year-over-year line */}
          {hasYoYData && (
            <path
              d={generatePath(yoyData)}
              fill="none"
              stroke="#C49C81"
              strokeWidth="2"
              strokeDasharray="4 2"
              aria-label="Previous year trend line"
            />
          )}
          
          {/* Moving Average line */}
          <path
            d={generatePath(movingAverage)}
            fill="none"
            stroke="#976751"
            strokeWidth="2"
            strokeDasharray="4 2"
            aria-label="3-month moving average trend line"
          />
          
          {/* Main line */}
          <path
            d={generatePath(data.map(item => item.newCustomers))}
            fill="none"
            stroke="#976751"
            strokeWidth="3"
            aria-label="New customers trend line"
          />
          
          {/* Data points */}
          {data.map((item, i) => {
            const pointDistance = chartWidth / (data.length - 1);
            const x = i * pointDistance + padding.left;
            const y = scaleY(item.newCustomers);
            const aboveTarget = item.newCustomers > targetThreshold;
            
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="5"
                fill={aboveTarget ? "#7D5544" : "#976751"}
                stroke={aboveTarget ? "#7D5544" : "#976751"}
                strokeWidth="2"
                aria-hidden="true"
              />
            );
          })}
        </svg>
      </div>
      
      <div className="flex justify-center mt-4 space-x-6">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-primary-600 rounded-sm mr-2" aria-hidden="true"></div>
          <span className="text-sm text-primary-800">New Customers</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-primary-600 rounded-sm mr-2 opacity-50" aria-hidden="true"></div>
          <span className="text-sm text-primary-800">3-Month Moving Average</span>
        </div>
        {hasYoYData && (
          <div className="flex items-center">
            <div className="w-4 h-4 bg-secondary-DEFAULT rounded-sm mr-2" aria-hidden="true"></div>
            <span className="text-sm text-primary-800">Previous Year</span>
          </div>
        )}
        <div className="flex items-center">
          <div className="w-4 h-4 bg-positive rounded-sm mr-2" aria-hidden="true"></div>
          <span className="text-sm text-primary-800">Above Target</span>
        </div>
      </div>
      
      <div className="mt-4 text-sm text-primary-700 bg-background p-3 rounded-md">
        <p>This chart shows the trend of new customer acquisition over time. Points highlighted in darker brown indicate months where new customer acquisition exceeded the target threshold.</p>
      </div>
    </div>
  );
};

export default NewCustomerTrend;