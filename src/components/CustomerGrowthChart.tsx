import React, { useState } from 'react';
import { ReportData } from '../data/reportData';

interface CustomerGrowthChartProps {
  data: ReportData[];
}

const CustomerGrowthChart: React.FC<CustomerGrowthChartProps> = ({ data }) => {
  const [visibleSeries, setVisibleSeries] = useState({
    totalCustomers: true,
    newCustomers: true,
    returningCustomers: true
  });
  
  // Toggle series visibility
  const toggleSeries = (series: keyof typeof visibleSeries) => {
    setVisibleSeries(prev => ({
      ...prev,
      [series]: !prev[series]
    }));
  };
  
  // Find the maximum value to scale the chart
  const maxValue = Math.max(
    ...data.map(item => visibleSeries.totalCustomers ? item.totalCustomers : 0),
    ...data.map(item => visibleSeries.newCustomers ? item.newCustomers : 0),
    ...data.map(item => visibleSeries.returningCustomers ? item.returningCustomers : 0)
  );
  
  // Chart dimensions
  const height = 300;
  const width = 800;
  const padding = { top: 20, right: 30, bottom: 50, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  
  // Scale values to fit in the chart
  const scaleY = (value: number) => chartHeight - (value / maxValue) * chartHeight + padding.top;
  
  // Generate points for the line
  const generatePoints = (metric: keyof ReportData) => {
    const pointDistance = chartWidth / (data.length - 1);
    
    return data.map((item, index) => {
      const x = index * pointDistance + padding.left;
      const y = scaleY(item[metric] as number);
      return `${x},${y}`;
    }).join(' ');
  };
  
  // Generate the path for the line
  const generatePath = (metric: keyof ReportData) => {
    const pointDistance = chartWidth / (data.length - 1);
    
    return data.map((item, index) => {
      const x = index * pointDistance + padding.left;
      const y = scaleY(item[metric] as number);
      return index === 0 ? `M${x},${y}` : `L${x},${y}`;
    }).join(' ');
  };
  
  // Generate month labels
  const monthLabels = data.map(item => {
    const [month, year] = item.month.split(' ');
    return `${month.substring(0, 3)} ${year.substring(2)}`;
  });
  
  return (
    <div className="card mt-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <h3 className="text-primary-600 font-medium mb-2 sm:mb-0">Customer Growth Trends</h3>
        
        <div className="flex flex-wrap gap-3">
          <button 
            className={`flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors ${visibleSeries.totalCustomers ? 'bg-primary-700 text-white' : 'bg-background text-primary-700'}`}
            onClick={() => toggleSeries('totalCustomers')}
            aria-pressed={visibleSeries.totalCustomers}
          >
            <div className="w-3 h-3 bg-white rounded-sm mr-2"></div>
            <span>Total</span>
          </button>
          <button 
            className={`flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors ${visibleSeries.newCustomers ? 'bg-primary-600 text-white' : 'bg-background text-primary-700'}`}
            onClick={() => toggleSeries('newCustomers')}
            aria-pressed={visibleSeries.newCustomers}
          >
            <div className="w-3 h-3 bg-white rounded-sm mr-2"></div>
            <span>New</span>
          </button>
          <button 
            className={`flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors ${visibleSeries.returningCustomers ? 'bg-secondary-DEFAULT text-white' : 'bg-background text-primary-700'}`}
            onClick={() => toggleSeries('returningCustomers')}
            aria-pressed={visibleSeries.returningCustomers}
          >
            <div className="w-3 h-3 bg-white rounded-sm mr-2"></div>
            <span>Returning</span>
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-label="Line chart showing customer growth trends over time">
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
          
          {/* Lines */}
          {visibleSeries.returningCustomers && (
            <path
              d={generatePath('returningCustomers')}
              fill="none"
              stroke="#C49C81"
              strokeWidth="2"
              aria-label="Returning customers trend line"
            />
          )}
          
          {visibleSeries.newCustomers && (
            <path
              d={generatePath('newCustomers')}
              fill="none"
              stroke="#976751"
              strokeWidth="2"
              aria-label="New customers trend line"
            />
          )}
          
          {visibleSeries.totalCustomers && (
            <path
              d={generatePath('totalCustomers')}
              fill="none"
              stroke="#7D5544"
              strokeWidth="3"
              aria-label="Total customers trend line"
            />
          )}
          
          {/* Data points */}
          {data.map((item, i) => {
            const pointDistance = chartWidth / (data.length - 1);
            const x = i * pointDistance + padding.left;
            
            return (
              <g key={i}>
                {visibleSeries.returningCustomers && (
                  <circle
                    cx={x}
                    cy={scaleY(item.returningCustomers)}
                    r="4"
                    fill="#C49C81"
                    aria-hidden="true"
                  />
                )}
                
                {visibleSeries.newCustomers && (
                  <circle
                    cx={x}
                    cy={scaleY(item.newCustomers)}
                    r="4"
                    fill="#976751"
                    aria-hidden="true"
                  />
                )}
                
                {visibleSeries.totalCustomers && (
                  <circle
                    cx={x}
                    cy={scaleY(item.totalCustomers)}
                    r="5"
                    fill="#7D5544"
                    aria-hidden="true"
                  />
                )}
              </g>
            );
          })}
        </svg>
      </div>
      
      <div className="flex flex-wrap justify-center mt-4 gap-6">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-primary-700 rounded-sm mr-2" aria-hidden="true"></div>
          <span className="text-sm text-primary-800">Total Customers</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-primary-600 rounded-sm mr-2" aria-hidden="true"></div>
          <span className="text-sm text-primary-800">New Customers</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-secondary-DEFAULT rounded-sm mr-2" aria-hidden="true"></div>
          <span className="text-sm text-primary-800">Returning Customers</span>
        </div>
      </div>
      
      <div className="mt-4 text-sm text-primary-700 bg-background p-3 rounded-md">
        <p className="mb-0">Click on the legend buttons above to toggle visibility of each data series.</p>
      </div>
    </div>
  );
};

export default CustomerGrowthChart;