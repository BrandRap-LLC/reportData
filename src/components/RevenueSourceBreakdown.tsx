import React from 'react';
import { ReportData } from '../data/reportData';

interface RevenueSourceBreakdownProps {
  data: ReportData[];
}

const RevenueSourceBreakdown: React.FC<RevenueSourceBreakdownProps> = ({ data }) => {
  // Find the maximum value to scale the chart
  const maxRevenue = Math.max(...data.map(item => item.totalRevenue));
  
  // Chart dimensions
  const height = 300;
  const width = 800;
  const padding = { top: 20, right: 30, bottom: 50, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  
  // Scale values to fit in the chart
  const scaleY = (value: number) => chartHeight - (value / maxRevenue) * chartHeight + padding.top;
  
  // Generate month labels
  const monthLabels = data.map(item => {
    const [month, year] = item.month.split(' ');
    return `${month.substring(0, 3)} ${year.substring(2)}`;
  });
  
  // Generate area paths
  const generateAreaPath = (metric: 'newCustomerRevenue' | 'returningCustomerRevenue', isStacked: boolean = false) => {
    const pointDistance = chartWidth / (data.length - 1);
    let path = '';
    
    // Forward path (top line)
    data.forEach((item, index) => {
      const x = index * pointDistance + padding.left;
      let y;
      
      if (isStacked && metric === 'returningCustomerRevenue') {
        y = scaleY(item.newCustomerRevenue + item.returningCustomerRevenue);
      } else if (isStacked && metric === 'newCustomerRevenue') {
        y = scaleY(item.newCustomerRevenue);
      } else {
        y = scaleY(item[metric]);
      }
      
      if (index === 0) {
        path += `M${x},${y}`;
      } else {
        path += ` L${x},${y}`;
      }
    });
    
    // Backward path (bottom line or x-axis)
    for (let i = data.length - 1; i >= 0; i--) {
      const x = i * pointDistance + padding.left;
      let y;
      
      if (isStacked && metric === 'returningCustomerRevenue') {
        y = scaleY(data[i].newCustomerRevenue);
      } else {
        y = height - padding.bottom;
      }
      
      path += ` L${x},${y}`;
    }
    
    path += ' Z';
    return path;
  };
  
  return (
    <div className="card mt-6">
      <h3 className="text-primary-600 font-medium mb-4">Revenue Source Breakdown</h3>
      
      <div className="overflow-x-auto">
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-label="Stacked area chart showing revenue breakdown between new and returning customers">
          {/* Y-axis grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const y = scaleY(maxRevenue * ratio);
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
                  ${Math.round(maxRevenue * (1 - ratio)).toLocaleString()}
                </text>
              </g>
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
          
          {/* Stacked Area */}
          <path
            d={generateAreaPath('returningCustomerRevenue', true)}
            fill="#C49C81"
            fillOpacity="0.7"
            aria-label="Returning customer revenue area"
          />
          <path
            d={generateAreaPath('newCustomerRevenue', true)}
            fill="#976751"
            fillOpacity="0.7"
            aria-label="New customer revenue area"
          />
        </svg>
      </div>
      
      <div className="flex flex-wrap justify-center mt-4 gap-6">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-primary-600 rounded-sm mr-2" aria-hidden="true"></div>
          <span className="text-sm text-primary-800">New Customer Revenue</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-secondary-DEFAULT rounded-sm mr-2" aria-hidden="true"></div>
          <span className="text-sm text-primary-800">Returning Customer Revenue</span>
        </div>
      </div>
      
      <div className="mt-4 text-sm text-primary-700 bg-background p-3 rounded-md">
        <p>This chart shows the breakdown of revenue between new and returning customers over time.</p>
      </div>
    </div>
  );
};

export default RevenueSourceBreakdown;